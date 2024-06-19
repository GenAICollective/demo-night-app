# GenAI Collective Demo Night App 🚀

This is the live feedback app we use during all our GenAI Collective demo night events! [Example event](https://lu.ma/sf-demo)

![Demo night app screens](https://github.com/GenAICollective/demo-night-app/assets/13221124/17248c6c-8e58-46d5-b941-e1f63387f620)

<a href="https://www.loom.com/share/d1b18cb1b4ff4e99b097d727045442ee">
  <img style="max-width:200px;" src="https://cdn.loom.com/sessions/thumbnails/d1b18cb1b4ff4e99b097d727045442ee-with-play.gif">
</a>
  
## Contributing

Please reach out to [Aqeel Ali](https://www.linkedin.com/in/aliaqeel/) (<aqeel@genaicollective.ai>) if you'd like to contribute to this community project!

<a href="https://www.loom.com/share/79236c4d42364fbcbcbfa24bc066620c">
  <img style="max-width:200px;" src="https://cdn.loom.com/sessions/thumbnails/79236c4d42364fbcbcbfa24bc066620c-with-play.gif">
</a>

## Getting Started

### 1. Install the packages

```bash
yarn install
yarn global add dotenv-cli
```

### 2. Set up environment variables

For `.env` key/value pairs, see `.env.example`.

### 3. Start the local DB Docker Compose service

```bash
./start-database.sh
```

### 4. Push the schema and seed the local DB with a "<test@example.com>" example account and test event

```bash
yarn db:push
yarn db:seed
```

### 5. Start the development server

```bash
yarn dev
```

- The local app should now be available at `localhost:3000` and `localhost:300/admin`!
- You can log in with "<test@example.com>"

## Data Ops

### Dev Data Studio

To manipulate the data and relations directly via Prisma during local development:

```bash
yarn db:studio
```

### Migration

To alter the data schema (adding/removing/editing columns, changing unique/compound/primary keys, etc.), make changes in `schema.prisma` file, save, and run:

```bash
yarn db:migrate
```

- Fixing failed migrations:
  <https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing>
