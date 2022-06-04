import {ipcMain, IpcMainEvent} from 'electron';
import {EAppChannels, IDocument, IMappedInput} from '../bridge/shared.model';
import {NpAssistant} from './np-assistant';

type TApiDescription = {
  [key in EAppChannels]: (event: IpcMainEvent, ...args: any[]) => void
};

export class ApiController {

  private api: Omit<TApiDescription, EAppChannels.CLIENT_RESPONSE | EAppChannels.CLIENT_ERROR> = {
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
      ipcMain.handle(channel, async (ev, ...args) => {
        console.log('Recived on ', channel);
        try {
          const result = await this.api[channel](ev, ...args);
          ev.sender.send(EAppChannels.CLIENT_RESPONSE, result);
        } catch (e) {
          console.log(e);
          ev.sender.send(EAppChannels.CLIENT_ERROR, e);
        }
      });
    }
  }

  // -------------------------- Sync --------------------------------------------

  private removeFileTemplate(event: IpcMainEvent, filename: string) {
     this.npAssistant.removeFileTemplate(filename);
  }

  private getFileTemplates(event: IpcMainEvent) {
    return this.npAssistant.getFileTemplates();
  }

  private saveTemplate(event: IpcMainEvent, template: IDocument) {
     this.npAssistant.saveTemplate(template);
  }

  private openFileWithExplorer(event: IpcMainEvent, filename: string) {
     this.npAssistant.openFileWithExplorer(filename);
  }

  private openOutputWithExplorer(event: IpcMainEvent, folder: string) {
     this.npAssistant.openOutputFolderWithExplorer(folder);
  }

  private addFileTemplate(event: IpcMainEvent) {
    return this.npAssistant.addNewFileTemplate();
  }

  private exportTemplates(event: IpcMainEvent, exportFolder: string, exportFields: IMappedInput[]) {
    return this.npAssistant.createDocuments(exportFolder, exportFields);
  }
}

