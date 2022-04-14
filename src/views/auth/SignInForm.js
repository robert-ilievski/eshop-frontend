import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {useFormik} from 'formik';
import React from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {wrapComponent} from 'react-snackbar-alert';
import * as yup from 'yup';
import {AuthActions} from '../../redux/actions/authActions';
import {Link} from 'react-router-dom'

const validationSchema = yup.object({
    username: yup.string('Enter your username').required('Username is required'),
    password: yup
        .string('Enter your password')
        .required('Password is required')
});

const SignInForm = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema,
        onSubmit: values => {
            const {username, password} = values;
            dispatch(AuthActions.signIn(username, password, success => {
                createSnackbar({
                    message: success ? 'Successfully signed in' : 'Incorrect Username or Password',
                    timeout: 2500,
                    theme: success ? 'success' : 'error'
                });
                success && history.push('/');
            }));
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} className={`container w-50 pt-5`}>
            <div>
                <h3>
                    Sign in
                </h3>
            </div>
            <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                className={`mt-3`}
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                autoFocus
            />
            <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                className={`mt-3`}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
            />
            <div className={`text-center pt-2`}>
                <Link to="/forgot-password">
                    <small>Forgot your password?</small>
                </Link>
            </div>
            <div className={`text-center pb-2`}>
                <small>
                    Don't have an account? &nbsp;
                    <Link to="/signup">
                        Sign up here.
                    </Link>
                </small>
            </div>
            <Button color="primary" variant="contained" fullWidth type="submit">
                Sign in
            </Button>
        </form>
    );
});

export default SignInForm;