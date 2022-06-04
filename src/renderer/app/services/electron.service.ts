import {EventEmitter, Injectable} from '@angular/core';
import {ipcRenderer} from 'electron';
import {EAppChannels, IDocument, IMappedInput} from '../../../bridge/shared.model';
import IpcRendererEvent = Electron.IpcRendererEvent;

@Injectable({
              providedIn: 'root'
            })
export class ElectronService {
  // private readonly webFrame: typeof webFrame;
  // private readonly childProcess: typeof childProcess;
  // private readonly fs: typeof fs;
  private readonly ipcRenderer: typeof ipcRenderer;
  public update$: EventEmitter<IDocument[]|string[]|boolean|undefined> = new EventEmitter<IDocument[]|string[]|boolean|undefined>();
  public startRequest$: EventEmitter<EAppChannels> = new EventEmitter<EAppChannels>();
  public error$: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.ipcRenderer.on(EAppChannels.CLIENT_RESPONSE, (event:IpcRendererEvent, templates: IDocument[]) => this.update$.emit(templates));
      this.ipcRenderer.on(EAppChannels.CLIENT_ERROR, (event:IpcRendererEvent, err:any) => this.error$.emit(err));
      // this.webFrame = window.require('electron').webFrame;
      // this.childProcess = window.require('child_process');
      // this.fs = window.require('fs');

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

  private sendASync(channel: EAppChannels, ...data: any) {
    console.log('Send on channel: ', channel);
    this.startRequest$.emit(channel);
    this.renderer?.invoke(channel, ...data).then((data) => this.update$.emit(data));
  }

  getTemplates(){
    this.sendASync(EAppChannels.GET);
  }

  addFileTemplate() {
    this.sendASync(EAppChannels.ADD);
  }

  save(data: IDocument) {
    this.sendASync(EAppChannels.SAVE, data);
  }

  export(foldername: string, data: IMappedInput[]) {
    this.sendASync(EAppChannels.EXPORT, data, foldername);
  }

  openFileWithExplorer(filename: string) {
    this.sendASync(EAppChannels.OPEN, filename);
  }

  openOutputFolder(folder: string) {
    this.sendASync(EAppChannels.OPEN_OUTPUT, folder);
  }

  createDocuments(exportFolder: string, exportedFields: IMappedInput[]) {
    this.sendASync(EAppChannels.EXPORT,
                          exportFolder,
                          exportedFields.map(({identifiers, value, ...field}) => ({identifiers, value})));
  }

  removeDocument(template: IDocument) {
    this.sendASync(EAppChannels.REMOVE, template.filename);
  }
}
