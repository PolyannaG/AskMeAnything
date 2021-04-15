import React from "react";
import {Button, Nav, Navbar, NavDropdown, Row, Col, Container, Collapse} from "react-bootstrap";

//to make footer fixed on the bottom and scroll without footer use 'fixed' instead of 'sticky;

function NavFooter(){
    return(

        <Navbar style={{marginTop : '50px'}} collapseOnSelect expand="lg" bg="dark" variant="dark"  sticky="bottom">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Row style={{width : "100%"}}  xs={1} md={1} lg={5}>
                    <Col >
                        <Nav.Link className="text-info" href="/about">About</Nav.Link>
                    </Col>
                    <Col>
                        <Nav.Link className="text-info" href="/contact_us">Contact Us</Nav.Link>
                    </Col>
                    <Col>
                        <Nav.Link className="text-info" href="/project_documentation">Project Documentation</Nav.Link>
                    </Col>
                    <Col>
                        <Nav.Link className="text-info" href="/link_on_github">Link on Github</Nav.Link>
                    </Col>
                    <Col>
                        <Nav.Link className="text-info" href="/course_materials">Course Materials</Nav.Link>
                    </Col>
                </Row>
            </Navbar.Collapse>
        </Navbar>

    )
}

export default NavFooter