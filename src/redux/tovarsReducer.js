import {storage} from '../firebse/firebase-config'
import Axios from 'axios'



const SET_TOVARS="SET_TOVARS"
const SET_ACTIVE_CARD="SET_ACTIVE_CARD"
const SET_VALIDATOR="SET_VALIDATOR"
const LOADING="LOADING";
const SET_URL="SET_URL"


let initialState={
    tovars:null,
    activeCard:null,
    validate:{  validateImg:" ",
                validateTitle:false,
                priceValid:false,
                descriptionValid:true,
                discontPriceValid:true,
                discontDataValid:true},
    loading:false,
    url:""
 }
 
 const tovarsReducer=(state=initialState,action)=>{
 
 switch(action.type){
    
    case SET_URL:return{
        ...state,url:action.url
    }

    case LOADING:{
        return{
            ...state,loading:action.status
        }
    }

    case SET_TOVARS:
        return{
            ...state,tovars:action.tovars
        }
        
    case SET_ACTIVE_CARD:
        return{
            ...state,activeCard:action.activeCard
        }   
        
    case SET_VALIDATOR:
        return{
            ...state,validate:action.validate
        } 
        
     default:
         return state;
    }
 
 }

const setActiveCardSuccess=(activeCard)=>({type:SET_ACTIVE_CARD,activeCard})

export const setActiveCard=(activeCard)=>(dispatch)=>{
    dispatch(setActiveCardSuccess(activeCard));
}



const setTovars=(tovars)=>({type:SET_TOVARS,tovars})

export const getAllTovars=()=>(dispatch)=>{
    Axios.get(`https://store-d3926.firebaseio.com/Tovars.json`).then(data=>{
        dispatch(setTovars(data.data))
      
    })
}

export const deleteTovar=(idTovar)=>(dispatch)=>{
    Axios.get(`https://store-d3926.firebaseio.com/Tovars.json`).then(data=>{
        data.data.splice(idTovar,1);

    Axios.put(`https://store-d3926.firebaseio.com/Tovars.json`,data.data)
        .then(response=>{
            dispatch(setTovars(response.data))
            })
        });
}

const setValidatorAC=(validate)=>({type:SET_VALIDATOR,validate})

export const validator=(selectedFile,title,price,description,discontPrice,discontData)=>(dispatch)=>{
        const validateImg=selectedFile!==null?(selectedFile.name?selectedFile.name:true):false;
        const validateTitle=title.length>=20 && title.length<=60 ? true:false;
        const priceValid=!isNaN(Number(price)) && price>=1 &&price<99999999.99;
        const descriptionValid=description.length>200?false:true;
        let discontPriceValid=true;
        let discontDataValid=true;
        if(discontPrice.length>0 || discontData.length>0){
            discontPriceValid=Number.isInteger(Number(discontPrice)) && discontPrice>=10 && discontPrice<=90;
            discontDataValid=new Date(discontData)-new Date()>0;
        }
        dispatch(setValidatorAC({
            validateImg,
            validateTitle,
            priceValid,
            descriptionValid,
            discontPriceValid,
            discontDataValid
        }));
}

export const  updateCard=(image,title,price,description,discont,discontDate,id)=>(dispatch)=>{
    if(typeof image!=="string"){
    const uploadTask=storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(`state_changed`, ()=>{

    }, error=>{
        //console.log(error)
    }, ()=>{
        storage.ref(`images`).child(image.name).getDownloadURL().then(url=>{
    
            Axios.put(`https://store-d3926.firebaseio.com/Tovars/${id}/tovar.json`,{url,title,price,description,discont,discontDate})
            .then(response=>{
                dispatch(setUrlImg(""))
                dispatch(setLoading("success"));
                dispatch(setLoading(false))
            });
        })})
    }
    
    else{
        Axios.put(`https://store-d3926.firebaseio.com/Tovars/${id}/tovar.json`,{url:image,title,price,description,discont,discontDate})
        .then(response=>{
            dispatch(setLoading("success"));
            }).then(resp=>{
                dispatch(setUrlImg("")); 
                 dispatch(setLoading(false))});
        //console.log(image);
    }
}

export const uploadTovars=(image,title,price,description,discont,discontDate)=>(dispatch)=>{
            Axios.get(`https://store-d3926.firebaseio.com/Tovars.json`).then(data=>{
            Axios.put(`https://store-d3926.firebaseio.com/Tovars/${data.data?data.data.length:0}/tovar.json`,{url:image,title,price,description,discont,discontDate})
            .then(response=>{
                //console.log(response)
                dispatch(setUrlImg("")); 
                dispatch(setLoading("success"));
                dispatch(setLoading(false));
            })
            });
}




export const setUrlImg=(url)=>({type:SET_URL,url})

export const uploadImage=(image)=>(dispatch)=>{
    const uploadTask=storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(`state_changed`, ()=>{

    }, error=>{
        //console.log(error)
    }, ()=>{
        storage.ref(`images`).child(image.name).getDownloadURL().then(url=>{
            dispatch(setUrlImg(url)); 
            dispatch(setLoading(false));
            });
        })  
}

export const setLoading=(status)=>({type:LOADING,status})

 export default tovarsReducer