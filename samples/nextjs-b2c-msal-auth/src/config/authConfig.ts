import { Configuration, LogLevel } from '@azure/msal-browser';

export const b2cPolicies = {
    authorities: {
        signUpSignIn: {
            authority:
                'https://sppalsorgg.b2clogin.com/sppalsorgg.onmicrosoft.com/b2c_1_sppalsorgg',
        }
    },
    authorityDomain: 'sppalsorgg.b2clogin.com',
};

export const msalConfig: Configuration = {
    auth: {
        clientId: 'c9xxx-xxxx-xxxx-xxxx-xxx', // This is the ONLY mandatory field that you need to supply.
        authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
        knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
        redirectUri: '/', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
        postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
        navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
    },
    cache: {
        cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: unknown, message: unknown, containsPii: unknown) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};