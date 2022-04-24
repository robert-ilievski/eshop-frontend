import React, {useEffect, useState} from "react";
import {Card, CardContent, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {Slider} from "@mui/material";
import {useSelector} from "react-redux";

const ProductsFilterComponent = (props) => {

    //proizvodi
    const products = useSelector(state => state.product.products);
    // granichni vrednosti (min-max) od site ceni na site proizvodi
    const [priceRange, setPriceRange] = useState([]);
    // potrebni informacii (id, ime i suffix) za site atributi koi se naogjaat vo proizvodite (tamu se so id, tuka se so se)
    const [neededAttributes, setNeededAttributes] = useState([]);
    // mnozhestva na site ID-a na atributi i nivni vrednosti zemeni od proizvodite
    const [attributeSets, setAttributeSets] = useState({})
    const [productsChanged, setProductsChanged] = useState(true)

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

    return (
        <div>
            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                    id='categoryId' name='categoryId'
                    // TODO onChangeCategory
                    onChange={null}
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
                        // TODO handlePriceRangeFilterChange
                        onChangeCommitted={(_, v) => null}
                        valueLabelDisplay="auto"
                        valueLabelFormat={value => `${value}мкд`}
                    />
                </CardContent>
            </Card>
            }
        </div>
    )
}

export default ProductsFilterComponent;