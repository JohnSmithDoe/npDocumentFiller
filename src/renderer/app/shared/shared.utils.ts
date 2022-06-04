import {IDocument,} from '../../../bridge/shared.model';

export function assignDeep(target: IDocument[], source: IDocument[]) {
  if (!source) return;
  source.forEach(template => {
    let oldTemplate = target.find(oldOne => (template.id === oldOne.id));
    if(!oldTemplate) {
      target.push(template);
    } else {
      Object.assign(oldTemplate, template);
    }
  });
  if(target.length !== source.length){
    console.log('removing stuff');
    target
      .filter(template => (!source.find(stemplate => stemplate.id === template.id)))
      .forEach(toRemove => target.splice(target.indexOf(toRemove,1)));
  }

}
