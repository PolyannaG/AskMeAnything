import NavFooter from '../components/NavFooter'
import NavigationBar from "../components/NavigationBar";
import AccordionQuestions from "../components/AccordionQuestions";
import {questions} from '../sample_data/questions'
import {questions_per_month} from "../sample_data/questions_per_month";
import {Row, Col, Form, Button, Card} from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import React, {useEffect, useState} from "react";
import QuestionsPerKeywordBarChart from "../components/QuestionsPerKeywordBarChart";
import QuestionsPerMonthChart from "../components/QuestionsPerMonthChart";
import QuestionsPerDayChart from "../components/QuestionsPerDayChart";
import 'antd/dist/antd.css'
import {questions_per_day} from "../sample_data/questions_per_day";
import '../css/HeaderText.css'
import NavigationBarNotSignedIn from "../components/NavigationBarNotSignedIn";


function Home(){

    const [questionsForShow, setQuestionsForShow]=useState([])
    const [dateFrom, setDateFrom]=useState(undefined)
    const [dateTo, setDateTo]=useState(undefined)
    const [selectedKeywords, setSelectedKeywords]=useState([])
    const [questionsPerMonth, setQuestionsPerMonth]=useState([])
    const [questionsPerDay, setQuestionsPerDay]=useState([])



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

    const getQuestionsPerDay=async()=>{
        //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        return questions_per_day
    }
    const getQuestionsPerMonth=async()=>{
        //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        return questions_per_month
    }

    useEffect( ()=>{

        //here the data will be fetched from the api
        getQuestionsPerDay().then(resp => setQuestionsPerDay( questions_per_day) )
        getQuestionsPerMonth().then((resp)=>setQuestionsPerMonth(questions_per_month))

    },[])

    const fetchOptions=async ()=>{
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


    useEffect(()=>{
        console.log(selectedKeywords)
        fetchOptions()
    },[selectedKeywords,dateFrom,dateTo])


    return(
        <div>
            <NavigationBarNotSignedIn/>
            <h1 >Welcome to AskMeAnything!</h1>
            <h2 className='headerText'>Our site's activity</h2>
            <Row sm={1} md={1} lg={2} xs={1}>
                <Col>
                    <div style={{marginLeft : '10px', marginRight : '10px'}}>
                        <h2 class='text-info'>
                            Most popular questions are about:
                        </h2>
                        <p>{' '}</p>
                        <QuestionsPerKeywordBarChart/>
                        <p>{' '}</p>
                    </div>

                </Col>
                <Col>
                    <h2 class='text-info'>Interact with others! </h2>
                    <Row sm={2} md={2} lg={3} xs={1} className="justify-content-center" >

                        <Card style={{ width: '18rem', alignItems : 'center'}}>
                            <Card.Img variant="top" src="https://marysvillemartialarts.com/wp-content/uploads/2017/08/questions-reponses-profits.jpg" />
                            <Card.Body >
                                <Card.Title>Ask a question!</Card.Title>
                                <Button variant="info" href='/sign_up'>Sign up now</Button>
                            </Card.Body>
                        </Card>

                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src="https://www.fastweb.com/uploads/article_photo/photo/2035812/crop635w_iStock-1177765368.jpg" />
                            <Card.Body>
                                <Card.Title>Give your own answers!</Card.Title>
                                <Button variant="info" href='/sign_up'>Sign up now!</Button>
                            </Card.Body>
                        </Card>

                    </Row>
                </Col>
            </Row>
            <Row sm={1} md={1} lg={2} xs={1}>
                <Col>
                    <div style={{marginLeft : '10px', marginRight : '10px'}}>
                        <h2 class='text-info'>Questions asked this year:</h2>
                        <p>{' '}</p>
                        {questionsPerMonth.length && <QuestionsPerMonthChart dataPoints={questionsPerMonth}/>}

                    </div>
                </Col>
                <Col>
                    <div style={{marginLeft : '10px', marginRight : '10px'}}>
                        <h2 class='text-info'>Questions asked this month:</h2>
                        <p>{' '}</p>
                        {questionsPerDay.length && <QuestionsPerDayChart dataPoints={questionsPerDay}/>}
                        <p>{' '}</p>
                    </div>
                </Col>
            </Row>
            <p>{' '}</p>
            <h2 className='headerText'>Browse through questions</h2>
            <p>{' '}</p>
            <Form.Group as={Row} sm={1} md={1} lg={3} xs={1} className="justify-content-center">
                <Col style={{maxWidth : '500px'}} >
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
                        components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}

                    />
                </Col>
                <Col style={{maxWidth : '500px'}} >
                    <Form>
                        <Form.Label>Select starting date:</Form.Label>
                        <Form.Control type={"date"} onChange={selectedDateFromChange}/>
                    </Form>

                </Col>
                <Col style={{maxWidth : '500px'}} >
                    <Form>
                        <Form.Label>Select end date:</Form.Label>
                        <Form.Control type={"date"} onChange={selectedDateToChange}/>
                    </Form>
                </Col>
            </Form.Group>
            <AccordionQuestions questions={questionsForShow}/>
            {questionsForShow.length!=0 && <Row className='justify-content-center' style={{marginTop : '30px'}}>
                <Button variant='info' href='/sign_up'>Sign up to see more!</Button>
            </Row>}
            <NavFooter/>
        </div>

    )
}
export default Home