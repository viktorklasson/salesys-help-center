---
name: SaleSys Data Export
description: Use when exporting large datasets - contacts, calls, orders - with custom fields and filtering. Faster than pagination for bulk data.
---

# SaleSys Data Export

Use this skill when exporting large amounts of data from SaleSys - more efficient than paginated API calls.

## When to Use

- Exporting thousands of contacts/calls/orders
- Generating custom CSV/Excel reports
- Backing up data
- Migrating to another system
- Building offline analysis datasets

## Why Export API?

**Export is faster** than pagination because:
- Database can stream results directly
- No multiple API calls needed
- Optimized for large datasets
- Can download later (async)

**Export supports**:
- Custom column selection
- JSONPath queries for nested data
- CSV and Excel formats
- Email notifications when complete

## Export Workflow

1. **Create export** - Define what to export
2. **Wait for completion** - Check status
3. **Download file** - Get the exported data

## Call Export

### Create Call Export

```javascript
call_api(
  method="POST",
  path="/api/dial/export-v1/calls",
  body={
    "output": {
      "Call Number": "$.serialId",
      "Seller": "$.user.fullName",
      "Caller": "$.caller",
      "Recipient": "$.recipient",
      "Duration (sec)": "$.duration",
      "Tag 1": "$.tags[0].name",
      "Tag 2": "$.tags[1].name",
      "Contact First Name": "$.fields['förnamn']",  // By name
      "Contact Last Name": "$.fields['67eaa123...']"  // By field ID
    },
    "query": {
      "tagIds": ["TAG_ID_1", "TAG_ID_2"],
      "userId": "USER_ID",
      "createdAfter": "2024-01-01",
      "createdBefore": "2024-01-31"
    },
    "notificationEmails": ["admin@example.com"],
    "format": "excel"  // or "json"
  },
  confirm=true
)

// Returns:
{
  "taskId": "EXPORT_TASK_ID"
}
```

### Output Field Mapping

**Format**: `{ "Column Name": "JSONPath" }`

**Common Paths**:
- `$.serialId` - Call number
- `$.user.fullName` - Seller name
- `$.user.email` - Seller email
- `$.caller` - Caller number
- `$.recipient` - Recipient number
- `$.duration` - Duration in seconds
- `$.direction` - "inbound" or "outbound"
- `$.tags[0].name` - First tag name
- `$.tags_exists['TAG_ID']` - 1 if tag exists, 0 if not (for counting)
- `$.dialGroup.name` - Call list name
- `$.shuffleDialGroup.name` - Shuffle group name

### Contact Fields in Calls

```javascript
{
  "output": {
    // By field name (works for common names like förnamn, efternamn)
    "First Name": "$.fields['förnamn']",
    "Last Name": "$.fields['efternamn']",
    "Phone": "$.fields['telefonnummer']",
    
    // By field ID (exact match)
    "Custom Field": "$.fields['67eaa47489dab34a5d532546']"
  }
}
```

**Note**: Contact fields must be decrypted, so exports with many contact fields take longer.

### Tag Counting

For Excel summation:

```javascript
{
  "output": {
    "Call Number": "$.serialId",
    "Positive": "$.tags_exists['67abc123...']",  // 1 or 0
    "Negative": "$.tags_exists['67abc456...']",  // 1 or 0
    "Follow-up": "$.tags_exists['67abc789...']"  // 1 or 0
  }
}
```

Then in Excel: `=SUM(B:B)` to count calls with that tag.

### Query Filters

Same as `GET /api/dial/calls-v1` query parameters:

```javascript
{
  "query": {
    "tagIds": ["TAG_ID"],        // Specific tags
    "userId": "USER_ID",         // Specific user
    "teamId": "TEAM_ID",         // Team
    "projectId": "PROJECT_ID",   // Project
    "createdAfter": "2024-01-01",
    "createdBefore": "2024-12-31",
    "dialGroupIds": ["LIST_ID"]  // Call list
  }
}
```

### Check Export Status

```javascript
call_api(
  method="GET",
  path="/api/documents/export-information-v1/simple",
  query={
    "ids": "EXPORT_TASK_ID"
  }
)

// Returns:
{
  "id": "EXPORT_TASK_ID",
  "summary": {
    "totalCount": 5000,
    "exportedCount": 5000
  },
  "status": "finished",  // started, stopped, finished, error
  "keys": [
    "ORG_ID/exports/TASK_ID_0.xlsx"
  ]
}
```

**Statuses**:
- `started` - Export in progress
- `finished` - Ready to download
- `stopped` - Manually stopped
- `error` - Failed (check full export for error details)

### Download Export File

```javascript
call_api(
  method="GET",
  path="/api/documents/export-v1/{taskId}/file",
  query={
    "index": 0  // File index (usually 0)
  }
)

// Returns file content (binary)
```

**Note**: Large exports may split into multiple files. Check `keys` array length.

### List Previous Exports

```javascript
call_api(
  method="GET",
  path="/api/documents/export-v1"
)
```

### Stop Running Export

```javascript
call_api(
  method="PUT",
  path="/api/documents/export-v1/{taskId}/stop",
  confirm=true
)
```

⚠️ Stopped exports cannot be restarted.

## Export Formats

### Excel (`.xlsx`)
- Most common
- Can be opened in Excel/Sheets
- Supports formulas for analysis
- File extension: `.xlsx`

