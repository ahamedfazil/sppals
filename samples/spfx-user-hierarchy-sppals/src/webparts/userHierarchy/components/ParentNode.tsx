import * as React from "react";
import {
  PeoplePicker,
  PrincipalType
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface IParentUserNodeProps {
  getParentUserValue?: (value: any[]) => void;
  context: WebPartContext;
}

export const ParentUserNode = React.memo<IParentUserNodeProps>(
  (props): JSX.Element => {
    return (
      <div>
        <PeoplePicker
          context={props.context}
          titleText="Parent User"
          personSelectionLimit={1}
          selectedItems={items => props.getParentUserValue(items)}
          showHiddenInUI={false}
          principalTypes={[PrincipalType.User]}
          resolveDelay={1000}
        />
      </div>
    );
  }
);
