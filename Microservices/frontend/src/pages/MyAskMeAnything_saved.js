import NavigationBar from "../components/NavigationBar";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import AccordionQuestions from "../components/AccordionQuestions";
import AccordionAnswers from "../components/AccordionAnswers";
import NavFooter from "../components/NavFooter";
import React, {useContext, useEffect, useState} from "react";
import {contributions_answers_per_day, contributions_questions_per_day} from "../sample_data/contributions_per_day";
import {dummy_user} from "../sample_data/user_dummy_dta";
import "../css/Margins.css"
import ContributionsPerDayChart from "../components/ContributionsPerDay";
import QuestionsPerKeywordBarChart from "../components/QuestionsPerKeywordBarChart";
import {Box, Divider} from "@material-ui/core";
import {UserContext} from "../hooks/UserContext";

function MyAskMeAnything(){

    const [questionsForShow, setQuestionsForShow]=useState([])

    const [answerContributionsPerDay, setAnswerContributionsPerDay]=useState([])
    const [questionContributionsPerDay, setQuestionContributionsPerDay]=useState([])
    const [User, setUser]=useState([])
    const [radio, setRadio]=useState(1)
    const [lastDate,setlastDate]=useState("")
    const [isMore, setIsMore]=useState(true)
    const { user, isLoading } = useContext(UserContext);
    const [data, setData]=useState([])



    const getData= async ()=>{
        let resp= await fetch(`http://localhost:8005/view_question/keywords_user/${user.id}`)
        if (resp.ok){

            resp=await resp.json()

            // resp=resp.map({questionCount : 'y', keyword: 'label'})


            let mydata=resp

            mydata=mydata.map((item)=>{
                return {y : Number(item.questionCount), label: item.keyword}
            })

            console.log(mydata)
            return mydata
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
        //setRadio("RadioQuestions")
        getData().then((resp)=>{setData(resp)})
        fetchOptions().then()
        console.log(user)
    },[])

    const fetchOptions=async ()=>{
        console.log(radio)
        console.log(lastDate)

            if (radio>1) {  //answers of user
                console.log('answers')
                let date = 0
                if (lastDate.length === 0) {
                    date = new Date(Date.now()).toISOString()
                } else {
                    date = lastDate

                }
                console.log(lastDate)
                let resp = await fetch(`http://localhost:8004/view_answer/all_user/${user.id}/${date}`)
                if (resp.ok){
                    resp = await resp.json()
                    console.log(resp)
                    let mydata=resp
                    await mydata.map(async (item)=>{
                        if (item!==undefined) {
                            let response = await fetch(`http://localhost:8005/view_question/id/${item.questionId}`)
                            if (response.ok) {
                                let question = await response.json()
                                item.questionText = question.text
                                item.questionTitle = question.title
                            } else {
                                item.questionText = 'Question text not available.'
                                item.questionTitle = 'Question title not available.'
                            }
                        }
                    })
                    mydata.sort(function (a, b) {
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return b.date_created - a.date_created;
                    });

                    mydata.reverse()
                    setlastDate(mydata[mydata.length-1].date_created)
                    //console.log(mydata)
                    setQuestionsForShow(mydata)
                    console.log(mydata)
                    return mydata
                }
                else {
                    setIsMore(false)
                    setQuestionsForShow([])
                }

            }
            else{
                    console.log('questions')  //questions of user
                    let date = 0
                    if (lastDate.length == 0) {
                        date = new Date(Date.now()).toISOString()
                    } else {
                        date = lastDate
                    }
                      console.log(lastDate)
                    let resp = await fetch(`http://localhost:8005/view_question/all_user/${date}/${user.id}`)

                    if (resp.ok) {
                        resp = await resp.json()
                        // console.log(resp)
                        let mydata = resp
                        mydata.map((item) => {

                            if (item.keywords !== undefined && item.keywords.length !== 0) {

                                let keyw = ""
                                for (let i = 0; i < item.keywords.length - 1; i++) {

                                    keyw = keyw + item.keywords[i].keyword + ", "
                                    //   console.log(keyw)
                                }
                                // console.log(item.keywords[ item.keywords.length-1])
                                keyw = keyw + item.keywords[item.keywords.length - 1].keyword
                                item.keywords = keyw
                                item.answers = []
                            }
                        })
                        await mydata.map(async (item) => {
                            let response = await fetch(`http://localhost:8004/view_answer/for_question/${item.id}`)

                            const answers = await response.json()
                            //console.log(answers[0].answers)
                            item.answers = answers[0].answers

                        })

                        mydata.sort(function (a, b) {
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                            return b.date_created - a.date_created;
                        });

                        mydata.reverse()
                        setlastDate(mydata[mydata.length-1].date_created)
                        //console.log(mydata)
                        setQuestionsForShow(mydata)
                    }
                    else {
                        setIsMore(false)
                        setQuestionsForShow([])
                    }

        }




    }


    const handleReturn=async ()=>{

        setlastDate("")
        await fetchOptions()
        setIsMore(true)
    }


    const handleOptionChange = (changeEvent)=>{
        setRadio(changeEvent.target.id)

        console.log(changeEvent.target.id)
        setlastDate("")
        fetchOptions().then(()=>setIsMore(true))
    }


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
                        <QuestionsPerKeywordBarChart data={data}/>
                        <p>{' '}</p>
                    </div>
                </Col>
            </Row>
            <p>{' '}</p>
            <h2 className='headerText'>Browse through my questions and answers</h2>
            <p>{' '}</p>
            <Form.Group as={Row} sm={1} md={1} lg={4} xs={1} className="justify-content-center">

                    <Form>
                        <fieldset>
                        <Row sm={1} md={2} lg={2} xs={1}>
                            <Col>
                            <Form.Check
                                defaultChecked
                                className="mb-3"
                                type="radio"
                                label="My Questions"
                                name="RadioButtons"
                                value="RadioQuestions"
                                id={1}
                                onChange={handleOptionChange}
                            />
                            </Col>
                            <Col>
                            <Form.Check
                                className="mb-3"
                                type="radio"
                                label="My Answers"
                                name="RadioButtons"
                                id={2}
                                value="RadioAnswers"
                                onChange={handleOptionChange}
                            />
                            </Col>
                        </Row>
                            </fieldset>

                    </Form>



            </Form.Group>
            {radio >1 ? (
                isMore? <AccordionAnswers answers={questionsForShow}/>
                :
                    <h2>No answers found!</h2> )
                : (
                isMore? <AccordionQuestions questions={questionsForShow}/>
                :
                    <h2>No questions found!</h2>)
            }
            <p>{' '}</p>
            {isMore && questionsForShow.length!==0 && <Button onClick={async ()=>{await fetchOptions()}} variant="info">Show more!</Button> }
            {isMore && questionsForShow.length==0 && <Button onClick={async ()=>{await fetchOptions()}} variant="info">Show!</Button> }
            {!isMore && <Button style={{marginTop : '15px'}} onClick={async ()=>{await handleReturn()}} variant="info">Go back!</Button> }
            <NavFooter/>
        </div>

    )
}
export default MyAskMeAnything