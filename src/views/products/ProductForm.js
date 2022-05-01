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
import ImageUploadComponent from "../../components/imageUploadComponent";

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
    const [imageIdsToRemove, setImageIdsToRemove] = useState([]);
    const [images, setImages] = useState({
        images: [],
        mainImage: 0
    });
    const [validateMainImage, setValidateMainImage] = useState(false)
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

    function handleImagesChange(imageState){
        setImages(imageState)
    }

    function removeImageRemotely(image_id){
        setImageIdsToRemove([...imageIdsToRemove, image_id])
    }

    function onSubmit(values) {
        var tempImgValuesArray = []
        for(let i=0; i<images.images.length; i++)
            tempImgValuesArray.push(i+1)
        if(images.images.length > 0 && !tempImgValuesArray.includes(images.mainImage)){
            setValidateMainImage(true)
            return;
        }
        else{
            setValidateMainImage(false)
        }
        setBackendWorking(true)
        if(Boolean(productId)){
            let i=0;
            function deleteProductImage(imageId){
                dispatch(
                    ProductActions.deleteProductImage(productId, imageId, (success, response) => {
                        i++
                        if(i<imageIdsToRemove.length)
                            deleteProductImage(imageIdsToRemove[i])
                    })
                )
            }
            deleteProductImage(imageIdsToRemove[i])
        }
        Boolean(productId) ? dispatch(
            ProductActions.updateProduct({
                id: values.id,
                categoryId: values.categoryId,
                productTitle: values.productTitle,
                productDescriptionHTML: values.productDescriptionHTML,
                quantity: values.quantity,
                priceInMKD: values.priceInMKD,
                attributeIdAndValueMap: values.attributeIdAndValueMap
            }, (success, response) => {
                if(success) {
                    if (images.images.length > 0) {
                        setBackendWorking(true);
                        var imagesToUpload = []
                        for(let i=0; i<images.images.length; i++){
                            if(images.images[i] instanceof File){
                                imagesToUpload.push(images.images[i])
                            }
                        }
                        if(imagesToUpload.length === 0){
                            createSnackbar({
                                message: success ? 'Successfully Updated Product' : 'Product failed to Update',
                                timeout: 2500,
                                theme: success ? 'success' : 'error'
                            });
                            setBackendWorking(false)
                        }
                        else{
                            let i=0;
                            function uploadNewImage(imageToUpload){
                                dispatch(
                                    ProductActions.addNewProductImage(productId, imageToUpload, (success2, response) => {
                                        if(!success2){
                                            createSnackbar({
                                                message: 'Image failed to Update',
                                                timeout: 2500,
                                                theme: 'error'
                                            });
                                        }
                                        i++
                                        if(i<imagesToUpload.length){
                                            uploadNewImage(imagesToUpload[i])
                                        }
                                        else{
                                            createSnackbar({
                                                message: success2 ? 'Successfully Updated Product' : 'Product failed to Update',
                                                timeout: 2500,
                                                theme: success2 ? 'success' : 'error'
                                            });
                                            setBackendWorking(false)
                                        }
                                    })
                                )
                            }
                            uploadNewImage(imagesToUpload[i])
                        }
                        if(images.images[images.mainImage-1] instanceof File){
                            createSnackbar({
                                message: 'Please re-select your main product image after images have finished uploading',
                                timeout: 7000,
                                theme: 'warning'
                            });
                        }
                        else{
                            const parts = images.images[images.mainImage-1].split("/")
                            dispatch(
                                ProductActions.setMainProductImage(productId, Number(parts[parts.length - 1].replace(".jpg", "")))
                            )
                        }
                        success && history.push(`/products/edit/${response.data.id}`);
                    } else {
                        createSnackbar({
                            message: success ? 'Successfully Updated Product' : 'Product failed to Update',
                            timeout: 2500,
                            theme: success ? 'success' : 'error'
                        });
                        setBackendWorking(false)
                        success && history.push(`/products/edit/${response.data.id}`);
                    }
                }
            })
        ) : dispatch(
            ProductActions.addProduct({
                categoryId: values.categoryId,
                productTitle: values.productTitle,
                productDescriptionHTML: values.productDescriptionHTML,
                quantity: values.quantity,
                priceInMKD: values.priceInMKD,
                attributeIdAndValueMap: values.attributeIdAndValueMap
            }, (success, response) => {
                if(success) {
                    if (images.images.length > 0) {
                        dispatch(
                            ProductActions.addAllProductImages(response.data.id, images.mainImage, images.images, (success2, response2) => {
                                createSnackbar({
                                    message: success2 ? 'Successfully Created Product' : 'Product failed to Create',
                                    timeout: 2500,
                                    theme: success2 ? 'success' : 'error'
                                });
                                setBackendWorking(false)
                                success2 && history.push(`/products/edit/${response.data.id}`);
                            })
                        )
                    } else {
                        createSnackbar({
                            message: success ? 'Successfully Created Product' : 'Product failed to Create',
                            timeout: 2500,
                            theme: success ? 'success' : 'error'
                        });
                        setBackendWorking(false)
                        success && history.push(`/products/edit/${response.data.id}`);
                    }
                }
            })
        );
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
                                <h4>Images</h4>
                                <small>*Please select the main image by clicking on it after you upload it*</small>
                                <ImageUploadComponent
                                    handleImagesChange={handleImagesChange}
                                    productId={productId ? productId : -1}
                                    removeImageRemotely={removeImageRemotely}
                                />
                                {validateMainImage ? <div className={"text-warning"}>Please select the main product image</div> : null}
                            </div>
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
