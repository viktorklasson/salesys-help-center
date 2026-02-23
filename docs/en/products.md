# Products

## Short version

Products in SaleSys are organized in categories and used when creating orders and offers. Only administrators can create product categories and products. Each product has a name, price, VAT, product fields, and can have team-specific pricing.

Product categories are configured under Settings > Products and control which order fields are displayed, which teams have access, and which projects they belong to. Product fields are custom fields that can be static or fillable depending on the category.

When creating orders and offers, products are selected from categories. Product information is saved as snapshots -- if a product is changed afterward, existing orders are not affected. The product finder (Shift+Shift) provides quick access to products via text search.

## Full guide

### Product categories

Categories are managed under **Settings > Products**.

**Creating a category:**
1. Go to Settings > Products
2. Click **Create category**
3. Enter name and optionally a project
4. Save

**Category settings:**
- **Name** -- Category name
- **Visibility** -- Which teams can see the category (null = everyone)
- **Order field visibility** -- Which order fields appear when this category is selected
  - **Include** -- Show only these fields
  - **Exclude** -- Show all except these fields
- **Projects** -- Restrict to specific projects
- **Express flow hostnames** -- On which websites the category appears
- **Product fields** -- Custom fields for the category's products

Categories can be reordered with drag-and-drop. Deleting a category also removes all its products (soft delete).

### Products

**Creating a product:**
1. Go to a product category
2. Click **Add product**
3. Fill in product information

**Product properties:**

| Property | Description |
|----------|-------------|
| **Name** | Product display name |
| **Price** | Default price |
| **Price min/max** | Price range for validation |
| **Price options** | Predefined prices to choose from |
| **VAT** | VAT rate in percent (0-100, typically 25%) |
| **Salary basis** | Alternative value for HR calculations |
| **Input type** | What the user enters: None, Quantity, or Price |
| **Image** | Product image (upload) |
| **Visible in express flows** | Show in quick flows |
| **Visible in web forms** | Show in offer web forms |
| **Calendar duration** | Meeting length in minutes (for calendar integration) |

### Pricing

**Default price:** All users see the same price.

**Price range:** Min and max limits are validated during order entry.

**Price options:** List of selectable prices (displayed as dropdown).

**Team-specific pricing:**
Products can have separate price lists per team:
- Each configuration has its own price, range, and options
- Team members automatically see the correct price list
- Administrators see the default price list
- Configured in product settings under the "Configurations" tab

**VAT calculation:**
```
Price excluding VAT = Price x (100 - VAT percent) / 100
```

### Product fields

Product fields are custom fields that can be assigned to products. Managed under **Settings > Product Fields**.

**Field properties:**
- **Label** -- Field name
- **Categories** -- Which categories use the field
- **Input categories** -- In which categories the field can be filled in
  - `null` = Static field (read-only)
  - Empty list = Fillable in all categories
  - Specific IDs = Fillable only in those categories
- **Predefined values** -- Selectable options (can be project-specific)
- **Default value** -- Auto-filled when creating a product

Deleting a product field permanently removes it from all products.

### Product finder

Press **Shift+Shift** to open the product finder.

- Searches product names and field values
- Multi-word search (space-separated)
- Ranks results by relevance
- Shows matching fields highlighted
- Close with Escape

### Product selection in orders and offers

**ProductSelectList:**
- Shows products per category with checkboxes
- Depending on `inputType`:
  - **Quantity** -- Input field for quantity
  - **Price** -- Input field or dropdown with price options
- Disabled products cannot be selected

**Snapshots:**
When a product is selected in an order or offer, a copy of the product data (name, price, VAT, fields) is saved. Changes to the product afterward do not affect existing orders.

### Permissions

| Permission | Description |
|------------|-------------|
| **Admin** | Create/delete categories, products, and fields |
| `ProductsUpdate` | Edit existing products (can be granted to non-admins) |
| `ProductsGetPrice` | View product prices (otherwise salary basis is shown) |

### Connections

- **Orders** -- Products are selected when creating orders, price and VAT are calculated
- **Offers** -- Products are included in offer templates
- **Order fields** -- Category visibility controls which order fields are displayed
- **Projects** -- Categories can be restricted to projects
- **Teams** -- Categories and prices can vary per team
