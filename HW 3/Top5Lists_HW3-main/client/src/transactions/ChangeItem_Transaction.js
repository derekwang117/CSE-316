import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * change item
 */
export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, initNewText) {
        super();
        this.store = initStore;
        this.initIndex = initIndex;
        this.initOldText = this.store.currentList.items[initIndex];
        this.initNewText = initNewText;
    }

    doTransaction() {
        this.store.changeItem(this.initIndex, this.initNewText);
    }
    
    undoTransaction() {
        this.store.changeItem(this.initIndex, this.initOldText);
    }
}