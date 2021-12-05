import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import List from '@mui/material/List';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import ViewBanner from './ViewBanner.js'

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    let listCard = "";
    if (store) {
        listCard =
            <List sx={{ width: '90%', left: '5%' }}>
                {
                    store.idNamePairs.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                        />
                    ))
                }
            </List>;
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    let name = ""
    if (store.listMarkedForDeletion) {
        name = store.listMarkedForDeletion.name
    }

    let viewBanner = < ViewBanner />

    let modal = (
        <div>
            <Modal
                open={!!store.listMarkedForDeletion}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="warning">Delete the {name} Top 5 List?</Alert>
                    </Stack>
                    <Button variant="outlined" onClick={store.deleteMarkedList}>Confirm</Button>
                    <Button variant="contained" onClick={store.unmarkListForDeletion} autoFocus>Cancel</Button>
                </Box>
            </Modal>
        </div>
    )

    return (
        <div>
            {viewBanner}
            <div id="top5-list-selector">
                <div id="list-selector-list">
                    {
                        listCard
                    }
                </div>
                {modal}
            </div>
        </div>)
}

export default HomeScreen;