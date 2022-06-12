import {ipcMain, IpcMainEvent} from 'electron';
import {EAppChannels, IMappedDocument, IMappedInput, IProfile} from '../bridge/shared.model';
import {NpAssistant} from './np-assistant';

type TApiDescription = {
  [key in EAppChannels]: (event: IpcMainEvent, ...args: any[]) => void
};

export class ApiController {

  private api: Omit<TApiDescription, EAppChannels.CLIENT_UPDATE | EAppChannels.CLIENT_ERROR | EAppChannels.FINISHED_LOAD> = {
    [EAppChannels.GET]:           (event: IpcMainEvent) => this.getFileTemplates(event),
    [EAppChannels.REMOVE]:        (event: IpcMainEvent, filename: string) => this.removeFileTemplate(event, filename),
    [EAppChannels.OPEN]:          (event: IpcMainEvent, filename: string) => this.openFileWithExplorer(event, filename),
    [EAppChannels.OPEN_OUTPUT]:   (event: IpcMainEvent, folder: string) => this.openOutputWithExplorer(event, folder),
    [EAppChannels.ADD]:           (event: IpcMainEvent, arg) => this.addFileTemplate(event),
    [EAppChannels.REMAP]:          (event: IpcMainEvent, filename: string) => this.remapTemplate(event, filename),
    [EAppChannels.SAVE]:          (event: IpcMainEvent, template: IMappedDocument) => this.saveTemplate(event, template),
    [EAppChannels.EXPORT]:        (event: IpcMainEvent, exportFolder: string, exportFields: IMappedInput[]) => this.exportTemplates(event, exportFolder, exportFields),
    [EAppChannels.GET_PROFILES]:  (event: IpcMainEvent) => this.getProfiles(event),
    [EAppChannels.SAVE_PROFILES]: (event: IpcMainEvent, profiles: IProfile[]) => this.saveProfiles(event, profiles),

  };

  constructor(private readonly npAssistant: NpAssistant) {
    for (const channel in this.api) {
      ipcMain.handle(channel, async (ev, ...args) => {
        console.log('Received on ', channel);
        try {
          const result = await this.api[channel](ev, ...args);
          ev.sender.send(EAppChannels.CLIENT_UPDATE, result);
        } catch (e) {
          ev.sender.send(EAppChannels.CLIENT_ERROR, e.message.split('||'));
        }
      });
    }
  }

  // -------------------------- Sync --------------------------------------------

  private removeFileTemplate(event: IpcMainEvent, filename: string) {
    this.npAssistant.removeFileTemplate(filename);
  }

  private getFileTemplates(event: IpcMainEvent): IMappedDocument[] {
    return this.npAssistant.documents;
  }

  private saveTemplate(event: IpcMainEvent, template: IMappedDocument): void {
    this.npAssistant.saveTemplate(template);
  }

  private openFileWithExplorer(event: IpcMainEvent, filename: string): void {
    this.npAssistant.openFileWithExplorer(filename);
  }

  private openOutputWithExplorer(event: IpcMainEvent, folder: string): void {
    this.npAssistant.openOutputFolderWithExplorer(folder);
  }

  private addFileTemplate(event: IpcMainEvent): Promise<IMappedDocument[]> {
    return this.npAssistant.addNewFileTemplate();
  }

  private exportTemplates(event: IpcMainEvent, exportFolder: string, exportFields: IMappedInput[]): Promise<string[]> {
    return this.npAssistant.createDocuments(exportFolder, exportFields);
  }

  private saveProfiles(event: IpcMainEvent, profiles: IProfile[]) {
    this.npAssistant.profiles = profiles;
  }

  private getProfiles(event: IpcMainEvent) {
    return this.npAssistant.profiles;
  }

  private remapTemplate(event: IpcMainEvent, filename: string) {

  }
}

