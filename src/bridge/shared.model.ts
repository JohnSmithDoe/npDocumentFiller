export interface ITemplateInput {
  ids: string[];
  value: any;
}

export interface ITemplateField {
  id: string;
  type: 'fdf' | 'cell';
  name: string;
  intern: string;
  value: any;
  export?: boolean;
}

export type TTemplateType = 'pdf' | 'xlsx' | 'resource';

export interface ITemplateDocument {
  id: string;
  type: TTemplateType;
  name: string;
  filename: string;
  previewfile: string;
  fields: ITemplateField[];
  mapped: ITemplateField[];
  mtime: number;
  export?: boolean;
}

export type TAppDatabase = { [key: string]: ITemplateDocument };

export enum EAppChannels {
  GET         = 'get-templates',
  ADD         = 'add-template',
  EXPORT      = 'export-templates',
  REMOVE      = 'remove-template',
  OPEN        = 'open-file',
  OPEN_OUTPUT = 'open-output',
  SAVE        = 'save-templates'
}
