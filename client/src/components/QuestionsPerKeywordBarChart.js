import {questions_per_keyrord} from "../sample_data/questions_per_keyword";
import {CanvasJS, CanvasJSChart} from "canvasjs-react-charts";
import React from "react";


function QuestionsPerKeywordBarChart(){

    function addSymbols(e){
        let suffixes = ["", "K", "M", "B"];
        let order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if(order > suffixes.length - 1)
            order = suffixes.length - 1;
        let suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }


    const options = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: ""
        },
        axisX: {
            title: "Keywords",
            reversed: true,
        },
        axisY: {
            title: "Number of questions",
            includeZero: true,
            labelFormatter: addSymbols
        },
        data: [{
            type: "bar",
            dataPoints: questions_per_keyrord
        }]
    }
    return(
        <CanvasJSChart options = {options}/>
    )
}

export default QuestionsPerKeywordBarChart