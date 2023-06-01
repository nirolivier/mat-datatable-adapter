import {Directive, HostListener, Input} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * This class represents the table filter event.
 *
 * @author d40628
 * @version 01/06/2021
 */
export class FilterEvent {
  column!: string;
  value: any;
}

/**
 * Directive that allow a table column to be filterable.
 *
 * @author d40628
 * @version 01/06/2021
 */
// tslint:disable-next-line:directive-selector
@Directive({selector: '[matFilter]', standalone: true})
// tslint:disable-next-line:directive-class-suffix
export class MatFilter {

  readonly filterChange: Subject<FilterEvent> = new Subject<FilterEvent>();

  @Input('matFilter')
  column!: string;

  constructor() {
  }

  @HostListener('keyup', ['$event'])
  @HostListener('change', ['$event'])
  onchange(event: Event) {
    this.filterChange.next({column: this.column, value: (event.target as any).value});
  }

}
