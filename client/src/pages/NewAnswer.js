import NavigationBar from "../components/NavigationBar";
import {useHistory, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Carousel, Col, Form, FormGroup, FormLabel, ListGroup, Row} from "react-bootstrap";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import NavFooter from "../components/NavFooter";
import {questions} from "../sample_data/questions";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import  "../css/Margins.css"

function NewAnswer(){

    const location = useLocation();
    let history = useHistory();

    const [selectedKeywords, setSelectedKeywords]=useState([])
    const [questionsForShow, setQuestionsForShow]=useState([])
    const [specificQuestion, setSpecificQuestion]=useState([])

    const GetQuestionByID = async () =>{
        if (location.state!==undefined && location.state.questionID!==null) {
            //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1') //will fetch question data
            //resp = resp.json()
            questions.forEach( (currentValue) => {
                    if (location.state.questionID === currentValue.id){
                        setSpecificQuestion(currentValue)
                    }
                }
            )
        }
        else return null
    }

    const GetQuestionByIDAnswer = async (QuestionID) =>{
        if (QuestionID !== null) {
            //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1') //will fetch question data
            //resp = resp.json()
            questions.forEach( (currentValue) => {
                    if (QuestionID.id === currentValue.id){
                        setSpecificQuestion(currentValue)
                    }
                }
            )
        }
        else return null
    }

    const DatabaseQuestions = async () => {
        //value can be used to fetch the appropriate words
        //will fetch all questions
        //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        //resp = resp.json()
        setQuestionsForShow(questions)
    }

    const selectedKeywordChange= (keywords)=>{

        if (keywords.length){  //the correct questions fetched
            setSelectedKeywords(keywords)
        }
        else { //random questions showed
            setSelectedKeywords([])
        }
    }

    const [validated, setValidated] = useState(false)
    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        else {
            //DOES NOT WORK
            history.go(-1) //we need to go to the previous page
        }
        setValidated(true)
    };

    useEffect(()=>{
        DatabaseQuestions()
        GetQuestionByID()
    },[questionsForShow, specificQuestion])


    /*const arrivalValidationMessage = 'Please insert a question title';
    const [isFormInvalid, setIsFormInvalid] = useState(false);
    const validate = values => {
        if (values.Qtitle !== "") {
            setIsFormInvalid(false);
        } else {
            setIsFormInvalid(true);
        }
    };*/
    let ID
    const getAnswers = async (answers) => {

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
                                options={questionsForShow}
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
                                    GetQuestionByIDAnswer(newValue)
                                }}
                            />
                        </Col>
                    </FormGroup>
                }
                <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={1}></Col>
                    <Col lg={10}>
                        <Form.Control
                            as="textarea"
                            name="Keywords"
                            id="Keywords"
                            readOnly={true}
                            placeholder={"Keywords"}
                            value={specificQuestion.keywords}
                        />
                    </Col>
                </FormGroup>

                <FormGroup as={Row} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={1}></Col>
                    <Col lg={10}>

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
                        />
                        <Form.Control.Feedback> </Form.Control.Feedback>
                        <Form.Control.Feedback type={"invalid"}>Answer is required to submit</Form.Control.Feedback>
                    </Col>
                </FormGroup>
                <Button size={"lg"} variant="info" type="submit" >Submit answer</Button>
                <Button size={"lg"} style={{marginLeft : '10px'}} variant="outline-info" href="/answer_a_question">Never Mind</Button>
            </Form>



            <NavFooter/>

        </div>

    )
}
export default NewAnswer