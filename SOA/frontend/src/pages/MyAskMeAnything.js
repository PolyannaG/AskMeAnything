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
    const [answersForShow, setAnswersForShow]=useState([])


    const [answerContributionsPerDay, setAnswerContributionsPerDay]=useState([])
    const [questionContributionsPerDay, setQuestionContributionsPerDay]=useState([])
    const [User, setUser]=useState([])
    const [radio, setRadio]=useState(1)
    const [lastDate,setlastDate]=useState("")
    const [isMore, setIsMore]=useState(true)
    const { id, username, isLoading } = useContext(UserContext);
    const [data, setData]=useState([])
    const [done,setDone]=useState(false)
    const tok = localStorage.getItem('token');

    let quest=1

    const getData= async ()=>{
        let resp= await fetch(`https://statisticssoa.herokuapp.com/stats/keywords_user/${id}`,{
            method: 'GET',
            headers: {'Content-type': 'application/json', 'x-access-token':tok},
            credentials: 'include'
        })
        if (resp.ok){

            resp=await resp.json()

            // resp=resp.map({questionCount : 'y', keyword: 'label'})


            let mydata=resp

            mydata=mydata.map((item)=>{
                return {y : Number(item.questionCount), label: item.keyword}
            })

            console.log(mydata,"hi")
            return mydata
        }
        else return []
    }


    const getDummyUser=async () => {
        let user_data={}
        try {
            let resp_questions = await fetch(`https://statisticssoa.herokuapp.com/stats/count_questions_user/${id}`, {
                method: 'GET',
                headers: {'Content-type': 'application/json', 'x-access-token':tok},
                credentials: 'include'
            })
            if (resp_questions.ok) {
                resp_questions = await resp_questions.json()
                user_data.questions = resp_questions[0].count
            } else
                user_data.questions = ""
        }
        catch (e){
            user_data.questions = ""
        }
        try {
            let resp_answers = await fetch(`https://statisticssoa.herokuapp.com/stats/count_answers_user/${id}`, {
                method: 'GET',
                headers: {'Content-type': 'application/json', 'x-access-token':tok},
                credentials: 'include'
            })
            if (resp_answers.ok) {
                resp_answers = await resp_answers.json()
                user_data.answers = resp_answers[0].count
            } else
                user_data.answers = ""
        }
        catch (e) {
            user_data.answers = ""
        }
        try {

            let resp_user = await fetch('https://manageuserssoa.herokuapp.com/authentication/user', {
                method: 'GET',
                headers: {'Content-type': 'application/json', 'x-access-token':tok},
                credentials: 'include'
            })
            if (resp_user.ok) {
                resp_user = await resp_user.json()
                user_data.user_since = resp_user.user_since.substring(0, 10).split("-").reverse().join("/")
                user_data.email = resp_user.email
            } else {
                user_data.user_since = ""
                user_data.email = ""
            }
        }
        catch (e){
            user_data.user_since = ""
            user_data.email = ""
        }
        user_data.username = username

        return [user_data]
    }

    const getQuestionsPerDay=async()=>{
        let resp= await fetch(`https://statisticssoa.herokuapp.com/stats/per_day_user/questions/${id}`,{
            method: 'GET',
            headers: {'Content-type': 'application/json', 'x-access-token':tok},
            credentials: 'include'
        })
        if (resp.ok){

            resp=await resp.json()

            // resp=resp.map({questionCount : 'y', keyword: 'label'})
            // console.log(questions_per_day)

            let mydata=resp
            mydata=mydata.map((item)=>{
                const date=new Date(item.date_part.substring(0,4), item.date_part.substring(5,7)-1 ,item.date_part.substring(8,10)-1)
                // console.log(date)
                return {x: date, y : Number(item.count)}
            })

            mydata.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return a.x - b.x;
            });
            // console.log(mydata)

            return mydata
        }
        else return []
    }
    const getAnswersPerDay=async()=>{
        let resp= await fetch(`https://statisticssoa.herokuapp.com/stats/per_day_user/answers/${id}`,{
            method: 'GET',
            headers: {'Content-type': 'application/json', 'x-access-token':tok},
            credentials: 'include'
        })
        if (resp.ok){

            resp=await resp.json()

            // resp=resp.map({questionCount : 'y', keyword: 'label'})
            // console.log(questions_per_day)

            let mydata=resp
            mydata=mydata.map((item)=>{
                const date=new Date(item.date_part.substring(0,4), item.date_part.substring(5,7)-1 ,item.date_part.substring(8,10)-1)
                // console.log(date)
                return {x: date, y : Number(item.count)}
            })

            mydata.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return a.x - b.x;
            });
            // console.log(mydata)

            return mydata
        }
        else return []
    }

    useEffect( ()=>{
        //here the data will be fetched from the api
        getQuestionsPerDay().then(resp => setQuestionContributionsPerDay( resp) )
        getAnswersPerDay().then((resp)=>setAnswerContributionsPerDay(resp))
        getDummyUser().then(resp=>setUser(resp))
        //setRadio("RadioQuestions")
        getData().then((resp)=>{setData(resp)})
        fetchQuestions().then()
        console.log(id,username)
    },[])

    const fetchQuestions=async (goback)=>{
            console.log(radio)
            console.log(lastDate)



            console.log('questions')  //questions of user
            let date = 0
            if (lastDate.length == 0 || goback) {
                //date = new Date(Date.now()).toISOString()
                const d_to = new Date();
                d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
                date = d_to.toISOString();
            } else {
                date = lastDate
            }
            console.log(lastDate)
            let resp = await fetch(`https://userinteractionsoa.herokuapp.com/user_interaction/question/all_user/${date}/${id}`,{
                method: 'GET',
                headers: {'Content-type': 'application/json', 'x-access-token':tok},
                credentials: 'include'
            })

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
                    let response = await fetch(`https://userinteractionsoa.herokuapp.com/user_interaction/answer/for_question/${item.id}`,{
                        method: 'GET',
                        headers: {'Content-type': 'application/json', 'x-access-token':tok},
                        credentials: 'include'
                    })

                    const answers = await response.json()
                    //console.log(answers[0].answers)
                    item.answers = answers[0].answers

                })

               // mydata.sort(function (a, b) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                //    return b.date_created - a.date_created;
               // });

               // mydata.reverse()
                setlastDate(mydata[mydata.length - 1].date_created)
                console.log(mydata)
                setQuestionsForShow(mydata)
            } else {
                setIsMore(false)
                setQuestionsForShow([])
            }
    }

    const fetchAnswers=async ( goback)=>{
            console.log('answers')
            let date = 0
            if (lastDate.length === 0 || goback) {
               // date = new Date(Date.now()).toISOString()
                const d_to = new Date();
                d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
                date = d_to.toISOString();
            } else {
                date = lastDate

            }
            console.log(lastDate)
            setDone(false)
            let resp = await fetch(`https://userinteractionsoa.herokuapp.com/user_interaction/answer/all_user/${id}/${date}`,{
                method: 'GET',
                headers: {'Content-type': 'application/json', 'x-access-token':tok},
                credentials: 'include'
            })
            if (resp.ok){
                resp = await resp.json()
                console.log(resp)
                let mydata=resp
                console.log(mydata)
                 for (let i =0; i<resp.length; i++) {
                     if (mydata[i] !== undefined) {
                         try {
                             let response = await fetch(`https://userinteractionsoa.herokuapp.com/user_interaction/question/id/${mydata[i].questionId}`, {
                                 method: 'GET',
                                 headers: {'Content-type': 'application/json', 'x-access-token':tok},
                                 credentials: 'include'
                             })
                             //if (response.ok) {
                             const question = await response.json()
                             //   console.log(question)
                             mydata[i].questionText = question[0].text
                             mydata[i].questionTitle = question[0].title
                             mydata[i].questionDate=question[0].date_created
                             console.log(question[0].keywords)
                             if (question[0].keywords !== undefined && question[0].keywords.length !== 0) {

                                 let keyw = ""
                                 for (let i = 0; i < question[0].keywords.length - 1; i++) {

                                     keyw = keyw + question[0].keywords[i].keyword + ", "
                                     console.log(keyw)
                                 }
                                 // console.log(item.keywords[ item.keywords.length-1])
                                 keyw = keyw + question[0].keywords[question[0].keywords.length - 1].keyword
                                 mydata[i].keywords = keyw
                             }
                             //   } else {
                             //       item.questionText = 'Question text not available.'
                             //       item.questionTitle = 'Question title not available.'
                             //   }
                         }catch (e){
                             mydata[i].questionText = "Failed to load question text."
                             mydata[i].questionTitle = "Failed to load question title."
                             mydata[i].questionDate="Failed to load date."
                         }
                    // }
                    // else {
                    //     console.log('quest service fail')
                    //           mydata[i].questionText = "Failed to load question text."
                    //           mydata[i].questionTitle = "Failed to load question title."
                    // }
                     }
                     if (i===(mydata.length-1)){
                    //     mydata.sort(function (a, b) {
                             // Turn your strings into dates, and then subtract them
                             // to get a value that is either negative, positive, or zero.
                    //         return b.date_created - a.date_created;
                     //    });
                     //    mydata.reverse()
                         console.log('hi')
                         setlastDate(mydata[mydata.length-1].date_created)
                         console.log(mydata)
                         setAnswersForShow(mydata)
                         console.log(mydata)
                         setDone(true)
                         return
                     }

                 }

                console.log(resp)





            }
            else {
                setIsMore(false)
                setAnswersForShow([])
            }


    }


    const handleReturn=async ()=>{

        setlastDate("")
        await fetchQuestions(true)
        setIsMore(true)
    }

    const handleReturnAns=async ()=>{

        setlastDate("")
         await fetchAnswers(true)
        setIsMore(true)
    }




    const handleQuestion=(seemore)=>{
        console.log('handle question')
        setAnswersForShow([])
        setRadio(1)
        setlastDate("")
        if (!seemore)
            fetchQuestions(true).then(()=>setIsMore(true))
        else
            fetchQuestions(false).then(()=>setIsMore(true))
        quest=1
        setRadio(1)
    }
    const handleAnswer= (seemore)=>{
        console.log('handle answer')
        setQuestionsForShow([])
        setRadio(2)
        setlastDate("")
        if (!seemore)
             fetchAnswers(true).then(()=>setIsMore(true))
        else
            fetchAnswers(false).then(()=>setIsMore(true))
        quest=0
        setRadio(2)
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
                            My contributions per day this month:
                        </h2>

                        {(answerContributionsPerDay.length || questionContributionsPerDay.length) && <ContributionsPerDayChart dataQuestions={questionContributionsPerDay} dataAnswers={answerContributionsPerDay}/>}
                    </div>
                </Col>
                <Col>
                    <div style={{marginLeft: '10px', marginRight: '10px'}}>
                        <h2 className='text-info'>
                            My questions per keyword:
                        </h2>
                        <p>{' '}</p>
                        {data.length && <QuestionsPerKeywordBarChart data={data}/>}
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
                        <Row sm={1} md={3} lg={3} xs={1}>
                            <Col>
                                <Button variant="info" onClick={()=>handleQuestion()}>Show questions</Button>
                            </Col>
                            <Col> <p>{' '}</p></Col>
                            <Col>

                                <Button variant="info" onClick={()=>handleAnswer()}>Show answers</Button>
                            </Col>
                        </Row>
                            </fieldset>

                    </Form>



            </Form.Group>
            {radio >1 ? (
                isMore && answersForShow.length!==0? <AccordionAnswers answers={answersForShow}/>
                :
                    <div>
                         <h2>No answers found!</h2>
                         <Button style={{marginTop : '15px'}} onClick={async ()=>{await handleReturnAns()}} variant="info">Go back!</Button>
                    </div>)
                : (
                isMore && questionsForShow.length!==0? <AccordionQuestions questions={questionsForShow}/>
                :
                    <div>
                         <h2>No questions found!</h2>
                        <Button style={{marginTop : '15px'}} onClick={async ()=>{await handleReturn()}} variant="info">Go back!</Button>
                    </div>)
            }
            <p>{' '}</p>
            {isMore  && questionsForShow.length!==0 && <Button onClick={async ()=>{await handleQuestion(true)}} variant="info">Show more!</Button> }
            {isMore && answersForShow.length!==0 && <Button onClick={async ()=>{await handleAnswer(true)}} variant="info">Show more!</Button> }

            <NavFooter/>
        </div>

    )
}
export default MyAskMeAnything