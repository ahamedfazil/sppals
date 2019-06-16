export interface IUserState {
  error?: any;
  currentUser: ICurrentUserState;
}

export interface ICurrentUserState {
  id?: number;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  loginName?: string;
  accountName?: string;
  costCenter?: string;
  department?: string;
  managerId?: string;
  memberOf?: string[];
  directReports?: any;
}
