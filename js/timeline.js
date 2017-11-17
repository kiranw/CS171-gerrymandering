// set the dimensions and margins of the graph
var tl_margin = {top: 10, right: 20, bottom: 10, left: 50},
    tl_width = 900 - tl_margin.left - tl_margin.right,
    tl_height = 80 - tl_margin.top - tl_margin.bottom;

var tl_svg_event = d3.select("#tl-svg-event").append("svg")
    .attr("width", tl_width)
    .attr("height", tl_height)
    .append("g")
    .attr("width", tl_width - tl_margin.right - tl_margin.left)
    .attr("height", tl_height - tl_margin.top - tl_margin.bottom)
    .attr("transform", "translate("+tl_margin.left+","+tl_margin.top+")");

var tl_svg_policy = d3.select("#tl-svg-policy").append("svg")
    .attr("width", tl_width)
    .attr("height", tl_height)
    .append("g")
    .attr("width", tl_width - tl_margin.right - tl_margin.left)
    .attr("height", tl_height - tl_margin.top - tl_margin.bottom)
    .attr("transform", "translate("+tl_margin.left+","+tl_margin.top+")");

var tl_svg_case = d3.select("#tl-svg-case").append("svg")
    .attr("width", tl_width)
    .attr("height", tl_height)
    .append("g")
    .attr("width", tl_width - tl_margin.right - tl_margin.left)
    .attr("height", tl_height - tl_margin.top - tl_margin.bottom)
    .attr("transform", "translate("+tl_margin.left+","+tl_margin.top+")");

var svgMappings = {"event":tl_svg_event, "policy": tl_svg_policy, "case":tl_svg_case};
var colorMappings = {"event": "#5FC5E6", "policy": "#BF76A4", "case": "#7CAD7E"}

var tl_width2 = tl_width - tl_margin.right - tl_margin.left;
var tl_height2 = tl_height - tl_margin.top - tl_margin.bottom;

// parse the date / time
var tl_parseTime = d3.timeParse("%d/%m/%Y");

// Initialize extents for time scale
var tl_minYear = tl_parseTime("1/1/3000");
var tl_maxYear = tl_parseTime("1/1/1000");

// set the ranges
var tl_x = d3.scaleTime().range([0, tl_width2]);

d3.queue()
    .defer(d3.csv, "data/event-metadata.csv")
    .defer(d3.csv, "data/case-metadata.csv")
    .defer(d3.csv, "data/case-links.csv")
    .defer(d3.csv, "data/policy-metadata.csv")
    .await(tlInitVis);

var tl_events = [];
var tl_caseMetadata = [];
var tl_caseLinks = [];
var tl_policies = [];

function tlInitVis(error, events, caseMetadata, caseLinks, policies) {
    var rectWidth = 8;

    var metadata = {"event":events, "policy":policies, "case":caseMetadata};
    for (var key in metadata){
        var dataSet = metadata[key];
        dataSet.forEach(function (d) {
            d.date = tl_parseTime(d.date);
            tl_minYear = d3.min([tl_minYear, d.date]);
            tl_maxYear = d3.max([tl_maxYear, d.date]);
        })
    };

    tl_x.domain([tl_minYear, tl_maxYear]);

    for (var key in metadata){
        var dataSet = metadata[key];
        svgMappings[key]
            .append("rect")
            .attr("id","rect")
            .attr("width", tl_width2)
            .attr("height", tl_height2)
            .attr("x",0)
            .attr("y",0)
            .attr("fill","#d9d9d9");
        var rects = svgMappings[key].append("g");

        rects.selectAll(".event-rect")
            .data(dataSet)
            .enter()
            .append("rect")
            .attr("class", "event-rect")
            .attr("x", function(d){ return tl_x(d.date) - 2.5; })
            .attr("y", 0)
            .attr("height", tl_height2)
            .attr("width", rectWidth)
            .attr("fill", function(d){ return colorMappings[key]; })
            .attr("opacity", 0.6)
            .on('mouseenter', tlMouseEnter)
            .on('mouseout', tlMouseOut)
            .on("click", tlClick)
    };

    // caseLinks.forEach(function(d){
    //     d.date = tl_parseTime(d.date);
    //     tl_minYear = d3.min(tl_minYear, d.date);
    //     tl_minYear = d3.max(tl_maxYear, d.date);
    // });

    tl_events = metadata["tl-svg-event"];
    tl_caseMetadata = metadata["tl-svg-case"];
    tl_caseLinks = caseLinks;
    tl_policies = metadata["tl-svg-policy"];

}

function tlMouseEnter(data){

}

function tlMouseOut(data){

}

function tlClick(data){
    console.log(data);
    if ("title" in data){
        $("#tl-title").text(data.title);
    }
    if ("expanded" in data){
        $("#tl-text").text(data.expanded);
    }
    if ("src" in data){
        $("#tl-src").text(data.src);
    }

}