// @ts-nocheck
import React from 'react'
import './styles/AppInputs.css'

export function AppInput(props) {
 
  const { label, className, iconleft, iconright, title, googlestylelabel, value } = props
  
  return ( 
    <label 
      className={`appInput commonInput ${className ?? ""} ${googlestylelabel ? "googlestyle" : ""} ${value?.length ? "hasValue" : ""}`}
      title={title ?? ""}
    > 
      { iconleft }
      { label && <h6>{label}</h6> }
      <input {...props} />
      { googlestylelabel && <h6 className="googlestylelabel">{googlestylelabel}</h6> }
      { iconright }
    </label>
  )   
}     

export function AppSelect(props) {
  const { options, label, onChange, onClick, value, className, button } = props
  let optionsdata = options?.map((data,i) =>
    <option 
      key={i} 
      selected={data.selected} 
      disabled={data.disabled} 
      value={data.value} 
    >  
      {data.name || data.label}
    </option>
  )  
  return ( 
    <label className={`appSelect commonInput ${className ?? ""}`} onClick={(e) => onClick&&onClick(e)}>
      <h6>{label}</h6>
      <select onChange={(e) => onChange(e)} value={value}>
        {optionsdata}
      </select>
      {button}
    </label>
  )
} 

export function AppTextarea(props) {
 
  const { label, iconclass, className } = props
   
  return ( 
    <label className={`appTextarea commonInput ${className ?? ""}`}> 
      <h6>{label}</h6>
      <textarea style={{paddingRight: iconclass?"40px":"10px"}} {...props} />
    </label>
  )   
} 
 
export function AppSwitch(props) { 

  const { iconclass, label, onChange, checked, className } = props

  return (   
    <div className={`appSwitch commonInput ${className ?? ""}`}>  
    <h6>
      <i className={iconclass}></i>
      {label}
    </h6> 
    <label className="form-switch">
        <input type="checkbox" onChange={(e) => onChange(e)} checked={checked}/>
        <i></i> 
    </label>   
    </div>
  )  
} 
