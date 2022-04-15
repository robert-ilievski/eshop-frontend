import {wrapComponent} from "react-snackbar-alert";
import {useHistory, useParams} from "react-router";
import * as yup from "yup";
import {useDispatch} from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {UserActions} from "../../redux/actions/userActions";
import {AuthActions} from "../../redux/actions/authActions";
import * as Yup from "yup";
import InputLabel from "@mui/material/InputLabel";

const validationSchema = yup.object({
    newPassword: yup.string('Enter your password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('Password is required')
        .oneOf([Yup.ref('repeatNewPassword'), null], 'Passwords must match'),
    repeatNewPassword: yup.string('Repeat new password')
        .min(6, 'Password should be of minimum 6 characters length')
        .required('It is required to repeat the new password')
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

const ChangePasswordForm = wrapComponent(function ({createSnackbar}) {
    const {authToken} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const [userId, setUserId] = useState('');

    useEffect(() => {
        dispatch(AuthActions.authenticateToken(authToken, (success, response) => {
            if (success) {
                setUserId(response.data)
            } else {
                history.push("/forgot-password/invalid-token");
            }
        }));
    }, []);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            repeatNewPassword: ''
        },
        validationSchema,
        onSubmit: values => {
            dispatch(
                UserActions.changePassword({
                        userId: userId,
                        newPassword: values.newPassword
                    },
                    success => {
                        if (Boolean(success)) {
                            createSnackbar({
                                message: "Successfully changed password",
                                timeout: 2500,
                                theme: 'success'
                            });
                            history.push('/signin');
                        } else {
                            createSnackbar({
                                message: "Error changing password",
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
            <div>
                <h3>Enter new password</h3>
            </div>
            <InputLabel className={`pt-3`}>
                New Password
            </InputLabel>
            <TextField fullWidth
                       id='newPassword' name='newPassword'
                       value={formik.values.newPassword}
                       type='password'
                       onChange={formik.handleChange}
                       error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                       helperText={formik.touched.newPassword && formik.errors.newPassword}
            >
            </TextField>
            <InputLabel className={`pt-2`}>
                Repeat New Password
            </InputLabel>
            <TextField fullWidth
                       id='repeatNewPassword' name='repeatNewPassword'
                       value={formik.values.repeatNewPassword}
                       type='password'
                       onChange={formik.handleChange}
                       error={formik.touched.repeatNewPassword && Boolean(formik.errors.repeatNewPassword)}
                       helperText={formik.touched.repeatNewPassword && formik.errors.repeatNewPassword}
            >
            </TextField>
            <Button color="primary" variant="contained" fullWidth type="submit"
                    className={`mt-3`}
            >
                Submit
            </Button>
        </form>
    );

})

export default ChangePasswordForm;