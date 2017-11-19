// --> CREATE SVG DRAWING AREA
var margin = { top: 30, right: 40, bottom: 60, left: 60 };
var width = 400,
    height = 500;

var chartsSvg = d3.select("#districtCharts").append("svg")
    .attr("width", width)
    .attr("height", height);

var congressData;

queue()
    .defer(d3.csv, "data/new_allCongressDataPublish.csv")
    .await(function(error, congressDataCsv){
        // Process Data

        // console.log(congressDataCsv)
        // console.log(congressDataCsv.columns)
        congressData = congressDataCsv

        createLineCharts();
    });

//var curYear;

// Add demographic charts for the selected district
function createLineCharts(error){
    // curYear = document.getElementById("current-year");
    // console.log("Current Year: " + curYear)

    function findDistrict(d) {
        var dInfo = d.stateDist.split(".");
        return d.state == stateCode && dInfo[1] == districtID && d.Year == curYear;
    }

    var districtData = congressData.filter(findDistrict);
    // console.log(districtData)
    createRaceChart(districtData)
    createIncomeChart(districtData)

}

function createRaceChart(districtData){

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
    // console.log(raceData)
    var races = ["Asian", "Black", "Hispanic", "White"]

    var raceChart = chartsSvg.append("g")
        .attr("class", "race")

    var raceBars = raceChart.selectAll("rect")
        .data(raceData)
        .enter().append("rect")
        .attr("fill", "grey")
        .attr("width", function(d) {
            // console.log(d)
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

function createIncomeChart(districtData){
    // console.log("Income")

    var over25k = parseFloat(districtData[0].over25k).toFixed(2);
    var over50k = parseFloat(districtData[0].over50k).toFixed(2);
    var over75k = parseFloat(districtData[0].over75k).toFixed(2);
    var over100k = parseFloat(districtData[0].over100k).toFixed(2);
    var over150k = parseFloat(districtData[0].over150k).toFixed(2);
    var over200k = parseFloat(districtData[0].over200k).toFixed(2);
    var under25k = 100 - over25k;
    var from25to50 = over25k-over50k;
    var from50to75 = over50k-over75k;
    var from75to100 = over75k-over100k;
    var from100to150 = over100k-over150k;
    var from150to200 = over150k-over200k;
    var incomeData = [];
    incomeData.push(under25k)
    incomeData.push(from25to50)
    incomeData.push(from50to75)
    incomeData.push(from75to100)
    incomeData.push(from100to150)
    incomeData.push(from150to200)
    // console.log(incomeData)
    var incomes = ["under25k", "25to50k", "50to75k", "75to100k","100to150k","150to200k"];

    var incomeChart = chartsSvg.append("g")
        .attr("class", "income")

    var incomeBars = incomeChart.selectAll("rect")
        .data(incomeData)
        .enter().append("rect")
        .attr("fill", "steelblue")
        .attr("title", "sdfj")
        .attr("width", function(d) {
            return d
        })
        .attr("height", 20)
        .attr("x", 80)
        .attr("y", function(d, index) {
            return (150 + index * 30);
        });

    chartsSvg.selectAll("text.race")
        .data(incomes)
        .enter().append("text")
        .attr("text-anchor", "end")
        .style("fill", "black")
        .attr("font-size", "10px")
        .attr("height", 10)
        .attr("x", 50)
        .attr("y", function(d, index) {
            return (150+index * 30);
        })
        .text(function(d) {
            return d;
        });

    incomeBars.exit().transition(500).remove();
}