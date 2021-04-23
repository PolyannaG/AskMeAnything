import {Accordion, Card, Button, Carousel} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../hooks/UserContext";

function AccordionAnswers(props){

    const { user, isLoading } = useContext(UserContext);
    let history = useHistory();

    function handleAnswerQuestionsClick(i){
        history.push({
            pathname: '/answer_a_question',
            state: {questionID : i}
        });

    }
        return(
            <Accordion defaultActiveKey="0" style={{marginLeft : "10%", marginRight : "10%"}}>
                {props.questions.map((item,i)=>
                    <Card bg={"light"} border="white" text={"black"}>
                        <Accordion.Toggle as={Card.Header} eventKey={i+1}>
                            {item.title}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={i+1}>
                            {item.answers.length === 0
                                ?
                                <div>
                                    <Card.Body>
                                        <blockquote className="blockquote mb-0 text-left">
                                            <Accordion defaultActiveKey="0">
                                                <Accordion.Toggle as={Button} variant="info" eventKey={i+1} style={{marginBottom : 5}}>
                                                    Show Question Text
                                                </Accordion.Toggle>
                                                <Accordion.Collapse id="Coll2" eventKey={i + 1} style={{marginBottom : 10}}>
                                                    <div>
                                                        <text>{item.text}</text>
                                                        <footer className="blockquote-footer"
                                                                style={{Color: 'white'}}>
                                                            {item.keywords}
                                                        </footer>
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion>
                                            <text style={{marginTop : 10}}>No answers for this question</text>
                                        </blockquote>
                                    </Card.Body>
                                </div>
                                :
                                <div>
                                    <Card.Body>
                                        <blockquote className="blockquote mb-0 text-left">
                                            <Accordion defaultActiveKey="0">
                                                <Accordion.Toggle as={Button} variant="info" eventKey={i+1} style={{marginBottom : 5}}>
                                                    Show Question Text
                                                </Accordion.Toggle>
                                                <Accordion.Collapse id="Coll2" eventKey={i + 1} style={{marginBottom : 10}}>
                                                    <div>
                                                        <text>{item.text}</text>
                                                        <footer className="blockquote-footer"
                                                                style={{Color: 'white'}}>
                                                            {item.keywords}
                                                        </footer>
                                                    </div>
                                                </Accordion.Collapse>
                                            </Accordion>
                                            <Carousel interval={null}>
                                                {item.answers.map((ans, j) =>
                                                    <Carousel.Item id={j + 1} style={{marginTop : 10}}>
                                                        {ans.text}
                                                        <footer className="blockquote-footer" style={{Color: 'white'}}>
                                                            Answer {j + 1}/{item.answers.length}
                                                        </footer>
                                                    </Carousel.Item>
                                                )}
                                            </Carousel>
                                        </blockquote>
                                    </Card.Body>
                                </div>
                            }
                        </Accordion.Collapse>
                    </Card>
                )}
            </Accordion>
        )

}
export default AccordionAnswers