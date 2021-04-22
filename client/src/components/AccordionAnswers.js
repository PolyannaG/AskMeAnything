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

    function handleSeeAnswersClick(i){
        if (user)
            history.push({
                pathname: '/see_answers',
                state: {questionID : i}
            });
        else
            history.push({
                pathname: '/see_answers_not_user',
                state: {questionID : i}
            })

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
                                        No Answers for this question
                                    </Card.Body>
                                </div>
                                :
                                <div>
                                    <Card.Body>
                                        <blockquote className="blockquote mb-0 text-left">
                                            <Carousel>
                                                {item.answers.map((ans, j) =>
                                                    <Carousel.Item id={j + 1}>
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