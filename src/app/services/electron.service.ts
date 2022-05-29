import {Injectable} from '@angular/core';
import * as childProcess from 'child_process';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, webFrame} from 'electron';
import * as fs from 'fs';
import {EVPIChannels, ITemplateDocument, ITemplateField, ITemplateInput} from '../shared/shared.model';

@Injectable({
              providedIn: 'root'
            })
export class ElectronService {
  private webFrame: typeof webFrame;
  private childProcess: typeof childProcess;
  private fs: typeof fs;
  private ipcRenderer: typeof ipcRenderer;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will loaded at runtime by Electron.
      // * A NodeJS's dependency imported with TS module import (ex: import { Dropbox } from 'dropbox') CAN only be present
      // in `dependencies` of `package.json (root folder)` because it is loaded during build phase and does not need to be
      // in the final bundle. Reminder : only if not used in Electron's Main process (app folder)

      // If you want to use a NodeJS 3rd party deps in Renderer process,
      // ipcRenderer.invoke can serve many common use cases.
      // https://www.electronjs.org/docs/latest/api/ipc-renderer#ipcrendererinvokechannel-args
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  private get renderer() { return this.isElectron ? this.ipcRenderer : undefined;}

  private sendSync(channel: EVPIChannels, ...data: any){
    console.log('Send on channel: ', channel);
    return this.renderer?.sendSync(channel, ...data);
  }

  getTemplates():  ITemplateDocument[] {
    return this.sendSync(EVPIChannels.GET);
  }

  addFileTemplate(): ITemplateDocument[] {
    return this.sendSync(EVPIChannels.ADD);
  }

  save(data: ITemplateDocument) {
    return this.sendSync(EVPIChannels.SAVE, data);
  }

  export(foldername: string, data: ITemplateInput[]) {
    return this.sendSync(EVPIChannels.EXPORT, data, foldername);
  }

  openFileWithExplorer(filename: string) {
    return this.sendSync(EVPIChannels.OPEN, filename);
  }

  openOutputFolder(folder: string) {
    return this.sendSync(EVPIChannels.OPEN_OUTPUT, folder);
  }

  createDocuments(exportFolder: string, exportedFields: ITemplateInput[]): string[] {
    return this.sendSync(EVPIChannels.EXPORT, exportFolder, exportedFields.map(({ids, value, ...field}) => ({ids, value})));
  }

  removeDocument(template: ITemplateDocument) {
    return this.sendSync(EVPIChannels.REMOVE, template.filename);
  }
}
