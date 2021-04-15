import NavFooter from '../components/NavFooter'
import NavigationBar from "../components/NavigationBar";
import AccordionQuestionsUser from "../components/AccordionQuestionsUser";
import {questions} from '../sample_data/questions'
import {Row, Col, Form, Button, Card} from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import React, {useEffect, useState} from "react";
import QuestionsPerKeywordBarChart from "../components/QuestionsPerKeywordBarChart";
import {CanvasJS, CanvasJSChart} from "canvasjs-react-charts";
import QuestionsPerMonthChart from "../components/QuestionsPerMonthChart";
import {DatePicker} from 'antd'
import 'antd/dist/antd.css'


function Home(){



    const [questionsForShow, setQuestionsForShow]=useState([])
    const [dateFrom, setDateFrom]=useState(undefined)
    const [dateTo, setDateTo]=useState(undefined)
    const [selectedKeywords, setSelectedKeywords]=useState([])
    const [questionsPerMonth, setQuestionsPerMonth]=useState([])
    const [graphDateFrom, setGraphDateFrom]=useState()
    const [graphDateTo, setGraphDateTo]=useState()


    const loadOptions=async (value)=>{
        //value can be used to fetch the appropriate words
        if (value) {  //will fetch some keywords based on search
            console.log("user has typed something")
            let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')

            //will change when backend created:
            resp = resp.json()
            resp = [
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

    useEffect(()=>{

       setQuestionsPerMonth( [
            { x: new Date(2020, 4), y: 30 },
            { x: new Date(2020, 5), y: 339 },
            { x: new Date(2020, 6), y: 400 },
            { x: new Date(2020, 7), y: 520 },
            { x: new Date(2020, 8), y: 30 },
            { x: new Date(2020, 9), y: 420 },
            { x: new Date(2020, 10), y: 371 },
            { x: new Date(2020, 11), y: 380 },
            { x: new Date(2021, 0), y: 371 },
            { x: new Date(2021, 1), y: 380 },
            { x: new Date(2021, 2), y: 340 },
            { x: new Date(2021, 3), y: 432 },
        ])
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
            let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
            resp = resp.json()
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
            let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
            resp = resp.json()
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
    const graphDateFromChange = (date)=>{
        setGraphDateFrom(date.target.value)
    }
    const graphDateToChange=(date)=>{
        setGraphDateTo(date.target.value)
    }




    useEffect(()=>{
        console.log(selectedKeywords)
        fetchOptions()
    },[selectedKeywords,dateFrom,dateTo])


    return(
        <div>
            <NavigationBar/>
            <h1 >Welcome to AskMeAnything!</h1>
            <h2 style={{backgroundColor : '#343A40', padding : '5px', color : '#5bc0de', marginTop : '30px', marginBottom : '30px', marginLeft:'15%', marginRight : '15%'}}>Our site's activity</h2>
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
                                    <Button variant="info" href='/ask_a_question'>Ask a question!</Button>
                                </Card.Body>
                            </Card>

                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="https://www.fastweb.com/uploads/article_photo/photo/2035812/crop635w_iStock-1177765368.jpg" />
                                <Card.Body>
                                    <Button variant="info" href='/answer_a_question'>Answer a question!</Button>
                                </Card.Body>
                            </Card>

                    </Row>
                </Col>
            </Row>
            <Row sm={1} md={1} lg={2} xs={1}>
                <Col>
                    <div style={{marginLeft : '10px', marginRight : '10px'}}>
                        <h2 class='text-info'>Questions asked each month:</h2>
                        <Row sm={1} md={1} lg={2} xs={1}>
                            <Col>
                                <Form>
                                    <Form.Label>Select start date:</Form.Label>
                                    <Form.Control type={"date"} onChange={graphDateFromChange}/>
                                </Form>
                            </Col>
                            <Col>
                                <Form>
                                    <Form.Label>Select end date:</Form.Label>
                                    <Form.Control type={"date"} onChange={graphDateToChange}/>

                                </Form>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Button variant={'info'} style={{marginTop : '10px'}} >Show results!</Button>
                        </Row>
                        {questionsPerMonth.length && <QuestionsPerMonthChart dataPoints={questionsPerMonth}/>}
                        <p>{' '}</p>
                    </div>
                </Col>
                <Col>
                    <div style={{marginLeft : '10px', marginRight : '10px'}}>
                        <h2 class='text-info'>Questions asked each day:</h2>
                        <Row>
                            <p>{' '}</p>
                        </Row>
                        <Row sm={1} md={1} lg={1} xs={1} className="justify-content-center">

                                <Form.Label style={{marginRight : '10px'}}>Select end date:</Form.Label>
                                <DatePicker style={{maxWidth : '400px', height : '38px'}} onChange={(e)=>console.log(e.toDate().getMonth())} picker="month" />
                        </Row>

                        <Row>
                            <p>{' '}</p>
                        </Row>
                        <Row>
                            <p>{' '}</p>
                        </Row>
                        {questionsPerMonth.length && <QuestionsPerMonthChart dataPoints={questionsPerMonth}/>}
                        <p>{' '}</p>
                    </div>
                </Col>
            </Row>
            <p>{' '}</p>
            <h2 style={{backgroundColor : '#343A40', padding : '5px', color : '#5bc0de', marginTop : '30px', marginBottom : '30px', marginLeft:'15%', marginRight : '15%'}}>Browse through questions</h2>
            <p>{' '}</p>
            <Form.Group as={Row} sm={1} md={1} lg={3} xs={1} className="justify-content-center">
                <Col style={{maxWidth : '500px'}} >
                    <Form.Label>Select keywords:</Form.Label>
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
            <AccordionQuestionsUser questions={questionsForShow}/>
            <NavFooter/>
        </div>

    )
}
export default Home