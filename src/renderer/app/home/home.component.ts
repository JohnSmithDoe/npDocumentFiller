import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, OnDestroy, OnInit, TrackByFunction, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTree, MatTreeNestedDataSource} from '@angular/material/tree';
import {Subscription} from 'rxjs';
import {ITemplateDocument, ITemplateField, ITemplateInput} from '../../../bridge/shared.model';
import {ElectronService} from '../services/electron.service';
import {FieldDialogComponent} from '../shared/dialogs/add-field/field-dialog.component';
import {ConfirmDialogComponent} from '../shared/dialogs/confirm/confirm-dialog.component';
import {assignDeep} from '../shared/shared.utils';
// @formatter:off
// @ts-ignore
let CTEST: ITemplateDocument[] = Object.values({"D:\\Projekte\\Html\\vpi-assistant\\pdftk\\pdfs\\VPI_Betriebsfreigabe_xfa.pdf":{"mapped":[{"value":"Feld 0","intern":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[2]","name":"Werkstatt-Kuzzeichen","export":false,"id":"e989e16b-7c9c-46a9-8934-9c615d55b719","type":"fdf"},{"value":"Feld 11","intern":"Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[0]","name":"Auftragsnummer","export":true,"id":"0cf9f79c-b6fc-4f0e-94e5-42860e747760","type":"fdf"}],"id":"44153976-1e80-4a49-91e8-af639f9abd83","name":"VPI_Betriebsfreigabe_xfa.pdf","filename":"D:\\Projekte\\Html\\vpi-assistant\\pdftk\\pdfs\\VPI_Betriebsfreigabe_xfa.pdf","fields":[{"value":"Feld 0","intern":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[2]","name":"Feld 0","export":false,"id":"e989e16b-7c9c-46a9-8934-9c615d55b719","type":"fdf"},{"value":"Feld 1","intern":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[1]","name":"Feld 1","export":false,"id":"269ad98c-a489-48c4-8c01-c979302e206a","type":"fdf"},{"value":"Feld 2","intern":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile3[0]_85[0]","name":"Feld 2","export":false,"id":"f2073f6f-131c-4394-81d6-75746cbbfbcd","type":"fdf"},{"value":"Feld 3","intern":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile5[0]_85[2]","name":"Feld 3","export":false,"id":"88fe040e-b99b-4f63-babf-574597bedc5a","type":"fdf"},{"value":"Feld 4","intern":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile5[0]_85[1]","name":"Feld 4","export":false,"id":"a620322b-8049-4097-89cb-4051908e36fa","type":"fdf"},{"value":"Feld 5","intern":"Formular1[0]#subform[0]#area[1]Tabelle4[0]Zeile5[0]_85[0]","name":"Feld 5","export":false,"id":"0cbf4cbf-64ab-4e7e-9064-a3339a2b5efa","type":"fdf"},{"value":"Feld 6","intern":"Formular1[0]#subform[0]#area[1]Tabelle4[1]Zeile3[0]_85[0]","name":"Feld 6","export":false,"id":"f187e1eb-3660-4e3b-bd8f-98bbe8bb8cc2","type":"fdf"},{"value":"Feld 7","intern":"Formular1[0]#subform[0]Tabelle4[7]Zeile3[0]_85[0]","name":"Feld 7","export":false,"id":"43a97d53-b07c-45aa-a57f-a7c9a866377d","type":"fdf"},{"value":"Feld 8","intern":"Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[1]","name":"Feld 8","export":false,"id":"59aca4fe-c64e-48ce-9e31-90fedc204403","type":"fdf"},{"value":"Feld 9","intern":"Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[2]","name":"Feld 9","export":false,"id":"232ab25d-ed75-40ff-8fad-c6591bed1f49","type":"fdf"},{"value":"Feld 10","intern":"Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[3]","name":"Feld 10","export":false,"id":"197e3ad2-8b7a-4b87-b3f3-c93cc349d58e","type":"fdf"},{"value":"Feld 11","intern":"Formular1[0]#subform[0]Tabelle4[7]Zeile2[1]Kontrollkästchen1[0]","name":"Feld 11","export":false,"id":"0cf9f79c-b6fc-4f0e-94e5-42860e747760","type":"fdf"},{"value":"Feld 12","intern":"Formular1[0]#subform[0]Tabelle4[4]Zeile3[0]#subform[0]_85[1]","name":"Feld 12","export":false,"id":"7a88cb2c-69f8-4c35-958b-8d2f00614a4f","type":"fdf"},{"value":"Feld 13","intern":"Formular1[0]#subform[0]Tabelle4[4]Zeile3[0]_85[0]","name":"Feld 13","export":false,"id":"a6148869-7960-41d3-a9f4-c15aec3d8baa","type":"fdf"},{"value":"Feld 14","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[0]","name":"Feld 14","export":false,"id":"8cd8b1e3-b295-4ab7-aa6b-b8f2757641a6","type":"fdf"},{"value":"Feld 15","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[3]","name":"Feld 15","export":false,"id":"601cfb0d-041d-4b74-afa7-acb9ff47baac","type":"fdf"},{"value":"Feld 16","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[6]","name":"Feld 16","export":false,"id":"8480b8d7-b1b9-40fe-812f-351abb796a6a","type":"fdf"},{"value":"Feld 17","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[1]","name":"Feld 17","export":false,"id":"dab8fb04-91fe-4532-b7c6-900d885c170f","type":"fdf"},{"value":"Feld 18","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[4]","name":"Feld 18","export":false,"id":"d651b64a-e7ff-4dac-a8d2-2911b3f5f554","type":"fdf"},{"value":"Feld 19","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[7]","name":"Feld 19","export":false,"id":"861751bb-20c9-44d6-8ae1-4acf68b0d1a0","type":"fdf"},{"value":"Feld 20","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[2]","name":"Feld 20","export":false,"id":"59c403a0-234b-4f4b-b9b6-940b1f0ab174","type":"fdf"},{"value":"Feld 21","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[5]","name":"Feld 21","export":false,"id":"1948d48f-1316-473f-81bb-23358818656e","type":"fdf"},{"value":"Feld 22","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile3[0]_85[8]","name":"Feld 22","export":false,"id":"c4988e8a-e7db-477d-b8bd-7e8a7597db7f","type":"fdf"},{"value":"Feld 23","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile4[0]Kontrollkästchen1[1]","name":"Feld 23","export":false,"id":"3714acc9-bdd2-40a5-9d7a-7576e410867c","type":"fdf"},{"value":"Feld 24","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile4[0]Kontrollkästchen1[0]","name":"Feld 24","export":false,"id":"2f9fee2c-5a9d-477c-b0e3-35ad6e97a8c2","type":"fdf"},{"value":"Feld 25","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile4[0]_85[0]","name":"Feld 25","export":false,"id":"30571f58-1221-4d3c-a854-52a40fa283f7","type":"fdf"},{"value":"Feld 26","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[0]","name":"Feld 26","export":false,"id":"2849db00-1733-4695-a340-6daa0b85cc49","type":"fdf"},{"value":"Feld 27","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[3]","name":"Feld 27","export":false,"id":"ed692214-833f-4506-9991-6c3c02e58595","type":"fdf"},{"value":"Feld 28","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[6]","name":"Feld 28","export":false,"id":"691cd37e-444b-400d-a085-72062ab5c137","type":"fdf"},{"value":"Feld 29","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[1]","name":"Feld 29","export":false,"id":"42d24639-bed0-48b8-b9e2-f4af78b99099","type":"fdf"},{"value":"Feld 30","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[4]","name":"Feld 30","export":false,"id":"b6c74f4c-b770-425f-b08b-bd11ffc22058","type":"fdf"},{"value":"Feld 31","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[7]","name":"Feld 31","export":false,"id":"dc95ccf1-693e-4002-bbaf-fbe25bab65bf","type":"fdf"},{"value":"Feld 32","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[2]","name":"Feld 32","export":false,"id":"da037cad-58b8-4db7-b6c0-cf72a6d94f10","type":"fdf"},{"value":"Feld 33","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[5]","name":"Feld 33","export":false,"id":"3d969e48-6aab-4862-bc84-0735a1677deb","type":"fdf"},{"value":"Feld 34","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile1[1]_85[8]","name":"Feld 34","export":false,"id":"9d9b10e2-6b1e-45eb-a2f9-7a5530a80e79","type":"fdf"},{"value":"Feld 35","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[0]","name":"Feld 35","export":false,"id":"0ea4802b-0d82-48d7-8b1e-68b121f5c031","type":"fdf"},{"value":"Feld 36","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[3]","name":"Feld 36","export":false,"id":"99419060-b245-458a-855b-53b21b530113","type":"fdf"},{"value":"Feld 37","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[6]","name":"Feld 37","export":false,"id":"812347a4-b7b1-46d6-83d1-646c68f755c9","type":"fdf"},{"value":"Feld 38","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[9]","name":"Feld 38","export":false,"id":"0a6462c1-78b4-40ab-b297-9dae1e0f62af","type":"fdf"},{"value":"Feld 39","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[1]","name":"Feld 39","export":false,"id":"53790332-ea2b-4179-8fb8-8446c030827f","type":"fdf"},{"value":"Feld 40","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[4]","name":"Feld 40","export":false,"id":"6cb7163d-d98c-4005-a1a7-104707b2beab","type":"fdf"},{"value":"Feld 41","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[7]","name":"Feld 41","export":false,"id":"db125aeb-3d01-4579-a67a-717d7af74c39","type":"fdf"},{"value":"Feld 42","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[2]","name":"Feld 42","export":false,"id":"43b69ab2-5b60-48e6-84f0-2290544cf5ef","type":"fdf"},{"value":"Feld 43","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[5]","name":"Feld 43","export":false,"id":"add12949-a43b-447b-a9fc-96185fa51a10","type":"fdf"},{"value":"Feld 44","intern":"Formular1[0]#subform[0]Tabelle1[0]Zeile2[0]_85[8]","name":"Feld 44","export":false,"id":"1e69121e-8c24-4d15-a52e-e6c6e6b11411","type":"fdf"},{"value":"Feld 45","intern":"Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[3]","name":"Feld 45","export":false,"id":"3be3b256-0c12-415f-a984-213afab8974f","type":"fdf"},{"value":"Feld 46","intern":"Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[2]","name":"Feld 46","export":false,"id":"07946e92-0d77-496b-a322-2e410d6a6c8f","type":"fdf"},{"value":"Feld 47","intern":"Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[1]","name":"Feld 47","export":false,"id":"9f83fd13-50c7-4b7e-a4d4-b632215acce7","type":"fdf"},{"value":"Feld 48","intern":"Formular1[0]#subform[0]Tabelle4[11]Zeile3[0]_85[0]","name":"Feld 48","export":false,"id":"af3c7307-0794-4cc8-bb75-5cd6501efce5","type":"fdf"},{"value":"Feld 49","intern":"Formular1[0]#subform[0]Tabelle4[9]Zeile3[0]_85[0]","name":"Feld 49","export":false,"id":"1bf33f80-9043-4420-b82d-694531ef27a1","type":"fdf"},{"value":"Feld 50","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[1]","name":"Feld 50","export":false,"id":"60f94282-604c-4995-876d-db93e16df895","type":"fdf"},{"value":"Feld 51","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[2]","name":"Feld 51","export":false,"id":"2d863a31-9655-44f5-ae66-3535e4f82f18","type":"fdf"},{"value":"Feld 52","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[3]","name":"Feld 52","export":false,"id":"e962c195-5a78-4e66-9130-d7e77ad824f6","type":"fdf"},{"value":"Feld 53","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[4]","name":"Feld 53","export":false,"id":"416dc899-5ecb-44e5-bc86-16d5d7b2e67c","type":"fdf"},{"value":"Feld 54","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[5]","name":"Feld 54","export":false,"id":"5d932cc5-3844-4989-9a79-bde80ee8ffb4","type":"fdf"},{"value":"Feld 55","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]Kontrollkästchen1[0]","name":"Feld 55","export":false,"id":"d4f41e1c-25de-4092-bf0e-fb60c987dc0a","type":"fdf"},{"value":"Feld 56","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[4]","name":"Feld 56","export":false,"id":"f445034b-3b8d-42f1-8346-650dbf576c93","type":"fdf"},{"value":"Feld 57","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[3]","name":"Feld 57","export":false,"id":"e8024e8f-5a45-46fe-bcea-b21e850f5606","type":"fdf"},{"value":"Feld 58","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[2]","name":"Feld 58","export":false,"id":"961c1842-bb7c-4af7-8ec8-e5ac0ad9599b","type":"fdf"},{"value":"Feld 59","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[1]","name":"Feld 59","export":false,"id":"fd3a05f7-934a-493d-91d8-0b5a138f761e","type":"fdf"},{"value":"Feld 60","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile5[0]_85[0]","name":"Feld 60","export":false,"id":"5bd4f285-a4d6-4793-b405-bee778267721","type":"fdf"},{"value":"Feld 61","intern":"Formular1[0]#subform[0]Tabelle4[3]Zeile3[0]_85[1]","name":"Feld 61","export":false,"id":"f5a6e327-0bd1-4e5b-86f8-2c6e7ff3b222","type":"fdf"},{"value":"Feld 62","intern":"Formular1[0]#subform[0]Tabelle4[3]Zeile3[0]_85[0]","name":"Feld 62","export":false,"id":"f2a8f94f-3cbd-4b2d-8379-e7a17057cffa","type":"fdf"},{"value":"Feld 63","intern":"Formular1[0]#subform[0]Tabelle1[2]Zeile3[0]#subform[0]#area[0]_85[0]","name":"Feld 63","export":false,"id":"7c59a981-7a96-4769-b152-f994254bfd71","type":"fdf"},{"value":"Feld 64","intern":"Formular1[0]#subform[0]Tabelle1[2]Zeile3[0]_85[2]","name":"Feld 64","export":false,"id":"a7f8b6e6-5cf8-43c9-ad7e-b180215d5338","type":"fdf"},{"value":"Feld 65","intern":"Formular1[0]#subform[0]Tabelle1[2]Zeile3[0]_85[1]","name":"Feld 65","export":false,"id":"5a881c97-53cb-4bb1-91b6-9c656c09253a","type":"fdf"},{"value":"Feld 66","intern":"Formular1[0]#subform[0]Tabelle1[2]Zeile2[0]_85[2]","name":"Feld 66","export":false,"id":"91b7e8d1-70c7-49b9-a6bc-0260197c9f14","type":"fdf"},{"value":"Feld 67","intern":"Formular1[0]#subform[0]Tabelle1[2]Zeile2[0]_85[1]","name":"Feld 67","export":false,"id":"036da863-afa8-4303-ab94-c26ddb899d20","type":"fdf"},{"value":"Feld 68","intern":"Formular1[0]#subform[0]Tabelle1[2]Zeile2[0]_85[0]","name":"Feld 68","export":false,"id":"c8aea378-d59a-4244-9b62-246b34b44d5e","type":"fdf"},{"value":"Feld 69","intern":"Formular1[0]#subform[0]#area[2]Tabelle2[0]Zeile1[0]_85[2]","name":"Feld 69","export":false,"id":"9490079b-fb45-4833-9bb1-509e1f628434","type":"fdf"},{"value":"Feld 70","intern":"Formular1[0]#subform[0]#area[2]Tabelle2[0]Zeile1[0]_85[1]","name":"Feld 70","export":false,"id":"e0b2e888-074b-465d-b9f1-79f2c9f77fc2","type":"fdf"},{"value":"Feld 71","intern":"Formular1[0]#subform[0]#area[2]Tabelle2[0]Zeile1[0]_85[0]","name":"Feld 71","export":false,"id":"41494768-2b84-4d92-b6a1-995e6f09992e","type":"fdf"},{"value":"Feld 72","intern":"Formular1[0]#subform[0]Tabelle4[12]Zeile3[0]_85[0]","name":"Feld 72","export":false,"id":"35f286b7-f1ab-48e9-a322-5317d2c3cb76","type":"fdf"},{"value":"Feld 73","intern":"Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[3]","name":"Feld 73","export":false,"id":"3df4871b-fccf-4699-8121-5f3bc1e99748","type":"fdf"},{"value":"Feld 74","intern":"Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[2]","name":"Feld 74","export":false,"id":"5bb6be5c-1017-4ba0-b67a-19c3e261a238","type":"fdf"},{"value":"Feld 75","intern":"Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[1]","name":"Feld 75","export":false,"id":"2b4d8df8-931e-4075-8aa0-999c13d23264","type":"fdf"},{"value":"Feld 76","intern":"Formular1[0]#subform[0]Tabelle2[1]Zeile1[0]_85[0]","name":"Feld 76","export":false,"id":"ac3ac4c0-11d1-4cfc-b22d-a0cdbeca919b","type":"fdf"},{"value":"Feld 77","intern":"Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[3]","name":"Feld 77","export":false,"id":"d6b6c854-5fd7-4c13-bb1e-e55a183f76d9","type":"fdf"},{"value":"Feld 78","intern":"Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[2]","name":"Feld 78","export":false,"id":"53ef58db-99c8-4aae-a8d1-0ef81d197048","type":"fdf"},{"value":"Feld 79","intern":"Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[1]","name":"Feld 79","export":false,"id":"6a0685b0-cf5f-4880-ae86-00b9e40c2cca","type":"fdf"},{"value":"Feld 80","intern":"Formular1[0]#subform[0]Tabelle4[8]Zeile3[0]_85[0]","name":"Feld 80","export":false,"id":"976b023b-2e21-40ed-b220-14cfed87a50e","type":"fdf"},{"value":"Feld 81","intern":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[3]","name":"Feld 81","export":false,"id":"29a3f974-847e-41dd-bec6-83f6cb81ab54","type":"fdf"},{"value":"Feld 82","intern":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[2]","name":"Feld 82","export":false,"id":"434a2a00-5495-4943-adad-89a2de3a4ba0","type":"fdf"},{"value":"Feld 83","intern":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[1]","name":"Feld 83","export":false,"id":"9c8ee8c6-6f71-487a-8a5c-c98f8464f73d","type":"fdf"},{"value":"Feld 84","intern":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[0]_85[0]","name":"Feld 84","export":false,"id":"5d7a8536-89fe-451b-867e-12830bccee6d","type":"fdf"},{"value":"Feld 85","intern":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[2]_85[2]","name":"Feld 85","export":false,"id":"491fbea1-72a5-4dbc-befd-9189fde753be","type":"fdf"},{"value":"Feld 86","intern":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[2]_85[1]","name":"Feld 86","export":false,"id":"5a07b5b6-984d-4265-bd4c-c7c11f77f48c","type":"fdf"},{"value":"Feld 87","intern":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[2]_85[0]","name":"Feld 87","export":false,"id":"48af2b53-d8d7-4192-82ba-e5ef49e1fe1f","type":"fdf"},{"value":"Feld 88","intern":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[1]_85[1]","name":"Feld 88","export":false,"id":"e62a36bb-164c-4fea-9ed5-6b36f059761d","type":"fdf"},{"value":"Feld 89","intern":"Formular1[0]#subform[0]Tabelle4[5]Zeile3[1]_85[0]","name":"Feld 89","export":false,"id":"c4c76576-a332-45ac-b575-bb2469673823","type":"fdf"},{"value":"Feld 90","intern":"Formular1[0]#subform[0]Tabelle4[2]Zeile3[0]_85[2]","name":"Feld 90","export":false,"id":"4b4ca807-2ab2-4844-bcda-d4ef75bd3a6e","type":"fdf"},{"value":"Feld 91","intern":"Formular1[0]#subform[0]Tabelle4[2]Zeile3[0]_85[1]","name":"Feld 91","export":false,"id":"5a120344-ec93-4e90-9fbc-a2fb1a02c06d","type":"fdf"},{"value":"Feld 92","intern":"Formular1[0]#subform[0]Tabelle4[2]Zeile3[0]_85[0]","name":"Feld 92","export":false,"id":"62ae2755-c573-4efc-9dc3-15598e340262","type":"fdf"},{"value":"Feld 93","intern":"Formular1[0]#subform[0]Tabelle1[1]Zeile3[0]#subform[0]#area[0]_85[0]","name":"Feld 93","export":false,"id":"a9c928d5-1cb0-41cc-96c8-78ee07244562","type":"fdf"},{"value":"Feld 94","intern":"Formular1[0]#subform[0]Tabelle1[1]Zeile3[0]_85[2]","name":"Feld 94","export":false,"id":"2d580246-1e4a-48eb-832c-35065585cfc8","type":"fdf"},{"value":"Feld 95","intern":"Formular1[0]#subform[0]Tabelle1[1]Zeile3[0]_85[1]","name":"Feld 95","export":false,"id":"7a06660c-8c9f-4b86-bd56-0ad2b6d2cb2a","type":"fdf"},{"value":"Feld 96","intern":"Formular1[0]#subform[0]Tabelle1[1]Zeile2[0]_85[2]","name":"Feld 96","export":false,"id":"ab32ef55-5010-4cd5-8053-e6ada09efd9e","type":"fdf"},{"value":"Feld 97","intern":"Formular1[0]#subform[0]Tabelle1[1]Zeile2[0]_85[1]","name":"Feld 97","export":false,"id":"d3d59b32-4942-4e2d-83dd-482ed2abff4f","type":"fdf"},{"value":"Feld 98","intern":"Formular1[0]#subform[0]Tabelle1[1]Zeile2[0]_85[0]","name":"Feld 98","export":false,"id":"53c1afaf-1a7e-41c8-b61c-fb2263e24357","type":"fdf"}],"export":true,"type":"pdf","mtime":1635340338000,"previewfile":"D:\\Projekte\\Html\\vpi-assistant\\data\\cache\\VPI_Betriebsfreigabe_xfa-preview-data.pdf"},"D:\\Projekte\\Html\\vpi-assistant\\pdftk\\pdfs\\VPI-EMG 02 Formular Anhang 20_Messblatt Drehgestell mit Schraubfeder.pdf":{"mapped":[{"value":"Feld 0","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]_072[0]","name":"Auftragsnummer","export":true,"id":"0551a82e-dd35-49d1-9593-744f503da1ec","type":"fdf"}],"id":"bf67cf79-c7f4-4541-b89c-ac9ba239f97e","name":"VPI-EMG 02 Formular Anhang 20_Messblatt Drehgestell mit Schraubfeder.pdf","filename":"D:\\Projekte\\Html\\vpi-assistant\\pdftk\\pdfs\\VPI-EMG 02 Formular Anhang 20_Messblatt Drehgestell mit Schraubfeder.pdf","fields":[{"value":"Feld 0","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]_072[0]","name":"Feld 0","export":false,"id":"0551a82e-dd35-49d1-9593-744f503da1ec","type":"fdf"},{"value":"Feld 1","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]_008[0]","name":"Feld 1","export":false,"id":"375693dc-a5a3-4079-bf47-09acba23f3fa","type":"fdf"},{"value":"Feld 2","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[0]_071[0]","name":"Feld 2","export":false,"id":"234001b6-54b1-4e61-a3e2-7bdb8b418ee5","type":"fdf"},{"value":"Feld 3","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[2]_011[0]","name":"Feld 3","export":false,"id":"3a067ff4-c6f1-4e52-b1bd-6c9c8ebf270a","type":"fdf"},{"value":"Feld 4","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[2]_073[0]","name":"Feld 4","export":false,"id":"774b2bf1-e3dc-4b3f-952d-8772064f945c","type":"fdf"},{"value":"Feld 5","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[2]_009[0]","name":"Feld 5","export":false,"id":"5c3876f5-852c-413f-9e21-d4d1de4de301","type":"fdf"},{"value":"Feld 6","intern":"Formular1[0]#subform[0]Tabelle4[6]Zeile3[2]_010[0]","name":"Feld 6","export":false,"id":"960f14d0-81b2-4d9b-8b4a-8bc0528b7d0f","type":"fdf"},{"value":"Feld 7","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile3[0]_014[0]","name":"Feld 7","export":false,"id":"d042c15d-3d7b-4a70-be3c-2f0576ac974b","type":"fdf"},{"value":"Feld 8","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile3[0]_015[0]","name":"Feld 8","export":false,"id":"b76b3ea4-de1a-404f-86ab-054831d88ce6","type":"fdf"},{"value":"Feld 9","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile3[0]_012[0]","name":"Feld 9","export":false,"id":"9d9b6ac0-3885-4bd5-a555-82c8cd7720d0","type":"fdf"},{"value":"Feld 10","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile3[0]_013[0]","name":"Feld 10","export":false,"id":"cb8143ba-6fe3-4d67-9692-c70ecc20485d","type":"fdf"},{"value":"Feld 11","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile4[0]_018[0]","name":"Feld 11","export":false,"id":"ca11050a-3348-4465-9d47-ffa052d625ee","type":"fdf"},{"value":"Feld 12","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile4[0]_019[0]","name":"Feld 12","export":false,"id":"d86b672e-f494-4adc-b78f-6ca8648fecdc","type":"fdf"},{"value":"Feld 13","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile4[0]_016[0]","name":"Feld 13","export":false,"id":"de0eb20a-ee26-4132-84a9-53cc0e0c8de3","type":"fdf"},{"value":"Feld 14","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile4[0]_017[0]","name":"Feld 14","export":false,"id":"f493e64b-542c-4cd0-b5eb-d1374ce8901c","type":"fdf"},{"value":"Feld 15","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile5[0]_023[0]","name":"Feld 15","export":false,"id":"c09d7df5-df3b-4059-af4c-2d404e88ec67","type":"fdf"},{"value":"Feld 16","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile5[0]_020[0]","name":"Feld 16","export":false,"id":"5fbb1767-7bfa-4c8f-a1aa-cd4e9a250c19","type":"fdf"},{"value":"Feld 17","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile5[0]_021[0]","name":"Feld 17","export":false,"id":"f54a35fa-07d4-4270-a32c-e6cab855ff2b","type":"fdf"},{"value":"Feld 18","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile5[0]_022[0]","name":"Feld 18","export":false,"id":"b4aacce0-7cdc-4846-bc05-d591de6144ea","type":"fdf"},{"value":"Feld 19","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile6[0]_026[0]","name":"Feld 19","export":false,"id":"6058d62d-3240-474b-b270-b4837b66a78c","type":"fdf"},{"value":"Feld 20","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile6[0]_027[0]","name":"Feld 20","export":false,"id":"1a9ee9c7-27ce-4d2c-931b-45c4e6f26021","type":"fdf"},{"value":"Feld 21","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile6[0]_024[0]","name":"Feld 21","export":false,"id":"9520d7ae-6811-4607-9929-811cc4c8aa33","type":"fdf"},{"value":"Feld 22","intern":"Formular1[0]#subform[0]#area[0]#area[1]Tabelle4[0]Zeile6[0]_025[0]","name":"Feld 22","export":false,"id":"dcbffa05-9a73-48d4-9467-4faade7c5941","type":"fdf"},{"value":"Feld 23","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile3[0]_031[0]","name":"Feld 23","export":false,"id":"1b873434-eb06-4fa8-8d2a-d965eaa206ce","type":"fdf"},{"value":"Feld 24","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile3[0]_032[0]","name":"Feld 24","export":false,"id":"551c46a3-e24f-4db8-a3ba-161d0da73538","type":"fdf"},{"value":"Feld 25","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile3[0]_033[0]","name":"Feld 25","export":false,"id":"a3ecc4a5-3e35-4f62-b81b-f39f9f4a881f","type":"fdf"},{"value":"Feld 26","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile3[0]_030[0]","name":"Feld 26","export":false,"id":"6f25fd15-8c54-47e0-aab5-c86d8c8da1c9","type":"fdf"},{"value":"Feld 27","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile4[0]_035[0]","name":"Feld 27","export":false,"id":"df6598c9-68e9-470c-8b9e-c1ac6406cb64","type":"fdf"},{"value":"Feld 28","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile4[0]_036[0]","name":"Feld 28","export":false,"id":"ed8b6e16-b14f-4a71-a2de-d86b179cbf73","type":"fdf"},{"value":"Feld 29","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile4[0]_037[0]","name":"Feld 29","export":false,"id":"4dcd6e21-c22b-4c22-82a4-04457d534cb2","type":"fdf"},{"value":"Feld 30","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile4[0]_034[0]","name":"Feld 30","export":false,"id":"090f84bb-0044-40cb-9a97-97e2d64e73bc","type":"fdf"},{"value":"Feld 31","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile5[0]_038[0]","name":"Feld 31","export":false,"id":"e3e631f1-dead-4bd1-a8e1-3b57f5307621","type":"fdf"},{"value":"Feld 32","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile5[0]_039[0]","name":"Feld 32","export":false,"id":"d1b96cca-86ed-4e40-a7e2-7441b093a883","type":"fdf"},{"value":"Feld 33","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile5[0]_040[0]","name":"Feld 33","export":false,"id":"f65e9f3e-98ca-4c9e-8500-48fde84095e7","type":"fdf"},{"value":"Feld 34","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile5[0]_041[0]","name":"Feld 34","export":false,"id":"7dbc4211-1494-4ea3-937a-ec85162c3b48","type":"fdf"},{"value":"Feld 35","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile6[0]_043[0]","name":"Feld 35","export":false,"id":"e4c70ec7-3177-471f-b4de-6d8ba9eab915","type":"fdf"},{"value":"Feld 36","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile6[0]_044[0]","name":"Feld 36","export":false,"id":"a2067880-9462-42ae-877a-d3f24512c49a","type":"fdf"},{"value":"Feld 37","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile6[0]_045[0]","name":"Feld 37","export":false,"id":"da83aff4-76e2-47d6-9b89-d974cb8e549b","type":"fdf"},{"value":"Feld 38","intern":"Formular1[0]#subform[0]Tabelle4[1]Zeile6[0]_042[0]","name":"Feld 38","export":false,"id":"6cd29d22-fab1-45ff-a650-390048300f9a","type":"fdf"},{"value":"Feld 39","intern":"Formular1[0]#subform[0]Tabelle3[0]Zeile2[1]_054[0]","name":"Feld 39","export":false,"id":"cdcdb63e-0b80-468a-b466-af707bdb6cd5","type":"fdf"},{"value":"Feld 40","intern":"Formular1[0]#subform[0]Tabelle4[7]Zeile3[0]_069[0]","name":"Feld 40","export":false,"id":"66c8974f-8b67-40e7-ac77-edfb20e49c38","type":"fdf"},{"value":"Feld 41","intern":"Formular1[0]#subform[0]Tabelle4[7]Zeile3[0]_070[0]","name":"Feld 41","export":false,"id":"d0c41d1e-60af-4c66-a4df-1d367f389296","type":"fdf"},{"value":"Feld 42","intern":"Formular1[0]#subform[0]Tabelle4[2]Zeile7[0]_028[0]","name":"Feld 42","export":false,"id":"4d4d0237-d040-4a76-9a56-2d628e0483bd","type":"fdf"},{"value":"Feld 43","intern":"Formular1[0]#subform[0]Tabelle4[2]Zeile7[0]_029[0]","name":"Feld 43","export":false,"id":"8381966d-dbbb-49e4-a4bf-288ac270f13a","type":"fdf"},{"value":"Feld 44","intern":"Formular1[0]#subform[0]Tabelle4[3]Zeile3[0]_047[0]","name":"Feld 44","export":false,"id":"ab857c88-f1f4-4003-a8a3-42ce0bcd97fa","type":"fdf"},{"value":"Feld 45","intern":"Formular1[0]#subform[0]Tabelle4[3]Zeile3[0]_046[0]","name":"Feld 45","export":false,"id":"55fc72c8-ecce-4730-a875-722835537f1d","type":"fdf"},{"value":"Feld 46","intern":"Formular1[0]#subform[0]Tabelle4[3]Zeile4[0]_048[0]","name":"Feld 46","export":false,"id":"d4475ec8-70a8-4aa9-91cd-f6d9bef9c256","type":"fdf"},{"value":"Feld 47","intern":"Formular1[0]#subform[0]Tabelle4[3]Zeile4[0]_049[0]","name":"Feld 47","export":false,"id":"e0bb8535-8a47-4d27-9797-40d4c2b5fb43","type":"fdf"},{"value":"Feld 48","intern":"Formular1[0]#subform[0]Tabelle4[3]Zeile5[0]_051[0]","name":"Feld 48","export":false,"id":"7a293816-276a-4c5f-9b89-03a9c32d67a1","type":"fdf"},{"value":"Feld 49","intern":"Formular1[0]#subform[0]Tabelle4[3]Zeile5[0]_050[0]","name":"Feld 49","export":false,"id":"1473c733-4bc3-4961-94c2-4099c663c3f5","type":"fdf"},{"value":"Feld 50","intern":"Formular1[0]#subform[0]Tabelle4[3]Zeile6[0]_052[0]","name":"Feld 50","export":false,"id":"27a9ca0a-c355-4303-be64-4a97d14a2472","type":"fdf"},{"value":"Feld 51","intern":"Formular1[0]#subform[0]Tabelle4[3]Zeile6[0]_053[0]","name":"Feld 51","export":false,"id":"1b3356da-52eb-4239-94b8-e0aa2d00a1b2","type":"fdf"},{"value":"Feld 52","intern":"Formular1[0]#subform[0]#area[2]Tabelle4[5]Zeile3[0]_004[0]","name":"Feld 52","export":false,"id":"03c0486a-3bdb-4ee4-9432-42487b64e17e","type":"fdf"},{"value":"Feld 53","intern":"Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile3[0]_002[0]","name":"Feld 53","export":false,"id":"6e946197-755b-48f3-80db-574ef3ee6c1a","type":"fdf"},{"value":"Feld 54","intern":"Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile3[0]_003[0]","name":"Feld 54","export":false,"id":"e96ade0d-46cf-42aa-837f-0d02f8956db6","type":"fdf"},{"value":"Feld 55","intern":"Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile3[0]_001[0]","name":"Feld 55","export":false,"id":"c896dd8c-7592-4af5-ab25-4e48f0f5e455","type":"fdf"},{"value":"Feld 56","intern":"Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile5[0]_006[0]","name":"Feld 56","export":false,"id":"ee831523-24ed-494b-992a-e7f562964913","type":"fdf"},{"value":"Feld 57","intern":"Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile5[0]_007[0]","name":"Feld 57","export":false,"id":"786daad7-f2e6-4326-bae6-469324d18bb8","type":"fdf"},{"value":"Feld 58","intern":"Formular1[0]#subform[0]#area[2]Tabelle4[4]Zeile5[0]_005[0]","name":"Feld 58","export":false,"id":"6ea7b65b-ef22-448c-acb4-8d33ae6ffe98","type":"fdf"}],"export":true,"type":"pdf","mtime":1641886872000,"previewfile":"D:\\Projekte\\Html\\vpi-assistant\\data\\cache\\VPI-EMG 02 Formular Anhang 20_Messblatt Drehgestell mit Schraubfeder-preview-data.pdf"}});
// @formatter:on

