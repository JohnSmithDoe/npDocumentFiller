import {EventEmitter, Injectable} from '@angular/core';
import {ipcRenderer} from 'electron';
import {EAppChannels, IInitialData, IMappedDocument, IMappedInput} from '../../../bridge/shared.model';
import IpcRendererEvent = Electron.IpcRendererEvent;

@Injectable({
              providedIn: 'root'
            })
export class ElectronService {

  public startRequest$: EventEmitter<EAppChannels> = new EventEmitter<EAppChannels>();
  public stopRequest$: EventEmitter<EAppChannels> = new EventEmitter<EAppChannels>();

  public update$: EventEmitter<IMappedDocument[]> = new EventEmitter<IMappedDocument[]>();
  public finishedLoading$: EventEmitter<IInitialData | undefined> = new EventEmitter<IInitialData | undefined>();
  public error$: EventEmitter<string[]> = new EventEmitter<string[]>();
  public report$: EventEmitter<string[]> = new EventEmitter<string[]>();

  private readonly ipcRenderer: typeof ipcRenderer;

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.ipcRenderer.on(EAppChannels.FINISHED_LOAD, (event: IpcRendererEvent, data: IInitialData) => {
        this.stopRequest$.emit(EAppChannels.FINISHED_LOAD);
        this.finishedLoading$.emit(data);
      });
      this.ipcRenderer.on(EAppChannels.CLIENT_UPDATE, (event: IpcRendererEvent, data: IMappedDocument[] | string[] | undefined) => {
        if (data && data.length) {
          if (typeof data[0] === 'string') {
            this.report$.emit(data as string[]);
          } else {
            this.update$.emit(data as IMappedDocument[]);
          }
        }
      });
      this.ipcRenderer.on(EAppChannels.CLIENT_ERROR, (event: IpcRendererEvent, err: any) => this.error$.emit(err));
      // this.webFrame = window.require('electron').webFrame;
      // this.childProcess = window.require('child_process');
      // this.fs = window.require('fs');

      // Notes :
      // * A NodeJS's dependency imported with 'window.require' MUST BE present in `dependencies` of both `app/package.json`
      // and `package.json (root folder)` in order to make it work here in Electron's Renderer process (src folder)
      // because it will load at runtime by Electron.
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

  private send(channel: EAppChannels, ...data: any) {
    console.log('Send on channel: ', channel);
    this.startRequest$.emit(channel);
    this.renderer?.invoke(channel, ...data).then((data) => {
      console.log('Response on channel: ', channel, data);
      this.stopRequest$.emit(channel);
    });
  }

  // this did not work ... for timing reasons... not sure... did finish load now sends the inital data
  getTemplates() {
    this.send(EAppChannels.GET);
  }

  addFileTemplate() {
    this.send(EAppChannels.ADD);
  }

  save(data: IMappedDocument) {
    this.send(EAppChannels.SAVE, data);
  }

  export(foldername: string, data: IMappedInput[]) {
    this.send(EAppChannels.EXPORT, data, foldername);
  }

  openFileWithExplorer(filename: string) {
    this.send(EAppChannels.OPEN, filename);
  }

  openOutputFolder(folder: string) {
    this.send(EAppChannels.OPEN_OUTPUT, folder);
  }

  createDocuments(exportFolder: string, exportedFields: IMappedInput[]) {
    this.send(EAppChannels.EXPORT,
              exportFolder,
              exportedFields.map(({identifiers, value, ...field}) => ({identifiers, value})));
  }

  removeDocument(template: IMappedDocument) {
    this.send(EAppChannels.REMOVE, template.filename);
  }

  saveProfile(profiles: { id: string; name: string }[]) {
    console.log('saving profiles', profiles);
  }

}
