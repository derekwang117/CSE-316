import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveItem_Transaction from '../transactions/MoveItem_Transaction'
import UpdateItem_Transaction from '../transactions/UpdateItem_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_VIEW_MODE: "SET_VIEW_MODE",
    REPLACE_LIST: "REPLACE_LIST"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        viewMode: 1,
        search: ""
    });
    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode: 1,
                    search: store.search
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode: 1,
                    search: ""
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode: 1,
                    search: store.search
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode: store.viewMode,
                    search: store.search
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    viewMode: 1,
                    search: store.search
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode: 1,
                    search: store.search
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode: 1,
                    search: store.search
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    viewMode: 1,
                    search: store.search
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode: 1,
                    search: store.search
                });
            }
            case GlobalStoreActionType.SET_VIEW_MODE: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode: payload.viewMode,
                    search: payload.search
                })
            }
            case GlobalStoreActionType.REPLACE_LIST: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    viewMode: store.viewMode,
                    search: store.search
                })
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        if (newName) {
            let payload = {
                userName: auth.user.userName
            }
            let response = await api.getTop5ListById(id, payload);
            if (response.data.success) {
                let top5List = response.data.top5List;
                top5List.name = newName;
                async function updateList(top5List) {
                    response = await api.updateTop5ListById(top5List._id, top5List);
                    if (response.data.success) {
                        async function getListPairs(top5List) {
                            let payload = {
                                userName: auth.user.userName
                            };
                            response = await api.getTop5ListPairs(payload);
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                pairsArray = pairsArray.filter(ele => ele.userName === auth.user.userName)
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        currentList: top5List
                                    }
                                });
                            }
                        }
                        getListPairs(top5List);
                    }
                }
                updateList(top5List);
            }
        }
        else {
            store.closeCurrentList();
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let payload = {
            isCommunityList: false,
            isPublished: false,
            name: newListName,
            items: ["", "", "", "", ""],
            userName: auth.user.userName,
            comments: [],
            views: 0,
            upvotes: [],
            downvotes: []
        };
        const response = await api.createTop5List(payload);
        if (response.data.success) {
            tps.clearAllTransactions();
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function () {
        let payload = {
            userName: auth.user.userName
        };
        const response = await api.getTop5ListPairs(payload);
        if (response.data.success) {
            /*let pairsArray = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: pairsArray
            });*/
            //idk what the top thing does but this is better (:
            store.setViewMode(store.viewMode, store.search)
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let payload = {
            userName: auth.user.userName
        }
        let response = await api.getTop5ListById(id, payload);
        if (response.data.success) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.data.success) {
            store.loadIdNamePairs();
            history.push("/");
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        if (auth.user) {
            let payload = {
                userName: auth.user.userName
            }
            let response = await api.getTop5ListById(id, payload);
            if (response.data.success) {
                let top5List = response.data.top5List;

                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: top5List
                    });
                    history.push("/top5list/" + top5List._id);
                }
            }
            else {
                console.log("haxor")
            }
        }
    }

    let id = document.URL.substring(21)
    if (id.length > 10 && (store.currentList === null || id.substring(10) !== store.currentList._id)) {
        id = id.substring(10)
        store.setCurrentList(id);
    }

    store.addMoveItemTransaction = function (start, end) {
        let transaction = new MoveItem_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }

    store.addUpdateItemTransaction = function (index, newText) {
        let oldText = store.currentList.items[index];
        let transaction = new UpdateItem_Transaction(store, index, oldText, newText);
        if (newText && oldText !== newText) {
            tps.addTransaction(transaction);
        }
        else {
            store.updateCurrentList();
        }
    }

    store.moveItem = function (start, end) {
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = store.currentList.items[start];
            for (let i = start; i < end; i++) {
                store.currentList.items[i] = store.currentList.items[i + 1];
            }
            store.currentList.items[end] = temp;
        }
        else if (start > end) {
            let temp = store.currentList.items[start];
            for (let i = start; i > end; i--) {
                store.currentList.items[i] = store.currentList.items[i - 1];
            }
            store.currentList.items[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }

    store.updateItem = function (index, newItem) {
        store.currentList.items[index] = newItem;
        store.updateCurrentList();
    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }

    store.undo = function () {
        tps.undoTransaction();
    }

    store.redo = function () {
        tps.doTransaction();
    }

    store.canUndo = function () {
        return tps.hasTransactionToUndo();
    }

    store.canRedo = function () {
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: null
        });
    }

    store.checkAllowPublish = function () {
        let checker = true
        if (new Set(store.currentList.items).size !== 5 || store.currentList.items.includes("")) {
            checker = false
        }
        if (checker) {
            let listsWithSameName = store.idNamePairs.filter(ele => ele.name === store.currentList.name)
            for (let i = 0; i < listsWithSameName.length; i++) {
                if (listsWithSameName[i].isPublished) {
                    checker = false
                }
            }
        }
        return checker
    }

    store.publishList = async function (top5List) {
        let payload = {
            userName: auth.user.userName
        }
        let id = top5List._id
        let response = await api.getTop5ListById(id, payload);
        if (response.data.success) {
            let top5List = response.data.top5List;
            top5List.isPublished = true;
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    store.setViewMode(store.viewMode, store.search)
                }
            }
            updateList(top5List)
        }
    }

    store.replaceList = async function (newList) {
        let index = store.idNamePairs.map(function (list) { return list._id }).indexOf(newList._id)
        let idNamePairs = store.idNamePairs
        idNamePairs.splice(index, 1, newList)
        storeReducer({
            type: GlobalStoreActionType.REPLACE_LIST,
            payload: idNamePairs
        });
    }

    store.newComment = async function (id, comment) {
        let payload = {
            userName: auth.user.userName
        }
        let response = await api.getTop5ListById(id, payload);
        if (response.data.success) {
            let top5List = response.data.top5List;
            top5List.comments.push({ userName: auth.user.userName, comment: comment })
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    store.replaceList(top5List)
                }
            }
            updateList(top5List)
        }
    }

    store.getUserName = function () {
        return auth.user.userName
    }

    store.vote = async function (id, vote) {
        let payload = {
            userName: auth.user.userName
        }
        let response = await api.getTop5ListById(id, payload);
        if (response.data.success) {
            let top5List = response.data.top5List;

            top5List.upvotes = top5List.upvotes.filter(name => name !== auth.user.userName)
            top5List.downvotes = top5List.downvotes.filter(name => name !== auth.user.userName)

            if (vote === 1) {
                top5List.upvotes.push(auth.user.userName)
            }
            else if (vote === -1) {
                top5List.downvotes.push(auth.user.userName)
            }

            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    store.replaceList(top5List)
                }
            }
            updateList(top5List)
        }
    }

    store.view = async function (id) {
        let payload = {
            userName: auth.user.userName
        }
        let response = await api.getTop5ListById(id, payload);
        if (response.data.success) {
            let top5List = response.data.top5List;

            top5List.views = top5List.views + 1

            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.data.success) {
                    store.replaceList(top5List)
                }
            }
            updateList(top5List)
        }
    }

    store.setViewMode = async function (mode, searchText) {
        let payload = {
            userName: auth.user.userName
        };
        let response = await api.getTop5ListPairs(payload);
        if (response.data.success) {
            let pairsArray = response.data.idNamePairs;
            let viewMode = 1

            if (mode === 1) {
                viewMode = 1
                pairsArray = pairsArray.filter(ele => ele.userName === auth.user.userName)

                pairsArray = pairsArray.filter(ele => ele.name.startsWith(searchText))

            }
            else if (mode === 2) {
                viewMode = 2
                pairsArray = pairsArray.filter(ele => ele.isPublished === true && ele.isCommunityList === false)

                pairsArray = pairsArray.filter(ele => ele.name.startsWith(searchText))

            }
            else if (mode === 3) {
                viewMode = 3
                pairsArray = pairsArray.filter(ele => ele.isPublished === true && ele.isCommunityList === false)

                pairsArray = pairsArray.filter(ele => ele.userName.startsWith(searchText))
                if (!searchText) {
                    pairsArray = []
                }
            }
            else if (mode === 4) {
                viewMode = 4
                pairsArray = pairsArray.filter(ele => ele.isCommunityList === true)

                pairsArray = pairsArray.filter(ele => ele.name.startsWith(searchText))
            }

            if (mode !== store.viewMode) {
                storeReducer({
                    type: GlobalStoreActionType.SET_VIEW_MODE,
                    payload: {
                        idNamePairs: [],
                        viewMode: viewMode,
                        search: searchText
                    }
                });
            }

            storeReducer({
                type: GlobalStoreActionType.SET_VIEW_MODE,
                payload: {
                    idNamePairs: pairsArray,
                    viewMode: viewMode,
                    search: searchText
                }
            });
            tps.clearAllTransactions();
            history.push("/");
        }
    }

    store.searchText = async function (searchText) {
        store.setViewMode(store.viewMode, searchText)
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };