import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IDocument, IMappedField} from '../../../../../../bridge/shared.model';

@Component({
             selector:    'app-field-node',
             templateUrl: './field-node.component.html',
             styleUrls:   ['./field-node.component.scss']
           })
export class FieldNodeComponent implements OnInit {

  @Input() node: IMappedField;
  @Input() treeControl: NestedTreeControl<IDocument|IMappedField>;
  @Output() changed: EventEmitter<IMappedField> = new EventEmitter<IMappedField>();
  @Output() removed: EventEmitter<IMappedField> = new EventEmitter<IMappedField>();

  private changedName = false;

  constructor() { }

  ngOnInit(): void {
  }

  blurNameInput(node: IMappedField) {
    if (this.changedName) {
      this.changedName = false;
      this.changed.emit(node);
    }
  }

  changingName() {
    this.changedName = true;
  }
}
