import React, {useContext} from "react";
import {Navbar, NavDropdown, Nav, Button, Image} from "react-bootstrap";
import {UserContext} from "../hooks/UserContext";
import {useHistory} from "react-router-dom";

function NavigationBar(){

    const { id, username, isLoading } = useContext(UserContext);
    const history = useHistory();

    async function handleSignOut(){
        try{
/*
            const resp=await fetch('https://manageuserssoa.herokuapp.com/authentication/logout',{
                method: 'POST',
                headers:{'Content-type':'application/json'},
                credentials:'include'
            })
            if (!resp.ok){
                console.log('error loging out')
            }
            else{

 */
                console.log('successful logout')
            localStorage.clear()
                window.location.reload();
          //  }
        }
        catch (err){
            console.log(err)
        }

    }

    return(
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/homepage">
               {' '}
                AskMeAnything
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/my_ask_me_anything">MyAskMeAnything</Nav.Link>
                    <NavDropdown title="More" id="collasible-nav-dropdown" >
                        <NavDropdown.Item href="/ask_a_question">Ask a question</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={()=>{
                            history.push({
                                pathname: '/answer_a_question',
                                state: {questionID : null}
                            })
                        }}>Answer a question</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    <Navbar.Text >Signed in as:</Navbar.Text>
                    <Nav.Link className="font-weight-bold text-info" href="/my_ask_me_anything">
                        {' '}
                        {username}
                    </Nav.Link>
                </Nav>

                <Button variant="outline-info" onClick={handleSignOut}>Sign Out</Button>

            </Navbar.Collapse>
        </Navbar>
    )
}
export default NavigationBar