import {SearchPanes} from './search-panes';

/**
 * Contains the information which are returned by the spring datatable service.
 *
 * @author d40628
 * @version 01/06/2021
 */
export interface DatatablesOutput<T> {
  draw: number;
  recordsTotal: number;
  recordsFiltered : number;
  data : T[];
  searchPanes: SearchPanes;
  error: string;
}
