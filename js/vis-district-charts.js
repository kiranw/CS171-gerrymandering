// --> CREATE SVG DRAWING AREA
var margin = { top: 30, right: 40, bottom: 60, left: 60 };
var width = 500,
    height = 500;

var chartsSvg = d3.select("#districtCharts").append("svg")
    .attr("width", width)
    .attr("height", height);

var congressData;

queue()
    .defer(d3.csv, "data/new_allCongressDataPublish.csv")
    .await(function(error, congressDataCsv){
        // Process Data

        console.log(congressDataCsv)
        console.log(congressDataCsv.columns)
        congressData = congressDataCsv

        createLineCharts();
    });

//var curYear;

// Add demographic charts for the selected district
function createLineCharts(error){
    // curYear = document.getElementById("current-year");
    console.log("Current Year: " + curYear)

    function findDistrict(d) {
        var dInfo = d.stateDist.split(".");
        return d.state == stateCode && dInfo[1] == districtID && d.Year == curYear;
    }

    var districtData = congressData.filter(findDistrict);
    console.log("current data")
    console.log(districtData)
    var prcntAsian = districtData[0].prcntAsian;
    var prcntBlackNotHisp = districtData[0].prcntBlackNotHisp;
    var prcntHisp = districtData[0].prcntHisp
    var prcntWhite = districtData[0].prcntWhite
    var other = 100 - prcntAsian - prcntBlackNotHisp - prcntHisp - prcntWhite;
    var raceData = [];
    raceData.push(prcntAsian)
    raceData.push(prcntBlackNotHisp)
    raceData.push(prcntHisp)
    raceData.push(prcntWhite)
    // raceData.push(other)
    console.log(raceData)
    var races = ["Asian", "Black", "Hispanic", "White"]

    var raceChart = chartsSvg.append("g")
        .attr("class", "race")

    var raceBars = raceChart.selectAll("rect")
        .data(raceData)
        .enter().append("rect")
        .attr("fill", "grey")
        .attr("width", function(d) {
            console.log(d)
            return d
        })
        .attr("height", 20)
        .attr("x", 80)
        .attr("y", function(d, index) {
            return (index * 30);
        });

    chartsSvg.selectAll("text.race")
        .data(races)
        .enter().append("text")
        .attr("text-anchor", "end")
        .style("fill", "black")
        .attr("font-size", "10px")
        .attr("height", 10)
        .attr("x", 50)
        .attr("y", function(d, index) {
            return (10+index * 30);
        })
        .text(function(d) {
            return d;
        });

    raceBars.exit().transition(500).remove();


}

