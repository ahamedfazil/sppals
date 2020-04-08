import * as React from "react";

import { Label } from "office-ui-fabric-react/lib/Label";
import { css } from "office-ui-fabric-react/lib/Utilities";
import { ControlMode } from "../../../../common/datatypes/ControlMode";
import * as stylesImport from "office-ui-fabric-react/lib/components/TextField/TextField.types";
const styles: any = stylesImport;

import ardStyles from "./FormField.module.scss";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IFormFieldProps {
  className?: string;
  controlMode: ControlMode;
  context: WebPartContext;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  active?: boolean;
  value: any;
  errorMessage?: string;
  valueChanged(newValue: any): void;
}

// export interface IFormFieldPeoplePickerProps {
//   personSelectionLimit?: number;
//   groupName?: string;
//   principleTypes?: any[];
//   defaultSelectedUsers?: string[];
// }

const FormField: React.SFC<IFormFieldProps> = props => {
  const {
    children,
    className,
    description,
    disabled,
    label,
    required,
    active,
    errorMessage
  } = props;
  const formFieldClassName = css(
    "ard-formField",
    ardStyles.formField,
    styles.root,
    className,
    {
      ["is-required " + styles.rootIsRequired]: required,
      ["is-disabled " + styles.rootIsDisabled]: disabled,
      ["is-active " + styles.rootIsActive]: active
    }
  );
  const isDescriptionAvailable = Boolean(props.description || errorMessage);

  return (
    <div className={css(formFieldClassName, "od-ClientFormFields-field")}>
      <div className={css("ard-FormField-wrapper", styles.wrapper)}>
        {label && (
          <Label
            className={css(ardStyles.label, { ["is-required"]: required })}
          >
            {label}
          </Label>
        )}
        <div
          className={css(
            "ard-FormField-fieldGroup",
            ardStyles.controlContainerDisplay,
            active && styles.fieldGroupIsFocused,
            errorMessage && styles.invalid
          )}
        >
          {children}
        </div>
      </div>
      {isDescriptionAvailable && (
        <span>
          {description && (
            <span
              className={css("ard-FormField-description", styles.description)}
            >
              {description}
            </span>
          )}
          {errorMessage && (
            <div className={ardStyles.error} aria-live="assertive">
              {errorMessage}
              {/* <p
                className={css(
                  "ard-FormField-errorMessage",
                  AnimationClassNames.slideDownIn20,
                  styles.errorMessage
                )}
              >
                {Icon({ iconName: "Error", className: styles.errorIcon })}
                <span
                  data-automation-id="error-message"
                >
                  {errorMessage}
                </span>
              </p> */}
              {/* <DelayedRender>
                <p className={css('ard-FormField-errorMessage', AnimationClassNames.slideDownIn20, styles.errorMessage)}>
                  {Icon({ iconName: 'Error', className: styles.errorIcon })}
                  <span className={styles.errorText} data-automation-id='error-message'>{errorMessage}</span>
                </p>
              </DelayedRender> */}
            </div>
          )}
        </span>
      )}
    </div>
  );
};

export default FormField;
