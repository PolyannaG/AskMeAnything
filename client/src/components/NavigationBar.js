import React, {useContext} from "react";
import {Navbar, NavDropdown, Nav, Button, Image} from "react-bootstrap";
import {UserContext} from "../hooks/UserContext";
import {useHistory} from "react-router-dom";

function NavigationBar(){

    const { user, isLoading } = useContext(UserContext);
    const history = useHistory();

    return(
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/homepage">
                <img
                    alt=""
                    src="../../favicon.ico"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
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
                        <Image
                            alt=""
                            src="../../favicon.ico"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            roundedCircle
                        />{' '}
                        {user}
                    </Nav.Link>
                </Nav>

                    <Button variant="outline-info" href={'./'}>Sign Out</Button>

            </Navbar.Collapse>
        </Navbar>
    )
}
export default NavigationBar