import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {useFormik} from 'formik';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, useParams} from 'react-router';
import {wrapComponent} from 'react-snackbar-alert';
import * as yup from 'yup';
import {OrderActions} from '../../redux/actions/orderActions';
import {RegionDropdown} from 'react-country-region-selector';
import {Link} from 'react-router-dom'
import {ShoppingCartActions} from "../../redux/actions/shoppingCartActions";
import {sortElementsByDateCreated} from "../../utils/utils";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

const validationSchema = yup.object({
  address: yup.string('Enter your address').required('Address is required'),
  telephone: yup.string('Enter your phone number').required('Phone number is required'),
});

const OrderForm = wrapComponent(function ({createSnackbar}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [region, setRegion] = useState("");
  const auth = useSelector(state => state.auth.currentUser);
  const [products, setProducts] = useState(null);
  const {username} = useParams();

  useEffect(() => {
    dispatch(ShoppingCartActions.fetchShoppingCart(username, (success, response) => {
      if (success) {
        if (username === response.data.username) {
          setProducts(sortElementsByDateCreated(response.data.productsInShoppingCart));
        } else {
          createSnackbar({
            message: 'Sorry, you must be signed in in order to proceed.',
            timeout: 3000,
            theme: 'error'
          });
          history.goBack();
        }
      } else {
        createSnackbar({
          message: 'Error while accessing checkout page.',
          timeout: 2500,
          theme: 'error'
        });
        history.goBack();
      }
    }));
  }, []);

  const selectRegion = (region) => {
    setRegion(region)
  }

  const calculateTotalPrice = products => {
    let totalPrice = 0;
    products.map(product => (
      totalPrice = totalPrice + product.priceInMKD * product.quantity
    ))
    return totalPrice;
  }

  const formik = useFormik({
    initialValues: {
      address: '',
      telephone: '',

    },
    validationSchema,
    onSubmit: values => {
      if (Boolean(auth) && auth.username === username) {
        dispatch(OrderActions.makeOrder({
            username: auth.username,
            city: region,
            telephone: values.telephone,
            address: values.address
          }, (success, response) => {
            if (success) {
              if (response.data.hasEnoughQuantity !== undefined && !response.data.hasEnoughQuantity) {
                createSnackbar({
                  message: `You can't add the desired quantity of 
                                    ${response.data.product.productTitle} to the cart, 
                                    there are only ${response.data.product.quantity} items available.`,
                  timeout: 3200,
                  theme: 'error'
                });
              }
              else if (response.data === "Postman not found!"){
                createSnackbar({
                  message: 'We currently have no postmans for your selected city. Please choose another one.',
                  timeout: 3200,
                  theme: 'error'
                });
              }
              else {
                createSnackbar({
                  message: success ? 'Successfully made order.'
                    : 'Error while making order. Try again!',
                  timeout: 2500,
                  theme: success ? 'success' : 'error'
                });
                success && history.push(`/my-orders/${username}`);
              }
            }
          }
        ));
      }
    }
  });

  if (Boolean(auth) && auth.username === username) {
    return (
      <form onSubmit={formik.handleSubmit} className={`container w-50 pt-5`}>
        <div>
          <h3>
            Checkout details
          </h3>
        </div>
        <div className={`row py-2`}>
          <div className={`col-md-8`}>
            <TextField
              fullWidth
              id="address"
              name="address"
              label="Address"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </div>
          <div className={`col-md-4`}>
            <RegionDropdown
              id="region"
              name="region"
              country={`Macedonia, Republic of`}
              required={true}
              value={region}
              defaultOptionLabel={`Select city`}
              onChange={(region) => selectRegion(region)}/>
          </div>
        </div>
        <div className={`row py-2`}>
          <div className={`col`}>
            <TextField
              fullWidth
              id="telephone"
              name="telephone"
              label="Telephone"
              value={formik.values.telephone}
              onChange={formik.handleChange}
              error={formik.touched.telephone && Boolean(formik.errors.telephone)}
              helperText={formik.touched.telephone && formik.errors.telephone}
            />
          </div>
        </div>
        <h4>Order details</h4>
        <TableContainer component={Paper}>
          <Table className={``} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left"/>
                <TableCell align="left">Product</TableCell>
                <TableCell align="left">Price</TableCell>
                <TableCell align="left">Quantity</TableCell>
                <TableCell align="left">Total price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products && products.map((product, i) => (
                <TableRow key={product.id}>
                  <TableCell component="th" scope="row" name="productInCartId" padding="none"
                             align="center">
                    {i + 1}
                  </TableCell>
                  <TableCell align="left">{product.productTitle}</TableCell>
                  <TableCell align="left">{product.priceInMKD}</TableCell>
                  <TableCell align="left">{product.quantity}</TableCell>
                  <TableCell align="left">
                    {product.priceInMKD * product.quantity}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell align="center">Total:</TableCell>
                <TableCell/>
                <TableCell/>
                <TableCell/>
                <TableCell align="left">
                  {products && calculateTotalPrice(products)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Button color="primary" variant="contained" fullWidth type='submit' className={`my-4`}>
          Make Order
        </Button>
      </form>
    );
  } else {
    return (
      <div className={`container w-50 pt-5 text-center`}>
        <h3>You must be signed in to complete this process</h3>
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
                    className={`text-white text-decoration-none`}
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }
});

export default OrderForm;
