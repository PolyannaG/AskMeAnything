import {Accordion, Card, Button, Carousel} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../hooks/UserContext";

function AccordionQuestions(props){

    const { id, username, isLoading } = useContext(UserContext);
    const [loaded, setloaded] = useState(0)
    let history = useHistory();

    function handleAnswerQuestionsClick(i){
        if (id!==undefined) {
            history.push({
                pathname: '/answer_a_question',
                state: {questionID: i}
            });
        }
        else {
            history.push('/sign_up')
        }

    }

   const handle = (()=>{
       console.log('hi')
       if (loaded<2)
       setloaded(loaded+1)
       else
           setloaded(loaded-1)
    })



    function correctDate (d) {
        let myDate = new Date(d);
        myDate.setTime(myDate.getTime() - (myDate.getTimezoneOffset() * 60000));
        return myDate.toISOString().split("T").join(", ").slice(0,-5)
    }


    return(
        <Accordion defaultActiveKey="0" style={{marginLeft : "10%", marginRight : "10%"}}>
            {props.questions.map((item,i)=>
                <Card bg={"light"} border="white" text={"black"}>
                    <Accordion.Toggle as={Card.Header} eventKey={i+1}>
                        {item.title}
                        <row className="row justify-content-end">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-caret-down-fill " viewBox="0 0 16 16">
                                <path
                                    d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                        </row>
                    </Accordion.Toggle>
                    <Accordion.Collapse id="Coll1" eventKey={i+1}>
                        <div>
                            <Card.Body>
                                <blockquote className="blockquote mb-0 text-left">
                                    <p>
                                        <footer className="blockquote-footer text-center text-md-right" style={{Color : 'white'}}>
                                            {"asked on: " + correctDate(item.date_created)}
                                        </footer>
                                        {' '}
                                        {item.text}
                                        {' '}
                                        <footer className="blockquote-footer" style={{Color : 'white'}}>
                                            {item.keywords}
                                        </footer>
                                    </p>

                                    <Accordion defaultActiveKey="0" >
                                        <div>
                                            <Accordion.Toggle as={Button} variant="info" eventKey={i+1} onClick={handle}>
                                                Show Answers
                                            </Accordion.Toggle>
                                            {item.popularity === 0
                                                ?
                                                <Accordion.Collapse id="Coll2" eventKey={i + 1} style={{marginTop : 10}}>
                                                    <text>No answers for this question</text>
                                                </Accordion.Collapse>
                                                :
                                                 <Accordion.Collapse id="Coll2" eventKey={i + 1} style={{marginTop : 10}}>
                                                       <div>
                                                           {loaded && item.answers!==undefined && <Carousel interval={null}>
                                                            {item.answers.map((ans, j) =>

                                                                    <Carousel.Item id={j + 1}>
                                                                        <footer className="blockquote-footer text-center text-md-right" style={{Color : 'white'}}>
                                                                            {"answered on: " + correctDate(ans.date_created)}
                                                                        </footer>
                                                                        {ans.text}
                                                                        <footer className="blockquote-footer"
                                                                                style={{Color: 'white'}}>
                                                                            Answer {j + 1}/{item.answers.length}
                                                                        </footer>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"     width="16" height="16" fill="currentColor"
                                                                             className="bi bi-arrow-right float-right"
                                                                             viewBox="0 0 16 16">
                                                                            <path fill-rule="evenodd"
                                                                                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                                                        </svg>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"     width="16" height="16" fill="currentColor"
                                                                             className="bi bi-arrow-left"
                                                                             viewBox="0 0 16 16">
                                                                            <path fill-rule="evenodd"
                                                                                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                                                                        </svg>
                                                                    </Carousel.Item>

                                                            )}
                                                        </Carousel>}
                                                    </div>
                                                </Accordion.Collapse>
                                            }
                                        </div>

                                    </Accordion>

                                </blockquote>
                                </Card.Body>
                            {id!==undefined && <Button variant="info" onClick={()=>handleAnswerQuestionsClick(item.id)} className="float-left" style={{marginBottom : '10px', marginLeft : '20px'}}>Answer question!</Button>}
                            {id===undefined && <Button variant="info" onClick={()=>handleAnswerQuestionsClick(item.id)} className="float-left" style={{marginBottom : '10px', marginLeft : '20px'}}>Sign up to answer!</Button>}
                        </div>
                    </Accordion.Collapse>
                </Card>
            )}
        </Accordion>
    )
}
export default AccordionQuestions
