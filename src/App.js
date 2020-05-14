import React, { Fragment, useEffect, Suspense } from 'react';
import './App.css';
import  Tovars from './Components/ShowProduct/ListTovars'
import Header from './Components/Header/Header';
import {Route, BrowserRouter, Switch, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import Logout from './Components/Auth/Logout';
import {autoLogin} from "./redux/authReducer";
import Preloader from "./UI/Loader/Loader"
const Auth =React.lazy(()=>import(`./Components/Auth/Auth`));
const AddTovars=React.lazy(()=>import(`./Components/addProduct/AddTovars`));
const UpdateTovars=React.lazy(()=>import(`./Components/UpdateProduct/UpdateTovars`));
const Basket=React.lazy(()=>import(`./Components/basket/Basket`));

function App(props) {

  useEffect(()=>{
    props.autoLogin();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  let routes=(
    <Switch>
    <Route path="/" exact render={()=><Tovars isAuth={props.isAuth}/>} />
    <Route path="/auth" exact render={()=>{
    return<Suspense fallback={<Preloader />}> <Auth /></Suspense>} } />
    <Redirect to='/'/>
    </Switch>
  )

  if(props.isAuth){
    routes=(
      <Switch>
    <Route path="/" exact  render={()=><Tovars  isAuth={props.isAuth} login={props.login}/>} />
    <Route path="/logout" render={()=><Logout />} />
    <Route path="/Basket" exact render={()=>{
    return<Suspense fallback={<Preloader />}> <Basket /></Suspense>} } />
    <Route path="/addTovars" exact render={()=>{
    return<Suspense fallback={<Preloader />}> <AddTovars /></Suspense>} } />
    <Route path="/udateTovars" exact render={()=>{
    return<Suspense fallback={<Preloader />}> <UpdateTovars /></Suspense>} } />
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
