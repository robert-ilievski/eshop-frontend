import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ProductActions} from "../../redux/actions/productActions";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import Roles from "../../enumerations/Roles";
import {wrapComponent} from "react-snackbar-alert";
import {useHistory} from "react-router";
import {
    Card,
    CardContent,
    CardActions,
    CardActionArea,
    CardMedia,
    Typography,
} from "@mui/material";
import {CategoryActions} from "../../redux/actions/categoryActions";
import ProductsFilterComponent from "../../components/ProductsFIlterComponent";

const ProductView = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const products = useSelector(state => state.product.products);
    const auth = useSelector(state => state.auth.currentUser);
    const history = useHistory();
    const [productsFetched, setProductsFetched] = useState(false)
    const [categories, setCategories] = useState([])
    const [currentCategoryName, setCurrentCategoryName] = useState("All Products")

    const [role, setRole] = useState(null);

    useEffect(() => {
        if (auth) {
            setRole(auth.role);
        }
    }, [auth]);

    useEffect(() => {
        dispatch(ProductActions.fetchAllProducts((success, response) => {
            if (Boolean(success)) {
                setProductsFetched(true)
            }
        }));
        dispatch(CategoryActions.fetchAllCategories((success, response) => {
            if (success) {
                var array = response.data
                array.unshift({
                    id: -1,
                    name: "All Products"
                })
                setCategories(array)
            }
        }));
    }, []);

    if (categories.length === 0 && products.length === 0) {
        return (
            <div className={`container pt-5`}>
                <div>
                    {
                        role === Roles.ADMIN ?
                            <Button component={Link}
                                    to={'/products/add'}
                                    variant="contained" color="primary"
                                    className={`text-white text-decoration-none float-right`}
                            >
                                ADD PRODUCT
                            </Button>
                            :
                            null
                    }
                    <h3>
                        Currently there are no available products.
                    </h3>
                </div>
            </div>
        );
    }
    return (
        <div className={`container p-5`}>
            <div>
                {
                    role === Roles.ADMIN ?
                        <Button component={Link}
                                to={'/products/add'}
                                variant="contained" color="primary"
                                className={`text-white text-decoration-none float-right`}
                        >
                            ADD PRODUCT
                        </Button>
                        :
                        null
                }
                <h3>
                    {currentCategoryName}
                </h3>
            </div>
            <div className={`row`}>
                {productsFetched ?
                    <div className={`col-md-3`}>
                        <div className={`positionFixed`}>
                            <h4 className={`pt-4`}>
                                Filter products
                            </h4>
                            <ProductsFilterComponent categories={categories}/>
                        </div>
                    </div>
                    : null
                }
                <div className={`col-md-9`}>
                    <div className={`row`}>
                        {products && products.map((product, i) => (
                            <div className={`col-md-4 col-sm-6`}>
                                <Card className={`card-width`}>
                                    <CardActionArea onClick={() => history.push(`/products/${product.id}`)}>
                                        <CardMedia
                                            component="img"
                                            height="280"
                                            image={"http://localhost:8080/api/products/images/" + product.id + "/m/main"}
                                            alt={product.productTitle}
                                        />
                                        <CardContent>
                                            <Typography className={`card-title-height`}
                                                        gutterBottom variant="h5" component="div">
                                                {product.productTitle}
                                            </Typography>
                                            <Typography variant="body2"
                                                        className={product.quantity > 0 ? "text-success" : "text-danger"}>
                                                {product.quantity > 0 ? "In stock" : "Out of stock"}
                                            </Typography>
                                            <Typography variant="h6" color="text.primary">
                                                {product.priceInMKD} MKD
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <div className={`row p-1`}>
                                            <div className={`col`}>
                                                <Button color={"primary"}
                                                        disabled={product.quantity === 0}
                                                        // TODO: handleAddToCart()
                                                        onClick={null}
                                                        variant="contained">
                                                    Add to cart
                                                </Button>
                                            </div>
                                            {role === Roles.ADMIN ?
                                                <div className={`col-md-4`}>
                                                    <Button color="primary"
                                                            component={Link}
                                                            to={`/products/edit/${product.id}`}
                                                    >
                                                        EDIT
                                                    </Button>
                                                </div>
                                                : null
                                            }
                                        </div>
                                    </CardActions>
                                </Card>
                                <br/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProductView;