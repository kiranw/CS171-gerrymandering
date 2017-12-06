// Draws chloropleth showing how each state determines who draws the district lines (state legislature, etc)
function updateDistrictDrawn() {
    // Create SVG Drawing area
    var districtSvg = d3.select("#districtDrawn").append("svg")
        .attr("width", 650)
        .attr("height", 500)
        .attr("class", "districtDrawn");

    // Initialize map settings
    var districtProjection = d3.geoAlbersUsa()
        .scale(800)
        .translate([300,200]);

    var districtPath = d3.geoPath()
        .projection(districtProjection);

    // Scales & legends
    var districtColor = d3.scaleOrdinal()
        .range(['#d73027','#fc8d59','#fee090','#ffffbf','#e0f3f8','#91bfdb','#4575b4']);
        

    var legendText = ["Legislature Alone", "Advisory Commission", "Backup Commission", "Politician Commission", "Independent Commission", "Single District"];

    // Tooltip
    var districtTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
            var totalInfo = "<div class='tooltip-label'><span class='tooltip-title'>State:</span> " + d.properties.name + "</div>";
            totalInfo += "<div class='tooltip-label'><span class='tooltip-title'>District Lines Drawn By:</span> " + d.properties.drawnBy + "</div>";
            return totalInfo;
        });
    d3.select(".districtDrawn").call(districtTip);


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
    // console.log(stateData);

    // Draw map
    var districtMap = districtSvg
        .selectAll("path")
        .data(stateData)
        .enter().append("g")
        .attr("class", function(d) {
            return "state " + d.properties.name;
        });

    districtMap.append("path")
        .attr("d", districtPath)
        .attr("fill", function(d) {
            return districtColor(d.properties.drawnBy);
        })
        .on("mouseover", function(d) {
            d3.select(this).attr("opacity", 0.7)
                .attr("stroke","white")
                .attr("stroke-width",1)
                .attr("stroke-opacity",0.6);
            districtTip.show(d);
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("opacity", 1)
                .attr("stroke","white")
                .attr("stroke-width",0)
                .attr("stroke-opacity",0.6);
            districtTip.hide(d);
        });


    // Add legend
    var districtLegend = districtSvg
        .selectAll('.legend')
        .data(legendText)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+350;
            return 'translate(325,' + y + ')';
        });

    districtLegend.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', function(d) {
            return districtColor(d);
        });
        
    districtLegend.append('text')
        .attr("class", "legend-names")
        .attr('x', 20)
        .attr('y', 10)
        .text(function(d) { return d; });
}