import { SPHttpClient } from '@microsoft/sp-http';
import { ControlMode } from '../../../common/datatypes/ControlMode';
import { IFieldConfiguration } from './IFieldConfiguration';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IListFormProps {
  title: string;
  description?: string;
  webPartContext: WebPartContext;
  // webUrl: string;
  listUrl: string;
  formType: ControlMode;
  id?: number;
  fields?: IFieldConfiguration[];
  // spHttpClient: SPHttpClient;
  inDesignMode?: boolean;
  showUnsupportedFields?: boolean;
  showAttachmentField?: boolean;
  isApplixForm?: boolean;
  customFormName: string;
  onSubmitSucceeded?(id?: number): void;
  onSubmitFailed?(fieldErrors: any): void;
  onUpdateFields?(newFields: IFieldConfiguration[]): void;
}
