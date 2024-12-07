/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.tsx",
    dialect: "postgresql",
    dbCredentials: {
      url: 'postgresql://neondb_owner:bB5G9HmFzvZk@ep-polished-base-a5jk0vwj.us-east-2.aws.neon.tech/AI-Content_Generator?sslmode=require',
    }
  };