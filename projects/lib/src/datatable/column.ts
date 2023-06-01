import {Search} from './search';

/**
 * A class that holds column information.
 * @author d40628
 * @version 28/05/2021
 */
export class Column {

    constructor(public data: string,
                public searchable: boolean,
                public orderable: boolean,
                public search: Search = new Search(),
                public name?: string) {
    }

    public setSearchValue(searchValue: string): void {
        this.search.value = searchValue;
    }
}
