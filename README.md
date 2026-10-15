# SaleSys Help Center & MCP Server

This repository powers the public documentation at **docs.salesys.io** and provides an MCP server that enables Claude (claude.ai/Desktop, Claude Code, Cursor) to interact with the SaleSys API.

## Contents

- **Public Documentation**: Help articles in English and Swedish
- **API Documentation**: OpenAPI (Swagger) specification
- **MCP Server**: Streamable HTTP MCP server for Claude integration
- **Claude Skills**: Downloadable skills for SaleSys concepts and workflows

## Project Structure

```
salesys-help-center/
├── docs/                          # Help articles
│   ├── en/                        # English documentation
│   └── sv/                        # Swedish documentation
├── swagger.yaml                   # OpenAPI specification
├── netlify/functions/             # Netlify Functions
│   └── mcp.ts                     # MCP server endpoint
├── skills/                        # Claude skills
│   ├── salesys-mcp-server/        # Main MCP skill
│   ├── salesys-custom-views/      # Custom views guide
│   ├── salesys-webhooks/          # Webhooks & automation
│   ├── salesys-work-templates/    # Work templates (arbetsmallar)
│   ├── salesys-web-forms/         # Web forms
│   ├── salesys-agreements/        # Agreements (avtal)
│   ├── salesys-statistics/        # Statistics API
│   ├── salesys-users/             # User management
│   ├── salesys-export/            # Data export
│   └── salesys-chat/              # Chat integration
├── scripts/                       # Build scripts
│   └── build-mcp-index.js         # Generate MCP tools index
├── index.html                     # Documentation site home
├── viewer/index.html              # Interactive documentation viewer
├── netlify.toml                   # Netlify configuration
├── package.json
├── AUDIT.md                       # Security audit report
└── README.md                      # This file
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Netlify account (for deployment)
- SaleSys API token (for testing)

### Local Development

```bash
# Install dependencies
npm install

# Build MCP tools index
npm run build

# Start Netlify Dev server
npm run dev
```

The documentation site will be available at `http://localhost:8888`  
The MCP server will be available at `http://localhost:8888/api/mcp`

### Testing the MCP Server

```bash
# List available services
curl -X POST http://localhost:8888/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SALESYS_TOKEN" \
  -d '{
    "method": "tools/list",
    "params": {}
  }'

# Discover a service
curl -X POST http://localhost:8888/api/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SALESYS_TOKEN" \
  -d '{
    "method": "tools/call",
    "params": {
      "name": "discover_service",
      "arguments": {"service": "contacts"}
    }
  }'
```

## Deployment

### Netlify Deployment

1. **Connect Repository**
   ```bash
   netlify login
   netlify link
   ```

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.`
   - Functions directory: `netlify/functions`

3. **Deploy**
   ```bash
   npm run deploy
   ```

### Environment Variables

No environment variables required for production. The MCP server uses per-session tokens provided by users.

## MCP Server API

### Endpoint

**Production**: `https://docs.salesys.io/api/mcp`  
**Local**: `http://localhost:8888/api/mcp`

### Authentication

Pass your SaleSys API token via:
- HTTP header: `Authorization: Bearer YOUR_TOKEN`
- Query parameter: `?token=YOUR_TOKEN`

### Available Tools

| Tool | Description |
|------|-------------|
| `list_services` | List all SaleSys API services |
| `discover_service` | Discover endpoints for a service |
| `list_endpoints` | List available API endpoints |
| `describe_endpoint` | Get detailed endpoint documentation |
| `call_api` | Call any SaleSys API endpoint |
| `search_docs` | Search documentation articles |
| `read_doc` | Read a specific documentation article |

### Safety

- **Read operations** (GET) execute immediately
- **Mutating operations** (POST/PUT/PATCH/DELETE) require `confirm: true`
- Tokens are never stored - only used for the session
- All API calls are logged for transparency

## Claude Integration

### Claude Desktop

Add to your MCP settings (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "salesys": {
      "url": "https://docs.salesys.io/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_SALESYS_TOKEN"
      }
    }
  }
}
```

### Claude Code CLI

```bash
claude mcp add salesys \
  --url https://docs.salesys.io/api/mcp \
  --header "Authorization: Bearer YOUR_SALESYS_TOKEN"
