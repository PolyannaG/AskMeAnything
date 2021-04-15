import { useLocation } from "react-router-dom";
import NavigationBarNotSignedIn from "../components/NavigationBarNotSignedIn";


function AnswersNotSignedIn(){

    const location = useLocation();

    return (
        <div>
            <NavigationBarNotSignedIn/>
            <h1>Answers page for question with id {location.state.questionID}</h1>
        </div>

    )
}
export default AnswersNotSignedIn