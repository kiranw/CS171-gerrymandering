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

var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
        var stateID = (d.id / 100 | 0);
        function findState(x) {
            return x.id == stateID;
        }
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


// Use the Queue.js library to read two files
queue()
    .defer(d3.json, "data/districts.json")
    .defer(d3.csv, "data/us-state-names.csv")
    .await(function(error, mapTopJson, stateNamesCsv){
        // Process Data
        console.log(mapTopJson)
        console.log(stateNamesCsv)
        mapJson = mapTopJson;
        stateNames = stateNamesCsv;

        // Update choropleth: add legend
        updateChoropleth();
    });


function updateChoropleth(error) {
    var districts = topojson.feature(mapJson, mapJson.objects.districts).features
    console.log(districts)

    choroplethSvg.append("g")
        .attr("class", "region")
        .selectAll("path")
        .data(districts)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", "pink")
        // .attr("fill", function(d) {
        //     if(d.properties.adm0_a3 in malariaDataByCountryId){
        //         var countryId = d.properties.adm0_a3;
        //         return color(countryId)
        //     }
        //     return "#e3e7ed"
        // })
        .attr("transform", "translate(0,50) scale(1.5)")
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

    //add legend
    //africa.exit().remove()
}

