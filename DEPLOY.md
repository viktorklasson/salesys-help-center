# Deployment Guide: SaleSys MCP Server

This guide covers deploying the SaleSys MCP server and documentation to production.

## Pre-Deployment Checklist

- [ ] All skills created and tested
- [ ] MCP index builds successfully (`npm run build`)
- [ ] Swagger.yaml is up to date
- [ ] Documentation articles reviewed
- [ ] Security audit completed (see AUDIT.md)
- [ ] Test tokens available for smoke testing

## Netlify Deployment

### Initial Setup

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Authenticate**
   ```bash
   netlify login
   ```

3. **Link Repository**
   ```bash
   cd /path/to/salesys-help-center
   netlify link
   ```

   Select the existing `salesys-help-center` site when prompted.

### Build Configuration

Netlify is already configured via `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "."
  functions = "netlify/functions"
```

### Deploy to Production

```bash
# Build locally first (recommended)
npm run build

# Deploy to production
npm run deploy
# or
netlify deploy --prod
```

### Verify Deployment

1. **Check MCP Server**
   ```bash
   curl -X POST https://docs.salesys.io/api/mcp \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TEST_TOKEN" \
     -d '{"method":"tools/list","params":{}}'
   ```

2. **Check Documentation Site**
   - Visit https://docs.salesys.io
   - Verify viewer works at https://docs.salesys.io/viewer
   - Check Connect page at https://docs.salesys.io/claude-skills

3. **Test Service Discovery**
   ```bash
   curl -X POST https://docs.salesys.io/api/mcp \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TEST_TOKEN" \
     -d '{
       "method":"tools/call",
       "params":{
         "name":"discover_service",
         "arguments":{"service":"contacts"}
       }
     }'
   ```

## Environment Setup

### No Environment Variables Required

The MCP server uses per-session tokens provided by users. No secrets need to be stored in Netlify.

### Build Environment

Netlify automatically installs dependencies and runs the build command. Ensure `package.json` specifies Node 18+:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Post-Deployment

### 1. Update Skills Site

If skills should be hosted separately at `skills.salesys.se`:

```bash
# Navigate to the skills repository
cd /path/to/salesys-skills

# Copy built skills
cp /path/to/salesys-help-center/public/skills/*.zip ./

# Deploy
netlify deploy --prod
```

### 2. Announce to Users

Update the following locations:
- SaleSys admin panel with MCP server URL
- Internal documentation
- Customer-facing help articles
- Release notes

### 3. Monitor Initial Usage

Check Netlify logs for:
- MCP endpoint usage
- Error rates
- Authentication failures
- Common API calls

```bash
netlify logs
```

## Continuous Deployment

### Automatic Deployments

Netlify can auto-deploy on git push:

1. Go to Netlify dashboard
2. Select `salesys-help-center` site
3. Navigate to **Site Settings** > **Build & Deploy**
4. Enable **Continuous Deployment**
5. Set branch: `main` (or your production branch)

### Manual Rebuild

To rebuild without code changes (e.g., after swagger.yaml update):

```bash
netlify build
netlify deploy --prod
```

## Updating the MCP Server

### Adding New Endpoints

1. **Update swagger.yaml**
   ```yaml
   paths:
     /api/newservice/endpoint-v1:
       get:
         summary: Description
         tags: [NewService]
         ...
   ```

2. **Rebuild Index**
   ```bash
   npm run build:mcp-index
   ```

3. **Test Locally**
   ```bash
   npm run dev
   # Test the new endpoint via MCP
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Adding New Skills

1. **Create Skill Directory**
   ```bash
   mkdir -p skills/salesys-newfeature
   ```

2. **Create SKILL.md**
   ```markdown
   ---
   name: New Feature
   description: When to use this skill
   ---
   # Content here
   ```

3. **Build Skills**
   ```bash
   ./scripts/build-skills.sh
   ```

4. **Update Connect Page**
   Edit `docs/en/connect-to-claude.md` to include the new skill

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Rollback Procedure

If a deployment causes issues:

### Option 1: Netlify UI

1. Go to Netlify dashboard
2. Navigate to **Deploys**
3. Find the last working deployment
4. Click **Publish deploy**

### Option 2: CLI

```bash
# List recent deploys
netlify deploy:list

# Restore specific deploy
netlify deploy:restore --deploy-id DEPLOY_ID
```

### Option 3: Git Revert

```bash
git revert HEAD
git push
# Netlify will auto-deploy the revert
```

## Monitoring

### Netlify Analytics

View in Netlify dashboard:
- Request counts
- Function execution times
- Bandwidth usage
- Error rates

### MCP Server Metrics

Key metrics to track:
- **Endpoint usage**: Which tools are called most
- **Service discovery**: Which services are queried
- **Error rates**: Authentication vs. API errors
- **Confirmation rates**: How often users confirm mutations

### Custom Monitoring

Add to MCP server function if needed:

```typescript
// Log usage metrics
console.log(`MCP Call: ${name} by ${tokenHash}`);

// Track errors
if (error) {
  console.error(`MCP Error: ${error.message}`, {
    tool: name,
    error: error
  });
}
```

## Troubleshooting

### Build Failures

```bash
# Clear dependencies and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Function Timeout

Default timeout is 10s. For longer operations:

1. Check if operation can be optimized
2. Consider background function (15min timeout)
3. Split into multiple calls

### CORS Issues

Verify `netlify.toml` headers:

```toml
[[headers]]
  for = "/.netlify/functions/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
```

## Security Considerations

### Token Handling

- ✅ Tokens passed in headers only
- ✅ Never logged or stored
- ✅ Session-scoped only
- ✅ HTTPS enforced

### Rate Limiting

Consider adding if needed:

```typescript
// Example rate limit (not implemented yet)
const rateLimiter = {
  tokens: {},
  check(token) {
    // Implement rate limiting logic
  }
};
```

### API Allowlist

The allowlist includes:
- All endpoints in swagger.yaml
- All service-v1 discoverable endpoints

Safety enforced via mutation confirmation, not endpoint filtering.

## Support

For deployment issues:
- **Netlify Support**: https://answers.netlify.com
- **SaleSys Team**: Internal Slack/email

## Appendix: Viktor's Setup Tasks

Tasks that Viktor should complete:

### A. Netlify Configuration

- [ ] Confirm `docs.salesys.io` domain is pointing to `salesys-help-center` site
- [ ] Verify SSL certificate is active
- [ ] Check build logs for any warnings

### B. API Token Management

- [ ] Document where users get tokens (in SaleSys admin)
- [ ] Create sample/test tokens for documentation
- [ ] Set up token rotation recommendations

### C. Skills Distribution

- [ ] Decide: Keep skills in this repo OR move to `salesys-skills` repo?
  - If this repo: Skills are at `docs.salesys.io/skills/`
  - If separate repo: Skills are at `skills.salesys.se`
- [ ] Update download links in connect-to-claude.md accordingly

### D. Documentation Review

- [ ] Review all skill SKILL.md files for accuracy
- [ ] Verify Swedish terminology is correct
- [ ] Check code examples work with real API

### E. Monitoring Setup

- [ ] Set up Netlify analytics alerts
- [ ] Create dashboard for MCP usage
- [ ] Document escalation process for issues

### F. User Communication

- [ ] Announce MCP server availability
- [ ] Create onboarding guide
- [ ] Set up feedback channel

---

**Questions for Viktor:**

1. Should skills live at `docs.salesys.io/skills/` or `skills.salesys.se`?
2. What permissions should the sample/test tokens have?
3. Any specific monitoring/alerting requirements?
4. Timeline for announcing to users?
