import dotenv from 'dotenv';
dotenv.config({
    path: process.env.ENV_FILE || ".env.local",
  });
  
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'tsx ./prisma/seed.ts',
    },
    datasource: {
        url: env('DATABASE_URL'),
    },
})