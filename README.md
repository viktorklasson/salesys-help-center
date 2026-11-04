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

The app runs with Docker Compose: the app (built from the `Dockerfile`) and MongoDB. The app listens on
`127.0.0.1:3000`; nginx on the server proxies `docs.salesys.io` to it and handles HTTPS (certbot).

The server has too little memory to build the app, so build the image on your own machine and copy it over.

### Build and copy the image

On your machine (PowerShell, Docker Desktop running):

```powershell
docker compose build app
docker save -o app.tar salesys-help-center-app
scp -i $HOME\.ssh\adam.pem app.tar ubuntu@adam.salesys.se:~/app.tar
Remove-Item app.tar
```

On the server: `docker load -i ~/app.tar && rm ~/app.tar`

### First deploy

1. Point the domain's DNS to the server.
2. Clone the repo on the server and create `.env.production`:

   ```sh
   DATABASE_URL=mongodb://mongo/salesys-help-center
   PAYLOAD_SECRET=<output of: openssl rand -hex 32>
   ```

3. Build and copy the image (above), then start everything: `docker compose up -d --no-build`
4. Load the content: `docker compose run --rm seed`
5. Add an nginx site for `docs.salesys.io` that proxies to `http://127.0.0.1:3000`
   (with `client_max_body_size 50m` for uploads), then `sudo certbot --nginx -d docs.salesys.io`.
6. Open https://docs.salesys.io/admin and create the first admin user.

### Admin users

There is no email sending. Add users in the admin panel under Users, with an email and password,
and share the password with them. Only addresses ending in `@salesys.se` are allowed.
To reset a forgotten password, open the user in the admin panel and set a new one.

### Updating

Build and copy a new image (above), then on the server:

```sh
git pull
docker compose up -d --no-build
```

To replace the live content with `seed/content.json` (this overwrites edits made in the live admin panel):

```sh
docker compose run --rm --build -e SEED_FORCE=true seed
```

### Data

Docker volumes hold the data that must survive redeploys:

- `data`: the MongoDB database
- `media`: uploaded files

Back up the database with:

```sh
docker compose exec mongo mongodump --archive --gzip > backup-$(date +%F).gz
```

MongoDB is only reachable from the server itself (`127.0.0.1:27017`), never publicly.

## Tests

`npm test` runs the integration (Vitest) and end-to-end (Playwright) tests.
