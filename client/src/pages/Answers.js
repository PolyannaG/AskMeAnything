import { useLocation } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";


function Answers(){

    const location = useLocation();

    return (
        <div>
            <NavigationBar/>
            <h1>Answers page for question with id {location.state.questionID}</h1>
        </div>

    )
}
export default Answers