import React from 'react'
import {showBasket,removeFromBasket,setLoading} from '../../redux/tovarsReducer'
import {connect} from 'react-redux'
import classes from './Basket.module.css';
import Loader from "../../UI/Loader/Loader"
import {calculateBasketSum} from '../../redux/tovarsReducer'

class Basket extends React.Component{
    componentDidMount(){
        this.props.setLoading(true);
        this.props.showBasket();
    }
   
    render(){
        if(this.props.loading){return <Loader />}
        if(!this.props.basket || this.props.basket.length===0)return (<div style={{textAlign:'center'}}><h1>Корзина пуста</h1></div>)
    return(
        <div className={classes.container}>

            <section className={classes.head}>
            <div >
                <h1>Корзина</h1>
                <small>В вашей корзине: <b>{this.props.basket.length} товара</b></small>
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
                               
                               {this.props.basket&&this.props.basket.map((item)=><Product product={item} key={item.article} removeProduct={this.props.removeFromBasket} calculateBasketSum={this.props.calculateBasketSum}/>)}    
                               
                            </tbody>
                        </table>
                    </form>
                
            </section>
            <section className={classes.footer}>
                    <h2>К ОПЛАТЕ: {this.props.basketSum&&this.props.basketSum.sum}  грн</h2>
            </section>
        </div>
    )
    }
}

class Product extends React.Component{

    PRICE=new Date(this.props.product.discontDate)-new Date()>0 ? (this.props.product.price-(this.props.product.price*this.props.product.discont/100)).toFixed():this.props.product.price

    state={
        count:1,
        sum:this.PRICE,
        price:this.PRICE
    }
    componentDidMount(){
        this.props.calculateBasketSum({article:this.props.product.article,
            sum:this.PRICE
            });
    }

    componentDidUpdate(prevProps,prevState){
        if(prevState.count!==this.state.count){
            this.setState({
                sum:this.state.count*this.state.price
            })
            this.props.calculateBasketSum({article:this.props.product.article,
                sum:this.state.count*this.state.price
                });
        }
    }

    removeProduct=(article)=>{
        this.props.removeProduct(article);
        this.props.calculateBasketSum({article:article,
            sum:0
            });
    }

    changeCountproduct=(e)=>{
        if(e.target.value>0 && e.target.value.length){
        this.setState({
            count:e.target.value
        })
        }
    }

    render(){
        
    return(
        <tr className={classes.listTovars}>
                                    <td><img src={this.props.product.url} width="100" height="100" alt="productPhoto"/></td>
                                    <td><span>{this.props.product.title}</span></td>
                                    <td><span>{this.state.price}</span></td> 
                                    <td><input type="number" onChange={(e)=>this.changeCountproduct(e)} value={this.state.count} style={{width:75}}/></td>
                                    <td><span>{this.state.sum}</span></td>
                                    <td><button onClick={()=>this.removeProduct(this.props.product.article)} className={classes.button}><img height="30" width="30" src="https://s1.iconbird.com/ico/0912/RadiumNeue/w256h2561348762189Delete.png" alt=""/></button></td>
         </tr>
    )
    }
}

export default connect((state)=>({basket:state.tovars.basket,loading:state.tovars.loading,basketSum:state.tovars.basketSum})
,{showBasket,removeFromBasket,setLoading,calculateBasketSum})(Basket);