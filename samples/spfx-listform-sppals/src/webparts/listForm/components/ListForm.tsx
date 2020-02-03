import * as React from "react";
import { IFieldConfiguration } from "./IFieldConfiguration";
import { IListFormProps } from "./IListFormProps";
import { IListFormState } from "./IListFormState";
import { ControlMode } from "../../../common/datatypes/ControlMode";

import { IListFormService } from "../../../common/services/IListFormService";
import { ListFormService } from "../../../common/services/ListFormService";

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import {
  DefaultButton,
  PrimaryButton
} from "office-ui-fabric-react/lib/Button";
import { DirectionalHint } from "office-ui-fabric-react/lib/ContextualMenu";
import {
  MessageBar,
  MessageBarType
} from "office-ui-fabric-react/lib/MessageBar";
import { css } from "office-ui-fabric-react/lib/Utilities";

import DynamicComponent from "./DynamicComponent";
import styles from "./ListForm.module.scss";
import SPFormField from "./formFields/SPFormField";
import * as strings from "ListFormStrings";
import { _Item } from "@pnp/sp/items/types";
import { sp } from "@pnp/sp";
import ReactFileReader from "react-file-reader";
import update from "immutability-helper";
import SPFieldFilesList from "./formFields/SPFieldFilesList";
import { IFileField } from "../../../common/services/datatypes/RenderListData";
import { CONST } from "../../../common/Utils/Const";
import DialogBlocking, { IDialogBlocking } from "./formFields/DialogBlocking";
import { delay } from "../../../common/Utils/Utilities";

export default class ListForm extends React.Component<
  IListFormProps,
  IListFormState
