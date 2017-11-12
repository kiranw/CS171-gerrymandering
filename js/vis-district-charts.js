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

    var raceChart = choroplethSvg.append("g")
        .attr("class", "race")

    raceChart.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("fill", "grey")
        .attr("width", function(d) {
            return d.height_px;
        })
        .attr("height", 40)
        .attr("x", 210)
        .attr("y", function(d, index) {
            return (index * 50);
        })
        .on("click", function(d) {
            d3.selectAll("rect").attr("fill", "grey");
            d3.select(this).attr("fill", "lightblue");
            console.log("click");
            console.log(d);
            updateInfo(d)
        });

}

