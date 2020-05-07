import React, { Component } from 'react'
import {uploadTovars,uploadImage,setUrlImg} from '../../redux/tovarsReducer'
import {validator} from '../../redux/tovarsReducer'
import {connect} from 'react-redux'
import FormAddTovars from './FormAddTovars'
import {setLoading} from '../../redux/tovarsReducer'
import Loader from "../../UI/Loader/Loader"
//import { Redirect} from 'react-router-dom';
class AddTovars extends Component{

    changeTitle=(e)=>{
        this.setState({
            title:e.target.value
        })
    }

    changeDescription=(e)=>{
        this.setState({
            description:e.target.value
        })
    }

    changePrice=(e)=>{
        this.setState({
            price:e.target.value
        })
    }

    changeDiscontData=(e)=>{
        this.setState({
            discontData:e.target.value
        })
    }

    changeDiscontPrice=e=>{
        this.setState({
            discontPrice:e.target.value
        })
    }

    state={
        selectedFile:null,
        title:'',
        price:'',
        description:'',
        discontData:'',
        discontPrice:'',
    }

   

    componentDidMount(){
        this.props.validator(this.state.selectedFile,this.state.title,this.state.price,this.state.description,this.state.discontPrice,this.state.discontData);
    }

    componentDidUpdate(prevProps,PrevState){
        if(PrevState!==this.state){
            this.props.validator(this.state.selectedFile,this.state.title,this.state.price,this.state.description,this.state.discontPrice,this.state.discontData);
        }
    }

    fileSelectedHandler=e=>{
        if(e.target.files[0]&&e.target.files[0].type.match('image.*')){
            
        this.props.uploadImage(e.target.files[0]);
        this.props.setLoading(true);
        this.setState({
            selectedFile:e.target.files[0]
        })
        }
        else{this.setState({
            selectedFile:null
        })}
    }


    uploadFile=()=>{
        //Валидация размеров фото требует доработки
            let img=new Image();img.src=this.props.urlImg;
            if(img.width>4000||img.height>4000||img.width<200||img.height<200){
            this.props.setUrlImg("errorSize");
            this.setState({selectedFile:null});
            alert("Товар не добавлен");
            return}
        //end
        const validate=this.props.validate;
        if(validate.validateImg && validate.validateTitle && validate.priceValid && validate.descriptionValid && validate.discontPriceValid && validate.discontDataValid){
        const image = this.props.urlImg
        this.props.uploadTovars(image,this.state.title,this.state.price,this.state.description,this.state.discontPrice,this.state.discontData);
        this.props.setLoading(true);
        this.setState({
            selectedFile:null,
            title:'',
            price:'',
            description:'',
            discontData:'',
            discontPrice:'',
        })
        alert("Товар добавлен")
        }
    }


    render(){
        //if(this.props.loading==="success"){return <Redirect to='/' />}//могу после добавления 1 товара на главную
        if(this.props.loading){return <Loader />}
    return(
        <FormAddTovars
         title={this.state.title}
         changeTitle={this.changeTitle}
         urlImg={this.props.urlImg}
         fileSelectedHandler={this.fileSelectedHandler}
         price={this.state.price}
         changePrice={this.changePrice}
         description={this.state.description}
         changeDescription={this.changeDescription}
         discontPrice={this.state.discontPrice}
         changeDiscontPrice={this.changeDiscontPrice}
         discontData={this.state.discontData}
         changeDiscontData={this.changeDiscontData}
         uploadFile={this.uploadFile}
         />
    )
}
}

const mapStateToProps=(state)=>{
    return{
        validate:state.tovars.validate,
        loading:state.tovars.loading,
        urlImg:state.tovars.url
    }
}

export default connect(mapStateToProps,{setUrlImg,uploadImage,uploadTovars,validator,setLoading})(AddTovars)