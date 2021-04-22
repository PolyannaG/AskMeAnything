import {Accordion, Card, Button, Carousel} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../hooks/UserContext";

function AccordionQuestions(props){

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
                    <Accordion.Collapse id="Coll1" eventKey={i+1}>
                        <div>
                            <Card.Body>
                                <blockquote className="blockquote mb-0 text-left">
                                    <p>
                                        {' '}
                                        {item.text}
                                        {' '}
                                        <footer className="blockquote-footer" style={{Color : 'white'}}>
                                            {item.keywords}
                                        </footer>
                                    </p>

                                    <Accordion defaultActiveKey="0" >
                                        <div>
                                            <Accordion.Toggle as={Button} variant="info" eventKey={i+1}>
                                                Show Answers
                                            </Accordion.Toggle>
                                            {item.answers.length === 0
                                                ?
                                                <Accordion.Collapse id="Coll2" eventKey={i + 1} style={{marginTop : 10}}>
                                                    <text>No answers for this question</text>
                                                </Accordion.Collapse>
                                                :
                                                <Accordion.Collapse id="Coll2" eventKey={i + 1} style={{marginTop : 10}}>
                                                    <div>
                                                        <Carousel >
                                                            {item.answers.map((ans, j) =>
                                                                <Carousel.Item id={j + 1}>
                                                                    {ans.text}
                                                                    <footer className="blockquote-footer"
                                                                            style={{Color: 'white'}}>
                                                                        Answer {j + 1}/{item.answers.length}
                                                                    </footer>
                                                                </Carousel.Item>
                                                            )}
                                                        </Carousel>
                                                    </div>
                                                </Accordion.Collapse>
                                            }
                                        </div>

                                    </Accordion>

                                </blockquote>
                                </Card.Body>
                            <Button variant="info" onClick={()=>handleAnswerQuestionsClick(item.id)} className="float-left" style={{marginBottom : '10px', marginLeft : '20px'}}>Answer question!</Button>
                        </div>
                    </Accordion.Collapse>
                </Card>
            )}
        </Accordion>
    )
}
export default AccordionQuestions
