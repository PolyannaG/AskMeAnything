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
    const [questionsPerDay, setQuestionsPerDay]=useState([])
    const [data, setData]=useState([])



    const getQuestionsPerDay=async()=>{
        let resp= await fetch(`http://localhost:8008/stats/per_day/questions`)
        if (resp.ok){

            resp=await resp.json()

            // resp=resp.map({questionCount : 'y', keyword: 'label'})
            console.log(questions_per_day)

            let mydata=resp
            mydata=mydata.map((item)=>{
                const date=new Date(item.date_part.substring(0,4), item.date_part.substring(5,7)-1 ,item.date_part.substring(8,10)-1)
                console.log(date)
                return {x: date, y : Number(item.count)}
            })

            mydata.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return a.x - b.x;
            });
            console.log(mydata)

            return mydata
        }
        else return []

    }


    const getData= async ()=>{
        let resp= await fetch(`http://localhost:8008/stats/keywords`)
        if (resp.ok){

            resp=await resp.json()

            // resp=resp.map({questionCount : 'y', keyword: 'label'})


            let mydata=resp
            mydata=mydata.map((item)=>{
                return {y : Number(item.questioncount), label: item.keyword}
            })

           return mydata
        }
        else return []
    }

    useEffect( ()=>{

        //here the data will be fetched from the api
        getQuestionsPerDay().then(resp => setQuestionsPerDay( resp) )
        getData().then((resp)=>{setData(resp)})
        fetchOptions().then()

    },[])



    const fetchOptions=async ()=>{

           // const date=new Date(Date.now()).toISOString()
           // console.log(date)
           // let resp = await fetch(`http://localhost:8005/view_question/all/${date}`)
            let resp = await fetch(`http://localhost:8009/user_interaction/question/most_popular`)
            resp = await resp.json()
            console.log(resp)
            let mydata=resp
            mydata.map((item)=>{

                if (item.keywords!==undefined && item.keywords.length !== 0) {

                    let keyw = ""
                    for (let i = 0; i < item.keywords.length - 1; i++) {

                        keyw=keyw+item.keywords[i].keyword+", "
                        console.log(keyw)
                    }
                    keyw=keyw+item.keywords[ item.keywords.length-1].keyword
                    item.keywords = keyw
                    item.answers=[]
                }
            })
             mydata.map(async (item)=>{
                let response=await fetch(`http://localhost:8009/user_interaction/answer/for_question/${item.id}`)

                const answers=await response.json()
                 //console.log(answers[0].answers)
                 item.answers=answers[0].answers

            })
            console.log(mydata)
            setQuestionsForShow(mydata)


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
                        {data.length!==0 && <QuestionsPerKeywordBarChart data={data}/>}
                        <p>{' '}</p>
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
            <Row sm={1} md={1} lg={2} xs={1} className="justify-content-center">


                <Col>
                    <h2 class='text-info'>Interact with others! </h2>
                    <Row sm={2} md={2} lg={3} xs={1} className="justify-content-center" >

                        <Card style={{ width: '18rem', alignItems : 'center'}}>
                            <Card.Img variant="top" src="https://marysvillemartialarts.com/wp-content/uploads/2017/08/questions-reponses-profits.jpg" />
                            <Card.Body >
                                <Card.Title>Ask our users a question!</Card.Title>
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
            <p>{' '}</p>
            <h2 className='headerText'>Browse through questions</h2>
            <p>{' '}</p>

            <AccordionQuestions questions={questionsForShow}/>
            <Row className='justify-content-center' style={{marginTop : '30px'}}>
                <Button variant='info' href='/sign_up'>Sign up to see more!</Button>
            </Row>
            <NavFooter/>
        </div>

    )
}
export default Home