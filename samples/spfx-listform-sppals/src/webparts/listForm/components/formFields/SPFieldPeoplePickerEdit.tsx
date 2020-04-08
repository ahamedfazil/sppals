import * as React from "react";
import { ISPFormFieldProps } from "./SPFormField";
import {
  PeoplePicker,
  PrincipalType
} from "@pnp/spfx-controls-react/lib/PeoplePicker";

const SPFieldPeoplePickerEdit: React.SFC<ISPFormFieldProps> = props => {
  let defaultSelectedUsers: string[] = [];
  const principalType: PrincipalType[] =
    props.fieldSchema.PrincipalAccountType === "User"
      ? [PrincipalType.User]
      : [PrincipalType.User, PrincipalType.SecurityGroup];
  if (props.value && Array.isArray(props.value)) {
    defaultSelectedUsers = props.value.map(user => {
      if (user.EntityData && user.EntityData.Email) {
        return user.EntityData.Email;
      } else if (user.Email) {
        return user.Email;
      }
    });
  }
  if (props.fieldSchema.SharePointGroupID) {
    console.warn(
      "Currently, people picker field does not support by SharePoint Group Filter, instead it searches from the tenant"
    );
  }
  console.log("Faz-Log: props.value", props.value);
  return (
    <PeoplePicker
      context={props.context}
      personSelectionLimit={props.fieldSchema.AllowMultipleValues ? 50 : 1} // For multiple we set 50 as max
      selectedItems={(items: any[]) => {
        console.log("Faz-Log: items", items);
        let selectedEmails: any[] = [];
        selectedEmails = items.map(item => {
          return {
            DisplayName: item.text,
            Email: item.secondaryText,
            Claims: item.loginName
          };
        });
        console.log("Faz-Log: items", selectedEmails);
        props.valueChanged(selectedEmails);
      }}
      principalTypes={principalType}
      defaultSelectedUsers={defaultSelectedUsers}
      isRequired={props.fieldSchema.Required}
      resolveDelay={1000}
    />
  );
};

export default SPFieldPeoplePickerEdit;
