import NavFooter from '../components/NavFooter'
import NavigationBar from "../components/NavigationBar";
import AccordionQuestionsUser from "../components/AccordionQuestionsUser";
import {questions} from '../sample_data/questions'
import {Row, Col} from "react-bootstrap";

function Home(){
    return(
        <div>
            <NavigationBar/>
            <h1>Home</h1>
            <Row sm={1} md={1} lg={2}>
                <Col>
                    <h2>
                        Here is a graph.
                    </h2>
                </Col>
                <Col>
                    <h2>
                        Here is another graph.
                    </h2>
                </Col>
            </Row>
            <Row sm={1} md={1} lg={2}>
                <Col>
                    <h2>
                        Here is a third graph.
                    </h2>
                </Col>
                <Col>
                    <h2>
                        Here is a fourth graph.
                    </h2>
                </Col>
            </Row>
            <h2>Here are the questions for browsing.</h2>
            <AccordionQuestionsUser questions={questions}/>
            <NavFooter/>
        </div>

    )
}
export default Home