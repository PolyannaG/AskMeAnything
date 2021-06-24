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
                                                        <text>{item.questionText}</text>
                                                        <footer className="blockquote-footer"
                                                                style={{Color: 'white'}}>
                                                            {item.keywords}
                                                        </footer>
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion>

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