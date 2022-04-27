import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {useFormik} from 'formik';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {wrapComponent} from 'react-snackbar-alert';
import * as yup from 'yup';
import {RegionDropdown} from "react-country-region-selector";
import {UserActions} from "../../redux/actions/userActions";

const validationSchema = yup.object({
    name: yup.string('Enter your name').required('Name is required'),
    surname: yup.string('Enter your surname').required('Surname is required'),
    email: yup.string('Enter your email').required('Email is required'),
    username: yup.string('Enter your username').required('Username is required'),
});

const PostmanForm = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [region, setRegion] = useState("");

    const selectRegion = (region) => {
        setRegion(region)
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            username: '',
        },
        validationSchema,
        onSubmit: values => {
            dispatch(UserActions.createPostman({
                name: values.name,
                surname: values.surname,
                email: values.email,
                username: values.username,
                role: 'ROLE_POSTMAN',
                city: region
            }, success => {
                createSnackbar({
                    message: success ? 'Successfully created postman.' : 'Error while creating postman. Try again!',
                    timeout: 2500,
                    theme: success ? 'success' : 'error'
                });
                success && history.push('/admin');
            }));
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} className={`container w-50 pt-5`}>
            <div>
                <h3>
                    Create Postman
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
            <div className={`mt-3`}>
                <RegionDropdown
                    id="region"
                    name="region"
                    country={`Macedonia, Republic of`}
                    required={true}
                    value={region}
                    defaultOptionLabel={`Select city`}
                    onChange={(region) => selectRegion(region)}/>
            </div>
            <div className={`mt-3`}>

            </div>
        </form>
    );
});

export default PostmanForm;
