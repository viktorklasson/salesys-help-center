---
name: SaleSys Custom Views (Egna vyer)
description: Use when building custom views in SaleSys - standalone HTML/Handlebars pages with custom logic, forms, and integrations. Access from settings or navigation menu.
---

# SaleSys Custom Views (Egna vyer)

Use this skill when helping users create or modify custom views (egna vyer) in SaleSys - standalone HTML pages with custom functionality.

## When to Use

- Building custom dashboards or tools
- Creating specialized forms or workflows
- Adding integrations visible in SaleSys UI
- Showing custom data views or reports
- Building admin or configuration interfaces

## What Are Custom Views?

Custom views are standalone HTML/Handlebars pages that:
- Use `window.form.custom` and `window.form.setState` for state management
- Can access SaleSys APIs with `window.getAccessToken()`
- Appear in Settings or Navigation menu
- Support custom permissions (rights)
- Can have settings views (inställningsvyer) for configuration

## Key Concepts

### Locations
Views can appear in:
- **settings** - Under Inställningar menu
- **navigation** - Main navigation bar (position -1 = left section, >4 = right of Settings)
- **widgets** / **widgetsLeft** - As sidebar tabs

### State Management
```javascript
// Set custom state
window.form.setState({ myData: "value" });

// Access state
window.form.custom.myData; // "value"

// Use callback for updates based on previous state
window.form.setState(state => ({ count: state.count + 1 }));
```

### API Access
```javascript
// Get access token from cookies
const token = window.getAccessToken();

// Or parse cookies manually
const cookies = document.cookie.split(';').reduce((obj, cookie) => {
  const [key, value] = cookie.trim().split('=');
  obj[key] = value;
  return obj;
}, {});
const token = cookies["s2_utoken"];

// Call SaleSys API
const response = await fetch('https://app.salesys.se/api/contacts/contacts-v1', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Creating Views via MCP

### 1. Create a View
```javascript
call_api(
  method="POST",
  path="/api/users/views-v1",
  body={
    "name": "Min vy",
    "html": "<div>View content</div>",
    "teamIds": [],  // Empty = admin only
    "roleIds": [],  // Additional roles with access
    "projectIds": null,  // null = all projects
    "iconName": "user-ninja",  // FontAwesome 5 icon
    "iconColor": "#1565c0",
    "locations": [{
      "type": "settings",
      "position": 0,
      "label": "Vyn"
    }],
    "rights": [{
      "right": "canEdit",
      "name": "Kan redigera",
      "description": "Tillåter redigering"
    }]
  },
  confirm=true
)
```

### 2. Update a View
```javascript
call_api(
  method="PUT",
  path="/api/users/views-v1/{viewId}",
  body={
    "html": "<div>Updated content</div>",
    "name": "Uppdaterad vy"
  },
  confirm=true
)
```

### 3. Delete a View
```javascript
call_api(
  method="DELETE",
  path="/api/users/views-v1/{viewId}",
  confirm=true
)
```

## Common Patterns

### Navigate to Another Page
```javascript
window.form.navigate("/calendar");
```

### Show Notifications
```javascript
// Simple notification
window.form.notify("Saved successfully", "ok");

// Advanced notification
window.form.notify({
  id: "myNotif",
  title: "Done",
  body: "Operation completed",
  icon: { name: "check" }
});

// Remove notification
window.form.deleteNotification('myNotif');
```

### Set Page Title
```javascript
window.form.setTitle('Custom Title');
window.form.setTitle(null); // Reset to view name
```

### Format Text with Contact Info
```javascript
// Insert contact information (from current call)
window.form.formatText("Hej [[förnamn]]"); // "Hej Kalle"

// With additional variables
window.form.formatText("Hej [[customVar]]", { customVar: "World" });

// Debug available fields
window.form.formatTextDebug("[[förnamn]]");
// Returns: { result: "Kalle", data: {...} }
```

### Custom Validation
```javascript
// Set validation message (blocks form submission)
window.form.setValidationMessage('email', 'Vänligen ange epost');

// Remove validation
window.form.setValidationMessage('email', null);
// or
window.form.removeValidationMessage('email');
```

### Hooks (React-style)
```javascript
// Run code on every state update
window.form.addHook('myHook', () => {
  // Always compare previous values to avoid infinite loops!
  const newValue = calculateSomething();
  if (window.form.custom.value !== newValue) {
    window.form.setState({ value: newValue });
  }
});
```

### Modals
```javascript
// HTML content with modal attribute
// <div class="my-modal" modal>...</div>

