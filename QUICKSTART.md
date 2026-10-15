# SaleSys MCP Quick Reference

## Connection String

```
MCP URL: https://docs.salesys.io/api/mcp
Auth: Bearer YOUR_SALESYS_TOKEN
```

## Claude Desktop Config

```json
{
  "mcpServers": {
    "salesys": {
      "url": "https://docs.salesys.io/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN"
      }
    }
  }
}
```

Location: `~/Library/Application Support/Claude/claude_desktop_config.json`

## Available Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `list_services` | Show all API services | Lists users, orders, offers, dial, etc. |
| `discover_service` | Get service endpoints | `discover_service(service="contacts")` |
| `list_endpoints` | Filter available endpoints | Filter by service, tag, or method |
| `describe_endpoint` | Get endpoint details | Shows params, body, responses |
| `call_api` | Call any SaleSys API | Requires `confirm:true` for mutations |
| `search_docs` | Search help articles | `search_docs(query="orders")` |
| `read_doc` | Read full article | `read_doc(id="contacts")` |

## Services

- **users** - Auth, users, teams, projects, roles
- **orders** - Order management, jobs
- **offers** - Agreements (avtal), web forms
- **dial** - Telephony, calls, SMS
- **documents** - PDF, import, export
- **contacts** - Contact management
- **calendar** - Calendar events
- **products** - Product catalog
- **realtime** - WebSocket
- **events** - Webhooks, events

## Safety

✅ GET requests execute immediately  
⚠️ POST/PUT/PATCH/DELETE require `confirm: true`  
🔒 Tokens never stored, session-only

## Example Prompts

```
"List all services"
"Discover contacts endpoints"
"Show me my contacts"
"Create a contact named John Doe with email john@example.com" (asks for confirmation)
"Search docs for webhooks"
"Explain how custom views work"
```

## Troubleshooting

### "Authentication failed"
- Check token is correct (no spaces)
- Verify token not revoked in SaleSys
- Ensure Bearer format: `Bearer TOKEN`

### "Permission denied"
- Check system user permissions in SaleSys
- Add required rights to user's role
- Common: `contacts.getAll`, `orders.getAll`

### "MCP server not responding"
- Verify URL: `https://docs.salesys.io/api/mcp`
- Restart Claude Desktop
- Check Netlify status

## Resources

- Setup Guide: https://docs.salesys.io/docs/en/connect-to-claude.md
- Skills: https://docs.salesys.io/skills/
- API Docs: https://docs.salesys.io
- Swagger: https://docs.salesys.io/swagger.yaml

## Support

Internal: Viktor Klasson  
Documentation: docs.salesys.io  
Skills: skills.salesys.se
