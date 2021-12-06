import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Link } from 'react-router-dom'

import { useContext } from 'react';

import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext)

    const Buttons = (
        <Stack spacing={2} direction="row">
            <Button variant="contained"><Link to='/register/'> Create Account </Link></Button>
            <Button variant="contained"><Link to='/login/'> Login </Link></Button>
            <Button variant="contained"><Link to=''
            onClick={(event) => { auth.loginGuest(store) }}> Continue as Guest </Link></Button>
        </Stack>
    )

    return (
        <div id="splash-screen">
            <h1>
                Welcome to the<br />
                Top 5 Lister
            </h1>
            <p>
                Make and share your<br />
                your top 5 lists
            </p>
            <p>
                <small>
                    Made by Derek Wang
                </small>
            </p>
            {Buttons}
        </div>
    )
}