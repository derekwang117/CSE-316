import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'

import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);

    let text = "";
    if (store.currentList)
        text = store.currentList.name;

    function handleCreateNewList() {
        store.createNewList();
    }

    let createListButton = (
        <div id="top5-statusbar">
            <Fab
                disabled={store.isListNameEditActive}
                color="primary"
                aria-label="add"
                id="add-list-button"
                size="medium"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
            <Typography variant="h3">Your Lists</Typography>
        </div>
    )

    let statusBarName = (
        <div id="top5-statusbar">
            <Typography variant="h4">{text}</Typography>
        </div>
    )

    let display = createListButton
    if (store.currentList) {
        display = null
    }
    if (store.viewMode !== 1) {
        display = (
            <div id="top5-statusbar">
                <Typography variant="h3">{store.getSearchBar()}</Typography>
            </div>
        )
    }
    
    return (
        display
    );
}

export default Statusbar;