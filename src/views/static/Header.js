import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useLocation} from 'react-router';
import {Link} from 'react-router-dom';
import Roles from '../../enumerations/Roles';
import {AuthButton} from '../../components/AuthButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/fontawesome-free-solid';

const Header = () => {
    let location = useLocation();
    const auth = useSelector(state => state.auth.currentUser);

    const [path, setPath] = useState(location);
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        setPath(location.pathname.split('/')[1]);
        if (auth) {
            setRole(auth.role);
            setUsername(auth.username);
        }
    }, [location, auth]);

    const activePath = (tabPath) => {
        return path === tabPath ? 'header-active' : ''
    }

    return (
        <div className={`navbar navbar-dark bg-dark navbar-expand-lg`}>
            <div className={`container`}>
                <Link
                    to="/"
                    replace={false}
                    className={`navbar-brand shadow-outer ${activePath('')}`}
                >
                    Home
                </Link>
                <ul className={`navbar-nav`}>
                    {
                        role === Roles.POSTMAN ? (
                            <Link
                                to={`/postman-orders/${username}`}
                                replace={false}
                                className={`nav-link nav-item shadow-outer ${activePath('/products')}`}
                            >
                                Orders
                            </Link>
                        ) : (
                            <Link
                                to="/products"
                                replace={false}
                                className={`nav-link nav-item shadow-outer ${activePath('/products')}`}
                            >
                                Products
                            </Link>
                        )
                    }
                    {
                        role === Roles.USER || role == Roles.ADMIN ?
                            (
                                <React.Fragment>
                                    <Link
                                        to={`/shopping-cart/${username}`}
                                        replace={false}
                                        className={`nav-link nav-item shadow-outer 
                                        ${activePath(`/shopping-cart/${username}`)}`}
                                    >
                                        <FontAwesomeIcon size={`lg`} icon={faShoppingCart} /> Cart
                                    </Link>
                                    <Link
                                        to={`/my-orders/${username}`}
                                        replace={false}
                                        className={`nav-link nav-item shadow-outer 
                                        ${activePath(`/my-orders/${username}`)}`}
                                    >
                                        My Orders
                                    </Link>
                                </React.Fragment>
                            )
                            :
                            null
                    }
                    {role === Roles.ADMIN ?
                        (
                            <React.Fragment>
                                <Link
                                    to={`/all`}
                                    replace={false}
                                    className={`nav-link nav-item shadow-outer 
                                        ${activePath(`/all`)}`}
                                >
                                    All Orders
                                </Link>
                                <Link
                                    to="/admin"
                                    replace={false}
                                    className={`nav-link nav-item shadow-outer ${activePath('admin')}`}
                                >
                                    Admin
                                </Link>
                            </React.Fragment>
                        )
                        :
                        null
                    }
                    <li className={`nav-item`}>
                        <AuthButton path={path}/>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Header;