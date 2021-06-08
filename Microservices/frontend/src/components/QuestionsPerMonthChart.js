import {CanvasJSChart} from "canvasjs-react-charts";
import React from "react";

function QuestionsPerMonthChart(props){


    const options = {
        theme: "light2",
        title: {
            text: ""
        },
        axisY: {
            title: "Price in USD",
            prefix: ""
        },
        data: [{
            type: "line",
            xValueFormatString: "MMM YYYY",
            yValueFormatString: "#",
            dataPoints: props.dataPoints
        }]
    }

    return(
        <CanvasJSChart options = {options}/>
    )
}

export default QuestionsPerMonthChart