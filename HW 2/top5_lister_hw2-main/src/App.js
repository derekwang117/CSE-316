import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'

// TPS
import jsTPS from './jsTPS.js'
import ChangeItem_Transaction from './transactions/ChangeItem_Transaction';
import MoveItem_Transaction from './transactions/MoveItem_Transaction';

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData : loadedSessionData
        }

        // use jsTPS to manage transaction stack
        this.tps = new jsTPS();
    }
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyPress)
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        if (!this.state.currentList) {
            // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
            let newKey = this.state.sessionData.nextKey;
            let newName = "Untitled" + newKey;

            // MAKE THE NEW LIST
            let newList = {
                key: newKey,
                name: newName,
                items: ["?", "?", "?", "?", "?"]
            };

            // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
            // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
            let newKeyNamePair = { "key": newKey, "name": newName };
            let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
            this.sortKeyNamePairsByName(updatedPairs);

            // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
            // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
            // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
            // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
            // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
            // SHOULD BE DONE VIA ITS CALLBACK
            this.setState(prevState => ({
                currentList: newList,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey + 1,
                    counter: prevState.sessionData.counter + 1,
                    keyNamePairs: updatedPairs
                }
            }), () => {
                // PUTTING THIS NEW LIST IN PERMANENT STORAGE
                // IS AN AFTER EFFECT
                this.db.mutationCreateList(newList);
                this.db.mutationUpdateSessionData(this.state.sessionData);
            });
        }
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    addRenameItemTransaction = (index, oldName, newName) => {
        if (oldName !== newName) {
            let transaction = new ChangeItem_Transaction(this, index, oldName, newName);
            this.tps.addTransaction(transaction);
        }
    }
    // D: Edit item name
    renameItem = (index, newName) => {
        let newList = this.state.currentList;
        newList.items[index] = newName;
        this.setState(prevState => ({
            currentList: newList,
            sessionData: prevState.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
            this.db.mutationUpdateList(this.state.currentList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // D: Change item order
    reorderItems = (oldIndex, newIndex) => {
        let newList = this.state.currentList;
        newList.items.splice(newIndex, 0, newList.items.splice(oldIndex, 1)[0])
        this.setState(prevState => ({
            currentList: newList,
            sessionData: prevState.sessionData
        }));
    }
    addReorderItemsTransaction = (oldIndex, newIndex) => {
        if (oldIndex !== newIndex) {
            let transaction = new MoveItem_Transaction(this, oldIndex, newIndex);
            this.tps.addTransaction(transaction);
        }
    }
    saveItems = () => {
        this.db.mutationUpdateList(this.state.currentList);
        this.db.mutationUpdateSessionData(this.state.sessionData);
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        this.tps.clearAllTransactions();
        
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
            // need to clear transaction stack first because wrong info gets sent too fast
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
            this.tps.clearAllTransactions()
        });
    }
    deleteList = (keyPair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion: keyPair,
            sessionData: prevState.sessionData
        }))
        this.showDeleteListModal();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal = () => {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion: null,
            sessionData: prevState.sessionData
        }))
    }
    // actually delete it
    confirmDeleteListModal = () => {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");

        let keyPairDelete = this.state.listKeyPairMarkedForDeletion;

        if (this.state.currentList.key === keyPairDelete.key) {
            this.closeCurrentList()
        }

        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        newKeyNamePairs.splice(newKeyNamePairs.indexOf(keyPairDelete), 1);
        this.sortKeyNamePairsByName(newKeyNamePairs);

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // undo
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
            this.saveItems();
        }
    }
    // redo
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
            this.saveItems();
        }
    }
    handleKeyPress = (event) => {
        if (event.ctrlKey && event.key === "z") {
            this.undo();
        }
        else if (event.ctrlKey && event.key === "y") {
            this.redo();
        }
    }

    render() {
        return (
            <div id="app-root">
                <Banner
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList}
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    canUndo={this.tps.hasTransactionToUndo()}
                    canRedo={this.tps.hasTransactionToRedo()}
                    currentList={this.state.currentList} />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    currentList={this.state.currentList}
                    addRenameItemTransactionCallback={this.addRenameItemTransaction}
                    reorderItemsCallback={this.reorderItems}
                    addReorderItemsTransactionCallback={this.addReorderItemsTransaction}
                    saveItemsCallback={this.saveItems} />
                <Statusbar
                    currentList={this.state.currentList} />
                <DeleteModal
                    listKeyPair={this.state.listKeyPairMarkedForDeletion}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    confirmDeleteListModalCallback={this.confirmDeleteListModal}
                />
            </div>
        );
    }
}

export default App;
