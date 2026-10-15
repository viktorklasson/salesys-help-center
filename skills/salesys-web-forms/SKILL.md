---
name: SaleSys Web Forms (Webbformulär)
description: Use when integrating SaleSys web forms on customer websites for lead capture, order submission, and agreement signing.
---

# SaleSys Web Forms (Webbformulär)

Use this skill when helping users integrate SaleSys web forms on their websites for capturing leads and creating orders/agreements.

## When to Use

- Embedding order forms on customer websites
- Creating lead capture forms
- Building product selection interfaces
- Integrating agreement signing flows
- Customizing form appearance and behavior

## What Are Web Forms?

Web forms are embeddable HTML forms that:
- Load in an iframe on customer websites
- Create orders or agreements in SaleSys
- Support product selection and custom fields
- Handle BankID signing (Sweden/Norway)
- Can be styled to match brand
- Work with state management like custom views

## Basic Integration

### 1. Load Web Form Script

```html
<div id="form-container"></div>

<script>
const webFormScript = document.createElement('script');
webFormScript.src = "https://salesys.se/scripts/web_form1.js";
document.body.appendChild(webFormScript);

webFormScript.addEventListener('load', function () {
  window.myForm = createWebForm(
    document.querySelector('#form-container'),
    'FORM_ID_FROM_SALESYS',
    {
      width: '100%',
      theme: {
        colorPrimary: '#1665c0',
        colorBackground1: '#ffffff',
        colorText1: '#1a1a1a'
      },
      lang: 'sv',  // sv, no, us
      test: true,  // Create test orders
      navigateNewPage: true,  // Open new tab on submit
      onSubmit: () => console.log('Form submitted'),
      autoScrollOffset: 48  // Scroll offset for fixed headers
    }
  );
});
</script>
```

### 2. Set Product Programmatically

```javascript
// Select product
window.myForm.setProduct('PRODUCT_ID');

// Or multiple products
window.myForm.setProducts(['PRODUCT_ID_1', 'PRODUCT_ID_2']);
```

### 3. Pre-fill Fields

```javascript
window.myForm.setFields([
  { fieldId: "FIELD_ID_1", value: "John Doe" },
  { fieldId: "FIELD_ID_2", value: "john@example.com" }
]);
```

## State Management

Web forms use the same state system as custom views:

### Set Custom State

```javascript
window.form.setState({ 
  userAgent: navigator.userAgent,
  hasClickedAnywhere: true 
});

// With callback
window.form.setState(state => ({
  isOn: !state.isOn
}));

// Access state
window.form.custom.userAgent
```

### Product Management

```javascript
// Set product field
window.form.setProductField("FIELD_ID", "60 GB");

// Set field on specific product (by index or ID)
window.form.setProductField("FIELD_ID", "32 GB", 1);
window.form.setProductField("FIELD_ID", "16 GB", "PRODUCT_ID");

// Clear fields
window.form.setProductFields([]);

// Update with callback
window.form.setProductFields(fields => 
  fields.map(field => ({ ...field, value: field.value.toUpperCase() }))
);

// Set quantity
window.form.setProductQuantity(5);
window.form.setProductQuantity(qty => qty + 1);

// Set price (requires custom pricing enabled)
window.form.setProductPrice(200);
window.form.setProductPrice(price => price * 0.9);  // 10% discount
```

### Form Fields

```javascript
// Set single field
window.form.setField("FIELD_ID", "Kalle");

// Set multiple fields
window.form.setFields([
  { fieldId: "FIELD_ID_1", value: "Kalle" },
  { fieldId: "FIELD_ID_2", value: "Kråka" }
]);

// Access field values
window.form.input.fields["FIELD_ID"]  // "Kalle"
```

### User & Template

```javascript
// Set user (requires allowUserId: true on form)
window.form.setUser("USER_ID");

// Set agreement template
window.form.setTemplate("TEMPLATE_ID");

// Reset to default (template chosen by product)
window.form.setTemplate(null);
```

### Additional Pages

