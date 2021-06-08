import {Navbar} from "react-bootstrap";
import React from "react";

function MyHeader(){
    return(
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{marginLeft: '10%', marginRight: '10%', textAlign : 'left', marginTop : '10%'}}>
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
        </Navbar>
    )
}
export default MyHeader