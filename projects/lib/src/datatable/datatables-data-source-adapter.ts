import {LazyDataSource} from './lazy-data-source';
import {PageEvent} from '@angular/material/paginator';
import {Observable} from 'rxjs';
import {Column} from './column';
import {Order} from './order';
import {DatatablesInput} from './datatables-input';
import {Sort} from '@angular/material/sort/sort';
import {FilterEvent} from '../directives/mat-filter';

/**
 * This is the default implementation of the lazy {@link LazyDataSource}.
 * It was designed to adapt to the spring datatable.
 *
 * @author d40628
 * @version 31/05/2021
 */
export class DatatablesDataSourceAdapter<T> extends LazyDataSource<T> {

  constructor(protected override loadCallback: (inputRequest: any) => Observable<T[]>,
              public override inputRequest: DatatablesInput) {
    super(loadCallback, inputRequest);
  }

  /**
   * {@inheritDoc}
   *
   * @override
   */
  protected onPaginated(pageEvent: PageEvent) {
    this._updatePagination(pageEvent);
  }

  /**
   * {@inheritDoc}
   *
   * @override
   */
  protected onSorted(sortEvent: Sort) {
    this._convertToOrder(sortEvent);
  }

  /**
   * @inheritDoc
   * @override
   */
  protected override onFiltered(filterEvent: FilterEvent) {
    const foundColumn = this.inputRequest.columns.find((column: Column) => column.data === filterEvent.column);
    if (!foundColumn) {
      return;
    }

    foundColumn.setSearchValue(filterEvent.value);
    super.loadData(this.inputRequest);
  }

  /**
   * Converts the material {@link Sort} type to datatable input {@link Order} object.
   *
   * @param sort the sort object
   * @private
   */
  private _convertToOrder(sort: Sort): void {
    const searchColObject = this.inputRequest.columns.map((column: Column, index: number) => {
      return {index: index, data: column.data};
    })
      .find((colObject) => colObject.data === sort.active);

    if (!searchColObject) {
      return;
    }

    const idxOrder = this.inputRequest.order.findIndex((order: Order) => order.column === searchColObject.index);

    if (idxOrder === -1 && !sort.direction) {
      return;
    }

    if (idxOrder !== -1 && sort.direction) {
      this.inputRequest.order[idxOrder].dir = sort.direction;
      super.loadData(this.inputRequest);
    } else if (idxOrder === -1 && sort.direction) {
      this.inputRequest.order.push(new Order(searchColObject.index, sort.direction));
      super.loadData(this.inputRequest);
    } else if (this.inputRequest.order.length > 1) {
      // Order should have at least one item
      this.inputRequest.order.splice(idxOrder, 1);
      super.loadData(this.inputRequest);
    }
  }

  /**
   * Updates the datatable input pagination from the material pagination event.
   *
   * @param pageEvent the event
   * @private
   */
  private _updatePagination(pageEvent: PageEvent): void {
    this.inputRequest.length = pageEvent.pageSize;
    this.inputRequest.start = pageEvent.pageIndex;
    super.loadData(this.inputRequest);
  }

}
