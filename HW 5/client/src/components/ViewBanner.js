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

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const sortPublishDateNew = () => {
        handleMenuClose();

    }

    const sortPublishDateOld = () => {
        handleMenuClose();

    }

    const sortViews = () => {
        handleMenuClose();

    }

    const sortLikes = () => {
        handleMenuClose();

    }

    const sortDislikes = () => {
        handleMenuClose();

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
                        disabled={store.currentList}
                        aria-label='home'
                        style={{ color: coolColor }}>
                        <HomeOutlinedIcon style={{ fontSize: '40pt' }} />
                    </IconButton>
                    <IconButton
                        disabled={store.currentList}
                        aria-label='all'
                        style={{ color: coolColor }}>
                        <GroupsOutlinedIcon style={{ fontSize: '40pt' }} />
                    </IconButton>
                    <IconButton
                        disabled={store.currentList}
                        aria-label='users'
                        style={{ color: coolColor }}>
                        <PersonOutlineOutlinedIcon style={{ fontSize: '40pt' }} />
                    </IconButton>
                    <IconButton
                        disabled={store.currentList}
                        aria-label='community'
                        style={{ color: coolColor }}>
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
                        />
                    </Grid>

                    <Box sx={{ flexGrow: 1 }}>
                    </Box>

                    <IconButton
                        disabled={store.currentList}
                        aria-label='sort'
                        style={{ color: coolColor, fontSize: '20pt', fontWeight: 'bold' }}>
                            SORT BY
                        <SortOutlinedIcon style={{ fontSize: '40pt' }}
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen} />
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