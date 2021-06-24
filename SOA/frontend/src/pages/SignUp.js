import {Form, Col, Row, Button} from "react-bootstrap";
import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";
import MyHeader from "../components/MyHeader";
import '../css/SignInSignUp.css'
import createUser from "../hooks/createUser";
import checkCredentials from "../hooks/checkCredentials";



function SignUp(){

     let history = useHistory();  //will change when login is added

    const [validated, setValidated] = useState(false)
    const [password, setPassword] = useState()
    const [repeat_password, setRepeat_password] = useState()
    const [username, setUsername] = useState()
    const [email, setEmail]=useState()


    const handleSubmit = async (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false || repeat_password!==password) {
            event.preventDefault()
            event.stopPropagation()
        }

        else {
            event.preventDefault()
            event.stopPropagation()
            console.log(username,password,email)
            const userCreated=await createUser(username,password,email)
            if (userCreated){
                //history.push('./homepage')
                //setRedirect(true)
                console.log('Successful creation of user')
                const login=await checkCredentials(username,password)
                if (!login){
                    console.log('error logging new user in')
                }
                else{
                    console.log("successfully logged new user in")
                    const resp=await fetch('http://localhost:8007/authentication/logout',{
                        method: 'POST',
                        headers:{'Content-type':'application/json'},
                        credentials:'include'
                    })
                    //document.location.reload()
                    alert('Signed up successfully!')
                    history.push('/')
                }

            }
            else{
                console.log('error in creating user')
            }
        }


        setValidated(true)
    };

    return(
        <div className='generalPosition'>
            <MyHeader/>
            <h1 className='headText'>Sign Up</h1>
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
                <Form.Group as={Row} className="align-items-center">
                    <Col/>
                    <Col controlId="validationCustom01b" class="mx-auto">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter an email"
                            onChange={(event)=>setEmail(event.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please type an email.</Form.Control.Feedback>
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
                <Form.Group as={Row}>
                    <Col/>
                    <Col   controlId="validationCustom03" class="mx-auto">
                        <Form.Label>Retype Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Enter a password"
                            onChange={(event)=>setRepeat_password(event.target.value)}
                            isInvalid={repeat_password!==password && repeat_password!==undefined}
                        />
                        {repeat_password===password && repeat_password!==undefined &&
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        }
                        {repeat_password!==password && repeat_password!==undefined &&
                        <Form.Control.Feedback type="invalid">
                            Passwords do not match!
                        </Form.Control.Feedback>
                        }
                        {repeat_password===undefined &&
                        <Form.Control.Feedback type="invalid">
                            Please retype password.
                        </Form.Control.Feedback>
                        }

                    </Col>
                    <Col/>
                </Form.Group>

                <Button variant="info" style={{marginRight : '10px'}}type="submit">Sign up</Button>
                <Button  variant="outline-info" href="/">Cancel</Button>
                <Row>
                    <Col/>
                    <Col>
                        <Form.Text style={{marginTop : '10px'}}>Already have an account?</Form.Text>
                        <Link to="/sign_in">Sign In</Link>
                    </Col>
                    <Col/>
                </Row>

            </Form>

        </div>

    )






}
export default SignUp