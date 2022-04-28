import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import AdminPanel from "../views/admin/AdminPanel";
import CategoryForm from "../views/admin/category/CategoryForm";
import Roles from "../enumerations/Roles";
import HomePage from "../views/HomePage";
import SignInForm from "../views/auth/SignInForm";
import SignUpForm from "../views/auth/SignUpForm";
import ProductView from "../views/products/ProductView";
import InvalidTokenView from "../views/user/InvalidTokenView";
import SentEmailView from "../views/user/SentEmailView";
import ChangePasswordForm from "../views/user/ChangePasswordForm";
import ForgotPasswordForm from "../views/user/ForgotPasswordForm";
import ProductForm from "../views/products/ProductForm";

export const PrivateRoutes = [
    {
        component: AdminPanel,
        path: '/admin',
        title: 'Admin Panel',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
    {
        component: CategoryForm,
        path: '/categories/add',
        title: 'Add Category',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
    {
        component: CategoryForm,
        path: '/categories/edit/:categoryId',
        title: 'Edit Category',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
    {
        component: ProductForm,
        path: '/products/add',
        title: 'Add Product',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
    {
        component: ProductForm,
        path: '/products/edit/:productId',
        title: 'Edit Product',
        exact: true,
        permission: [
            Roles.ADMIN
        ]
    },
];

export const PublicRoutes = [
    {
        component: HomePage,
        path: '/',
        title: 'Home',
        exact: true,
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: SignInForm,
        path: '/signin',
        title: 'Sign In',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: SignUpForm,
        path: '/signup',
        title: 'Sign Up',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: ForgotPasswordForm,
        path: '/forgot-password',
        title: 'Forgot Password',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: ChangePasswordForm,
        path: '/change-password/:authToken',
        title: 'Change Password',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: SentEmailView,
        path: '/forgot-password/sent-email',
        title: 'Successfully sent email',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: InvalidTokenView,
        path: '/forgot-password/invalid-token',
        title: 'Invalid Token',
        permission: [
            Roles.ADMIN,
            Roles.USER,
            Roles.POSTMAN
        ]
    },
    {
        component: ProductView,
        path: '/products',
        title: 'Products',
        permission: [
            Roles.ADMIN,
            Roles.USER
        ]
    },
];

const AllRoutes = [...PrivateRoutes, ...PublicRoutes];

export const filterRoutes = (roleParam) => {
    return AllRoutes.filter(route => {
        if (route.permission.includes(roleParam)) {
            return true;
        }
        return false;
    });
};

const RoutesConfig = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const [role, setRole] = useState(Roles.USER);

    useEffect(() => {
        if (currentUser) {
            setRole(currentUser.role);
        }
    }, [currentUser]);

    return (
        <Switch>
            {
                filterRoutes(role).map(route =>
                    <Route key={route.path} path={route.path} exact component={route.component} />
                )
            }
        </Switch>
    );
};
export default RoutesConfig;