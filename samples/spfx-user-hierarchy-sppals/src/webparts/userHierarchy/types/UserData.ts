
export interface IUserData {
  name: string;
  attributes?: IUserAttributes;
  children?: IUserData[];
}

export interface IUserAttributes {
  Department: string;
  Email: string;
}
