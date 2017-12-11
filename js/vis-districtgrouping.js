// global var for selected district grouping
var selectedGroup, groupingSvg;

// Scales & legends
var groupColor = d3.scaleOrdinal()
    // .range(['#e66101','#fdb863','#f7f7f7','#b2abd2','#5e3c99']);
    .range(['#3B0090', '#FFA502', '#44C0FF', '#FFE600', '#00328D']);

// cellPadding originally 2px
var cellHeight = 40, cellWidth = 40, cellPadding = 0;

var groupingData = {
    party:
                [[0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1],
                [0,0,1,1,1]],
    perfectRep:     [[0,1,2,3,4],
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
    neither:        [[0,1,1,1,1],
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

var currentData;

var districtNumbers = ["District 1", "District 2", "District 3", "District 4", "District 5"];

var groupingSvg = d3.select("#districtGrouping").append("svg")
    .attr("width", 500)
    .attr("height", 500);

var pcSvg = d3.select("#packingcracking").append("svg")
    .attr("width", 500)
    .attr("height", 500);

districtGroupingInit();
packingCrackingInit();


// Draws 5x10 box representing ways to group districts
function districtGroupingInit() {

    // Add legend
    var groupLegend = groupingSvg.selectAll('.legend')
        .data(districtNumbers)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+150;
            return 'translate(350,' + y + ')';
        });

    groupLegend.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', function(d) {
            return groupColor(d);
        });
        
    groupLegend.append('text')
        .attr("class", "legend-names")
        .attr('x', 20)
        .attr('y', 10)
        .text(function(d) { return d; });

    // districtGroupingVis();
    districtGroupingVisInit();
}

// Draws 5x10 box representing ways to group districts
function packingCrackingInit() {

    // Add legend
    var groupLegend = pcSvg.selectAll('.legend')
        .data(districtNumbers)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+150;
            return 'translate(250,' + y + ')';
        });

    groupLegend.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', function(d) {
            return groupColor(d);
        });

    groupLegend.append('text')
        .attr("class", "legend-names")
        .attr('x', 20)
        .attr('y', 10)
        .text(function(d) { return d; });

    // districtGroupingVis();
    packingCrackingVisInit();
}


function districtGroupingVisInit() {
    var groupingDataById = {};
    var keys = ["perfectRep","compactUnfair","neither"];
    keys.forEach(function(key){
        var newList = [];
        var counts = {};
        groupingData[key].forEach(function(row){
            var newRow = [];
            row.forEach(function(d){
                var total = 1;
                if (d in counts){
                    counts[d] += 1;
                    total = counts[d];
                }
                else {
                    counts[d] =1;
                }
                newRow.push([total,d]);
            })
            newList = newList.concat(newRow);
        });
        groupingDataById[key] = newList;
    });

    // get selected Group
    selectedGroup = d3.select('input[name="groups"]:checked').property("id");
    currentData = groupingDataById[selectedGroup];

    // update winner
    d3.select("#winner").html(function() {
        if (selectedGroup == "neither") { return "<span class='red'>Red</span>"; }
        else { return "<span class='blue'>Blue</span>"; }
    });

    // Square shows district
    var districtG = groupingSvg.append("g")
        .attr("class", "districtGrouping")
        .attr("transform", "translate(100,25)")
        .selectAll(".cell")
        .data(currentData, function(d) { return d; })
        .enter()
        .append("rect")
        .attr("class", function(d, i) {
            return "cell column" + (i%5) + " group"+d[1];
        })
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("x", function(d, i) {
            return cellWidth * (i%5);
        })
        .attr("y", function(d, i){
            return cellHeight * (i - i%5)/5;
        })
        .attr("fill", function(d, i) {
            return groupColor(d[1]);
        })
        .on('mouseenter', dGMouseEnter)
        .on('mouseout', dGMouseOut);

    function dGMouseEnter(){
        var groupClass = d3.select(this).attr("class").split(" ")[2];
        d3.selectAll("."+groupClass).attr("opacity",0.5);
    }

    function dGMouseOut(){
        var groupClass = d3.select(this).attr("class").split(" ")[2];
        d3.selectAll("."+groupClass).attr("opacity",1);
    }


    // Circle shows people
    var partyG = groupingSvg.append("g")
        .attr("class", "partyGrouping")
        .attr("transform", "translate(100,25)");

    var partyGroup = partyG.selectAll(".party")
        .data(groupingData["party"]);

    var partyRow = partyGroup.enter()
        .append("g")
        .attr("class", "party");

    partyRow.merge(partyGroup)
        .attr("height", cellHeight)
        // .transition()
        // .duration(500)
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
        .attr("r", cellWidth/5)
        .attr("cx", function(d, i) {
            return ((cellWidth + cellPadding) * i) + (cellWidth/2);
        })
        .attr("cy", cellHeight/2)
        .attr("stroke-width","3")
        .attr("stroke", function(d,i) {
            return (d == 0) ? "#d7301f" : "#2171b5";
        })
        .attr("fill", function(d,i) {
            return (d == 0) ? "#d7301f" : "#2171b5";
        });
}


