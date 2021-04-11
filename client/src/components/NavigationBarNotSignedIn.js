import React from "react";
import {Navbar, NavDropdown, Nav, Button} from "react-bootstrap";


function NavigationBarNotSignedIn(){

    return(
        <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">
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
                </Nav>
                <Button variant="outline-info" style={{marginRight : '10px'}} href="/sign_in">Sign In</Button>
                <Button variant="outline-info" href="/sign_up">Sign Up</Button>

            </Navbar.Collapse>
        </Navbar>
        </div>
    )
}
export default NavigationBarNotSignedIn