import {ipcMain, IpcMainEvent} from 'electron';
import {EAppChannels, ITemplateDocument, ITemplateInput} from '../bridge/shared.model';
import {VPIAssistant} from './assistant';

type TApiDescription = {
  [key in EAppChannels]: (event: IpcMainEvent, ...args: any[]) => void
};

export class VPIApiController {

  private api: TApiDescription = {
    [EAppChannels.GET]:         (event: IpcMainEvent, arg) => this.getFileTemplates(event, arg),
    [EAppChannels.ADD]:         (event: IpcMainEvent, arg) => this.addFileTemplate(event, arg),
    [EAppChannels.EXPORT]:      (event: IpcMainEvent, exportFolder: string, exportFields: ITemplateInput[]) => this.exportTemplates(event, exportFolder, exportFields),
    [EAppChannels.REMOVE]:      (event: IpcMainEvent, filename: string) => this.removeFileTemplate(event, filename),
    [EAppChannels.OPEN]:        (event: IpcMainEvent, filename: string) => this.openFileWithExplorer(event, filename),
    [EAppChannels.OPEN_OUTPUT]: (event: IpcMainEvent, folder: string) => this.openOutputWithExplorer(event, folder),
    [EAppChannels.SAVE]:        (event: IpcMainEvent, template: ITemplateDocument) => this.saveTemplates(event, template),
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
    console.log('40: exportTemplates');
    this.vpiAssistant.createDocuments(exportFolder, exportFields).then(() => {
      console.log('42: Ende');
      event.reply(EAppChannels.EXPORT, ['Progressing']);
    });
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

