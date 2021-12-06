import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { idNamePair } = props;
    const [expanded, setExpanded] = useState(false);
    const [text, setText] = useState("");

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    async function handleUpvote(event, id) {
        event.stopPropagation();
        if (idNamePair.upvotes.includes(store.getUserName())) {
            store.vote(id, 0)
        }
        else {
            store.vote(id, 1)
        }
    }

    async function handleDownvote(event, id) {
        event.stopPropagation();
        if (idNamePair.downvotes.includes(store.getUserName())) {
            store.vote(id, 0)
        }
        else {
            store.vote(id, -1)
        }
    }

    async function handleExpand(event, id) {
        event.stopPropagation();
        setExpanded(!expanded)
        if (!expanded) {
            store.view(id)
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleKeyPress(event, id) {
        if (event.code === "Enter" && text !== "") {
            store.newComment(id, text);
            setText("");
        }
    }

    const intToMonth = ["January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"]
    function dateToString(date) {
        return intToMonth[parseInt(date.substring(5, 7)) - 1] + " " + parseInt(date.substring(8, 10), 10) + ", " + date.substring(0, 4)
    }

    let upvoteButtonColor = ""
    if (idNamePair.upvotes.includes(store.getUserName())) {
        upvoteButtonColor = "green"
    }
    let downvoteButtonColor = ""
    if (idNamePair.downvotes.includes(store.getUserName())) {
        downvoteButtonColor = "red"
    }

    let expandedCard = ""
    let expandedComments = ""
    if (expanded) {
        expandedCard = (
            <div id="expanded-list">
                <List>
                    <ListItem>
                        <Typography
                            style={{ color: "#d4af37", fontSize: '20pt', fontWeight: 'bold' }}>
                            {"1. " + idNamePair.items[0]}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography
                            style={{ color: "#d4af37", fontSize: '20pt', fontWeight: 'bold' }}>
                            {"2. " + idNamePair.items[1]}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography
                            style={{ color: "#d4af37", fontSize: '20pt', fontWeight: 'bold' }}>
                            {"3. " + idNamePair.items[2]}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography
                            style={{ color: "#d4af37", fontSize: '20pt', fontWeight: 'bold' }}>
                            {"4. " + idNamePair.items[3]}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <Typography
                            style={{ color: "#d4af37", fontSize: '20pt', fontWeight: 'bold' }}>
                            {"5. " + idNamePair.items[4]}
                        </Typography>
                    </ListItem>
                </List>
            </div>
        )
        expandedComments = (
            <div>
                <List sx={{ pt: 0, mb: 1 }} style={{ minHeight: 226, maxHeight: 226, overflow: 'auto' }}>
                    {
                        idNamePair.comments.map((ele) => (
                            <ListItem
                                className="comment"
                                sx={{ mb: 1 }}
                            >
                                <Box>
                                    <Box>
                                        <Typography
                                            style={{ color: "darkblue", fontWeight: "bold" }}>
                                            {ele.userName}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography>
                                            {ele.comment}
                                        </Typography>
                                    </Box>
                                </Box>
                            </ListItem>
                        ))
                    }
                </List>
                <TextField
                    id="comment-bar"
                    label="Add Comment"
                    name="comment-bar"
                    fullWidth
                    sx={{ backgroundColor: "#FFFFFF" }}
                    value={text}
                    onChange={handleUpdateText}
                    onKeyPress={(event) => { handleKeyPress(event, idNamePair._id) }}
                />
            </div>
        )
    }

    let cardElement = (
        <div id="unpublished-listcard">
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
            >
                <Grid container spacing={0}>
                    <Grid item xs={11.05}>
                        <Box >
                            <Typography
                                style={{ color: "black", fontSize: '20pt', fontWeight: 'bold' }}>
                                {idNamePair.name}
                            </Typography>
                        </Box>
                        <Box sx={{ pt: 0 }}>
                            <Typography
                                style={{ color: "black" }}>
                                {"By " + idNamePair.userName}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={0.95}>
                        <div>
                            <IconButton onClick={(event) => {
                                handleDeleteList(event, idNamePair._id)
                            }} aria-label='delete'>
                                <DeleteOutlineOutlinedIcon style={{ fontSize: '32pt' }} />
                            </IconButton>
                        </div>
                    </Grid>
                    <Grid item xs={0.5} sx={{ pt: 4 }}>
                        <Link
                            to=''
                            onClick={(event) => { handleLoadList(event, idNamePair._id) }}>
                            <Typography
                                style={{ color: "red" }}>
                                Edit
                            </Typography>
                        </Link>
                    </Grid>
                </Grid>
            </ListItem>
        </div>
    )

    if (idNamePair.isPublished) {
        cardElement = (
            <div id="published-listcard">
                <ListItem
                    id={idNamePair._id}
                    key={idNamePair._id}
                >
                    <Grid container spacing={0}>
                        <Grid item xs={9.5}>
                            <Box >
                                <Typography
                                    style={{ color: "black", fontSize: '20pt', fontWeight: 'bold' }}>
                                    {idNamePair.name}
                                </Typography>
                            </Box>
                            <Box sx={{ pt: 0 }}>
                                <Typography
                                    style={{ color: "black" }}>
                                    {idNamePair.userName ? "By " + idNamePair.userName : "Community List"}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={2.5} alignItems="ce">
                            <div>
                                <IconButton onClick={(event) => {
                                    handleUpvote(event, idNamePair._id)
                                }} aria-label='delete'>
                                    <ThumbUpOutlinedIcon style={{ fontSize: '32pt', color: upvoteButtonColor }} />
                                </IconButton>

                                <IconButton
                                    disabled
                                    style={{ color: "black" }}
                                    sx={{ flexGrow: 1 }}>
                                    {idNamePair.upvotes.length}
                                </IconButton>

                                <IconButton onClick={(event) => {
                                    handleDownvote(event, idNamePair._id)
                                }} aria-label='delete'>
                                    <ThumbDownOutlinedIcon style={{ fontSize: '32pt', color: downvoteButtonColor }} />
                                </IconButton>

                                <IconButton
                                    disabled
                                    style={{ color: "black" }}
                                    sx={{ flexGrow: 1 }}>
                                    {idNamePair.downvotes.length}
                                </IconButton>

                                <IconButton onClick={(event) => {
                                    handleDeleteList(event, idNamePair._id)
                                }} aria-label='delete'>
                                    <DeleteOutlineOutlinedIcon style={{ fontSize: '32pt' }} />
                                </IconButton>
                            </div>
                        </Grid>

                        <Grid item xs={6} sx={{ pt: 1 }}>
                            {expandedCard}
                        </Grid>
                        <Grid item xs={6} sx={{ pt: 1 }}>
                            {expandedComments}
                        </Grid>

                        <Grid item xs={9.5}>
                            <Box sx={{ pt: 2, pb: 1 }}>
                                <Typography
                                    style={{ color: "black" }}>
                                    {"Published: " + dateToString(idNamePair.updatedAt)}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={2.5}>
                            <div>
                                <IconButton
                                    disabled
                                    style={{ color: "black", fontSize: '12pt' }}
                                    sx={{ flexGrow: 1 }}>
                                    {"Views: " + idNamePair.views}
                                </IconButton>
                                <IconButton disabled>
                                </IconButton>
                                <IconButton disabled>
                                </IconButton>
                                <IconButton disabled>
                                </IconButton>
                                <IconButton disabled>
                                </IconButton>
                                <IconButton disabled>
                                </IconButton>
                                <IconButton disabled>
                                </IconButton>
                                <IconButton onClick={(event) => {
                                    handleExpand(event, idNamePair._id)
                                }} aria-label='delete'>
                                    <ExpandMoreIcon style={{ fontSize: '32pt' }} />
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>
                </ListItem>
            </div >
        )
    }

    return (
        cardElement
    );
}

export default ListCard;