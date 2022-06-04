import {Component, OnDestroy, OnInit, TrackByFunction} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {EAppChannels, IDocument, IMappedField, IMappedInput, IPdfDocument, IXlsxDocument} from '../../../bridge/shared.model';
import {AppService} from '../services/app.service';
import {ElectronService} from '../services/electron.service';
import {FieldDialogComponent} from '../shared/dialogs/add-field/field-dialog.component';
import {ConfirmDialogComponent} from '../shared/dialogs/confirm/confirm-dialog.component';
import {assignDeep} from '../shared/shared.utils';
// @formatter:off
// @ts-ignore
let CTEST: TTemplateFile[] = Object.values(
  {"D:\\Projekte\\Html\\npDocumentFiller\\pdftk\\pdfs\\VPI_Betriebsfreigabe_xfa.pdf":{"id":"15491470-f2e9-4483-afbe-64bcd917f10d","name":"VPI_Betriebsfreigabe_xfa.pdf","filename":"D:\\Projekte\\Html\\npDocumentFiller\\pdftk\\pdfs\\VPI_Betriebsfreigabe_xfa.pdf","fields":[{"id":"5559160a-d4b0-4fea-86b0-f0c2237b590e","name":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[2]","disabled":true},{"id":"5aade588-e185-4523-bbb1-e250c0b7e1b4","name":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[1]","disabled":false},{"id":"450ddbdb-c116-422d-992a-292d3cd75449","name":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[0]","disabled":false},{"id":"2b2003f5-00d4-4614-b3c7-04479dc094db","name":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile5[0]_85[2]","disabled":false},{"id":"27988334-6d4c-4ce9-9a01-5fea7fcc2b64","name":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile5[0]_85[1]","disabled":false},{"id":"b08114e2-4ada-4fd9-b8b2-445c9fccc630","name":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile5[0]_85[0]","disabled":false},{"id":"8c6f634b-dabe-48b9-83c8-3deafd0bd23c","name":"Formular1[0]#subform[0]#area[1]Tabelle4[1]Zeile3[0]_85[0]","disabled":false},{"id":"98f5b675-f6e4-443b-a354-686fcd92066c","name":"Formular1[0]#subform[0]Tabelle4[7]Zeile3[0]_85[0]","disabled":false},{"id":"cbe6775e-b03d-46c9-804b-74e1d19e599a","name":"Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[1]","disabled":false},{"id":"bfedb3af-991d-42ce-9ee0-10e30e3ec500","name":"Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[2]","disabled":false},{"id":"32e323c2-bdaf-4eb2-b329-2b11a1678609","name":"Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[3]","disabled":false},{"id":"793bb468-9497-45b5-afb4-555d279db724","name":"Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[0]","disabled":false},{"id":"bb4c7e07-444e-4445-8d39-3cff9de173b9","name":"Formular1[0]#subform[0]Tabelle4[4]Zeile3[0]#subform[0]_85[1]","disabled":false},{"id":"550effa9-843e-4003-bc50-80a0059a57e9","name":"Formular1[0]#subform[0]Tabelle4[4]Zeile3[0]_85[0]","disabled":false},{"id":"18e4e06e-541a-4e77-8557-6e7a16072c24","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[0]","disabled":false},{"id":"e2a4bedf-543a-47b8-9284-5d458803b8dd","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[3]","disabled":false},{"id":"5d4e960e-e2f1-4b92-95b6-fdfdbb6f8922","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[6]","disabled":false},{"id":"a4438991-9e58-4999-8354-0c1447269178","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[1]","disabled":false},{"id":"f4500d7e-cf05-47d6-b041-f3d0e3c9f74e","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[4]","disabled":false},{"id":"4b7f2f07-b136-4972-86e8-e9eda077edfe","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[7]","disabled":false},{"id":"bbe0363f-c62c-408c-b6d8-1cb7e3101598","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[2]","disabled":false},{"id":"81daf89e-057b-4837-ad4b-9d65c96ca626","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[5]","disabled":false},{"id":"4acf203e-5b1f-4504-b5f0-5841c2bd6daf","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[8]","disabled":false},{"id":"e11560c0-1c50-4a00-9e02-b9c803784484","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile4[0]Kontrollkästchen1[1]","disabled":false},{"id":"b16e2d94-2c7c-415b-836a-aff3e1faafd1","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile4[0]Kontrollkästchen1[0]","disabled":false},{"id":"d9f8acba-3fe8-4451-93f7-b5165125dcba","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile4[0]_85[0]","disabled":false},{"id":"40d20484-aa70-4582-b68c-02179a13cac8","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[0]","disabled":false},{"id":"aea95beb-7dd9-4135-82c5-77070737c93e","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[3]","disabled":false},{"id":"dd68a49a-3f26-47b9-be24-7e95a863bb76","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[6]","disabled":false},{"id":"059d1e67-461e-424a-a180-2188c37be27c","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[1]","disabled":false},{"id":"ad4fb07e-5cde-465e-ab16-d9326fcd4dcc","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[4]","disabled":false},{"id":"2369d7c9-9828-48fb-a4bb-1b15539037c0","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[7]","disabled":false},{"id":"c9bcdfbd-8d0b-4d12-85d2-4ef4652b8d17","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[2]","disabled":false},{"id":"5e50ae02-3f5f-4d2c-bb2e-dcba4de3e7cb","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[5]","disabled":false},{"id":"520d769a-9385-449b-9b09-2fbf88c3d000","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[8]","disabled":false},{"id":"d1ff5c97-7e2d-43a7-b10c-561f6cb2fd9c","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[0]","disabled":false},{"id":"d9dfd7d9-6340-45a2-b5c9-b1d93c58f42b","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[3]","disabled":false},{"id":"5d2467f4-8e13-4a1c-a502-3b277a2f5145","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[6]","disabled":false},{"id":"f17d98bf-6665-4578-b07c-caf305131c2d","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[9]","disabled":false},{"id":"120090bf-e15f-4bfe-9764-07ad238e32c6","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[1]","disabled":false},{"id":"ed7b8562-e223-4f20-9d75-044b45f4c3c2","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[4]","disabled":false},{"id":"694b90ea-4797-4dd5-992a-ce76c49e1c4a","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[7]","disabled":false},{"id":"a5fb1a50-ac7b-4a88-8941-50e0d90f148d","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[2]","disabled":false},{"id":"6298bced-a895-4908-9ca3-2cd651eed8c0","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[5]","disabled":false},{"id":"2cc19b59-c4f2-46ae-b5f8-079eb7d3c987","name":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[8]","disabled":false},{"id":"cd140aaf-7aaa-415b-a445-52c26a65f405","name":"Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[3]","disabled":false},{"id":"90ad8a17-5726-47d2-8f68-4e4b5391402b","name":"Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[2]","disabled":false},{"id":"acb5a7c2-d69b-4d37-95c8-d6f13530c87e","name":"Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[1]","disabled":false},{"id":"e706d9e5-237d-4aa3-815e-94823eaa8f9a","name":"Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[0]","disabled":false},{"id":"198b4126-794e-4cd9-afec-2ebac395b509","name":"Formular1[0]#subform[0]Tabelle4[9]Zeile3[0]_85[0]","disabled":false},{"id":"4018cdac-389e-4170-993b-11117fd65cde","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[1]","disabled":false},{"id":"ce4755c4-9dcc-4103-b057-92c5828ef7ba","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[2]","disabled":false},{"id":"496c9b69-7f82-47a3-9178-2f77574ed67a","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[3]","disabled":false},{"id":"fc749bb6-5808-4bf5-a693-a144b44ea3bc","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[4]","disabled":false},{"id":"ec33b697-a903-4783-98d3-d394423ffabd","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[5]","disabled":false},{"id":"55b1486a-7ffa-4df3-887c-a5408a78c9a5","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[0]","disabled":false},{"id":"6ae01590-7204-4d51-b07b-c04669da00ab","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[4]","disabled":false},{"id":"f0c027f6-e284-48b1-a2ac-5121953b26cb","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[3]","disabled":false},{"id":"d82cd4a0-0b5c-4a4d-810f-88a18b64763b","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[2]","disabled":false},{"id":"3472c091-3dbe-425d-810b-fa4b02e4ab7f","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[1]","disabled":false},{"id":"b2b96d8c-584e-495f-9d31-12ab02f54680","name":"Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[0]","disabled":false},{"id":"f78d47de-dd5d-4c40-b5a8-3107a3ae1e47","name":"Formular1[0]#subform[0]Tabelle4[3]Zeile3[0]_85[1]","disabled":false},{"id":"f9772d98-7d8a-4d64-b5ed-85d803d84cd6","name":"Formular1[0]#subform[0]Tabelle4[3]Zeile3[0]_85[0]","disabled":false},{"id":"60801318-2898-441e-bc00-e21dd91fe8a1","name":"Formular1[0]#subform[0]Tabelle1[2]Zeile3[0]#subform[0]#area[0]_85[0]","disabled":false},{"id":"cd6a1534-ce96-4e53-8753-16493a3084ac","name":"Formular1[0]#subform[0]Tabelle1[2]Zeile3[0]_85[2]","disabled":false},{"id":"04f0e056-73c5-4899-b493-562626ad5e2c","name":"Formular1[0]#subform[0]Tabelle1[2]Zeile3[0]_85[1]","disabled":false},{"id":"21cb43fd-c47e-4027-aad8-77279a868c6d","name":"Formular1[0]#subform[0]Tabelle1[2]Zeile2[0]_85[2]","disabled":false},{"id":"a9e74567-1bb4-4b5a-a3a8-d3cfb3ac479e","name":"Formular1[0]#subform[0]Tabelle1[2]Zeile2[0]_85[1]","disabled":false},{"id":"c28d5ef8-9c24-43e2-9024-b652021abaf0","name":"Formular1[0]#subform[0]Tabelle1[2]Zeile2[0]_85[0]","disabled":false},{"id":"69d4d295-fe18-4817-95a5-56dd44716c6c","name":"Formular1[0]#subform[0]#area[2]Tabelle2[0]Zeile1[0]_85[2]","disabled":false},{"id":"44cdcca9-a78e-431d-8a23-6587d83c78f2","name":"Formular1[0]#subform[0]#area[2]Tabelle2[0]Zeile1[0]_85[1]","disabled":false},{"id":"d8237b3a-ff5b-41a3-ba2f-32c671bab54d","name":"Formular1[0]#subform[0]#area[2]Tabelle2[0]Zeile1[0]_85[0]","disabled":false},{"id":"a9ca67d1-adf6-4e8b-b0ae-9c887ed94960","name":"Formular1[0]#subform[0]Tabelle4[12]Zeile3[0]_85[0]","disabled":false},{"id":"1fd18d40-f6a2-478f-9ee6-bd2bc3aaf527","name":"Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[3]","disabled":false},{"id":"48bcae35-b6d9-4cce-9b7b-0b0a86d32ee8","name":"Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[2]","disabled":false},{"id":"f1d8c23b-dd93-461c-9c99-1dc6d00ed112","name":"Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[1]","disabled":false},{"id":"255e6a00-2680-4721-a7b8-dc08163d6af9","name":"Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[0]","disabled":false},{"id":"3977268a-ab99-4c85-a73b-6e08b49e17f0","name":"Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[3]","disabled":false},{"id":"d9d48a7d-2c8d-48e6-8d92-5c81b3d9c233","name":"Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[2]","disabled":false},{"id":"c6e4ceca-dd13-4b1a-adcb-ab4d932696c6","name":"Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[1]","disabled":false},{"id":"563cc6c3-458b-44c1-8d30-0ffc3f1b109f","name":"Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[0]","disabled":false},{"id":"bd2020e8-c7aa-447a-85aa-16268af7de76","name":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[3]","disabled":false},{"id":"e4ed4f73-6028-46cb-9fbd-a84985b2bdad","name":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[2]","disabled":false},{"id":"fcd5a8d6-379d-4314-840d-389a92a8e7bf","name":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[1]","disabled":false},{"id":"41129731-036c-47fa-8039-8b592ccbba39","name":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[0]","disabled":false},{"id":"0537665a-e5dd-4148-9113-f0995ed0003d","name":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[2]_85[2]","disabled":false},{"id":"f8bd6b82-ded7-46d4-af04-ad91b3243be7","name":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[2]_85[1]","disabled":false},{"id":"0c176691-8ce9-4fd2-a720-e325025cf660","name":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[2]_85[0]","disabled":false},{"id":"e52d85c8-612c-40ac-8634-2542b639fbbc","name":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[1]_85[1]","disabled":false},{"id":"5ba43831-99e5-4c0a-9ddc-a2a7a6e9f2b0","name":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[1]_85[0]","disabled":false},{"id":"0337e9b1-0cfe-452f-9faf-aa93e4d66564","name":"Formular1[0]#subform[0]Tabelle4[2]Zeile3[0]_85[2]","disabled":false},{"id":"4831e1f8-e2cc-40fb-a217-1a05e1566001","name":"Formular1[0]#subform[0]Tabelle4[2]Zeile3[0]_85[1]","disabled":false},{"id":"cace30b4-3be0-4d5f-a60a-0c24ad311ef3","name":"Formular1[0]#subform[0]Tabelle4[2]Zeile3[0]_85[0]","disabled":false},{"id":"b6bdfcab-eaa8-415e-bf08-721b617ed481","name":"Formular1[0]#subform[0]Tabelle1[1]Zeile3[0]#subform[0]#area[0]_85[0]","disabled":false},{"id":"ad69cfd6-2fbe-4d6c-a45e-612d74e0203e","name":"Formular1[0]#subform[0]Tabelle1[1]Zeile3[0]_85[2]","disabled":false},{"id":"013a8d1f-c623-4665-a589-dc9996f21eb1","name":"Formular1[0]#subform[0]Tabelle1[1]Zeile3[0]_85[1]","disabled":false},{"id":"4ba509c1-9be0-438b-af77-e0a7e7d9bcae","name":"Formular1[0]#subform[0]Tabelle1[1]Zeile2[0]_85[2]","disabled":false},{"id":"d575a999-968b-4bfd-9dc0-9117fff7f81d","name":"Formular1[0]#subform[0]Tabelle1[1]Zeile2[0]_85[1]","disabled":false},{"id":"d5e69888-f9d0-4d13-951a-19f2d198f087","name":"Formular1[0]#subform[0]Tabelle1[1]Zeile2[0]_85[0]","disabled":false}],"mapped":[{"origId":"5559160a-d4b0-4fea-86b0-f0c2237b590e","clearName":"45","export":false,"mappedName":"Feld 0"}],"export":true,"type":"pdf","mtime":1653764484395,"previewfile":"D:\\Projekte\\Html\\npDocumentFiller\\data\\cache\\VPI_Betriebsfreigabe_xfa-preview-data.pdf"},"D:\\Projekte\\Html\\npDocumentFiller\\pdftk\\pdfs\\Sample100.xlsx":{"id":"4d585956-35ef-48c7-8283-6daba87fe913","name":"Sample100.xlsx","filename":"D:\\Projekte\\Html\\npDocumentFiller\\pdftk\\pdfs\\Sample100.xlsx","sheets":[{"id":"bedc7935-4b41-4b3b-a543-3fb9eb6ee881","name":"Sheet1","disabled":false},{"id":"52823d89-721a-4522-89e0-47e38f20289f","name":"Sheet2","disabled":false},{"id":"079f8849-8867-48eb-9e15-b30f5c4e7748","name":"HaloSheet","disabled":false}],"mapped":[{"origId":"52823d89-721a-4522-89e0-47e38f20289f","clearName":"dfg","export":true,"mappedName":"$Sheet2.XY345"}],"export":true,"type":"xlsx","mtime":1654096456409.502}}
);
// @formatter:on

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

  constructor(
    private readonly electronService: ElectronService,
    private readonly snackBarService: MatSnackBar,
    private readonly appService: AppService,
    private readonly dialog: MatDialog
  ) {
    this.subs.push(
      electronService.update$.subscribe((data) => {
        this.hideModal();
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
        this.showModal();
      }),
      electronService.error$.subscribe((err) => {
        this.hideModal();
        console.log(err);
      })
    );
  }

  private showModal() {
    this.appService.modal$.next(this.electronService.isElectron);
  }

  private hideModal() {
    this.appService.modal$.next(false);
  }

  private updateDataSource(newData: IDocument[]) {
    console.log('update data', (newData || []).map(doc => ((doc as any).mapped || []).map(field => field.export + ' export ' + field.id)));
    this.dataSource = newData;
    if (this.dataSource?.length) {
      // assignDeep(this.dataSource, newData);
      this.updateExportedFields();
    } else {
      this.dataSource = newData;
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
    if (!this.electronService.isElectron) this.updateDataSource(CTEST);
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


  private changedName = false;

  blurNameInput(node: IMappedField) {
    if (this.changedName) {
      this.changedName = false;
      this.changedField(node);
    }
  }

  changingName() {
    this.changedName = true;
  }

  showFieldMappingDocument(node: IPdfDocument|any) {
    if(!node.previewfile) return;
    this.electronService.openFileWithExplorer(node.previewfile);
  }

  showDocument(node: IDocument) {
    this.electronService.openFileWithExplorer(node.filename);
  }
}
