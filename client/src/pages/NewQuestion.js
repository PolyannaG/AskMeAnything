import NavigationBar from "../components/NavigationBar";
import NavFooter from "../components/NavFooter";
import React, {useState} from "react";
import {Row, Col, Form, FormLabel, Button, FormGroup} from "react-bootstrap";
import "../css/Margins.css"
import {useHistory} from "react-router-dom";
import AsyncSelect from "react-select/async/dist/react-select.esm";

function NewQuestion(){

    let history = useHistory();

    const [selectedKeywords, setSelectedKeywords]=useState([])

    const loadOptions = async (value) => {
        //value can be used to fetch the appropriate words
        if (value) {  //will fetch some keywords based on search
            console.log("user has typed something")
            let resp = await fetch('https://jsonplaceholder.typicode.com/todos/1')

            //will change when backend created:
            resp = resp.json()
            resp = [
                {label: 'Shark', value: 'Shark'},
                {label: 'Dolphin', value: 'Dolphin'},
                {label: 'Whale', value: 'Whale'},
                {label: 'Octopus', value: 'Octopus'},
                {label: 'Crab', value: 'Crab'},
                {label: 'Lobster', value: 'Lobster'},
            ]
            return resp
        }
    }

    const selectedKeywordChange= (keywords)=>{

        if (keywords.length){  //the correct questions fetched
            setSelectedKeywords(keywords)
        }
        else { //random questions showed
            setSelectedKeywords([])
        }
    }

    const [validated, setValidated] = useState(false)
    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        else {
            //DOES NOT WORK
            history.go(-2) //we need to go to the previous page
        }
        setValidated(true)
    };

    return(
        <div>
            <NavigationBar/>
            <h1 className={"top-space-questions"}>Ask a question</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit} >
                <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={2}>
                        <h5>
                            Question Title:
                        </h5>
                    </Col>
                    <Col lg={9}>
                        <Form.Control
                            as="textarea"
                            name="QuestionTitle"
                            id="QuestionTitle"
                            required
                            placeholder={'Insert title here'}
                            />
                        <Form.Control.Feedback> </Form.Control.Feedback>
                        <Form.Control.Feedback type={"invalid"}>Title is required</Form.Control.Feedback>
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={2}>
                        <h5>
                            Question Text:
                        </h5>
                    </Col>
                    <Col lg={9}>
                        <Form.Control
                            as="textarea"
                            name="QuestionText"
                            id="QuestionText"
                            required
                            placeholder={'Insert question text here'}
                            rows={7}
                        />
                        <Form.Control.Feedback> </Form.Control.Feedback>
                        <Form.Control.Feedback type={"invalid"}>Question Text is required</Form.Control.Feedback>
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className={"space-questions"} sm={1} md={1} lg={2} xs={1}>
                    <Col lg={2}>
                        <h5>
                            Keywords:
                        </h5>
                    </Col>
                    <Col lg={9}>
                        <AsyncSelect
                            noOptionsMessage={() => 'No keywords found.'}
                            loadingMessage={() => 'Looking for keywords'}
                            placeholder={'Insert Keywords for your question'}
                            isMulti
                            cacheOptions
                            defaultOptions
                            getOptionLabel={e => e.value}
                            getOptionValue={e => e.value}
                            loadOptions={loadOptions}
                            onChange={selectedKeywordChange}
                            openMenuOnClick={false}
                            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                        />
                        <Form.Control.Feedback> </Form.Control.Feedback>
                        <Form.Control.Feedback type={"invalid"}>Keywords are required</Form.Control.Feedback>
                    </Col>
                </FormGroup>
                <Button size={"lg"} variant="info" type="submit">Submit</Button>
                <Button size={"lg"} style={{marginLeft : '10px'}} variant="outline-info" href="/ask_a_question">Cancel</Button>
            </Form>
            <NavFooter/>
        </div>

    )
}
export default NewQuestion