import NavigationBar from "../components/NavigationBar";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import AccordionQuestions from "../components/AccordionQuestions";
import AccordioAnswers from "../components/AccordionAnswers";
import NavFooter from "../components/NavFooter";
import React, {useEffect, useState} from "react";
import {contributions_questions_per_day} from "../sample_data/contributions_per_day";
import {contributions_answers_per_day} from "../sample_data/contributions_per_day";
import {questions} from "../sample_data/questions";
import {dummy_user} from "../sample_data/user_dummy_dta";
import  "../css/Margins.css"
import ContributionsPerDayChart from "../components/ContributionsPerDay";
import QuestionsPerKeywordBarChart from "../components/QuestionsPerKeywordBarChart";
import { makeStyles } from '@material-ui/core/styles';
import {Box, Divider} from "@material-ui/core";
import {renderToString} from "react-dom/server";
import AccordionAnswers from "../components/AccordionAnswers";

function MyAskMeAnything(){

    const [questionsForShow, setQuestionsForShow]=useState([])
    const [dateFrom, setDateFrom]=useState(undefined)
    const [dateTo, setDateTo]=useState(undefined)
    const [selectedKeywords, setSelectedKeywords]=useState([])
    const [answerContributionsPerDay, setAnswerContributionsPerDay]=useState([])
    const [questionContributionsPerDay, setQuestionContributionsPerDay]=useState([])
    const [User, setUser]=useState([])
    const [radio, setRadio]=useState([])


    const loadOptions=async (value)=>{
        //value can be used to fetch the appropriate words
        if (value) {  //will fetch some keywords based on search
            console.log("user has typed something")
            //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')

            //will change when backend created:
            //resp = resp.json()
            let resp = [
                {label: 'Shark', value: 'Shark'},
                {label: 'Dolphin', value: 'Dolphin'},
                {label: 'Whale', value: 'Whale'},
                {label: 'Octopus', value: 'Octopus'},
                {label: 'Crab', value: 'Crab'},
                {label: 'Lobster', value: 'Lobster'},
            ]
            return resp
        }
    }

    const getDummyUser=async () => {
        //will change when backednd is created
        //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        return dummy_user
    }

    const getQuestionsPerDay=async()=>{
        //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        return contributions_questions_per_day
    }
    const getAnswersPerDay=async()=>{
        //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        return contributions_answers_per_day
    }

    useEffect( ()=>{
        //here the data will be fetched from the api
        getQuestionsPerDay().then(resp => setQuestionContributionsPerDay( contributions_questions_per_day) )
        getAnswersPerDay().then((resp)=>setAnswerContributionsPerDay(contributions_answers_per_day))
        getDummyUser().then(resp=>setUser(dummy_user))
    },[])

    const fetchOptions=async ()=>{
        if (radio.length){
            if (selectedKeywords.length){
                if (dateFrom!==undefined && dateTo!==undefined){
                    //keyword and enddate, startdate
                }
                else if (dateFrom!==undefined && dateTo===undefined){
                    //keyword and startdate
                }
                else if (dateFrom===undefined && dateTo!==undefined){
                    //keyword and enddate
                }
                else {
                    //only by keyword
                }
                //this will vary depending on case
                //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
                //resp = resp.json()
                setQuestionsForShow(questions)
            }
            else if (dateTo!==undefined || dateFrom!==undefined){  //only by date
                if (dateFrom!==undefined && dateTo!==undefined){
                    //enddate, startdate
                }
                else if (dateFrom!==undefined && dateTo===undefined){
                    //only startdate
                }
                else {
                    //only enddate
                }

                //this will vary depending on case
                //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
                //resp = resp.json()
                setQuestionsForShow(questions)
            }
            else {
                setQuestionsForShow([])
            }
        }
        else {
            setQuestionsForShow([])
        }

    }

    const selectedKeywordChange= (keywords)=>{

        if (keywords.length){  //the correct questions fetched
            setSelectedKeywords(keywords)
        }
        else { //random questions showed
            setSelectedKeywords([])
        }
    }
    const selectedDateFromChange=  (date)=>{
        setDateFrom(date.target.value)

    }
    const selectedDateToChange= (date)=>{
        setDateTo(date.target.value)
    }

    const handleOptionChange = (changeEvent)=>{
        setRadio(changeEvent.target.value)
    }


    useEffect(()=>{
        //console.log(selectedKeywords)
        fetchOptions()
    },[selectedKeywords,dateFrom,dateTo])

    return(
        <div>
            <NavigationBar/>
            <h1 style={{marginBottom: 30}}>My.AskMeAnything!</h1>
            <Row sm={1} md={1} lg={2} xs={1}>
                <Col lg={1}></Col>
                <Col lg={4} style={{marginTop: 20, marginBottom: 10}}>
                    <Card>
                        <Card.Header className={'bg-dark'}>
                            {User.map(User => <h4  style={{color: "#17A2B8"}}>{User.username}</h4>)}
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                {User.map(User => <Card.Title>{User.email}</Card.Title>)}
                                {User.map(User => <Card.Text>Registered since: {User.user_since}</Card.Text>)}
                            </Card.Text>
                        </Card.Body>
                        <Divider light />
                        <Box  display={'flex'}>
                            <Box p={2} flex={'auto'} >
                                <p>My questions</p>
                                {User.map(User => <h5>{User.questions}</h5>)}
                            </Box>
                            <Divider orientation="vertical" flexItem />
                            <Box p={2} flex={'auto'}>
                                <p>My answers</p>
                                {User.map(User => <h5>{User.answers}</h5>)}
                            </Box>
                        </Box>
                    </Card>
                </Col>
                    <Col lg={1}></Col>
                    <Col>
                        <h2 className='text-info'>Interact with others! </h2>
                        <Row sm={2} md={2} lg={3} xs={1} className="justify-content-center">
                            <Card style={{width: '18rem', alignItems: 'center'}}>
                                <Card.Img variant="top"
                                          src="https://marysvillemartialarts.com/wp-content/uploads/2017/08/questions-reponses-profits.jpg"/>
                                <Card.Body>
                                    <Button variant="info" href='/ask_a_question'>Ask a question!</Button>
                                </Card.Body>
                            </Card>

                            <Card style={{width: '18rem'}}>
                                <Card.Img variant="top"
                                          src="https://www.fastweb.com/uploads/article_photo/photo/2035812/crop635w_iStock-1177765368.jpg"/>
                                <Card.Body>
                                    <Button variant="info" href='/answer_a_question'>Answer a question!</Button>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
            </Row>
            <Row sm={1} md={1} lg={2} xs={1} style={{marginTop: 20}}>
                <Col>
                    <div style={{marginLeft : '10px', marginRight : '10px'}}>
                        <h2 class='text-info'>
                            My contributions per day:
                        </h2>

                        {answerContributionsPerDay.length && <ContributionsPerDayChart dataQuestions={questionContributionsPerDay} dataAnswers={answerContributionsPerDay}/>}
                    </div>
                </Col>
                <Col>
                    <div style={{marginLeft: '10px', marginRight: '10px'}}>
                        <h2 className='text-info'>
                            My questions per keyword:
                        </h2>
                        <p>{' '}</p>
                        <QuestionsPerKeywordBarChart/>
                        <p>{' '}</p>
                    </div>
                </Col>
            </Row>
            <p>{' '}</p>
            <h2 className='headerText'>Browse through my questions and answers</h2>
            <p>{' '}</p>
            <Form.Group as={Row} sm={1} md={1} lg={4} xs={1} className="justify-content-center">
                <Col lg={1}></Col>
                <Col lg={2} className="justify-content-left">
                    <Form>
                        <Form.Check
                            className="mb-3"
                            type="radio"
                            label="Questions"
                            name="RadioButtons"
                            value="RadioButtons"
                            defaultChecked
                            id="RadioQuestions"
                            onChange={handleOptionChange}
                        />
                        <Form.Check
                            className="mb-3"
                            type="radio"
                            label="Answers"
                            name="RadioButtons"
                            id="RadioAnswers"
                            value="RadioAnswers"
                            onChange={handleOptionChange}
                        />
                    </Form>
                </Col>
                <Col lg={4} style={{maxWidth: '500px'}}>
                    <Form.Label>Search for keywords:</Form.Label>
                    <AsyncSelect
                        noOptionsMessage={() => 'No keywords found.'}
                        loadingMessage={() => 'Looking for keywords'}
                        placeholder={'Select keywords of questions..'}
                        isMulti
                        cacheOptions
                        defaultOptions
                        getOptionLabel={e => e.value}
                        getOptionValue={e => e.value}
                        loadOptions={loadOptions}
                        onChange={selectedKeywordChange}
                        openMenuOnClick={false}
                        components={{DropdownIndicator: () => null, IndicatorSeparator: () => null}}

                    />
                </Col>
                <Col lg={2} style={{maxWidth: '500px'}}>
                    <Form>
                        <Form.Label>Select starting date:</Form.Label>
                        <Form.Control type={"date"} onChange={selectedDateFromChange}/>
                    </Form>
                </Col>
                <Col lg={2} style={{maxWidth: '500px'}}>
                    <Form>
                        <Form.Label>Select end date:</Form.Label>
                        <Form.Control type={"date"} onChange={selectedDateToChange}/>
                    </Form>
                </Col>
                <Col lg={1}></Col>
            </Form.Group>
            {radio == "RadioAnswers" ?
                <AccordionAnswers questions={questionsForShow}/>
            :
                <AccordionQuestions questions={questionsForShow}/>
            }
            <NavFooter/>
        </div>

    )
}
export default MyAskMeAnything