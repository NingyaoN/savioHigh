import React, { useState, useEffect } from 'react';

import { Profile } from './Profile';
import { BackButton } from './BackButton';
import Axios from 'axios';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import DotLoader from "react-spinners/DotLoader";
import logo from './logo.svg';
import './css/App.css';
import './css/profile.css';



const override = css`
  display: flex;
  margin: auto;
  border-color: red;
  text-align:center;

`;


const userID = "5e6e6a9ad08aef04bc53b978"
function App() {
  const [user, setUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const profile = {
    name: "Ningyao Ningshen",
    phone: "9560650801",
    email: "ajaxning@gmail.com",
    password: "password",
    status: "",
  }


  useEffect(() => {
    Axios.get(`user/${userID}`)
      .then((response) => {
        console.log(response.data)
        setUser(response.data)
        setLoading(false);
      })
  }, [])

  if (loading) {
    return (
      <div className="App">
        <div className="App-header">

          <div className=" sweet-loading">
            <DotLoader
              css={override}
              size={150}
              color={"#123abc"}
              loading={loading}
            />
            <p style={{color: "black"}}>Fetching Data...</p>
          </div>
        </div>
      </div>

    )
  } else {
    return (
      <div className="App">
        <div className="row">
          <div className="col-sm-12">
            <BackButton />
          </div>
          <div className="col-sm-12">
            <header className="App-header">
              <Profile profile={user} />
            </header>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
