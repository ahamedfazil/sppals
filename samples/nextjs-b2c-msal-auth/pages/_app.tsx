import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { EventMessage, EventType, PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../src/config/authConfig';
import { MsalProvider } from '@azure/msal-react';


export const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event: EventMessage) => {
  if (
    (event.eventType === EventType.LOGIN_SUCCESS ||
      event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
      event.eventType === EventType.SSO_SILENT_SUCCESS) &&
    event.payload
  ) {
    // @ts-ignore
    msalInstance.setActiveAccount(event.payload.account);
  }
});


export default function App({ Component, pageProps }: AppProps) {
  return <>
    <MsalProvider instance={msalInstance}>
      <Component {...pageProps} />
    </MsalProvider>
  </>
}
