import * as React from "react";
import {
  Dialog,
  DialogType,
  DialogFooter
} from "office-ui-fabric-react/lib/Dialog";
import {
  PrimaryButton,
  DefaultButton
} from "office-ui-fabric-react/lib/Button";
import { ProgressIndicator } from "office-ui-fabric-react/lib/ProgressIndicator";
import * as strings from 'FormFieldStrings';
import styles from "./DialogBlocking.module.scss";

export interface IDialogBlocking {
  showConfirmDialog: boolean;
  showProgressDialog: boolean;
  showProgress: boolean;
  showCommentDialog?: boolean;
  progressDialogText?: string;
  dialogTitle: string;
  error?: any;
  getDialogResponse?: (response: any) => void;
}

const DialogBlocking: React.SFC<IDialogBlocking> = props => {
  return (
    <div>
      {!props.showConfirmDialog ? (
        <Dialog
          hidden={!props.showProgressDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: props.dialogTitle
          }}
          modalProps={{
            isBlocking: true,
            containerClassName: styles["DialogMainOverride"] + " ms-Dialog-main-content"
          }}
        >
          <div className="ms-Dialog-main-content">
            {props.showProgress === true ? (
              <ProgressIndicator description={props.progressDialogText} />
            ) : (
              <DialogFooter>
                <PrimaryButton
                  onClick={() => {
                    if (props.error) {
                      props.getDialogResponse(false);
                    } else {
                      props.getDialogResponse(true);
                    }
                  }}
                  text={strings.DialogBlockingOK}
                />
              </DialogFooter>
            )}
          </div>
        </Dialog>
      ) : (
        <Dialog
          hidden={!props.showConfirmDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: props.dialogTitle
          }}
          modalProps={{
            isBlocking: true,
            containerClassName: styles["DialogMainOverride"]
          }}
        >
          <DialogFooter>
            <PrimaryButton onClick={() => props.getDialogResponse(true)} text={strings.DialogBlockingOK} />
            <DefaultButton
              onClick={() => props.getDialogResponse(false)}
              text={strings.DialogBlockingCancel}
            />
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default DialogBlocking;
