import jsTPS_Transaction from "../jsTPS.js"

/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class MoveItem_Transaction extends jsTPS_Transaction {
    constructor(app, initOld, initNew) {
        super();
        this.app = app;
        this.oldItemIndex = initOld;
        this.newItemIndex = initNew;
    }

    doTransaction() {
        this.app.reorderItems(this.oldItemIndex, this.newItemIndex);
    }
    
    undoTransaction() {
        this.app.reorderItems(this.newItemIndex, this.oldItemIndex);
    }
}