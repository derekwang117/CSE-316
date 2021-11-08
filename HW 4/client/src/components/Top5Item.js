import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [draggedTo, setDraggedTo] = useState(0);

    function handleDragStart(event, targetId) {
        event.dataTransfer.setData("item", targetId);
    }

    function handleDragOver(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragEnter(event) {
        event.preventDefault();
        console.log("entering");
    }

    function handleDragLeave(event) {
        event.preventDefault();
        console.log("leaving");
        setDraggedTo(false);
    }

    function handleDrop(event, targetId) {
        event.preventDefault();
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        console.log("handleDrop (sourceId, targetId): ( " + sourceId + ", " + targetId + ")");

        // UPDATE THE LIST (supposed to be !=, not !==)
        if (sourceId != targetId) {
            store.addMoveItemTransaction(sourceId, targetId);
        }
    }

    let { index } = props;

    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("edit-item-".length);
            store.addUpdateItemTransaction(id - 1, text)
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let top5itemCard = (
        <ListItem
            disabled = {store.isItemEditActive}
            id={'item-' + (index + 1)}
            key={props.key}
            className={itemClass}
            onDragStart={(event) => {
                handleDragStart(event, (index + 1))
            }}
            onDragOver={(event) => {
                handleDragOver(event, (index + 1))
            }}
            onDragEnter={(event) => {
                handleDragEnter(event, (index + 1))
            }}
            onDragLeave={(event) => {
                handleDragLeave(event, (index + 1))
            }}
            onDrop={(event) => {
                handleDrop(event, (index + 1))
            }}
            draggable= {!store.isItemEditActive}
            sx={{ display: 'flex', p: 1 }}
            style={{
                fontSize: '48pt',
                width: '100%'
            }}
        >
            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleToggleEdit} aria-label='edit' disabled = {store.isItemEditActive}>
                    <EditIcon style={{ fontSize: '48pt' }} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1, flexGrow: 1 }}>{props.text}</Box>
        </ListItem>
    )
    if (editActive) {
        top5itemCard =
            <TextField
                required
                fullWidth
                id={"edit-item-" + (index + 1)}
                label="Item Name"
                className='top5-item'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={props.text}
                inputProps={{ style: { fontSize: 48 } }}
                InputLabelProps={{ style: { fontSize: 24 } }}
                autoFocus
            />
    }

    return (
        top5itemCard
    );
}

export default Top5Item;