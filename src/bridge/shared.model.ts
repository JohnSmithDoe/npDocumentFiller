export interface IAppConfig {
  PDFTK_EXE?: string;
  ENCODING?: string;
  DATA_PATH?: string;
  TMP_PATH?: string;
  CACHE_PATH?: string;
  OUTPUT_PATH?: string;
  DB_FILE?: string;
  PROFILE_FILE?: string;
}

export type TTemplateType = 'pdf' | 'xlsx' | 'resource';

interface IDocument<T = TTemplateType> {
  id: string;
  name: string;
  filename: string;
  mtime: number;
  export?: boolean;
  type: T;
}

export interface IMappedDocument<T = TTemplateType> extends IDocument<T> {
  mapped?: IMappedField[];
}

export interface IXlsxDocument extends IMappedDocument<'xlsx'> {
  sheets: { id: string, name: string }[];
}

export interface IPdfDocument extends IMappedDocument<'pdf'> {
  fields: { id: string, name: string }[];
  previewfile: string;
}

export interface IMappedField {
  origId: string;
  name: string;
  mappedName: string;
  export?: boolean;

}

export interface IMappedInput {
  identifiers: string[];
  value: string;
}


export type TAppDatabase = { [key: string]: IMappedDocument };

export enum EAppChannels {
  GET           = 'get-templates',
  GET_PROFILES  = 'get-profiles',
  REMOVE        = 'remove-template',
  OPEN          = 'open-file',
  OPEN_OUTPUT   = 'open-output',
  SAVE          = 'save-templates',
  SAVE_PROFILES = 'save-profiles',
  ADD           = 'add-template',
  REMAP         = 'remap-template',
  EXPORT        = 'export-templates',

  FINISHED_LOAD = 'finished-loading',
  CLIENT_UPDATE = 'client-update',
  CLIENT_ERROR  = 'client-error',
}

export interface IProfile {
  id: string;
  name: string;
  documentIds: string [];
  fieldIds: string [];
}

export interface IInitialData {
  documents: IMappedDocument[];
  profiles: IProfile[];
}
