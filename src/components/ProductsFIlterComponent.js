import React, {useEffect, useState} from "react";
import {Card, CardContent, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {Slider} from "@mui/material";
import {AttributeActions} from "../redux/actions/attributeActions";
import {useDispatch, useSelector} from "react-redux";
import {ProductActions} from "../redux/actions/productActions";
import {FormControlLabel} from "@mui/material";
import {Checkbox} from "@mui/material";
import {isNaN} from "formik";

const ProductsFilterComponent = (props) => {

    // proizvodi
    const products = useSelector(state => state.product.products);
    // granichni vrednosti (min-max) od site ceni na site proizvodi
    const [priceRange, setPriceRange] = useState([])
    // potrebni informacii (id, ime i suffix) za site atributi koi se naogjaat vo proizvodite (tamu se so id, tuka se so se)
    const [neededAttributes, setNeededAttributes] = useState([])
    // mnozhestva na site idinja na atributi i nivni vrednosti zemeni od proizvodite
    const [attributeSets, setAttributeSets] = useState({})
    // finalni filtri, zadadeni od korisnikot, za da ne se menuvaat attributeSets (ni trebaat kako granichni vrednosti)
    const [filters, setFilters] = useState({})
    const [productsChanged, setProductsChanged] = useState(true)
    const [currentCategory, setCurrentCategory] = useState(-1)
    const dispatch = useDispatch();

    useEffect( () => {
        if(products.length > 0) {
            var allSets = []
            var priceArray = []
            products.forEach(product => {
                var tempSet = new Set()
                for (var key in product.attributeIdAndValueMap) {
                    var value = product.attributeIdAndValueMap[key];
                    if (!isNaN(parseFloat(value))) {
                        value = parseFloat(value)
                    }
                    var temp = tempSet[key]
                    if (temp === undefined) {
                        temp = new Set()
                    }
                    temp.add(value)
                    tempSet[key] = temp
                }
                allSets.push(tempSet)
                priceArray.push(product.priceInMKD)
            })
            var attributeIDs = []
            for (var key in allSets) {
                var tempArray = []
                for (var key2 in allSets[key]) {
                    tempArray.push(key2)
                }
                attributeIDs.push(tempArray)
            }
            var attributeIDsIntersection = attributeIDs.reduce((a, b) => a.filter(c => b.includes(c)))
            var finalSet = new Set()
            for (let i = 0; i < attributeIDsIntersection.length; i++) {
                var tempSet = new Set()
                for (var key in allSets) {
                    tempSet.add(allSets[key][attributeIDsIntersection[i]].values().next().value)
                }
                finalSet[attributeIDsIntersection[i]] = tempSet
            }
            setAttributeSets(finalSet)
            if (priceRange.length === 0) {
                setPriceRange([
                    Math.min.apply(null, priceArray),
                    Math.max.apply(null, priceArray)
                ])
            }
            setNeededAttributes([])
        }
    }, [productsChanged])

    useEffect( () =>{
        var allkeys = []
        for(var key in attributeSets) {
            allkeys.push(parseInt(key))
        }
        if(allkeys.length===0)
            return
        let i=0;
        function fetchAttributeByIdAndAddToNeededAttributes(id){
            dispatch(AttributeActions.fetchAttribute(id, (success, response) => {
                if(Boolean(success)){
                    setNeededAttributes((prevState => {
                        return [...prevState, {
                            id : parseInt(response.data.id),
                            name : response.data.name,
                            suffix : response.data.suffix
                        }]
                    }))
                    i++
                    if(i<allkeys.length) {
                        fetchAttributeByIdAndAddToNeededAttributes(allkeys[i])
                    }
                }
            }))
        }
        fetchAttributeByIdAndAddToNeededAttributes(allkeys[i])
    }, [attributeSets])

    function handleNonNumericalFilterChange(e){
        var tempSet = filters[e.target.id]
        if(tempSet === undefined){
            tempSet = new Set()
            // na pochetok beshe so site shtiklirani, zatoa gi dodavav, ama pologicno e site otshtiklirani
            // Array.from(attributeSets[e.target.id]).forEach(value => {
            //     tempSet.add(value)
            // })
        }
        if(e.target.checked)
            tempSet.add(e.target.name)
        else
            tempSet.delete(e.target.name)
        setFilters(prevState => ({
            ...prevState,
            [e.target.id]:tempSet
        }));
    }

    function handleNumericalFilterChange(id, value){
        var tempSet = new Set(value)
        setFilters(prevState => ({
            ...prevState,
            [id]:tempSet
        }));
    }

    function hanldePriceRangeFilterChange(value){
        setFilters(prevState => ({
            ...prevState,
            'pricerange':value
        }));
    }

    useEffect(() => {
        fetchFilteredProducts()
    }, [filters])

    function fetchFilteredProducts(){
        if(Object.keys(filters).length === 0)
            return
        var string = 'categoryid=' + currentCategory + '&'
        if(filters['pricerange'] === undefined){
            string = string + 'pricerange=mkd:' + priceRange[0] + '-' + priceRange[1] + '&attributes='
        }
        else{
            string = string + 'pricerange=mkd:' + filters['pricerange'][0] + '-' + filters['pricerange'][1] + '&attributes='
        }
        for(var key in filters){
            if(key!=='pricerange' && filters[key].size !== 0){
                string = string + key + ':'
                filters[key].forEach((value) => {
                    string = string + value + '-'
                })
                string = string.substring(0, string.length-1) + ','
            }
        }
        dispatch(ProductActions.filterProducts(string.substring(0, string.length-1)));
    }

    function onChangeCategory(categoryId) {
        if(categoryId === -1){
            dispatch(ProductActions.fetchAllProducts((success, response) => {
                if (Boolean(success)) {
                    setProductsChanged(!productsChanged)
                }
            }));
        }
        else{
            dispatch(ProductActions.fetchAllProductsByCategory(categoryId, (success, response) => {
                if (Boolean(success)) {
                    setProductsChanged(!productsChanged)
                }
            }))
        }
        setCurrentCategory(categoryId)
    }

    return (
        <div>
            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                    id='categoryId' name='categoryId'
                    onChange={change => {
                        onChangeCategory(change.target.value);
                    }}
                >
                    {
                        props.categories.map((category, i) => {
                            return (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
            {priceRange[0] && priceRange[1] &&
            <Card className={'mt-1'}>
                <CardContent className={'ps-5 pe-5 pt-2 pb-0'}>
                    <h5>Price</h5>
                    <Slider
                        min={priceRange[0]}
                        max={priceRange[1]}
                        defaultValue={[priceRange[0], priceRange[1]]}
                        marks={[
                            {value:priceRange[0]
                                ,label:priceRange[0] + "мкд"},
                            {value:priceRange[1]
                                ,label:priceRange[1] + "мкд"}
                        ]}
                        onChangeCommitted={(_, v) => hanldePriceRangeFilterChange(v)}
                        valueLabelDisplay="auto"
                        valueLabelFormat={value => `${value}мкд`}
                    />
                </CardContent>
            </Card>
            }
            {neededAttributes && neededAttributes.map((attribute, i) => (
                <Card className={'mt-1'}>
                    <CardContent className={'ps-5 pe-5 pt-2 pb-0'}>
                        <h5>{attribute.name}</h5>
                        {isNaN(parseInt(Array.from(attributeSets[attribute.id])[0])) ?
                            Array.from(attributeSets[attribute.id]).map((attributeValue, i) => (
                                attributeValue === "" ? null :
                                    <FormControlLabel control={
                                        <Checkbox
                                            id={attribute.id}
                                            onChange={handleNonNumericalFilterChange}
                                            name={attributeValue}
                                        />
                                    } label={attributeValue}/>
                            ))
                            :
                            <Slider
                                min={Math.min.apply(null, Array.from(attributeSets[attribute.id]))}
                                max={Math.max.apply(null, Array.from(attributeSets[attribute.id]))}
                                defaultValue={[Math.min.apply(null, Array.from(attributeSets[attribute.id])),Math.max.apply(null, Array.from(attributeSets[attribute.id]))]}
                                marks={[
                                    {value:Math.min.apply(null, Array.from(attributeSets[attribute.id]))
                                        ,label:Math.min.apply(null, Array.from(attributeSets[attribute.id])) + attribute.suffix},
                                    {value:Math.max.apply(null, Array.from(attributeSets[attribute.id])),
                                        label:Math.max.apply(null, Array.from(attributeSets[attribute.id])) + attribute.suffix}
                                ]}
                                onChangeCommitted={(_, v) => handleNumericalFilterChange(attribute.id, v)}
                                valueLabelDisplay="auto"
                                valueLabelFormat={value => `${value}${attribute.suffix}`}
                            />
                        }
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default ProductsFilterComponent;