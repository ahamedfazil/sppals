import * as React from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { MessageBar } from "office-ui-fabric-react/lib/MessageBar";
import { MessageBarType } from "office-ui-fabric-react/lib/components/MessageBar";
import { ILoaderProps } from "../models/ILoaderProps";

export const Loader: React.SFC<ILoaderProps> = (props): JSX.Element => {
  return (
    <div>
      {!props.isFetched &&
        (props.isError ? (
          <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
            Something went wrong
          </MessageBar>
        ) : (
          <div>
            <Spinner size={SpinnerSize.large} />
          </div>
        ))}
    </div>
  );
};
