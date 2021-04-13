import {Spinner} from "react-bootstrap";
import '../css/Loading.css'

function Loading(){
    return(
        <div>
            <h1>Loading page..</h1>
            <Spinner animation="grow" variant="info" className="loading-vertical-center" />
        </div>

    )
}
export default Loading