# Contacts

## Short version

Contacts in SaleSys are customer and prospect records that collect all information about a person or company. The feature requires **Contacts** to be enabled under Settings > Features. Each contact has custom fields, tags, comments, and a complete history of calls, orders, and offers.

Contact fields are configured by administrators under Settings > Contacts > Information. Field types include text, phone number, email, name, personal identity number, and date. Fields can be linked to order fields for automatic population via Settings > Automation. Exclude lists under Settings > Contacts > Exclude Lists prevent certain contacts from being called.

Contacts can be imported via CSV files to specific lead lists. The system automatically identifies duplicates and lets you choose whether to update, create new, skip, or remove existing records. All contact data is stored encrypted.

## Full guide

### Contact list

The contact list is accessed via **Contacts** in the navigation (requires `ContactsGetAll`).

**Columns:**
- Created by (user)
- Contact number (serial number)
- Created (date)
- Tags
- Lead lists
- Custom contact fields

**Search:**
- Text search in contact fields (encrypted)
- Phone number search
- Serial number search
- Comma-separated search (OR-based)

**Filters:**
- Date range
- Lead lists
- Tags
- Projects
- Phone numbers

### Contact view

Click a contact to see detailed information.

**Sections:**
1. **Contact fields** -- All fields with editing capability
2. **Tags** -- Grid of available tags (multi-select checkboxes)
3. **Comments** -- Add and view comments
4. **Events** -- Calls, orders, and offers linked to the contact
5. **History** -- All changes with who and when

### Contact fields

Configured under **Settings > Contacts > Information** (admin only).

**Field types:**
| Type | Description | Auto-fill |
|------|-------------|-----------|
| **Text** | Plain text | -- |
| **Date** | Date picker | -- |
| **Number** | Numeric field | -- |
| **Phone Number** | Phone with formatting | SMS recipient in offers |
| **Email** | Email address | Email recipient in offers |
| **Secondary Email** | Additional email | -- |
| **First Name** | Person's first name | Recipient name in offers |
| **Last Name** | Person's last name | Recipient name in offers |
| **Middle Name** | Person's middle name | Recipient name in offers |
| **Full Name** | Complete name | Recipient name in offers |
| **Person Identity Number** | Swedish personal ID | Populated after BankID |
| **Yes/No** | Boolean field | -- |

**Field properties:**
- Label (display name)
- Type
- Project restriction (global or project-specific)
- Order field linking

### Contact tags

Configured under **Settings > Contacts > Tags** (admin only).

**Properties:**
- **Name** -- Display name
- **Color** -- Visual color code
- **Locking** -- Contact can only be edited by administrators
- **Default** -- Automatically added to new contacts
- **Project** -- Restrict to specific project

Locking tags display a lock icon in the contact list.

### Exclude lists

Configured under **Settings > Contacts > Exclude Lists**.

Exclude lists are lists of phone numbers or terms that should not be contacted.

**Types:**
- **Global** -- Apply to all lead lists and direct calls automatically
- **Organization-specific** -- Apply only to selected lead lists

**Management:**
1. Create new exclude list with a name
2. Choose global or specific (cannot be changed after creation)
3. Add terms/numbers individually
4. Search among existing terms
5. View count of matching contacts

### Importing contacts

1. Prepare a CSV file with contact data
2. Go to a lead list and select **Import**
3. Choose the CSV file
4. Map CSV columns to contact fields
5. The system automatically identifies duplicates

**Conflict resolution:**
When duplicates are found, you get the following options:

| Option | Description |
|--------|-------------|
| **Update** | Update existing contact with new data |
| **Create** | Create new contact despite duplicate |
| **Skip** | Do not import this record |
| **Remove from list** | Remove existing contact from lead list |

Duplicates are identified via phone numbers and field values. Up to 200 conflicts per import.

### Automatic field linking

Configured under **Settings > Automation > Field Linking**.

Contact fields can be linked to order fields for automatic population:
- **1:1 mapping** -- One contact field to one order field
- **1:M mapping** -- One contact field to multiple order fields (split by space)

Example: The contact field "Full Name" can be split into the order fields "First Name" and "Last Name".

### Permissions

| Permission | Description |
|------------|-------------|
| `ContactsGetAll` | View the contact list |
| `ContactsCreate` | Create new contacts |
| `ContactsUpdate` | Edit contacts |
| `ContactsDelete` | Delete contacts |

Locked contacts (with a locking tag) can only be edited by administrators, regardless of permissions.

### Security

- All contact field values are stored encrypted (AES)
- Search is performed via encrypted digests
- Multiple variants of the same value are supported for matching (e.g., different phone number formats)

### Connections

- **Calls** -- All calls to a contact are displayed in the contact view
- **Orders** -- Orders linked to the contact are listed
- **Offers** -- Offers sent to the contact are shown
- **Lead lists** -- Contacts belong to one or more lead lists
- **Order fields** -- Contact data automatically populates order fields via field linking
