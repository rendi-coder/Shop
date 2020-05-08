import React, { Component } from 'react'
import { connect } from 'react-redux';
import {setLoading,uploadImage,validator,updateCard,setUrlImg} from '../../redux/tovarsReducer'
import { Redirect} from 'react-router-dom';
import Loader from "../../UI/Loader/Loader"
import {FormAddTovars} from '../addProduct/FormAddTovars'

class UpdateTovars extends Component{

    state={
        selectedFile:this.props.activeCard.tovar.url,
        title:this.props.activeCard.tovar.title,
        price:this.props.activeCard.tovar.price,
        description:this.props.activeCard.tovar.description,
        discontData:this.props.activeCard.tovar.discontDate,
        discontPrice:this.props.activeCard.tovar.discont
    }

    componentDidMount(){
        this.props.setUrlImg(this.state.selectedFile);
        this.props.validator(this.state.selectedFile,this.state.title,this.state.price,this.state.description,this.state.discontPrice,this.state.discontData);
    }

    componentDidUpdate(prevProps,PrevState){
        if(PrevState!==this.state ){
            this.props.validator(this.state.selectedFile,this.state.title,this.state.price,this.state.description,this.state.discontPrice,this.state.discontData);
        }
    }

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

    fileSelectedHandler=e=>{
        if(e.target.files[0]&&e.target.files[0].type.match('image.*')){
            this.props.uploadImage(e.target.files[0]);
            this.props.setLoading(true);
        this.setState({
            selectedFile:e.target.files[0]
        })
        }else{
            this.setState({
                selectedFile:this.props.activeCard.tovar.url
            })
        }
    }


    updateCard=()=>{
        debugger;
        let img=new Image();img.src=this.props.urlImg;
        if(img.width>4000||img.height>4000||img.width<200||img.height<200){
            this.props.setUrlImg("errorSize");
            this.setState({selectedFile:null});
            console.log(img.width);
            alert("Товар не добавлен");
            return}
        const validate=this.props.validate;
        if(validate.validateImg && validate.validateTitle && validate.priceValid && validate.descriptionValid && validate.discontPriceValid && validate.discontDataValid){
        const image = this.state.selectedFile
        this.props.updateCard(image,this.state.title,this.state.price,this.state.description,this.state.discontPrice,this.state.discontData,this.props.activeCard.id);
        this.props.setLoading(true);
        }
    }

    render(){
        if(this.props.loading==="success"){return <Redirect to='/' />}
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
         uploadFile={this.updateCard}
        update={true}
        validator={this.props.validate}
        isFormValid={this.props.isFormValid}
        />
        )
    }
}



const mapStateToProps=(state)=>{
    return{
        activeCard:state.tovars.activeCard,
        validate:state.tovars.validate,
        loading:state.tovars.loading,
        urlImg:state.tovars.url,
        isFormValid:Object.keys(state.tovars.validate).map((key)=>state.tovars.validate[key]).some(el=>el===false)
    }
}

export default connect( mapStateToProps,{updateCard,validator,setLoading,uploadImage,setUrlImg}) (UpdateTovars)