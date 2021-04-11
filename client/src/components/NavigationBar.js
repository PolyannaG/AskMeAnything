import React, {useContext} from "react";
import {Navbar, NavDropdown, Nav, Button, Form} from "react-bootstrap";
import {UserContext} from "../hooks/UserContext";

function NavigationBar(){

    const { user, isLoading } = useContext(UserContext);

    return(
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/homepage">AskMeAnything</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/my_ask_me_anything">MyAskMeAnything</Nav.Link>
                    <NavDropdown title="More" id="collasible-nav-dropdown" >
                        <NavDropdown.Item href="/ask_a_question">Ask a question</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/answer_a_question">Answer a question</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    <Navbar.Text >Signed in as:</Navbar.Text>
                    <Nav.Link className="font-weight-bold text-info"   href="/my_ask_me_anything">{user}</Nav.Link>
                </Nav>

                    <Button variant="outline-info" href={'./'}>Sign Out</Button>

            </Navbar.Collapse>
        </Navbar>
    )
}
export default NavigationBar