# Statistics & Dashboards

## Short version

The Statistics feature in SaleSys gives you custom dashboards to track sales results in real time. The feature requires **Statistics** to be enabled under Settings > Features. Dashboards are accessed via **Statistics** in the navigation.

Each dashboard contains one or more blocks (readers) that display specific metrics such as order count, order total, commission, number of calls, or sent offers. Blocks can be filtered by date, users, teams, and tags, and update automatically every six seconds.

The leaderboard ranks users and teams by performance and updates every 30 seconds. The activity log (requires Feature.Events) shows system events and user activity.

## Full guide

### Dashboards

#### Creating a dashboard

1. Go to **Statistics** in the navigation
2. Click **Create view**
3. Enter a name or choose a pre-built template
4. Dashboard is created -- add blocks

**Templates:**
The system offers pre-built templates with icons and descriptions. Templates are language-aware (Swedish/English).

#### Dashboard settings

- **Name** -- Edited directly in the header (admin)
- **Visibility** -- Who can see the dashboard:
  - Administrators only
  - Specific teams
  - Everyone
- **Project** -- Restrict to specific projects
- **Grouping** -- Data can be grouped by:
  - User
  - Team
  - Product
  - Lead list

#### Dashboard features

- **Fullscreen mode** -- Expand to full screen
- **Auto-refresh** -- Data fetched every 6 seconds
- **Link sharing** -- Generate shareable link for external viewing
- **Print-friendly** -- Optimized for printing
- **Filters** -- Configure visible filters (date, users, teams, tags)

### Blocks (Readers)

Blocks are widgets that display specific metrics.

**Creating a block:**
1. Open a dashboard
2. Click **Create block**
3. Configure:
   - **Name** -- Block title
   - **Variables** -- What to display (orders, calls, offers)
   - **Filters** -- Conditions for data
   - **Grouping** -- How data is grouped
   - **Chart interval** -- Time period

**Metrics:**
- Order count
- Order total (total value)
- Commission
- Number of calls
- Number of sent offers

**Filters:**
- **Date range** -- Custom or preset
- **Date strategy** -- Business date or creation date
- **Users** -- Specific sellers
- **Teams** -- Specific teams
- **Tags** -- Order or call tags
- **Lead lists** -- Specific lead lists

Blocks can be added, edited, deleted, and reordered within a dashboard.

### Leaderboard

The leaderboard ranks users and teams by sales performance.

**Location:** Displayed in the Statistics view or under Settings > Leaderboard (if the Dashboard feature is not enabled).

**Settings:**
- **Sort by** -- Order count or commission
- **Date strategy** -- Business date or creation date
- **Team selection** -- View globally or per team
- **Custom filters** -- Date ranges

**Updates:** Automatic refresh every 30 seconds with countdown timer.

**Display:**
- Ranking number
- Username
- Order count
- Commission totals (if authorized)

### Activity log

Requires **Activity** (Feature.Events) to be enabled. Shows system events and user activity in the organization.

### Permissions

| Permission | Description |
|------------|-------------|
| `StatisticsGetGlobal` | View global leaderboard/statistics |
| `StatisticsGetByOwnTeam` | View own team's leaderboard |
| `StatisticsGetByAllTeams` | View all teams' leaderboard |
| `StatisticsGetCommissionByOwnTeam` | View commission for own team |
| `StatisticsGetCommissionAll` | View commission for all |

Administrators always have full access to all statistics.
