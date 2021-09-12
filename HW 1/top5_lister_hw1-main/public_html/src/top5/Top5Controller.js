/**
 * Top5ListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class Top5Controller {
    constructor() {

    }

    setModel(initModel) {
        this.model = initModel;
        this.initHandlers();
    }

    initHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        document.getElementById("add-list-button").onmousedown = (event) => {
            let newList = this.model.addNewList("Untitled", ["?","?","?","?","?"]);            
            this.model.loadList(newList.id);
            this.model.saveLists();
        }
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }

        // SETUP THE ITEM HANDLERS
        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);

            // AND FOR TEXT EDITING
            item.ondblclick = (ev) => {
                if (this.model.hasCurrentList()) {
                    // CLEAR THE TEXT
                    item.innerHTML = "";

                    // ADD A TEXT FIELD
                    let textInput = document.createElement("input");
                    textInput.setAttribute("type", "text");
                    textInput.setAttribute("id", "item-text-input-" + i);
                    textInput.setAttribute("value", this.model.currentList.getItemAt(i-1));

                    item.appendChild(textInput);

                    textInput.ondblclick = (event) => {
                        this.ignoreParentClick(event);
                    }
                    textInput.onkeydown = (event) => {
                        if (event.key === 'Enter') {
                            this.model.addChangeItemTransaction(i-1, event.target.value);
                        }
                    }
                    textInput.onblur = (event) => {
                        this.model.addChangeItemTransaction(i-1, event.target.value);
                        // this.model.restoreList();
                    }
                }
            }
        }

        // D: Document list confirm/delete button
        document.getElementById("dialog-confirm-button").onmousedown = (event) => {
            let modal = document.getElementById("delete-modal");

            this.model.deleteList(modal.listId);

            modal.classList.remove("is-visible");

        }
        document.getElementById("dialog-cancel-button").onmousedown = (event) => {
            let modal = document.getElementById("delete-modal");
            modal.classList.remove("is-visible");
        }
    }

    registerListSelectHandlers(id) {
        // FOR SELECTING THE LIST
        document.getElementById("top5-list-" + id).onmousedown = (event) => {
            this.model.unselectAll();

            // GET THE SELECTED LIST
            this.model.loadList(id);
        }
        // FOR DELETING THE LIST
        document.getElementById("delete-list-" + id).onmousedown = (event) => {
            this.ignoreParentClick(event);
            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE LIST
            let modal = document.getElementById("delete-modal");
            this.listToDeleteIndex = this.model.getListIndex(id);
            let listName = this.model.getList(this.model.getListIndex(id)).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            modal.classList.add("is-visible");

            modal.listId = id;
        }

        // D: list name editing
        document.getElementById("top5-list-" + id).ondblclick = (event) => {
            let thisList = document.getElementById("top5-list-" + id)

            // CLEAR THE TEXT
            thisList.innerHTML = "";

            // ADD A TEXT FIELD
            let textInput = document.createElement("input");
            textInput.setAttribute("type", "text");
            textInput.setAttribute("id", "top5-list-" + id);
            textInput.setAttribute("value", this.model.currentList.getName());

            thisList.appendChild(textInput);

            textInput.ondblclick = (event) => {
                this.ignoreParentClick(event);
            }
            textInput.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    this.model.changeList(event.target.value);
                    //this.model.unselectAll();
                    this.model.loadList(id);
                }
            }
            textInput.onblur = (event) => {
                this.model.changeList(event.target.value);
                // not needed: this.model.unselectAll();
                this.model.loadList(id);
            }
        }

        // D: mouse-over highlighting
        document.getElementById("top5-list-" + id).onmouseover = (event) => {
            this.model.hover(id);
        }
        document.getElementById("top5-list-" + id).onmouseout = (event) => {
            this.model.unhover(id);
        }
    }

    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }
}