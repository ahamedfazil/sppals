import {
    ILogEntry
} from "@pnp/logging";
import { IEventTelemetry } from "@microsoft/applicationinsights-web";
import jsSHA from "jssha";

export const _tenantName = () => {
    if (window && window.location && window.location.hostname) {
        return window.location.hostname.split(".sharepoint")[0];
    }
    return "UNKNOWN";
};


//#region Log Helper

export const _hashUser = (userEmail: string): string => {
    let hashedUser: string = "";
    if (userEmail) {
        userEmail = userEmail.toLowerCase();
        // https://caligatio.github.io/jsSHA/
        const SHA256 = new jsSHA('SHA-256', 'TEXT');
        SHA256.update(userEmail);
        hashedUser = SHA256.getHash("HEX");
    }
    return hashedUser;
};

export const _logMessageFormat = (entry: ILogEntry): string => {
    const msg: string[] = [];

    msg.push(entry.message);

    if (entry.data) {
        try {
            msg.push('Data: ' + JSON.stringify(entry.data));
        } catch (e) {
            msg.push(`Data: Error in stringify of supplied data ${e}`);
        }
    }
    return msg.join(' | ');
};

export const _logEventFormat = (eventName: string): IEventTelemetry => {
    let eventTelemetry: IEventTelemetry = null;
    eventTelemetry.name = `[${WEBPART_NAME_ENVV}] ${eventName}`;
    return eventTelemetry;
};

//#endregion