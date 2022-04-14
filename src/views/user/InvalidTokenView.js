import {Link} from 'react-router-dom';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

const InvalidTokenView = () => {
    return (
        <div className={`container w-75 text-center pt-5`}>
                <FontAwesomeIcon icon={faTimesCircle} size='6x' className={`timesCircleColor`}/>
                <h2>
                    Invalid token!
                </h2>
                <h3>
                    Sorry, it seems like your token is invalid or has expired.
                </h3>
                <p>
                    In order to reset your password {" "}
                    <Link to={'/forgot-password'}>
                        click here
                    </Link>
                    .
                </p>
        </div>
    );
}

export default InvalidTokenView;