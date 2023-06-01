import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort/sort';
import {QueryList} from '@angular/core';
import {FilterEvent, MatFilter} from '../directives/mat-filter';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

/**
 * An implementation of angular material of {@link DataSource} interface.
 * This class aims to retrieve data from server side.
 *
 * @author d40628
 * @version 31/05/2021
 */
export abstract class LazyDataSource<T> implements DataSource<T> {
  sort: MatSort | undefined;
  paginator: MatPaginator | undefined;
  filters!: QueryList<MatFilter>;
  private readonly _datasource: BehaviorSubject<T[]>;
  private readonly _loading: BehaviorSubject<boolean>;
  private readonly _subscriptions: Subscription[];

  protected constructor(protected loadCallback: (inputRequest: any) => Observable<T[]>, public inputRequest?: any) {
    this._loading = new BehaviorSubject<boolean>(false);
    this._datasource = new BehaviorSubject<T[]>([]);
    this._subscriptions = [];
    this.loadData(inputRequest);
  }

  /**
   * Exposes the loading observable so that component that call the {@link loadData} function is aware of the data processing.
   */
  get loading(): Observable<boolean> {
    return this._loading.asObservable();
  }

  connect(collectionViewer: CollectionViewer): Observable<T[] | ReadonlyArray<T>> {
    if (this.sort) {
      this._subscriptions.push(this.sort.sortChange.asObservable().subscribe((sortEvent: Sort) => this.onSorted(sortEvent)));
    }

    if (this.paginator) {
      this._subscriptions.push(this.paginator.page.asObservable().subscribe((pageEvent: PageEvent) => this.onPaginated(pageEvent)));
    }

    if (this.filters) {
      this.filters.forEach((filter: MatFilter) => {
        this._subscriptions.push(this.chainFilter(filter, filter.filterChange.asObservable())
          .subscribe((filterEvent: FilterEvent) => this.onFiltered(filterEvent)));
      });
    }

    return this._datasource.asObservable();
  }

  /**
   * This method allows to customize the main filtering behavior.
   * It calls the {@link getDelay} method to delay the event change.
   *
   * @param filter the current filter
   * @param filter$ the current observable filter
   * @see getDelay
   */
  chainFilter(filter: MatFilter, filter$: Observable<FilterEvent>): Observable<FilterEvent> {
    return filter$.pipe(
      debounceTime(this.getDelay(filter.column)),
      distinctUntilChanged((f1: FilterEvent, f2: FilterEvent) => f1.value === f2.value));
  }

  /**
   * The delay is used by the {@link chainFilter} method. This method allows to specify a custom delay.
   * By default, it is set to 500ms.
   *
   * @inheritDoc
   * @see chainFilter
   */
  getDelay(filterName: string): number {
    return 500;
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this._subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Load the data from the service callback which was initialized in the constructor.
   * @param newInputRequest the new request
   */
  loadData(newInputRequest: any) {
    this.inputRequest = newInputRequest;
    if (this.loadCallback) {
      this._loading.next(true);
      this._subscriptions.push(this.loadCallback(newInputRequest).subscribe((data: T[]) => {
        this._datasource.next(data);
        this._loading.next(false);
      }));
    }
  }

  /**
   * Allows to sort the data.
   * @param sortEvent the sort event
   */
  protected abstract onSorted(sortEvent: Sort): void;

  /**
   * Allows to paginate the data.
   * @param pageEvent the pagination event
   */
  protected abstract onPaginated(pageEvent: PageEvent): void;

  /**
   * @inheritDoc
   */
  protected onFiltered(event: FilterEvent): void {
    this.loadData(event);
  }
}
