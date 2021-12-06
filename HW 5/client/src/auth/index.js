import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOG_IN: "LOG_IN",
    LOG_IN_ERROR: "LOG_IN_ERROR",
    CLOSE_MODAL: "CLOSE_MODAL",
    GET_LOGGED_OUT: "GET_LOGGED_OUT",
    LOG_AS_GUEST: "LOG_AS_GUEST"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        error: ""
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    error: auth.error
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: auth.error
                })
            }
            case AuthActionType.LOG_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: auth.error
                })
            }
            case AuthActionType.LOG_IN_ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    error: payload.error
                })
            }
            case AuthActionType.CLOSE_MODAL: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    error: ""
                })
            }
            case AuthActionType.GET_LOGGED_OUT: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    error: ""
                })
            }
            case AuthActionType.LOG_AS_GUEST: {
                return setAuth({
                    user: null,
                    loggedIn: true,
                    error: ""
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            if (response.data.user.userName !== "GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest") {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
            }
            else {
                auth.logoutUser()
            }
        }
        else if (response.status === 401) {
            authReducer({
                type: AuthActionType.GET_LOGGED_OUT,
                payload: {

                }
            })
        }
    }

    auth.registerUser = async function (userData, store) {
        const response = await api.registerUser(userData);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
        else if (response.status === 400) {
            authReducer({
                type: AuthActionType.LOG_IN_ERROR,
                payload: {
                    error: response.data.errorMessage
                }
            })
        }
    }

    auth.closeModal = async function () {
        authReducer({
            type: AuthActionType.CLOSE_MODAL,
            payload: {

            }
        })
    }

    auth.loginUser = async function (userData, store) {
        const response = await api.loginUser(userData);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOG_IN,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
        else if (response.status === 400) {
            authReducer({
                type: AuthActionType.LOG_IN_ERROR,
                payload: {
                    error: response.data.errorMessage
                }
            })
        }
    }

    auth.logoutUser = async function (userData, store) {
        const response = await api.logoutUser()
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_OUT,
                payload: {

                }
            })
        }
    }

    auth.loginGuest = async function (store) {
        let userData = {
            email: 'GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest',
            userName: 'GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest',
            password: 'GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest'
        }
        const response = await api.loginUser(userData);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOG_IN,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
        else if (response.status === 400) {
            auth.registerUser({
                firstName: "GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest",
                lastName: "GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest",
                email: "GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest",
                userName: "GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest",
                password: "GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest",
                passwordVerify: "GuestGuestGuestGuestGuestGuestGuestGuestGuestGuest"
            }, store);
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };