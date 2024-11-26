import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], searchTerm: string): any[] {
    if (!value || !searchTerm) {
      return value;
    }

    return value.filter(item => {
      return item.user_name && item.user_name.toLowerCase().includes(searchTerm) || item.user_name && item.user_name.includes(searchTerm) ||
        item.fullName && item.fullName.toLowerCase().includes(searchTerm) || item.fullName && item.fullName.includes(searchTerm) ||
        item.name && item.name.toLowerCase().includes(searchTerm) || item.name && item.name.includes(searchTerm)||
        item.email && item.email.toLowerCase().includes(searchTerm) || item.email && item.email.includes(searchTerm)   
    });
  }
}