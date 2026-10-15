---
name: SaleSys Webhooks
description: Use when setting up webhooks, automations, or event-driven integrations in SaleSys. Create custom actions (åtgärder) triggered by system events.
---

# SaleSys Webhooks Skill

Use this skill when helping users set up webhooks, event-driven automations, or custom actions in SaleSys.

## When to Use

- Setting up event notifications (order created, user added, etc.)
- Building automations triggered by SaleSys events
- Creating custom actions (send SMS, external API calls)
- Implementing event filters and delays
- Debugging webhook deliveries

## Core Concepts

### Events
SaleSys emits events like `order-updated-v1`, `user-created-v1`, `call-tag-removed-v1`. Webhooks listen to these events and trigger actions.

### Webhooks
HTTP POST endpoints that receive event data when events occur.

### Actions (Åtgärder)
Pre-built automation templates (e.g. "Send SMS", "Create CRM record") with settings UI and backend logic.

### Filters
Conditions that determine which events trigger the webhook (e.g. only orders with specific tag).

### Delays (Fördröjningar)
Schedule actions for later execution (e.g. 5 minutes after event, or before agreement expires).

## Creating Webhooks via MCP

### 1. List Available Events
```javascript
call_api(
  method="GET",
  path="/api/events/webhooks-v1/events"
)
// Returns: { allowedEvents: ["order-updated-v1", "user-created-v1", ...] }
```

### 2. Create Webhook
```javascript
call_api(
  method="POST",
  path="/api/events/webhooks-v1",
  body={
    "events": [
      { "name": "order-updated-v1" },
      { "name": "contact-created-v1" }
    ],
    "url": "https://example.org/webhook",
    "isEnabled": true,
    "auth": true,  // SaleSys generates anonymous token
    "authRights": ["orders.getAll"],  // Token permissions
    "retry": true  // Retry on failure
  },
  confirm=true
)
// Returns: { webhookId: "..." }
```

### 3. Update Webhook
```javascript
call_api(
  method="PUT",
  path="/api/events/webhooks-v1/{webhookId}",
  body={
    "isEnabled": true,
    "url": "https://new-url.org/webhook"
  },
  confirm=true
)
```

### 4. List Webhooks
```javascript
call_api(
  method="GET",
  path="/api/events/webhooks-v1"
)
```

### 5. Get Specific Webhook
```javascript
call_api(
  method="GET",
  path="/api/events/webhooks-v1/{webhookId}"
)
```

## Webhook Payload

When an event occurs, SaleSys POSTs to your webhook URL:

```json
{
  "id": "event-id",
  "name": "order-updated-v1",
  "topic": "orders",
  "data": {
    "orderId": "...",
    "userId": "...",
    "organizationId": "...",
    ...
  }
}
```

### With Authentication (`auth: true`)
```
POST https://your-url.org/webhook
Authorization: Bearer private-token-here
Content-Type: application/json

{ event payload }
```

## Verifying Webhook Authenticity

If `auth: true`, verify the token:
```bash
curl https://app.salesys.se/api/users/me-v1/identifiable \
  -H "Authorization: Bearer TOKEN_FROM_WEBHOOK"

# Response (200 OK = valid):
{
  "id": "...",
  "type": "privateUser",
  "organizationId": "...",
  "accessToken": null
}
```

## Error Handling & Auto-Disable

### Automatic Disabling
Webhooks auto-disable (`isEnabled = false`) on permanent errors:
- Domain not found (ENOTFOUND)
- Multiple repeated failures

### Automatic Retry Disable
`retry = false` is set on repeated temporary errors.

### Reasons
Check these fields after auto-disable:
- `automaticDisableReason` - Why webhook was disabled
- `automaticRetryDisableReason` - Why retries were disabled

### Re-enabling
```javascript
call_api(
  method="PUT",
  path="/api/events/webhooks-v1/{webhookId}",
  body={
    "isEnabled": true,
    "retry": true
  },
  confirm=true
)
```

## Actions (Åtgärder) - Advanced

Actions are view templates that create webhooks with pre-built logic (SMS, integrations, etc.).

### Architecture
- **GUI**: View template (vymall) with settings UI
- **Backend**: PHP scripts in `/api/action-presets/webhooks/`
- **Settings**: Stored in webhook's `reference` object

### Creating an Action

See the `salesys-custom-views` skill for view template creation. Key points for actions:

1. **Component**: Create view template component with unique ID
2. **Settings**: Use `window.onWebhookSettingsChange({ ... })`
3. **Validation**: Use `window.setActionValidation(id, message)`
4. **Backend**: Create `/actions/{component-id}.php`
5. **Variables**: Support `[[variable]]` placeholders in settings

### Example: Send SMS Action

