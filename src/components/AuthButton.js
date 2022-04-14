import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {AuthActions} from '../redux/actions/authActions';
import {wrapComponent} from "react-snackbar-alert";

export const AuthButton = wrapComponent( function ({ path, createSnackbar }) {
    const auth = useSelector(state => state.auth.currentUser);
    const dispatch = useDispatch();

    const signOut = () => {
        dispatch(AuthActions.signOut());
        window.location = '/';
        createSnackbar({
            message: "Successfully signed out.",
            timeout: 2500,
            theme: 'success'
        });
    };

    return (
        <React.Fragment>
            {
                !Boolean(auth) ? <Link
                        to="/signin"
                        replace={false}
                        className={`nav-link shadow-outer 
                        ${path === 'signin' ? 'header-active' : null}`}
                    >
                        SIGN IN
                    </Link>
                    :
                    <Link
                        onClick={signOut}
                        className={`nav-link shadow-outer`}
                    >
                        SIGN OUT
                    </Link>
            }
        </React.Fragment>
    );
});