import NavigationBar from "../components/NavigationBar";
import {useHistory, useLocation} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {Button, Carousel, Col, Form, FormGroup, FormLabel, ListGroup, Row} from "react-bootstrap";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import NavFooter from "../components/NavFooter";
import {questions} from "../sample_data/questions";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import  "../css/Margins.css"
import {UserContext} from "../hooks/UserContext";

function NewAnswer(){

    const location = useLocation();
    let history = useHistory();
    const { id, username, isLoading } = useContext(UserContext);


    const [titles, setTitles]=useState([])
    const [specificQuestion, setSpecificQuestion]=useState([])
    const [answerText, setAnswerText]=useState([])


    const GetQuestionByID = async (Question) =>{
        console.log(Question)
        if (Question !== null) {
            let resp= await fetch(`http://localhost:8005/view_question/id/${Question.id}`,{
                method: 'GET',
                headers: {'Content-type': 'application/json'},
                credentials: 'include'
            })
            if (resp.ok){
                resp=await resp.json()
                console.log(resp)
               resp.map((item) => {

                    if (item.keywords !== undefined && item.keywords.length !== 0) {

                        let keyw = ""
                        for (let i = 0; i < item.keywords.length - 1; i++) {

                            keyw = keyw + item.keywords[i].keyword + ", "
                            //   console.log(keyw)
                        }
                        // console.log(item.keywords[ item.keywords.length-1])
                        keyw = keyw + item.keywords[item.keywords.length - 1].keyword
                        item.keywords = keyw

                    }
                })

                let response = await fetch(`http://localhost:8004/view_answer/for_question/${Question.id}`,{
                    method: 'GET',
                    headers: {'Content-type': 'application/json'},
                    credentials: 'include'
                })
                if (response.ok){
                    const answers = await response.json()
                    resp[0].answers = answers[0].answers
                }

                console.log(resp)
                setSpecificQuestion(resp[0])
                console.log(specificQuestion)
            }
            else{
                setSpecificQuestion([])
            }

        }
        else {
            let spec={
                keywords: "",
                text: ""
            }
            setSpecificQuestion(spec)
            return null
        }
    }

    const DatabaseQuestions = async () => {
        if (location.state!==undefined && location.state.questionID!==null){
            console.log(location.state.questionID)
            await GetQuestionByID({id :location.state.questionID})
        }
        else
        {
            let resp = await fetch(`http://localhost:8005/view_question/all_titles`, {
                method: 'GET',
                headers: {'Content-type': 'application/json'},
                credentials: 'include'
            })
            if (resp.ok) {
                resp = await resp.json()
                console.log(resp)
                setTitles(resp)
            } else
                setTitles([])
        }
    }


    const [validated, setValidated] = useState(false)
    const handleSubmit = async (event) => {
        console.log(specificQuestion.id)
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
            if (!specificQuestion.id && answerText.length!==0){
                console.log('hi')
                alert('Please select a question to answer!')
                event.preventDefault()
                event.stopPropagation()

            }
        }

        else {
            event.preventDefault()
            event.stopPropagation()
            //history.go(-1) //we need to go to the previous page
            try {
                let resp = await fetch(`http://localhost:8000/create_answer/${specificQuestion.id}`, {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({
                        text: answerText,
                        Userid: id
                    })
                })
                if (resp.ok) {
                    setValidated(true)
                    alert('Answer created successfully')
                   // history.push('/homepage')
                    history.goBack();

                } else {
                    const response = await resp.json()
                    console.log(response)
                    if (response.message)
                        alert(response.message)
                    else
                        alert('Error creating your answer please try again')
                }
            }catch (e){
                console.log(e)
                alert('Error creating your answer please try again')
            }

            setValidated(true)
        }
    };

    useEffect(()=>{
        DatabaseQuestions()
    },[ ])


    const handleAnswerChange=(event)=> {
        console.log(event.target.value)
        setAnswerText(event.target.value)
    }


    return(
        <div>
            <NavigationBar/>

            <h1 className={"top-space-questions"}>Answer a question</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit} >
                {location.state!==undefined && location.state.questionID!==null ?
                    <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                        <Col lg={1}>
                        </Col>
                        <Col lg={10}>
                            <FormLabel>Selected question</FormLabel>
                            <Form.Control
                                as="textarea"
                                name="titleSelected"
                                id="titleSelected"
                                value={specificQuestion.title}
                                readOnly={true}
                                rows={3}
                            />
                        </Col>
                    </FormGroup>
                    :
                    <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                        <Col lg={1}></Col>
                        <Col lg={10}>
                            <FormLabel>Select a question</FormLabel>
                            <Autocomplete
                                as={Row}
                                id="titleSelect"
                                options={titles}
                                getOptionLabel={(option) => option.title}
                                autoHighlight
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required={true}
                                        //error={isFormInvalid}
                                        name="Qtitle"
                                        //helperText={isFormInvalid && "api key required"}
                                        label="Type a question title"
                                        variant="outlined"
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password', // disable autocomplete and autofill
                                        }}
                                    />
                                )}
                                onChange={(event, newValue) => {
                                    GetQuestionByID(newValue)
                                   // console.log(newValue.id)
                                }}
                            />
                        </Col>
                    </FormGroup>
                }
                <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={1}></Col>
                    <Col lg={10}>
                        <FormLabel>Question's keywords</FormLabel>
                        <Form.Control
                            as="textarea"
                            name="Keywords"
                            id="Keywords"
                            readOnly={true}
                            placeholder={"Keywords"}
                            value={specificQuestion.keywords}
                            rows={1}
                        />
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={1}></Col>
                    <Col lg={10}>
                        <FormLabel>Question's text</FormLabel>
                        <Form.Control
                            as="textarea"
                            name="Question text"
                            id="Question text"
                            readOnly={true}
                            placeholder={"Question text"}
                            value={specificQuestion.text}
                            rows={6}
                        />
                    </Col>
                </FormGroup>

                <FormGroup as={Row} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={1}></Col>
                    <Col lg={10}>
                        <FormLabel>Other answers for this question</FormLabel>
                        {specificQuestion.answers === undefined ?
                            <Form.Control
                                as="textarea"
                                readOnly={true}
                                placeholder={"Answers"}
                            />
                            :
                            (
                                specificQuestion.answers.length === 0 ?
                                <Carousel interval={null} style={{marginTop : '10px', marginBottom: '10px'}}>
                                        <Carousel.Item style={{marginTop:'10px' , marginBottom:'10px'}}>
                                            No answers for this question
                                        </Carousel.Item>
                                </Carousel>
                                :
                                <Carousel interval={null} style={{marginTop : '10px', marginBottom: '10px'}}>
                                    {specificQuestion.answers.map((item,i)=>
                                        <Carousel.Item style={{marginTop:'10px' , marginBottom:'10px'}} id={i + 1}>
                                            {item.text}
                                        </Carousel.Item>
                                    )}
                                </Carousel>
                            )
                        }
                    </Col>
                </FormGroup>

                <FormGroup as={Row} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={1}></Col>
                    <Col lg={10}>
                        <Form.Control
                            required
                            as="textarea"
                            id="myAnswer"
                            name="myAnswer"
                            placeholder="Type your answer here"
                            rows={7}
                            onChange={handleAnswerChange}
                        />
                        <Form.Control.Feedback> </Form.Control.Feedback>
                        <Form.Control.Feedback type={"invalid"}>Answer is required to submit</Form.Control.Feedback>
                    </Col>
                </FormGroup>
                <Button size={"lg"} variant="info" type="submit" >Submit answer</Button>
                <Button size={"lg"} style={{marginLeft : '10px'}} variant="outline-info" onClick={()=>history.goBack()}>Never Mind</Button>
            </Form>



            <NavFooter/>

        </div>

    )
}
export default NewAnswer