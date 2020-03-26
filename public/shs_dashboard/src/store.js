import React, { createContext } from 'react';
import { observable, computed, action, decorate } from "mobx"
import { useLocalStore } from 'mobx-react';
import axios from 'axios';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const store = useLocalStore(() => ({
        user: {
            _id: "121154-32fsdf2121fsd",
            name: "Ningyao Ningshen",
            email: "ajaxning@gmail.com",
            phone: "9560650801",
            admin: "true",
            bio: "Set me free"
        },
        users: [],
        fetchUser() {
            return axios.get("user")
                .then(user => {
                    store.user = user;
                    console.log("from store", user)
                })
        },
        fetchUsers() {
            return axios.get("users")
                .then((users) => {
                    store.users = users;
                    return users;
                })
                .catch(err => {
                    console.log("==+++", err)
                })
        }
    }));



    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    )
}