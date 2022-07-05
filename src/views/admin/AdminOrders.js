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
import {MenuItem, Select} from "@mui/material";
import OrderStatus, {getOrderStatusName} from "../../enumerations/OrderStatus";

const AdminOrders = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const auth = useSelector(state => state.auth.currentUser);
    const [orders, setOrders] = useState(null);

    useEffect(() => {
        dispatch(OrderActions.fetchOrdersByAdmin((success, response) => {
            if (success) {
                setOrders(sortElementsByDateCreated(response.data));
            } else {
                createSnackbar({
                    message: 'Error while accessing your assigned orders.',
                    timeout: 2500,
                    theme: 'error'
                });
                history.goBack();
            }
        }));
    }, []);

    const handleOrderStatusChange = (orderId, orderStatus) => {
        dispatch(OrderActions.updateOrderStatus({
            orderId: orderId,
            orderStatus: orderStatus,
        }, (success, response) => {
            if (!Boolean(success)) {
                createSnackbar({
                    message: 'Error while updating order status.',
                    timeout: 2500,
                    theme: 'error'
                });
            }
        }));
        window.location.reload();
    }

    const calculateTotalPrice = products => {
        let totalPrice = 0;
        products.map(product => (
            totalPrice = totalPrice + product.priceInMKD * product.quantity
        ))
        return totalPrice;
    }

    if (Boolean(auth)) {
        return (
            <div className={`container p-5`}>
                <div className={`pb-3 mb-3`}>
                    <h3>
                        All Orders
                    </h3>
                </div>
                <TableContainer component={Paper}>
                    <Table className={``} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"/>
                                <TableCell align="left">Products</TableCell>
                                <TableCell align="left">Address Details</TableCell>
                                <TableCell align="left">User</TableCell>
                                <TableCell align="left">Contact</TableCell>
                                <TableCell align="left">Date</TableCell>
                                <TableCell align="left">Price</TableCell>
                                <TableCell align="left">Postman</TableCell>
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
                                    <TableCell align="left">{order.address} - {order.city}</TableCell>
                                    <TableCell align="left">
                                        <div>{order.userUsername}</div>
                                        <div>{order.userNameAndSurname}</div>
                                    </TableCell>
                                    <TableCell align="left">{order.telephone}</TableCell>
                                    <TableCell align="left">{transformDate(order.dateCreated)}</TableCell>
                                    <TableCell align="left">{calculateTotalPrice(order.productsInOrder)} MKD</TableCell>
                                    <TableCell align="left">
                                        <div>{order.postmanUsername}</div>
                                        <div>{order.postmanNameAndSurname}</div>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Select fullWidth
                                                id='orderStatus' name='orderStatus'
                                                onChange={(event) =>
                                                    handleOrderStatusChange(order.id, event.target.value)}
                                                value={order.orderStatus}
                                                disabled={order.orderStatus === 'DELIVERED'}
                                        >
                                            {
                                                Object.keys(OrderStatus).map(orderStatus => (
                                                    <MenuItem key={OrderStatus[orderStatus]}
                                                              value={OrderStatus[orderStatus]}
                                                    >
                                                        {getOrderStatusName(orderStatus)}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    } else {
        return (
            <div className={`container pt-5 w-50`}>
                <h3 className={`text-center`}>You must be signed in to see your assigned orders.</h3>
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

export default AdminOrders;