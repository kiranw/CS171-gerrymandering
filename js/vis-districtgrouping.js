districtGrouping();

// Draws 5x10 box representing ways to group districts
function districtGrouping() {

    var margin = { top: 500, right: 50, bottom: 0, left: 50 };
    var width = 500,
        height = 500;

    var cellHeight = 40, cellWidth = 40;
    var cellPadding = 5;

    // Scales & legends
    var groupColor = d3.scaleOrdinal()
        .range(['#762a83','#af8dc3','#e7d4e8','#d9f0d3','#7fbf7b']);

    // var groupingTypes = [
    // { key: "party", title: "Party"},
    // { key: "perfectRep", title: "Perfect Representation"},
    // { key: "compactUnfair", title: "Compact But Unfair"},
    // { key: "neither", title: "Neither Compact Nor Fair"}
    // ];

    var groups = ["District 1", "District 2", "District 3", "District 4", "District 5"];

    // var headers = d3.keys(configs);

    var party = [[0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1]];

    // Perfect Representation (groupingTypes[0])
    var perfectRep = [[0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4],
                    [0,1,2,3,4]];

    // Compact But Unfair (groupingTypes[1])
    var compactUnfair = [[0,0,0,0,0],
                    [0,0,0,0,0],
                    [1,1,1,1,1],
                    [1,1,1,1,1],
                    [2,2,2,2,2],
                    [2,2,2,2,2],
                    [3,3,3,3,3],
                    [3,3,3,3,3],
                    [4,4,4,4,4],
                    [4,4,4,4,4]];

    // Neither Compact Nor Unfair (groupingTypes[2])
    var neither = [[0,1,1,1,1],
                    [0,0,0,0,1],
                    [0,0,0,0,1],
                    [0,2,2,2,1],
                    [2,2,1,1,1],
                    [2,2,3,3,3],
                    [4,2,2,2,3],
                    [4,4,4,4,3],
                    [4,4,4,4,3],
                    [4,3,3,3,3]];


    var groupingData = [];

    /* NEED TO STRUCTURE groupingData LIKE THIS:
    [
        [{"party": 0, "perfectRep": 0, "compactUnfair": 0, "neither": 0},
        {"party": 0, "perfectRep": 0, "compactUnfair": 0, "neither": 0},
        {"party": 0, "perfectRep": 0, "compactUnfair": 0, "neither": 0},
        {"party": 0, "perfectRep": 0, "compactUnfair": 0, "neither": 0},
        {"party": 0, "perfectRep": 0, "compactUnfair": 0, "neither": 0}]
        ,x10
        ];
    */

    console.log(groupingData);

    var groupingSvg = d3.select("#districtGrouping").append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(100,25)");

    var group = groupingSvg.selectAll(".row")
        .data(perfectRep);
    
    var row = group.enter()
        .append("g")
        .attr("class", "row");

    row.merge(group)
        .attr("height", cellHeight)
        .style("opacity",0.3)
        .transition()
        .duration(500)
        .style("opacity",1)
        .attr("transform", function(d, i) {
            return "translate(0," + (cellHeight + cellPadding) * i + ")";
        });

    // Rect shows grouping
    var cell = row.selectAll(".cell")
        .data(function(d) { return d; })
        .enter().append("rect")
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

    // Circle shows people
    var party = row.selectAll(".party")
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
        .attr("fill", function(d,i) {
            return (d == 0) ? "#d7301f" : "#2171b5";
    });


    // Add legend
    var groupLegend = groupingSvg.selectAll('.legend')
        .data(groups)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+150;
            return 'translate(250,' + y + ')';
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
}