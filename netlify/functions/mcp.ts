import type { Context, Config } from "@netlify/functions";
import fs from "fs/promises";
import path from "path";

// Load MCP index
let mcpIndex: any = null;
async function getMcpIndex() {
  if (!mcpIndex) {
    const indexPath = path.join(process.cwd(), ".netlify/functions-internal/mcp-index.json");
    const content = await fs.readFile(indexPath, "utf-8");
    mcpIndex = JSON.parse(content);
  }
  return mcpIndex;
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
    case "tools/list":
      return {
        tools: TOOLS,
      };
    
    case "tools/call": {
      const { name, arguments: args } = params;
      
      if (!token) {
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
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
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
      
      // Try path parameter (e.g. /api/mcp/TOKEN)
      if (!token) {
        const pathMatch = url.pathname.match(/\/api\/mcp\/([a-f0-9]{24,}|[A-Za-z0-9_-]+)/i);
        if (pathMatch) {
          token = pathMatch[1];
        }
      }
    }
    
    // Parse request body
    const body = await req.json();
    
    // Log request (with redacted token)
    console.log("MCP request:", {
      method: body.method,
      params: body.params?.name || body.params?.arguments?.path || "...",
      hasToken: !!token,
    });
    
    // Handle MCP request
    const result = await handleMcpRequest(body, token);
    
    return new Response(JSON.stringify(result), {
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
  path: ["/api/mcp", "/api/mcp/:token"],
};
