import {IDocument, IPdfDocument, IXlsxDocument,} from '../../../bridge/shared.model';

function assignTemplateFields<T extends IPdfDocument|IXlsxDocument>(template: T, oldTemplate: T) {
  const {mapped, ...newTemplate} = template;
  Object.assign(oldTemplate, newTemplate);
  for (let i = 0; i < mapped.length; i++) {
    let newField = mapped[i];
    const oldField = oldTemplate.mapped.find(oldOne => oldOne.origId === newField.origId);
    if (oldField) {
      Object.assign(oldField, newField);
    } else {
      oldTemplate.mapped.push(newField);
    }
  }
}

export function assignDeep(target: IDocument[], source: IDocument[]) {
  if (!source) return;
  source.forEach(template => {
    let oldTemplate = target.find(oldOne => (template.id === oldOne.id));
    if(!oldTemplate) {
      target.push(template);
    }else if (template.type === 'pdf' && oldTemplate.type === 'pdf') {
      assignTemplateFields(template as IPdfDocument, oldTemplate as IPdfDocument);
    } else if (template.type === 'xlsx' && oldTemplate.type === 'xlsx') {
      assignTemplateFields(template as IXlsxDocument, oldTemplate as IXlsxDocument);
    } else {
      Object.assign(oldTemplate, template);
    }
  });
}
