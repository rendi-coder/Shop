import React from 'react'
import classes from "./AddTovars.module.css"
import { connect } from 'react-redux'
import Button from '../../UI/Button/Button'


const FormAddTovars=(props)=>{
   return(<div className={classes.addTovar}>
    <h1>Добавление нового товара</h1>
    <div className={classes.container}>
        <div className={classes.title}>
                <span>Введите Заголовок товара</span>
                <input type="text" value={props.title} onChange={props.changeTitle} placeholder="Заголовок"/>
                 {!props.validator.validateTitle && <div className={classes.validator}>заголовок должен быть от 20 до 60символов</div> }
        </div>
        <div className={classes.addPhoto}>
                <span >Добавьте фото товара</span>
                {(props.urlImg&&props.urlImg!=="errorSize")?<img id="i" src={props.urlImg} alt=""/>:null}
                <label htmlFor="upload">{props.validator.validateImg?props.validator.validateImg:"добавить фото"}</label>
                <input  id="upload" type="file" onChange={props.fileSelectedHandler} className={classes.hide}/>
                {!props.validator.validateImg && <div className={classes.validator}>Фото не выбранно</div> }
        </div>
        <div className={classes.price}>
            <span>Укажите цену товара</span>
            <input value={props.price} onChange={props.changePrice} type="number" />
            {!props.validator.priceValid && <div className={classes.validator}>Укажите положительную ценну товара от 1 до 99999999.99</div> }
        </div>
        <div className={classes.aboutTovars}>
            <div>Напишите Описание товара</div>
            <textarea value={props.description} onChange={props.changeDescription} type="text" />
            {!props.validator.descriptionValid && <div className={classes.validator}>Слишком большое описание</div> }
        </div>
        <div className={classes.discontPrice}>
            <span>Укажите процент скидки</span>
            <input value={props.discontPrice} onChange={props.changeDiscontPrice} type="number" />
            {!props.validator.discontPriceValid && <div className={classes.validator}>Укажите число от 10 до 90</div> }
        </div>
        <div className={classes.discontDay}>
            <span>Укажите дату окончания скидки</span>
            <input value={props.discontData} onChange={props.changeDiscontData} type="date" />
            {!props.validator.discontDataValid && <div className={classes.validator}>Укажите дату больше текущей</div> }
        </div>
        <div className={classes.upload}>
            <Button disabled={props.isFormValid} onClick={props.uploadFile} type="success">Добавить товар</Button>
            {props.urlImg==="errorSize"&&<div className={classes.errorSize}>Товар не добавлен минимальные ширина/высота фото = 200px,максимальные 4000px</div>}
        </div>
    </div>
</div>)
}

const mapStateToProps=(state)=>{
    return{
        validator:state.tovars.validate,
        urlImg:state.tovars.url,
        isFormValid:Object.keys(state.tovars.validate).map((key)=>state.tovars.validate[key]).some(el=>el===false)
    }
}

export default connect(mapStateToProps,null) (FormAddTovars)