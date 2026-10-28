import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoUri = process.env.BETTER_AUTH_DB_URL;
const mongoClient = mongoUri ? new MongoClient(mongoUri) : null;

const googleClientId = process.env.BETTER_AUTH_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.BETTER_AUTH_GOOGLE_SECRET;
const githubClientId = process.env.BETTER_AUTH_GITHUB_CLIENT_ID;
const githubClientSecret = process.env.BETTER_AUTH_GITHUB_SECRET;

export const auth = betterAuth({
  ...(mongoClient ? { database: mongodbAdapter(mongoClient.db('bazar-dor-auth-db')) } : {}),
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? { google: { clientId: googleClientId, clientSecret: googleClientSecret } }
      : {}),
    ...(githubClientId && githubClientSecret
      ? { github: { clientId: githubClientId, clientSecret: githubClientSecret } }
      : {}),
  },
});
