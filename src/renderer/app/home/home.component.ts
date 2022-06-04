import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, OnDestroy, OnInit, TrackByFunction, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTree, MatTreeNestedDataSource} from '@angular/material/tree';
import {Subscription} from 'rxjs';
import {IDocument, IMappedField, IMappedInput, IPdfDocument, IXlsxDocument} from '../../../bridge/shared.model';
import {ElectronService} from '../services/electron.service';
import {FieldDialogComponent} from '../shared/dialogs/add-field/field-dialog.component';
import {ConfirmDialogComponent} from '../shared/dialogs/confirm/confirm-dialog.component';
import {assignDeep} from '../shared/shared.utils';
// @formatter:off
// @ts-ignore
let CTEST: TTemplateFile[] = Object.values({"D:\\Projekte\\Html\\npDocumentFiller\\pdftk\\pdfs\\VPI_Betriebsfreigabe_xfa.pdf":{"id":"6c4c833d-ce21-4209-aed3-56a43fff769b","name":"VPI_Betriebsfreigabe_xfa.pdf","filename":"D:\\Projekte\\Html\\npDocumentFiller\\pdftk\\pdfs\\VPI_Betriebsfreigabe_xfa.pdf","fields":["Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[2]","Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[1]","Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[0]","Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile5[0]_85[2]","Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile5[0]_85[1]","Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile5[0]_85[0]","Formular1[0]#subform[0]#area[1]Tabelle4[1]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle4[7]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[1]","Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[2]","Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[3]","Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[0]","Formular1[0]#subform[0]Tabelle4[4]Zeile3[0]#subform[0]_85[1]","Formular1[0]#subform[0]Tabelle4[4]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[3]","Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[6]","Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[1]","Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[4]","Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[7]","Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[2]","Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[5]","Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[8]","Formular1[0]#subform[0]Tabelle1[0]Zeile4[0]Kontrollkästchen1[1]","Formular1[0]#subform[0]Tabelle1[0]Zeile4[0]Kontrollkästchen1[0]","Formular1[0]#subform[0]Tabelle1[0]Zeile4[0]_85[0]","Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[0]","Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[3]","Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[6]","Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[1]","Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[4]","Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[7]","Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[2]","Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[5]","Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[8]","Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[0]","Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[3]","Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[6]","Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[9]","Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[1]","Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[4]","Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[7]","Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[2]","Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[5]","Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[8]","Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[3]","Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[2]","Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[1]","Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle4[9]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[1]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[2]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[3]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[4]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[5]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[0]","Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[4]","Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[3]","Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[2]","Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[1]","Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[0]","Formular1[0]#subform[0]Tabelle4[3]Zeile3[0]_85[1]","Formular1[0]#subform[0]Tabelle4[3]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle1[2]Zeile3[0]#subform[0]#area[0]_85[0]","Formular1[0]#subform[0]Tabelle1[2]Zeile3[0]_85[2]","Formular1[0]#subform[0]Tabelle1[2]Zeile3[0]_85[1]","Formular1[0]#subform[0]Tabelle1[2]Zeile2[0]_85[2]","Formular1[0]#subform[0]Tabelle1[2]Zeile2[0]_85[1]","Formular1[0]#subform[0]Tabelle1[2]Zeile2[0]_85[0]","Formular1[0]#subform[0]#area[2]Tabelle2[0]Zeile1[0]_85[2]","Formular1[0]#subform[0]#area[2]Tabelle2[0]Zeile1[0]_85[1]","Formular1[0]#subform[0]#area[2]Tabelle2[0]Zeile1[0]_85[0]","Formular1[0]#subform[0]Tabelle4[12]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[3]","Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[2]","Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[1]","Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[0]","Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[3]","Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[2]","Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[1]","Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[3]","Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[2]","Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[1]","Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle4[5]Zeile3[2]_85[2]","Formular1[0]#subform[0]Tabelle4[5]Zeile3[2]_85[1]","Formular1[0]#subform[0]Tabelle4[5]Zeile3[2]_85[0]","Formular1[0]#subform[0]Tabelle4[5]Zeile3[1]_85[1]","Formular1[0]#subform[0]Tabelle4[5]Zeile3[1]_85[0]","Formular1[0]#subform[0]Tabelle4[2]Zeile3[0]_85[2]","Formular1[0]#subform[0]Tabelle4[2]Zeile3[0]_85[1]","Formular1[0]#subform[0]Tabelle4[2]Zeile3[0]_85[0]","Formular1[0]#subform[0]Tabelle1[1]Zeile3[0]#subform[0]#area[0]_85[0]","Formular1[0]#subform[0]Tabelle1[1]Zeile3[0]_85[2]","Formular1[0]#subform[0]Tabelle1[1]Zeile3[0]_85[1]","Formular1[0]#subform[0]Tabelle1[1]Zeile2[0]_85[2]","Formular1[0]#subform[0]Tabelle1[1]Zeile2[0]_85[1]","Formular1[0]#subform[0]Tabelle1[1]Zeile2[0]_85[0]"],"mapped":[{"identifier":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[2]","clearName":"Wagennummer","export":true,"mappedName":"Feld 0"}],"export":true,"type":"pdf","mtime":1653764484395,"previewfile":"D:\\Projekte\\Html\\npDocumentFiller\\data\\cache\\VPI_Betriebsfreigabe_xfa-preview-data.pdf"},"D:\\Projekte\\Html\\npDocumentFiller\\pdftk\\pdfs\\VPI-EMG 02 Formular Anhang 20_Messblatt Drehgestell mit Schraubfeder.pdf":{"id":"6584a4d8-80ac-4ca2-b66b-b4afff4f5bfe","name":"VPI-EMG 02 Formular Anhang 20_Messblatt Drehgestell mit Schraubfeder.pdf","filename":"D:\\Projekte\\Html\\npDocumentFiller\\pdftk\\pdfs\\VPI-EMG 02 Formular Anhang 20_Messblatt Drehgestell mit Schraubfeder.pdf","fields":["Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]_072[0]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]_008[0]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]_071[0]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[2]_011[0]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[2]_073[0]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[2]_009[0]","Formular1[0]#subform[0]Tabelle4[6]Zeile3[2]_010[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile3[0]_014[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile3[0]_015[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile3[0]_012[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile3[0]_013[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile4[0]_018[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile4[0]_019[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile4[0]_016[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile4[0]_017[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile5[0]_023[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile5[0]_020[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile5[0]_021[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile5[0]_022[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile6[0]_026[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile6[0]_027[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile6[0]_024[0]","Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile6[0]_025[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile3[0]_031[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile3[0]_032[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile3[0]_033[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile3[0]_030[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile4[0]_035[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile4[0]_036[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile4[0]_037[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile4[0]_034[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile5[0]_038[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile5[0]_039[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile5[0]_040[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile5[0]_041[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile6[0]_043[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile6[0]_044[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile6[0]_045[0]","Formular1[0]#subform[0]Tabelle4[1]Zeile6[0]_042[0]","Formular1[0]#subform[0]Tabelle3[0]Zeile2[1]_054[0]","Formular1[0]#subform[0]Tabelle4[7]Zeile3[0]_069[0]","Formular1[0]#subform[0]Tabelle4[7]Zeile3[0]_070[0]","Formular1[0]#subform[0]Tabelle4[2]Zeile7[0]_028[0]","Formular1[0]#subform[0]Tabelle4[2]Zeile7[0]_029[0]","Formular1[0]#subform[0]Tabelle4[3]Zeile3[0]_047[0]","Formular1[0]#subform[0]Tabelle4[3]Zeile3[0]_046[0]","Formular1[0]#subform[0]Tabelle4[3]Zeile4[0]_048[0]","Formular1[0]#subform[0]Tabelle4[3]Zeile4[0]_049[0]","Formular1[0]#subform[0]Tabelle4[3]Zeile5[0]_051[0]","Formular1[0]#subform[0]Tabelle4[3]Zeile5[0]_050[0]","Formular1[0]#subform[0]Tabelle4[3]Zeile6[0]_052[0]","Formular1[0]#subform[0]Tabelle4[3]Zeile6[0]_053[0]","Formular1[0]#subform[0]#area[2]Tabelle4[5]Zeile3[0]_004[0]","Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile3[0]_002[0]","Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile3[0]_003[0]","Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile3[0]_001[0]","Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile5[0]_006[0]","Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile5[0]_007[0]","Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile5[0]_005[0]"],"mapped":[],"export":true,"type":"pdf","mtime":1641886872000,"previewfile":"D:\\Projekte\\Html\\npDocumentFiller\\data\\cache\\VPI-EMG 02 Formular Anhang 20_Messblatt Drehgestell mit Schraubfeder-preview-data.pdf"},"D:\\Projekte\\Html\\npDocumentFiller\\pdftk\\pdfs\\Sample100.xlsx":{"id":"7661d11d-fe00-41ff-a197-1e614c5e25ee","name":"Sample100.xlsx","filename":"D:\\Projekte\\Html\\npDocumentFiller\\pdftk\\pdfs\\Sample100.xlsx","sheets":["Sheet1","Sheet2","HaloSheet"],"mapped":[{"identifier":"$HaloSheet.A34","clearName":"Wagennummer","export":true,"mappedName":"$HaloSheet.A34"},{"identifier":"$Sheet2.B23","clearName":"Erzeuger","export":true,"mappedName":"$Sheet2.B23"}],"export":true,"type":"xlsx","mtime":1654096456409.502}});
// @formatter:on

type TUITemplateInput = IMappedInput & IMappedField & { info: string };

@Component({
             selector:    'app-home',
             templateUrl: './home.component.html',
             styleUrls:   ['./home.component.scss']
           })
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('documenttree') treeRef: MatTree<IDocument>;

  treeControl = new NestedTreeControl<IDocument | IMappedField>(node => (node as any).mapped);
  dataSource = new MatTreeNestedDataSource<IDocument>();
  exportMsgs: string[] = [];

  exportedFields: TUITemplateInput[] = [];
  exportSuffix: string;
  exportFolder: string;
  private snackSub: Subscription;
  private dialogSub: Subscription;
  private updateSub: Subscription;

  constructor(
    private readonly electronService: ElectronService,
    private readonly snackBarService: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
    this.updateSub = electronService.update$.subscribe((data) => {
      // TODO
      // if (!this.exportMsgs?.find(msg => msg.startsWith('FEHLER'))) {
      // }
      const snack = this.snackBarService.open('Dokumente wurden erstellt', 'Ordner öffnen', {duration: 5000});
      if (this.snackSub && !this.snackSub.closed) {
        this.snackSub.unsubscribe();
      }
      this.snackSub = snack.onAction().subscribe(() => {
        this.electronService.openOutputFolder(this.exportFolder);
      });
      this.updateDataSource(data);
    });
  }

  private updateDataSource(newData: IDocument[]) {
    console.log('update data', newData);
    assignDeep(this.dataSource.data, newData);
    console.log('update data', this.dataSource.data);
    if (this.dataSource.data) {
      this.updateExportedFields();
      if (this.treeRef) {
        this.treeRef.renderNodeChanges(this.dataSource.data);
      }
    }
  }

  private findExportedValue(origId: string) {
    return this.exportedFields.find(field => field.identifiers.includes(origId))?.value || '';
  }

  private findTemplate(origId: string) {
    return this.dataSource.data.find(document => ((document as any).mapped || []).find((field: IMappedField) => field.origId === origId));
  }

  private updateExportedFields() {
    const mappedFields = this.dataSource.data
                             .map(document => {
                               if (document.type === 'pdf') return (document as IPdfDocument).mapped;
                               if (document.type === 'xlsx') return (document as IXlsxDocument).mapped;
                               return [];
                             })
                             .reduce((result, current) => result.concat(current), []);


    this.exportedFields =
      mappedFields
        .map(({origId, ...field}) =>
               ({
                 ...field,
                 value:       this.findExportedValue(origId),
                 identifiers: [origId],
                 info:        this.findTemplate(origId)?.name || '',
                 name:        field.clearName,
                 origId
               }))
        .filter((field, index, arr) => {
          const firstIdx = arr.findIndex((search) => search.clearName === field.clearName);
          if ((firstIdx !== index)) {
            arr[firstIdx].info += ' & ' + field.info;
            arr[firstIdx].identifiers.push(...field.identifiers);
          }
          return (firstIdx === index);
        });

    this.updateExportFolder();
  }

  // use confirm dialog

  private removeDocument(template: IDocument) {
    if (this.dataSource.data) {
      this.dataSource.data.splice(this.dataSource.data.indexOf(template), 1);
      this.electronService.removeDocument(template);
      this.updateExportedFields();
      if (this.treeRef) {
        this.treeRef.renderNodeChanges(this.dataSource.data);
      }
    }
  }

  // use confirm dialog

  private removeField(field: IMappedField) {
    if (this.dataSource.data) {
      const document =
              (this.dataSource.data.filter(template => template.type !== 'resource') as (IXlsxDocument | IPdfDocument)[])
                .find(template => template.mapped.find(tfield => tfield.origId === field.origId));
      document.mapped.splice(document.mapped.indexOf(field), 1);
      this.electronService.save(document);
      this.updateExportedFields();
      if (this.treeRef) {
        this.treeRef.renderNodeChanges(this.dataSource.data);
      }
    }
  }

  hasChild = (_: number, node: IDocument) => (['xlsx', 'pdf'].includes(node.type) && (node as (IXlsxDocument | IPdfDocument)).mapped.length > 0);

  trackBy: TrackByFunction<IDocument | (IXlsxDocument | IPdfDocument)> = (index, node) => {
    return ((node as (IXlsxDocument | IPdfDocument)).mapped || []).reduce((fullId, current) => fullId + current.origId, node.id);
  };

  ngOnInit(): void {
    this.electronService.getTemplates();
    if (!this.electronService.isElectron) this.updateDataSource(CTEST);
  }

  ngOnDestroy() {
    [this.updateSub, this.snackSub, this.dialogSub].forEach(sub => !sub.closed && sub.unsubscribe());
  }

  updateExportFolder() {
    this.exportMsgs =
      this.dataSource.data
          .filter(template => template.export)
          .map(template => `<b>Dokument:</b> ${template.name}`);

    if (this.exportMsgs.length) {
      this.exportFolder = (new Date()).toLocaleString('de').slice(0, 16).replace(/[.\s:]/g, '').replace(/,/g, 'T') + (!!this.exportSuffix ? '-' + this.exportSuffix : '');
      this.exportMsgs.unshift(`<b>Ordner:</b> ${this.exportFolder}`);
    }
  }

  addFileTemplate() {
    this.electronService.addFileTemplate();

    // TODO: !!!!!!!!!!!!!!!!!!!this.updateDataSource(result);
  }

  createDocuments() {
    this.updateExportFolder();
    this.electronService.createDocuments(this.exportFolder, this.exportedFields);
  }

  openOutputFolder() {
    this.electronService.openOutputFolder('');
  }

  changedDocument(template: IDocument) {
    const result = this.electronService.save(template);
    console.log('save', result);
    this.updateDataSource([template]);
  }

  changedField(field: IMappedField) {
    const template = this.findTemplate(field.origId);
    this.electronService.save(template);
  }

  showConfirmDialog(document: IDocument, field: IMappedField) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: !!document});
    if (this.dialogSub && !this.dialogSub.closed) {
      this.dialogSub.unsubscribe();
    }
    this.dialogSub = dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (field) {
          this.removeField(field);
        } else {
          this.removeDocument(document);
        }
      }
    });
  }

  showFieldMappingDialog(node: (IXlsxDocument | IPdfDocument)) {
    const possibleFields = node.type === 'pdf' ? node.fields : node.sheets;
    const dialogRef = this.dialog.open(FieldDialogComponent, {data: {possibleFields, used: node.mapped, type: node.type}});

    if (this.dialogSub && !this.dialogSub.closed) {
      this.dialogSub.unsubscribe();
    }
    this.dialogSub = dialogRef.afterClosed().subscribe((result: IMappedField) => {
      if (result) {
        node.mapped = (node.mapped || []);
        node.mapped.push(result);
        this.changedDocument(node);
      }
    });
  }

  isDocument(node: IDocument | IMappedField) {
    return !!((node as any).type);
  }

}
