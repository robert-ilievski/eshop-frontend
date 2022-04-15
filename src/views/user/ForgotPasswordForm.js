import {wrapComponent} from 'react-snackbar-alert';
import * as yup from "yup";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router";
import {useFormik} from "formik";
import {UserActions} from "../../redux/actions/userActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";

const validationSchema = yup.object({
    email: yup.string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
});

const ForgotPasswordForm = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            email: ''
        },
        validationSchema,
        onSubmit: values => {
            dispatch(
                UserActions.forgotPassword({
                        email: values.email,
                    },
                    success => {
                        if (Boolean(success)) {
                            history.push('/forgot-password/sent-email');
                        } else {
                            createSnackbar({
                                message: "Couldn't send email. Try again later.",
                                timeout: 2500,
                                theme: 'error'
                            });
                        }
                    }
                )
            );
        }
    })

    return (
        <form className={`container w-50 pt-5`} onSubmit={formik.handleSubmit}>
            <h4>
                Please enter your email in order to reset your password.
            </h4>
            <TextField fullWidth
                       id='email' name='email' label='example@email.com'
                       className={`mt-3`}
                       value={formik.values.email}
                       onChange={formik.handleChange}
                       error={formik.touched.email && Boolean(formik.errors.email)}
                       helperText={formik.touched.email && formik.errors.email}
            >
            </TextField>
            <Button color="primary" variant="contained" fullWidth type="submit"
                    className={`mt-3`}
            >
                Send
            </Button>
        </form>
    );
})

export default ForgotPasswordForm;