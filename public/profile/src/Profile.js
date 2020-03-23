import * as React from "react";
import { useState, useEffect } from 'react';
import { observer, useObservable } from "mobx-react-lite";
import { AddPicture } from './AddPicture'
import { EditForm } from './EditForm';
import avatar from './avatar.png';
import './css/profile.css';


export const  Profile =  observer((props) => {
    const style = {
        verticalAlign: "middle",
        width: "50px",
        height: "50px",
        borderRadius: "50%"
    }
    const font = {
        fontFamily: 'monospace',
        fontStyle: "bold",
        fontSize: "15px",
        color: "black"
    }
    const [isToggle, setToggled] = useState(false);

    useEffect(() => {
        console.log(isToggle)
    })
    
    const toggle = () => setToggled(!isToggle)

    return (
        <div>
            {isToggle ? (
                <div className="row">
                    <div className="col-sm-3">
                        <button 
                        onClick={toggle}
                        style={{
                            verticalAlign: "middle",
                            display: "inline-block",
                            left: "50px",
                            right: "50px"
                        }} className="btn btn-sm btn-outline-danger mb-5">Return To Profile</button>
                    </div>
                  
                    <div className="col-sm-8">
                        <EditForm store={props.store}/>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="row">
                    <div className="col-sm-12">
                        <img className="avatar" style={style} src={avatar} /> <br />
                        <p style={font}>{props.store.user.bio}.<sub><sub> <span style={{fontSize: "10px", color: "red"}}><i>{props.store.user.name}</i></span></sub></sub></p>
                       
                    </div>
                    <div className="col-sm-12">
                    <AddPicture /> <br />
                    </div>

                    <div className="col-sm-12">
                        <button 
                        onClick={toggle}
                        className="btn btn-sm btn-outline-primary">Edit</button> &nbsp;
                        <button className="btn btn-sm btn-outline-danger">Deactivate</button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
})

