declare interface IListFormStrings {
  SaveButtonText: string;
  CancelButtonText: string;
  AddNewFieldAction: string;
  LoadingFormIndicator: string;
  ErrorLoadingSchema: string;
  ConfigureListMessage: string;
  RequiredValueMessage: string;
  ErrorLoadingData: string;
  ItemSavedSuccessfully: string;
  FieldsErrorOnSaving: string;
  ErrorOnSavingListItem: string;
  MoveField: string;
  RemoveField: string;

  // Dialog
  DialogNewTitle: string;
  DialogEditTitle: string;
  DialogNewProgressText: string;
  DialogEditProgressText: string;
  DialogSuccess: string;
  DialogError: string;
}

declare module 'ListFormStrings' {
  const strings: IListFormStrings;
  export = strings;
}
