import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {EAppChannels, IDocument, IMappedField, IMappedInput, IPdfDocument, IXlsxDocument} from '../../../bridge/shared.model';
import {APP_CONFIG} from '../../environments/environment';
import {AppService} from '../services/app.service';
import {ElectronService} from '../services/electron.service';
import {FieldDialogComponent} from '../shared/dialogs/add-field/field-dialog.component';
import {ConfirmDialogComponent} from '../shared/dialogs/confirm/confirm-dialog.component';

type TUITemplateInput = IMappedInput & IMappedField & { info: string };

@Component({
             selector:    'app-home',
             templateUrl: './home.component.html',
             styleUrls:   ['./home.component.scss']
           })
export class HomeComponent implements OnInit, OnDestroy {

  dataSource: IDocument[] = [];
  exportMsgs: string[] = [];
  exportedFields: TUITemplateInput[] = [];
  exportSuffix: string;
  exportFolder: string;

  private snackSub: Subscription;
  private dialogSub: Subscription;
  private subs: Subscription[] = [];

  private exportIsRunning: boolean;
  private changedName = false;

  constructor(
    private readonly electronService: ElectronService,
    private readonly snackBarService: MatSnackBar,
    private readonly appService: AppService,
    private readonly dialog: MatDialog
  ) {
    this.subs.push(
      electronService.update$.subscribe((data) => {
        this.appService.modal$.next(false);
        if ((typeof data === 'boolean') || (data === undefined)) {
          return;
        } else if (data.length && typeof data[0] === 'string') {
          this.exportMsgs = data as string[];
        } else {
          this.updateDataSource(data as IDocument[]);
        }

        if (this.exportIsRunning) {
          this.exportIsRunning = false;
          const snack = this.snackBarService.open('Dokumente wurden erstellt', 'Ordner öffnen', {duration: 5000});
          if (this.snackSub && !this.snackSub.closed) {
            this.snackSub.unsubscribe();
          }
          this.snackSub = snack.onAction().subscribe(() => {
            this.electronService.openOutputFolder(this.exportFolder);
          });
        }
      }),

      electronService.startRequest$.subscribe((channel) => {
        this.exportIsRunning = channel === EAppChannels.EXPORT;
        this.appService.modal$.next(this.electronService.isElectron);
      }),

      electronService.error$.subscribe((err) => {
        this.appService.modal$.next(false);
        console.error(err);
      })
    );
  }

  private updateDataSource(newData: IDocument[]) {
    this.dataSource = newData;
    if (this.dataSource?.length) {
      this.updateExportedFields();
    }
  }

  private findExportedValue(origId: string) {
    return this.exportedFields.find(field => field.identifiers.includes(origId))?.value || '';
  }

  private findTemplate(origId: string) {
    return this.dataSource.find(document => ((document as any).mapped || []).find((field: IMappedField) => field.origId === origId));
  }

  private updateExportedFields() {
    const mappedFields = this.dataSource
                             .filter(document => document.export)
                             .map(document => {
                               if (document.type === 'pdf') return (document as IPdfDocument).mapped;
                               if (document.type === 'xlsx') return (document as IXlsxDocument).mapped;
                               return [];
                             })
                             .reduce((result, current) => result.concat(current), [])
                             .filter(field => field.export);


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
    if (this.dataSource) {
      this.dataSource.splice(this.dataSource.indexOf(template), 1);
      this.electronService.removeDocument(template);
      this.updateExportedFields();
    }
  }

  // use confirm dialog
  private removeField(field: IMappedField) {
    if (this.dataSource) {
      const document =
              (this.dataSource.filter(template => template.type !== 'resource') as (IXlsxDocument | IPdfDocument)[])
                .find(template => template.mapped.find(tfield => tfield.origId === field.origId));
      document.mapped.splice(document.mapped.indexOf(field), 1);
      this.electronService.save(document);
      this.updateExportedFields();
    }
  }

  ngOnInit(): void {
    this.electronService.getTemplates();
    if (!this.electronService.isElectron) this.updateDataSource(APP_CONFIG.testData);
  }

  ngOnDestroy() {
    [...this.subs, this.snackSub, this.dialogSub].forEach(sub => !sub.closed && sub.unsubscribe());
  }

  updateExportFolder() {
    this.exportMsgs =
      this.dataSource
          .filter(template => template.export)
          .map(template => `<b>Dokument:</b> ${template.name}`);

    if (this.exportMsgs.length) {
      this.exportFolder = (new Date()).toLocaleString('de').slice(0, 16).replace(/[.\s:]/g, '').replace(/,/g, 'T') + (!!this.exportSuffix ? '-' + this.exportSuffix : '');
      this.exportMsgs.unshift(`<b>Ordner:</b> ${this.exportFolder}`);
    }
  }

  addFileTemplate() {
    this.electronService.addFileTemplate();
  }

  createDocuments() {
    this.updateExportFolder();
    this.electronService.createDocuments(this.exportFolder, this.exportedFields);
  }

  openOutputFolder() {
    this.electronService.openOutputFolder('');
  }

  changedDocument(template: IDocument) {
    this.electronService.save(template);
    this.updateExportedFields();
  }

  changedField(field: IMappedField) {
    const template = this.findTemplate(field.origId);
    this.electronService.save(template);
    this.updateExportedFields();
  }

  showConfirmDialog(document: IDocument, field: IMappedField, $event: MouseEvent) {
    $event.stopPropagation(); // dont trigger the expandable panel
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

  showFieldMappingDialog(node: IXlsxDocument | IPdfDocument | any, $event: MouseEvent) {
    $event.stopPropagation(); // dont trigger the expandable panel
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

  blurNameInput(node: IMappedField) {
    if (this.changedName) {
      this.changedName = false;
      this.changedField(node);
    }
  }

  changingName() {
    this.changedName = true;
  }

  showFieldMappingDocument(node: any, $event: MouseEvent) {
    $event.stopPropagation(); // dont trigger the expandable panel
    if (!node.previewfile) return;
    this.electronService.openFileWithExplorer(node.previewfile);
  }

  showDocument(node: IDocument, $event: MouseEvent) {
    $event.stopPropagation(); // dont trigger the expandable panel
    this.electronService.openFileWithExplorer(node.filename);
  }
}
