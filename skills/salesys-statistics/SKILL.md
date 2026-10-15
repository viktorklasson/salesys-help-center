---
name: salesys-statistics
description: Use when querying SaleSys statistics, analytics, or reports - orders, users, calls, agreements, activity tracking.
---

# SaleSys Statistics API

Use this skill when helping users query statistics, build dashboards, or analyze SaleSys data.

## When to Use

- Building custom dashboards
- Generating reports
- Analyzing sales performance
- Tracking user activity
- Monitoring call metrics
- Aggregating data over time

## Authentication

Statistics endpoints require a Bearer token. Most statistics are organization-scoped (no special permissions needed), but some may require admin rights.

```javascript
call_api(
  method="GET",
  path="/api/orders/statistics-v1/...",
  headers={"Authorization": "Bearer TOKEN"}
)
```

## Time Intervals

Many statistics endpoints support fixed intervals:

### Query Parameters
- `from`: Start date (UTC) - e.g. "2024-01-01"
- `to`: End date (UTC)
- `fixedIntervalType`: Interval size
  - `minute` - Per minute
  - `hour` - Per hour  
  - `day` - Per day
  - `week` - Per week
  - `month` - Per month
- `fixedIntervalMillis`: Custom interval in milliseconds (alternative to fixedIntervalType)

**Example**: `fixedIntervalType=day` groups data by day  
**Example**: `fixedIntervalMillis=3600000` groups by hour (3600000ms = 1 hour)

### Date Handling

⚠️ Dates are in **UTC**. Swedish time is UTC+1 (or UTC+2 in summer).

- `"2024-01-01"` = 2024-01-01 00:00 UTC = 2024-01-01 02:00 Swedish time (winter)
- To get full day in Swedish time, use previous day: `"2023-12-31"`

## Orders (Ordrar)

### Orders by User and Tag

**Endpoint**: `GET /api/orders/statistics-v1/own/issue_1238_user_tag`

**Query**: `from`, `to`, `fixedIntervalType` or `fixedIntervalMillis`

**Returns**:
```json
[
  {
    "intervalStart": "2024-01-01T00:00:00.000Z",
    "intervalEnd": "2024-01-02T00:00:00.000Z",
    "userId": "USER_ID",
    "tagId": "TAG_ID",
    "count": 5
  }
]
```

**Example**:
```javascript
call_api(
  method="GET",
  path="/api/orders/statistics-v1/own/issue_1238_user_tag",
  query={
    "from": "2024-01-01",
    "to": "2024-01-31",
    "fixedIntervalType": "day"
  }
)
```

## Users (Användare)

### List Users

**Endpoint**: `GET /api/users/users-v1`

Get user names, teams, roles for correlation with statistics.

**Returns**: User objects with `id`, `fullName`, `email`, `teamId`, etc.

### List Teams

**Endpoint**: `GET /api/users/teams-v1`

**Note**: Users can be in multiple teams. Check both `teamId` and `supervisedTeamIds`:

```javascript
const teamIds = [];
if (user.teamId) teamIds.push(user.teamId);
if (user.supervisedTeamIds) {
  teamIds.push(...user.supervisedTeamIds);
}
```

### User Activity Time

**Endpoint**: `GET /api/users/statistics-v1/own/issue_1238_active_user_time`

**Query**: `from`, `to`, `fixedIntervalType` or `fixedIntervalMillis`

**Returns**:
```json
[
  {
    "userId": "USER_ID",
    "intervalStart": "2024-01-01T12:00:00.000Z",
    "intervalEnd": "2024-01-01T12:10:00.000Z",
    "activeDuration": 89984  // milliseconds active
  }
]
```

**activeDuration**: Time user was active (mouse movement, typing, or in call)

**Example**: List currently active users
```javascript
call_api(
  method="GET",
  path="/api/users/statistics-v1/own/issue_1238_active_user_time",
  query={
    "from": new Date().toISOString().split('T')[0],
    // Omit 'to' for current time
    "fixedIntervalType": "minute"
  }
)

// Sum activeDuration per user to show "Active for X minutes today"
```

## Agreements (Avtal)

### Agreements by User and Status

**Endpoint**: `GET /api/offers/statistics-v1/own/issue_1238_status_user`

