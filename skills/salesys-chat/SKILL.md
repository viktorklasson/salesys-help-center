---
name: SaleSys Chat Integration
description: Use when integrating SaleSys chat on websites - customer messaging, notifications, WebSocket real-time updates, agent-to-agent chat.
---

# SaleSys Chat Integration

Use this skill when integrating SaleSys chat functionality - customer messaging on websites, internal agent chat, and real-time notifications.

## When to Use

- Adding live chat to customer websites
- Building custom chat interfaces
- Implementing agent-to-agent messaging
- Setting up chat notifications (email/SMS)
- Working with WebSocket for real-time updates

## Core Concepts

### Parties

- **local** - The authenticated SaleSys user (agent)
- **remote** - The customer, website visitor, or other agent

### Chat Session
A conversation between local and remote, containing messages.

### Remote Token
Authentication token for remote party (website visitors). Never expires during active session.

### Notification
Email/SMS reminder about unread messages (sent to remote).

### Reference
Custom metadata attached to sessions (e.g. agreement URL, order ID).

## Creating Chat Sessions

### Customer Chat (Website Visitor)

```javascript
call_api(
  method="POST",
  path="/api/users/chat-sessions-v1",
  body={
    "local": {
      "phoneNumber": "+46700000000",     // Optional
      "smsSenderId": "SaleSys",          // Optional
      "email": "agent@company.com",      // Optional
      "name": "Support Agent",           // Optional
      "userId": "AGENT_USER_ID"          // Optional
    },
    "remote": {
      "phoneNumber": "+46700000001",     // Optional
      "email": "customer@example.com",   // Optional
      "name": "Customer Name"            // Required
    },
    "smsNotificationMessageTemplateId": "TEMPLATE_ID",   // Optional
    "emailNotificationMessageTemplateId": "TEMPLATE_ID", // Optional
    "welcomeText": "Hello! I'll respond soon.",          // Optional
    "reference": {
      "orderId": "ORDER_ID",
      "agreementUrl": "https://...",
      "customField": "value"
    }
  },
  confirm=true
)

// Returns:
{
  "session": { /* full session object */ },
  "remoteToken": "TOKEN_FOR_REMOTE_PARTY"
}
```

**remoteToken**: Give this to the remote party (customer). They use it to access the chat.

### Agent-to-Agent Chat

```javascript
call_api(
  method="POST",
  path="/api/users/chat-sessions-v1",
  body={
    "local": {
      "userId": "AGENT_1_USER_ID"
    },
    "remote": {
      "userId": "AGENT_2_USER_ID"  // Another SaleSys user
    }
  },
  confirm=true
)
```

**Note**: For agent-to-agent chat, use Bearer tokens (not remoteToken).

## Messages

### Send Message (Local/Agent)

```javascript
call_api(
  method="POST",
  path="/api/users/chat-messages-v1",
  body={
    "text": "Hello, how can I help you?",
    "sessionId": "SESSION_ID"
  },
  confirm=true
)
```

### Send Message (Remote/Customer)

```javascript
call_api(
  method="POST",
  path="/api/users/chat-messages-v1",
  query={
    "token": "REMOTE_TOKEN"  // From session creation
  },
  body={
    "text": "I have a question about my order"
  },
  confirm=true
)
```

### Get Messages

```javascript
// Local (agent)
call_api(
  method="GET",
  path="/api/users/chat-messages-v1",
  query={
    "sessionId": "SESSION_ID"
  }
)

// Remote (customer)
call_api(
  method="GET",
  path="/api/users/chat-messages-v1",
  query={
    "token": "REMOTE_TOKEN"
  }
)
```

### Advanced Message Queries

```javascript
call_api(
  method="GET",
  path="/api/users/chat-messages-v1",
  query={
    "sessionId": "SESSION_ID",
    "after": "2024-01-01T00:00:00.000Z",   // Messages after date
    "before": "2024-01-31T23:59:59.999Z",  // Messages before date
    "isLatest": "true",                    // Latest in session
    "latestCount": "50",                   // Last N messages per session
    "sortOrder": "desc"                    // asc or desc
  }
)
```

### Mark Messages as Seen

```javascript
call_api(
  method="POST",
  path="/api/users/chat-messages-v1/see",
  body={
    "ids": ["MSG_ID_1", "MSG_ID_2", "MSG_ID_3"],
    "seen": true,
    "notified": true  // For local: mark as notified in SaleSys
  },
  confirm=true
)
```