```javascript
// Set extra pages for agreement
window.form.setAdditionalPages(["page1", "page2"]);

// Add page
window.form.addAdditionalPage("page3");

// Remove page
window.form.removeAdditionalPage("page1");
```

## Navigation Control

```javascript
// Hide next button
window.form.hideNavigateNext();
window.form.hideNavigateNext("validationError");  // With reason

// Show next button
window.form.showNavigateNext();
window.form.showNavigateNext("validationError");  // Clear specific reason

// Navigate programmatically
window.form.next();      // Go to next step
window.form.previous();  // Go back
```

## Validation

```javascript
window.form.setValidationMessage('email', 'Please enter email');
window.form.removeValidationMessage('email');

// In hook
window.form.addHook('validate', () => {
  let message = "";
  if (!window.form.custom.isValid) {
    message = "Check your input";
  }
  if (window.form.custom.message !== message) {
    window.form.setState({ message });
  }
});
```

## Custom Submission

### Prevent Default Redirect

```javascript
window.form.setSubmitHook(async () => {
  // Custom logic before submit
  await sendToAnalytics(window.form.input);
  
  // Prevent default (no agreement created)
  return { preventDefault: true };
});
```

### Submit Without Redirect

```javascript
// Hide default next button
window.form.hideNavigateNext();

// Custom submit button
async function handleCustomSubmit() {
  const result = await window.form.internal.submit({
    redirect: false  // Don't redirect to avtal.salesys.se
  });
  
  if (result) {
    console.log("Created:", result.offerId);
    console.log("URL:", result.url);
    
    // Show custom success page
    showSuccessPage(result);
  } else {
    console.log("Error occurred");
  }
}

// Access submission data after
window.form.internal.offerId        // Agreement ID
window.form.internal.offerUrl       // Agreement URL
window.form.internal.submitResult   // Full result object
window.form.internal.isSubmitting   // Currently submitting?
```

## BankID Integration

### Get Agreement Status

```javascript
// No auth needed (uses skaffa.salesys.se to avoid CORS)
const response = await fetch(
  `https://skaffa.salesys.se/api/offers/offer-information-v1/status?offerIds=${offerId}`
);
const data = await response.json();
// Check if signed/canceled/etc
```

### Get BankID Session Status

```javascript
const response = await fetch(
  `https://skaffa.salesys.se/api/offers/offer-information-v1/bankIdSession?offerIds=${offerId}`
);
// Check if app opened, session canceled, etc
```

### Create BankID Session

```javascript
const response = await fetch(
  `https://skaffa.salesys.se/api/offers/bankid-v2/sign/${offerId}`,
  { method: 'POST' }
);

const { autoStartToken, qrStartToken } = await response.json();

// For same device:
window.location.href = `bankid:///?autostarttoken=${autoStartToken}&redirect=...`;

// For QR code (other device):
// Poll every second and generate QR from data
const qrResponse = await fetch(
  `https://skaffa.salesys.se/api/offers/bankid-v2/qr/${offerId}?startToken=${qrStartToken}`
);
const { data } = await qrResponse.json();
// Generate QR code from 'data' string
```

### Get Redirect URL

```javascript
const response = await fetch(
  `https://skaffa.salesys.se/api/offers/offer-information-v1/status-links?offerIds=${offerId}`
);
const data = await response.json();
const signedUrl = data[0].statusLinks.signed.url;
// Redirect user to thank-you page
```

## Styling

### Theme Object

```javascript
{
  theme: {
    colorBackground1: '#ffffff',   // Main background
    colorText1: '#1a1a1a',          // Text color
    colorPrimary: '#1665c0',        // Primary/accent color
    // Many more properties available
  }
}
```

### Container Style (Completion Forms Only)

```javascript
// For forms on avtal.salesys.se (completion forms)
window.form.setContainerStyle({ 
  padding: '24px 48px' 
});
```

## Hooks

```javascript
window.form.addHook('updateHeader', () => {
  const header = "Date: " + new Date().toDateString();
  
  // Always compare to prevent infinite loops
  if (window.form.custom.header !== header) {
    window.form.setState({ header });
  }
});
```

## Custom Text (Editable Labels)

```javascript
// In HTML
const message = "[[text 'Error message']]";

