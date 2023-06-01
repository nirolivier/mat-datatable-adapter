/**
 * Class that holds Sort information.
 *
 * @author d40628
 * @version 28/05/2021
 */
export class Order {

    constructor(public column: number,
                public dir: ('desc' | 'asc') = 'asc') {
    }
}
