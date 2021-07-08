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
    const [id, setID] = useState(null);
    const [username, setUsername] = useState(null);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        async function findUser() {
            console.log('finfDuseCalled')
            const tok = localStorage.getItem('token');
            await fetch('https://manageusersms.herokuapp.com/auth/user',{
                method : 'GET',
                headers:{'Content-type':'application/json', 'x-access-token':tok},
                credentials:'include'
            })
                .then(res => res.json())
                .then(res=> {
                    if (res!==undefined){
                        console.log('hi',res)
                        setID(res.id);  //will change when authentication system is added
                        console.log(res.id)
                        setUsername(res.username)
                        setLoading(false);
                    }
                    else{
                        console.log('no id')
                        setID(undefined);  //will change when authentication system is added
                        setUsername(undefined)
                        setLoading(false);
                    }

                }).catch(err => {
                    console.log(err)
                    setLoading(false);
                });
        }
        findUser();
    }, []);
    return {
        id,
        username,
        isLoading
    }
}

