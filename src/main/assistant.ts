import {BrowserWindow} from 'electron';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuidv4} from 'uuid';
import {ITemplateDocument, ITemplateField, ITemplateInput, TTemplateType, TAppDatabase} from '../bridge/shared.model';
import {VPIApiController} from './api';
import {PdfService} from './pdf/pdf.service';
import {IFDFValue} from './pdf/pdf.types';
import {showFilePickerSync} from './utils/electron.utils';
import {startWithExpolorer} from './utils/shell.utils';

const dataPath = process.env.APP_DATA || path.resolve('./data');
const tmpPath = process.env.APP_TEMP || path.resolve('./data/tmp');
const cachePath = process.env.APP_CACHE || path.resolve('./data/cache');
const outputPath = process.env.APP_OUTPUT || path.resolve('./data/out');
const configFile = process.env.APP_CONFIG || path.resolve('./data/config.json');

export class VPIAssistant {

  private readonly api: VPIApiController;
  private readonly database: TAppDatabase = {};
  private readonly pdf: PdfService;

  constructor(private readonly mainWindow: BrowserWindow) {
    this.database = VPIAssistant.readDatabase();
    this.api = new VPIApiController(this);
    this.pdf = new PdfService();
  }

  private static readDatabase() {
    if (fs.existsSync(configFile)) {
      const content = fs.readFileSync(configFile, {encoding: 'utf8'});
      return JSON.parse(content);
    } else {
      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath);
        fs.mkdirSync(tmpPath);
        fs.mkdirSync(cachePath);
        fs.mkdirSync(outputPath);
      }
      return {};
    }
  }

  private static writeDatabase(database: TAppDatabase) {
    try {
      fs.writeFileSync(configFile, JSON.stringify(database), {encoding: 'utf8'});
    } catch (e) {
      console.error(e);
    }
  }

  private static copyToTempFolder(filename: string) {
    const basename = path.basename(filename);
    const tmpCopy = path.join(tmpPath, basename);
    fs.copyFileSync(filename, tmpCopy);
    return tmpCopy;
  }

  private static removeTempCopy(filename: string) {
    const basename = path.basename(filename);
    const tmpCopy = path.join(tmpPath, basename);
    fs.rmSync(tmpCopy);
    return tmpCopy;
  }

  private static extractFDFToTemp(filename: string, pdfService: PdfService) {
    const ext = path.extname(filename);
    const basenameNoExt = path.basename(filename, ext);
    const fdfFile = path.join(tmpPath, basenameNoExt + '.fdf');
    pdfService.extractFDF(filename, fdfFile);
    return fdfFile;
  }

  private static getFileStats(filename: string): {basename: string, basenameNoExt: string, type:TTemplateType, mtimeMs: number} {
    const ext = path.extname(filename);
    const basename = path.basename(filename);
    const basenameNoExt = path.basename(filename, ext);
    const type = ext === '.pdf' ? 'pdf' : ext === '.xlsx' ? 'xlsx' : 'resource';
    const {mtimeMs} = fs.statSync(filename);
    return {basename, basenameNoExt, type, mtimeMs};
  }

  private static createAndValidateOutputFolder(outputFolder: string, foldername: string) {
    let result: string[] = [];
    let valid = true;
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
      result.push(`INFO: Ordner wurde erstellt [${foldername}].`);
    } else {
      valid = false;
      result.push('*******************');
      result.push('FEHLER: Ordner existierte bereits.');
      result.push(`[${foldername}]`);
      result.push('Erstellen wurde abgebrochen damit keine Daten überschrieben werden.');
      result.push('Bitte warte eine Minute, lösche den Ordner oder verwende ein anderes suffix');
      result.push('*******************');
    }
    return {outputMsgs: result, valid};
  }

  private static copyAndValidateOriginal(document: ITemplateDocument, database: TAppDatabase, result: string[]) {
    // check update time here i guess
    const tmpCopy = VPIAssistant.copyToTempFolder(document.filename);
    const {mtimeMs} = fs.statSync(document.filename);
    if (document.mtime !== mtimeMs) {
      document.mtime = mtimeMs;
      VPIAssistant.writeDatabase(database);
      result.push('*******************');
      result.push(`WARNUNG: Die Orginal Datei [${document.name}] wurde verändert!!!`);
      result.push(`Bitte überprüfe ob die Felder noch passen.`);
      result.push(`Wenn nicht lösche am besten das Dokument und füge es danach noch einmal neu hinzu.`);
      result.push('*******************');
    }
    return tmpCopy;
  }

  getFileTemplates(): ITemplateDocument[] {
    return Object.values<ITemplateDocument>(this.database);
  }

  saveTemplate(template: ITemplateDocument): ITemplateDocument[] {
    this.database[template.filename] = template;
    VPIAssistant.writeDatabase(this.database);
    return this.getFileTemplates();
  }

  removeFileTemplate(filename: string): ITemplateDocument[] {
    delete this.database[filename];
    VPIAssistant.writeDatabase(this.database);
    return this.getFileTemplates();
  }

  openFileWithExplorer(filename: string): void {
    startWithExpolorer(filename);
  }

  openOutputFolderWithExplorer(folder: string): void {
    const outputFolder = path.join(outputPath, folder);
    if (!fs.existsSync(outputFolder)) {
      startWithExpolorer(outputPath);
    } else {
      startWithExpolorer(outputFolder);
    }
  }

  private addPdfTemplate(filename: string, basenameNoExt: string) {
    function transformFDFValuesToFields(allValues: IFDFValue[]): ITemplateField[] {
      return allValues
        .map((fdfValue, index) => {
          fdfValue.value = `Feld ${index}`;
          return fdfValue;
        })
        .map((fdfValue, index) => ({value: fdfValue.value, intern: fdfValue.path, name: fdfValue.value, export: false, id: uuidv4(), type: 'fdf'}));
    }

    let previewfile = path.join(cachePath, basenameNoExt + '-preview-data.pdf');
    const tmpCopy = VPIAssistant.copyToTempFolder(filename);
    const fdfFile = VPIAssistant.extractFDFToTemp(tmpCopy, this.pdf);

    const {fdf, allValues} = this.pdf.readFDF(fdfFile);
    const fields = transformFDFValuesToFields(allValues);
    this.pdf.writeFDF(fdfFile, fdf);
    this.pdf.applyFDF(tmpCopy, fdfFile, previewfile);

    VPIAssistant.removeTempCopy(fdfFile);
    VPIAssistant.removeTempCopy(filename);
    startWithExpolorer(previewfile);
    return {previewfile, fields};
  }

  addFileTemplate(): ITemplateDocument[] {
    const filename = showFilePickerSync(this.mainWindow, {
      defaultPath: '', title: 'Dokument verknüpfen', filters: [
        {name: 'Pdf Dokumente', extensions: ['pdf']},
        {name: 'Excel Dokumente', extensions: ['xlsx']},
        {name: 'Alle Dokumente', extensions: ['*']},
      ]
    });

    if (fs.existsSync(filename)) {
      const {basename, basenameNoExt, type, mtimeMs} = VPIAssistant.getFileStats(filename);
      if (type === 'pdf') {
        const {previewfile, fields} = this.addPdfTemplate(filename, basenameNoExt);
        this.database[filename] = {id: uuidv4(), name: basename, filename, fields, mapped: [], export: true, type, mtime: mtimeMs, previewfile};
      } else {
        this.database[filename] = {id: uuidv4(), name: basename, filename, fields: [], mapped: [], export: true, type, mtime: mtimeMs, previewfile: ''};
      }
      VPIAssistant.writeDatabase(this.database);
    }

    return this.getFileTemplates();
  }

  async createDocuments(foldername: string, inputs: ITemplateInput[]): Promise<string[]> {
    console.log('creating documents.......................');
    const outputFolder = path.join(outputPath, foldername);
    const {outputMsgs, valid} = VPIAssistant.createAndValidateOutputFolder(outputFolder, foldername);
    console.log('202: createDocuments', outputMsgs);
    if(!valid) return outputMsgs;

    const templates = this.getFileTemplates().filter(template => template.export);
    for (const document of templates) {
      console.log('202: createDocuments');
      const tmpCopy = VPIAssistant.copyAndValidateOriginal(document, this.database, outputMsgs);
      const fields = document.mapped.filter(field => field.export);
      const basename = path.basename(document.filename);
      const outCopy = path.join(outputFolder, basename);
      if (fields.length || (document.type === 'xlsx')) {
        if (document.type === 'pdf') {
          this.applyFieldsToPdf(tmpCopy, fields, inputs, outCopy);
        } else if (document.type === 'xlsx') {
          console.log('creating documents.......................222222224444');
          ( await this.applyFieldsToXlsx(tmpCopy, fields, inputs, outCopy));
          console.log('creating documents.......................22222222333');
        } else {
          throw new Error('Field support for pdf and xlsx only');
        }
      } else {
        // just copy to output path and remove the tmpCopy
        fs.copyFileSync(tmpCopy, outCopy);
        VPIAssistant.removeTempCopy(tmpCopy);
      }
      console.log('next');
    }

    console.log(`INFO: Alle Dokumente wurden erstellt.`);
    outputMsgs.push(`INFO: Alle Dokumente wurden erstellt.`);
    return outputMsgs;
  }

  // noinspection JSMethodCanBeStatic
  private async applyFieldsToXlsx(tmpCopy: string, fields: ITemplateField[], inputs: ITemplateInput[], outCopy: string) {
    console.log('230: applyFieldsToXlsx');

    // read from a file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(tmpCopy);
    console.log('read..................', workbook.worksheets.length, 'sheets');
    const sheet = workbook.worksheets.find(sheet => true);
    if (sheet) {
      sheet.getCell('D8').value = 'Hello World';

    } else {
      throw new Error('No Worksheet found');
    }
    // fields.forEach(mappedField => {
    //   const fdfField = allValues.find(fdfValue => fdfValue.path === mappedField.intern);
    //   const value = inputs.find(input => input.ids.includes(mappedField.id))?.value;
    //   if (value) {
    //     fdfField.value = value;
    //   }
    // });
    console.log('writing xlsx file..................', outCopy);
    try { await workbook.xlsx.writeFile(outCopy);} catch (e) {console.log(e); }
    console.log('remove xlsx file..................', tmpCopy);
    // VPIAssistant.removeTempCopy(tmpCopy);
  }

  private applyFieldsToPdf(tmpCopy: string, fields: ITemplateField[], inputs: ITemplateInput[], outCopy: string) {
    const fdfFile = VPIAssistant.extractFDFToTemp(tmpCopy, this.pdf);
    const {fdf, allValues} = this.pdf.readFDF(fdfFile);
    fields.forEach(mappedField => {
      const fdfField = allValues.find(fdfValue => fdfValue.path === mappedField.intern);
      const value = inputs.find(input => input.ids.includes(mappedField.id))?.value;
      if (value) {
        fdfField.value = value;
      }
    });
    this.pdf.writeFDF(fdfFile, fdf);
    this.pdf.applyFDF(tmpCopy, fdfFile, outCopy);
    VPIAssistant.removeTempCopy(fdfFile);
  }
}
