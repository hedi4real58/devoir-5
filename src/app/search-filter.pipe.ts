import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: true
})
export class SearchFilterPipe implements PipeTransform {

  transform(list: any[], filterText: string): any {
    if (!list) return [];
    if (!filterText) return list;
    const term = filterText.toLowerCase();
    return list.filter(item => item.nomjeu.toLowerCase().includes(term));
  }

}
