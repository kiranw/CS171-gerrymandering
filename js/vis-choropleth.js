// Create SVG Drawing area
var margin = { top: 30, right: 0, bottom: 60, left: 0 };
var width = 600,
    height = 500;

var choroplethSvg = d3.select("#choropleth").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click","clicked");

var WindySvg = d3.select("#NC").append("svg")
    .attr("width", width)
    .attr("height", height);



// Initialize map settings
var projection = d3.geoAlbersUsa()
    .scale(500)
    .translate([200,height/4]);

var path = d3.geoPath()
    .projection(projection);

var mapJson;
var stateNames;
var stateID;

var colors = ['#d73027','#4575b4'];
var party = [];
party.push("Republican");
party.push("Democrat");

// Create SVG Drawing area
function findState(x) {
    return x.id == stateID;
}

function clicked(d) {
    var x, y, k;

    if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }

    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

    g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
}

var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
        stateID = (d.id / 100 | 0);
        var stateInfo = stateNames.filter(findState);
        var stateAbbr = stateInfo[0].code;
        var stateName = stateInfo[0].name;
        var districtID = (d.id % 100);
        var totalInfo = "<div class='tooltip-label'><span class='tooltip-title'>State:</span> " + stateName + "</div>";
        totalInfo += "<div class='tooltip-label'><span class='tooltip-title'>District:</span> " + districtID + "</div>";
        // totalInfo += "<div class='tooltip-label'><span class='tooltip-title'>Efficiency Gap:</span> " + efficiencyGap + "</div>";
        // totalInfo += "<div class='tooltip-label'><span class='tooltip-title'>Compactness Ratio:</span> " + compactnessRatio + "</div>";
        // totalInfo += "<div class='tooltip-label'><span class='tooltip-title'>Electoral Outcome:</span> " + electoralOutcome + "</div>";
        // totalInfo += "<div class='tooltip-label'><span class='tooltip-title'>Congressional Seats:</span> " + congressionalSeats + "</div>";
        return totalInfo
    });
d3.select('svg').call(tool_tip);

var congressData;
var gapData
var NCJson;
// Use the Queue.js library to read two files
queue()
    .defer(d3.json, "data/districts.json")
    .defer(d3.csv, "data/us-state-names.csv")
    .defer(d3.csv, "data/new_allCongressDataPublish.csv")
    .defer(d3.csv, "data/gapData.csv")
    .defer(d3.json, "data/us-states.json")
    .await(function(error, mapTopJson, stateNamesCsv, allCongressData, allGapData, mapStatesJson){

        // Process Data
        mapJson = mapTopJson;
        stateNames = stateNamesCsv;
        congressData = allCongressData;
        gapData = allGapData;
        mapStates = mapStatesJson;
        // console.log(gapData)

        windyJson = topojson.feature(mapJson, mapJson.objects.districts).features.filter(function(d) {
            var stateNum = (d.id / 100 | 0);
            if(stateNum == 37 || stateNum == 42 || stateNum == 26){
                return d
            }
            });
        drawWindy()

        // Update choropleth: add legend
        updateChoropleth();
        createLineCharts()

        // Update district drawn by Chloropleth [JFAN]
        updateDistrictDrawn();
    });

var curYear = 2014;

function findDistrict(d) {
    var dInfo = d.stateDist.split(".");
    return d.state == stateCode && dInfo[1] == districtID && d.Year == curYear;
}

function findGapData(d) {
    return d.State == stateName;
}

var stateID;
var stateInfo;
var stateName;
var stateCode;
var districtID;

var coloring = 1;
function choroplethColoring(d){
    if(d == 0){
        console.log("Efficiency gap")
        coloring = 0;
    }
    if(d == 1){
        console.log("Election outcome")
        coloring = 1;

    }
    if(d == 2){
        console.log("Total contested seats")
        coloring = 2;
    }
    updateChoropleth()
}

function drawWindy(error){
    WindySvg.append("g")
        .attr("class", "NCregion")
        .selectAll("path")
        .data(windyJson)
        .enter().append("path")
        .attr("d", path)
        .attr("id", function(d){ return "s"+d.id; })
        .attr("value", function(d){
            stateID = (d.id / 100 | 0);
            stateInfo = stateNames.filter(findState);
            return stateInfo[0].name; })
        .attr("fill", function(d) {
            stateID = (d.id / 100 | 0);
            stateInfo = stateNames.filter(findState);
            stateName = stateInfo[0].name;
            stateCode = stateInfo[0].code;
            districtID = (d.id % 100);
            var electionResult = congressData.filter(findDistrict);
            if(stateID <= 56 && stateID != 11){
                if(electionResult[0].party.includes("R")){
                    return colors[0];
                }
                else{
                    return colors[1];
                }
            }
        })
        .attr("transform", "translate(-300,0) scale(2.5)")

}