```

### Cursor

Add to `.cursor/mcp_config.json`:

```json
{
  "mcpServers": {
    "salesys": {
      "url": "https://docs.salesys.io/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_SALESYS_TOKEN"
      }
    }
  }
}
```

## Claude Skills

Pre-built skills for SaleSys concepts and workflows:

1. **salesys-mcp-server** - Core MCP server usage
2. **salesys-custom-views** - Custom views (egna vyer)
3. **salesys-webhooks** - Webhooks and automation
4. **salesys-work-templates** - Work templates (arbetsmallar)
5. **salesys-web-forms** - Web forms integration
6. **salesys-agreements** - Agreements (avtal)
7. **salesys-statistics** - Statistics API
8. **salesys-users** - User management
9. **salesys-export** - Data export
10. **salesys-chat** - Chat integration

### Downloading Skills

Download individual skills or the complete bundle from:  
**https://docs.salesys.io/claude-skills**

## API Documentation

### OpenAPI Specification

The `swagger.yaml` file documents all public SaleSys APIs. View it:
- **Interactive viewer**: https://docs.salesys.io/viewer/
- **Raw spec**: https://docs.salesys.io/swagger.yaml

### Service Discovery

Each SaleSys service self-describes its endpoints:

```bash
curl https://app.salesys.se/api/users/service-v1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Returns:
{
  "name": "users",
  "endpoints": [
    {"method": "GET", "path": "/api/users/users-v1"},
    {"method": "POST", "path": "/api/users/login-v1"},
    ...
  ]
}
```

### Known Services

- **users**: Authentication, users, teams, projects, roles
- **orders**: Order management, order jobs
- **offers**: Agreements, mailing templates, web forms
- **dial**: Telephony (calls, call jobs, call lists, SMS)
- **documents**: PDF conversion, import, export
- **contacts**: Contact management, fields, tags, updates
- **calendar**: Calendar events and scheduling
- **products**: Product catalog management
- **realtime**: WebSocket connections
- **events**: Async events and webhooks

## Security

See [AUDIT.md](./AUDIT.md) for the complete security audit report.

### Summary

- ✅ Repository verified as source for docs.salesys.io
- ✅ Private APIs removed from documentation
- ✅ No secrets or credentials in repository
- ✅ All documented endpoints are public
- ✅ Mutation safety enforced via confirmation flags

### Token Security

- Tokens are passed per-session only
- Never stored or logged by the MCP server
- Users should use temporary tokens when possible
- Rotate tokens after testing or development

## Development

### Building the MCP Index

The MCP index is generated from `swagger.yaml` and the `docs/` directory:

```bash
npm run build:mcp-index
```

This creates `generated/mcp-index.json` with:
- Endpoint metadata
- Service definitions
- Documentation index
- Schema definitions

### Updating Documentation

1. Edit markdown files in `docs/en/` or `docs/sv/`
2. Run `npm run build` to regenerate the index
3. Test locally with `npm run dev`
4. Deploy with `npm run deploy`

### Adding Endpoints to swagger.yaml

1. Add the endpoint definition following OpenAPI 3.0 spec
2. Rebuild the index with `npm run build:mcp-index`
3. The endpoint will automatically be available via the MCP server

### Creating New Skills

1. Create a new directory in `skills/`
2. Add a `SKILL.md` file with frontmatter:
   ```markdown
   ---
   name: Skill Name
   description: When to use this skill
   ---
   # Skill Content
   ```
3. Build skill packages (see below)

### Building Skill Packages

```bash
# Build individual skill zips
cd skills
zip -r salesys-mcp-server.zip salesys-mcp-server/
zip -r salesys-webhooks.zip salesys-webhooks/
# ... etc

# Build complete bundle
zip -r salesys-skills-bundle.zip salesys-*/
```

## Support

- **Documentation**: https://docs.salesys.io
- **API Base**: https://app.salesys.se/api
- **Skills Site**: https://skills.salesys.se

## License

This documentation and the MCP server are provided for SaleSys customers and partners.

## Contributing

### Reporting Issues

Report documentation errors or API discrepancies to the SaleSys team.

### Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

---

**Built with**: Netlify Functions, TypeScript, OpenAPI  
**Maintained by**: SaleSys Team