**Component (HTML/JS)**:
```javascript
window.form.addHook('Send_SMS', () => {
  if (window.getSelectedActionId() !== 'Send_SMS') return;
  
  // Settings UI logic
  window.onWebhookSettingsChange({
    recipient: '+46700000000',
    message: 'Hej [[förnamn]]'
  });
  
  // Validation
  if (!settings.recipient) {
    window.setActionValidation('recipient', 'Phone number required');
  }
});
```

**Backend (`actions/Send_SMS.php`)**:
```php
<?php
// $settings contains settings from frontend
// $log_trace is prefix for logging
// Variables like [[förnamn]] are replaced automatically

$recipient = $settings["recipient"];
$message = $settings["message"];

// Send SMS via API...
$result = sendSms($recipient, $message);

// Output for event log
echo json_encode([
  "text": "SMS sent",
  "fields" => [
    "To" => $recipient,
    "Message" => $message,
    "ID" => $result["id"]
  ]
]);
?>
```

### Variables in Actions

Settings can use `[[variable]]` placeholders:
- `[[förnamn]]` - Contact first name
- `[[efternamn]]` - Last name
- `[[ordernummer]]` - Order serial ID
- Custom JSON paths: `{ _path: "$.serialId" }`

Add variables to insert button:
```javascript
window.insertOptions = [
  {
    text: "Order Number",
    data: { _path: "$.serialId" },
    group: "Order",
    eventPrefix: ["order"]  // Only for order events
  },
  ...
];
```

## Filters

Filters determine which events trigger the webhook:

### Filter Types
- Order tags
- Contact tags
- User IDs
- Team IDs
- Project IDs
- Custom logic

### Adding Filters (View Template)

In the "Filter" component, add to `window.eventFilterDefinitions`:
```javascript
{
  id: "orderTag",
  name: "Order Tag",
  events: ["order-"], // Applies to order-* events
  component: "Select",
  options: orderTags.map(tag => ({ value: tag.id, label: tag.name }))
}
```

Then implement in `.filter.php`:
```php
if ($filter_order_tag && !in_array($filter_order_tag, $order["tagIds"])) {
  return false; // Filter out
}
```

## Delays (Fördröjningar)

Schedule execution for a future time:

### Delay Types
- After N minutes/hours
- Specific time next day (e.g. "efter midnatt")
- Before agreement expires

### Adding Delays (View Template)

In "Filter" component, add to `window.eventDelayDefinitions`:
```javascript
{
  id: "after5min",
  name: "5 minuter efter händelsen"
}
```

Create `/delays/after5min.php`:
```php
<?php
// Set $execute_after (DateTime instance)
$execute_after = new DateTime();
$execute_after->modify('+5 minutes');
?>
```

If `$execute_after` is in the future, SaleSys waits and re-executes.

## Common Event Patterns

### Order Created → Create CRM Lead
```javascript
{
  "events": [{ "name": "order-created-v1" }],
  "url": "https://crm.example.org/leads",
  "auth": true,
  "authRights": ["orders.getAll"]
}
```

### User Added → Send Welcome Email
```javascript
{
  "events": [{ "name": "user-created-v1" }],
  "url": "https://mail-service.org/send",
  ...
}
```

### Agreement Signed → Trigger Fulfillment
```javascript
{
  "events": [{ "name": "offer-signed-v1" }],
  "url": "https://fulfillment.example.org/webhook",
  ...
}
```

## Testing Webhooks

1. **Use webhook.site**: Get a temporary URL to inspect payloads
2. **Check logs**: View webhook execution history in SaleSys
3. **Test with non-production data**: Use test orders/contacts
4. **Verify auth token**: Call `/api/users/me-v1/identifiable`

## Troubleshooting

### Webhook Not Triggering
- Check `isEnabled: true`
- Verify event name matches exactly
- Check filters aren't too restrictive
- Review `automaticDisableReason`

### Payload Missing Data
- Check event documentation for available fields
- Use JSONPath in action settings: `{ _path: "$.field" }`

### Authentication Errors
- Verify `authRights` include necessary permissions
- Test token with `/api/users/me-v1/identifiable`

### Retry Loop
- Check webhook endpoint returns 200/201 on success
- Fix endpoint errors before re-enabling `retry`

## Swedish Terminology

| Svenska | English |
|---------|---------|
| Webhook | Webhook |
| Åtgärd | Action |
| Händelse | Event |
| Filter | Filter |
| Fördröjning | Delay |
| Utskicksmall | Message template |
| Inställningar | Settings |

## MCP Tools

Use the `salesys-mcp-server` skill to:
- List events: `GET /api/events/webhooks-v1/events`
- Manage webhooks: `POST/GET/PUT /api/events/webhooks-v1`
- View event log: `GET /api/events/events-v1` (admin only)

## Resources

- **Webhook View**: Manage webhooks in SaleSys > Inställningar > Webhooks
- **Action Templates**: skills.salesys.se
- **API Docs**: https://docs.salesys.io
