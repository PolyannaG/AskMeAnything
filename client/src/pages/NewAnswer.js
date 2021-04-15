import NavigationBar from "../components/NavigationBar";
import {useHistory, useLocation} from "react-router-dom";
import {useEffect} from "react";

function NewAnswer(){

    const location = useLocation();

    return(
        <div>
            <NavigationBar/>
            <h1>New Answer Page</h1>
            {location.state!==undefined && location.state.questionID!==null ? <h2>Answer for question with id {location.state.questionID}</h2> : <h2>General Answer page</h2>}
        </div>

    )
}
export default NewAnswer