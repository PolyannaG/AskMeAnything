import {Form, Col, Row, Button} from "react-bootstrap";
import React, {useState} from "react";
import MyHeader from "../components/MyHeader";
import {Link, Redirect} from "react-router-dom";
import '../css/SignInSignUp.css'
import { useHistory } from "react-router-dom";
import checkCredentials from "../hooks/checkCredentials";


function SignIn(){

    //let history = useHistory();  //will change when login is added

    const [validated, setValidated] = useState(false)
    const [password, setPassword] = useState()
    const [username, setUsername] = useState()
    //const [redirect, setRedirect]=useState(false)

    const handleSubmit = async (event) => {
        //event.preventDefault()
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        else {
            event.preventDefault()
            event.stopPropagation()
            console.log(username,password)
            const isUser=await checkCredentials(username,password)
            if (isUser){
                //history.push('./homepage')
                //setRedirect(true)
                console.log('Successful login')
                document.location.reload()
            }
            else{
                alert('Invalid username or password!')
            }
            // history.push('./homepage')  //will change when login is added
        }

    };

    // if (redirect) return <Redirect to='/homepage' />
    // else
    return(
        <div className='generalPosition'>
            <MyHeader/>
            <h1 className='headText'>Sign In</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit} >
                <Form.Group as={Row} className="align-items-center">
                    <Col/>
                    <Col controlId="validationCustom01" class="mx-auto">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter a username"
                            onChange={(event)=>setUsername(event.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please type a username.</Form.Control.Feedback>
                    </Col>
                    <Col/>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col/>
                    <Col controlId="validationCustom02" class="mx-auto">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Enter a password"
                            onChange={(event)=>setPassword(event.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please type a password.</Form.Control.Feedback>
                    </Col>
                    <Col/>
                </Form.Group>
                <Button variant="info" style={{marginRight : '10px'}}type="submit">Sign in</Button>
                <Button  variant="outline-info" href="/">Cancel</Button>
                <Row>
                    <Col/>
                    <Col>
                        <Form.Text style={{marginTop : '10px'}}>Don't have an account yet?</Form.Text>
                        <Link to="/sign_up">Sign up</Link>
                    </Col>
                    <Col/>
                </Row>
            </Form>
        </div>

    )






}
export default SignIn