function districtGroupingVisUpdate() {
    var groupingDataById = {};
    var keys = ["perfectRep","compactUnfair","neither"];
    keys.forEach(function(key){
        var newList = [];
        var counts = {};
        groupingData[key].forEach(function(row){
            var newRow = [];
            row.forEach(function(d){
                var total = 1;
                if (d in counts){
                    counts[d] += 1;
                    total = counts[d];
                }
                else {
                    counts[d] =1;
                }
                newRow.push([total,d]);
            })
            newList = newList.concat(newRow);
        });
        groupingDataById[key] = newList;
    });

    // get selected Group
    selectedGroup = d3.select('input[name="groups"]:checked').property("id");

    // update winner
    d3.select("#winner").html(function() {
        if (selectedGroup == "neither") { return "<span class='red'>Red</span>"; }
        else { return "<span class='blue'>Blue</span>"; }
    });


    currentData = groupingDataById[selectedGroup];
    d3.selectAll(".cell")
        .data(currentData, function(d){ return d; })
        .transition()
        .duration(300)
        .attr("opacity", 0.8)
        .transition()
        .duration(500)
        .attr("x", function(d, i) {
            return cellWidth * (i%5);
        })
        .attr("y", function(d, i){
            return cellHeight * (i - i%5)/5;
        })
        .transition()
        .duration(300)
        .attr("opacity", 1);
}



function packingCrackingVisInit() {
    var groupingDataById = {};
    var keys = ["neither"];
    keys.forEach(function(key){
        var newList = [];
        var counts = {};
        groupingData[key].forEach(function(row){
            var newRow = [];
            row.forEach(function(d){
                var total = 1;
                if (d in counts){
                    counts[d] += 1;
                    total = counts[d];
                }
                else {
                    counts[d] =1;
                }
                newRow.push([total,d]);
            })
            newList = newList.concat(newRow);
        });
        groupingDataById[key] = newList;
    });

    // get selected Group
    selectedGroup = d3.select('input[name="packingcracking"]:checked').property("id");
    currentData = groupingDataById["neither"];
    districts = {cracking: [0,2,4], packing: [1,3]};

    // Square shows district
    var districtG = pcSvg.append("g")
        .attr("class", "districtGrouping")
        .attr("transform", "translate(0,25)")
        .selectAll(".cell")
        .data(currentData, function(d) { return d; })
        .enter()
        .append("rect")
        .attr("class", function(d, i) {
            return "pccell column" + (i%5) + " group"+d[1];
        })
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("x", function(d, i) {
            return cellWidth * (i%5);
        })
        .attr("y", function(d, i){
            return cellHeight * (i - i%5)/5;
        })
        .attr("fill", function(d, i) {
            return groupColor(d[1]);
        })
        .attr("opacity", function(d){
            return districts[selectedGroup].indexOf(+d[1]) >= 0 ? 1 : 0.1; })
        .on('mouseenter', dGMouseEnter)
        .on('mouseout', dGMouseOut);

    function dGMouseEnter(){
        var groupClass = d3.select(this).attr("class").split(" ")[2];
        d3.selectAll("."+groupClass).attr("opacity",0.5);
    }

    function dGMouseOut(){
        var groupClass = d3.select(this).attr("class").split(" ")[2];
        d3.selectAll("."+groupClass).attr("opacity",1);
    }


    // Circle shows people
    var partyG = pcSvg.append("g")
        .attr("class", "partyGrouping")
        .attr("transform", "translate(0,25)");

    var partyGroup = partyG.selectAll(".party")
        .data(groupingData["party"]);

    var partyRow = partyGroup.enter()
        .append("g")
        .attr("class", "party");

    partyRow.merge(partyGroup)
        .attr("height", cellHeight)
        // .transition()
        // .duration(500)
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
        .attr("r", cellWidth/5)
        .attr("cx", function(d, i) {
            return ((cellWidth + cellPadding) * i) + (cellWidth/2);
        })
        .attr("cy", cellHeight/2)
        .attr("stroke-width","3")
        .attr("stroke", function(d,i) {
            return (d == 0) ? "#d7301f" : "#2171b5";
        })
        .attr("fill", function(d,i) {
            return (d == 0) ? "#d7301f" : "#2171b5";
        });
}


function packingCrackingVisUpdate() {
        // get selected Group
    selectedGroup = d3.select('input[name="packingcracking"]:checked').property("id");
    districts = {cracking: [0,2,4], packing: [1,3]};
    console.log(selectedGroup);
    d3.selectAll(".pccell")
        .transition()
        .duration(500)
        .attr("opacity", function(d){
            return districts[selectedGroup].indexOf(+d[1]) >= 0 ? 1 : 0.1; });
}