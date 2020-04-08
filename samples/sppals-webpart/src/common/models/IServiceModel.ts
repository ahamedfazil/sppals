


export interface ISPPalsService {
  sendMailSPPals: (
    formData: any
  ) => Promise<any>;
}

export interface IGraphEmailProps {
  subject: string;
  body: any;
  toEmailAddress: string;
  attachments: IFileField[];
}

export interface IFileField {
  name: string;
  rawData: any;
  isRemove: boolean;
}