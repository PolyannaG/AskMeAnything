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
import ContributionsPerDayChart from "../components/ContributionsPerDay";


function Home(){

    const [questionsForShow, setQuestionsForShow]=useState([])
    const [answerContributionsPerDay, setAnswerContributionsPerDay]=useState([])
    const [questionsPerDay, setQuestionsPerDay]=useState([])
    const [lastDate,setlastDate]=useState("")
    const [isMore, setIsMore]=useState(true)
    const [data, setData]=useState([])
    const [dateFrom, setDateFrom]=useState(undefined)
    const [dateTo, setDateTo]=useState(undefined)
    const [selectedKeywords, setSelectedKeywords]=useState([])
    const tok = localStorage.getItem('token');




    const getQuestionsPerDay=async()=>{
        let resp= await fetch(`https://statisticssoaapp.herokuapp.com/stats/per_day/questions`,{
            method: 'GET',
            headers: {'Content-type': 'application/json','x-access-token':tok},
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
        let resp= await fetch(`https://statisticssoaapp.herokuapp.com/stats/per_day/answers`,{
            method: 'GET',
            headers: {'Content-type': 'application/json','x-access-token':tok},
            credentials: 'include'
        })
        if (resp.ok){

            resp=await resp.json()

            // resp=resp.map({questionCount : 'y', keyword: 'label'})
            // console.log(questions_per_day)

            let mydata=resp
            console.log(mydata)
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

    const getData= async ()=>{
        let resp= await fetch(`https://statisticssoaapp.herokuapp.com/stats/keywords`,{
            method: 'GET',
            headers: {'Content-type': 'application/json','x-access-token':tok},
            credentials: 'include'
        })
        if (resp.ok){

            resp=await resp.json()

            // resp=resp.map({questionCount : 'y', keyword: 'label'})


            let mydata=resp

            mydata=mydata.map((item)=>{
                return {y : Number(item.questioncount), label: item.keyword}
            })

            console.log(mydata)
            return mydata
        }
        else return []
    }

    useEffect( ()=>{

        //here the data will be fetched from the api
        getQuestionsPerDay().then(resp => setQuestionsPerDay( resp) )
        getAnswersPerDay().then((resp)=>setAnswerContributionsPerDay(resp))
        getData().then((resp)=>{setData(resp)})
        fetchOptions().then()

    },[])

    const fetchOptions=async ()=>{
        if (selectedKeywords!==undefined && selectedKeywords.label!==undefined){    //filter by keyword and ..
            if (dateFrom!==undefined && dateTo!==undefined){   //keyword and enddate, startdate
                console.log('key and start and end')
                console.log(selectedKeywords)
                try {
                    var date=0
                    if (lastDate.length===0)
                        date = new Date(dateFrom).toISOString()
                    else
                        date=lastDate
                    console.log(date)
                    let resp = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/question/keyword_date_from_to/${selectedKeywords.label}/${date}/${dateTo}`,{
                        method: 'GET',
                        headers: {'Content-type': 'application/json','x-access-token':tok},
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
                            let response = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/answer/for_question/${item.id}`,{
                                method: 'GET',
                                headers: {'Content-type': 'application/json','x-access-token':tok},
                                credentials: 'include'
                            })

                            const answers = await response.json()
                            //console.log(answers[0].answers)
                            item.answers = answers[0].answers

                        })

                     //   mydata.sort(function (a, b) {
                            // Turn your strings into dates, and then subtract them
                    //        // to get a value that is either negative, positive, or zero.
                    //        return b.date_created - a.date_created;
                    //    });

                   //     mydata.reverse()
                        setlastDate(mydata[mydata.length-1].date_created)
                        console.log(mydata)
                        setQuestionsForShow(mydata)
                        setIsMore(true)
                    } else {
                        setIsMore(false)
                    }
                }catch (e){
                    console.log(e)

                }
            }
            else if (dateFrom!==undefined && dateTo===undefined){    //keyword and startdate
                console.log('key and start')
                console.log(selectedKeywords)
                try {
                    var date=0
                    if (lastDate.length===0)
                        date = new Date(dateFrom).toISOString()
                    else
                        date=lastDate
                    console.log(date)
                    let resp = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/question/keyword_date/${selectedKeywords.label}/${date}`,{
                        method: 'GET',
                        headers: {'Content-type': 'application/json','x-access-token':tok},
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
                            let response = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/answer/for_question/${item.id}`,{
                                method: 'GET',
                                headers: {'Content-type': 'application/json','x-access-token':tok},
                                credentials: 'include'
                            })

                            const answers = await response.json()
                            //console.log(answers[0].answers)
                            item.answers = answers[0].answers

                        })

                  //      mydata.sort(function (a, b) {
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                   //         return b.date_created - a.date_created;
                  //      });

                   //     mydata.reverse()
                        setlastDate(mydata[mydata.length-1].date_created)
                        console.log(mydata)
                        setQuestionsForShow(mydata)
                        setIsMore(true)
                    } else {
                        setIsMore(false)
                    }
                }catch (e){
                    console.log(e)

                }
            }
            else if (dateFrom===undefined && dateTo!==undefined){    //keyword and enddate
                console.log('key and end')
                console.log(selectedKeywords)
                try {
                    var date=0
                    if (lastDate.length===0) {
                       // date = new Date(Date.now()).toISOString()
                        const d_to = new Date();
                        d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
                        date = d_to.toISOString();
                    }
                    else
                        date=lastDate
                    console.log(date)
                    let resp = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/question/keyword_date_from_to/${selectedKeywords.label}/${date}/${dateTo}`,{
                        method: 'GET',
                        headers: {'Content-type': 'application/json','x-access-token':tok},
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
                            let response = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/answer/for_question/${item.id}`,{
                                method: 'GET',
                                headers: {'Content-type': 'application/json','x-access-token':tok},
                                credentials: 'include'
                            })

                            const answers = await response.json()
                            //console.log(answers[0].answers)
                            item.answers = answers[0].answers

                        })

                  //      mydata.sort(function (a, b) {
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                 //           return b.date_created - a.date_created;
                 //       });

                        mydata.reverse()
                        setlastDate(mydata[mydata.length-1].date_created)
                        console.log(mydata)
                        setQuestionsForShow(mydata)
                        setIsMore(true)
                    } else {
                        setIsMore(false)
                    }
                }catch (e){
                    console.log(e)

                }

            }
            else {    //only by keyword
                console.log('only key')
                console.log(selectedKeywords)
                try {
                    var date=0
                    if (lastDate.length===0) {
                        // date = new Date(Date.now()).toISOString()
                        const d_to = new Date();
                        d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
                        date = d_to.toISOString();
                        console.log(date);
                    }
                    else
                        date=lastDate
                    console.log(date)
                    let resp = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/question/keyword_date/${selectedKeywords.label}/${date}`,{
                        method: 'GET',
                        headers: {'Content-type': 'application/json','x-access-token':tok},
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
                            let response = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/answer/for_question/${item.id}`,{
                                method: 'GET',
                                headers: {'Content-type': 'application/json','x-access-token':tok},
                                credentials: 'include'
                            })

                            const answers = await response.json()
                            //console.log(answers[0].answers)
                            item.answers = answers[0].answers

                        })

                   //     mydata.sort(function (a, b) {
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                  //          return b.date_created - a.date_created;
                  //      });

                 //       mydata.reverse()
                        setlastDate(mydata[mydata.length-1].date_created)
                        console.log(mydata)
                        setQuestionsForShow(mydata)
                        setIsMore(true)
                    } else {
                        setIsMore(false)
                    }
                }catch (e){
                    console.log(e)

                }

            }

          //  setQuestionsForShow(questions)
        }
        else if (dateTo!==undefined || dateFrom!==undefined){  //filter only by date
            if (dateFrom!==undefined && dateTo!==undefined){   //enddate, startdate
                try {
                    var date=0
                    if (lastDate.length===0)
                        date = new Date(dateFrom).toISOString()
                    else
                        date=lastDate
                    console.log(date)
                    let resp = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/question/start_end_date/${date}/${dateTo}`,{
                        method: 'GET',
                        headers: {'Content-type': 'application/json','x-access-token':tok},
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
                            let response = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/answer/for_question/${item.id}`,{
                                method: 'GET',
                                headers: {'Content-type': 'application/json','x-access-token':tok},
                                credentials: 'include'
                            })

                            const answers = await response.json()
                            //console.log(answers[0].answers)
                            item.answers = answers[0].answers

                        })

                   //     mydata.sort(function (a, b) {
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                  //          return b.date_created - a.date_created;
                  //      });

                //        mydata.reverse()
                        setlastDate(mydata[mydata.length-1].date_created)
                        console.log(mydata)
                        setQuestionsForShow(mydata)
                        setIsMore(true)
                    } else {
                        setIsMore(false)
                    }
                }catch (e){
                    console.log('error')

                }
            }


            else if (dateFrom!==undefined && dateTo===undefined){    //only startdate

                try {
                    var date=0
                    if (lastDate.length===0)
                       date = new Date(dateFrom).toISOString()
                    else
                        date=lastDate
                    console.log(date)
                    let resp = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/question/all/${date}`,{
                        method: 'GET',
                        headers: {'Content-type': 'application/json','x-access-token':tok},
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
                            let response = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/answer/for_question/${item.id}`,{
                                method: 'GET',
                                headers: {'Content-type': 'application/json','x-access-token':tok},
                                credentials: 'include'
                            })

                            const answers = await response.json()
                            //console.log(answers[0].answers)
                            item.answers = answers[0].answers

                        })

                //        mydata.sort(function (a, b) {
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
              //              return b.date_created - a.date_created;
             //           });

               //         mydata.reverse()
                        setlastDate(mydata[mydata.length-1].date_created)
                        console.log(mydata)
                        setQuestionsForShow(mydata)
                        setIsMore(true)
                    } else {
                        setIsMore(false)
                    }
                }catch (e){
                    console.log('error')


                }
            }


            else {  //only enddate

                try {
                    var date=0
                    if (lastDate.length===0) {
                        //date = new Date(Date.now()).toISOString()
                        const d_to = new Date();
                        d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
                        date = d_to.toISOString();
                        console.log(date)
                    }
                    else
                        date=lastDate
                    console.log(dateTo)
                    let resp = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/question/start_end_date/${date}/${dateTo}`,{
                        method: 'GET',
                        headers: {'Content-type': 'application/json','x-access-token':tok},
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
                            let response = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/answer/for_question/${item.id}`,{
                                method: 'GET',
                                headers: {'Content-type': 'application/json','x-access-token':tok},
                                credentials: 'include'
                            })

                            const answers = await response.json()
                            //console.log(answers[0].answers)
                            item.answers = answers[0].answers

                        })

                   //     mydata.sort(function (a, b) {
                            // Turn your strings into dates, and then subtract them
                            // to get a value that is either negative, positive, or zero.
                 //           return b.date_created - a.date_created;
                 //       });

                //        mydata.reverse()
                        setlastDate(mydata[mydata.length-1].date_created)
                        console.log(mydata)
                        setQuestionsForShow(mydata)
                        setIsMore(true)
                    } else {
                        setIsMore(false)
                    }
                }catch (e){
                    console.log(e)

                }

            }

            //this will vary depending on case
            //let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')
            //resp = resp.json()
           // setQuestionsForShow(questions)
        }


        else {  //no filter


            let date = 0
            if (lastDate.length == 0) {
               // date = new Date(Date.now()).toISOString()
                const d_to = new Date();
                d_to.setTime(d_to.getTime() - (d_to.getTimezoneOffset() * 60000));
                date = d_to.toISOString();
            } else {
                date = lastDate
            }
            //  console.log(lastDate)
            let resp = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/question/all/${date}`,{
                method: 'GET',
                headers: {'Content-type': 'application/json','x-access-token':tok},
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
                    let response = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/answer/for_question/${item.id}`,{
                        method: 'GET',
                        headers: {'Content-type': 'application/json','x-access-token':tok},
                        credentials: 'include'
                    })

                    const answers = await response.json()
                    //console.log(answers[0].answers)
                    item.answers = answers[0].answers

                })

              //  mydata.sort(function (a, b) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
               //     return b.date_created - a.date_created;
              //  });

              //  mydata.reverse()
                setlastDate(mydata[mydata.length-1].date_created)
                //console.log(mydata)
                setQuestionsForShow(mydata)
            } else {
                setIsMore(false)
            }
        }
    }

    const handleReturn=async ()=>{
        console.log(dateFrom)
        if (dateFrom===undefined)
            setlastDate("")
        else
            setlastDate(dateFrom)
        await fetchOptions()
        setIsMore(true)
    }

    const loadOptions=async (value)=>{
        //value can be used to fetch the appropriate words
        if (value) {  //will fetch some keywords based on search
            console.log("user has typed something")
            let resp = await fetch(`https://userinteractionsoaapp.herokuapp.com/user_interaction/question/specific_keywords/${value}`,{
                method: 'GET',
                headers: {'Content-type': 'application/json','x-access-token':tok},
                credentials: 'include'
            })

            //will change when backend created:
            if (resp.ok) {
                resp = await resp.json()
                console.log(resp)
                let mydata=resp
                mydata=mydata?.map((item)=>{
                    return {label : item.keyword, value: item.keyword}
                })
                return mydata
            }
            else
                return false
        }
    }

    const selectedKeywordChange= (keywords)=>{

        if (keywords!==undefined){  //the correct questions fetched
            setlastDate("")
            setSelectedKeywords(keywords)
            console.log(keywords)
        }
        else { //random questions showed
            setSelectedKeywords(undefined)
        }
        console.log(keywords)
    }
    const selectedDateFromChange= async (date)=>{
      //  setDateFrom(date.target.value)
        setlastDate("")
        if (date.target.value) {
            let val = new Date(date.target.value).toISOString()
            setDateFrom(val)
        }
        else
            setDateFrom(undefined)

       // console.log(dateFrom)
    }
    const selectedDateToChange= (date)=>{
        //setDateTo(date.target.value)
        setlastDate("")
        if (date.target.value) {
            let val = new Date(date.target.value).toISOString()
            setDateTo(val)
        }
        else
            setDateTo(undefined)
    }


    useEffect(()=>{
        console.log('filter change')
        fetchOptions().then()
    },[selectedKeywords,dateFrom,dateTo])


    return(
        <div>
            <NavigationBar/>
            <h1 >Welcome to AskMeAnything!</h1>
            <h2 className='headerText'>Our site's activity</h2>
            <Row sm={1} md={1} lg={2} xs={1}>
                <Col>
                    <div style={{marginLeft : '10px', marginRight : '10px'}}>
                        <h2 class='text-info'>
                            Most popular questions are about:
                        </h2>
                        <p>{' '}</p>
                        {data.length && <QuestionsPerKeywordBarChart  data={data}/>}
                        <p>{' '}</p>
                    </div>

                </Col>
                <Col>
                    <div style={{marginLeft : '10px', marginRight : '10px'}}>
                        <h2 class='text-info'>Postings per day this month:</h2>
                        <p>{' '}</p>
                        {(answerContributionsPerDay.length || questionsPerDay.length) && <ContributionsPerDayChart dataQuestions={questionsPerDay} dataAnswers={answerContributionsPerDay}/>}
                        <p>{' '}</p>
                    </div>
                </Col>

            </Row>
            <Row sm={1} md={1} lg={2} xs={1} className="justify-content-center" >

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
                        isMulti={false}
                        cacheOptions
                        defaultOptions
                        getOptionLabel={e => e.value}
                        getOptionValue={e => e.value}
                        loadOptions={loadOptions}
                        onChange={selectedKeywordChange}
                        openMenuOnClick={true}
                        components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}

                    />
                </Col>
                <Col style={{maxWidth : '500px'}} >

                    <Form>
                        <Form.Label>Questions from:</Form.Label>
                        <Form.Control type={"date"} onChange={selectedDateToChange}/>
                    </Form>

                </Col>
                <Col style={{maxWidth : '500px'}} >
                    <Form>
                        <Form.Label>Questions to:</Form.Label>
                        <Form.Control type={"date"} onChange={selectedDateFromChange}/>
                    </Form>
                </Col>
            </Form.Group>
            {questionsForShow && isMore && <AccordionQuestions questions={questionsForShow}/>}
            {!isMore && <h2>No questions found!</h2>}
            <p>{' '}</p>
            {isMore && <Button onClick={async ()=>{await fetchOptions()}} variant="info">Show more!</Button> }
            {!isMore && <Button style={{marginTop : '15px'}} onClick={async ()=>{await handleReturn()}} variant="info">Go back!</Button> }
            <NavFooter/>
        </div>

    )
}
export default Home