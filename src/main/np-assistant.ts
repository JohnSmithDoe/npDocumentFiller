import {BrowserWindow} from 'electron';

import * as fs from 'fs';
import * as path from 'path';
import {join, resolve} from 'path';
import {
  IAppConfig,
  IClientData,
  IMappedDocument,
  IMappedInput,
  IPdfDocument, IProfile,
  IXlsxDocument,
} from '../bridge/shared.model';
import {ApiController} from './api';
import {PdfService} from './services/pdf/pdf.service';
import {showFilePickerSync} from './utils/electron.utils';
import {startWithExpolorer} from './utils/shell.utils';
import {createAndValidateFolder, getFileInfo, getFileStats} from "./utils/file.utils";
import {NpDatabase} from "./services/np-database";
import {XlsService} from "./services/xls/xls.service";
import {ResourceService} from "./services/resource/resource.service";

const args = process.argv.slice(1),
  debug = args.some(val => val === '--npdebug');

const npConfigFile = path.resolve('./.npconfig');

let npConfig: IAppConfig = {};
try {
  const npConfigContent = fs.readFileSync(npConfigFile, {encoding: 'utf8'});
  npConfig = JSON.parse(npConfigContent);
} catch (e) {
  console.error(e);
}

const dataPath = npConfig.DATA_PATH || process.env.APP_DATA || path.resolve('./data');
const tmpPath = npConfig.TMP_PATH || process.env.APP_TEMP || path.join(dataPath, 'tmp');
const cachePath = npConfig.CACHE_PATH || process.env.APP_CACHE || path.join(dataPath, 'cache');
const outputPath = npConfig.OUTPUT_PATH || process.env.APP_OUTPUT || path.join(dataPath, 'out');
const documentsFile = npConfig.DB_FILE || process.env.APP_CONFIG || path.join(dataPath, 'data.db');
const profilesFile = npConfig.PROFILE_FILE || process.env.APP_CONFIG || path.join(dataPath, 'profiles.db');

// Get the pdftk.exe
const pdftk = npConfig.PDFTK_EXE || process.env.APP_PDFTK_EXE || resolve(join('.', 'pdftk', 'bin', 'pdftk.exe'));
// To get the encoding of a file we need to "guess" so we only split win and others :)
const encoding = npConfig.ENCODING || process.env.APP_ENCODING || (process.platform === 'win32' ? 'win1252' : 'utf8');

npConfig.DATA_PATH = dataPath;
npConfig.TMP_PATH = tmpPath;
npConfig.CACHE_PATH = cachePath;
npConfig.OUTPUT_PATH = outputPath;
npConfig.DB_FILE = documentsFile;
npConfig.PROFILE_FILE = profilesFile;
npConfig.PDFTK_EXE = pdftk;
npConfig.ENCODING = encoding;

if (debug) {
  console.log(npConfig, pdftk);
  try {
    fs.writeFileSync(npConfigFile, JSON.stringify(npConfig), {encoding: 'utf8'});
  } catch (e) {
    console.error(e);
  }
}

// init folder structure
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}
if (!fs.existsSync(tmpPath)) {
  fs.mkdirSync(tmpPath);
}
if (!fs.existsSync(cachePath)) {
  fs.mkdirSync(cachePath);
}
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

export class NpAssistant {
  readonly api = new ApiController(this, npConfig);
  private readonly database = new NpDatabase(npConfig);
  private readonly pdf = new PdfService(npConfig);
  private readonly xls = new XlsService(npConfig);
  private readonly resource = new ResourceService(npConfig);

  constructor(private readonly mainWindow: BrowserWindow) {
  }

  getClientData(documents: boolean, profiles: boolean): IClientData {
    return {
      documents: documents ? this.database.documents : [],
      profiles: profiles ? this.database.profiles : []
    };
  }

  updateProfiles(profiles: IProfile[]) {
    this.database.updateProfiles(profiles);
  }

  async addDocument(autoMapFields: boolean): Promise<IClientData> {
    const filename = showFilePickerSync(this.mainWindow, {defaultPath: '', title: 'Dokument verknüpfen'});
    if (!filename) return this.getClientData(true, false);
    if (!fs.existsSync(filename))
      throw new Error('Die gewählte Datei konnte nicht gelesen werden. Bitte wenden Sie sich an Ihren persönlichen Ansprechpartner für IT-Probleme.');
    if (this.database.documentExists(filename))
      throw new Error('Dieses Dokument existiert bereits. Bitte keine doppelten Dokumente anlegen. Bei Problemen entferne die alte Vorlage und beginne von vorne.');

    const type = getFileInfo(filename).type;
    let document: IMappedDocument;
    switch (type) {
      case "pdf":
        this.pdf.autoMapFields = autoMapFields;
        document = await this.pdf.addDocument(filename);
        startWithExpolorer((document as IPdfDocument).previewfile)
        break;
      case "xlsx":
        document = await this.xls.addDocument(filename);
        break;
      case "resource":
        document = await this.resource.addDocument(filename);
        break;
    }
    this.database.addDocument(document);
    return this.getClientData(true, false);
  }

  async createDocuments(foldername: string, documentIds: string[], inputs: IMappedInput[]): Promise<string[]> {
    const outputFolder = path.join(outputPath, foldername);
    const {outputMsgs, valid} = createAndValidateFolder(outputFolder);
    if (!valid) throw new Error(outputMsgs.join('||'));
    const documents = this.database.documents.filter(doc => documentIds.includes(doc.id));
    for (const document of documents) {
      let basename;
      switch (document.type) {
        case "pdf":
          basename = await this.pdf.createDocument(document as IPdfDocument, outputFolder, inputs, outputMsgs)
          break;
        case "xlsx":
          basename = await this.xls.createDocument(document as IXlsxDocument, outputFolder, inputs, outputMsgs)
          break;
        case "resource":
          basename = await this.resource.createDocument(document, outputFolder, inputs, outputMsgs)
          break;
      }
      outputMsgs.push(`Dokument wurden erstellt: ${basename}`);
    }

    outputMsgs.push(`Alle Dokumente wurden erfolgreich erstellt.`);
    return outputMsgs;
  }

  removeDocument(id: string) {
    this.database.removeDocument(id);
    return this.getClientData(true, true);
  }

  updateDocument(document: IMappedDocument) {
    this.database.updateDocument(document);
    return this.getClientData(true, true);
  }

  remapDocument(id: string) {
    if (!this.database.documentIdExists(id))
      throw new Error('Dieses Dokument existiert nicht mehr. Bitte wenden Sie sich an Ihren persönlichen Ansprechpartner für IT-Probleme.');

    const original = this.database.getDocument(id);
    const newfilename = showFilePickerSync(this.mainWindow, {
      defaultPath: path.dirname(original.filename), title: 'Dokument neu verknüpfen'
    });
    if (!newfilename) return;
    if (!fs.existsSync(newfilename))
      throw new Error('Die gewählte Datei konnte nicht gelesen werden. Bitte wenden Sie sich an Ihren persönlichen Ansprechpartner für IT-Probleme.');

    const {basename, type, mtimeMs} = getFileStats(newfilename);
    if (type !== original.type) throw new Error('Es kann hier nur eine Änderung des Dateinamens vorgenommen werden. Eine Änderung des Vorlagen-Typs geht nur über löschen und neu anlegen.');
    original.filename = newfilename;
    original.name = basename;
    original.mtime = mtimeMs;

    throw new Error('Remapppppppp is not ready....')

    this.database.updateDocument(original);
    return this.getClientData(true, true);
  }

}
