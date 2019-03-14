import {
  ICurrentUser,
  IUserAdaptiveCardState
} from "../models/IUserAdaptiveCardState";
import pnp from "@pnp/pnpjs";

export async function getCurrentUser(
  currentUser: ICurrentUser,
  onGetUserSuccess: (user: ICurrentUser) => void,
  onGetUserError: (error: any) => void
) {
  const userState: ICurrentUser = { ...currentUser };
  try {
    await pnp.sp.web.currentUser
      .get()
      .then(async response => {
        userState.email = response.UserPrincipalName;
        userState.fullName = response.Title;
        await pnp.sp.profiles
          .getPropertiesFor(response.LoginName)
          .then(res => {
            userState.imageURL = res.PictureUrl;
            onGetUserSuccess(userState);
          })
          .catch(error => onGetUserError(error));
      })
      .catch(error => {
        console.log(error);
        // Dispatch an Action for Error in getCurrentUser
        onGetUserError(error);
      });
  } catch (error) {
    console.log(error);
    // Dispatch an Action for Error in getCurrentUser
    onGetUserError(error);
  }
}

export const InitialState: IUserAdaptiveCardState = {
  isCurrentUserFetched: false,
  isError: false,
  currentUser: {
    imageURL: "",
    email: "",
    fullName: ""
  }
};