### JSON (`.json`)
- Raw JSON array
- Good for programmatic processing
- Preserves complex data structures

```javascript
{
  "format": "json"  // or "excel"
}
```

## Email Notifications

```javascript
{
  "notificationEmails": [
    "user@example.com",
    "admin@example.com"
  ]
}
```

**When sent**:
- Export completes successfully (with download link)
- Export fails (with error message)
- **Not sent** if export completes in < 5 seconds

## Export Limitations

- **One active export per organization** - Wait for current export to finish
- **Retention**: Export files kept ~10 days
- **Size**: Very large exports (100K+ rows) may split into multiple files
- **Contact fields slow exports** - Decryption required

## Common Patterns

### Monthly Call Report

```javascript
const exportTask = call_api(
  method="POST",
  path="/api/dial/export-v1/calls",
  body={
    "output": {
      "Date": "$.createdAt",
      "Seller": "$.user.fullName",
      "Call Number": "$.serialId",
      "Customer": "$.fields['förnamn']",
      "Duration": "$.duration",
      "Connected": "$.connectedDuration",
      "Result": "$.tags[0].name"
    },
    "query": {
      "createdAfter": "2024-01-01",
      "createdBefore": "2024-01-31"
    },
    "notificationEmails": ["manager@example.com"],
    "format": "excel"
  },
  confirm=true
);

// Poll for completion
let status;
do {
  await new Promise(resolve => setTimeout(resolve, 2000));
  status = call_api(
    method="GET",
    path="/api/documents/export-information-v1/simple",
    query={ ids: exportTask.taskId }
  );
} while (status.status === "started");

// Download
const file = call_api(
  method="GET",
  path="/api/documents/export-v1/" + exportTask.taskId + "/file"
);
```

### Tag Performance Analysis

```javascript
call_api(
  method="POST",
  path="/api/dial/export-v1/calls",
  body={
    "output": {
      "Seller": "$.user.fullName",
      "Positive": "$.tags_exists['TAG_POSITIVE_ID']",
      "Negative": "$.tags_exists['TAG_NEGATIVE_ID']",
      "Maybe": "$.tags_exists['TAG_MAYBE_ID']",
      "Follow-up": "$.tags_exists['TAG_FOLLOWUP_ID']"
    },
    "query": {
      "createdAfter": "2024-01-01",
      "createdBefore": "2024-12-31"
    },
    "format": "excel"
  },
  confirm=true
);

// In Excel: Use SUM() on each column to count by tag
// Pivot table by Seller to see per-user breakdown
```

### Contact Data Backup

```javascript
// Export all contacts with custom fields
call_api(
  method="POST",
  path="/api/contacts/export-v1/contacts",  // If endpoint exists
  body={
    "output": {
      "First Name": "$.fields['förnamn']",
      "Last Name": "$.fields['efternamn']",
      "Email": "$.fields['email']",
      "Phone": "$.fields['telefonnummer']",
      "Address": "$.fields['address']",
      "Created": "$.createdAt"
    },
    "format": "json"
  },
  confirm=true
);
```

## Troubleshooting

### "Export already running"
- Only one export per organization at a time
- Stop previous export or wait for it to finish

### "Export file not found"
- Files are kept ~10 days
- Download immediately after completion

### "Contact fields empty"
- Verify field IDs are correct
- Check fields exist in contacts
- Use field names for common fields (förnamn, etc.)

### Export takes too long
- Reduce contact fields (decryption is slow)
- Filter by date range to reduce rows
- Consider using pagination API for smaller datasets

### Multiple files returned
- Very large exports split into files
- Download each file using `index` parameter
- Combine client-side if needed

## Advanced: JSONPath Reference

### Arrays

```javascript
"$.tags[0].name"      // First tag
"$.tags[1].name"      // Second tag
"$.tags[-1].name"     // Last tag
```

### Nested Objects

```javascript
"$.user.fullName"     // User's name
"$.user.email"        // User's email
"$.dialGroup.name"    // Call list name
```

### Field Access

```javascript
"$.fields['förnamn']"           // By name
"$.fields['67eaa123...']"       // By ID
"$.tags_exists['TAG_ID']"       // Tag boolean (1/0)
```

## Other Export Endpoints

Currently documented:
- `POST /api/dial/export-v1/calls` - Call export

Check for others:
- `/api/contacts/export-v1/contacts` - Contact export (if exists)
- `/api/orders/export-v1/orders` - Order export (if exists)

Use service discovery to find available export endpoints.

## Swedish Terminology

| Svenska | English |
|---------|---------|
| Export | Export |
| Samtal | Call |
| Kontakt | Contact |
| Fält | Field |
| Tagg | Tag |
| Rapporter | Reports |

## MCP Tools

Use `salesys-mcp-server` skill to:
- Create exports: `POST /api/dial/export-v1/calls`
- Check status: `GET /api/documents/export-information-v1/simple`
- Download: `GET /api/documents/export-v1/{taskId}/file`
- Discover fields: `GET /api/dial/calls-v1` (inspect response structure)

## Resources

- **In-App**: SaleSys > Inställningar > Samtal > Export
- **API Docs**: https://docs.salesys.io
- **JSONPath**: https://goessner.net/articles/JsonPath/
- **Related Skills**: salesys-statistics (for aggregated data)
