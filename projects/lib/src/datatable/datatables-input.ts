import {Column} from './column';
import {Search} from './search';
import {Order} from './order';

/**
 * this class is used as input datatable.
 *
 * @author d40628
 * @version 28/05/2021
 */
export class DatatablesInput {
  private static SEARCH_PANES_REGEX = new RegExp("^searchPanes\\.(\\w+)\\.\\d+$", 'i');
  public columns: Column[] = [];
  public search: Search = new Search();
  public draw: number = 1;
  public start: number = 0;
  public length: number = 10;
  public order: Order[] = [];
  public searchPanes: Map<string, string[]> = new Map<string, string[]>();

  public getColumnsAsMap(): Map<string, Column> {
    const map = new Map<string, Column>();
    this.columns.forEach((column: Column) => map.set(column.data, column));
    return map;
  }

  public getColumn(columnName: string): Column | undefined {
    if (!columnName) {
      return undefined;
    }
    return this.columns
      .filter((column: Column) => columnName.toLowerCase() === column.data.toLowerCase())
      .pop();
  }

  public addColumn(columnName: string, searchable: boolean, orderable: boolean,
                   searchValue: string): void {
    this.columns.push(new Column('', searchable, orderable, {
      value: searchValue,
      regex: false
    } as Search, columnName));
  }

  public addOrder(columnName: string, ascending: boolean): void {
    if (!columnName) {
      return;
    }

    for (let i = 0; i < this.columns.length; i++) {
      if (columnName.toLowerCase() === this.columns[i].data.toLowerCase()) {
        this.order.push(new Order(i, ascending ? 'asc' : 'desc'));
      }
    }

  }

  public parseSearchPanesFromQueryParams(queryParams: Map<string, string>, attributes: string[]): void {
    const searchPanes = new Map<string, string[]>();
    attributes.forEach(attribute => searchPanes.set(attribute, []));

    queryParams.forEach((value: string, key: string) => {

      const matcher: RegExpMatchArray | null = key.match(DatatablesInput.SEARCH_PANES_REGEX);
      if (matcher && matcher.length > 0) {
        let attribute: string | undefined = matcher.pop();
        if (attributes.indexOf(<string>attribute) !== -1) {
          searchPanes.get(attribute as string)?.push(value);
        }
      }
    });

    this.searchPanes = searchPanes;
  }
}
