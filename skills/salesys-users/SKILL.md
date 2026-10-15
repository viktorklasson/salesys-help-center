---
name: SaleSys User Management
description: Use when managing users, teams, projects, roles, or working with the reference object for custom metadata.
---

# SaleSys User Management

Use this skill when working with users, teams, projects, roles, and custom metadata (reference objects).

## When to Use

- Creating or updating users
- Managing teams and projects
- Assigning roles and permissions
- Storing custom metadata on entities
- Querying users by custom fields
- Building user directories or dashboards

## Reference Object

The `reference` object stores custom metadata on:
- Users
- Teams
- Projects
- Products
- Product categories

### Structure

```javascript
{
  "reference": {
    "customField1": "value",
    "nested": {
      "field2": "value"
    },
    "array": [1, 2, 3]
  }
}
```

Any JSON-serializable data is allowed.

## Managing Reference Data

### Update Reference (Merge)

```javascript
call_api(
  method="PUT",
  path="/api/users/users-v1/{userId}",
  body={
    "reference": {
      "birthYear": 1990,
      "department": "Sales"
    },
    "replaceReference": false  // Merge with existing (default)
  },
  confirm=true
)
```

### Update Reference (Replace)

```javascript
call_api(
  method="PUT",
  path="/api/users/users-v1/{userId}",
  body={
    "reference": {
      "birthYear": 1990
    },
    "replaceReference": true  // Replace entire object
  },
  confirm=true
)
```

### Dot Notation

```javascript
// Alternative syntax for nested updates
call_api(
  method="PUT",
  path="/api/users/users-v1/{userId}",
  body={
    "reference.birthYear": 1990,
    "reference.score": 25,
    "replaceReference": false
  },
  confirm=true
)
```

## Querying by Reference

### Exact Match

```javascript
// Find users with exact reference value(s)
call_api(
  method="GET",
  path="/api/users/users-v1",
  query={
    "reference.department": "Sales,Marketing"  // Comma-separated
  }
)
```

### Advanced Filters (MongoDB operators)

```javascript
// Users born between 1990-2000
call_api(
  method="GET",
  path="/api/users/users-v1",
  query={
    "reference.birthYear": JSON.stringify({
      "$gte": 1990,
      "$lte": 2000
    })
  }
)

// Score greater than 50
call_api(
  method="GET",
  path="/api/users/users-v1",
  query={
    "reference.score": JSON.stringify({ "$gt": 50 })
  }
)
```

**MongoDB Operators**:
- `$gt` - Greater than
- `$gte` - Greater than or equal
- `$lt` - Less than
- `$lte` - Less than or equal
- `$ne` - Not equal
- `$in` - In array
- `$nin` - Not in array

## Users

### List Users

```javascript
call_api(method="GET", path="/api/users/users-v1")
```

### Get User

```javascript
call_api(method="GET", path="/api/users/users-v1/{userId}")
```

### Create User

```javascript
call_api(
  method="POST",
  path="/api/users/users-v1",
  body={
    "fullName": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "SecurePassword123",
    "type": "standard",  // standard, admin, systemUser
    "teamId": "TEAM_ID",
    "roleIds": ["ROLE_ID"],
    "reference": {
      "department": "Sales",
      "startDate": "2024-01-01"
    }
  },
  confirm=true
)
```

### Update User

```javascript
call_api(
  method="PUT",
  path="/api/users/users-v1/{userId}",
  body={
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "teamId": "NEW_TEAM_ID",
    "reference.department": "Marketing"
  },
  confirm=true
)
```

### Get Current User

```javascript
call_api(method="GET", path="/api/users/me-v1")
```

### User Types

- **standard** - Regular user with assigned roles
- **admin** - Administrator (full access)
- **systemUser** - API/automation user (typically hidden)
- **privateUser** - Internal/anonymous user

## Teams

### List Teams

```javascript
call_api(method="GET", path="/api/users/teams-v1")
```

### Create Team

```javascript
call_api(
  method="POST",
  path="/api/users/teams-v1",
  body={
    "name": "Sales Team",
    "reference": {
      "region": "North",
      "target": 100000
    }
  },
  confirm=true
)
```

### Update Team

```javascript
call_api(
  method="PUT",
  path="/api/users/teams-v1/{teamId}",
  body={
    "name": "Updated Team Name",
    "reference.target": 150000
  },
  confirm=true
)
```

### User Teams

Users can be in multiple teams:
- `user.teamId` - Primary team
- `user.supervisedTeamIds` - Additional teams

```javascript
// Get all teams for a user
const user = call_api(method="GET", path="/api/users/users-v1/{userId}");

const teamIds = [];
if (user.teamId) teamIds.push(user.teamId);
if (user.supervisedTeamIds) teamIds.push(...user.supervisedTeamIds);
```

## Projects

### List Projects

```javascript
call_api(method="GET", path="/api/users/projects-v1")
```

### Create Project

```javascript
call_api(
  method="POST",
  path="/api/users/projects-v1",
  body={
    "name": "Q1 Campaign",
    "reference": {
      "budget": 50000,
      "startDate": "2024-01-01",
      "endDate": "2024-03-31"
    }
  },
  confirm=true
)
```

### Update Project

```javascript
call_api(
  method="PUT",
  path="/api/users/projects-v1/{projectId}",
  body={
    "name": "Q1 2024 Campaign",
    "reference.budget": 60000
  },
  confirm=true
)
```

## Roles

### List Roles

```javascript
call_api(method="GET", path="/api/users/user-roles-v1")
```

### Create Role

