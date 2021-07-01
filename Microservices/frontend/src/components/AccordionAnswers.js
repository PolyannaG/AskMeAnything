import {Accordion, Card, Button, Carousel} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../hooks/UserContext";

function AccordionAnswers(props){

    const { user, isLoading } = useContext(UserContext);
    let history = useHistory();
    const [data, setData]=useState([])


    function handleAnswerQuestionsClick(i){
        history.push({
            pathname: '/answer_a_question',
            state: {questionID : i}
        });

    }

    useEffect(()=>{
        console.log(Object.keys(props.answers[0]))
        console.log(props.answers[0].userid)
        if (props.answers[0].questionText!==undefined) {
            setData(props.answers)
            console.log(props.answers)
            console.log(Object.keys(props.answers[0]))
        }

    },[props.answers])
    return(
        <Accordion defaultActiveKey="0" style={{marginLeft : "10%", marginRight : "10%"}}>
            {data.map((item,i)=>
                <Card bg={"light"} border="white" text={"black"}>
                    <Accordion.Toggle as={Card.Header} eventKey={i+1}>
                        {item.questionTitle}
                        <row className="row justify-content-end">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-caret-down-fill " viewBox="0 0 16 16">
                                <path
                                    d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                        </row>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={i+1}>
                        <div>
                            <Card.Body>
                                <blockquote className="blockquote mb-0 text-left">
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Toggle as={Button} variant="info" eventKey={i+1} style={{marginBottom : 5}}>
                                            Show Question Text
                                        </Accordion.Toggle>
                                        <Accordion.Collapse id="Coll2" eventKey={i + 1} style={{marginBottom : 10}}>
                                            <div>
                                                <footer className="blockquote-footer text-center text-md-right" style={{Color : 'white'}}>
                                                    {"asked on: " + item.questionDate.split("T").join(", ").slice(0,-5)}
                                                </footer>
                                                <text>{item.questionText}</text>
                                                <footer className="blockquote-footer"
                                                        style={{Color: 'white'}}>
                                                    {item.keywords}
                                                </footer>
                                            </div>
                                        </Accordion.Collapse>
                                    </Accordion>
                                    <footer className="blockquote-footer text-center text-md-right" style={{Color : 'white'}}>
                                        {"answered on: " + item.date_created.split("T").join(", ").slice(0,-5)}
                                    </footer>

                                    {item.text}

                                </blockquote>
                            </Card.Body>
                        </div>

                    </Accordion.Collapse>
                </Card>
            )}
        </Accordion>
    )

}
export default AccordionAnswers