import {wrapComponent} from "react-snackbar-alert";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router";
import {OrderActions} from "../../redux/actions/orderActions";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import {sortElementsByDateCreated, transformDate} from "../../utils/utils";
import {getOrderStatusName} from "../../enumerations/OrderStatus";

const MyOrders = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const auth = useSelector(state => state.auth.currentUser);
    const [orders, setOrders] = useState(null);
    const {username} = useParams();

    useEffect(() => {
        dispatch(OrderActions.fetchOrders(username, (success, response) => {
            if (success) {
                if (response.data.length > 0) {
                    if (username === response.data[0].userUsername) {
                        setOrders(sortElementsByDateCreated(response.data));
                    } else {
                        createSnackbar({
                            message: 'Sorry, you must be signed in in order to see your orders.',
                            timeout: 3000,
                            theme: 'error'
                        });
                        history.goBack();
                    }
                }
            } else {
                createSnackbar({
                    message: 'Error while accessing your orders.',
                    timeout: 2500,
                    theme: 'error'
                });
                history.goBack();
            }
        }));
    }, []);

    const calculateTotalPrice = products => {
        let totalPrice = 0;
        products.map(product => (
            totalPrice = totalPrice + product.priceInMKD * product.quantity
        ))
        return totalPrice;
    }

    if (Boolean(auth) && auth.username === username) {
        return (
            <div className={`container p-5`}>
                <div className={`pb-3 mb-3`}>
                    <h3>
                        My Orders
                    </h3>
                </div>
                <TableContainer component={Paper}>
                    <Table className={``} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"/>
                                <TableCell align="left">Products</TableCell>
                                <TableCell align="left">Address Details</TableCell>
                                <TableCell align="left">Date</TableCell>
                                <TableCell align="left">Price</TableCell>
                                <TableCell align="left">Order Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders && orders.map((order, i) => (
                                <TableRow key={order.id}>
                                    <TableCell component="th" scope="row" name="order" padding="none"
                                               align="center">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell align="left">
                                        {
                                            order.productsInOrder.map((product, i) => (
                                                <div>{product.productTitle} X{product.quantity}</div>
                                            ))
                                        }
                                    </TableCell>
                                    <TableCell align="left">{order.address} {order.city}</TableCell>
                                    <TableCell align="left">{transformDate(order.dateCreated)}</TableCell>
                                    <TableCell align="left">{calculateTotalPrice(order.productsInOrder)} MKD</TableCell>
                                    <TableCell align="left">{getOrderStatusName(order.orderStatus)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className={`pt-3 float-left`}>
                    <Button component={Link}
                            color="primary"
                            variant="contained"
                            className={`text-white text-decoration-none`}
                            to={`/products`}
                    >
                        Continue shopping
                    </Button>
                </div>
            </div>
        );
    } else {
        return (
            <div className={`container pt-5 w-50`}>
                <h3 className={`text-center`}>You must be signed in to see your orders.</h3>
                <div className={`row my-4`}>
                    <div className={`col`}>
                        <Button component={Link} to={`/products`}
                                color="primary" variant="outlined" fullWidth>
                            Products
                        </Button>
                    </div>
                    <div className={`col`}>
                        <Button component={Link} to={`/signin`}
                                color="primary" variant="contained" fullWidth
                                className={`text-white`}
                        >
                            Sign in
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
});

export default MyOrders;