```javascript
call_api(
  method="POST",
  path="/api/users/user-roles-v1",
  body={
    "name": "Sales Representative",
    "rights": [
      "contacts.getAll",
      "contacts.update",
      "orders.getAll",
      "orders.create",
      "offers.getAll",
      "offers.create"
    ]
  },
  confirm=true
)
```

### Update Role

```javascript
call_api(
  method="PUT",
  path="/api/users/user-roles-v1/{roleId}",
  body={
    "name": "Senior Sales Rep",
    "rights": [
      "contacts.getAll",
      "contacts.update",
      "orders.getAll",
      "orders.create",
      "orders.delete",  // Added permission
      "offers.getAll",
      "offers.create"
    ]
  },
  confirm=true
)
```

### Common Rights

- **contacts.getAll** - View all contacts
- **contacts.update** - Edit contacts
- **orders.getAll** - View all orders
- **orders.create** - Create orders
- **orders.update** - Edit orders
- **orders.delete** - Delete orders
- **offers.getAll** - View all agreements
- **offers.create** - Create agreements

See full list in SaleSys > Inställningar > Roller.

## Common Patterns

### User Directory with Custom Fields

```javascript
// Store department and employee number
users.forEach(async user => {
  await call_api(
    method="PUT",
    path="/api/users/users-v1/" + user.id,
    body={
      "reference.department": user.department,
      "reference.employeeNumber": user.employeeNumber,
      "reference.startDate": user.startDate
    },
    confirm=true
  );
});

// Query by department
const salesTeam = call_api(
  method="GET",
  path="/api/users/users-v1",
  query={
    "reference.department": "Sales"
  }
);
```

### Performance Tracking

```javascript
// Store monthly targets and actuals
call_api(
  method="PUT",
  path="/api/users/users-v1/{userId}",
  body={
    "reference.targets": {
      "2024-01": { "target": 50000, "actual": 48000 },
      "2024-02": { "target": 55000, "actual": 62000 }
    }
  },
  confirm=true
);

// Query high performers
const topPerformers = call_api(
  method="GET",
  path="/api/users/users-v1",
  query={
    "reference.targets.2024-02.actual": JSON.stringify({ "$gte": 60000 })
  }
);
```

### Project Budget Tracking

```javascript
// Create project with budget
call_api(
  method="POST",
  path="/api/users/projects-v1",
  body={
    "name": "Website Redesign",
    "reference": {
      "budget": 100000,
      "spent": 0,
      "startDate": "2024-01-01",
      "status": "active"
    }
  },
  confirm=true
);

// Update spent amount
call_api(
  method="PUT",
  path="/api/users/projects-v1/{projectId}",
  body={
    "reference.spent": 35000
  },
  confirm=true
);

// Find over-budget projects
const overBudget = call_api(
  method="GET",
  path="/api/users/projects-v1",
  query={
    // This requires custom logic - can't directly compare fields in query
    // Fetch all and filter client-side
  }
);
```

### Team Assignments

```javascript
// Assign user to multiple teams
call_api(
  method="PUT",
  path="/api/users/users-v1/{userId}",
  body={
    "teamId": "PRIMARY_TEAM_ID",
    "supervisedTeamIds": ["TEAM_ID_2", "TEAM_ID_3"]
  },
  confirm=true
);

// Get all users in a team
const team = call_api(method="GET", path="/api/users/teams-v1/{teamId}");
const users = call_api(method="GET", path="/api/users/users-v1");

const teamMembers = users.filter(user =>
  user.teamId === team.id ||
  (user.supervisedTeamIds && user.supervisedTeamIds.includes(team.id))
);
```

## Reference on Other Entities

### Products

```javascript
call_api(
  method="PUT",
  path="/api/products/products-v1/{productId}",
  body={
    "reference.sku": "PROD-001",
    "reference.supplier": "Acme Corp",
    "reference.weight": 2.5
  },
  confirm=true
);

// Query products by SKU
call_api(
  method="GET",
  path="/api/products/products-v1",
  query={
    "reference.sku": "PROD-001"
  }
);
```

### Product Categories

```javascript
call_api(
  method="PUT",
  path="/api/products/product-categories-v1/{categoryId}",
  body={
    "reference.commission": 0.15,
    "reference.featured": true
  },
  confirm=true
);
```

## Best Practices

1. **Use meaningful keys**: `reference.birthYear` not `reference.by`
2. **Document your schema**: Keep a list of reference fields used
3. **Validate before storing**: Check data types and formats
4. **Use dot notation for updates**: Avoid overwriting entire object
5. **Index on query fields**: Frequently queried fields perform better
6. **Don't store sensitive data**: Reference is not encrypted
7. **Keep it flat when possible**: Deeply nested queries are complex

## Limitations

- Reference fields are not validated by SaleSys
- No schema enforcement
- Complex queries may need client-side filtering
- Cannot directly compare two reference fields in query
- Not suitable for high-frequency updates

## Swedish Terminology

| Svenska | English |
|---------|---------|
| Användare | User |
| Team | Team |
| Projekt | Project |
| Roll | Role |
| Rättigheter | Rights/Permissions |
| Systemanvändare | System user |
| Referens | Reference |

## MCP Tools

Use `salesys-mcp-server` skill to:
- List/create/update users: `/api/users/users-v1`
- Manage teams: `/api/users/teams-v1`
- Manage projects: `/api/users/projects-v1`
- Manage roles: `/api/users/user-roles-v1`

## Resources

- **API Docs**: https://docs.salesys.io
- **Admin Panel**: Inställningar > Användare
- **Related Skills**: salesys-statistics (user activity)
