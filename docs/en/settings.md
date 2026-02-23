# Settings

## Short version

Settings in SaleSys are accessed via the gear icon in the navigation. Administrators see all settings categories while regular users only see My Account and limited sections. Settings are organized into sections: Users, Order, Offers, Contacts, Calls, Automation, Products, Features, Projects, and My Account.

Under Features, administrators can enable and disable modules like Contacts, Calls, Offers, Calendar, Statistics, and more. All features are free to enable and changes take effect immediately.

The Automation section contains field linking that lets you connect contact fields to order fields for automatic population. Projects group settings and documents for different business areas.

## Full guide

### Navigation structure

Settings are organized into the following sections:

```
Settings
├── Users
│   ├── List
│   ├── Teams
│   ├── Roles
│   └── Registration Links*
├── Order
│   ├── Tags
│   ├── Information (fields)
│   └── Utilities
├── Offers*
│   ├── Templates
│   ├── Distribution
│   └── Web Forms*
├── Contacts*
│   ├── Tags
│   ├── Information (fields)
│   └── Exclude Lists
├── Calls*
│   ├── General
│   ├── Tags
│   ├── Phone Numbers
│   ├── Messages
│   ├── Utilities
│   └── Export
├── Automation*
│   └── Field Linking
├── Products
│   ├── All Categories
│   ├── [Individual categories]
│   └── All Product Fields
├── Leaderboard**
├── Features
├── Projects*
└── My Account

* = Requires the feature to be enabled
** = Only shown if Dashboard feature is NOT enabled
```

### Features

Under **Settings > Features**, administrators can enable and disable modules.

| Feature | Internal name | Description |
|---------|--------------|-------------|
| **Contacts** | `contact` | Collect or call contacts |
| **Calls** | `dial` | Make calls automatically |
| **Offers** | `offer` | Send agreements via email and SMS |
| **Activity** | `events` | View company activity |
| **Calendar** | `calendar` | View and create user calendars |
| **Projects** | `project` | Group settings and documents |
| **Registration Links** | `reglink` | Users can self-register via link |
| **Statistics** | `dashboard` | Custom statistics views |
| **Offer Web Forms** | `offerwebform` | Create agreements from web forms |

**How to enable a feature:**
1. Go to Settings > Features
2. Click on the feature card
3. The feature is enabled/disabled immediately

**Dependencies:**
- **Calls** requires **Contacts** to be enabled
- **Offer Web Forms** requires **Offers** to be enabled

All features are free.

### Automation -- Field Linking

Under **Settings > Automation > Field Linking**, contact fields are linked to order fields.

**How it works:**
- When an order is created from a contact, order fields are automatically populated with contact data
- Supports 1:1 mapping (one field to one field) and 1:M mapping (one field to many)
- For 1:M mapping, the value is split by spaces

**Example:**
The contact field "Full Name" with the value "Anna Svensson" can be linked to:
- Order field "First Name" → "Anna"
- Order field "Last Name" → "Svensson"

**Management:**
- Search among existing links
- Create new links
- Edit or delete links
- Newly linkable fields are highlighted with a notification

### Projects

Under **Settings > Projects** (requires Feature.Project and administrator).

Projects group settings and documents for different business areas or campaigns.

**Project usage:**
- Product categories can be restricted to projects
- Tags (order, contact, call) can be project-specific
- Dashboards can be restricted to projects
- Users can be assigned to projects
- Contact fields and product fields can be project-specific

**Creating a project:**
1. Go to Settings > Projects
2. Click **Create**
3. Enter name and description
4. Assign users
5. Configure visibility

### My Account

Under **Settings > My Account**, you manage personal settings.

**Personal:**
- **Username** -- Read-only
- **Email** -- For notifications
- **Language** -- Swedish or English (US). Requires page reload after switching
- **Two-factor authentication (MFA)** -- See separate section below

**Organization (admin only):**
- Contact email
- Phone number
- Website

### Two-factor authentication (MFA)

1. Go to My Account
2. Enable Two-factor authentication
3. Configure recipients:
   - **Email** -- Default, verification code sent to your email
   - **SMS** -- Optional, enter phone number
4. At least one recipient is required
5. At login, choose delivery method

### Settings per section

#### Order
- **Tags** -- Create and manage order tags with colors, locking, and negation
- **Information** -- Configure order fields with types, validation, and visibility
- **Utilities** -- Configure automated workflows (SMS, email, HTTP) after order creation

#### Offers
- **Templates** -- Create offer templates with layout, signing method, and inserts
- **Distribution** -- Configure message templates and reminder rules
- **Web Forms** -- Build multi-step forms for websites

#### Contacts
- **Tags** -- Create contact tags with colors and locking
- **Information** -- Configure contact fields with types and linking
- **Exclude Lists** -- Manage lists of numbers/terms that should not be contacted

#### Calls
- **General** -- General call settings
- **Tags** -- Call tags with quarantine periods and grouping
- **Phone Numbers** -- Manage phone numbers for outgoing/incoming calls
- **Messages** -- Standard messages for co-hearing
- **Utilities** -- Call actions and workflows
- **Export** -- Export call data

#### Products
- **Categories** -- Create and organize product categories
- **Product Fields** -- Configure custom product fields
