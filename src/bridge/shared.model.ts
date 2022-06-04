export type TTemplateType = 'pdf' | 'xlsx' | 'resource';

export interface IDocument<T = TTemplateType> {
  id: string;
  name: string;
  filename: string;
  mtime: number;
  export?: boolean;
  type: T;
}

export interface IResourceDocument extends IDocument<'resource'> {}

export interface IXlsxDocument extends IDocument<'xlsx'> {
  sheets: { id: string, name:string }[];
  mapped: IMappedField[];
}

export interface IPdfDocument extends IDocument<'pdf'> {
  fields: { id: string, name:string }[];
  mapped: IMappedField[];
  previewfile: string;
}

export interface IMappedField {
  origId: string;
  clearName: string;
  mappedName: string;
  export?: boolean;

}
export interface IMappedInput {
  identifiers: string[];
  value: string;
}


export type TAppDatabase = { [key: string]: IDocument };

export enum EAppChannels {
  GET             = 'get-templates',
  REMOVE          = 'remove-template',
  OPEN            = 'open-file',
  OPEN_OUTPUT     = 'open-output',
  SAVE            = 'save-templates',
  ADD             = 'add-template',
  EXPORT          = 'export-templates',
  CLIENT_RESPONSE = 'client-response',
  CLIENT_ERROR = 'client-error',
}
