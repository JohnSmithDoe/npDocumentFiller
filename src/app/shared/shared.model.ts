export interface ITemplateInput {
  ids: string[];
  name: string;
  value: any;
  info: string;
}

export interface ITemplateField {
  id: string;
  type: 'fdf' | 'cell';
  name: string;
  intern: string;
  value: any;
  export?: boolean;
}

export interface ITemplateDocument {
  id: string;
  type: 'pdf' | 'xlsx' | 'resource';
  name: string;
  filename: string;
  previewfile: string;
  fields: ITemplateField[];
  mapped: ITemplateField[];
  mtime: number;
  export?: boolean;
}

export type TVPIDatabase = { [key: string]: ITemplateDocument };

export enum EVPIChannels {
  GET    = 'get-templates',
  ADD    = 'add-template',
  EXPORT = 'export-templates',
  REMOVE = 'remove-template',
  OPEN = 'open-file',
  OPEN_OUTPUT = 'open-output',
  SAVE = 'save-templates'
}
