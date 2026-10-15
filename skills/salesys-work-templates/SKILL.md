---
name: salesys-work-templates
description: Use when creating or configuring work templates (arbetsmallar) - automated actions for orders and calls triggered after completion or on schedules.
---

# SaleSys Work Templates (Arbetsmallar)

Use this skill when helping users create or configure work templates (arbetsmallar) - pre-built automation templates for order and call workflows.

## When to Use

- Creating order workflows (after-order-work)
- Setting up call automation (call-actions)
- Building integrations with external systems
- Configuring automated follow-ups
- Creating reusable action templates

## What Are Work Templates?

Work templates (arbetsmallar or action presets) are reusable automation templates with:
- **Settings UI**: Handlebars/HTML form for configuration
- **State Management**: Using `window.form.setState` and `window.form.custom`
- **Backend Logic**: `toDo` object with HTTP requests/webhooks
- **System Users**: Optional automated execution with specific permissions
- **Instructions**: Presentation and guidance for users

## Types

### Order Work Templates
Path: `/api/orders/after-order-work-presets-v1`  
Triggered after order completion or on schedule

### Call Work Templates  
Path: `/api/dial/call-action-presets-v1`  
Triggered after calls or on call events

## Template Structure

```typescript
{
  name: string;              // Template name
  html: string;              // Settings UI (Handlebars)
  toDo: {                    // What to execute
    url: string;             // API endpoint or webhook
    method: string;          // HTTP method
    headers: object;         // Request headers
    body: object;            // Request body
    // Can use [[variables]] from window.form.custom
  };
  isRemoved: boolean;
  systemUser?: {             // Optional automation user
    requiredRights: string[] // Permissions needed
  };
  instructions?: {           // User guidance
    text: string;
  };
  presentation?: {           // Display settings
    icon: string;
    color: string;
  };
}
```

## Creating Templates via MCP

### 1. List Templates

**Order templates**:
```javascript
call_api(
  method="GET",
  path="/api/orders/after-order-work-presets-v1"
)
```

**Call templates**:
```javascript
call_api(
  method="GET",
  path="/api/dial/call-action-presets-v1"
)
```

### 2. Create Template

```javascript
call_api(
  method="POST",
  path="/api/orders/after-order-work-presets-v1",
  body={
    "name": "Send to CRM",
    "html": "<Field label='CRM URL'>...</Field>",
    "toDo": {
      "url": "[[crmUrl]]/api/leads",
      "method": "POST",
      "headers": {
        "Authorization": "Bearer [[apiKey]]"
      },
      "body": {
        "name": "[[contactName]]",
        "email": "[[contactEmail]]",
        "orderNumber": "[[orderNumber]]"
      }
    },
    "systemUser": {
      "requiredRights": ["orders.getAll"]
    }
  },
  confirm=true
)
```

### 3. Update Template

```javascript
call_api(
  method="PUT",
  path="/api/orders/after-order-work-presets-v1/{presetId}",
  body={
    "name": "Updated Name",
    "html": "...",
    "toDo": {...}
  },
  confirm=true
)
```

## State Management

Same as web forms and custom views:

```javascript
// Set state
window.form.setState({ apiKey: "secret" });

// Access state in toDo
{
  "toDo": {
    "url": "[[apiUrl]]",  // From window.form.custom.apiUrl
    "headers": {
      "Authorization": "Bearer [[apiKey]]"
    }
  }
}
```

## Variables in toDo

Use `[[variable]]` notation to insert values from:
- **Form state**: `window.form.custom.fieldName`
- **Contact data**: `[[förnamn]]`, `[[efternamn]]`, `[[telefonnummer]]`
- **Order data**: `[[orderNumber]]`, `[[totalPrice]]`
- **User data**: `[[userName]]`, `[[userEmail]]`

## System Users

For automated execution without manual triggers:

```javascript
{
  "systemUser": {
    "requiredRights": [
      "orders.getAll",
      "contacts.getAll"
    ]
  }
}
```

SaleSys will:
1. Create or select a system user
2. Grant specified permissions
3. Generate temporary API key at runtime
4. Execute with those permissions

## Common Patterns

### Send to External API

```javascript
{
  "toDo": {
    "url": "https://api.example.com/webhook",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer [[apiToken]]"
    },
    "body": {
      "event": "order_created",
      "data": {
        "orderId": "[[orderId]]",
        "customer": "[[customerName]]",
        "amount": "[[totalPrice]]"
      }
    }
  }
}
```