var colorSeats = d3.scaleLinear()
    .domain([0,55])
    .range(["#f2f0f7", "#54278f"]);

var colorGap = d3.scaleLinear()
    .domain([0,40])
    .range(["#edf8fb", "#596bbf"]);

function updateChoropleth(error) {
    var districts = topojson.feature(mapJson, mapJson.objects.districts).features;

    choroplethSvg.append("g")
        .attr("class", "region")
        .selectAll("path")
        .data(districts)
        .enter().append("path")
        .attr("d", path)
        .attr("id", function(d){ return "s"+d.id; })
        .attr("value", function(d){
            stateID = (d.id / 100 | 0);
            stateInfo = stateNames.filter(findState);
            return stateInfo[0].name; })
        .attr("stroke-width",0.25)
        .attr("stroke","#fff")
        .attr("fill", function(d) {
            stateID = (d.id / 100 | 0);
            stateInfo = stateNames.filter(findState);
            stateName = stateInfo[0].name;
            stateCode = stateInfo[0].code;
            districtID = (d.id % 100);
            districtInfo = gapData.filter(findGapData);
            if(coloring == 0){
                if(stateID <= 56 && stateID != 11) {
                    console.log(stateName)
                    console.log(districtInfo[0].Gap)
                    return colorGap(districtInfo[0].Gap)
                }
            }
            if(coloring == 1){
                var electionResult = congressData.filter(findDistrict);
                if(stateID <= 56 && stateID != 11){
                    if(electionResult[0].party.includes("R")){
                        return colors[0];
                    }
                    else{
                        return colors[1];
                    }
                }
            }
            if(coloring == 2){
                if(stateID <= 56 && stateID != 11) {
                    return colorSeats(districtInfo[0].Seats)
                }
            }
            return "grey"
        })
        .attr("transform", "translate(0,50) scale(1.5)")
        // .on("mouseenter", stateMouseOver)
        // .on("mouseout", stateMouseOut)
        .on("mouseenter click", function(d) {
            stateID = (d.id / 100 | 0);
            stateInfo = stateNames.filter(findState);
            stateName = stateInfo[0].name;
            stateCode = stateInfo[0].code;
            districtID = (d.id % 100);
            var currentDistrict = document.getElementById("current-district");
            currentDistrict.innerHTML = stateName +" District " + districtID;
            districtInfo = gapData.filter(findGapData);
            // console.log(districtInfo)
            document.getElementById("efficiency-gap").innerHTML = "Efficiency Gap: " + districtInfo[0].Gap +"%";
            //Electoral Outcome
            // console.log(d)
            var electionResult = congressData.filter(findDistrict);
            // console.log(electionResult)

            document.getElementById("outcome").innerHTML = electionResult[0].party;
            if (electionResult[0].party.includes("R")) {
                document.getElementById("outcome").className = "red";
            }
            else {
                document.getElementById("outcome").className = "blue";
            }
            document.getElementById("contested-seats").innerHTML = "Contested Seats in " + stateName +": " + districtInfo[0].Seats;
            createLineCharts()
        })
        .on("mouseout", function(d) {

            document.getElementById("current-district").innerHTML = "Select district";

            document.getElementById("efficiency-gap").innerHTML = "Efficiency Gap: ";
            
            document.getElementById("outcome").innerHTML = "";
            
            document.getElementById("contested-seats").innerHTML = "Contested Seats: ";
        });

    addLegend()
}

function addLegend() {
    var legend = choroplethSvg.selectAll('.legend')
        .data(party)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+50;
            return 'translate(400,' + y + ')';
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
        .text(function(d,i) {
            console.log(d)
            return d;
        });
}

function stateMouseOver(d) {
    // console.log(d);
    tool_tip.show(d);
    d3.select("#s" + d.id)
        .attr("stroke","#fff")
        .attr("stroke-width",1)
        .attr("stroke-opacity",0.6)
        .attr("opacity",0.7);
}

function stateMouseOut(d) {
    tool_tip.hide(d);
    d3.select("#s" + d.id)
        .attr("stroke","#fff")
        .attr("stroke-width",0)
        .attr("opacity", 1);
}