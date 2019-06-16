import { ICurrentUserState } from "./IUser";

export interface IAppState {
  currentUser: ICurrentUserState;
  isFetched?: boolean;
  error?: any;
}
