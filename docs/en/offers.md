# Offers

## Short version

Offers in SaleSys are digital agreements sent to customers for signing. The feature requires **Offers** to be enabled under Settings > Features. You create offers based on templates that define the document layout, signing method, and which fields to include.

Offers are sent via email or SMS and can be signed digitally using different methods: Draw signature, One-click, BankID, or SMS reply. The entire lifecycle is tracked automatically -- from Pending to Distributed, Read, and Signed. When an offer is signed, an order can be created automatically.

Administrators configure offer templates under Settings > Offers > Templates, distribution settings under Settings > Offers > Distribution, and web forms under Settings > Offers > Web Forms.

## Full guide

### Overview

An offer goes through the following lifecycle:

```
Pending → Distributed → Read → Signed
                     ↘ Declined / Expired / Canceled
```

The status **Review Pending** may appear if the offer requires approval before being sent.

### Creating an offer

1. Go to **Offers** in the navigation
2. Select an **offer template** as the basis
3. Fill in recipient details (name, email, and/or phone)
4. Select products to include in the offer
5. Fill in any offer fields
6. Preview the offer as a PDF
7. Send via email or SMS

### Offer templates

Templates are created and managed under **Settings > Offers > Templates**.

**Template components (inserts):**
- **Field** -- Order fields, product fields, dates, names, and other dynamic values
- **Signature** -- Where the customer signs in the document
- **Text** -- Static text, terms, instructions

**Signing methods:**
| Method | Description |
|--------|-------------|
| **None** | No signing required |
| **Draw** | Customer draws their signature digitally |
| **One-click** | Customer signs with a single button press |
| **BankID** | Signing with Swedish BankID |
| **SMS reply** | Customer replies via SMS to confirm |

**Template settings:**
- Signing method
- Automatic order creation on signing
- Reminder rules for unsigned offers
- Visibility per user, team, and project
- Product restrictions
- Default messages

### Distribution

Offers are distributed via email and/or SMS. Settings are found under **Settings > Offers > Distribution**.

- **Message templates** -- Customize the text in distribution messages
- **Two-way SMS** -- Receive replies from customers via SMS
- **Reminders** -- Automatic reminders if the offer hasn't been signed

### Web forms

Web forms allow customers to fill in and create offers directly from your website. Requires **Offer Web Forms** to be enabled.

Configured under **Settings > Offers > Web Forms**.

**Form elements:**
- Text and headings
- Field lists (contact and order fields)
- Product lists
- Checkboxes and option lists
- Data retrieval (e.g., organization number lookup)
- Custom elements

The form guides the customer through multiple steps and automatically creates an offer with the filled-in information.

### PDF generation

- **Preview** -- Unsigned document for review
- **Signed agreement** -- Final document with signature as proof
- **Voucher** -- Automatically generated upon signing

### Offer chat

When enabled, you can communicate with the offer recipient through a built-in chat feature directly in the offer.

### Offer parts

Offers can have multiple parts for different recipients with separate product selections. Each part can have its own fields and products.

### Attachments

Files can be attached to offers to include additional documentation, terms, or appendices.

### Permissions and access

The offers feature requires **Feature.Offer** to be enabled. Additionally:

- Administrators can view and manage all offers
- Regular users see offers based on team membership
- Reviewing offers requires specific permissions

### Connections

- **Orders** -- An order is created automatically (or manually) when an offer is signed
- **Contacts** -- Contact details are auto-populated (name, email, phone)
- **Products** -- Offers contain product references with prices
- **Templates** -- Each offer is based on a template that controls layout and rules
