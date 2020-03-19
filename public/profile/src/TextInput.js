import React, {useState, useEffect} from 'react';


export function TextInput({value, name, defaultValue}) {
    const [isEdit, setEdit] = useState(false);
    const [disabled, setDisabled] = useState("disabled");
    const editToggle = () => {
        setEdit(!isEdit)
        setDisabled(!disabled)
      } 
    console.log(value)
    return (
        <div className="col-sm-12">
           
            <input 
            type="text" 
            className="form-control mb-2" 
            name="name"
            defaultValue={defaultValue}
            disabled = {(disabled) ? "disabled" : ""}/>

           
    </div>
    )
}