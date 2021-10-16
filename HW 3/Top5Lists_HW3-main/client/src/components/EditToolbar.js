import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    // how McKenna does it
    let undoButtonClass = "top5-button-disabled";
    let redoButtonClass = "top5-button-disabled";
    let closeButtonClass = "top5-button-disabled";
    if (store.canUndo() && store.canToolBar()) undoButtonClass = "top5-button";
    if (store.canRedo() && store.canToolBar()) redoButtonClass = "top5-button";
    if (store.canClose() && store.canToolBar()) closeButtonClass = "top5-button";

    //let enabledButtonClass = "top5-button";
    
    function handleUndo() {
        if (store.canUndo() && store.canToolBar()) {
            store.undo();
        }
    }
    function handleRedo() {
        if (store.canRedo() && store.canToolBar()) {
            store.redo();
        }
    }
    function handleClose() {
        if (store.canClose() && store.canToolBar()) {
            history.push("/");
            store.closeCurrentList();
        }
    }
    return (
        <div id="edit-toolbar">
            <div
                disabled={store.canToolBar()}
                id='undo-button'
                onClick={handleUndo}
                className={undoButtonClass}>
                &#x21B6;
            </div>
            <div
                disabled={store.canToolBar()}
                id='redo-button'
                onClick={handleRedo}
                className={redoButtonClass}>
                &#x21B7;
            </div>
            <div
                disabled={store.canToolBar()}
                id='close-button'
                onClick={handleClose}
                className={closeButtonClass}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;