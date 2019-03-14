export interface IUserAdaptiveCardState {
  isCurrentUserFetched: boolean;
  isError: boolean;
  currentUser: ICurrentUser;
}

export interface ICurrentUser {
  imageURL: any;
  email: string;
  fullName: string;
}

