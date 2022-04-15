import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

export const PrivateRoutes = [

];

export const PublicRoutes = [

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