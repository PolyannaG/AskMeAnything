import NavFooter from '../components/NavFooter'
import NavigationBar from "../components/NavigationBar";
import AccordionQuestionsUser from "../components/AccordionQuestionsUser";
import {questions} from '../sample_data/questions'
import {Row, Col, Form} from "react-bootstrap";
import AsyncSelect from 'react-select/async';
import React, {useEffect, useState} from "react";


function Home(){

    const [questionsForShow, setQuestionsForShow]=useState([])
    const [dateFrom, setDateFrom]=useState(undefined)
    const [dateTo, setDateTo]=useState(undefined)
    const [selectedKeywords, setSelectedKeywords]=useState([])

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

    const selectedKeywordChange=async (keywords)=>{

        if (keywords.length){  //the correct questions fetched
            setSelectedKeywords(keywords)
        }
        else { //random questions showed
            setSelectedKeywords([])
        }
    }
    const selectedDateFromChange= async (date)=>{
        setDateFrom(date.target.value)

    }
    const selectedDateToChange= async (date)=>{
        setDateTo(date.target.value)
    }

    useEffect(()=>{
        console.log(selectedKeywords)
        fetchOptions()
    },[selectedKeywords,dateFrom,dateTo])


    return(
        <div>
            <NavigationBar/>
            <h1>Home</h1>
            <Row sm={1} md={1} lg={2} xs={1}>
                <Col>
                    <h2>
                        Here is a graph.
                    </h2>
                </Col>
                <Col>
                    <h2>
                        Here is another graph.
                    </h2>
                </Col>
            </Row>
            <Row sm={1} md={1} lg={2} xs={1}>
                <Col>
                    <h2>
                        Here is a third graph.
                    </h2>
                </Col>
                <Col>
                    <h2>
                        Here is a fourth graph.
                    </h2>
                </Col>
            </Row>
            <h2>Here are the questions for browsing.</h2>
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