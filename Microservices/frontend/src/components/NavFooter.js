import React, {useState} from "react";
import {Button, Nav, Navbar, NavDropdown, Row, Col, Container, Collapse, Modal} from "react-bootstrap";
import { ExternalLink } from 'react-external-link';
import {Link} from "react-router-dom";

//to make footer fixed on the bottom and scroll without footer use 'fixed' instead of 'sticky;

function NavFooter(){
    const [modalShow, setModalShow] = React.useState(false);
    const [modalShow2, setModalShow2] = React.useState(false);
    return(
        <div>
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Contact Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Modal.Body>
                        <h5>Polytimi-Anna Gkotsi:</h5>
                            email: polyanna.gkotsi@gmail.com
                    </Modal.Body>
                    <Modal.Body>
                        <h5>Aikaterini Liagka:</h5>
                        email: katerinaliaga1999@gmail.com
                    </Modal.Body>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={() => setModalShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={modalShow2}
                onHide={() => setModalShow2(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        About
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    This is a project developed during the 'Software Architecture and Services' subject in the National Technical University of Athens, in the 2020-2021 class year.
                    The backend of this project has been developed in two ways, using a Service Oriented Architecture (SOA) in the one case and a Microservices with choreography based
                    architecture in the other case.
                    <h1></h1>
                    The technologies used for the backend development are NestJS, JWT for access token authentication and a Redis server for messaging.
                    For the frontend development we have used ReactJS and Bootstrap / React-Bootstrap for styling. Feel free to navigate on our pages as well as our code!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={() => setModalShow2(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        <Navbar style={{marginTop : '50px'}} collapseOnSelect expand="lg" bg="dark" variant="dark"  sticky="bottom">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Row style={{width : "100%"}}  xs={1} md={1} lg={5}>
                    <Col >
                        <Nav.Link className="text-info" onClick={() => setModalShow2(true)}>About</Nav.Link>
                    </Col>
                    <Col>
                        <Nav.Link className="text-info" onClick={() => setModalShow(true)}>Contact Us</Nav.Link>
                    </Col>
                    <Col>
                        <Nav.Link className="text-info" href="https://github.com/PolyannaG/AskMeAnything">Project Documentation</Nav.Link>
                    </Col>
                    <Col>
                        <Nav.Link className="text-info" href="https://github.com/PolyannaG/AskMeAnything">Link on Github</Nav.Link>
                    </Col>
                    <Col>
                        <Nav.Link className="text-info" href="https://courses.pclab.ece.ntua.gr/course/view.php?id=34">Course Materials</Nav.Link>
                    </Col>
                </Row>
            </Navbar.Collapse>
        </Navbar>
        </div>

    )
}

export default NavFooter