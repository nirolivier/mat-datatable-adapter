import {Injectable} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {MatPaginatorIntl} from '@angular/material/paginator';

/**
 * A custom pagination internationalization service. By default, the {@link MatPaginatorIntl}
 * provide an english translation.
 *
 * @author d40628
 * @version 02/06/2021
 */
@Injectable({providedIn: 'root'})
export class NgxMatPaginationIntl extends MatPaginatorIntl {

  /**
   * @override
   * @inheritDoc
   */
  override getRangeLabel: (page: number, pageSize: number, length: number) => string = this._rangeLabel;

  constructor(private i18n: TranslateService) {
    super();
    if (i18n) {
      i18n.use('fr');
      this.itemsPerPageLabel = i18n.instant('paginationIntl.itemsPerPageLabel');
      this.nextPageLabel = i18n.instant('paginationIntl.nextPageLabel');
      this.previousPageLabel = i18n.instant('paginationIntl.previousPageLabel');
      this.firstPageLabel = i18n.instant('paginationIntl.firstPageLabel');
      this.lastPageLabel = i18n.instant('paginationIntl.lastPageLabel');

      i18n.onLangChange.subscribe((i18nEvent: LangChangeEvent) => {
        this.itemsPerPageLabel = i18nEvent.translations['paginationIntl.itemsPerPageLabel'];
        this.nextPageLabel = i18nEvent.translations['paginationIntl.nextPageLabel'];
        this.previousPageLabel = i18nEvent.translations['paginationIntl.previousPageLabel'];
        this.firstPageLabel = i18nEvent.translations['paginationIntl.firstPageLabel'];
        this.lastPageLabel = i18nEvent.translations['paginationIntl.lastPageLabel'];
      });
    }

  }

  private _rangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.i18n ? this.i18n.instant('of') : 'de'} ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} ${this.i18n ? this.i18n.instant('of') : 'de'} ${length}`;
  }
}

/** @docs-private */
export function MAT_PAGINATOR_INTL_PROVIDER_FACTORY(parentIntl: NgxMatPaginationIntl, i18n: TranslateService) {
  return parentIntl || new NgxMatPaginationIntl(i18n);
}

/** @docs-private */
export const MAT_PAGINATOR_INTL_PROVIDER = {
  // If there is already an NgxMatPaginationIntl available, use that. Otherwise, provide a new one.
  provide: MatPaginatorIntl,
  deps: [NgxMatPaginationIntl, TranslateService],
  useFactory: MAT_PAGINATOR_INTL_PROVIDER_FACTORY
};
