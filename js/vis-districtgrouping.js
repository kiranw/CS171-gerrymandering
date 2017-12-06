// global var for selected district grouping
var selectedGroup, groupingSvg;

// Scales & legends
var groupColor = d3.scaleOrdinal()
    .range(['#e66101','#fdb863','#f7f7f7','#b2abd2','#5e3c99']);

var cellHeight = 40, cellWidth = 40, cellPadding = 5;

var groupingData = {
    party: [[0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1]],
    perfectRep: [[0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4]],
    compactUnfair: [[0,0,0,0,0],
                    [0,0,0,0,0],
                    [1,1,1,1,1],
                    [1,1,1,1,1],
                    [2,2,2,2,2],
                    [2,2,2,2,2],
                    [3,3,3,3,3],
                    [3,3,3,3,3],
                    [4,4,4,4,4],
                    [4,4,4,4,4]],
    neither: [[0,1,1,1,1],
                    [0,0,0,0,1],
                    [0,0,0,0,1],
                    [0,2,2,2,1],
                    [2,2,1,1,1],
                    [2,2,3,3,3],
                    [4,2,2,2,3],
                    [4,4,4,4,3],
                    [4,4,4,4,3],
                    [4,3,3,3,3]]
    };

var districtNumbers = ["District 1", "District 2", "District 3", "District 4", "District 5"];

var groupingSvg = d3.select("#districtGrouping").append("svg")
    .attr("width", width)
    .attr("height", height);


districtGroupingInit();


// Draws 5x10 box representing ways to group districts
function districtGroupingInit() {

    var margin = { top: 500, right: 50, bottom: 0, left: 50 };
    var width = 500,
        height = 500;

    // Add legend
    var groupLegend = groupingSvg.selectAll('.legend')
        .data(districtNumbers)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+150;
            return 'translate(400,' + y + ')';
        });

    groupLegend.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', function(d) {
            return groupColor(d);
        });
        
    groupLegend.append('text')
        .attr("class", "legend-names")
        .attr('x', 20)
        .attr('y', 10)
        .text(function(d) { return d; });

    // Circle shows people
    var partyG = groupingSvg.append("g")
        .attr("class", "districtGrouping")
        .attr("transform", "translate(150,25)");

    var partyGroup = partyG.selectAll(".party")
        .data(groupingData["party"]);

    var partyRow = partyGroup.enter()
        .append("g")
        .attr("class", "party");

    partyRow.merge(partyGroup)
        .attr("height", cellHeight)
        .style("opacity",0.3)
        .transition()
        .duration(500)
        .style("opacity",1)
        .attr("transform", function(d, i) {
            return "translate(0," + (cellHeight + cellPadding) * i + ")";
        });

    var party = partyRow.selectAll(".party")
        .data(function(d) {
            return d;
        })
        .enter().append("circle")
        .attr("class", function(d, i) {
            return "cell" + i;
        })
        .attr("r", cellWidth/2.5)
        .attr("cx", function(d, i) {
            return ((cellWidth + cellPadding) * i) + (cellWidth/2);
        })
        .attr("cy", cellHeight/2)
        .attr("stroke-width","3")
        .attr("stroke", function(d,i) {
            return (d == 0) ? "#d7301f" : "#2171b5";
    })
        .attr("fill","none");

    districtGroupingVis();
}

function districtGroupingVis() {
    // get selected Group
    selectedGroup = d3.select('input[name="groups"]:checked').property("id");

    // Square shows district    
    var districtG = groupingSvg.append("g")
        .attr("class", "districtGrouping")
        .attr("transform", "translate(150,25)");

    var districtRow = districtG.selectAll(".row")
        .data(groupingData[selectedGroup], function(d) { return d; });

    var row = districtRow.enter()
        .append("g")
        .attr("class", "row");

    row.exit().remove();

    row.merge(districtRow)
        .attr("height", cellHeight)
        .style("opacity",0.2)
        .transition()
        .duration(500)
        .style("opacity",0.5)
        .attr("transform", function(d, i) {
            return "translate(0," + (cellHeight + cellPadding) * i + ")";
        });

    var cell = row.selectAll(".cell")
        .data(function(d) { return d; });

    cell.exit().remove();

    cell.enter().append("rect")
        .attr("class", function(d, i) {
            return "column" + i;
        })
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("x", function(d, i) { 
            return (cellWidth + cellPadding) * i;
        })
        .attr("y", 0)
        .attr("fill", function(d, i) {
            return groupColor(d);
        });
}