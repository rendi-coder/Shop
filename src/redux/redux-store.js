import {createStore, combineReducers,applyMiddleware} from 'redux'
import authReducer from './authReducer'
import tovarsReducer from './tovarsReducer'
import  thunkMiddleware from "redux-thunk"


let reducers=combineReducers({
    auth:authReducer,
    tovars:tovarsReducer,
}
);

let store=createStore(reducers,applyMiddleware(thunkMiddleware));

window.store=store;

export default store;