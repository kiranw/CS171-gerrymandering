// Create SVG Drawing area
var districtSvg = d3.select("#districtDrawn").append("svg")
    .attr("width", width)
    .attr("height", height);

// Initialize map settings
var districtProjection = d3.geoAlbersUsa()
    .scale(500)
    .translate([200,height/4]);

var districtPath = d3.geoPath()
    .projection(districtProjection);


function updateDistrictDrawn(error) {

    console.log(stateNames);
    // var districts = topojson.feature(mapJson, mapJson.objects.districts).features;

    // districtSvg.append("g")
    //     .attr("class", "region")
    //     .selectAll("path")
    //     .data(districts)
    //     .enter().append("path")
    //     .attr("d", path)
    //     .attr("fill", function(d) {
    //     });

    // addLegend()
}

// function addLegend() {
//     var legend = choroplethSvg.selectAll('.legend')
//         .data(party)
//         .enter()
//         .append('g')
//         .attr('class', 'legend')
//         .attr('transform', function(d, i) {
//             var y = 15*i+50;
//             return 'translate(400,' + y + ')';
//         });

//     legend.append('rect')
//         .attr('width', 12)
//         .attr('height', 12)
//         .style('fill', function(d, i) {
//             return colors[i];
//         });
//     legend.append('text')
//         .attr("class", "legend-names")
//         .attr('x', 20)
//         .attr('y', 10)
//         .text(function(d,i) {return d; });
// }