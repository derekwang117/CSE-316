import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Link } from 'react-router-dom'

const Buttons = (
    <Stack spacing={2} direction="row">
        <Button variant="contained"><Link to='/register/'> Create Account </Link></Button>
        <Button variant="contained"><Link to='/login/'> Login </Link></Button>
        <Button variant="contained"><Link to='/login/'> Continue as Guest </Link></Button>
    </Stack>
)

export default function SplashScreen() {
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