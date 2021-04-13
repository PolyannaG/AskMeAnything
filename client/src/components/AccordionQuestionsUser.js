import {Accordion, Card, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";

function AccordionQuestionsUser(props){

    let history = useHistory();

    function handleAnswerQuestionsClick(i){
        history.push({
            pathname: '/answer_a_question',
            state: {questionID : i}
        });

    }

    function handleSeeAnswersClick(i){
        history.push({
            pathname: '/see_answers',
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
                        <div>
                            <Card.Body>
                                <blockquote className="blockquote mb-0 text-left">
                                    <p>
                                        {' '}
                                        {item.text}
                                        {' '}
                                    </p>
                                    <footer className="blockquote-footer" style={{Color : 'white'}}>
                                        {item.keywords}
                                    </footer>
                                </blockquote>
                            </Card.Body>
                            <Button variant="info" onClick={()=>handleSeeAnswersClick(item.id)} className="float-left" style={{marginBottom : '10px', marginLeft : '20px'}}>See answers.</Button>
                            <Button variant="info" onClick={()=>handleAnswerQuestionsClick(item.id)} className="float-left" style={{marginBottom : '10px', marginLeft : '20px'}}>Answer question!</Button>

                        </div>

                    </Accordion.Collapse>
                </Card>
            )}
        </Accordion>
    )
}
export default AccordionQuestionsUser
