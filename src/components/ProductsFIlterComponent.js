import React, {useEffect, useState} from "react";
import {Card, CardContent, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {Slider} from "@mui/material";

const ProductsFilterComponent = (props) => {
    const [priceRange, setPriceRange] = useState([])

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