---
name: SaleSys Agreements (Avtal)
description: Use when creating, managing, or distributing agreements (avtal/offers) - digital contracts sent via email/SMS for customer signing.
---

# SaleSys Agreements (Avtal)

Use this skill when working with SaleSys agreements (avtal) - digital contracts sent to customers for signing.

## When to Use

- Creating agreements programmatically
- Sending agreements via email or SMS
- Managing agreement templates
- Uploading attachments to agreements
- Checking agreement status
- Working with products and fields

## Core Concepts

### Offer (Avtal)
A digital agreement sent to customers. Status flow:
- **pending** - Created but not sent
- **distributed** - Sent to customer
- **read** - Customer opened it
- **signed** - Customer signed
- **canceled** - Canceled
- **expired** - Expired (time limit passed)

### Offer Template (Avtalsmall)
Template defining:
- PDF layout
- Signing method (BankID, email, SMS)
- Fields and inserts
- Distribution settings

### Fields (Orderfält)
Form fields the seller fills: name, personal number, address, custom fields

### Products (Produkter)
Items/services being sold with their own fields and pricing

### Inserts
Placeholders in the PDF filled automatically from fields, products, dates, etc.

## Creating Agreements via MCP

### 1. Simple Agreement

```javascript
call_api(
  method="POST",
  path="/api/offers/offers-v2",
  body={
    "templateId": "TEMPLATE_ID",
    "fields": [
      { "fieldId": "FIRST_NAME_FIELD", "value": "John" },
      { "fieldId": "LAST_NAME_FIELD", "value": "Doe" },
      { "fieldId": "EMAIL_FIELD", "value": "john@example.com" }
    ],
    "products": [
      { "productId": "PRODUCT_ID", "quantity": 1 }
    ],
    "autoFill": {
      "addInsertsFromFields": true,
      "setRecipientFromFields": true
    },
    "distributeNow": {
      "email": [{
        "recipient": "john@example.com",
        "messageTemplateId": "TEMPLATE_ID"  // Optional
      }]
    },
    "userId": "USER_ID",  // Optional, seller
    "projectId": "PROJECT_ID"  // Optional
  },
  confirm=true
)

// Returns:
{
  "offerId": "...",
  "serialId": 410,  // Agreement number
  "linkId": "ABCD123",
  "linkUrl": "https://avtal.salesys.se/ABCD123"
}
```

### 2. Advanced (Without AutoFill)

```javascript
call_api(
  method="POST",
  path="/api/offers/offers-v2",
  body={
    "templateId": "TEMPLATE_ID",
    "fields": [...],
    "products": [...],
    "autoFill": false,
    "inserts": [
      { "insertId": "INSERT_1", "value": "Johan" },
      { "insertId": "INSERT_2", "value": "Karlskrona" }
    ]
  },
  confirm=true
)
```

## Distribution

### Send Email

```javascript
// After creation
call_api(
  method="POST",
  path="/api/offers/offer-distribution-v1/{offerId}/email",
  body={
    "recipient": "john@example.com",
    "messageTemplateId": "TEMPLATE_ID"  // Optional
  },
  confirm=true
)

// Without recipient (uses agreement's recipient)
call_api(
  method="POST",
  path="/api/offers/offer-distribution-v1/{offerId}/email",
  body={},
  confirm=true
)
```

### Send SMS

```javascript
call_api(
  method="POST",
  path="/api/offers/offer-distribution-v1/{offerId}/sms",
  body={
    "recipient": "+46700000000",
    "messageTemplateId": "TEMPLATE_ID"  // Optional
  },
  confirm=true
)
```

## Attachments (Bilagor)

Upload HTML or PDF files as attachments (merged into agreement PDF):

```javascript
// 1. Enable attachments on template (in SaleSys UI)

// 2. Upload file
const formData = new FormData();
formData.append('file', fileObject);

call_api(
  method="POST",
  path="/api/offers/offers-v1/{offerId}/files",
  body=formData,
  confirm=true
)

// 3. Send agreement - attachments auto-merged
```

**Note**: Use `multipart/form-data` for file uploads (not JSON).

## Products & Fields

### Get Products

```javascript
call_api(method="GET", path="/api/products/products-v1")
```

### Get Product Categories

```javascript
call_api(method="GET", path="/api/products/product-categories-v1")
```

### Get Product Fields

```javascript
call_api(method="GET", path="/api/products/product-fields-v1")
```

### Get Order Fields

```javascript
// Fields available when creating agreements
call_api(method="GET", path="/api/offers/offer-fields-v1")
```

## Templates

### List Templates

```javascript
call_api(method="GET", path="/api/offers/offer-templates-v1")
```

### Get Template

```javascript
call_api(
  method="GET",
  path="/api/offers/offer-templates-v1/{templateId}"
)
```

## Agreement Management

### Get Agreement

```javascript
call_api(method="GET", path="/api/offers/offers-v2/{offerId}")
```

### List Agreements

```javascript
call_api(
  method="GET",
  path="/api/offers/offers-v2",
  query={
    "limit": 50,
    "status": "signed",  // Filter by status
    "userId": "USER_ID"  // Filter by user
  }
)
```

### Count Agreements

```javascript
call_api(
  method="GET",
  path="/api/offers/offers-v1/count",
  query={
    "status": "signed",
    "createdAfter": "2024-01-01"
  }
)
```

### Update Agreement

```javascript
call_api(
  method="PUT",
  path="/api/offers/offers-v2/{offerId}",
  body={
    "fields": [
      { "fieldId": "FIELD_ID", "value": "Updated value" }
    ]
  },
  confirm=true
)
```

