import {BrowserWindow} from 'electron';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuidv4} from 'uuid';
import {IDocument, IMappedField, IMappedInput, IPdfDocument, IXlsxDocument, TAppDatabase, TTemplateType} from '../bridge/shared.model';
import {ApiController} from './api';
import {PdfService} from './pdf/pdf.service';
import {showFilePickerSync} from './utils/electron.utils';
import {startWithExpolorer} from './utils/shell.utils';

const dataPath = process.env.APP_DATA || path.resolve('./data');
const tmpPath = process.env.APP_TEMP || path.resolve('./data/tmp');
const cachePath = process.env.APP_CACHE || path.resolve('./data/cache');
const outputPath = process.env.APP_OUTPUT || path.resolve('./data/out');
const configFile = process.env.APP_CONFIG || path.resolve('./data/config.json');

export class NpAssistant {

  private readonly api: ApiController;
  private readonly database: TAppDatabase = {};
  private readonly pdf: PdfService;

  constructor(private readonly mainWindow: BrowserWindow) {
    this.database = NpAssistant.readDatabase();
    this.api = new ApiController(this);
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

  private static getFileStats(filename: string): { basename: string, basenameNoExt: string, type: TTemplateType, mtimeMs: number } {
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

  private static copyAndValidateOriginal(document: IDocument, database: TAppDatabase, result: string[]) {
    // check update time here i guess
    const tmpCopy = NpAssistant.copyToTempFolder(document.filename);
    const {mtimeMs} = fs.statSync(document.filename);
    if (document.mtime !== mtimeMs) {
      document.mtime = mtimeMs;
      NpAssistant.writeDatabase(database);
      result.push('*******************');
      result.push(`WARNUNG: Die Orginal Datei [${document.name}] wurde verändert!!!`);
      result.push(`Bitte überprüfe ob die Felder noch passen.`);
      result.push(`Wenn nicht lösche am besten das Dokument und füge es danach noch einmal neu hinzu.`);
      result.push('*******************');
    }
    return tmpCopy;
  }

  getFileTemplates(): IDocument[] {
    return Object.values<IDocument>(this.database);
  }

  saveTemplate(template: IDocument): IDocument[] {
    this.database[template.filename] = template;
    NpAssistant.writeDatabase(this.database);
    return this.getFileTemplates();
  }

  removeFileTemplate(filename: string): IDocument[] {
    delete this.database[filename];
    NpAssistant.writeDatabase(this.database);
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

  private async addNewXlsxTemplate(filename: string, basename: string, basenameNoExt: string, mtimeMs: number) {
    const workbook = new ExcelJS.Workbook();
    const tmpCopy = NpAssistant.copyToTempFolder(filename);
    await workbook.xlsx.readFile(tmpCopy);

    const sheets = workbook.worksheets.map(sheet => ({id: uuidv4(), name: sheet.name}));
    if (!sheets) {
      throw new Error('No Worksheets found');
    }
    this.database[filename] = {id: uuidv4(), name: basename, filename, sheets, mapped: [], export: true, type: 'xlsx', mtime: mtimeMs} as IXlsxDocument;
    NpAssistant.removeTempCopy(tmpCopy);
  }

  private addNewPdfTemplate(filename: string, basename: string, basenameNoExt: string, mtimeMs: number) {
    let previewfile = path.join(cachePath, basenameNoExt + '-preview-data.pdf');
    const tmpCopy = NpAssistant.copyToTempFolder(filename);
    const fdfFile = NpAssistant.extractFDFToTemp(tmpCopy, this.pdf);

    const {fdf, allValues} = this.pdf.readFDF(fdfFile);
    // map allValues to Feld # and write a preview file
    const fields = allValues
      .map((fdfValue, index) => {
        fdfValue.value = `Feld ${index}`;
        return fdfValue;
      })
      .map(fdfValue => ({id: uuidv4(), name: fdfValue.path}));
    this.pdf.writeFDF(fdfFile, fdf);
    this.pdf.applyFDF(tmpCopy, fdfFile, previewfile);

    NpAssistant.removeTempCopy(fdfFile);
    NpAssistant.removeTempCopy(filename);

    this.database[filename] = {id: uuidv4(), name: basename, filename, fields, mapped: [], export: true, type: 'pdf', mtime: mtimeMs, previewfile} as IPdfDocument;

    startWithExpolorer(previewfile);
  }

  async addNewFileTemplate(): Promise<IDocument[]> {
    const filename = showFilePickerSync(this.mainWindow, {
      defaultPath: '', title: 'Dokument verknüpfen', filters: [
        {name: 'Pdf Dokumente', extensions: ['pdf']},
        {name: 'Excel Dokumente', extensions: ['xlsx']},
        {name: 'Alle Dokumente', extensions: ['*']},
      ]
    });

    if (fs.existsSync(filename)) {
      const {basename, basenameNoExt, type, mtimeMs} = NpAssistant.getFileStats(filename);
      if (type === 'pdf') {
        this.addNewPdfTemplate(filename, basename, basenameNoExt, mtimeMs);
      } else if (type === 'xlsx') {
        await this.addNewXlsxTemplate(filename, basename, basenameNoExt, mtimeMs);
      } else {
        this.database[filename] = {id: uuidv4(), name: basename, filename, export: true, type: 'resource', mtime: mtimeMs};
      }
      NpAssistant.writeDatabase(this.database);
    }

    return this.getFileTemplates();
  }

  // noinspection JSMethodCanBeStatic
  private async applyFieldsToXlsx(tmpCopy: string, fields: IMappedField[], inputs: IMappedInput[], outCopy: string) {
    const workbook = new ExcelJS.Workbook();
    // read from a file
    await workbook.xlsx.readFile(tmpCopy);
    fields.forEach(mappedField => {
      const sheetName = mappedField.origId.slice(1, mappedField.origId.indexOf('.'));
      console.log('Seeeeeeeeeeeeeeht name', sheetName, mappedField);
      const sheet = workbook.worksheets.find(sheet => sheet.name === sheetName);
      if (sheet) {
        const cell = mappedField.origId.slice(mappedField.origId.indexOf('.'));
        const value = inputs.find(input => input.identifiers.includes(mappedField.origId))?.value;
        if (value) {
          sheet.getCell(cell).value = value;
        }
      } else {
        throw new Error('No Worksheet found');
      }
    });


    try { await workbook.xlsx.writeFile(outCopy);} catch (e) {console.log(e); }

  }

  private applyFieldsToPdf(tmpCopy: string, fields: IMappedField[], inputs: IMappedInput[], outCopy: string) {
    const fdfFile = NpAssistant.extractFDFToTemp(tmpCopy, this.pdf);
    const {fdf, allValues} = this.pdf.readFDF(fdfFile);
    fields.forEach(mappedField => {
      const fdfField = allValues.find(fdfValue => fdfValue.path === mappedField.origId);
      const value = inputs.find(input => input.identifiers.includes(mappedField.origId))?.value;
      if (value) {
        fdfField.value = value;
      }
    });
    this.pdf.writeFDF(fdfFile, fdf);
    this.pdf.applyFDF(tmpCopy, fdfFile, outCopy);
    NpAssistant.removeTempCopy(fdfFile);
  }

  async createDocuments(foldername: string, inputs: IMappedInput[]): Promise<string[]> {
    const outputFolder = path.join(outputPath, foldername);
    const {outputMsgs, valid} = NpAssistant.createAndValidateOutputFolder(outputFolder, foldername);
    if (!valid) return outputMsgs;

    const templates = this.getFileTemplates().filter(template => template.export);
    for (const document of templates) {
      const tmpCopy = NpAssistant.copyAndValidateOriginal(document, this.database, outputMsgs);
      const basename = path.basename(document.filename);
      const outCopy = path.join(outputFolder, basename);

      if (document.type === 'pdf') {
        const fields = (document as IPdfDocument).mapped.filter(field => field.export);
        this.applyFieldsToPdf(tmpCopy, fields, inputs, outCopy);
      } else if (document.type === 'xlsx') {
        const fields = (document as IXlsxDocument).mapped.filter(field => field.export);
        await this.applyFieldsToXlsx(tmpCopy, fields, inputs, outCopy);
      } else {
        fs.copyFileSync(tmpCopy, outCopy);
      }

      NpAssistant.removeTempCopy(tmpCopy);
    }

    outputMsgs.push(`INFO: Alle Dokumente wurden erstellt.`);
    return outputMsgs;
  }

}