// Open modal
window.form.openModal('.my-modal', {
  title: 'My Modal',
  size: 'medium',  // small, medium, large
  go: {
    children: 'Fortsätt',
    type: 'next',  // danger, next, nextSimple, ok, okSimple
    onClick: async () => {
      await doSomething();
      return true; // true closes modal
    }
  },
  cancel: {
    onClick: () => {
      window.form.notify('Avbruten');
      return false; // false keeps modal open
    }
  }
});

// Update modal
window.form.setModal({ title: "New Title" });
window.form.setModal(modal => ({
  go: { ...modal.go, disabled: true }
}));
```

### File Upload
```javascript
const formData = new FormData();
formData.append('public', 'true');
formData.append('usage', 'File for custom view');
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/users/files-v1', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${window.getAccessToken()}`
  }
});

const { key, url } = await response.json();
// url is public if public=true
// otherwise fetch via /api/users/files-v1/{key}
```

### Check Permissions
```javascript
// Check view-specific rights
if (window.form.rights.includes("canEdit")) {
  // Has permission
}

// Check system rights
if (window.form.currentUser.rights.includes("orders.getAll")) {
  // Can see all orders
}

// Admin always has all rights
if (window.form.currentUser.type === 'admin') {
  // Is admin
}
```

### Field Properties (Contact/Order Fields)
```javascript
// Make field read-only
window.form.setFieldProperties('telefonnummer', { readOnly: true });
window.form.setFieldProperties('förnamn', { readOnly: true });

// By field ID
window.form.setFieldProperties('6a69ade93e46511962ddb601', { readOnly: true });

// Only for order or contact fields
window.form.setFieldProperties('telefonnummer', { 
  readOnly: true, 
  orderField: true, 
  contactField: false 
});

// Reset
window.form.setFieldProperties('telefonnummer', null);

// Set all at once
window.form.setAllFieldProperties({
  "telefonnummer": { readOnly: true },
  "förnamn": { readOnly: false }
});

// Default for all fields
window.form.setDefaultFieldProperties({ readOnly: true });
```

## Background Views

Views can run in the background (scripts execute without visiting the page):
```javascript
{{#if isBackground}}
<script>
  // Code runs in background
  // Useful with window.form.addHook
</script>
{{/if}}

// Check if background
window.form.isBackground // true/false
```

Access SaleSys without background views: `https://app.salesys.se/?safe` or `?disableBackgroundViews`

## Settings Views (Inställningsvyer)

View templates can have settings views where customers configure the view:

### Settings Storage
```javascript
// Settings saved per account
window.form.settings // { ... }

// Update settings
window.form.setSettings({ apiKey: "..." });
```

### Validation
```javascript
// Require settings before view can be saved
window.form.setValidationMessage('apiKey', 'API key required');
window.form.removeValidationMessage('apiKey');
```

## View Templates (Vymallar)

Reusable view templates for distribution:

### List Templates
```javascript
call_api(method="GET", path="/api/users/view-presets-v1")
```

### Get Template
```javascript
call_api(method="GET", path="/api/users/view-presets-v1/{presetId}")
```

### Update Template
```javascript
call_api(
  method="PUT",
  path="/api/users/view-presets-v1/{presetId}",
  body={
    "name": "Template Name",
    "html": "<div>...</div>",
    "settingsHtml": "<div>Settings UI</div>",
    "entityGroupIds": ["..."],  // See entity groups
    "rights": [...]
  },
  confirm=true
)
```

## Best Practices

1. **Use hooks**: Run logic on state updates, always check previous values
2. **Check isScriptActive**: In setInterval/setTimeout, verify user is still on view
3. **Preserve Swedish terms**: Keep UI labels as users see them (e.g. "förnamn", not "firstName")
4. **Validate input**: Use `setValidationMessage` for required fields
5. **Handle background state**: Check `isBackground` if view runs in background
6. **Test permissions**: Always check `window.form.rights` before showing admin features
7. **Never log tokens**: Be careful with access tokens in console.log

## Swedish Terminology

| Svenska | English |
|---------|---------|
| Vy | View |
| Egna vyer | Custom views |
| Inställningsvy | Settings view |
| Vymall | View template |
| Rättigheter | Rights/Permissions |
| Flik | Tab/Widget |
| Modal | Modal |
| Fält | Field |

## MCP Tools

Use the `salesys-mcp-server` skill to:
- Create/update views: `POST/PUT /api/users/views-v1`
- Manage templates: `/api/users/view-presets-v1`
- Entity groups: `/api/users/entity-groups-v1`

## Resources

- **View Presets**: https://skills.salesys.se (external view templates)
- **FontAwesome Icons**: https://fontawesome.com/v5/search
- **API Docs**: https://docs.salesys.io
