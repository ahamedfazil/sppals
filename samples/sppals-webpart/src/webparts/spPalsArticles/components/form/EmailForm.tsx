import * as React from "react";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import ReactFileReader from "react-file-reader";
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import update from "immutability-helper";
import { SPPalsService } from "../../../../common/services/SPPalsService";
import { IGraphEmailProps, IFileField } from "../../../../common/models/IServiceModel";
import AttachmentField from "./AttachmentField";

interface IEmailFormProps {
    sppalsService: SPPalsService;
}

interface IEmailFormState {
    toEmailAddress: string;
    bodyText: string;
    subjectText: string;
    attachments: IFileField[];
}

export default class EmailForm extends React.Component<
    IEmailFormProps,
    IEmailFormState
    > {
    constructor(props: IEmailFormProps) {
        super(props);

        this.state = {
            toEmailAddress: "",
            bodyText: "",
            subjectText: "",
            attachments: []
        };
    }

    public render(): React.ReactElement<IEmailFormProps> {
        return (<div>
            <TextField label="To"
                value={this.state.toEmailAddress}
                onChange={(e, value) => this._onChangeValue("toEmailAddress", value)} />
            <TextField label="Subject"
                value={this.state.subjectText}
                onChange={(e, value) => this._onChangeValue("subjectText", value)} />
            <TextField label="Body" multiline rows={3} value={this.state.bodyText}
                onChange={(e, value) => this._onChangeValue("bodyText", value)} />
            <ReactFileReader
                base64={true}
                multipleFiles={true}
                handleFiles={(files: any) => {
                    let dummyFileField: IFileField[] = [];
                    files.base64.map((base64Val, fileIndex) => {
                        if (files.fileList[fileIndex].size < 10000000) {
                            let singleFileField: IFileField = {
                                name: files.fileList[fileIndex].name,
                                rawData: base64Val,
                                isRemove: false
                            };
                            dummyFileField.push(singleFileField);
                        }
                    });
                    const newState = update(this.state, {
                        attachments: {
                            $push: dummyFileField
                        }
                    });
                    this.setState(newState);
                }}
            >
                <DefaultButton
                    text={"Attachments"}
                    iconProps={{ iconName: "Attach" }}
                    allowDisabledFocus
                    checked={false}
                />
            </ReactFileReader>
            <AttachmentField
                defaultFiles={this.state.attachments}
                showRemoveButton={true}
                removeFile={file => {
                    const newState = update(this.state, {
                        attachments: {
                            $set: file
                        }
                    });
                    this.setState(newState);
                }}
            />
            <br />
            <PrimaryButton text="Send Mail" onClick={this._onSendClick} />
        </div>);
    }

    @autobind
    private _onChangeValue(key: string, value: any) {
        // check for validation
        const newState = update(this.state, {
            [key]: { $set: value }
        });
        this.setState(newState);
    }

    @autobind
    private _onSendClick() {
        let emailVal: IGraphEmailProps = {
            subject: this.state.subjectText,
            body: this.state.bodyText,
            toEmailAddress: this.state.toEmailAddress,
            attachments: this.state.attachments
        };

        this.props.sppalsService.sendMailSPPals(
            emailVal
        ).then((isSuccess) => {
            if (isSuccess) {
                console.log("Successfully Sent");
            } else {
                throw "send.Mail error";
            }
        }).catch(e => {
            console.error("Error while requesting applix form", e);
        });
    }
}
