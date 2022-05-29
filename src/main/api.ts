import {ipcMain, IpcMainEvent} from 'electron';
import {EVPIChannels, ITemplateDocument, ITemplateInput} from '../bridge/shared.model';
import {VPIAssistant} from './assistant';

type TApiDescription = {
  [key in EVPIChannels]: (event: IpcMainEvent, ...args: any[]) => void
};

export class VPIApiController {

  private api: TApiDescription = {
    [EVPIChannels.GET]:         (event: IpcMainEvent, arg) => this.getFileTemplates(event, arg),
    [EVPIChannels.ADD]:         (event: IpcMainEvent, arg) => this.addFileTemplate(event, arg),
    [EVPIChannels.EXPORT]:      (event: IpcMainEvent, exportFolder: string, exportFields: ITemplateInput[]) => this.exportTemplates(event, exportFolder, exportFields),
    [EVPIChannels.REMOVE]:      (event: IpcMainEvent, filename: string) => this.removeFileTemplate(event, filename),
    [EVPIChannels.OPEN]:        (event: IpcMainEvent, filename: string) => this.openFileWithExplorer(event, filename),
    [EVPIChannels.OPEN_OUTPUT]: (event: IpcMainEvent, folder: string) => this.openOutputWithExplorer(event, folder),
    [EVPIChannels.SAVE]:        (event: IpcMainEvent, template: ITemplateDocument) => this.saveTemplates(event, template),
  };

  constructor(private readonly vpiAssistant: VPIAssistant) {
    for (const channel in this.api) {
      ipcMain.on(channel, this.api[channel]);
    }
  }

  private removeFileTemplate(event: IpcMainEvent, arg) {
    event.returnValue = this.vpiAssistant.removeFileTemplate(arg);
  }

  private getFileTemplates(event: IpcMainEvent, arg: any) {
    event.returnValue = this.vpiAssistant.getFileTemplates();
  }

  private addFileTemplate(event: IpcMainEvent, arg) {
    event.returnValue = this.vpiAssistant.addFileTemplate();
  }

  private exportTemplates(event: IpcMainEvent, exportFolder: string, exportFields: ITemplateInput[]) {
    event.returnValue = this.vpiAssistant.createDocuments(exportFolder, exportFields);
  }

  private saveTemplates(event: IpcMainEvent, template: ITemplateDocument) {
    event.returnValue = this.vpiAssistant.saveTemplate(template);
  }

  private openFileWithExplorer(event: IpcMainEvent, filename: string) {
    this.vpiAssistant.openFileWithExplorer(filename);
    event.returnValue = true;
  }

  private openOutputWithExplorer(event: IpcMainEvent, folder: string) {
    this.vpiAssistant.openOutputFolderWithExplorer(folder);
    event.returnValue = true;
  }
}

