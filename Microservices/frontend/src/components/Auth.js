import React, {useEffect, useState} from 'react'
import FindUser from "../hooks/useFindUser";

export const AuthContext = React.createContext([])

export default function Auth({children}) {
    let [signedIn, setSignedIn] = useState()

    async function getUser() {
        const username = FindUser()
        return "polly"
    }

    useEffect(() => {
        // setIsAuthed('etser()')
        FindUser().then((res)=>{
            console.log(res)
            setSignedIn(res)
            console.log(signedIn)
        })

    },[])


    return (
        <AuthContext.Provider value={signedIn}>
            {children}
        </AuthContext.Provider>)
}