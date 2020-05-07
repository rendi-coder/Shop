import React, { Component } from 'react'
import classes from "../addProduct/AddTovars.module.css"
import { connect } from 'react-redux';
import {setLoading,uploadImage,validator,updateCard,setUrlImg} from '../../redux/tovarsReducer'
import { Redirect} from 'react-router-dom';
import Loader from "../../UI/Loader/Loader"
import Button from '../../UI/Button/Button'
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
    <div className={classes.addTovar}>
        <h1>Редактирование товара</h1>
        <div className={classes.container}>
            <div className={classes.title}>
                    <span>Введите Заголовок товара</span>
                    <input type="text" value={this.state.title} onChange={this.changeTitle} placeholder="Заголовок"/>
                    {!this.props.validate.validateTitle && <div className={classes.validator}>заголовок должен быть от 20 до 60символов</div> }
            </div>
            <div className={classes.addPhoto}>
                    <div>
                       {(this.props.urlImg&&this.props.urlImg!=="errorSize")&&<img src={this.props.urlImg} alt=""/>}
                    </div>
                    <span>Изменить фото товара</span>
                    <input id="upload" type="file" onChange={this.fileSelectedHandler} className={classes.hide}/>
                    <label htmlFor="upload">{this.props.validate.validateImg.length?this.props.validate.validateImg:"Изменить фото"}</label>
                    {!this.props.validate.validateImg && <div className={classes.validator}>Фото не выбранно</div> }
            </div>
            <div className={classes.price}>
                <span>Укажите цену товара</span>
                <input value={this.state.price} onChange={this.changePrice} type="number" />
                {!this.props.validate.priceValid && <div className={classes.validator}>Укажите положительную ценну товара до 99999999.99</div> }
            </div>
            <div className={classes.aboutTovars}>
                <div>Напишите Описание товара</div>
                <textarea value={this.state.description} onChange={this.changeDescription} type="text" />
                {!this.props.validate.descriptionValid && <div className={classes.validator}>Слишком большое описание</div> }
            </div>
            <div className={classes.discontPrice}>
                <span>Укажите процент скидки</span>
                <input value={this.state.discontPrice} onChange={this.changeDiscontPrice} type="number" />
                {!this.props.validate.discontPriceValid && <div className={classes.validator}>Укажите число от 10 до 90</div> }
            </div>
            <div className={classes.discontDay}>
                <span>Укажите дату окончания скидки</span>
                <input value={this.state.discontData} onChange={this.changeDiscontData} type="date" />
                {!this.props.validate.discontDataValid && <div className={classes.validator}>Укажите дату больше текущей</div> }
            </div>
            <div className={classes.upload}>
                <Button disabled={this.props.isFormValid} onClick={this.updateCard} type="success">Редактировать товар</Button>
                {this.props.urlImg==="errorSize"&&<div className={classes.errorSize}>Товар не добавлен минимальные ширина/высота фото 200px,максимальные 4000px</div>}
            </div>
        </div>
    </div>)
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