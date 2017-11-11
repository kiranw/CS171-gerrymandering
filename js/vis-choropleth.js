// --> CREATE SVG DRAWING AREA
var margin = { top: 30, right: 40, bottom: 60, left: 60 };
var width = 500,
    height = 450;

var choroplethSvg = d3.select("#choropleth").append("svg")
    .attr("width", width)
    .attr("height", height);


var projection = d3.geoMercator();
var path = d3.geoPath()
    .projection(projection);

var colorScale = d3.scaleLinear().range(["#f2c9f1", "#b203ae"])//.interpolate(d3.interpolateLab);

var mapJson;
var stateNames;

function findState(x) {
    return x.id == stateID;
}

var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
        var stateID = (d.id / 100 | 0);
        var stateInfo = stateNames.filter(findState);
        var stateAbbr = stateInfo[0].code;
        var stateName = stateInfo[0].name;
        var districtID = (d.id % 100);
        var totalInfo = "State: " + stateName + " District: " + districtID
        totalInfo += "<br> Efficiency Gap: </br>"
        totalInfo += "Compactness Ratio: "
        totalInfo += "<br> Electoral Outcome: </br> "
        totalInfo += "Congressional Seats: "
        totalInfo += "<br> How fair was this election? </br> "
        return totalInfo
    });
d3.select('svg').call(tool_tip);

var recentData;
// Use the Queue.js library to read two files
queue()
    .defer(d3.json, "data/districts.json")
    .defer(d3.csv, "data/us-state-names.csv")
    .defer(d3.csv, "data/2014.csv")
    .await(function(error, mapTopJson, stateNamesCsv, placeholderData){
        // Process Data
        console.log(mapTopJson)
        console.log(stateNamesCsv)
        console.log(placeholderData)
        mapJson = mapTopJson;
        stateNames = stateNamesCsv;
        recentData = placeholderData;

        // Update choropleth: add legend
        updateChoropleth();
    });

function findDistrict(d) {
    return d["State"] == stateName && d["CD#"] == districtID;
}

var stateID;
var stateInfo;
var stateName;
var districtID;

function updateChoropleth(error) {
    var districts = topojson.feature(mapJson, mapJson.objects.districts).features
    console.log(districts)

    choroplethSvg.append("g")
        .attr("class", "region")
        .selectAll("path")
        .data(districts)
        .enter().append("path")
        .attr("d", path)
        //.attr("fill", "pink")
        .attr("fill", function(d) {
            stateID = (d.id / 100 | 0);
            stateInfo = stateNames.filter(findState);
            stateName = stateInfo[0].name;
            districtID = (d.id % 100);
            var electionResult = recentData.filter(findDistrict);
            if(stateID <= 56 && stateID != 11){
                if(electionResult[0]["Party"].includes("R")){
                    return "#cd0000"
                }
                else{
                    return "#0000ff"
                }
            }
        })
        .attr("transform", "translate(0,50) scale(1.5)")
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

    addLegend()
    //africa.exit().remove()
}

var colors = ["red","blue"]
var party = [];
party.push("Republican")
party.push("Democrat")


function addLegend() {
    var legend = choroplethSvg.selectAll('.legend')
        .data(party)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+250;
            return 'translate(60,' + y + ')';
        });

    legend.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', function(d, i) {
            return colors[i];
        });
    legend.append('text')
        .attr("class", "legend-names")
        .attr('x', 20)
        .attr('y', 10)
        .text(function(d,i) {return d; });
}