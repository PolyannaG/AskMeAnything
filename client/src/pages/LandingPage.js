import NavigationBarNotSignedIn from "../components/NavigationBarNotSignedIn";
import React from "react";
import NavFooter from "../components/NavFooter";

function LandingPage(){
    return(
        <div>
            <NavigationBarNotSignedIn/>
            <h1>Landing Page, not signed in</h1>
            <NavFooter/>
        </div>

    )
}
export default LandingPage