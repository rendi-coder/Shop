import React, { Component } from 'react'
import classes from './Tovars.module.css'
import {Redirect, NavLink} from 'react-router-dom'
import {getAllTovars} from '../../redux/tovarsReducer'
import {connect} from 'react-redux';
import Tovars from './Tovars'

class ListTovars extends Component{

    componentDidMount(){
        this.props.getAllTovars();
    }
    
    componentDidUpdate(prevProps){
        if(prevProps.allTovars!==this.props.allTovars){
            this.setState({tovars:this.props.allTovars})
        }
    }

    state={
        tovars:null
    }

    render(){
        if(!this.props.isAuth)  return <Redirect to="/auth" />
    return(
        <div className={classes.Tovars}>
            <div className={classes.container}>
                <h3 className={classes.title}>Список товаров</h3>
                <div className={classes.row}>
                    {this.props.login==="mamba11@gmail.com"?
                     <AddNewTovars />
                     :null}
                    {/* mamba11@gmail.com | 221197 */}
                     {this.state.tovars && this.state.tovars.map((item,index)=><Tovars tovar={item.tovar} key={index} id={index}/>)}
                </div>
            </div>
        </div>
    )
    }   
}

export const AddNewTovars=(props)=>{
    
    return(
        <div className={classes.column}>
            <NavLink to="addTovars">
            <div className={classes.cardItem}>
                    <div className={classes.cardImg}>
                        <img src="https://firebasestorage.googleapis.com/v0/b/store-d3926.appspot.com/o/109741.png?alt=media&token=c4d8da15-7baf-41ba-84fd-c06ca0c02d72" alt="123"/>
                    </div>
            <h5 className={classes.nameTovars}> Добавить новый товар</h5>
            </div>
            </NavLink>
        </div>
    )
}

const mapStateToProps=(state)=>{
    return{
        allTovars:state.tovars.tovars
    }
}

export default connect(mapStateToProps,{getAllTovars}) (ListTovars)