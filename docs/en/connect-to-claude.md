# Connect SaleSys to Claude

Connect your SaleSys account to Claude (claude.ai, Claude Desktop, Claude Code, Cursor) so Claude can help you with orders, contacts, automations, and more - directly understanding how SaleSys works and calling APIs on your behalf.

## What You Get

✅ **API Access** - Claude can read and manage your SaleSys data  
✅ **Context** - Claude understands SaleSys concepts (avtal, ordrar, samtal, vyer)  
✅ **Documentation** - Instant access to help articles and API docs  
✅ **Safety** - All data-changing operations require your confirmation

## Quick Setup

### Step 1: Get Your API Token

Your SaleSys API token will be available in Viktor's upcoming token UI.

Once you have your token, continue to Step 2.

### Step 2: Connect to Claude

Choose your Claude client:

#### claude.ai (Web Interface)

1. Open [claude.ai](https://claude.ai)
2. Go to **Settings** > **Connectors**
3. Click **Add custom connector**
4. Enter:
   - **Name**: SaleSys
   - **URL**: `https://docs.salesys.io/api/mcp/{{TOKEN}}`
   
Replace `{{TOKEN}}` with your actual SaleSys token, **URL-encoded** (login tokens contain `+`, `/` and `=`; the SaleSys quickstart view gives you the encoded URL ready to paste).

**Note**: claude.ai custom connectors don't support headers, so the token is passed in the URL. It's stripped from logs for security.

#### Claude Desktop

1. Open Claude Desktop settings
2. Navigate to **Connectors** (or **MCP Servers** in older versions)
3. Click **Add custom connector**
4. Enter:
   - **Name**: SaleSys
   - **URL**: `https://docs.salesys.io/api/mcp`
   - **Authorization Header**: `Bearer {{TOKEN}}`

Replace `{{TOKEN}}` with your actual SaleSys token.

Or manually edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "salesys": {
      "url": "https://docs.salesys.io/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

#### Claude Code (CLI)

```bash
claude mcp add salesys \
  --url https://docs.salesys.io/api/mcp \
  --header "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Cursor

Add to your `.cursor/mcp_config.json`:

```json
{
  "mcpServers": {
    "salesys": {
      "url": "https://docs.salesys.io/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      }
    }
  }
}
```

### Step 3: Install Claude Skills (Optional but Recommended)

Skills help Claude understand SaleSys-specific concepts and workflows.

**Download**: [Individual skills](#available-skills) | [Complete bundle](./skills/salesys-skills-bundle.zip)

**Install**: Upload skill zip files in Claude Desktop > Settings > Skills

## Available Skills

Click to download individual skills:

| Skill | Download | Description |
|-------|----------|-------------|
| **SaleSys MCP Server** | [Download](./skills/salesys-mcp-server.zip) | Core API access and documentation |
| **Custom Views** | [Download](./skills/salesys-custom-views.zip) | Create custom views (egna vyer) |
| **Webhooks** | [Download](./skills/salesys-webhooks.zip) | Set up automations and webhooks |
| **Work Templates** | [Download](./skills/salesys-work-templates.zip) | Arbetsmallar for orders and calls |
| **Web Forms** | [Download](./skills/salesys-web-forms.zip) | Integrate web forms on your site |
| **Agreements** | [Download](./skills/salesys-agreements.zip) | Create and manage avtal (offers) |
| **Statistics** | [Download](./skills/salesys-statistics.zip) | Query statistics and reports |
| **Users** | [Download](./skills/salesys-users.zip) | Manage users, teams, projects |
| **Export** | [Download](./skills/salesys-export.zip) | Export contacts, calls, orders |
| **Chat** | [Download](./skills/salesys-chat.zip) | Integrate chat on your website |

**Complete Bundle**: [Download All Skills](./skills/salesys-skills-bundle.zip)

## Example Prompts

Once connected, try asking Claude:

### Getting Started
> "List my SaleSys contacts"  
> "Show me today's orders"  
> "What webhooks do I have configured?"

### Creating Data
> "Create a new contact with name John Doe and email john@example.com"  
> "Add an order for product X with customer Y"

### Automations
> "Set up a webhook that sends me an email when an order is created"  
> "Create a custom view that shows order statistics"

### Documentation
> "How do I create a web form?"  
> "Explain webhooks and give me an example"  
> "Show me the API for creating contacts"

## Ready-to-Use Onboarding Prompt

After connecting, paste this into Claude to get started:

```
I've just connected SaleSys to you via MCP. I'm using SaleSys for sales automation.

Please:
1. Tell me what SaleSys tools and documentation you can access
2. Show me 3 useful things you can help me do right now
3. Explain how data-changing operations work (I know they require confirmation)

Then ask me what I'd like to do first.
```

Copy and paste the above prompt into Claude after connecting the MCP server.

## What Claude Can Do

### Via MCP Server

- ✅ List and search contacts, orders, users, products
- ✅ Create orders and agreements
- ✅ Manage webhooks and automations
- ✅ Query statistics and reports
- ✅ Discover API endpoints dynamically
- ✅ Search documentation
- ✅ Call any documented API endpoint

### With Safety

- 🛡️ Read operations (GET) execute immediately
- 🛡️ Data-changing operations (POST/PUT/DELETE) require your confirmation
- 🛡️ Tokens are never stored - used for session only
- 🛡️ All operations are logged

## Token Security

### Best Practices

1. **Create dedicated tokens** - Don't use your personal login token
2. **Limit permissions** - Only grant necessary rights (e.g. `contacts.getAll`)
3. **Use temporary tokens** - Rotate tokens regularly
4. **Revoke after testing** - Delete tokens when done experimenting

### Revoking Tokens

Use Viktor's upcoming token UI to revoke tokens when you're done with them or if they're compromised.

## Troubleshooting

### "Authentication failed" or "No token provided"

- Check your token is correctly copied (no extra spaces)
- Verify token hasn't been revoked
- Ensure format is `Bearer YOUR_TOKEN` in Authorization header

### "Permission denied" errors

- Check the system user has necessary permissions
- Go to **Roller** (Roles) and assign required rights
- Common rights: `contacts.getAll`, `orders.getAll`, `offers.getAll`

### MCP server not connecting

- Verify URL is exactly: `https://docs.salesys.io/api/mcp`
- Check Claude client is up to date
- Try restarting Claude Desktop

### Changes not reflecting

- Rebuild MCP index if you've updated swagger.yaml
- Restart Claude client after config changes
- Check Claude logs for connection errors

## Advanced: Self-Hosting

Want to run your own MCP server? See the [README](./README.md#deployment) for deployment instructions.

```bash
# Clone and deploy
git clone https://github.com/viktorklasson/salesys-help-center
cd salesys-help-center
npm install
npm run build
netlify deploy --prod
```

Your MCP server will be at: `https://your-site.netlify.app/api/mcp`

## API Documentation

Browse the complete API documentation:

- **Interactive Viewer**: [docs.salesys.io/viewer](https://docs.salesys.io/viewer)
- **OpenAPI Spec**: [swagger.yaml](https://docs.salesys.io/swagger.yaml)
- **Service Discovery**: Each service self-describes at `/api/<service>/service-v1`

### Known Services

| Service | Base URL | Description |
|---------|----------|-------------|
| users | `/api/users/...` | Authentication, users, teams, projects |
| orders | `/api/orders/...` | Order management |
| offers | `/api/offers/...` | Agreements (avtal), web forms |
| dial | `/api/dial/...` | Telephony, calls, SMS |
| documents | `/api/documents/...` | PDF, import, export |
| contacts | `/api/contacts/...` | Contact management |
| calendar | `/api/calendar/...` | Calendar events |
| products | `/api/products/...` | Product catalog |
| realtime | `/api/realtime/...` | WebSocket connections |
| events | `/api/events/...` | Webhooks and events |

## FAQ

**Q: Does this work with claude.ai (web interface)?**  
A: Yes! Use Settings > Connectors > Add custom connector and put your token in the URL: `https://docs.salesys.io/api/mcp/{{TOKEN}}`

**Q: Can Claude access my production data?**  
A: Yes, if you provide a token with production access. We recommend using a test environment or limited permissions when getting started.

**Q: Are my tokens stored anywhere?**  
A: No - tokens are only used during your active Claude session and never stored on our servers.

**Q: Can other people use my token?**  
A: Only if you share it. Keep your tokens private and rotate them regularly.

**Q: What if I give Claude the wrong permissions?**  
A: The system user's role determines what Claude can do. You can update permissions anytime in SaleSys settings.

**Q: Does this cost extra?**  
A: No - this is included with your SaleSys subscription. You only need your existing API access.

## Need Help?

- **Documentation**: https://docs.salesys.io
- **Support**: Contact SaleSys support
- **Community**: skills.salesys.se

---

**Ready to connect?** Start with [Step 1: Get Your API Token](#step-1-get-your-api-token)
