import axios from '../../axios/axiosInstance';
import {
    FETCH_PRODUCT,
    FETCH_PRODUCTS,
    FETCH_PRODUCTS_BY_CATEGORY,
    FILTER_PRODUCTS,
    ADD_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT, CHECK_PRODUCT_QUANTITY,
} from '../actionTypes';

export const ProductActions = {
    fetchProduct: (id, callback) => dispatch => {
        axios.get(`/products/${id}`).then(response => {
            dispatch({
                type: FETCH_PRODUCT,
                product: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
    fetchAllProducts: (callback) => dispatch => {
        axios.get("/products").then(resp => {
            dispatch({
                type: FETCH_PRODUCTS,
                products: resp.data,
            });
            callback(true, resp)
        }).catch(error => {
            callback(false, error);
        });
    },
    fetchAllProductsByCategory: (id, callback) => dispatch => {
        axios.get(`/products/bycat/${id}`).then(resp => {
            dispatch({
                type: FETCH_PRODUCTS_BY_CATEGORY,
                products: resp.data,
            });
            callback(true, resp)
        }).catch(error => {
            callback(false, error);
        });
    },
    filterProducts: (string) => dispatch => {
        axios.get("/products/filter?" + string).then(resp => {
            dispatch({
                type: FILTER_PRODUCTS,
                products: resp.data,
            });
        });
    },
    deleteProduct: id => dispatch => {
        axios.delete(`/products/delete/${id}`).then(() => {
            dispatch({
                type: DELETE_PRODUCT,
                productId: id,
            });
        });
    },
    addProduct: (product, callback) => dispatch => {
        axios.post(`/products/create`, product).then((response) => {
            dispatch({
                type: ADD_PRODUCT,
                product: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
    updateProduct: (product, callback) => dispatch => {
        axios.put(`/products/update`, product).then((response) => {
            dispatch({
                type: UPDATE_PRODUCT,
                product: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
    checkProductQuantity: (checkProductQuantityDTO, callback) => dispatch => {
        axios.post(`/products/check-quantity`, checkProductQuantityDTO).then((response) => {
            dispatch({
                type: CHECK_PRODUCT_QUANTITY,
                result: response.data
            });
            callback(true, response);
        }).catch(error => {
            callback(false, error);
        })
    },
    fetchAllProductImages: (product_id, callback) => dispatch => {
        axios.get(`/products/images/${product_id}`).then(response => {
            callback(true, response)
        }).catch((error) => {
            callback(false, error);
        })
    },
    addNewProductImage: (product_id, image, callback) => dispatch => {
        var formData = new FormData()
        formData.append('image', image);
        axios.put('/products/img/' + product_id, formData).then(response => {
            callback(true, response)
        }).catch((error) => {
            callback(false, error);
        })
    },
    setMainProductImage: (product_id, main_image_id) => dispatch => {
        var formData = new FormData();
        formData.append('productId', product_id)
        formData.append('mainImageId', main_image_id)
        axios.put('/products/img', formData);
    },
    addAllProductImages: (product_id, main_image_id, images, callback) => dispatch => {
        var formData = new FormData();
        formData.append('productId', product_id)
        formData.append('mainImageId', main_image_id)
        for(let i=0; i<images.length; i++){
            formData.append('images', images[i])
        }
        axios.post('/products/img', formData).then(response => {
            callback(true, response)
        }).catch((error) => {
            callback(false, error);
        })
    },
    deleteProductImage: (product_id, image_id, callback) => dispatch => {
        axios.delete('/products/img/delete/' + product_id + "/" + image_id).then(response => {
            callback(true, response)
        }).catch((error) => {
            callback(false, error);
        })
    }
}