import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ITemplateField} from '../../shared.model';

@Component({
  selector:    'app-field-dialog',
  templateUrl: './field-dialog.component.html',
  styleUrls:   ['./field-dialog.component.scss']
})
export class FieldDialogComponent implements OnInit {
  field = {
    name: '',
    id: '',
  }

  constructor(
    public dialogRef: MatDialogRef<FieldDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITemplateField[],
  ) { }

  ngOnInit(): void {
   }

  async doSomething() {
    const {...copy} = this.data.find(field => field.id === this.field.id);
    copy.name = this.field.name;
    copy.export = true;
    this.dialogRef.close(copy);
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}
