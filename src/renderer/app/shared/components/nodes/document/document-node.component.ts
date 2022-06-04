import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IDocument, IMappedField, IPdfDocument, IResourceDocument, IXlsxDocument} from '../../../../../../bridge/shared.model';
import {ElectronService} from '../../../../services/electron.service';

@Component({
             selector:    'app-document-node',
             templateUrl: './document-node.component.html',
             styleUrls:   ['./document-node.component.scss'],
           })
export class DocumentNodeComponent implements OnInit, OnDestroy {

  @Input() node: IPdfDocument | IXlsxDocument | IResourceDocument;
  @Input() treeControl: NestedTreeControl<IDocument|IMappedField>;
  @Output() changed: EventEmitter<IDocument> = new EventEmitter<IDocument>();
  @Output() removed: EventEmitter<IDocument> = new EventEmitter<IDocument>();
  @Output() addfield: EventEmitter<(IXlsxDocument | IPdfDocument)> = new EventEmitter<(IXlsxDocument | IPdfDocument)>();


  constructor(
    private readonly electronService: ElectronService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  showFieldMappingDocument(node: IPdfDocument) {
    this.electronService.openFileWithExplorer(node.previewfile);
  }

  showDocument(node: IDocument) {
    this.electronService.openFileWithExplorer(node.filename);
  }
}
