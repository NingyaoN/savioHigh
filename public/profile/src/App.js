import React, { useState, useEffect, createContext } from 'react';
import { observer, useObservable } from "mobx-react-lite";
import { Profile } from './Profile';
import { Post } from './Post';
import { BackButton } from './BackButton';
import Axios from 'axios';
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import DotLoader from "react-spinners/DotLoader";
import logo from './logo.svg';
import './css/App.css';
import './css/profile.css';

//mobx store


const override = css`
  display: flex;
  margin: auto;
  border-color: red;
  text-align:center;

`;

const ProfileContext = createContext();

const userID = "5e6e6a9ad08aef04bc53b978"
const App = observer((props) => {
  const {profile} = props;

  const store = useObservable({
    user: {},
    loading: true,
    fetchError: false,
  

    fetchUser(id) {
      return Axios.get(`/user/${userID}/fetch`)
        .then(res => {
          this.setLoading();
          console.log(res.data)
          this.user = res.data;
          return res.data;
        })
        .catch(() => {
          this.setLoading();
          this.setFetchError();
        })
    },
    updateUser(user) {
      console.log("===========  ")
      console.log(this.user)
      Axios.post(`user/profile/${this.user._id}/update`, { user })
      .then((response) => {
            console.log(response)
      })
      .catch(err => {

      })
    },
    setLoading() {
      this.loading = !this.loading;
    },
    setFetchError() {
      this.fetchError = !this.fetchError;
    }

  })

  useEffect(() => {
    store.fetchUser(userID)
  }, [])

  if (store.fetchError) {
    return (
      <div>
        <h5>Error While fetching document.</h5>
      </div>
    )
  } else if (!store.fetchError && store.loading) {
    return (
      <div className="App">
        <div className="App-header">

          <div className=" sweet-loading">
            <DotLoader
              css={override}
              size={150}
              color={"#123abc"}
              loading={store.loading}
            />
            <p style={{ color: "black" }}>Fetching Data...</p>
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
                <Post />
                <Profile store={store}/>
            </header>
          </div>
        </div>
      </div>
    )
  }
})

export default App;
