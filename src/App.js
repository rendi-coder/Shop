import React, { Fragment, useEffect } from 'react';
import './App.css';
import  Tovars from './Components/ShowProduct/ListTovars'
import Header from './Components/Header/Header';
import Auth from './Components/Auth/Auth'
import {Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import Logout from './Components/Auth/Logout';
import {autoLogin} from "./redux/authReducer";
import AddTovars from './Components/addProduct/AddTovars';
import UpdateTovars from './Components/UpdateProduct/UpdateTovars'
import Basket from './Components/basket/Basket'

function App(props) {

  useEffect(()=>{
    props.autoLogin();
  })

  let routes=(
    <Switch>
    <Route path="/" exact render={()=><Tovars isAuth={props.isAuth}/>} />
    <Route path="/auth" exact render={()=><Auth />} />
    <Redirect to='/'/>
    </Switch>
  )

  if(props.isAuth){
    routes=(
      <Switch>
    <Route path="/" exact  render={()=><Tovars  isAuth={props.isAuth} login={props.login}/>} />
    <Route path="/logout" render={()=><Logout />} />
    <Route path="/Basket" exact render={()=><Basket />} />
    <Route path="/addTovars" render={()=><AddTovars />} />
    <Route path="/udateTovars"  render={()=><UpdateTovars />} />
    <Redirect to='/'/>
      </Switch>
    )
  }

  return (
   <Fragment>
     <BrowserRouter>
      <Header isAuth={props.isAuth} login={props.login} />
      <div className="main">
      {routes}
      </div>
    </BrowserRouter>
   </Fragment>
  );
}

const mapStateToProps=(state)=>{
  return{
    isAuth:!!state.auth.token,
    login:state.auth.login
  }
}

export default connect(mapStateToProps,{autoLogin}) (App);