type TUITemplateInput = ITemplateInput & { name: string; info: string };

@Component({
             selector:    'app-home',
             templateUrl: './home.component.html',
             styleUrls:   ['./home.component.scss']
           })
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('documenttree') treeRef: MatTree<ITemplateDocument>;
  changedName = false;

  treeControl = new NestedTreeControl<ITemplateDocument>(node => (node as any).mapped);
  dataSource = new MatTreeNestedDataSource<ITemplateDocument>();
  exportMsgs: string[] = [];

  exportedFields: TUITemplateInput[] = [];
  exportSuffix: string;
  exportFolder: string;
  private snackSub: Subscription;
  private dialogSub: Subscription;

  constructor(
    private readonly electronService: ElectronService,
    private readonly snackBarService: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
  }

  private updateDataSource(newData: ITemplateDocument[]) {
    assignDeep(this.dataSource.data, newData);
    if (this.dataSource.data) {
      this.updateExportedFields();
      if (this.treeRef) {
        this.treeRef.renderNodeChanges(this.dataSource.data);
      }
    }
  }

  private updateExportedFields() {
    this.exportedFields =
      this.dataSource.data
          .reduce((prev, template) =>
                    prev.concat(template.export
                                  ? (template.mapped || [])
                        .filter(field => field.export)
                        .map(({id, value, ...field}) =>
                               ({...field, value: '', ids: [id], info: template.name}))
                                  : [])
            , [] as TUITemplateInput[])
          .filter((field, index, arr) => {
            const firstIdx = arr.findIndex((search) => search.name === field.name);
            if ((firstIdx !== index)) {
              arr[firstIdx].info += ' & ' + field.info;
              arr[firstIdx].ids.push(...field.ids);
            }
            return (firstIdx === index);
          });
    this.updateExportFolder();
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

  private getDocumentFromField(field: ITemplateField) {
    return this.dataSource.data.find(template => template.fields.find(afield => afield.id === field.id));
  }

  hasChild = (_: number, node: ITemplateDocument) => !!node.mapped && node.mapped.length > 0;
  trackBy: TrackByFunction<ITemplateDocument | ITemplateField> = (index, node) => {
    return ((node as ITemplateDocument).mapped || []).reduce((fullId, current) => fullId + current.id, node.id);
  };

  ngOnInit(): void {
    this.updateDataSource(this.electronService.getTemplates() || CTEST);
  }

  ngOnDestroy() {
    if (this.snackSub && !this.snackSub.closed) {
      this.snackSub.unsubscribe();
    }
    if (this.dialogSub && !this.dialogSub.closed) {
      this.dialogSub.unsubscribe();
    }
  }

  addFileTemplate() {
    const result = this.electronService.addFileTemplate();
    this.updateDataSource(result);
  }

  createDocuments() {
    this.updateExportFolder();
    // this.exportMsgs =
    this.electronService.createDocuments(this.exportFolder, this.exportedFields);
   console.log(this.exportMsgs);
   return;
    if (!this.exportMsgs?.find(msg => msg.startsWith('FEHLER'))) {
      const snack = this.snackBarService.open('Dokumente wurden erstellt', 'Ordner öffnen', {duration: 5000});
      if (this.snackSub && !this.snackSub.closed) {
        this.snackSub.unsubscribe();
      }
      this.snackSub = snack.onAction().subscribe(() => {
        this.electronService.openOutputFolder(this.exportFolder);
      });
    }
  }

  openOutputFolder() {
    this.electronService.openOutputFolder('');
  }

  changedDocument(template: ITemplateDocument) {
    const result = this.electronService.save(template);
    this.updateDataSource(result);
  }

  // use confirm dialog
  private removeDocument(template: ITemplateDocument) {
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
  private removeField(field: ITemplateField) {
    if (this.dataSource.data) {
      const document = this.dataSource.data.find(template => template.mapped.includes(field));
      document.mapped.splice(document.mapped.indexOf(field), 1);
      this.electronService.save(document);
      this.updateExportedFields();
      if (this.treeRef) {
        this.treeRef.renderNodeChanges(this.dataSource.data);
      }
    }
  }

  changedField(field: ITemplateField) {
    const template = this.getDocumentFromField(field);
    const result = this.electronService.save(template);
    this.updateDataSource(result);
  }

  showConfirmDialog(document: ITemplateDocument, field: ITemplateField) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {});
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

  showFieldMappingDialog(node: ITemplateDocument) {
    const dialogRef = this.dialog.open(FieldDialogComponent, {
      data: node.fields.filter(field => !(node.mapped?.find(mfield => mfield.id === field.id))),
    });

    if (this.dialogSub && !this.dialogSub.closed) {
      this.dialogSub.unsubscribe();
    }
    this.dialogSub = dialogRef.afterClosed().subscribe((result: ITemplateField) => {
      if (result) {
        node.mapped = (node.mapped || []);
        node.mapped.push(result);
        this.changedDocument(node);
      }
    });
  }

}
