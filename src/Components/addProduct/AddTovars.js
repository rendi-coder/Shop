import React, {useState, useEffect } from 'react'
import {uploadTovars,setUrlImg} from '../../redux/tovarsReducer'
import {validator} from '../../redux/tovarsReducer'
import {connect} from 'react-redux'
import FormAddTovars from './FormAddTovars'
import {setLoading} from '../../redux/tovarsReducer'
import Loader from "../../UI/Loader/Loader"

const AddTovars=(props)=> {

   const [selectedFile,setSelectedFile]=useState(null);
   const [title,setTitle]=useState("");
   const [price,setPrice]=useState("");
   const [description,setDescription]=useState("");
   const [discontData,setDiscontData]=useState("");
   const [discontPrice,setDiscontPrice]=useState("");


   useEffect(()=>{
    props.validator(selectedFile,title,price,description,discontPrice,discontData);}, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFile,title,price,description,discontPrice,discontData]);


   const fileSelectedHandler=e=>{
        if(e.target.files[0]&&e.target.files[0].type.match('image.*')){
            let reader=new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload=async (e)=>{
                    await props.setUrlImg(e.target.result);
                    let img=new Image();img.src=e.target.result
                    if(img.width>4000||img.height>4000||img.width<200||img.height<200){
                    props.setUrlImg("errorSize");
                    setSelectedFile(null);
                    return}
            }
        setSelectedFile(e.target.files[0])
        }
        else{
        setSelectedFile(null);
        props.setUrlImg("");
        }
    }


   const uploadFile=()=>{
       
        const validate=props.validate;
        if(validate.validateImg && validate.validateTitle && validate.priceValid && validate.descriptionValid && validate.discontPriceValid && validate.discontDataValid){
        const image = props.urlImg
        props.uploadTovars(image,title,price,description,discontPrice,discontData);
        props.setLoading(true);
        setSelectedFile(null);
        setTitle("");
        setPrice("");
        setDescription("");
        setDiscontData("");
        setDiscontPrice("");
        alert("Товар добавлен")
        }
    }


        if(props.loading){return <Loader />}
      
    return(
        <FormAddTovars
         title={title}
         changeTitle={e=>setTitle(e.target.value)}
         urlImg={props.urlImg}
         fileSelectedHandler={fileSelectedHandler}
         price={price}
         changePrice={e=>setPrice(e.target.value)}
         description={description}
         changeDescription={e=>setDescription(e.target.value)}
         discontPrice={discontPrice}
         changeDiscontPrice={(e)=>setDiscontPrice(e.target.value)}
         discontData={discontData}
         changeDiscontData={e=>setDiscontData(e.target.value)}
         uploadFile={uploadFile}
         validator={props.validate}
         isFormValid={props.isFormValid}
         />
    )

}

const mapStateToProps=(state)=>{
    return{
        validate:state.tovars.validate,
        loading:state.tovars.loading,
        urlImg:state.tovars.url,
        isFormValid:Object.keys(state.tovars.validate).map((key)=>state.tovars.validate[key]).some(el=>el===false)
    }
}

export default connect(mapStateToProps,{setUrlImg,uploadTovars,validator,setLoading})(AddTovars)