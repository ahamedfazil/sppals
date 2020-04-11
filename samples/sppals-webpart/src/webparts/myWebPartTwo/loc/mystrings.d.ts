declare interface IMyWebPartTwoWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'MyWebPartTwoWebPartStrings' {
  const strings: IMyWebPartTwoWebPartStrings;
  export = strings;
}