// Or JavaScript
window.form.addHook('validate', () => {
  const message = window.form.custom.isValid 
    ? "" 
    : "[[text 'Check your input']]";
  
  if (window.form.custom.message !== message) {
    window.form.setState({ message });
  }
});
```

Text blocks can be edited in SaleSys without code changes.

## Form Templates (Formulärmallar)

Reusable form templates similar to view templates:

### Structure

```javascript
{
  "name": "Lead Capture Form",
  "html": "<Field>...</Field>",
  "settingsHtml": "<Field label='API Key'>...</Field>",  // Settings UI
  "entityGroupIds": ["GROUP_ID"],
  // ... same as view templates
}
```

### Settings

```javascript
// Access template settings
window.form.settings.apiKey

// Update settings (from settings UI)
window.form.setSettings({ apiKey: "new-key" });
```

## Handlebars in Forms

### Conditionals

```html
{{#if custom.isOn}}
  It's on!
{{else}}
  It's off...
{{/if}}

{{#ifEq input.fields.FIELD_ID "Johan"}}
  I know you.
{{/ifEq}}

{{#either custom.isOn custom.isAlwaysOn}}
  It's on either way!
{{/either}}
```

### Loops

```html
{{#each custom.products}}
  {{#with (lookup ../input.products id)}}
    Port number: {{fields.FIELD_ID}}
  {{/with}}
{{/each}}
```

### Math & Dates

```html
Next year: {{math input.fields.AGE_FIELD "+" 1}}

Start date: {{formatDate custom.startDate "DD/MM/YYYY"}}
```

## Managing Forms via API

Forms are typically created in SaleSys UI, but can be managed via API:

```javascript
// List forms
call_api(method="GET", path="/api/offers/web-forms-v1")

// Update form settings
call_api(
  method="PUT",
  path="/api/offers/web-forms-v1/{formId}",
  body={
    "allowUserId": true,  // Allow setting user programmatically
    // Other settings...
  },
  confirm=true
)
```

## Common Patterns

### Dynamic Product Selection

```javascript
// Load products from API
const products = await fetchProducts();

// Let user select
function selectProduct(productId) {
  window.myForm.setProduct(productId);
}
```

### UTM Tracking

```javascript
const params = new URLSearchParams(window.location.search);
window.form.setState({
  utm_source: params.get('utm_source'),
  utm_campaign: params.get('utm_campaign')
});

// Include in custom fields or external webhook
```

### A/B Testing

```javascript
const variant = Math.random() < 0.5 ? 'A' : 'B';
window.form.setState({ variant });

// Different flow based on variant
if (variant === 'A') {
  window.myForm.setProduct('PRODUCT_A');
} else {
  window.myForm.setProduct('PRODUCT_B');
}
```

## Debugging

### Console Inspection

```javascript
// Check form state
console.log(window.form.custom);

// Check input
console.log(window.form.input);

// Check product info
console.log(window.form.input.products);
```

### Test Mode

```javascript
createWebForm(container, formId, {
  test: true,  // Creates test orders/agreements
  // ...
});
```

## Swedish Terminology

| Svenska | English |
|---------|---------|
| Webbformulär | Web form |
| Formulärmall | Form template |
| Fält | Field |
| Produkt | Product |
| Avtal | Agreement/Offer |
| BankID | BankID (electronic ID) |
| Signering | Signing |
| Extrasida | Additional page |

## MCP Tools

Use `salesys-mcp-server` skill to:
- List forms: `GET /api/offers/web-forms-v1`
- Get products: `GET /api/products/products-v1`
- Manage form templates: `/api/offers/form-presets-v1`

## Resources

- **Script URL**: https://salesys.se/scripts/web_form1.js
- **BankID Docs**: https://www.bankid.com/developers
- **API Docs**: https://docs.salesys.io
- **Related Skills**: salesys-agreements, salesys-custom-views
