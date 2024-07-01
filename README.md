# Search Engine

## Setting up a local Postgres instance

1. Install [Postgres](https://www.postgresql.org/download/).
2. Create a new database called `search_engine`.
3. Create a copy of the `.env.example` file and name it `.env.local`. Fill in the fields with the appropriate values.
4. Run `npm run seed-db` to seed the database with some sample data.

## Commands (to use during development)

- `npm run dev`: Start the development server.
- `npm run build`: Build the project.
- `npm run start`: Start the production server.
- `npm run lint`: Lint the project.
- `npm run prisma:generate`: Re-generate the prisma client. This will update the types in `@prisma/client` to reflect any changes in the schema.
- `npm run prisma:migrate`: Create prisma migration files. Should be run after changing the schema in `schema/prisma.schema`.