## Sessions

### List Sessions (Local/Agent)

```javascript
call_api(
  method="GET",
  path="/api/users/chat-sessions-v1",
  query={
    "ids": "SESSION_ID_1,SESSION_ID_2"  // Optional filter
  }
)
```

### Get Session (Remote/Customer)

```javascript
call_api(
  method="GET",
  path="/api/users/chat-sessions-v1/{remoteToken}"
)
```

### Update Session (Local)

```javascript
call_api(
  method="PUT",
  path="/api/users/chat-sessions-v1/{sessionId}",
  body={
    "isTyping": true  // Show typing indicator
  },
  confirm=true
)
```

### Update Session (Remote)

```javascript
call_api(
  method="PUT",
  path="/api/users/chat-sessions-v1/{remoteToken}",
  body={
    "isTyping": true
  },
  confirm=true
)
```

## Typing Indicators

### How It Works

1. **Send `isTyping: true`** while user is typing
2. **Stop sending** when user stops typing
3. **Check `isLocalTyping` or `isRemoteTyping`** on session
4. **Show indicator** if true
5. **Hide after 3 seconds** if no new isTyping updates

### Implementation

```javascript
let typingTimeout;

function onUserTyping() {
  // Clear previous timeout
  clearTimeout(typingTimeout);
  
  // Send typing signal
  call_api(
    method="PUT",
    path="/api/users/chat-sessions-v1/{sessionId}",
    body={ isTyping: true },
    confirm=true
  );
  
  // Set timeout to stop sending
  typingTimeout = setTimeout(() => {
    // User stopped typing
  }, 2000);
}

// On receiving session update
function onSessionUpdate(session) {
  if (session.isRemoteTyping) {
    showTypingIndicator();
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      hideTypingIndicator();
    }, 3000);
  }
}
```

## Real-Time Updates (WebSocket)

### Connect to WebSocket

```javascript
// Remote (customer) - use remoteToken as roomId
const ws = new WebSocket(
  "wss://app.salesys.se/api/realtime/realtime-v1?roomId=REMOTE_TOKEN"
);

// Local (agent) - use "auth:" + userId as roomId
const ws = new WebSocket(
  "wss://app.salesys.se/api/realtime/realtime-v1?roomId=auth:USER_ID&authorization=BEARER_TOKEN"
);
```

### Handle Messages

```javascript
ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === "chatMessageCreated") {
    const message = data.message;
    displayMessage(message);
  }
  
  if (data.type === "chatSessionUpdated") {
    const session = data.session;
    updateTypingIndicator(session);
  }
});
```

### Event Types

- **chatMessageCreated** - New message sent
- **chatSessionUpdated** - Session updated (typing, etc.)

## Notifications

### Message Templates

Create templates in SaleSys > Inställningar > Avtal > Utskick.

Templates support variables:
- `[[name]]` - Remote party name
- `[[reference.X]]` - Session reference fields

### Example

```
Hi [[name]], you have unread messages.
Click here: [[reference.chatUrl]]
```

### When Sent

- Local sends a message
- Remote hasn't seen it within ~10 minutes
- Notification sent via email or SMS (depending on template type)

## Session Reference

Store custom data on sessions:

```javascript
{
  "reference": {
    "chatUrl": "https://mysite.com/chat?token=...",
    "orderId": "ORDER_123",
    "source": "website",
    "pageUrl": "https://mysite.com/products/item"
  }
}
```

Access in code or notification templates:
- `session.reference.orderId`
- `[[reference.chatUrl]]` in notification template

## SMS Integration

All incoming/outgoing SMS in SaleSys automatically become chat messages:

```javascript
// Query all messages (chat + SMS)
call_api(
  method="GET",
  path="/api/users/chat-messages-v1",
  query={
    "localPhoneNumber": "+46700000000",      // Sent from this number
    "remotePhoneNumber": "+46700000001",     // Sent to this number
    "localSmsSenderId": "SaleSys",          // Sent from this sender ID
    "includeNonSms": "true"                 // Include chat (non-SMS) messages
  }
)
```

## Common Patterns

### Website Chat Widget

