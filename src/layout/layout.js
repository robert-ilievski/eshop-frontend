import React  from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "../views/static/Header";

export const Layout = props => {
    return (
        <>
            <BrowserRouter>
                <Header />
                <main>{props.children}</main>
            </BrowserRouter>
        </>
    );
};