import { IAppState } from "../models/IAppModel";

export const InitialAppState: IAppState = {
  currentUser: {
    id: undefined,
    name: "",
    email: "",
    firstName: "",
    lastName: "",
    title: "",
    loginName: "",
    accountName: "",
    costCenter: "",
    department: "",
    managerId: "",
    memberOf: [],
    directReports: null
  }
};
