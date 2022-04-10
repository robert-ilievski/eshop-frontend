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
    name: yup.string('Enter your name').required('Name is required'),
    surname: yup.string('Enter your surname').required('Surname is required'),
    email: yup.string('Enter your email').required('Email is required'),
    username: yup.string('Enter your username').required('Username is required'),
    password: yup.string('Enter your password').required('Password is required')
        .oneOf([yup.ref('repeatPassword'), null], 'Passwords must match')
        .min(6, 'Password should be of minimum 6 characters length'),
    repeatPassword: yup.string('Please repeat your password').required('Repeat your password')
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .min(6, 'Password should be of minimum 6 characters length'),
});

const SignUpForm = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            username: '',
            password: '',
            repeatPassword: ''
        },
        validationSchema,
        onSubmit: values => {
            dispatch(AuthActions.signUp(values.name, values.surname, values.username, values.email,
                values.password, null, success => {
                    createSnackbar({
                        message: success ? 'Successfully signed up.' : 'Error while signing up. Try again!',
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
                    Create your account
                </h3>
            </div>
            <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                className={`mt-3`}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
                fullWidth
                id="surname"
                name="surname"
                label="Surname"
                className={`mt-3`}
                value={formik.values.surname}
                onChange={formik.handleChange}
                error={formik.touched.surname && Boolean(formik.errors.surname)}
                helperText={formik.touched.surname && formik.errors.surname}
            />
            <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                className={`mt-3`}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
            />
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
            <TextField
                fullWidth
                id="repeatPassword"
                name="repeatPassword"
                label="Repeat your password"
                type="password"
                className={`mt-3`}
                value={formik.values.repeatPassword}
                onChange={formik.handleChange}
                error={formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)}
                helperText={formik.touched.repeatPassword && formik.errors.repeatPassword}
            />
            <div className={`text-center p-2`}>
                <Link to="/signin">
                    <small>Already have an account? Sign in.</small>
                </Link>
            </div>
            <Button color="primary" variant="contained" fullWidth type="submit">
                Sign Up
            </Button>
        </form>
    );
});

export default SignUpForm;