> {
  private listFormService: IListFormService;
  constructor(props: IListFormProps) {
    super(props);

    // set initial state
    this.state = {
      isLoadingSchema: false,
      isLoadingData: false,
      isSaving: false,
      data: {},
      originalData: {},
      errors: [],
      notifications: [],
      fieldErrors: {},
      attachmentField: [],
      dialogBlocking: {
        showConfirmDialog: false,
        showProgressDialog: false,
        showCommentDialog: false,
        showProgress: false,
        progressDialogText: "",
        dialogTitle: "",
        error: null
      }
    };
    this.listFormService = new ListFormService(
      props.webPartContext.spHttpClient
    );
  }

  public render() {
    let menuProps;
    if (this.state.fieldsSchema) {
      menuProps = {
        shouldFocusOnMount: true,
        directionalHint: DirectionalHint.topCenter,
        items: this.state.fieldsSchema
          .filter(filterFld => filterFld.InternalName !== "Attachments")
          .map(fld => ({
            key: fld.InternalName,
            name: fld.Title,
            onClick: (ev, item) => this.appendField(fld.InternalName)
          }))
      };
    }
    return (
      <div className={styles.listForm}>
        <div className={css(styles.title, "ms-font-xl")}>
          {this.props.title}
        </div>
        {this.props.description && (
          <div className={styles.description}>{this.props.description}</div>
        )}
        {this.renderNotifications()}
        {this.renderErrors()}
        {!this.props.listUrl ? (
          <MessageBar messageBarType={MessageBarType.warning}>
            Please configure a list for this component first.
          </MessageBar>
        ) : (
          ""
        )}
        {this.state.isLoadingSchema ? (
          <Spinner
            size={SpinnerSize.large}
            label={strings.LoadingFormIndicator}
          />
        ) : (
          this.state.fieldsSchema && (
            <div>
              <div
                className={css(
                  styles.formFieldsContainer,
                  this.state.isLoadingData ? styles.isDataLoading : null
                )}
              >
                {this.props.isApplixForm && (
                  <div>
                    <SPFormField
                      fieldSchema={CONST.ApplixForm.NaamField}
                      context={this.props.webPartContext}
                      controlMode={ControlMode.Display}
                      value={
                        this.props.webPartContext.pageContext.user.displayName
                      }
                      valueChanged={null}
                    />
                  </div>
                )}
                {this.renderFields()}
                {this.props.inDesignMode && (
                  <DefaultButton
                    aria-haspopup="true"
                    aria-label={strings.AddNewFieldAction}
                    className={styles.addFieldToolbox}
                    title={strings.AddNewFieldAction}
                    menuProps={menuProps}
                    data-is-focusable="false"
                  >
                    <div className={styles.addFieldToolboxPlusButton}>
                      <i
                        aria-hidden="true"
                        className="ms-Icon ms-Icon--CircleAdditionSolid"
                      />
                    </div>
                  </DefaultButton>
                )}
                {this.props.showAttachmentField && (
                  <div>
                    {this.state.attachmentField.length > 0 && (
                      <SPFieldFilesList
                        defaultFiles={this.state.attachmentField}
                        removeFile={file => {
                          const newState = update(this.state, {
                            attachmentField: {
                              $set: file
                            },
                            fieldErrors: {
                              ["attachment"]: { $set: null }
                            }
                          });
                          this.setState(newState);
                        }}
                        showRemoveButton={
                          this.props.formType !== ControlMode.Display
                        }
                        error={this.state.fieldErrors["attachment"]}
                      />
                    )}
                    <ReactFileReader
                      base64={true}
                      multipleFiles={true}
                      handleFiles={(files: any) => {
                        let dummyFileField: IFileField[] = [];
                        files.base64.map((base64Val, fileIndex) => {
                          let singleFileField: IFileField = {
                            name: files.fileList[fileIndex].name,
                            rawData: base64Val,
                            isExistsInSP: false,
                            isRemove: false
                          };
                          dummyFileField.push(singleFileField);
                        });
                        const newState = update(this.state, {
                          attachmentField: {
                            $push: dummyFileField
                          },
                          fieldErrors: {
                            ["attachment"]: { $set: null }
                          }
                        });
                        this.setState(newState);
                      }}
                    >
                      <button type="button" title="Add attachments">
                        Add attachments
                      </button>
                    </ReactFileReader>
                    <div style={{ fontSize: 14, color: "#a80000" }}>
                      {this.state.fieldErrors["attachment"]}
                    </div>
                    {/* Need to handle error message */}
                  </div>
                )}
              </div>
              <div className={styles.formButtonsContainer}>
                {this.props.formType !== ControlMode.Display && (
                  <PrimaryButton
                    disabled={false}
                    text={strings[this.props.customFormName + "SaveButtonText"]}
                    onClick={() => this.saveItem()}
                  />
                )}
                {!this.props.isApplixForm && (
                  <DefaultButton
                    disabled={false}
                    text={strings.CancelButtonText}
                    onClick={() =>
                      this.readData(
                        this.props.listUrl,
                        this.props.formType,
                        this.props.id
                      )
                    }
                  />
                )}
              </div>
            </div>
          )
        )}
        <DialogBlocking
          showConfirmDialog={this.state.dialogBlocking.showConfirmDialog}
          showProgress={this.state.dialogBlocking.showProgress}
          showProgressDialog={this.state.dialogBlocking.showProgressDialog}
          dialogTitle={this.state.dialogBlocking.dialogTitle}
          progressDialogText={this.state.dialogBlocking.progressDialogText}
          error={this.state.dialogBlocking.error}
          getDialogResponse={(res: any) => {
            const dialogBlockingState: IDialogBlocking = update(
              this.state.dialogBlocking,
              {
                showConfirmDialog: { $set: false },
                showProgressDialog: { $set: false }
              }
            );
            if (res) {
              this.readData(
                this.props.listUrl,
                this.props.formType,
                this.props.id,
                dialogBlockingState
              );
              // place to navigate to different page
              if (this.props.onSubmitSucceeded) {
                this.props.onSubmitSucceeded();
              }
            } else {
              this.setState({
                dialogBlocking: dialogBlockingState
              });
            }
          }}
        />
      </div>
    );
  }

  private renderNotifications() {
    if (this.state.notifications.length === 0) {
      return null;
    }
    setTimeout(() => {
      this.setState({ ...this.state, notifications: [] });
    }, 4000);
    return (
      <div>
        {this.state.notifications.map((item, idx) => (
          <MessageBar messageBarType={MessageBarType.success}>
            {item}
          </MessageBar>
        ))}
      </div>
    );
  }

  private renderErrors() {
    return this.state.errors.length > 0 ? (
      <div>
        {this.state.errors.map((item, idx) => (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={true}
            onDismiss={ev => this.clearError(idx)}
          >
            {item}
          </MessageBar>
        ))}
      </div>
    ) : null;
  }

  private renderFields() {
    const { fieldsSchema, data, fieldErrors } = this.state;
    const fields = this.getFields();
    return fields && fields.length > 0 ? (
      <div className="ard-formFieldsContainer">
        {fields.map((field, idx) => {
          const fieldSchemas = fieldsSchema.filter(
            f => f.InternalName === field.fieldName
          );
          if (fieldSchemas.length > 0) {
            const fieldSchema = fieldSchemas[0];
            const value = data[field.fieldName];
            let extraData;
            if (data.hasOwnProperty(field.fieldName + ".")) {
              extraData = data[field.fieldName + "."];
            } else {
              extraData = Object.keys(data)
                .filter(
                  propName => propName.indexOf(field.fieldName + ".") === 0
                )
                .reduce((newData, pn) => {
                  newData[pn.substring(field.fieldName.length + 1)] = data[pn];
                  return newData;
                }, {});
            }
            const errorMessage = fieldErrors[field.fieldName];
            const fieldComponent = SPFormField({
              context: this.props.webPartContext,
              fieldSchema: fieldSchema,
              controlMode: this.props.formType,
              value: value,
              extraData: extraData,
              errorMessage: errorMessage,
              hideIfFieldUnsupported: !this.props.showUnsupportedFields,
              valueChanged: val => this.valueChanged(field.fieldName, val)
            });
            if (fieldComponent && this.props.inDesignMode) {
              return (
                <DynamicComponent
                  key={field.key}
                  index={idx}
                  removeField={index => this.removeField(index)}
                >
                  {fieldComponent}
                </DynamicComponent>
              );
            } else {
              return fieldComponent;
            }
          }
        })}
      </div>
    ) : (
      <MessageBar messageBarType={MessageBarType.warning}>
        No fields available!
      </MessageBar>
    );
  }

  public componentDidMount(): void {
    this.readSchema(this.props.listUrl, this.props.formType).then(() =>
      this.readData(this.props.listUrl, this.props.formType, this.props.id)
    );
  }

  public componentWillReceiveProps(
    nextProps: IListFormProps
  ): void {
    if (
      this.props.listUrl !== nextProps.listUrl ||
      this.props.formType !== nextProps.formType
    ) {
      this.readSchema(nextProps.listUrl, nextProps.formType).then(() =>
        this.readData(nextProps.listUrl, nextProps.formType, nextProps.id)
      );
    } else if (
      this.props.id !== nextProps.id ||
      this.props.formType !== nextProps.formType
    ) {
      this.readData(nextProps.listUrl, nextProps.formType, nextProps.id);
    }
  }

  private async readSchema(
    listUrl: string,
    formType: ControlMode
  ): Promise<void> {
    try {
      if (!listUrl) {
        this.setState({
          ...this.state,
          isLoadingSchema: false,
          fieldsSchema: null,
          errors: [strings.ConfigureListMessage]
        });
        return;
      }
      this.setState({ ...this.state, isLoadingSchema: true });
      const fieldsSchema = await this.listFormService.getFieldSchemasForForm(
        this.props.webPartContext.pageContext.web.absoluteUrl,
        listUrl,
        formType
      );
      this.setState({ ...this.state, isLoadingSchema: false, fieldsSchema });
    } catch (error) {
      const errorText = `${strings.ErrorLoadingSchema}${listUrl}: ${error}`;
      this.setState({
        ...this.state,
        isLoadingSchema: false,
        fieldsSchema: null,
        errors: [...this.state.errors, errorText]
      });
    }
  }

  private async readData(
    listUrl: string,
    formType: ControlMode,
    id?: number,
    dialogBlockState?: IDialogBlocking
  ): Promise<void> {
    const localDialogBlockState: IDialogBlocking = dialogBlockState
      ? dialogBlockState
      : { ...this.state.dialogBlocking };
    try {
      if (formType === ControlMode.New || !id) {
        const data = this.state.fieldsSchema.reduce((newData, fld) => {
          newData[fld.InternalName] = fld.DefaultValue;
          return newData;
        }, {});
        this.setState({
          ...this.state,
          data: data,
          originalData: { ...data },
          fieldErrors: {},
          isLoadingData: false,
          dialogBlocking: localDialogBlockState
        });
        return;
      }
      this.setState({
        ...this.state,
        data: {},
        originalData: {},
        fieldErrors: {},
        isLoadingData: true,
        dialogBlocking: localDialogBlockState
      });
      const dataObj = await this.listFormService.getDataForForm(
        this.props.webPartContext.pageContext.web.absoluteUrl,
        listUrl,
        id,
        formType
      );
      const item: _Item = sp.web.lists
        .getByTitle(
          this.props.listUrl.substring(this.props.listUrl.lastIndexOf("/") + 1)
        )
        .items.getById(id);
      const attachments: any[] = await item.attachmentFiles.get();
      let itemAttachments: any[] = [];
      if (attachments) {
        attachments.map((attachment: any) => {
          itemAttachments.push({
            name: attachment.FileName,
            rawData: attachment.ServerRelativeUrl,
            isExistsInSP: true
          });
        });
      }
      // We shallow clone here, so that changing values on dataObj object fields won't be changing in originalData too
      const dataObjOriginal = { ...dataObj };
      this.setState({
        ...this.state,
        data: dataObj,
        originalData: dataObjOriginal,
        attachmentField: itemAttachments,
        isLoadingData: false,
        dialogBlocking: localDialogBlockState
      });
    } catch (error) {
      const errorText = `${strings.ErrorLoadingData}${id}: ${error}`;
      this.setState({
        ...this.state,
        data: {},
        isLoadingData: false,
        errors: [...this.state.errors, errorText],
        dialogBlocking: localDialogBlockState
      });
    }
  }

  private valueChanged(fieldName: string, newValue: any) {
    this.setState(prevState => {
      return {
        ...prevState,
        data: { ...prevState.data, [fieldName]: newValue },
        fieldErrors: {
          ...prevState.fieldErrors,
          [fieldName]:
            prevState.fieldsSchema.filter(
              item => item.InternalName === fieldName
            )[0].Required && !newValue
              ? strings.RequiredValueMessage
              : ""
        }
      };
    });
  }

  private async saveItem(): Promise<void> {
    let itemID: number = this.props.id;
    this.setState({ ...this.state, isSaving: true, errors: [] });
    this.onProgressDialog();
    try {
      let updatedValues: any[];
      if (this.props.id) {
        updatedValues = await this.listFormService.updateItem(
          this.props.webPartContext.pageContext.web.absoluteUrl,
          this.props.listUrl,
          this.props.id,
          this.state.fieldsSchema,
          this.state.data,
          this.state.originalData
        );
      } else {
        updatedValues = await this.listFormService.createItem(
          this.props.webPartContext.pageContext.web.absoluteUrl,
          this.props.listUrl,
          this.state.fieldsSchema,
          this.state.data
        );
      }

      const newState: IListFormState = {
        ...this.state,
        fieldErrors: {}
      };
      let hadErrors = false;
      updatedValues
        .filter(fieldVal => fieldVal.HasException)
        .forEach(element => {
          newState.fieldErrors[element.FieldName] = element.ErrorMessage;
          hadErrors = true;
        });

      //#region Add or Remove Attachments
      if (!itemID) {
        updatedValues
          .filter(fieldVal => fieldVal.FieldName === "Id")
          .forEach(element => {
            itemID = parseInt(element.FieldValue);
          });
      }
      const item: _Item = sp.web.lists
        .getByTitle(
          this.props.listUrl.substring(this.props.listUrl.lastIndexOf("/") + 1)
        )
        .items.getById(itemID);
      const isAttachmentSuccess = await this.listFormService.addOrRemoveAttachments(
        item,
        this.state.attachmentField
      );
      if (!isAttachmentSuccess) {
        newState.fieldErrors["attachment"] = "Error while handling attachment(s)";
        hadErrors = true;
      }
      //#endregion

      await delay(2000);
      if (hadErrors) {
        this.onErrorDialog(newState.dialogBlocking);
        if (this.props.onSubmitFailed) {
          this.props.onSubmitFailed(newState.fieldErrors);
        } else {
          newState.errors = [...newState.errors, strings.FieldsErrorOnSaving];
        }
      } else {
        this.onSuccessDialog(newState.dialogBlocking);
        updatedValues.reduce((val, merged) => {
          merged[val.FieldName] = merged[val.FieldValue];
          return merged;
        }, newState.data);
        // we shallow clone here, so that changing values on state.data won't be changing in state.originalData too
        newState.originalData = { ...newState.data };
        newState.notifications = [
          ...newState.notifications,
          strings.ItemSavedSuccessfully
        ];
        newState.attachmentField = [];
      }
      newState.isSaving = false;
      this.setState(newState);
    } catch (error) {
      const errorText = strings.ErrorOnSavingListItem + error;
      this.setState({
        ...this.state,
        errors: [...this.state.errors, errorText]
      });
    }
  }

  private clearError(idx: number) {
    this.setState((prevState, props) => {
      return { ...prevState, errors: prevState.errors.splice(idx, 1) };
    });
  }

  private getFields(): IFieldConfiguration[] {
    let fields = this.props.fields;
    if (!fields && this.state.fieldsSchema) {
      fields = this.state.fieldsSchema.map(field => ({
        key: field.InternalName,
        fieldName: field.InternalName
      }));
    }
    return fields;
  }

  private appendField(fieldName: string) {
    const newFields = this.getFields();
    let fieldKey = fieldName;
    let indexer = 0;
    while (newFields.some(fld => fld.key === fieldKey)) {
      indexer++;
      fieldKey = fieldName + "_" + indexer;
    }
    newFields.push({ key: fieldKey, fieldName: fieldName });
    this.props.onUpdateFields(newFields);
  }

  private removeField(index: number) {
    const newFields = this.getFields().splice(0); // clone
    newFields.splice(index, 1);
    this.props.onUpdateFields(newFields);
  }

  private onProgressDialog() {
    const isEditForm: boolean = this.props.formType === ControlMode.Edit;
    const newDialogState = update(this.state.dialogBlocking, {
      showConfirmDialog: { $set: false },
      showProgressDialog: { $set: true },
      showProgress: { $set: true },
      progressDialogText: {
        $set: isEditForm
          ? strings[this.props.customFormName + "DialogEditProgressText"]
          : strings[this.props.customFormName + "DialogNewProgressText"]
      },
      dialogTitle: {
        $set: isEditForm
          ? strings[this.props.customFormName + "DialogEditTitle"]
          : strings[this.props.customFormName + "DialogNewTitle"]
      },
      error: { $set: null }
    });
    this.setState({
      dialogBlocking: newDialogState
    });
  }

  private onErrorDialog(dialogState: IDialogBlocking) {
    dialogState.showConfirmDialog = false;
    dialogState.showProgressDialog = true;
    dialogState.showProgress = false;
    dialogState.progressDialogText = "";
    dialogState.dialogTitle = strings.DialogError;
    dialogState.error = strings.DialogError;
  }

  private onSuccessDialog(dialogState: IDialogBlocking) {
    dialogState.showConfirmDialog = false;
    dialogState.showProgressDialog = true;
    dialogState.showProgress = false;
    dialogState.progressDialogText = "";
    dialogState.dialogTitle =
      strings[this.props.customFormName + "DialogSuccess"];
    dialogState.error = null;
  }
}
