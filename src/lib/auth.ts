
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URL;

if (!mongoUri) {
  throw new Error("MONGODB_URL is not configured");
}

const mongoClient = new MongoClient(mongoUri);

export const auth = betterAuth({
  database: mongodbAdapter(
    mongoClient.db("bazar-dor-auth-db")
  ),

  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    ...(process.env.BETTER_AUTH_GOOGLE_CLIENT_ID &&
    process.env.BETTER_AUTH_GOOGLE_SECRET
      ? {
          google: {
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,
          },
        }
      : {}),

    ...(process.env.BETTER_AUTH_GITHUB_CLIENT_ID &&
    process.env.BETTER_AUTH_GITHUB_SECRET
      ? {
          github: {
            clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
            clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET,
          },
        }
      : {}),
  },

  trustedOrigins: [
    "https://bazar-dor-web-project.vercel.app",
    ...(process.env.VERCEL_URL
      ? [`https://${process.env.VERCEL_URL}`]
      : []),
  ],
});
