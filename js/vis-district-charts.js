// --> CREATE SVG DRAWING AREA
var margin = { top: 30, right: 40, bottom: 60, left: 60 };
var width = 500,
    height = 500;

var chartsSvg = d3.select("#districtCharts").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.csv, "data.csv")
    .await(createCharts);

// Demographic charts: Race, Income, Education levels. All barcharts
function createLineCharts(error, data){
    console.log(data);


}

