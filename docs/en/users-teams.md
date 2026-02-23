# Users & Teams

## Short version

User management in SaleSys allows administrators to create and manage user accounts, organize them into teams, and assign roles with specific permissions. Users are managed under Settings > Users > List, teams under Settings > Users > Teams, and roles under Settings > Users > Roles.

Each user belongs to one or more teams and can have individual or role-based permissions. Permissions are divided into categories: Orders, Statistics, Offers, Products, Calls, Contacts, Comments, and Calendar. Administrators always have full access.

Registration links (Settings > Users > Links) allow new users to self-register. Two-factor authentication (MFA) can be enabled under My Account with email or SMS as the verification method.

## Full guide

### Users

Users are managed under **Settings > Users > List**.

**Creating a user:**
1. Click **Add**
2. Fill in username and email
3. Assign to one or more teams
4. Select roles
5. Set any individual permissions
6. Send activation link

**User types:**
| Type | Description |
|------|-------------|
| **Regular** | Access based on roles and permissions |
| **Administrator** | Full access to all features and settings |
| **System user** | Automated accounts, normally hidden |

**User status:**
- **Active** -- User can log in and work
- **Inactive** -- User is deactivated
- **Suspended** -- Temporarily suspended

**User list:**
- Search by name, username, or team
- Show/hide usernames
- Show/hide system users
- Click a user for detailed editing

**User settings (modal):**
- Basic information (username, email, phone)
- Teams and roles
- Individual permissions
- Access keys

### Teams

Teams are managed under **Settings > Users > Teams**.

**Creating a team:**
1. Click **Add**
2. Enter team name
3. Choose color (auto-suggested from palette)
4. Add members
5. Set team permissions

**Team properties:**
- **Name** -- Team display name
- **Color** -- Visual identification (automatically assigned)
- **Members** -- Users in the team
- **Locked** -- Prevents regular users from administrating members
- **Permissions** -- Team-wide roles/permissions

**Team modal (two tabs):**
- **Users** -- Add and remove team members
- **Permissions** -- Configure team-wide permissions

Teams can be reordered with drag-and-drop.

### Roles and permissions

Roles are managed under **Settings > Users > Roles**.

**Creating a role:**
1. Click **Create**
2. Name the role
3. Select which permissions to include
4. Save

**Permission categories:**

| Category | Example permissions |
|----------|-------------------|
| **Orders** | Create, view all, view own, edit, delete |
| **Statistics** | Global, own team, all teams, commission |
| **Offers** | View all, view own team, open distributed, review |
| **Products** | View prices, edit products |
| **Calls** | Make calls, view all, co-hear, whisper, recordings |
| **Contacts** | View, create, edit, delete, exclude lists |
| **Comments** | View, create comments |
| **Calendar** | View, edit calendars |

**Permission implications:**
Some permissions automatically grant related permissions. For example:
- "View all orders" includes "View own team's orders"
- "Co-hear all" includes "Co-hear own team" + "View all calls"

**Assignment:**
Roles can be assigned at:
- **Team level** -- All team members receive the role
- **User level** -- Individual user receives the role

Administrators bypass all permission checks.

### Registration links

Managed under **Settings > Users > Links** (requires Feature.RegistrationLink).

**Creating a registration link:**
1. Click **Create**
2. Name the link
3. Choose default team for new users
4. Configure notifications
5. Optional: set expiration date

**Link management:**
- List all active registration links
- Edit existing links
- Delete links
- Send link via email or SMS

### Account settings

Under **Settings > My Account**, all users can manage their account.

**Personal settings:**
- **Username** -- Displayed (read-only)
- **Email** -- Used for notifications
- **Language** -- Swedish or English (US) -- requires page reload
- **Two-factor authentication** -- Enable/disable MFA

**Organization settings (admin only):**
- Contact email
- Phone number
- Website

### Two-factor authentication (MFA)

1. Go to **Settings > My Account**
2. Enable **Two-factor authentication**
3. Configure recipients:
   - **Email** -- Verification code sent to your email (default)
   - **SMS** -- Optional, enter phone number
4. At login, choose delivery method if both are available

**Requirements:**
- At least one recipient (email or phone) must be configured
- Phone number format is validated
- Can add or remove SMS recipients

### User management permissions

| Permission | Description |
|------------|-------------|
| `UsersCreateForOwnTeam` | Create users in own team |
| `UsersUpdateForOwnTeam` | Edit users in own team |
| `UsersDeleteForOwnTeam` | Delete users in own team |
| `UsersLogOutForOwnTeam` | Force logout of team members |
| `UsersCreateUserMessage` | Create user messages |
