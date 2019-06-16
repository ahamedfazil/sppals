import pnp from "@pnp/pnpjs";
import { ICurrentUserState } from "../models/IUser";
import update from "immutability-helper";

export const getUserByID = (userID: any) => {
  return pnp.sp.web.siteUsers
    .getById(userID)
    .get()
    .then(response => {
      return response;
    });
};

export async function getUserIDFromPP(pplValue: any[]) {
  let userID: number = null;
  if (pplValue.length > 0) {
    if (pplValue[0].secondaryText !== "") {
      await pnp.sp.web
        .ensureUser(pplValue[0].secondaryText)
        .then((results: any) => {
          userID = results.data.Id;
        });
    } else {
      await pnp.sp.web.ensureUser(pplValue[0].key).then((results: any) => {
        userID = results.data.Id;
      });
    }
  }
  return userID;
}

export async function getCurrentUser(
  currentUser: ICurrentUserState,
  onGetUserSuccess: (user: ICurrentUserState) => void,
  onGetUserError: (error: any) => void
) {
  const userState: ICurrentUserState = update(currentUser, {
    memberOf: { $set: [] }
  });
  try {
    const userDataResponse = await pnp.sp.web.currentUser
      .get()
      .then(response => {
        userState.id = response.Id;
        userState.loginName = response.LoginName;
        userState.email = response.Email;
        userState.name = response.Title;
        return response;
      });

    const userPropertiesPromise = pnp.sp.profiles
      .getPropertiesFor(userDataResponse.LoginName)
      .then(response => {
        return response;
      });

    const userGroupsPromise = pnp.sp.web.siteUsers
      .getById(userDataResponse.Id)
      .groups.get()
      .then(response => {
        return response;
      });

    Promise.all([userPropertiesPromise, userGroupsPromise])
      .then(response => {
        const propertyResponse = response[0];
        userState.directReports = propertyResponse.DirectReports.results;
        const resultProps = propertyResponse.UserProfileProperties.results;
        for (const prop of resultProps) {
          if (prop.Key === "AccountName") {
            userState.accountName = prop.Value;
          } else if (prop.Key === "FirstName") {
            userState.firstName = prop.Value;
          } else if (prop.Key === "LastName") {
            userState.lastName = prop.Value;
          } else if (prop.Key === "costCenter") {
            userState.costCenter = prop.Value;
          } else if (prop.Key === "DepartmentTitle") {
            userState.department = prop.Value;
          } else if (prop.Key === "Manager") {
            userState.managerId = prop.Value;
          }
        }
        const groupsResponse = response[1];
        for (const groupTitle of groupsResponse) {
          userState.memberOf.push(groupTitle.Title);
        }
        onGetUserSuccess(userState);
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
