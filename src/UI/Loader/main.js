import React from 'react'
import mainPhoto from '../../img/2344535444.png'
import Button from '../Button/Button'
import { NavLink } from 'react-router-dom'

const Main=(props)=>{
     return(  <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                <h1 style={{paddingTop:"50px",fontSize:40}}>Оптовый магазин</h1>
                <div>
                        <img src={mainPhoto} alt=""></img>
                </div>
                <div style={{paddingTop:"20px",paddingBottom:'50px'}}>
                   <NavLink to="/auth"> <Button type="success">Авторизоваться</Button></NavLink>
                </div>
            </div>
     )
}
export default Main