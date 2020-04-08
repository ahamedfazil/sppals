import { IFieldSchema, IFileField } from '../../../common/services/datatypes/RenderListData';
import { IDialogBlocking } from './formFields/DialogBlocking';

export interface IListFormState {
  isLoadingSchema: boolean;
  isLoadingData: boolean;
  isSaving: boolean;
  fieldsSchema?: IFieldSchema[];
  data: any;
  originalData: any;
  errors: string[];
  notifications: string[];
  attachmentField: IFileField[];
  fieldErrors: { [fieldName: string]: string };
  showUnsupportedFields?: boolean;
  dialogBlocking: IDialogBlocking;
}
