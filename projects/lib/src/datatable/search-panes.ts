/**
 * Class that holds search panes information.
 *
 * @author d40628
 * @version 28/05/2021
 */
export class SearchPanes {
  public options: Map<string, Item[]> = new Map<string, Item[]>();
}

export class Item {
  public label: string;
  public value: string;
  public total: number;
  public count: number;
}
