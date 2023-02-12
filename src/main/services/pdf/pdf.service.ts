import {spawnSync} from 'child_process';
import * as fs from 'fs';
import {readFileSync, writeFileSync} from 'fs';
import * as path from "path";
import {decode, encode} from 'iconv-lite';
import {IFDFModel, IFDFValue,} from './pdf.types';
import {IAppConfig, IMappedField, IMappedInput, IPdfDocument} from "../../../bridge/shared.model";
import {copyToTempFolder, getFileInfo, removeTempCopy} from "../../utils/file.utils";
import {assembleFDF, parseFDF} from "./pdf.utils";
import {NPService} from "../np-services";
import {v4 as uuidv4} from 'uuid';

export class PdfService extends NPService {

  autoMapFields = false;

  constructor(config: IAppConfig) {
    super(config);
    if (!fs.existsSync(config.PDFTK_EXE)) {
      throw new Error('Es muss das PDFToolkit installiert sein. https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/. Falls Du dies schon installiert hast lege bitte eine .npconfig Datei mit dem passenden schema an.')
    }
  }

  //<editor-fold desc="*** FDF handling ***">

  private readFDF(filename: string): { fdf: IFDFModel; allValues: IFDFValue[]; fileContent: string } {
    const buffer = readFileSync(filename);
    const fileContent = decode(buffer, this.config.ENCODING);
    const {fdf, allValues} = parseFDF(fileContent);
    return {fdf, allValues, fileContent};
  }

  private writeFDF(filename: string, fdf: IFDFModel): string {
    const data = assembleFDF(fdf);
    writeFileSync(filename, encode(data, this.config.ENCODING));
    return data;
  }

  private extractFDF(pdffile: string, outfile: string) {
    const args = [pdffile, 'generate_fdf', 'output', outfile];
    spawnSync(this.config.PDFTK_EXE, args, {});
  }

  private extractFDFToTemp(filename: string, tmpPath: string) {
    const ext = path.extname(filename);
    const basenameNoExt = path.basename(filename, ext);
    const fdfFile = path.join(tmpPath, basenameNoExt + '.fdf');
    this.extractFDF(filename, fdfFile);
    return fdfFile;
  }

  private applyFDF(pdffile: string, fdffile: string, outfile: string) {
    const args = [pdffile, 'fill_form', fdffile, 'output', outfile];
    spawnSync(this.config.PDFTK_EXE, args, {});
  }

  //</editor-fold>

  async addDocument(filename: string): Promise<IPdfDocument> {
    const base = await super.addDocument(filename);
    const stats = getFileInfo(filename);
    const previewfile = path.join(this.config.CACHE_PATH, stats.basenameNoExt + '-preview-data.pdf');
    const tmpCopy = copyToTempFolder(filename, this.config.TMP_PATH);
    const fdfFile = this.extractFDFToTemp(tmpCopy, this.config.TMP_PATH);
    const {fdf, allValues} = this.readFDF(fdfFile);
    // map allValues to Feld # or original id and write a preview file
    const fields = allValues
      .map((fdfValue, index) => {
        fdfValue.value = fdfValue.path;
        return fdfValue;
      })
      .map(fdfValue => ({id: uuidv4(), name: fdfValue.path}));
    this.writeFDF(fdfFile, fdf);
    this.applyFDF(tmpCopy, fdfFile, previewfile);
    removeTempCopy(fdfFile, this.config.TMP_PATH);
    removeTempCopy(filename, this.config.TMP_PATH);

    let mapped: IMappedField[] = undefined;
    if (this.autoMapFields) {
      mapped = fields.map(field => {
        return {origId: field.id, mappedName: field.name}
      })
    }

    return {...base, previewfile, fields, type: "pdf", mapped};
  }

  async createDocument(document: IPdfDocument, outputPath: string, inputs: IMappedInput[], outputMsgs: string[]): Promise<string> {
    const {tmpCopy, basename} = this.copyAndValidateOriginalToTemp(document, outputMsgs);
    const fdfFile = this.extractFDFToTemp(tmpCopy, this.config.TMP_PATH);
    const {fdf, allValues} = this.readFDF(fdfFile);

    const flatIds = inputs.reduce((prev, current) => {
      prev.push(...current.identifiers);
      return prev;
    }, []);
    const fields = document.mapped.filter(field => flatIds.includes(field.origId));
    fields.forEach(mappedField => {
      const origField = document.fields.find(orig => orig.id === mappedField.origId);
      const fdfField = allValues.find(fdfValue => fdfValue.path === origField.name);
      const value = inputs.find(input => input.identifiers.includes(mappedField.origId))?.value;
      if (value) {
        fdfField.value = value;
      }
    });

    this.writeFDF(fdfFile, fdf);
    const outCopy = path.join(outputPath, basename);
    this.applyFDF(tmpCopy, fdfFile, outCopy);
    removeTempCopy(fdfFile, this.config.TMP_PATH);
    removeTempCopy(tmpCopy, this.config.TMP_PATH);
    return basename;
  }
}