### Cancel Agreement

```javascript
call_api(
  method="POST",
  path="/api/offers/offers-v1/{offerId}/cancel",
  confirm=true
)
```

## Comments & Files

### Add Comment

```javascript
call_api(
  method="POST",
  path="/api/offers/offers-v1/{offerId}/comments",
  body={
    "text": "Customer requested changes"
  },
  confirm=true
)
```

### List Comments

```javascript
call_api(
  method="GET",
  path="/api/offers/offers-v1/{offerId}/comments"
)
```

### List Files

```javascript
call_api(
  method="GET",
  path="/api/offers/offers-v1/{offerId}/files"
)
```

## Common Patterns

### Create & Send in One Step

```javascript
const result = call_api(
  method="POST",
  path="/api/offers/offers-v2",
  body={
    // ... agreement data
    "distributeNow": {
      "email": [{
        "recipient": "customer@example.com"
      }]
    }
  },
  confirm=true
);

// Returns linkUrl immediately
console.log(result.linkUrl);
```

### Bulk Create Agreements

```javascript
const customers = [...];  // Array of customer data

for (const customer of customers) {
  await call_api(
    method="POST",
    path="/api/offers/offers-v2",
    body={
      "templateId": "TEMPLATE_ID",
      "fields": [
        { "fieldId": "NAME_FIELD", "value": customer.name },
        { "fieldId": "EMAIL_FIELD", "value": customer.email }
      ],
      "products": [{ "productId": "PRODUCT_ID", "quantity": 1 }],
      "autoFill": {
        "addInsertsFromFields": true,
        "setRecipientFromFields": true
      }
    },
    confirm=true
  );
  
  // Rate limit: wait between requests
  await new Promise(resolve => setTimeout(resolve, 100));
}
```

### Check Agreement Status

```javascript
const offer = await call_api(
  method="GET",
  path="/api/offers/offers-v2/{offerId}"
);

if (offer.status === "signed") {
  console.log("Agreement signed!");
  // Trigger fulfillment
} else if (offer.status === "expired") {
  console.log("Agreement expired, send reminder");
}
```

### Custom Pricing

```javascript
call_api(
  method="POST",
  path="/api/offers/offers-v2",
  body={
    // ...
    "products": [{
      "productId": "PRODUCT_ID",
      "quantity": 2,
      "price": 199,  // Custom price
      "fields": [
        { "fieldId": "PRODUCT_FIELD", "value": "Premium" }
      ]
    }],
    "autoFill": {
      "addInsertsFromFields": true,
      "setRecipientFromFields": true
    }
  },
  confirm=true
)
```

## AutoFill Options

```javascript
{
  "autoFill": {
    // Copy fields → inserts automatically
    "addInsertsFromFields": true,
    
    // Set recipient from email/phone fields
    "setRecipientFromFields": true,
    
    // Copy product info → inserts
    "addInsertsFromProducts": true  // Usually automatic
  }
}
```

## Message Templates (Utskicksmallar)

Templates for email/SMS distribution:

### List Templates

```javascript
call_api(
  method="GET",
  path="/api/offers/message-templates-v1"
)
```

Templates define:
- Subject line
- Message text (with variables like `[[name]]`)
- Sender name/number

## API Versions

### v3 (Latest)
- Path: `/api/offers/offers-v3`
- Recommended for new integrations

### v2 (Stable)
- Path: `/api/offers/offers-v2`
- Most commonly used
- Compatible with most features

### v1 (Legacy)
- Path: `/api/offers/offers-v1`
- Still supported for some operations (files, comments)
- Use v2/v3 for creating agreements

## Authentication

When creating agreements as a **system user**, you can set the seller:

```javascript
{
  "userId": "SELLER_USER_ID",  // Agreement attributed to this user
  // ...
}
```

As a **regular user**, agreements are always attributed to you (userId is ignored).

## Projects

Group agreements by project:

```javascript
{
  "projectId": "PROJECT_ID",
  // ...
}
```

Get projects:

```javascript
call_api(method="GET", path="/api/users/projects-v1")
```

## Troubleshooting

### "Template not found"
- Verify templateId is correct
- Check template is enabled
- Ensure user has access to template

### "Field not found"
- Use correct fieldId (not field name)
- Verify field exists in template
- Check field is not archived

### "Product not found"
- Use correct productId
- Ensure product is active
- Check product is in correct category

### "Distribution failed"
- Verify email/phone format
- Check recipient is not on exclude list
- Ensure template has distribution settings

### "Inserts not filled"
- Use autoFill for automatic mapping
- Or provide inserts manually
- Check insert IDs match template

## Swedish Terminology

| Svenska | English |
|---------|---------|
| Avtal | Agreement/Offer |
| Avtalsmall | Agreement template |
| Orderfält | Order field |
| Produkt | Product |
| Insättning | Insert |
| Utskick | Distribution |
| Utskicksmall | Message template |
| Bilaga | Attachment |
| Signering | Signing |
| Status | Status |
| Mottagare | Recipient |

## MCP Tools

Use `salesys-mcp-server` skill to:
- Create agreements: `POST /api/offers/offers-v2`
- Distribute: `POST /api/offers/offer-distribution-v1/{offerId}/email`
- Get products: `GET /api/products/products-v1`
- Manage templates: `GET /api/offers/offer-templates-v1`

## Resources

- **Customer Portal**: avtal.salesys.se (where customers sign)
- **API Docs**: https://docs.salesys.io
- **Related Skills**: salesys-web-forms (form-based creation), salesys-webhooks (agreement events)
