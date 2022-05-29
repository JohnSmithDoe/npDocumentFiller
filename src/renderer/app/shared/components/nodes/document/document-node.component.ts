import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ITemplateDocument} from '../../../../../../bridge/shared.model';
import {ElectronService} from '../../../../services/electron.service';

@Component({
             selector:    'app-document-node',
             templateUrl: './document-node.component.html',
             styleUrls:   ['./document-node.component.scss'],
           })
export class DocumentNodeComponent implements OnInit, OnDestroy {

  @Input() node: ITemplateDocument;
  @Input() treeControl: NestedTreeControl<ITemplateDocument>;
  @Output() changed: EventEmitter<ITemplateDocument> = new EventEmitter<ITemplateDocument>();
  @Output() removed: EventEmitter<ITemplateDocument> = new EventEmitter<ITemplateDocument>();
  @Output() addfield: EventEmitter<ITemplateDocument> = new EventEmitter<ITemplateDocument>();


  constructor(
    private readonly electronService: ElectronService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  showFieldMappingDocument(node: ITemplateDocument) {
    this.electronService.openFileWithExplorer(node.previewfile);
  }

  showDocument(node: ITemplateDocument) {
    this.electronService.openFileWithExplorer(node.filename);
  }
}
