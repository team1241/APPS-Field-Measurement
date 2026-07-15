import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // Replace with your Clerk Frontend API URL
      // or with `process.env.CLERK_JWT_ISSUER_DOMAIN`
      // and configure CLERK_JWT_ISSUER_DOMAIN on the Convex Dashboard
      // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
      // NOTE: This needs to directly access the env variable
      domain: process.env.CLERK_FRONTEND_API_URL!,
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;