**Query**: `from`, `to`

**Returns**:
```json
[
  {
    "status": "signed",
    "userId": "USER_ID",
    "count": 15
  },
  {
    "status": "pending",
    "userId": "USER_ID",
    "count": 3
  }
]
```

**Statuses**:
- `pending` - Not sent
- `distributed` - Sent
- `read` - Opened
- `signed` - Signed
- `canceled` - Canceled
- `expired` - Expired

**Example**:
```javascript
call_api(
  method="GET",
  path="/api/offers/statistics-v1/own/issue_1238_status_user",
  query={
    "from": "2024-01-01",
    "to": "2024-01-31"
  }
)
```

## Calls (Samtal)

### List Call Tags

**Endpoint**: `GET /api/dial/tags-v1`

Get tag names for correlation (statistics return tagId).

### Active Calls Right Now

**Endpoint**: `GET /api/dial/statistics-v1/own/issue_1238_1`

**No query parameters** - returns current state.

**Returns**:
```json
[
  {
    "userId": "USER_ID",
    "connectedCount": 2,  // Calls connected to agent
    "connectingCount": 1  // Calls ringing
  }
]
```

**Example**: Who's on a call right now?
```javascript
const stats = call_api(
  method="GET",
  path="/api/dial/statistics-v1/own/issue_1238_1"
);

stats.forEach(stat => {
  if (stat.connectedCount > 0) {
    console.log(`User ${stat.userId} has ${stat.connectedCount} active calls`);
  }
});
```

### Calls by User and Tag

**Endpoint**: `GET /api/dial/statistics-v1/own/issue_1238_2`

**Query**: `from`, `to`, `fixedIntervalType` or `fixedIntervalMillis`

**Returns**:
```json
[
  {
    "intervalStart": "2024-01-01T08:00:00.000Z",
    "intervalEnd": "2024-01-01T09:00:00.000Z",
    "userId": "USER_ID",
    "tagId": "TAG_ID",  // null for untagged
    "count": 11,
    "totalDuration": 372531,      // Total time (ms)
    "connectedDuration": 272476,  // Talk time (ms)
    "unansweredCount": 0,
    "connectedCount": 11
  }
]
```

**Note**: `userId: "5f4d72e00000000000000000"` = predictive calls not connected to agent (system ID "SaleSys")

### Predictive Mode Time

**Endpoint**: `GET /api/dial/statistics-v1/own/issue_1238_4`

**Query**: `from`, `to`, `fixedIntervalType` or `fixedIntervalMillis`

**Returns**:
```json
[
  {
    "intervalStart": "2024-01-01T08:00:00.000Z",
    "intervalEnd": "2024-01-01T09:00:00.000Z",
    "dialGroupId": "CALL_LIST_ID",
    "dialGroupName": "Sales List 2024",
    "userId": "USER_ID",
    "predictiveModeTotalDuration": 1527826  // ms in predictive mode
  }
]
```

**Example**: Who's in predictive mode now?
```javascript
call_api(
  method="GET",
  path="/api/dial/statistics-v1/own/issue_1238_4",
  query={
    "from": new Date().toISOString().split('T')[0]
    // Omit 'to' for current
  }
)
```

### Predictive Mode Exits

**Endpoint**: `GET /api/dial/statistics-v1/own/issue_1238_5`

**Query**: `from`, `to`, `fixedIntervalType` or `fixedIntervalMillis`

**Returns**:
```json
[
  {
    "intervalStart": "2024-01-01T08:00:00.000Z",
    "intervalEnd": "2024-01-01T09:00:00.000Z",
    "userId": "USER_ID",
    "endReason": "predictiveDialNormalLeave",
    "predictiveModeEndCount": 12
  }
]
```

**End Reasons**:
- `predictiveDialNormalLeave` - User left normally
- `predictiveDialDisabledByUser` - Predictive mode turned off
- `predictiveDialUnresponsiveUsers` - Auto-stopped
- `predictiveDialHeartbeatTimedOut` - Connection lost
- `predictiveDialRoutingError` - Call routing failed

## Common Patterns

### Daily Summary Per User

