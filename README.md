# SaleSys Help Center

The SaleSys help center (docs.salesys.io), built with Next.js and Payload CMS on MongoDB.

- Public site: `src/app/(frontend)`
- Admin panel: `/admin` (`src/app/(payload)`)
- CMS schema: `src/payload.config.ts`, `src/collections`, `src/globals`, `src/fields`

## Local development

1. `cp .env.example .env` and set `PAYLOAD_SECRET`.
2. Start MongoDB, either installed locally or with `docker compose up -d mongo`.
3. `npm install && npm run dev`, then open http://localhost:3000.
4. Load the content backup into an empty database: `npm run content:seed`.

After changing collections, globals or fields, run `npm run generate:types`.

### Content backup

`seed/content.json` and `seed/media` hold all CMS content.

- `npm run content:export` writes the current database to the backup.
- `npm run content:seed` loads the backup into an empty database.
- `npm run content:seed:force` replaces all content with the backup.

## Production

The app runs with Docker Compose: the app (built from the `Dockerfile`), MongoDB and Caddy, which serves HTTPS for the domain in `Caddyfile`.

### First deploy

1. Point the domain's DNS to the server and open ports 80 and 443.
2. Clone the repo on the server and create `.env.production`:

   ```sh
   DATABASE_URL=mongodb://mongo/salesys-help-center
   PAYLOAD_SECRET=<output of: openssl rand -hex 32>
   ```

3. Start everything: `docker compose up -d --build`
4. Load the content: `docker compose run --rm seed`
5. Open https://docs.salesys.io/admin and create the first admin user.

### Admin users

There is no email sending. Add users in the admin panel under Users, with an email and password,
and share the password with them. Only addresses ending in `@salesys.se` are allowed.
To reset a forgotten password, open the user in the admin panel and set a new one.

### Updating

```sh
git pull
docker compose up -d --build
```

To replace the live content with `seed/content.json` (this overwrites edits made in the live admin panel):

```sh
docker compose run --rm --build -e SEED_FORCE=true seed
```

### Data

Docker volumes hold the data that must survive redeploys:

- `data`: the MongoDB database
- `media`: uploaded files
- `caddy_data`: HTTPS certificates

Back up the database with:

```sh
docker compose exec mongo mongodump --archive --gzip > backup-$(date +%F).gz
```

MongoDB is only reachable from the server itself (`127.0.0.1:27017`), never publicly.

## Tests

`npm test` runs the integration (Vitest) and end-to-end (Playwright) tests.
