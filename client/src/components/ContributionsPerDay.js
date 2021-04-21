import {CanvasJSChart} from "canvasjs-react-charts";
import React from "react";

function ContributionsPerDayChart(props){

    const options = {
        theme: "light2",
        title: {
            text: ""
        },
        axisY: {
            title: "Number of Contributions",
            prefix: ""
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true
        },
        data: [{
                type: "line",
                name: "Questions",
                color: "#CC031B",
                showInLegend: true,
                xValueFormatString: "MMM YYYY",
                yValueFormatString: "#",
                dataPoints: props.dataQuestions
            },
            {
                type: "line",
                name: "Answers",
                color: "#87C53F",
                showInLegend: true,
                xValueFormatString: "MMM YYYY",
                yValueFormatString: "#",
                dataPoints: props.dataAnswers
            }
        ]
    }

    return(
        <CanvasJSChart options = {options}/>
    )
}

export default ContributionsPerDayChart