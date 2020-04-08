declare interface IFormFieldStrings {
  UnsupportedFieldType: string;
  InvalidNumberValue: string;
  ToggleOnAriaLabel: string;
  ToggleOffAriaLabel: string;
  ToggleOnText: string;
  ToggleOffText: string;
  TextFormFieldPlaceholder: string;
  DateFormFieldPlaceholder: string;
  NumberFormFieldPlaceholder: string;
  LookupEmptyOptionText: string;

  // IDatePickerStrings
  months: string[];
  shortMonths: string[];
  days: string[];
  shortDays: string[];
  goToToday: string;
  isRequiredErrorMessage?: string;
  invalidInputErrorMessage?: string;
  prevMonthAriaLabel?: string;
  nextMonthAriaLabel?: string;
  prevYearAriaLabel?: string;
  nextYearAriaLabel?: string;

  // IDialogBlocking
  DialogBlockingOK: string;
  DialogBlockingCancel: string;
}

declare module 'FormFieldStrings' {
  const strings: IFormFieldStrings;
  export = strings;
}
