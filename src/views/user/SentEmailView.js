import {Link} from 'react-router-dom';
import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons";

const SentEmailView = () => {
    return (
        <div className={`container text-center w-75 pt-5`}>
            <FontAwesomeIcon icon={faCheckCircle} size='6x' className={`checkCircleColor`}/>
            <h2>
                We've just sent you an email!
            </h2>
            <h3>
                Please follow the link in the email to change your password.
            </h3>
            <p>
                If it doesn't arrive soon, check your spam folder or {" "}
                <Link to={'/forgot-password'}>
                    send the email again
                </Link>
                .
            </p>
        </div>
    );
}

export default SentEmailView;