
import {
    LogLevel,
    ILogListener,
    ILogEntry
} from "@pnp/logging";
import { ApplicationInsights, SeverityLevel } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from "history";

import { CONST } from "../utils/Const";
import { _logMessageFormat, _logEventFormat, _hashUser } from "../utils/Utilities";

export class AILogListenerService implements ILogListener {
    private static _appInsightsInstance: ApplicationInsights;
    private static _reactPluginInstance: ReactPlugin;

    constructor(currentUser: string) {
        if (!AILogListenerService._appInsightsInstance)
            AILogListenerService._appInsightsInstance = AILogListenerService._initializeAI(currentUser);
    }

    private static _initializeAI(currentUser?: string): ApplicationInsights {
        const browserHistory = createBrowserHistory({ basename: '' });
        AILogListenerService._reactPluginInstance = new ReactPlugin();
        const appInsights = new ApplicationInsights({
            config: {
                maxBatchInterval: 0,
                instrumentationKey: AZURE_APPINSIGHTS_INSTRUMENTATIONKEY_ENVV,
                namePrefix: WEBPART_NAME_ENVV, // Used as Postfix for cookie and localStorage 
                disableFetchTracking: false,  // To avoid tracking on all fetch
                disableAjaxTracking: true,    // Not to autocollect Ajax calls
                extensions: [AILogListenerService._reactPluginInstance],
                extensionConfig: {
                    [AILogListenerService._reactPluginInstance.identifier]: { history: browserHistory }
                }
            }
        });

        appInsights.loadAppInsights();
        appInsights.context.application.ver = WEBPART_VERSION_ENVV; // application_Version
        appInsights.setAuthenticatedUserContext(_hashUser(currentUser)); // user_AuthenticateId
        return appInsights;
    }

    public static getReactPluginInstance(): ReactPlugin {
        if (!AILogListenerService._reactPluginInstance) {
            AILogListenerService._reactPluginInstance = new ReactPlugin();
        }
        return AILogListenerService._reactPluginInstance;
    }

    public trackEvent(name: string): void {
        if (AILogListenerService._appInsightsInstance)
            AILogListenerService._appInsightsInstance.trackEvent(_logEventFormat(name), CONST.ApplicationInsights.CustomProps);
    }

    public log(entry: ILogEntry): void {
        const msg = _logMessageFormat(entry);
        if (entry.level === LogLevel.Off) {
            // No log required since the level is Off
            return;
        }

        if (AILogListenerService._appInsightsInstance)
            switch (entry.level) {
                case LogLevel.Verbose:
                    AILogListenerService._appInsightsInstance.trackTrace({ message: msg, severityLevel: SeverityLevel.Verbose }, CONST.ApplicationInsights.CustomProps);
                    break;
                case LogLevel.Info:
                    AILogListenerService._appInsightsInstance.trackTrace({ message: msg, severityLevel: SeverityLevel.Information }, CONST.ApplicationInsights.CustomProps);
                    console.log({ ...CONST.ApplicationInsights.CustomProps, Message: msg });
                    break;
                case LogLevel.Warning:
                    AILogListenerService._appInsightsInstance.trackTrace({ message: msg, severityLevel: SeverityLevel.Warning }, CONST.ApplicationInsights.CustomProps);
                    console.warn({ ...CONST.ApplicationInsights.CustomProps, Message: msg });
                    break;
                case LogLevel.Error:
                    AILogListenerService._appInsightsInstance.trackException({ error: new Error(msg), severityLevel: SeverityLevel.Error });
                    console.error({ ...CONST.ApplicationInsights.CustomProps, Message: msg });
                    break;
            }
    }
}
