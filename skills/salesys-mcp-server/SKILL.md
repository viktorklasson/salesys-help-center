---
name: salesys-mcp-server
description: Use this skill when helping with SaleSys API integration, automation, or data management. Provides access to all SaleSys APIs through an MCP server.
---

# SaleSys MCP Server Skill

Use this skill when working with the SaleSys platform API or helping users integrate, automate, or manage SaleSys data.

## When to Use

- Building integrations with SaleSys (CRM, telephony, agreements)
- Automating order or contact management
- Querying statistics or reports
- Managing users, teams, or permissions
- Working with webhooks or events
- Any SaleSys API operation

## Available MCP Tools

### Discovery & Documentation

**`list_services`** - List all SaleSys API services  
Returns: users, orders, offers, dial (telephony), documents, contacts, calendar, products, realtime, events

**`discover_service`** - Discover available endpoints for a service  
Example: `discover_service(service="contacts")` returns all contact-related endpoints

**`search_docs`** - Search SaleSys documentation  
Example: `search_docs(query="orders", language="en")`

**`read_doc`** - Read a specific documentation article  
Articles: getting-started, orders, offers, calls, contacts, calendar, dashboards, products, users-teams, settings

### API Operations

**`list_endpoints`** - List available API endpoints  
Filter by service, tag, or HTTP method

**`describe_endpoint`** - Get detailed endpoint documentation  
Shows parameters, request body schema, responses

**`call_api`** - Call any SaleSys API endpoint  
- Read operations (GET) execute immediately
- Mutating operations (POST/PUT/PATCH/DELETE) require `confirm: true`

## API Services

| Service | Base Path | Description |
|---------|-----------|-------------|
| `users` | `/api/users/...` | Authentication, users, teams, projects, roles |
| `orders` | `/api/orders/...` | Order management, order jobs |
| `offers` | `/api/offers/...` | Agreements (avtal), mailing templates, web forms |
| `dial` | `/api/dial/...` | Telephony: calls, call jobs, call lists, SMS |
| `documents` | `/api/documents/...` | PDF conversion, import, export |
| `contacts` | `/api/contacts/...` | Contact management, fields, tags, updates |
| `calendar` | `/api/calendar/...` | Calendar events and scheduling |
| `products` | `/api/products/...` | Product catalog management |
| `realtime` | `/api/realtime/...` | WebSocket connections for real-time updates |
| `events` | `/api/events/...` | Async events and webhooks |

## Authentication

Users provide their SaleSys API token via:
- MCP server configuration (recommended for Claude Desktop)
- Session parameter when connecting

Tokens are **never stored** - only used for the current session.

## Safety & Confirmation

- **Read operations** (GET) execute without confirmation
- **Mutating operations** (POST/PUT/PATCH/DELETE) require explicit `confirm: true`
- Users are always warned before data changes
- Recommend testing with non-production tokens first

## Common Workflows

### 1. List and Create Contacts

```
# Discover contact endpoints
discover_service(service="contacts")

# List existing contacts
call_api(method="GET", path="/api/contacts/contacts-v1")

# Create new contact (requires confirmation)
call_api(
  method="POST",
  path="/api/contacts/contacts-v1",
  body={
    "fields": [
      {"fieldId": "...", "value": "John Doe"}
    ]
  },
  confirm=true
)
```

### 2. Query Orders with Statistics

```
# List orders
call_api(method="GET", path="/api/orders/orders-v3")

# Get order statistics
call_api(method="GET", path="/api/orders/statistics-v1/...")
```

### 3. Manage Webhooks

```
# List webhooks
call_api(method="GET", path="/api/events/webhooks-v1")

# Create webhook (requires confirmation)
call_api(
  method="POST",
  path="/api/events/webhooks-v1",
  body={
    "events": [{"name": "order-updated-v1"}],
    "url": "https://example.org/webhook"
  },
  confirm=true
)
```

## Swedish Terminology

SaleSys uses Swedish UI terms. Key translations:

| Svenska | English |
|---------|---------|
| Avtal | Agreement/Offer |
| Ordrar | Orders |
| Samtal | Calls |
| Kontakter | Contacts |
| Användare | Users |
| Team | Teams |
| Projekt | Projects |
| Produkter | Products |
| Statistik | Statistics |
| Kalender | Calendar |
| Inställningar | Settings |
| Fält | Fields |
| Taggar | Tags |

## Resources

- **Documentation**: https://docs.salesys.io
- **API Base**: https://app.salesys.se/api
- **Service Discovery**: `GET /api/<service>/service-v1`
- **Skills Site**: https://skills.salesys.se

## Related Skills

When users need help with specific SaleSys features, use these specialized skills:

- **salesys-webhooks** - Webhook setup and automation
- **salesys-custom-views** - Creating custom views (egna vyer)
- **salesys-web-forms** - Web form integration
- **salesys-agreements** - Agreement/offer workflows
- **salesys-statistics** - Statistics and reporting APIs
- **salesys-export** - Data export functionality
- **salesys-chat** - Chat and messaging integration

## Tips

1. **Always discover first**: Use `discover_service` or `list_endpoints` before calling APIs
2. **Read docs**: Use `search_docs` to find relevant documentation
3. **Check schemas**: Use `describe_endpoint` to see required fields
4. **Test safely**: Start with GET requests, use confirm flag for mutations
5. **Preserve Swedish terms**: Keep field names and UI labels in Swedish as users see them
