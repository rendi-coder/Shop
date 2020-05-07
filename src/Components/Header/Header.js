import React from 'react'
import classes from './Header.module.css'
import logo from '../../img/3dFh8T5d.jpg'
import { NavLink } from 'react-router-dom'
import {connect} from 'react-redux'

const Header=(props)=>{
    return (
        <div className={classes.header}>
            <div className={classes.container}>
                <div className={classes.logo}>
                <img src={logo} alt="logotip"/>
                </div>
                <nav className={classes.headerNav}>
                 {props.loading!==true?<NavLink to="/">Главная</NavLink>:null}
                    <div>
                    {props.isAuth?
                    <div><span className={classes.login}><span>Login:</span>{props.login}</span>
                    <NavLink to="/logout">Выйти</NavLink></div>
                    :<NavLink to="/auth">Авторизация</NavLink>}
                    </div>
                </nav>
            </div>
        </div>
    )
}


const mapStateToProps=(state)=>{
    return{
        loading:state.tovars.loading
    }
}

export default connect(mapStateToProps,null)(Header);