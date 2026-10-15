import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { marked } from 'marked';

function buildEndpointIndex(swagger) {
  const endpoints = [];
  const paths = swagger.paths || {};
  
  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
      
      // Include deprecated endpoints but flag them
      const isDeprecated = operation.deprecated === true;
      
      const tags = operation.tags || [];
      const summary = operation.summary || '';
      const description = operation.description || '';
      
      endpoints.push({
        method: method.toUpperCase(),
        path,
        operationId: operation.operationId,
        summary,
        description,
        tags,
        deprecated: isDeprecated,
        parameters: operation.parameters || [],
        requestBody: operation.requestBody,
        responses: operation.responses,
      });
    }
  }
  
  return endpoints;
}

async function indexMarkdownDocs() {
  const docsIndex = [];
  const docsDir = path.join(process.cwd(), 'docs');
  
  for (const lang of ['en', 'sv']) {
    const langDir = path.join(docsDir, lang);
    const files = await fs.readdir(langDir);
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const content = await fs.readFile(path.join(langDir, file), 'utf-8');
      const firstLine = content.split('\n')[0];
      const title = firstLine.startsWith('#') ? firstLine.replace(/^#+\s*/, '') : file.replace('.md', '');
      
      docsIndex.push({
        id: file.replace('.md', ''),
        lang,
        title,
        path: `docs/${lang}/${file}`,
        excerpt: content.substring(0, 500),
      });
    }
  }
  
  return docsIndex;
}

async function buildMcpIndex() {
  console.log('Building MCP tools index...');
  
  // Load swagger
  const swaggerContent = await fs.readFile('swagger.yaml', 'utf-8');
  const swagger = yaml.load(swaggerContent);
  
  // Build endpoint index from swagger.yaml (all publicly documented endpoints)
  const endpoints = buildEndpointIndex(swagger);
  const deprecatedCount = endpoints.filter(e => e.deprecated).length;
  console.log(`Indexed ${endpoints.length} endpoints from swagger.yaml (${deprecatedCount} deprecated)`);
  
  // Index docs
  const docs = await indexMarkdownDocs();
  console.log(`Indexed ${docs.length} documentation articles`);
  
  // Group endpoints by tag
  const endpointsByTag = {};
  for (const endpoint of endpoints) {
    for (const tag of endpoint.tags) {
      if (!endpointsByTag[tag]) {
        endpointsByTag[tag] = [];
      }
      endpointsByTag[tag].push(endpoint);
    }
  }
  
  // Define known services
  const services = [
    {
      name: 'users',
      description: 'User management, authentication, teams, projects, roles',
      tags: ['Authentication', 'Users', 'Teams', 'Projects', 'User Roles', 'Access Keys', 'Registration Links']
    },
    {
      name: 'orders',
      description: 'Order management, order jobs, order information',
      tags: ['Orders']
    },
    {
      name: 'offers',
      description: 'Agreements, mailing templates, web forms',
      tags: ['Offers']
    },
    {
      name: 'dial',
      description: 'Telephony: calls, call jobs, call lists, SMS',
      tags: ['Calls']
    },
    {
      name: 'documents',
      description: 'PDF conversion, import, export',
      tags: []
    },
    {
      name: 'contacts',
      description: 'Contact management, fields, tags, updates, exclude lists',
      tags: ['Contacts', 'Contact Fields', 'Contact Tags', 'Contact Updates', 'Exclude Lists']
    },
    {
      name: 'calendar',
      description: 'Calendar events and scheduling',
      tags: ['Calendar Events']
    },
    {
      name: 'products',
      description: 'Product catalog management',
      tags: ['Products']
    },
    {
      name: 'realtime',
      description: 'WebSocket connections for real-time updates',
      tags: []
    },
    {
      name: 'events',
      description: 'Async events and webhooks',
      tags: ['Events', 'Webhooks']
    }
  ];
  
  // Build index
  const index = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    server: swagger.servers?.[0]?.url || 'https://app.salesys.se/api',
    info: {
      title: swagger.info.title,
      description: swagger.info.description,
      version: swagger.info.version,
    },
    services,
    tags: swagger.tags || [],
    endpoints,
    endpointsByTag,
    docs,
    schemas: swagger.components?.schemas || {},
  };
  
  // Write to generated/ (bundled into the function via netlify.toml included_files)
  const outputDir = path.join(process.cwd(), 'generated');
  await fs.mkdir(outputDir, { recursive: true });
  
  const outputPath = path.join(outputDir, 'mcp-index.json');
  await fs.writeFile(outputPath, JSON.stringify(index, null, 2));
  
  console.log(`MCP index written to ${outputPath}`);
  console.log(`Total public endpoints: ${endpoints.length}`);
  console.log(`Services: ${services.map(s => s.name).join(', ')}`);
  console.log(`Tags: ${Object.keys(endpointsByTag).join(', ')}`);
}

buildMcpIndex().catch(console.error);
