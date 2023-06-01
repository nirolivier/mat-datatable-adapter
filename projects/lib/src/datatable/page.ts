/**
 * Contains the page info.
 *
 * @author d40628
 * @version 28/05/2021
 */
export interface Page<T> {
  content: T[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: null
  totalElements: number;
  totalPages: number;
}
