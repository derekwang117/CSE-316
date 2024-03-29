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
        this.listEditing = false;

    }

    setModel(initModel) {
        this.model = initModel;
        this.initHandlers();
    }

    initHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        document.getElementById("add-list-button").onmousedown = (event) => {
            if (!this.model.currentList) {
                let newList = this.model.addNewList("Untitled", ["?","?","?","?","?"]);            
                this.model.loadList(newList.id);
                this.model.saveLists();
            }
        }
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
            this.listEditing = false;
        }

        // D:
        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
            this.listEditing = false;
        }
        document.getElementById("close-button").onmousedown = (event) => {
            this.model.closeOut();
            this.listEditing = false;
        }

        // SETUP THE ITEM HANDLERS
        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);

            // AND FOR TEXT EDITING
            item.ondblclick = (ev) => {
                if (this.model.hasCurrentList()) {
                    // CLEAR THE TEXT
                    item.innerHTML = "";

                    // remove draggable to fix clicking text bubble bug
                    item.removeAttribute("draggable");

                    // ADD A TEXT FIELD
                    let textInput = document.createElement("input");
                    textInput.setAttribute("type", "text");
                    textInput.setAttribute("id", "item-text-input-" + i);

                    item.appendChild(textInput);

                    textInput.focus();
                    textInput.value = this.model.currentList.getItemAt(i-1);

                    textInput.ondblclick = (event) => {
                        this.ignoreParentClick(event);
                    }
                    textInput.onkeydown = (event) => {
                        if (event.key === 'Enter') {
                            this.model.addChangeItemTransaction(i-1, event.target.value);
                            item.setAttribute("draggable", true);
                        }
                    }
                    textInput.onblur = (event) => {
                        this.model.addChangeItemTransaction(i-1, event.target.value);
                        item.setAttribute("draggable", true);
                        // this.model.restoreList();
                    }
                }
            }

            // make items draggable
            item.ondragstart = (event) => {
                event.dataTransfer.setData("targetId", event.target.id);
            }
            item.ondrop = (event) => {
                let targetId = event.dataTransfer.getData("targetId");
                this.model.addMoveItemTransaction(Number(targetId.slice(5)), Number(event.target.id.slice(5)));
            }
            item.ondragover = (event) => {
                event.preventDefault();
            }
        }

        // D: Document list confirm/delete button
        document.getElementById("dialog-confirm-button").onmousedown = (event) => {
            let modal = document.getElementById("delete-modal");

            this.model.deleteList(modal.listId);
            this.model.closeOut();

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
            if (!this.listEditing)
            {
                this.model.unselectAll();

                // GET THE SELECTED LIST
                this.model.loadList(id);
            }
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

            this.listEditing = true;

            // CLEAR THE TEXT
            thisList.innerHTML = "";

            // ADD A TEXT FIELD
            let textInput = document.createElement("input");
            textInput.setAttribute("type", "text");
            textInput.setAttribute("id", "top5-list-" + id);

            thisList.appendChild(textInput);
            
            textInput.focus();
            textInput.value = this.model.currentList.getName();

            textInput.ondblclick = (event) => {
                this.ignoreParentClick(event);
            }
            textInput.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    this.model.changeList(event.target.value);
                    //this.model.unselectAll();
                    this.model.loadList(id);

                    this.listEditing = false;
                }
            }
            textInput.onblur = (event) => {
                this.model.changeList(event.target.value);
                // not needed: this.model.unselectAll();
                this.model.loadList(id);

                this.listEditing = false;
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