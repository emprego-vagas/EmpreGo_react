import { PublicClientApplication } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication({
    auth: {
        clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
        redirectUri: window.location.origin + "/login",
    },
    cache: {
        cacheLocation: "localStorage",
    },
});