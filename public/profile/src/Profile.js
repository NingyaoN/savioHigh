import * as React from "react";
import { useState, useEffect } from 'react';
import { Observer, useObservable } from "mobx-react-lite";
import { AddPicture } from './AddPicture'
import { EditForm } from './EditForm';
import avatar from './avatar.png';
import './css/profile.css';


export function Profile(props) {
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

    const [name, setName] = useState(props.profile.name);
    const [email, setEmail] = useState(props.profile.email);
    const [phone, setPhone] = useState(props.profile.phone);
    const [status, setStatus] = useState(props.profile.status);

    //attribute 
   

    useEffect(() => {
        console.log(isToggle)
    })
    
    const person = useObservable({ name: "Ningyao Ningshen" });
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
                        <EditForm profile={props.profile}/>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="row">
                    <div className="col-sm-12">
                        <img className="avatar" style={style} src={avatar} /> <br />
                        <p style={font}>{props.profile.bio}.<sub><sub> <span style={{fontSize: "10px", color: "red"}}><i>{props.profile.name}</i></span></sub></sub></p>
                       
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
}

