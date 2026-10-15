import type { Context, Config } from "@netlify/functions";
import fs from "fs/promises";
import path from "path";

// Load MCP index
let mcpIndex: any = null;
async function getMcpIndex() {
  if (!mcpIndex) {
    const indexPath = path.join(process.cwd(), "generated/mcp-index.json");
    const content = await fs.readFile(indexPath, "utf-8");
    mcpIndex = JSON.parse(content);
  }
  return mcpIndex;
}

// Guides: the skills/ folder served over MCP (replaces downloading skill zips)
const SKILLS_DIR = path.join(process.cwd(), "skills");
let guideCache: { name: string; description: string; files: string[] }[] | null = null;
async function listFiles(dir: string, prefix = ""): Promise<string[]> {
  const out: string[] = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await listFiles(path.join(dir, e.name), rel)));
    else if (rel !== "SKILL.md") out.push(rel);
  }
  return out;
}
async function getGuides() {
  if (!guideCache) {
    const guides = [];
    for (const e of await fs.readdir(SKILLS_DIR, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      try {
        const md = await fs.readFile(path.join(SKILLS_DIR, e.name, "SKILL.md"), "utf-8");
        const desc = (/^description:\s*(.+)$/m.exec(md) || [])[1] || "";
        guides.push({ name: e.name, description: desc.trim(), files: await listFiles(path.join(SKILLS_DIR, e.name)) });
      } catch { /* folder without SKILL.md */ }
    }
    guideCache = guides;
  }
  return guideCache;
}
async function readGuide(name: string, file?: string) {
  const guides = await getGuides();
  const guide = guides.find((g) => g.name === name);
  if (!guide) return `Unknown guide: ${name}. Available: ${guides.map((g) => g.name).join(", ")}`;
  const rel = file || "SKILL.md";
  if (rel !== "SKILL.md" && !guide.files.includes(rel)) {
    return `Unknown file ${rel} in ${name}. Files: ${guide.files.join(", ") || "(none)"}`;
  }
  const text = await fs.readFile(path.join(SKILLS_DIR, name, rel), "utf-8");
  if (rel !== "SKILL.md" || !guide.files.length) return text;
  return `${text}\n\n---\nMore files in this guide (read with get_guide, file=...): ${guide.files.join(", ")}`;
}
async function serverInstructions() {
  const guides = await getGuides();
  return [
    "SaleSys MCP: read and change data in the user's SaleSys account (Swedish sales and telephony platform).",
    "Before building or changing anything (views, webhooks, work templates, web forms, agreements, exports, statistics, users, chat),",
    "call get_guide for the matching guide below and follow it. Guides are the source of truth for SaleSys conventions and best practices;",
    "read the extra files they list (reference/..., examples/...) when the task needs them.",
    "Reads run directly. Data-changing calls (POST/PUT/PATCH/DELETE) need confirm=true: always show the user what will change and get their OK first.",
    "Answer in the user's language (usually Swedish).",
    "",
    "Guides:",
    ...guides.map((g) => `- ${g.name}: ${g.description}`),
  ].join("\n");
}

// Service discovery
async function discoverService(serviceName: string, token: string) {
  try {
    const response = await fetch(
      `https://app.salesys.se/api/${serviceName}/service-v1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to discover service ${serviceName}:`, error);
    return null;
  }
}

// MCP Tools
const TOOLS = [
  {
    name: "list_services",
    description: "List all available SaleSys API services with descriptions",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "discover_service",
    description: "Discover available endpoints for a specific service by querying the live API",
    inputSchema: {
      type: "object",
      properties: {
        service: {
          type: "string",
          description: "Service name (e.g. users, orders, offers, dial, contacts, calendar, products, events)",
        },
      },
      required: ["service"],
    },
  },
  {
    name: "list_endpoints",
    description: "List available API endpoints, optionally filtered by service or tag",
    inputSchema: {
      type: "object",
      properties: {
        service: {
          type: "string",
          description: "Filter by service name",
        },
        tag: {
          type: "string",
          description: "Filter by tag (e.g. Users, Orders, Contacts)",
        },
        method: {
          type: "string",
          enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          description: "Filter by HTTP method",
        },
      },
    },
  },
  {
    name: "describe_endpoint",
    description: "Get detailed information about a specific API endpoint including parameters, request body, and responses",
    inputSchema: {
      type: "object",
      properties: {
        method: {
          type: "string",
          enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          description: "HTTP method",
        },
        path: {
          type: "string",
          description: "Endpoint path (e.g. /api/contacts/contacts-v1)",
        },
      },
      required: ["method", "path"],
    },
  },
  {
    name: "call_api",
    description: "Call a SaleSys API endpoint. Mutating operations (POST, PUT, PATCH, DELETE) require confirmation.",
    inputSchema: {
      type: "object",
      properties: {
        method: {
          type: "string",
          enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
          description: "HTTP method",
        },
        path: {
          type: "string",
          description: "Full endpoint path (e.g. /api/contacts/contacts-v1)",
        },
        body: {
          type: "object",
          description: "Request body for POST/PUT/PATCH",
        },
        query: {
          type: "object",
          description: "Query parameters",
        },
        confirm: {
          type: "boolean",
          description: "Confirmation flag required for mutating operations",
        },
      },
      required: ["method", "path"],
    },
  },
  {
    name: "get_guide",
    description: "Read a SaleSys guide (how-to and best practices for views, webhooks, work templates, web forms, agreements, statistics, users, export, chat). Call before building anything. Without file it returns the guide's main text plus a list of its extra files.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Guide name, e.g. salesys-custom-views (see server instructions for the list)" },
        file: { type: "string", description: "Optional extra file inside the guide, e.g. reference/best-practices.md" },
      },
      required: ["name"],
    },
  },
  {
    name: "search_docs",
    description: "Search SaleSys documentation articles",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
        language: {
          type: "string",
          enum: ["en", "sv"],
          description: "Language filter (default: both)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "read_doc",
    description: "Read a specific documentation article",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Document ID (e.g. getting-started, orders, contacts)",
        },
        language: {
          type: "string",
          enum: ["en", "sv"],
          description: "Language (default: en)",
        },
      },
      required: ["id"],
    },
  },
];

