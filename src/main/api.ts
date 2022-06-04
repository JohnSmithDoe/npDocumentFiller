import {ipcMain, IpcMainEvent} from 'electron';
import {EAppChannels, IDocument, IMappedInput} from '../bridge/shared.model';
import {NpAssistant} from './np-assistant';

type TApiDescription = {
  [key in EAppChannels]: (event: IpcMainEvent, ...args: any[]) => void
};

export class ApiController {

  private api: Omit<TApiDescription, EAppChannels.CLIENT_RESPONSE> = {
    [EAppChannels.GET]:         (event: IpcMainEvent) => this.getFileTemplates(event),
    [EAppChannels.REMOVE]:      (event: IpcMainEvent, filename: string) => this.removeFileTemplate(event, filename),
    [EAppChannels.OPEN]:        (event: IpcMainEvent, filename: string) => this.openFileWithExplorer(event, filename),
    [EAppChannels.OPEN_OUTPUT]: (event: IpcMainEvent, folder: string) => this.openOutputWithExplorer(event, folder),
    [EAppChannels.SAVE]:        (event: IpcMainEvent, template: IDocument) => this.saveTemplate(event, template),
    [EAppChannels.ADD]:         (event: IpcMainEvent, arg) => this.addFileTemplate(event),
    [EAppChannels.EXPORT]:      (event: IpcMainEvent, exportFolder: string, exportFields: IMappedInput[]) => this.exportTemplates(event, exportFolder, exportFields),
  };

  constructor(private readonly npAssistant: NpAssistant) {
    for (const channel in this.api) {
      ipcMain.handle(channel, (ev, ...args) => {
        console.log('Got Message on ', channel, 'with: ', ...args);
        return this.api[channel](ev, ...args);
      });
    }
  }

  // -------------------------- Sync --------------------------------------------

  private removeFileTemplate(event: IpcMainEvent, filename: string) {
    event.sender.send(EAppChannels.CLIENT_RESPONSE, this.npAssistant.removeFileTemplate(filename));
  }

  private getFileTemplates(event: IpcMainEvent) {
    event.sender.send(EAppChannels.CLIENT_RESPONSE, this.npAssistant.getFileTemplates());
  }

  private saveTemplate(event: IpcMainEvent, template: IDocument) {
    event.sender.send(EAppChannels.CLIENT_RESPONSE, this.npAssistant.saveTemplate(template));
  }

  private openFileWithExplorer(event: IpcMainEvent, filename: string) {
    this.npAssistant.openFileWithExplorer(filename);
  }

  private openOutputWithExplorer(event: IpcMainEvent, folder: string) {
    this.npAssistant.openOutputFolderWithExplorer(folder);
  }

  private addFileTemplate(event: IpcMainEvent) {
    this.npAssistant.addNewFileTemplate().then(() => {
      event.sender.send(EAppChannels.CLIENT_RESPONSE, this.npAssistant.getFileTemplates());
    });
  }

  private exportTemplates(event: IpcMainEvent, exportFolder: string, exportFields: IMappedInput[]) {
    this.npAssistant.createDocuments(exportFolder, exportFields).then(() => {
      event.sender.send(EAppChannels.CLIENT_RESPONSE, this.npAssistant.getFileTemplates());
    });
  }
}

