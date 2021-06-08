import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../hooks/UserContext';
import Loading from '../components/Loading';


export default function PrivateRoute(props) {
    const { id, username, isLoading } = useContext(UserContext);
    const { component: Component, ...rest } = props;
    if(isLoading) {
        return <Loading/>
    }
    if(id){
        console.log('id is', id)
        return ( <Route {...rest} render={(props) =>
                (<Component {...props}/>)
            }
            />
        )}
    //redirect if there is no user
    return <Redirect to='/' />
}