// Handle MCP requests
async function handleMcpRequest(request: any, token: string | null) {
  const { method, params } = request;
  
  switch (method) {
    case "initialize":
      return {
        protocolVersion: params?.protocolVersion || "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "salesys", version: "1.0.0" },
        instructions: await serverInstructions(),
      };

    case "ping":
      return {};

    case "tools/list":
      return {
        tools: TOOLS,
      };
    
    case "tools/call": {
      const { name, arguments: args = {} } = params;

      if (name === "get_guide") {
        return { content: [{ type: "text", text: await readGuide(args.name, args.file) }] };
      }

      const needsToken = !["search_docs", "read_doc"].includes(name);
      if (needsToken && !token) {
        return {
          content: [
            {
              type: "text",
              text: "Error: No authentication token provided. Pass your SaleSys API token via the Authorization header or session parameter.",
            },
          ],
          isError: true,
        };
      }
      
      switch (name) {
        case "list_services": {
          const index = await getMcpIndex();
          const services = index.services.map((s: any) => ({
            name: s.name,
            description: s.description,
            discoveryUrl: `https://app.salesys.se/api/${s.name}/service-v1`,
            tags: s.tags,
          }));
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(services, null, 2),
              },
            ],
          };
        }
        
        case "discover_service": {
          const { service } = args;
          const discovered = await discoverService(service, token);
          
          if (!discovered) {
            return {
              content: [
                {
                  type: "text",
                  text: `Service '${service}' not found or not accessible`,
                },
              ],
              isError: true,
            };
          }
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(discovered, null, 2),
              },
            ],
          };
        }
        
        case "list_endpoints": {
          const index = await getMcpIndex();
          let endpoints = index.endpoints;
          
          if (args.service) {
            endpoints = endpoints.filter((e: any) =>
              e.path.includes(`/api/${args.service}/`)
            );
          }
          
          if (args.tag) {
            endpoints = endpoints.filter((e: any) =>
              e.tags.includes(args.tag)
            );
          }
          
          if (args.method) {
            endpoints = endpoints.filter((e: any) =>
              e.method === args.method.toUpperCase()
            );
          }
          
          const formatted = endpoints.map((e: any) => ({
            method: e.method,
            path: e.path,
            summary: e.summary,
            tags: e.tags,
          }));
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(formatted, null, 2),
              },
            ],
          };
        }
        
        case "describe_endpoint": {
          const index = await getMcpIndex();
          const endpoint = index.endpoints.find(
            (e: any) =>
              e.method === args.method.toUpperCase() &&
              e.path === args.path
          );
          
          if (!endpoint) {
            return {
              content: [
                {
                  type: "text",
                  text: `Endpoint not found: ${args.method} ${args.path}`,
                },
              ],
              isError: true,
            };
          }
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(endpoint, null, 2),
              },
            ],
          };
        }
        
        case "call_api": {
          const { method, path, body, query, confirm } = args;
          
          // Check for mutating operations
          const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(
            method.toUpperCase()
          );
          
          if (isMutating && !confirm) {
            return {
              content: [
                {
                  type: "text",
                  text: `⚠️  This is a mutating operation (${method}). Set "confirm": true to proceed.\n\nEndpoint: ${path}\nMethod: ${method}${body ? '\nBody: ' + JSON.stringify(body, null, 2) : ''}`,
                },
              ],
              isError: false,
            };
          }
          
          // Build URL
          const url = new URL(path, "https://app.salesys.se");
          if (query) {
            Object.entries(query).forEach(([key, value]) => {
              url.searchParams.set(key, String(value));
            });
          }
          
          // Make request
          try {
            const response = await fetch(url.toString(), {
              method: method.toUpperCase(),
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: body ? JSON.stringify(body) : undefined,
            });
            
            const responseText = await response.text();
            let responseData;
            
            try {
              responseData = JSON.parse(responseText);
            } catch {
              responseData = responseText;
            }
            
            if (!response.ok) {
              return {
                content: [
                  {
                    type: "text",
                    text: `API Error (${response.status} ${response.statusText}):\n${JSON.stringify(responseData, null, 2)}`,
                  },
                ],
                isError: true,
              };
            }
            
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(responseData, null, 2),
                },
              ],
            };
          } catch (error: any) {
            return {
              content: [
                {
                  type: "text",
                  text: `Request failed: ${error.message}`,
                },
              ],
              isError: true,
            };
          }
        }
        
        case "search_docs": {
          const index = await getMcpIndex();
          const { query, language } = args;
          
          let docs = index.docs.filter((doc: any) => {
            const searchText = `${doc.title} ${doc.excerpt}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
          });
          
          if (language) {
            docs = docs.filter((doc: any) => doc.lang === language);
          }
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(docs, null, 2),
              },
            ],
          };
        }
        
        case "read_doc": {
          const { id, language = "en" } = args;
          const docPath = path.join(
            process.cwd(),
            "docs",
            language,
            `${id}.md`
          );
          
          try {
            const content = await fs.readFile(docPath, "utf-8");
            
            return {
              content: [
                {
                  type: "text",
                  text: content,
                },
              ],
            };
          } catch (error) {
            return {
              content: [
                {
                  type: "text",
                  text: `Document not found: ${id} (${language})`,
                },
              ],
              isError: true,
            };
          }
        }
        
        default:
          return {
            content: [
              {
                type: "text",
                text: `Unknown tool: ${name}`,
              },
            ],
            isError: true,
          };
      }
    }
    
    default:
      return {
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
  }
}

// Redact token from logs
function redactToken(str: string): string {
  if (!str) return str;
  // Redact tokens that look like MongoDB ObjectIds or JWT tokens
  return str.replace(/[a-f0-9]{24,}/gi, '[REDACTED]')
    .replace(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[REDACTED]');
}

export default async (req: Request, context: Context) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
      },
    });
  }
  
  // Streamable HTTP: this server has no server-to-client stream, so GET (SSE) is not offered
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST, OPTIONS", "Access-Control-Allow-Origin": "*" } });
  }

  try {
    // Extract token from multiple sources for compatibility:
    // 1. Authorization header (Claude Desktop, Cursor, CLI)
    // 2. URL path parameter (claude.ai custom connector: /api/mcp/TOKEN)
    // 3. Query parameter (alternative: /api/mcp?token=TOKEN)
    const authHeader = req.headers.get("Authorization");
    let token: string | null = null;
    
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const url = new URL(req.url);
      
      // Try query parameter
      token = url.searchParams.get("token");
      
      // Try path parameter (e.g. /api/mcp/TOKEN). SaleSys login tokens contain +, / and =
      // so the client URL-encodes the token; take everything after /api/mcp/ and decode it.
      if (!token) {
        const pathMatch = url.pathname.match(/\/api\/mcp\/(.+)$/);
        if (pathMatch) {
          try { token = decodeURIComponent(pathMatch[1]); } catch { token = pathMatch[1]; }
        }
      }
    }
    
    // Parse request body
    const body = await req.json();

    // JSON-RPC notifications (no id, e.g. notifications/initialized) get no response body
    if (body.id === undefined || body.id === null) {
      return new Response(null, { status: 202, headers: { "Access-Control-Allow-Origin": "*" } });
    }
    
    // Log request (with redacted token)
    console.log("MCP request:", {
      method: body.method,
      params: body.params?.name || body.params?.arguments?.path || "...",
      hasToken: !!token,
    });
    
    // Handle MCP request
    const result: any = await handleMcpRequest(body, token);
    const envelope = result?.error && !result.content
      ? { jsonrpc: "2.0", id: body.id, error: result.error }
      : { jsonrpc: "2.0", id: body.id, result };

    return new Response(JSON.stringify(envelope), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    // Log error (with redacted token)
    console.error("MCP Server error:", redactToken(error.message || String(error)));
    
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: error.message || "Internal error",
        },
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

export const config: Config = {
  path: ["/api/mcp", "/api/mcp/*"],
};
