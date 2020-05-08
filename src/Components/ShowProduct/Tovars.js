import React from 'react'
import classes from './Tovars.module.css'
import {connect} from 'react-redux'
import {deleteTovar,setActiveCard} from '../../redux/tovarsReducer'
import { NavLink } from 'react-router-dom'
import Button from '../../UI/Button/Button'


const Tovars=(props)=>{

    const deleteCard=(id)=>{
        props.deleteTovar(id);
    }

    const activeCardHandler=(id)=>{
        props.setActiveCard({id,tovar:props.tovar})
    }

    return (<div className={classes.column}>
                <div className={classes.cardItem}>

                    {new Date(props.tovar.discontDate)-new Date()>0&&
                    <DataComponent discontDate={props.tovar.discontDate}/>
                     }

                    <div className={classes.cardImg}>
                        <img src={props.tovar.url} alt="images"/>
                   </div>
                   
                    <h5 className={classes.nameTovars}>{props.tovar.title}</h5>
                    <p className={classes.aboutTovars}>
                        {props.tovar.description}
                    </p>
                   
                        <PriceComponent discontDate={props.tovar.discontDate}
                            price={props.tovar.price}
                            discont={props.tovar.discont}
                        />

                    {props.login==="mamba11@gmail.com"?
                    <div className={classes.devPanel}>
                        <NavLink to={'udateTovars'} onClick={()=>activeCardHandler(props.id)}>
                            <Button type="success" >Update</Button>
                        </NavLink>
                        
                        <Button type="error" onClick={()=>deleteCard(props.id)}>Delete</Button>
                    </div>:null
                    }
                </div>
            </div>)
}


const DataComponent=({discontDate})=>{
    let date=Math.ceil(((((new Date(discontDate)-Date.now())/1000)/60)/60)/24);
    let days="";
    if(date===1||date%10===1){days="день"}else{days="дней"}
    if((date%10<5)&&(date%10>1)){days="дня";}
    if((date>10 && date<15)||(date>100 && date<115)||(date>100 && date<115)){days="дней"}

    return (<div className={classes.discount}>
                        <span>Скидка</span>
                        <span>Осталось: {date}
                        {days}</span>
                    </div>)
}

const PriceComponent=({discontDate,price,discont})=>{
   return( 
    <div className={classes.price}>
       {new Date(discontDate)-new Date()>0
        ?<div style={{fontSize:"22px"}}>
        <div>Цена:{Number(price).toFixed()}грн</div>
        <div style={{color:'red'}}>Акционная цена:
        {(price-((price*discont)/100)).toFixed()}грн</div></div>
        :<span>{Number(price).toFixed()}грн</span>}
     </div> )
}

export default connect(null,{deleteTovar,setActiveCard})(Tovars)