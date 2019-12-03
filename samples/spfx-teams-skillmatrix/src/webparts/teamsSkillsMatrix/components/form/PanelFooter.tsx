import {
  DefaultButton,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";
import * as React from "react";

export const PanelFooter = (props): JSX.Element => (
  <div>
    <PrimaryButton onClick={() => console.log("saved")}>Save</PrimaryButton>
    <DefaultButton onClick={() => console.log("cancel")}>Cancel</DefaultButton>
  </div>
);
