export type TTemplateType = 'pdf' | 'xlsx' | 'resource';

export interface IDocument<T = TTemplateType> {
  id: string;
  name: string;
  filename: string;
  mtime: number;
  export?: boolean;
  type: T;
}

export interface IMappedDocument<T = 'pdf'| 'xlsx'> extends IDocument<T>{
  mapped: IMappedField[];
}

export interface IXlsxDocument extends IMappedDocument<'xlsx'> {
  sheets: { id: string, name:string }[];
}

export interface IPdfDocument extends IMappedDocument<'pdf'> {
  fields: { id: string, name:string }[];
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
  GET           = 'get-templates',
  REMOVE        = 'remove-template',
  OPEN          = 'open-file',
  OPEN_OUTPUT   = 'open-output',
  SAVE          = 'save-templates',
  ADD           = 'add-template',
  EXPORT        = 'export-templates',

  FINISHED_LOAD = 'finished-loading',
  CLIENT_UPDATE = 'client-update',
  CLIENT_ERROR  = 'client-error',
}
