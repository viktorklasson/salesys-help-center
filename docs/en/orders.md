# Orders

## Short version

Orders are the core of SaleSys and represent completed sales. You create orders under **Orders** in the navigation by clicking **Add**. Each order contains custom order fields, product selections, tags, and optionally attached files.

Order fields are configured by administrators under Settings > Order > Information. Fields can be of various types (text, number, date, phone, email, etc.) and can be linked to contact fields for automatic population. Which fields are displayed can be controlled per product category.

Tags are used to mark order status and can be configured under Settings > Order > Tags. A tag can be negating (return), locking (admin-only editing), or default (auto-applied). Under Settings > Order > Utilities, you can configure automated workflows that run after an order is created, such as sending SMS, emails, or making HTTP calls.

## Full guide

### Creating an order

1. Go to **Orders** in the navigation
2. Click **Add** (requires the `OrdersCreate` permission)
3. Fill in the following sections:

#### Basic information
- **Seller** -- Select which user the order belongs to (only visible for administrators)
- **Business date** -- Optional date for when the sale occurred
- **Order fields** -- Fill in the custom fields configured by your organization

#### Product selection
- Select products from available product categories
- Enter quantity or price depending on the product's configuration
- Product information is saved as a snapshot at the time of ordering

#### Tags
- Default tags are added automatically
- You can add or remove tags (unless the order is locked)

#### Calendar events
- If the project requires it, you can link the order to a calendar event

#### Files
- Attach files to the order during creation or afterward

4. Click **Save**

### Order fields

Order fields are custom information fields configured by administrators under **Settings > Order > Information**.

**Field types:**
- Text
- Number
- Email
- Phone number
- Date
- Yes/No (Boolean)
- Personal identity number
- Dropdown (predefined values)

**Field properties:**
- **Required** -- Field must be filled in
- **Validation** -- Regex patterns, min/max length
- **Description** -- Help text displayed to the user
- **Confidential** -- Hidden from regular users (admin only)
- **Default date** -- Auto-fill with a relative date

**Contact field mapping:**
Order fields can be linked to contact fields via Settings > Automation > Field Linking. When an order is created from a contact, the order fields are populated automatically.

**Visibility per product category:**
Under each product category, you can choose which order fields to show or hide when that category is selected.

### Order tags

Tags are configured under **Settings > Order > Tags**.

**Tag properties:**
| Property | Description |
|----------|-------------|
| **Name** | Display name of the tag |
| **Color** | Visual color code |
| **Negating** | Marks the order as a return/cancellation (affects sum calculations) |
| **Locking** | Only administrators can edit the order |
| **Default** | Automatically added to new orders |
| **Category** | Optional grouping |
| **Project** | Restrict to specific projects |
| **Team access** | Restrict to specific teams |

### Order utilities (After-order-work)

Automated workflows that run after an order is created. Configured under **Settings > Order > Utilities**.

**Action types:**
- **SMS** -- Send SMS to seller, contact, or custom number
- **Email** -- Send email with attachments
- **HTTP request** -- Make calls to external services with field mappings
- **Document** -- Create documents from order data

Actions can have conditions based on projects, field values, and tags. Multiple actions can run in sequence.

### Order list

The order list displays all orders you have access to with powerful filtering capabilities.

**Filters:**
- **Date range** -- Filter by creation date or business date
- **Date strategy** -- Choose which date type to use
- **Users/Teams** -- Show orders from specific sellers or teams
- **Tags** -- Filter by one or more tags (all/any/none)
- **Fields** -- Filter by field values
- **Products** -- Filter by product category
- **Text search** -- Search in order fields (encrypted search)

**Sorting:**
Sort by date, serial number, user, or business date.

**Columns:**
Customizable columns including seller, serial number, total, date, tags, products, lead list, and custom order fields.

**Quick statistics:**
When filters are active, summaries are shown for non-negating orders, negating orders (returns), and optional field sums.

### Exporting orders

1. Open the order list
2. Click **Export** (requires `OrdersCreate`)
3. Select a date range or export all with current filters
4. Choose format: **CSV** or **XLSX**
5. The file downloads as `orderexport-YYYY-MM-DD`

The export includes serial number, dates, seller, products, field values, tags, and totals.

### Order parts

Orders can be divided into parts with separate fields. Each part can be edited separately and appears as expandable rows in the order list.

### Permissions

| Permission | Description |
|------------|-------------|
| `OrdersCreate` | Create new orders |
| `OrdersGetAll` | View all organization orders |
| `OrdersGetByOwnTeam` | View orders from own team |
| `OrdersGetOwn` | View only own orders |
| `OrdersUpdate` | Edit orders |
| `OrdersDelete` | Delete any order |
| `OrdersDeleteOwn` | Delete only own orders |
| `OrdersGetFieldData` | View confidential order fields |
| `OrdersBypassValidation` | Skip field validation |

### Connections to other features

- **Offers** -- Orders can be created from signed agreements
- **Contacts** -- Order fields auto-populate from contact data
- **Products** -- Product selections determine pricing and totals
- **Projects** -- Orders can belong to specific projects
- **Lead lists** -- Orders are linked to lead lists during phone sales
- **Calendar** -- Calendar events can be linked to orders
