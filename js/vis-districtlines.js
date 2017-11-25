function updateDistrictDrawn(error) {
    // Create SVG Drawing area
    var districtSvg = d3.select("#districtDrawn").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    // Initialize map settings
    var districtProjection = d3.geoAlbersUsa()
        /***** WHY DOESN'T THIS SCALE UP? ****/
        .scale(1000)
        .translate([300,500]);

    var districtPath = d3.geoPath()
        .projection(districtProjection);

    var districtColor = d3.scaleOrdinal()
        .domain(["Legislature Alone", "Advisory Commission", "Backup Commission", "Politician Commission", "Independent Commission", "Single District"])
        .range(['#762a83','#af8dc3','#e7d4e8','#d9f0d3','#7fbf7b','#1b7837']);


    // using gapData and mapStates from vis-chloropleth
    var stateData = mapStates.features;
    // console.log(gapData);

    gapData.forEach(function(i) {
        var state = i["State"];
        var drawnBy = i["DrawnBy"];

        stateData.forEach(function(j) {
            var jsonState = j.properties.name;
            if (state == jsonState) {
                j.properties.drawnBy = drawnBy;
            }
        })
    })
    console.log(stateData);


    var districtMap = districtSvg.selectAll("path")
        .data(stateData)
        .enter().append("g")
        .attr("class", function(d) {
            return "state " + d.properties.name;
        });

    districtMap.append("path")
        .attr("d", path)
        .attr("opacity", 0.7)
        .attr("fill", function(d) {
            return districtColor(d.properties.drawnBy);
        })
        .on("mouseover", function(d) {
            d3.select(this).attr("opacity", 1);
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("opacity", 0.7);
        });


    // Add legend
    var districtLegend = districtSvg.selectAll('.legend')
        .data(stateData)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+50;
            return 'translate(450,' + y + ')';
        });

    districtLegend.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', function(d, i) {
            return districtColor(d.properties.drawnBy);
        });
        
    districtLegend.append('text')
        .attr("class", "legend-names")
        .attr('x', 20)
        .attr('y', 10)
        .text(function(d,i) {return d.properties.drawnBy; });
}