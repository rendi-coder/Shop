import Axios from 'axios'



const SET_TOVARS="SET_TOVARS"
const SET_ACTIVE_CARD="SET_ACTIVE_CARD"
const SET_VALIDATOR="SET_VALIDATOR"
const LOADING="LOADING"
const SET_URL="SET_URL"
const SHOW_BASKET="SHOW_BASKET"
const SET_BASKET_SUM="SET_BASKET_SUM"

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
    url:"",
    basket:null,
    basketSum:null,
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
    
    case SHOW_BASKET:return{
        ...state,basket:action.basket
    }

    case SET_BASKET_SUM:{
        if(!state.basketSum){
            return{
                ...state,
                basketSum:{tovars:[{article:action.product.article,sum:action.product.sum}],sum:action.product.sum}
            }
        }
        else{
            let copyTovars='';
            let sum=0;
            for (let i = 0; i < state.basketSum.tovars.length; i++) {
                if(state.basketSum.tovars[i].article===action.product.article){
                    copyTovars=[...state.basketSum.tovars];
                    copyTovars[i].sum=action.product.sum;
                    sum+=Number(action.product.sum);
                }
                else{
                    sum+=Number(state.basketSum.tovars[i].sum);
                }
            }
            if(copyTovars){ return{
                ...state,
                basketSum:{tovars:copyTovars,sum:sum}
            }}
           return{
               ...state,
               basketSum:{tovars:[...state.basketSum.tovars,{...action.product}],sum:sum+Number(action.product.sum)}
           }
        }
    }
        
     default:
         return state;
    }
 
 }

const setTovars=(tovars)=>({type:SET_TOVARS,tovars}) 

const setActiveCardSuccess=(activeCard)=>({type:SET_ACTIVE_CARD,activeCard})

const setValidatorAC=(validate)=>({type:SET_VALIDATOR,validate})

export const setActiveCard=(activeCard)=>(dispatch)=>{
    dispatch(setActiveCardSuccess(activeCard));
}

export const getAllTovars=()=>(dispatch)=>{
    Axios.get(`https://store-d3926.firebaseio.com/Tovars.json`).then(data=>{
        dispatch(setTovars(data.data))
        dispatch(setLoading("success"));
        dispatch(setLoading(false));
    })
}

export const deleteTovar=(idTovar,article)=>(dispatch)=>{
    Axios.get(`https://store-d3926.firebaseio.com/Tovars.json`).then(data=>{
        data.data.splice(idTovar,1);

    Axios.put(`https://store-d3926.firebaseio.com/Tovars.json`,data.data)
        .then(response=>{
            deleteItemAllBaskets(article);
            dispatch(setTovars(response.data))
            })
        });
}


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

export const  updateCard=(image,title,price,description,discont,discontDate,id,article)=>(dispatch)=>{
       // const article = window.store.getState().tovars.activeCard.tovar.article;   
        Axios.put(`https://store-d3926.firebaseio.com/Tovars/${id}/tovar.json`,{url:image,title,price,description,discont,discontDate,article})
        .then(response=>{
        dispatch(setLoading("success"));
        dispatch(setUrlImg("")); 
        dispatch(setLoading(false))});
      
}

export const uploadTovars=(image,title,price,description,discont,discontDate)=>(dispatch)=>{
            const article = `f${(~~(Math.random()*1e8)).toString(16)}`;
            Axios.get(`https://store-d3926.firebaseio.com/Tovars.json`).then(data=>{
            Axios.put(`https://store-d3926.firebaseio.com/Tovars/${data.data?data.data.length:0}/tovar.json`,{url:image,title,price,description,discont,discontDate,article})
            .then(response=>{
                dispatch(setUrlImg("")); 
                dispatch(setLoading("success"));
                dispatch(setLoading(false));
            })
            });
}


export const setUrlImg=(url)=>({type:SET_URL,url})

export const setLoading=(status)=>({type:LOADING,status})



///Basket
const showBasketSuccess=(basket)=>({type:SHOW_BASKET,basket});

const  deleteItemAllBaskets=(article)=>{
    Axios.get(`https://store-d3926.firebaseio.com/Basket.json`).then(data=>{
        let basket=data.data;
        for (let key in basket) {
            if(basket[key].find((e)=>e===article)){
                let delIndex=basket[key].indexOf(article);
                basket[key].splice(delIndex,1);
            }
           
          }
        
       Axios.put(`https://store-d3926.firebaseio.com/Basket.json`,basket);
       
    })
}

export const addItemToBasket=(article)=>()=>{
    const login = window.store.getState().auth.login.replace(/\./gi, ' ');
    
    Axios.get(`https://store-d3926.firebaseio.com/Basket/${login}.json`)
    .then(response=>{
        
        let result=response.data && response.data.some((e)=>e===article);
        if(result)return;

        let basket=[article];

        if(response.data){
            basket=[...response.data,article];
        }

        Axios.put(`https://store-d3926.firebaseio.com/Basket/${login}.json`,basket);
        

    });
    
}

export const showBasket=()=>(dispatch)=>{
    const login = window.store.getState().auth.login.replace(/\./gi, ' ');
    Axios.get(`https://store-d3926.firebaseio.com/Basket/${login}.json`).then(response=>{
        if(response.data){
        let tovars=window.store.getState().tovars.tovars;
        let basket=[];
        for (let key in tovars) {
            let article=tovars[key].tovar.article;
            let articleMatch=response.data.some(e=>e===article);
            if(articleMatch){
                basket.push(tovars[key].tovar);
            }
          }
        dispatch(showBasketSuccess(basket));
        }
        dispatch(setLoading("success"));
        dispatch(setLoading(false));
    })
}

export const removeFromBasket=(article)=>(dispatch)=>{
    const login = window.store.getState().auth.login.replace(/\./gi, ' ');
    let basket=[...window.store.getState().tovars.basket];
    for (let i = 0; i < basket.length; i++) {
       if(basket[i].article===article){
            basket.splice(i,1);
       }   
    }
    let newBasket=basket.map(i=>i.article);
    Axios.put(`https://store-d3926.firebaseio.com/Basket/${login}.json`,newBasket).then(response=>{
        dispatch(showBasketSuccess(basket));
    })
}


export const calculateBasketSum=(product)=>(dispatch)=>{
    dispatch({type:SET_BASKET_SUM,product});
}


//end basket


 export default tovarsReducer