import React, { useEffect, useState } from 'react'
import {showBasket,removeFromBasket,setLoading} from '../../redux/tovarsReducer'
import {connect} from 'react-redux'
import classes from './Basket.module.css';
import Loader from "../../UI/Loader/Loader"
import {calculateBasketSum} from '../../redux/tovarsReducer'

const Basket =(props)=>{
    useEffect(()=>{
        props.setLoading(true);
        props.showBasket();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

        if(props.loading){return <Loader />}
        if(!props.basket || props.basket.length===0)return (<div style={{textAlign:'center'}}><h1>Корзина пуста</h1></div>)
        console.log("BASKET");
    return(
        <div className={classes.container}>

            <section className={classes.head}>
            <div >
                <h1>Корзина</h1>
                <small>В вашей корзине: <b>{props.basket.length} товара</b></small>
            </div>
            </section>
            
            <section className={classes.body}>
               
                    <form onSubmit={(e)=>e.preventDefault()}>
                        <table>
                            <thead >
                                <tr >
                                    <th>Фото</th>
                                    <th>Наименование</th>
                                    <th>Цена за шт</th>
                                    <th>Количество</th>
                                    <th>Итого</th>
                                    <th>Удалить</th>
                                </tr>
                            </thead>
                            <tbody>
                               
                               {props.basket&&props.basket.map((item)=><Product product={item} key={item.article} removeProduct={props.removeFromBasket} calculateBasketSum={props.calculateBasketSum}/>)}    
                               
                            </tbody>
                        </table>
                    </form>
                
            </section>
            <section className={classes.footer}>
                    <h2>К ОПЛАТЕ: {props.basketSum&&props.basketSum.sum}  грн</h2>
            </section>
        </div>
    )
}

const Product =(props)=>{

   const PRICE=new Date(props.product.discontDate)-new Date()>0 ? (props.product.price-(props.product.price*props.product.discont/100)).toFixed():props.product.price

    const [count,setCount]=useState(1);
    const [sum,setSum]=useState(PRICE);
    const [price]=useState(PRICE);

    useEffect(()=>{
        props.calculateBasketSum({article:props.product.article,
            sum:price
            });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[])

    useEffect(()=>{
        setSum(count*price);
        props.calculateBasketSum({article:props.product.article,
            sum:count*price
            });
    }// eslint-disable-next-line react-hooks/exhaustive-deps
    ,[count])
    

  const  removeProduct=(article)=>{
        props.removeProduct(article);
        props.calculateBasketSum({article:article,
            sum:0
            });
    }

  const  changeCountproduct=(e)=>{
        if(e.target.value==='0' && count.length===0)return;
        const space =e.target.value.indexOf(" ");
        if(e.target.value>=0 && space<0){
            setCount(e.target.value);
        }
    }
        
    return(
        <tr className={classes.listTovars}>
                                    <td><img src={props.product.url} width="100" height="100" alt="productPhoto"/></td>
                                    <td><span>{props.product.title}</span></td>
                                    <td><span>{price}</span></td> 
                                    <td><input type="text" onChange={(e)=>changeCountproduct(e)} value={count} style={{width:75}}/></td>
                                    <td><span>{sum}</span></td>
                                    <td><button onClick={()=>removeProduct(props.product.article)} className={classes.button}><img height="30" width="30" src="https://s1.iconbird.com/ico/0912/RadiumNeue/w256h2561348762189Delete.png" alt=""/></button></td>
         </tr>
    )

}

export default connect((state)=>({basket:state.tovars.basket,loading:state.tovars.loading,basketSum:state.tovars.basketSum})
,{showBasket,removeFromBasket,setLoading,calculateBasketSum})(Basket);