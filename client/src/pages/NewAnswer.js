import NavigationBar from "../components/NavigationBar";
import {useLocation} from "react-router-dom";

function NewAnswer(){

    const location = useLocation();

    return(
        <div>
            <NavigationBar/>
            <h1>New Answer Page</h1>
            {location.state!==undefined? <h2>Answer for question with id {location.state.questionID}</h2> : <h2>General Answer page</h2>}
        </div>

    )
}
export default NewAnswer