### Update Order/Contact

```javascript
{
  "toDo": {
    "url": "https://app.salesys.se/api/orders/orders-v3/[[orderId]]",
    "method": "PUT",
    "body": {
      "fields": [
        {
          "fieldId": "[[statusFieldId]]",
          "value": "Processed"
        }
      ]
    }
  }
}
```

### Trigger Another Workflow

```javascript
{
  "toDo": {
    "url": "https://app.salesys.se/api/orders/orders-v3/[[orderId]]/work",
    "method": "POST",
    "body": {
      "actionPresetId": "[[nextWorkflowId]]"
    }
  }
}
```

## Settings UI (HTML)

Use Handlebars for the settings form:

```html
<Field label="API URL" required>
  <Input 
    value="{{custom.apiUrl}}"
    onChange="window.form.setState({ apiUrl: event.target.value })"
  />
</Field>

<Field label="API Token" type="password">
  <Input 
    type="password"
    value="{{custom.apiToken}}"
    onChange="window.form.setState({ apiToken: event.target.value })"
  />
</Field>

<SecondaryButton onClick="window.testConnection()">
  Test Connection
</SecondaryButton>

<script>
window.testConnection = async () => {
  const response = await fetch(window.form.custom.apiUrl, {
    headers: {
      'Authorization': `Bearer ${window.form.custom.apiToken}`
    }
  });
  
  if (response.ok) {
    window.form.notify("Connection successful", "ok");
  } else {
    window.form.notify("Connection failed");
  }
};
</script>
```

## Validation

```javascript
// In settings UI
window.form.addHook('validate', () => {
  if (!window.form.custom.apiUrl) {
    window.form.setValidationMessage('apiUrl', 'API URL required');
  } else {
    window.form.removeValidationMessage('apiUrl');
  }
});
```

## Testing Templates

1. **Create template** via API
2. **Edit in admin.salesys.se** - Refine HTML and settings
3. **Preview code** button - See final template
4. **Test on real order/call** - Verify execution
5. **Check logs** - Review results

## Accessing Action/Work Settings

From the template HTML:

```javascript
// Get current action/work settings
window.form.resources.action // { id, isAutomatic, isEnabled, ... }

// Update action settings
window.form.setAction({ isAutomatic: true });

// Update timing
window.form.setAction(action => ({ 
  after: { minutes: action.after + 5 } 
}));
```

For smart flöden (assistants):

```javascript
window.form.setAssistant({ isEnabled: true });
window.form.resources.assistant // { ... }
```

## Entity Groups

Group templates for organization:

```javascript
call_api(
  method="POST",
  path="/api/users/entity-groups-v1",
  body={
    "name": "CRM Integrations",
    "iconName": "wrench",
    "usage": ["actions"]  // actions, assistants, views, forms
  },
  confirm=true
)

// Then reference in template
{
  "entityGroupIds": ["groupId"]
}
```

## Scheduled Execution

Work templates can run on schedules:

```javascript
// Configure when creating work
{
  "actionPresetId": "templateId",
  "schedule": {
    "type": "cron",
    "expression": "0 9 * * *"  // Every day at 9 AM
  }
}
```

## Debugging

### Check Execution Logs
- View in SaleSys > Inställningar > Arbetsmallar
- Check webhook responses
- Verify variables were replaced

### Common Issues
- Variables not replaced: Check spelling (`[[förnamn]]` not `[[fornamn]]`)
- 401/403 errors: Verify system user rights
- Timeout: Reduce external API call complexity
- Variables empty: Ensure data exists in order/contact

## Swedish Terminology

| Svenska | English |
|---------|---------|
| Arbetsmallar | Work templates |
| Orderarbete | Order work |
| Samtalsarbete | Call action |
| Efter orderarbete | After-order work |
| Smart flöde | Smart flow/assistant |
| Systemanvändare | System user |
| Rättigheter | Rights/permissions |

## MCP Tools

Use `salesys-mcp-server` skill to:
- List templates: `GET /api/orders/after-order-work-presets-v1`
- Create templates: `POST /api/orders/after-order-work-presets-v1`
- Entity groups: `/api/users/entity-groups-v1`

## Resources

- **Admin Panel**: admin.salesys.se for template editing
- **API Docs**: https://docs.salesys.io
- **Related Skills**: salesys-webhooks (similar automation concepts)
