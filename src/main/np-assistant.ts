import {BrowserWindow} from 'electron';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuidv4} from 'uuid';
import {IMappedDocument, IMappedField, IMappedInput, IPdfDocument, IProfile, IXlsxDocument, TAppDatabase, TTemplateType} from '../bridge/shared.model';
import {ApiController} from './api';
import {PdfService} from './pdf/pdf.service';
import {showFilePickerSync} from './utils/electron.utils';
import {startWithExpolorer} from './utils/shell.utils';

const dataPath = process.env.APP_DATA || path.resolve('./data');
const tmpPath = process.env.APP_TEMP || path.join(dataPath, 'tmp');
const cachePath = process.env.APP_CACHE || path.join(dataPath, 'cache');
const outputPath = process.env.APP_OUTPUT || path.join(dataPath, 'out');
const dataFile = process.env.APP_CONFIG || path.join(dataPath, 'data.db');
const profileFile = process.env.APP_CONFIG || path.join(dataPath, 'profiles.db');

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
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, {encoding: 'utf8'});
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
      fs.writeFileSync(dataFile, JSON.stringify(database), {encoding: 'utf8'});
    } catch (e) {
      console.error(e);
    }
  }

  private static readProfiles(): IProfile[] {
    if (fs.existsSync(profileFile)) {
      const content = fs.readFileSync(profileFile, {encoding: 'utf8'});
      return JSON.parse(content);
    }
    return [];
  }

  private static writeProfiles(profiles: IProfile[]) {
    try {
      fs.writeFileSync(profileFile, JSON.stringify(profiles), {encoding: 'utf8'});
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
      result.push(`Ordner wurde erstellt: ${outputFolder}`);
    } else {
      valid = false;
      result.push(`Ordner existierte bereits: ${outputFolder}`);
      result.push('Erstellen wurde abgebrochen damit keine Daten überschrieben werden.');
      result.push('Bitte warte eine Minute, lösche den Ordner oder verwende ein anderes suffix');
    }
    return {outputMsgs: result, valid};
  }

  private static copyAndValidateOriginal(document: IMappedDocument, database: TAppDatabase, result: string[]) {
    const tmpCopy = NpAssistant.copyToTempFolder(document.filename);
    const {mtimeMs} = fs.statSync(document.filename);
    if (document.mtime !== mtimeMs) {
      document.mtime = mtimeMs;
      NpAssistant.writeDatabase(database);
      result.push('*******************');
      result.push(`WARNUNG: Die Original Datei [${document.name}] wurde verändert!!!`);
      result.push(`Bitte überprüfe ob die Felder noch passen.`);
      result.push(`Wenn nicht lösche am besten das Dokument und füge es danach noch einmal neu hinzu.`);
      result.push('*******************');
    }
    return tmpCopy;
  }

  get documents(): IMappedDocument[] {
    return Object.values<IMappedDocument>(this.database);
  }

  saveTemplate(template: IMappedDocument): void {
    this.database[template.filename] = template;
    NpAssistant.writeDatabase(this.database);
  }

  removeFileTemplate(filename: string) {
    delete this.database[filename];
    NpAssistant.writeDatabase(this.database);
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


  remapDocument(filename: string) {
    if (!this.database[filename]) throw new Error('Dieses Dokument existiert nicht mehr. Bitte wenden Sie sich an Ihren persönlichen Ansprechpartner für IT-Probleme.');
    const newfilename = showFilePickerSync(this.mainWindow, {
      defaultPath: path.dirname(filename), title: 'Dokument neu verknüpfen'
    });
    if (fs.existsSync(newfilename)) {
      const {basename, type, mtimeMs} = NpAssistant.getFileStats(newfilename);
      const oldDoc = this.database[filename];
      if (type !== oldDoc.type) throw new Error('Es kann hier nur eine Änderung des Dateinamens vorgenommen werden. Eine Änderung der Vorlage geht nur über löschen und neu anlegen.');
      oldDoc.filename = newfilename;
      oldDoc.name = basename;
      oldDoc.mtime = mtimeMs;

      delete this.database[filename];
      this.database[newfilename] = oldDoc;
      NpAssistant.writeDatabase(this.database);
    } else {
      if(newfilename) throw new Error('Die gewählte Datei konnte nicht gelesen werden. Bitte wenden Sie sich an Ihren persönlichen Ansprechpartner für IT-Probleme.');
    }
    return this.documents;
  }

  async addNewFileTemplate(): Promise<IMappedDocument[]> {
    const filename = showFilePickerSync(this.mainWindow, {
      defaultPath: '', title: 'Dokument verknüpfen'
    });

    if (fs.existsSync(filename)) {
      if (!!this.database[filename]) throw new Error('Dieses Dokument existiert bereits. Bitte keine doppelten Dokumente anlegen. Bei Problemen entferne die alte Vorlage und beginne von vorne.');
      const {basename, basenameNoExt, type, mtimeMs} = NpAssistant.getFileStats(filename);
      if (type === 'pdf') {
        this.addNewPdfTemplate(filename, basename, basenameNoExt, mtimeMs);
      } else if (type === 'xlsx') {
        await this.addNewXlsxTemplate(filename, basename, basenameNoExt, mtimeMs);
      } else {
        this.database[filename] = {id: uuidv4(), name: basename, filename, export: true, type: 'resource', mtime: mtimeMs};
      }
      NpAssistant.writeDatabase(this.database);
    } else {
      if(filename) throw new Error('Die gewählte Datei konnte nicht gelesen werden. Bitte wenden Sie sich an Ihren persönlichen Ansprechpartner für IT-Probleme.');
    }
    return this.documents;
  }

  // noinspection JSMethodCanBeStatic
  private async applyFieldsToXlsx(document: IXlsxDocument, tmpCopy: string, inputs: IMappedInput[], outCopy: string) {
    const fields = document.mapped.filter(field => field.export);
    const workbook = new ExcelJS.Workbook();
    // read from a file
    await workbook.xlsx.readFile(tmpCopy);
    fields.forEach(mappedField => {
      let fullCellId = mappedField.mappedName;
      const sheetName = fullCellId.slice(1, fullCellId.indexOf('.'));
      const sheet = workbook.worksheets.find(sheet => sheet.name === sheetName);
      if (sheet) {
        const cell = fullCellId.slice(fullCellId.indexOf('.') + 1);
        const value = inputs.find(input => input.identifiers.includes(mappedField.origId))?.value;
        if (value) {
          sheet.getCell(cell).value = value;
        }
      } else {
        throw new Error('Die Excel Datei enthält keine Arbeitsmappen');
      }
    });
    await workbook.xlsx.writeFile(outCopy);
  }

  private applyFieldsToPdf(document: IPdfDocument, tmpCopy: string, inputs: IMappedInput[], outCopy: string) {
    const fields: IMappedField[] = document.mapped.filter(field => field.export);
    const fdfFile = NpAssistant.extractFDFToTemp(tmpCopy, this.pdf);
    const {fdf, allValues} = this.pdf.readFDF(fdfFile);
    fields.forEach(mappedField => {
      const origField = document.fields.find(orig => orig.id === mappedField.origId);
      const fdfField = allValues.find(fdfValue => fdfValue.path === origField.name);
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
    if (!valid) throw new Error(outputMsgs.join('||'));

    const templates = this.documents.filter(template => template.export);
    for (const document of templates) {
      const tmpCopy = NpAssistant.copyAndValidateOriginal(document, this.database, outputMsgs);
      const basename = path.basename(document.filename);
      const outCopy = path.join(outputFolder, basename);

      if (document.type === 'pdf') {
        this.applyFieldsToPdf(document as IPdfDocument, tmpCopy, inputs, outCopy);
      } else if (document.type === 'xlsx') {
        await this.applyFieldsToXlsx(document as IXlsxDocument, tmpCopy, inputs, outCopy);
      } else {
        fs.copyFileSync(tmpCopy, outCopy);
      }
      outputMsgs.push(`Dokument wurden erstellt: ${basename}`);

      NpAssistant.removeTempCopy(tmpCopy);
    }

    outputMsgs.push(`Alle Dokumente wurden erfolgreich erstellt.`);
    return outputMsgs;
  }

  get profiles() {
    return NpAssistant.readProfiles();
  }

  set profiles(profiles) {
    NpAssistant.writeProfiles(profiles);
  }
}
