import {ITemplateDocument} from './shared.model';

export function assignDeep(target: ITemplateDocument[], source: ITemplateDocument[]) {
  if (!source) return;
  source.forEach(({mapped, ...newTemplate}) => {
    const oldTemplate = target.find(oldOne => newTemplate.id === oldOne.id);
    if (oldTemplate) {
      Object.assign(oldTemplate, newTemplate);
      mapped.forEach(newField => {
        const oldField = oldTemplate.mapped.find(oldOne => oldOne.id === newField.id);
        if (oldField) {
          Object.assign(oldField, newField);
        } else {
          oldTemplate.mapped.push(newField);
        }
      });
    } else {
      target.push({mapped, ...newTemplate});
    }
  });
}
