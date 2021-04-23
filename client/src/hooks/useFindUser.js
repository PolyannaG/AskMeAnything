import { useState, useEffect } from 'react';
//import axios from 'axios';
/*
async function FindUser(){
    let username = 'poly' //fetch
    const tmp=await fetch('https://jsonplaceholder.typicode.com/todos/1')
    username = "One to"
    return username

}
export default FindUser


 */

export default function useFindUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        async function findUser() {
            /*await fetch('https://jsonplaceholder.typicode.com/todos/1')   //will change when authentication system is added
                .then(res => {
                    setUser("Polyanna");  //will change when authentication system is added
                    setLoading(false);
                }).catch(err => {
                    setLoading(false);
                });*/
            setUser("Polyanna");  //will change when authentication system is added
            setLoading(false);
        }
        findUser();
    }, []);
    return {
        user,
        isLoading
    }
}


