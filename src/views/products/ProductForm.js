import React, {useEffect, useRef, useState} from "react";
import {Form, FieldArray, Formik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select, InputAdornment} from "@mui/material";
import {useDispatch} from "react-redux";
import * as yup from "yup";
import {wrapComponent} from "react-snackbar-alert";
import {useHistory, useParams} from "react-router";
import {ProductActions} from "../../redux/actions/productActions";
import {CategoryActions} from "../../redux/actions/categoryActions";
import {AttributeActions} from "../../redux/actions/attributeActions";
import {CircularProgress} from "@mui/material";

const validationSchema = yup.object({
    productTitle: yup.string("Enter product title").required("Product title is required"),
    productDescriptionHTML: yup.string("Enter description").required("Description is required"),
    quantity: yup.number("Enter quantity").required("Quantity is required").min(0, 'Minimum quantity is 0'),
    priceInMKD: yup.number("Enter price").required("Price is required").min(0, 'Minimum price is 0 MKD'),
    categoryId: yup.number("Please select category").required("Category is required"),
});

const ProductForm = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const {productId} = useParams();
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [areThereAttributes, setAreThereAttributes] = useState(true);
    const [backendWorking, setBackendWorking] = useState(false)
    const formikRef = useRef(null)

    let initialValues = {
        id: '',
        categoryId: '',
        productTitle: '',
        productDescriptionHTML: '',
        quantity: 0,
        priceInMKD: 0,
        attributeIdAndValueMap: {},
    }

    useEffect(() => {
        if (Boolean(productId)) {
            dispatch(ProductActions.fetchProduct(productId, (success, response) => {
                if (success) {
                    formikRef.current.setFieldValue("id", response.data.id);
                    formikRef.current.setFieldValue("categoryId", response.data.categoryId);
                    formikRef.current.setFieldValue("productTitle", response.data.productTitle);
                    formikRef.current.setFieldValue("productDescriptionHTML", response.data.productDescriptionHTML);
                    formikRef.current.setFieldValue("quantity", response.data.quantity);
                    formikRef.current.setFieldValue("priceInMKD", response.data.priceInMKD);
                    formikRef.current.setFieldValue("attributeIdAndValueMap", response.data.attributeIdAndValueMap);
                    dispatch(AttributeActions.fetchAttributesByCategory(response.data.categoryId, (success, response) => {
                        if (success) {
                            setAttributes(response.data);
                        } else {
                            alert("Error while fetching attributes.");
                        }
                    }))
                } else {
                    if (response.data.message) {
                        alert(response.data.message);
                    } else {
                        alert("Product not found");
                    }
                    history.push("/products");
                }
            }));
        }
        dispatch(CategoryActions.fetchAllCategories((success, response) => {
            if (success) {
                setCategories(response.data);
            } else {
                alert("Error while fetching categories.");
            }
        }));

    }, []);

    function onChangeCategory(categoryId){
        dispatch(AttributeActions.fetchAttributesByCategory(categoryId, (success, response) => {
            if (success) {
                formikRef.current.setFieldValue("attributeIdAndValueMap", {});
                setAttributes(response.data);
                setAreThereAttributes(response.data.length > 0)
            } else {
                if (response.data) {
                    alert(response.data.message);
                } else {
                    alert("Attribute fetching error!");
                }
                history.push("/products");
            }
        }))
    }

    function deleteProduct(productId){
        if(window.confirm("Are you sure you want to delete this product?")){
            dispatch(ProductActions.deleteProduct(productId))
            history.push("/products");
            window.location.reload();
        }
    }



    function onSubmit(values) {
        // TODO Implement this
    }
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}
                innerRef={formikRef}>
            {({errors, values, touched, setValues, handleChange}) => (
                <Form className={`container pt-5 w-50`}>
                    <div>
                        <h3>
                            {Boolean(productId) ? 'Edit Product' : 'New Product'}
                        </h3>
                        <TextField
                            fullWidth
                            id="productTitle"
                            name="productTitle"
                            label="Product Title"
                            className={`py-2`}
                            value={values.productTitle}
                            onChange={handleChange}
                            error={touched.productTitle && Boolean(errors.productTitle)}
                            helperText={touched.productTitle && errors.productTitle}
                        />
                        <TextField
                            fullWidth
                            id="productDescriptionHTML"
                            name="productDescriptionHTML"
                            label="Description"
                            multiline
                            rows={5}
                            className={`py-2`}
                            value={values.productDescriptionHTML}
                            onChange={handleChange}
                            error={touched.productDescriptionHTML && Boolean(errors.productDescriptionHTML)}
                            helperText={touched.productDescriptionHTML && errors.productDescriptionHTML}
                        />
                        <TextField
                            fullWidth
                            id="quantity"
                            name="quantity"
                            label="Product quantity"
                            type="number"
                            className={`py-2`}
                            value={values.quantity}
                            onChange={handleChange}
                            error={touched.quantity && Boolean(errors.quantity)}
                            helperText={touched.quantity && errors.quantity}
                        />
                        <div className={`row`}>
                            <div className={`col`}>
                                <TextField
                                    fullWidth
                                    id="priceInMKD"
                                    name="priceInMKD"
                                    label="Price in MKD"
                                    type="number"
                                    value={values.priceInMKD}
                                    onChange={handleChange}
                                    error={touched.priceInMKD && Boolean(errors.priceInMKD)}
                                    helperText={touched.priceInMKD && errors.priceInMKD}
                                />
                            </div>
                            <div className={`col`}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        error={touched.categoryId && Boolean(errors.categoryId)}
                                        helperText={touched.categoryId && errors.categoryId}
                                        id='categoryId' name='categoryId'
                                        onChange={change => {
                                            values.categoryId = change.target.value;
                                            onChangeCategory(change.target.value);
                                        }}
                                        value={values.categoryId}
                                    >
                                        {
                                            categories.map((category, i) => {
                                                return (
                                                    <MenuItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className={'row pt-3'}>
                            <div className={'col'}>
                                <h4>Attributes</h4>
                                <FieldArray name="attributes">
                                    {() => (attributes.map((attribute, i) => {
                                        return (
                                            <TextField
                                                required
                                                fullWidth
                                                label={attributes[i].name}
                                                name={`attributeIdAndValueMap[${attribute.id}]`}
                                                type={attributes[i].numeric ? "number" : "text"}
                                                onChange={handleChange}
                                                value={values.attributeIdAndValueMap[attribute.id]}
                                                sx={{ m: 1, width: '25ch' }}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">{attributes[i].suffix}</InputAdornment>,
                                                }}
                                            />
                                        );
                                    }))}
                                </FieldArray>
                                {
                                    areThereAttributes ?  null : "No attributes for this category."
                                }
                            </div>
                        </div>
                        <div className={`pt-3 float-left`}>
                            {backendWorking ? <CircularProgress /> :
                                <Button
                                    color="primary"
                                    variant="contained"
                                    className={`m-2`}
                                    type="submit">
                                    {productId ? "Edit" : "Create"}
                                </Button>
                            }
                            {productId && !backendWorking ? <Button
                                className={'bg-danger m-2'}
                                variant="contained"
                                onClick={() => deleteProduct(productId)}
                            >
                                Delete Product
                            </Button> : null}
                            {backendWorking ? null :
                                <Button
                                    color="primary"
                                    className={`m-2`}
                                    href={'/products'}
                                >
                                    Exit
                                </Button> }
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
});

export default ProductForm;
