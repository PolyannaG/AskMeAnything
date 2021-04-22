import './App.css';
import React, {createContext, useEffect, useState} from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import Home from './pages/Home'
import NewQuestion from './pages/NewQuestion'
import NewAnswer from './pages/NewAnswer'
import MyAskMeAnything from './pages/MyAskMeAnything'
import LandingPage from "./pages/LandingPage"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import useFindUser from './hooks/useFindUser'
import PrivateRoute from "./components/PrivateRoute";
import { UserContext } from './hooks/UserContext'


//export const UserContext = createContext([]);

function App() {
   // let [signedIn, setSignedIn] = useState(true)
    //const user = FindUser()
    const { user, setUser, isLoading } = useFindUser();

    //Route may later be replaced with custom PublicRoute: user that is logged in usually cannot access
    // sign in and landing page without signing out first!

    return (

            <Router>
                <UserContext.Provider value={{ user, setUser, isLoading }}>
                <div className="App">
                    <Switch>
                        <Route exact path="/" component={LandingPage}/>
                        <Route path="/sign_in" component={SignIn}/>
                        <Route path="/sign_up" component={SignUp}/>
                        <PrivateRoute exact path="/homepage" component={Home}/>
                        <PrivateRoute path="/ask_a_question" component={NewQuestion}/>
                        <PrivateRoute path="/answer_a_question" component={NewAnswer}/>
                        <PrivateRoute path="/my_ask_me_anything" component={MyAskMeAnything}/>
                    </Switch>

                </div>
                </UserContext.Provider>
            </Router>

    );
}

export default App;
