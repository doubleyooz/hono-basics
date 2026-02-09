import { betterAuth } from "better-auth"


import env from "../env.js";

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL, 
    socialProviders: {
        google: { 
            clientId: env.GOOGLE_CLIENT_ID as string, 
            clientSecret: env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
})


export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}