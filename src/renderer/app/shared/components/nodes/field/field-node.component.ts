import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ITemplateDocument, ITemplateField} from '../../../../../../bridge/shared.model';

@Component({
             selector:    'app-field-node',
             templateUrl: './field-node.component.html',
             styleUrls:   ['./field-node.component.scss']
           })
export class FieldNodeComponent implements OnInit {

  @Input() node: ITemplateField;
  @Input() treeControl: NestedTreeControl<ITemplateDocument>;
  @Output() changed: EventEmitter<ITemplateField> = new EventEmitter<ITemplateField>();
  @Output() removed: EventEmitter<ITemplateField> = new EventEmitter<ITemplateField>();

  private changedName = false;

  constructor() { }

  ngOnInit(): void {
  }

  blurNameInput(node: ITemplateField) {
    if (this.changedName) {
      this.changedName = false;
      this.changed.emit(node);
    }
  }

  changingName() {
    this.changedName = true;
  }
}