```javascript
const stats = call_api(
  method="GET",
  path="/api/orders/statistics-v1/own/issue_1238_user_tag",
  query={
    "from": "2024-01-01",
    "to": "2024-01-31",
    "fixedIntervalType": "day"
  }
);

// Group by user
const byUser = {};
stats.forEach(stat => {
  if (!byUser[stat.userId]) byUser[stat.userId] = 0;
  byUser[stat.userId] += stat.count;
});

// byUser = { "userId1": 45, "userId2": 32, ... }
```

### Calculate Averages

```javascript
// Get active intervals
const activeIntervals = call_api(
  method="GET",
  path="/api/users/statistics-v1/own/issue_1238_active_user_time",
  query={ "from": "2024-01-01", "to": "2024-01-31", "fixedIntervalType": "day" }
);

// Get metric (e.g. predictive exits)
const exits = call_api(
  method="GET",
  path="/api/dial/statistics-v1/own/issue_1238_5",
  query={ "from": "2024-01-01", "to": "2024-01-31", "fixedIntervalType": "day" }
);

// Calculate average per active day
const userExits = {};
activeIntervals.forEach(interval => {
  const userId = interval.userId;
  const intervalStart = interval.intervalStart;
  
  // Find matching exit data
  const exitData = exits.find(
    e => e.userId === userId && e.intervalStart === intervalStart
  );
  
  if (!userExits[userId]) userExits[userId] = [];
  userExits[userId].push(exitData ? exitData.predictiveModeEndCount : 0);
});

// Average exits per user
Object.keys(userExits).forEach(userId => {
  const values = userExits[userId];
  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  console.log(`User ${userId} average: ${average.toFixed(1)} exits/day`);
});
```

### Current Activity Dashboard

```javascript
// Active calls
const activeCalls = call_api(
  method="GET",
  path="/api/dial/statistics-v1/own/issue_1238_1"
);

// Users active right now
const activeUsers = call_api(
  method="GET",
  path="/api/users/statistics-v1/own/issue_1238_active_user_time",
  query={
    "from": new Date().toISOString().split('T')[0],
    "fixedIntervalMillis": 60000  // Last minute
  }
);

// Combine for dashboard
{
  "activeCalls": activeCalls.reduce((sum, s) => sum + s.connectedCount, 0),
  "activeUsers": new Set(activeUsers.map(u => u.userId)).size,
  "usersOnCall": activeCalls.filter(c => c.connectedCount > 0).length
}
```

### Weekly Report

```javascript
const weekStart = "2024-01-01";
const weekEnd = "2024-01-07";

const [orders, calls, agreements] = await Promise.all([
  call_api(
    method="GET",
    path="/api/orders/statistics-v1/own/issue_1238_user_tag",
    query={ from: weekStart, to: weekEnd, fixedIntervalType: "week" }
  ),
  call_api(
    method="GET",
    path="/api/dial/statistics-v1/own/issue_1238_2",
    query={ from: weekStart, to: weekEnd, fixedIntervalType: "week" }
  ),
  call_api(
    method="GET",
    path="/api/offers/statistics-v1/own/issue_1238_status_user",
    query={ from: weekStart, to: weekEnd }
  )
]);

// Process and format...
```

## Tips

1. **Omit `to` for current data** - Leave out `to` parameter to get data up to now
2. **Match intervals** - Use same interval for correlating different metrics
3. **Cache user/team lists** - Get once, reuse for mapping IDs to names
4. **Watch UTC dates** - Remember timezone offset for Swedish time
5. **Aggregate client-side** - Sum/average returned data as needed
6. **Poll for real-time** - Query every 30-60s for live dashboards

## Swedish Terminology

| Svenska | English |
|---------|---------|
| Statistik | Statistics |
| Aktivitet | Activity |
| Samtalslista | Call list |
| Prediktivt läge | Predictive mode |
| Ansluten | Connected |
| Obesvarad | Unanswered |
| Tagg | Tag |

## MCP Tools

Use `salesys-mcp-server` skill to:
- Query all statistics endpoints
- Get user/team lists for correlation
- Access call tags

## Resources

- **API Docs**: https://docs.salesys.io
- **Related Skills**: salesys-export (for bulk data), salesys-users (user management)
