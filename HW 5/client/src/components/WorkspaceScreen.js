import { useContext, useState } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid'

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import ViewBanner from './ViewBanner.js';

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);

    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");

    function handleClose() {
        store.closeCurrentList();
    }
    function handlePublish() {
        store.publishList(store.currentList);
        store.closeCurrentList();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        /*
        if (newActive) {
            store.setIsListNameEditActive();
        }*/
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            store.changeListName(store.currentList._id, text);
            toggleEdit();
        }
    }

    function handleBlur() {
        store.changeListName(store.currentList._id, text);
        toggleEdit();
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let editItems = "";
    if (store.currentList) {
        editItems =
            <List id="edit-items" sx={{ pt: 0 }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item
                            key={'top5-item-' + (index + 1)}
                            text={item}
                            index={index}
                        />
                    ))
                }
            </List>;
    }

    let defaultText = store.currentList.name

    let publishAllowed = store.checkAllowPublish()

    let publishButton = (
        <Button variant="contained" style={{
            minWidth: '15em', minHeight: '4em',
            color: "black", backgroundColor: "lightgray",
            border: "1px solid black"
        }}
            onClick={handlePublish}
            disabled={false}
        >Publish</Button>
    )
    if (!publishAllowed) {
        publishButton = (
            <Button variant="contained" style={{
                minWidth: '15em', minHeight: '4em',
                color: "gray", backgroundColor: "lightgray",
                border: "1px solid black"
            }}
                onClick={handlePublish}
                disabled={true}
            >Publish</Button>
        )
    }

    let viewBanner = < ViewBanner />

    return (
        <div>
            {viewBanner}
            <div id="top5-workspace">
                <Grid item sx={12} sm={6} pl={3} pt={1}>
                    <TextField
                        id="name"
                        label="Name"
                        name="name"
                        fullWidth
                        sx={{ backgroundColor: "#FFFFFF" }}
                        onClick={handleToggleEdit}
                        className='list-card'
                        onKeyPress={handleKeyPress}
                        onChange={handleUpdateText}
                        onBlur={handleBlur}
                        defaultValue={defaultText}
                    />
                </Grid>
                <div id="workspace-edit">
                    <div id="edit-numbering">
                        <div className="item-number"><Typography variant="h3">1.</Typography></div>
                        <div className="item-number"><Typography variant="h3">2.</Typography></div>
                        <div className="item-number"><Typography variant="h3">3.</Typography></div>
                        <div className="item-number"><Typography variant="h3">4.</Typography></div>
                        <div className="item-number"><Typography variant="h3">5.</Typography></div>
                    </div>
                    {editItems}
                    <Stack spacing={2} direction="row"
                        style={{ marginTop: 510, marginLeft: 950 }}>
                        <Button variant="contained" style={{
                            minWidth: '15em', minHeight: '4em',
                            color: "black", backgroundColor: "lightgray",
                            border: "1px solid black"
                        }} onClick={handleClose}
                        >Save</Button>
                        {publishButton}
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export default WorkspaceScreen;