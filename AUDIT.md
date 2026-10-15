# Security Audit Report: SaleSys Help Center & API Documentation

**Date:** October 15, 2026  
**Auditor:** Cloud Agent  
**Repository:** https://github.com/viktorklasson/salesys-help-center  
**Deployment:** docs.salesys.io (Netlify site 'salesys-help-center')

## Summary

✅ **Repository Verified:** This repo serves docs.salesys.io (confirmed via Netlify API)  
✅ **Private APIs Removed:** `/privateapi` endpoints were previously documented but have been removed (commit d0354bbd9)  
✅ **No Secrets Found:** No tokens, keys, or credentials found in git history or files  
⚠️ **Admin Endpoints Present:** Several admin-only endpoints are documented and should be excluded from MCP tools

---

---

## API Discovery & Services

**Base URL:** `https://app.salesys.se/api/<service>/...`

**Service Discovery:** Each service self-describes via `GET /api/<service>/service-v1`

### Known Services

| Service | Description | Example Endpoints |
|---------|-------------|-------------------|
| `users` | User management, auth, teams, projects | `/api/users/login-v1`, `/api/users/users-v1` |
| `orders` | Order management | `/api/orders/orders-v3`, `/api/orders/orders-v2` |
| `offers` | Agreements, web forms | `/api/offers/offers-v2`, `/api/offers/offers-v1` |
| `dial` | Telephony (calls, SMS) | `/api/dial/calls-v1`, `/api/dial/sms-v1` |
| `documents` | PDF, import, export | `/api/documents/export-v1` |
| `contacts` | Contact management | `/api/contacts/contacts-v1` |
| `calendar` | Calendar events | `/api/calendar/calendar-events-v2` |
| `products` | Product catalog | `/api/products/products-v1` |
| `realtime` | WebSocket connections | `/api/realtime/realtime-v1` |
| `events` | Async events, webhooks | `/api/events/events-v1`, `/api/events/webhooks-v1` |

---

## Findings

### 1. Private API Removal (✅ Resolved)

**Commit:** d0354bbd99c88ee0ad5cfa2eb9e32e56cf489780 (Sep 29, 2026)  
**Change:** Removed documentation for `/privateapi` endpoints

The documentation previously mentioned internal private endpoints under `/privateapi/{serviceName}/...`. These have been removed from the documentation, and only public `/api` endpoints remain.

### 2. Public Endpoint Scope (✅ Clarified)

Viktor has confirmed: **All endpoints in swagger.yaml + all service-v1 discoverable endpoints are public**.

The MCP server exposes all documented endpoints. The repository contains public documentation for docs.salesys.io.

**Total Documented Endpoints:** 86 endpoints in swagger.yaml  
**Admin-Only Endpoints:** These are included (they're publicly documented)  
**Deprecated Endpoints:** 4 endpoints marked deprecated (still included but flagged)

### 3. Deprecated Endpoints

The following endpoints are marked as deprecated and may be excluded:

- `GET /api/orders/orders-v2` (line 2652)
- `GET /api/orders/orders-v2/{orderId}` (line 2779)
- `GET /api/calendar/calendar-events-v1/{userId}` (line 3518)
- `GET /api/calendar/calendar-events-v1/{userId}/{eventId}` (line 3599)

### 4. Sensitive Operations

The following endpoints handle sensitive operations and should require confirmation:

- Password reset endpoints (`/api/users/password-reset-v1/*`)
- User activation (`/api/users/users-v1/{userId}/activation`)
- All DELETE operations (orders, offers, contacts, products, calendar events)
- Logout operations

### 5. URLs and Endpoints

**Production API:** `https://app.salesys.se/api`  
**Total Documented Endpoints:** 86  
**Public Endpoints:** ~63 (after excluding admin-only)

### 6. Git History

**No secrets or credentials found** in:
- Commit messages
- Deleted files
- Configuration files

---

## Recommendations for MCP Server

### 1. Endpoint Allowlist Strategy

Viktor has clarified: **The public allowlist includes everything currently on docs.salesys.io**:
- All endpoints documented in `swagger.yaml`
- All endpoints discoverable via each service's `GET /api/<service>/service-v1` endpoint

The MCP server exposes all of these endpoints. Safety is enforced via:
- **Mutation confirmation**: All mutating operations (POST, PUT, PATCH, DELETE) require an explicit `confirm: true` flag
- **Per-session tokens**: Tokens are never stored, only used for the current session
- **Clear warnings**: Users are prompted before any data-changing operation

### 2. API Discovery

The MCP server supports dynamic endpoint discovery:

1. **Service listing**: `GET /api/<service>/service-v1` returns `{name, endpoints:[{method, path}]}`
2. **Known services**:
   - `users` - Users, authentication, teams, projects, roles
   - `orders` - Order management, order jobs
   - `offers` - Agreements, mailing templates, web forms  
   - `dial` - Telephony: calls, call jobs, call lists, SMS
   - `documents` - PDF conversion, import, export
   - `contacts` - Contact management, fields, tags, updates
   - `calendar` - Calendar events and scheduling
   - `products` - Product catalog
   - `realtime` - WebSocket connections
   - `events` - Async events and webhooks

3. **Discovery flow**: MCP server can query service-v1 endpoints with the user's token to discover available endpoints in real-time

### 3. Safety Controls

- **Require confirmation** for all mutating operations (POST, PUT, PATCH, DELETE)
- **Read-only by default** unless user explicitly enables mutations
- **Per-session token** storage (never persist)
- **Audit logging** of all API calls made through MCP

### 4. Documentation

- Add prominent warning about token security
- Recommend using temporary tokens
- Advise rotating tokens after MCP sessions
- Link to SaleSys admin panel for token management

---

## Deployment Status

**Current Deployment:** Netlify site 'salesys-help-center' → docs.salesys.io  
**Deployment Source:** This repository (confirmed via Netlify API)  
**Build Command:** None (static HTML)  
**Publish Directory:** `/` (serves index.html and viewer/index.html)

---

## Conclusion

The repository is safe for public MCP deployment **with proper endpoint filtering**. The main risk is exposing admin-only endpoints, which can be mitigated by implementing the recommended allowlist strategy.

**Status:** ✅ **Approved for MCP deployment** - All documented endpoints are public
