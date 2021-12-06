import { useContext, useState } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FunctionsOutlinedIcon from '@mui/icons-material/FunctionsOutlined';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid'

import SortOutlinedIcon from '@mui/icons-material/SortOutlined';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [text, setText] = useState("");

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleView1 = () => {
        setText("")
        store.setViewMode(1, "", 0)
    }

    const handleView2 = () => {
        setText("")
        store.setViewMode(2, "", 0)
    }

    const handleView3 = () => {
        setText("")
        store.setViewMode(3, "", 0)
    }

    const handleView4 = () => {
        setText("")
        store.setViewMode(4, "", 0)
    }

    const sortPublishDateNew = () => {
        handleMenuClose();
        store.setViewMode(store.viewMode, text, 1)
    }

    const sortPublishDateOld = () => {
        handleMenuClose();
        store.setViewMode(store.viewMode, text, 2)
    }

    const sortViews = () => {
        handleMenuClose();
        store.setViewMode(store.viewMode, text, 3)
    }

    const sortLikes = () => {
        handleMenuClose();
        store.setViewMode(store.viewMode, text, 4)
    }

    const sortDislikes = () => {
        handleMenuClose();
        store.setViewMode(store.viewMode, text, 5)
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            store.searchText(text)
        }
    }

    const menuId = 'search-menu';
    const searchMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={sortPublishDateNew}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={sortPublishDateOld}>Publish Date (Oldest)</MenuItem>
            <MenuItem onClick={sortViews}>Views</MenuItem>
            <MenuItem onClick={sortLikes}>Likes</MenuItem>
            <MenuItem onClick={sortDislikes}>Dislikes</MenuItem>
        </Menu>
    );

    let coolColor = "black"
    let searchColor = "white"
    if (store.currentList) {
        coolColor = ""
        searchColor = "lightgray"
    }

    let viewBar = (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" style={{ background: "#c4c4c4", boxShadow: "none" }}>
                <Toolbar>
                    <IconButton
                        disabled={store.currentList || auth.user.userName === "GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest"}
                        aria-label='home'
                        onClick={handleView1}
                        style={{ color: auth.user.userName === "GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest" ? "" : coolColor }}
                        sx={store.currentList ? {} : store.viewMode === 1 ? { border: 3, borderRadius: 0, borderColor: "#43d61f" } : {}}>
                        <HomeOutlinedIcon style={{ fontSize: '40pt' }} />
                    </IconButton>
                    <IconButton
                        disabled={store.currentList}
                        aria-label='all'
                        onClick={handleView2}
                        style={{ color: coolColor }}
                        sx={store.viewMode === 2 ? { border: 3, borderRadius: 0, borderColor: "#43d61f" } : {}}>
                        <GroupsOutlinedIcon style={{ fontSize: '40pt' }} />
                    </IconButton>
                    <IconButton
                        disabled={store.currentList}
                        aria-label='users'
                        onClick={handleView3}
                        style={{ color: coolColor }}
                        sx={store.viewMode === 3 ? { border: 3, borderRadius: 0, borderColor: "#43d61f" } : {}}>
                        <PersonOutlineOutlinedIcon style={{ fontSize: '40pt' }} />
                    </IconButton>
                    <IconButton
                        disabled={store.currentList}
                        aria-label='community'
                        onClick={handleView4}
                        style={{ color: coolColor }}
                        sx={store.viewMode === 4 ? { border: 3, borderRadius: 0, borderColor: "#43d61f" } : {}}>
                        <FunctionsOutlinedIcon style={{ fontSize: '40pt' }} />
                    </IconButton>

                    <Grid item xs={12} sm={6} pl={3}>
                        <TextField
                            disabled={store.currentList}
                            id="search"
                            label="Search"
                            name="search"
                            fullWidth
                            sx={{ backgroundColor: searchColor }}
                            value={text}
                            onChange={handleUpdateText}
                            onKeyPress={(event) => { handleKeyPress(event) }}
                        />
                    </Grid>

                    <Box sx={{ flexGrow: 1 }}>
                    </Box>

                    <IconButton
                        disabled={store.currentList}
                        onClick={handleProfileMenuOpen}
                        aria-label='sort'
                        style={{ color: coolColor, fontSize: '20pt', fontWeight: 'bold' }}>
                        SORT BY
                        <SortOutlinedIcon style={{ fontSize: '40pt' }}
                            aria-controls={menuId}
                            aria-haspopup="true" />
                    </IconButton>

                </Toolbar>
            </AppBar>
            {
                searchMenu
            }
        </Box>
    )

    return (
        viewBar
    )
}