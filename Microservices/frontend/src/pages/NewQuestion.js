import NavigationBar from "../components/NavigationBar";
import NavFooter from "../components/NavFooter";
import React, {useContext, useState} from "react";
import {Row, Col, Form, FormLabel, Button, FormGroup} from "react-bootstrap";
import "../css/Margins.css"
import {useHistory} from "react-router-dom";
import MultipleValueTextInput from 'react-multivalue-text-input';
import AsyncSelect from "react-select/async/dist/react-select.esm";
import {UserContext} from "../hooks/UserContext";

function NewQuestion(){

    let history = useHistory();

    const { id, username, isLoading } = useContext(UserContext);

    const [text,setText]=useState()
    const [title,setTitle]=useState()
    const [keywords,setKeywords]=useState()
    const tok = localStorage.getItem('token');


    const [validated, setValidated] = useState(false)
    const handleSubmit = async (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
            setValidated(true)
        } else {
            try {

                //history.go(-1) //we need to go to the previous page
                event.preventDefault()
                event.stopPropagation()
                const resp = await fetch(` https://createquestionmsapp.herokuapp.com/create_question`, {
                    method: 'POST',
                    headers: {'Content-type': 'application/json', 'x-access-token':tok},
                    credentials: 'include',
                    body: JSON.stringify({
                        title: title,
                        text: text,
                        keywords: keywords,
                        Userid: id
                    })
                })
                if (resp.ok) {
                    setValidated(true)
                    alert('Question created successfully')
                   // history.push('/homepage')
                    history.goBack();
                } else {
                    const response = await resp.json()
                    console.log(response)
                    if (response.message)
                        alert(response.message)
                    else
                        alert('Error creating question please try again')
                }
            }catch (e){
                console.log(e)
                alert('Error creating question please try again')
            }
        }
    }

    const handleTitleChange=(event)=>{
        console.log(event.target.value)
        setTitle(event.target.value)
    }

    const handleTextChange=(event)=>{
        console.log(event.target.value)
        setText(event.target.value)
    }

    const handleKeywordChange=((item, allItems) => {
        console.log(item, allItems)
        setKeywords(allItems)
    })

    return(
        <div>
            <NavigationBar/>
            <h1 className={"top-space-questions"}>Ask a question</h1>
            <Form noValidate validated={validated} onSubmit={ handleSubmit} >
                <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={2}>
                        <h5>
                            Question Title:
                        </h5>
                    </Col>
                    <Col lg={9}>
                        <Form.Control
                            as="textarea"
                            name="QuestionTitle"
                            id="QuestionTitle"
                            required
                            placeholder={'Insert title here'}
                            onChange={handleTitleChange}
                            />
                        <Form.Control.Feedback> </Form.Control.Feedback>
                        <Form.Control.Feedback type={"invalid"}>Title is required</Form.Control.Feedback>
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={2}>
                        <h5>
                            Question Text:
                        </h5>
                    </Col>
                    <Col lg={9}>
                        <Form.Control
                            as="textarea"
                            name="QuestionText"
                            id="QuestionText"
                            required
                            placeholder={'Insert question text here'}
                            rows={7}
                            onChange={handleTextChange}
                        />
                        <Form.Control.Feedback> </Form.Control.Feedback>
                        <Form.Control.Feedback type={"invalid"}>Question Text is required</Form.Control.Feedback>
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={2}>
                        <h5>
                            Keywords:
                        </h5>
                    </Col>
                    <Col lg={9}>
                        <MultipleValueTextInput
                            onItemAdded={handleKeywordChange}
                            onItemDeleted={handleKeywordChange}
                            name="item-input"
                            placeholder="Insert keywords: press enter at the end of each keyword"
                        />
                    </Col>
                </FormGroup>
                <Button size={"lg"} variant="info" type="submit">Submit</Button>
                <Button size={"lg"} style={{marginLeft : '10px'}} variant="outline-info" onClick={()=>history.goBack()}>Cancel</Button>
            </Form>
            <NavFooter/>
        </div>
    )
}
export default NewQuestion