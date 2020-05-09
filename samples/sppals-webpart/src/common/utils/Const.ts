import { _tenantName } from "./Utilities";

export const CONST = {
    ApplicationInsights: {
        CustomProps: {
            Tenant: _tenantName(), App_Name: WEBPART_NAME_ENVV
        }
    }
};