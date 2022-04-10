import React, { Component } from 'react';
import Button from "@mui/material/Button";
import {Card, CardMedia, CardActions, Radio, CardActionArea, CardContent, Grid} from "@mui/material";
import {Add} from "@mui/icons-material"

class ImageUploadComponent extends Component {

    fileObj = [];
    fileArray = [];
    productId = -1;

    allImageFileTypes = [
        '.tif', '.pjp', '.xbm', '.jxl', '.svgz', '.jpg', '.jpeg', '.ico', '.tiff', '.gif',
        '.svg', '.jfif', '.webp', '.png', '.bmp', '.pjpeg', '.avif'
    ]

    constructor(props) {
        super(props)
        this.state = {
            images: [],
            mainImage: 0
        }
        this.productId = this.props.productId;
        this.changeMainImage = this.changeMainImage.bind(this)
        this.uploadMultipleFiles = this.uploadMultipleFiles.bind(this)
        this.removeImage = this.removeImage.bind(this)
        this.initImages()
    }

    async initImages(){
        let mainImage = 0;
        if(this.productId !== -1){
            let imagePaths = [];
            await fetch("http://localhost:8080/api/products/images/" + this.productId, { method: 'GET' })
                .then(response => response.json())
                .then(data => imagePaths = data);
            await fetch("http://localhost:8080/api/products/images/main/" + this.productId, { method: 'GET' })
                .then(response => response.text())
                .then(data => mainImage = data);
            for(let i=0; i<imagePaths.length; i++){
                this.fileObj.push("http://localhost:8080/api/products/images/" + this.productId + "/s/" + imagePaths[i]);
                this.fileArray.push("http://localhost:8080/api/products/images/" + this.productId + "/s/" + imagePaths[i]);
                if(imagePaths[i]===mainImage){
                    mainImage = i+1
                }
            }
            this.setState({ images: this.fileObj, mainImage: mainImage })
            this.handleImageChange(this.fileObj, mainImage)
        }
    }

    removeImageRemotely(image_id){
        this.props.removeImageRemotely(image_id)
    }

    handleImageChange(images, mainImage){
        this.props.handleImagesChange({images, mainImage})
    }

    changeMainImage(v){
        this.setState({mainImage: v})
        this.handleImageChange(this.state.images, v)
    }

    uploadMultipleFiles(e) {
        for (let i = 0; i < e.target.files.length; i++){
            if(this.allImageFileTypes.includes(
                e.target.files[i].name.toLowerCase().substring(e.target.files[i].name.lastIndexOf("."))
            )){
                this.fileObj.push(e.target.files[i]);
                this.fileArray.push(URL.createObjectURL(e.target.files[i]))
            }
        }
        this.setState({ images: this.fileObj })
        this.handleImageChange(this.fileObj, this.state.mainImage)
    }

    removeImage(i) {
        this.fileObj.splice(i, 1)
        const removedImage = this.fileArray.splice(i, 1)[0]
        if(removedImage.substring(0, 4) !== "blob"){
            const parts = removedImage.split("/")
            this.removeImageRemotely(Number(parts[parts.length-1].replace('.jpg', '')))
        }
        let mainImage = 0
        if(this.state.images.length > 1){
            if(i+1<this.state.mainImage)
                mainImage = this.state.mainImage - 1
            else if(i+1>this.state.mainImage)
                mainImage = this.state.mainImage
        }
        this.setState({ images: this.fileObj, mainImage: mainImage })
        this.handleImageChange(this.fileObj, mainImage)
    }

    render() {
        return (
            <form className={'row'}>
                <div className="form-group multi-preview row">
                    {(this.fileArray || []).map((url, i) => (
                        <Card className={this.state.mainImage === i+1 ? 'col-6 border border-warning border-3' : 'col-6'}>
                            <CardActionArea
                                onClick={() => this.changeMainImage(i+1)}
                            >
                            <CardMedia
                                component="img"
                                height="250"
                                image={url}
                            />
                            </CardActionArea>
                            <CardActions>
                                <Button className={'text-white bg-danger'} onClick={() => this.removeImage(i)}>X</Button>
                            </CardActions>
                        </Card>
                    ))}
                    <Card className={'col-6 p-0'}>
                        <CardActionArea
                            onClick={() => {
                                document.getElementById("imageUpload").click();
                            }}
                            className={'h-100'}
                        >
                            <CardContent sx={{height:250, display:'flex', justifyContent:'center', alignItems:'center'}}>
                                <Add fontSize={"large"} />
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>

                <div className="form-group col mt-3">
                    <input id="imageUpload" type="file" hidden className="form-control" accept={"image/*"} onChange={this.uploadMultipleFiles} multiple />
                </div>
            </form >
        )
    }
}

export default ImageUploadComponent;