```html
<div id="chat-widget">
  <div id="messages"></div>
  <input id="message-input" placeholder="Type a message..." />
  <button onclick="sendMessage()">Send</button>
</div>

<script>
let session, remoteToken, ws;

// Initialize chat
async function initChat() {
  // Create session
  const response = await fetch('YOUR_BACKEND/api/create-chat-session', {
    method: 'POST',
    body: JSON.stringify({
      name: "Visitor",
      email: "visitor@example.com"
    })
  });
  
  const data = await response.json();
  session = data.session;
  remoteToken = data.remoteToken;
  
  // Connect WebSocket
  ws = new WebSocket(
    `wss://app.salesys.se/api/realtime/realtime-v1?roomId=${remoteToken}`
  );
  
  ws.addEventListener('message', handleWebSocketMessage);
  
  // Load existing messages
  loadMessages();
}

async function loadMessages() {
  const response = await fetch(
    `https://app.salesys.se/api/users/chat-messages-v1?token=${remoteToken}`
  );
  const messages = await response.json();
  displayMessages(messages);
}

async function sendMessage() {
  const input = document.getElementById('message-input');
  const text = input.value;
  
  await fetch('https://app.salesys.se/api/users/chat-messages-v1?token=' + remoteToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  
  input.value = '';
}

function handleWebSocketMessage(event) {
  const data = JSON.parse(event.data);
  
  if (data.type === "chatMessageCreated") {
    displayMessage(data.message);
  }
  
  if (data.type === "chatSessionUpdated") {
    updateTypingIndicator(data.session.isLocalTyping);
  }
}

// Initialize on page load
initChat();
</script>
```

### Backend Session Creation

```javascript
// Your backend endpoint
app.post('/api/create-chat-session', async (req, res) => {
  const { name, email } = req.body;
  
  const response = await fetch('https://app.salesys.se/api/users/chat-sessions-v1', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_SALESYS_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      local: {
        userId: "YOUR_AGENT_USER_ID"
      },
      remote: {
        name,
        email
      },
      reference: {
        chatUrl: `https://yoursite.com/chat?token={{TOKEN}}`
      }
    })
  });
  
  const data = await response.json();
  
  // Store session if needed
  // ...
  
  res.json({
    session: data.session,
    remoteToken: data.remoteToken
  });
});
```

### Polling for New Messages

If WebSocket not available:

```javascript
let lastMessageId = null;

setInterval(async () => {
  const response = await fetch(
    `https://app.salesys.se/api/users/chat-messages-v1?token=${remoteToken}&after=${lastMessageId || ''}`
  );
  
  const messages = await response.json();
  
  if (messages.length > 0) {
    messages.forEach(displayMessage);
    lastMessageId = messages[messages.length - 1].id;
    
    // Mark as seen
    await fetch('https://app.salesys.se/api/users/chat-messages-v1/see', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: messages.map(m => m.id),
        seen: true
      })
    });
  }
}, 3000);  // Poll every 3 seconds
```

## Local Name & Alias

**local.name** is shown to remote party:
- Defaults to user's first name
- Or user's alias (if set in SaleSys)
- Or specify in session creation

Set user alias in SaleSys > Inställningar > Användare.

## Troubleshooting

### WebSocket not connecting
- Check URL is `wss://` (not `ws://`)
- Verify roomId format (remoteToken or `auth:userId`)
- For local: include `authorization` parameter

### Messages not appearing
- Check WebSocket messages are being received
- Verify sessionId or token is correct
- Poll `/chat-messages-v1` as fallback

### Typing indicator stuck
- Implement 3-second timeout to hide
- Check `isTyping` updates are being sent
- Verify session updates trigger UI refresh

### Notifications not sent
- Check templates are configured
- Verify email/phone on remote party
- Notifications only sent after ~10min unread

## Swedish Terminology

| Svenska | English |
|---------|---------|
| Chatt | Chat |
| Meddelande | Message |
| Session | Session |
| Konversation | Conversation |
| Skriver | Typing |
| Oläst | Unread |
| Påminnelse | Notification/Reminder |

## MCP Tools

Use `salesys-mcp-server` skill to:
- Create sessions: `POST /api/users/chat-sessions-v1`
- Send messages: `POST /api/users/chat-messages-v1`
- Get messages: `GET /api/users/chat-messages-v1`
- Mark as seen: `POST /api/users/chat-messages-v1/see`

## Resources

- **WebSocket URL**: wss://app.salesys.se/api/realtime/realtime-v1
- **API Docs**: https://docs.salesys.io
- **Related Skills**: salesys-webhooks (chat events)
