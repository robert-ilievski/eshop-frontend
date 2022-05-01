import {wrapComponent} from "react-snackbar-alert";
import {useDispatch} from "react-redux";
import {useHistory, useParams} from "react-router";
import {ShoppingCartActions} from "../../redux/actions/shoppingCartActions";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import TableContainer from "@mui/material/TableContainer";
import {sortElementsByDateCreated} from "../../utils/utils";
import TextField from "@mui/material/TextField";
import {ProductActions} from "../../redux/actions/productActions";

const ShoppingCartView = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const [shoppingCart, setShoppingCart] = useState(null);
    const [products, setProducts] = useState(null);
    const {username} = useParams();

    useEffect(() => {
        dispatch(ShoppingCartActions.fetchShoppingCart(username, (success, response) => {
            if (success) {
                if (username === response.data.username) {
                    setProducts(sortElementsByDateCreated(response.data.productsInShoppingCart));
                    setShoppingCart(response.data);
                } else {
                    createSnackbar({
                        message: 'Sorry, you must be signed in in order to see your shopping cart.',
                        timeout: 3000,
                        theme: 'error'
                    });
                    history.goBack();
                }
            } else {
                createSnackbar({
                    message: 'Error while accessing shopping cart.',
                    timeout: 2500,
                    theme: 'error'
                });
                history.goBack();
            }
        }));
    }, []);

    const handleDeleteFromCart = productId => {
        dispatch(ShoppingCartActions.deleteFromShoppingCart({
            'productId': productId,
            'username': username
        }, (success, response) => {
            if (success) {
                window.location.reload();
            }
        }));
    };

    const calculateTotalPrice = products => {
        let totalPrice = 0;
        products.map(product => (
            totalPrice += product.priceInMKD * product.quantity
        ))
        return totalPrice;
    }

    return (
        <div className={`container p-5`}>
            <div className={`pb-3 mb-3`}>
                <h3>
                    Shopping Cart
                </h3>
            </div>
            <TableContainer component={Paper}>
                <Table className={``} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"/>
                            <TableCell align="left">Product</TableCell>
                            <TableCell align="left">Price</TableCell>
                            <TableCell align="left">Quantity</TableCell>
                            <TableCell align="left">Total price</TableCell>
                            <TableCell align="left"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products && products.map((productInCart, i) => (
                            <TableRow key={productInCart.id}>
                                <TableCell component="th" scope="row" padding="none"
                                           align="center">
                                    <img
                                        src={`http://localhost:8080/api/products/images/${productInCart.productId}/s/main`}
                                        alt={`Product IMG`}
                                    />
                                </TableCell>
                                <TableCell align="left">{productInCart.productTitle}</TableCell>
                                <TableCell align="left">{productInCart.priceInMKD} MKD</TableCell>
                                <TableCell align="left">
                                    {productInCart.quantity}
                                </TableCell>
                                <TableCell align="left">
                                    {productInCart.priceInMKD * productInCart.quantity} MKD
                                </TableCell>
                                <TableCell align="left">
                                    <Button onClick={() => {
                                        // eslint-disable-next-line no-unused-expressions
                                        (window.confirm('Are you sure you wish to delete this item from the cart?')) ?
                                            handleDeleteFromCart(productInCart.id)
                                            : null
                                    }}>
                                        <HighlightOffIcon/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell/>
                            <TableCell/>
                            <TableCell align="left">Total:</TableCell>
                            <TableCell/>
                            <TableCell align="left">
                                {products && calculateTotalPrice(products)} MKD
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={`pt-3 float-right`}>
                <Button component={Link}
                        color="primary"
                        to={`/products`}
                >
                    Continue shopping
                </Button>
                {
                    products && products.length > 0 ?
                        <Button component={Link}
                                color="primary"
                                variant="contained"
                                to={`/order-form/${username}`}
                                className={`text-white text-decoration-none`}
                        >
                            Checkout
                        </Button>
                        : null
                }
            </div>
        </div>
    );
});

export default ShoppingCartView;