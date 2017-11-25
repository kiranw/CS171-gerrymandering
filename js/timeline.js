// set the dimensions and margins of the graph
var tl_margin = {top: 10, right: 20, bottom: 10, left: 50},
    tl_width = 800 - tl_margin.left - tl_margin.right,
    tl_height = 80 - tl_margin.top - tl_margin.bottom;

var tl_expansion_height = 400;

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

var tl_expansion_case = d3.select("#tl-expansion-case").append("svg")
    .attr("width", tl_width)
    .attr("height", tl_expansion_height)
    .append("g")
    .attr("width", tl_width - tl_margin.right - tl_margin.left)
    .attr("height", tl_expansion_height - tl_margin.top - tl_margin.bottom)
    .attr("transform", "translate("+tl_margin.left+","+tl_margin.top+")");

var node_position_factor = 7;

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
var tl_x_time = d3.scaleTime().range([tl_width2, 1]);

var logScale = d3.scaleLog()
    .base([20])
    .domain([tl_width2, 1])
    .range([0, tl_width2]);

function tl_x(d){
    return logScale(tl_x_time(d));
}

var tl_nodes = [];
var tl_links = [];


function drawSankey(svg, nodes, links_tl_1, links_tl_2){
    var units = "Widgets";

    // set the dimensions and margins of the graph
        width = svg.attr("width"),
        height = svg.attr("height");

    // format variables
    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return formatNumber(d) + " " + units; },
        color = d3.scaleOrdinal(d3.schemeCategory20);

    // Set the sankey diagram properties
    var sankey = makeSankey()
        .nodeWidth(10)
        .nodePadding(40)
        .size([width, height]);

    var path = sankey.link();

    sankey.nodes(nodes)
        .links(links_tl_1)
        .layout(5);

    sankey
        .nodes(nodes)
        .links(links_tl_2)
        .layout(5);

    links_tl = links_tl_2.concat(links_tl_1);

    // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(links_tl)
        .enter().append("path")
        // .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; })
        .attr("class", function(d){ return "node"+d.source.node + " node" + d.target.node + " link";});

    // add the link titles
    link.append("title")
        .text(function(d) {
            return d.source.name + " → " +
                d.target.name + "\n" + format(d.value); });

    // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", function(d){ return "node node" + d.node; })
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"; })
        .call(d3.drag()
            .subject(function(d) {
                return d;
            })
            .on("start", function(data) {
                console.log($("#tl-title"));
                $("#tl-title").text(data.name);
                if ("expanded" in data){
                    $("#tl-text").text(data.expanded);
                }
                if ("src" in data){
                    $("#tl-src").text("Source: " + data.src);
                }
                this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));

    // add the rectangles for the nodes
    node.append("circle")
        .attr("r", function(d) { return 5; })
        .attr("cx", 4)
        .attr("cy", 2.5)
        .attr("class", function(d){ return "node" + d.node; })
        .style("fill", function(d) {
            return d.color = color(d.name.replace(/ .*/, "")); })
        .on("click", function(data){
            console.log("click being registered");

        })
        .append("title")
        .text(function(d) {
            return d.name + "\n" + format(d.value); });

    // add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
        d3.select(this)
            .attr("transform",
                "translate("
                + d.x + ","
                + (d.y = Math.max(
                    0, Math.min(height - d.dy, d3.event.y))
                ) + ")");
        sankey.relayout();
        link.attr("d", path);
    }
}



function makeSankey(){
    var sankey = {},
        nodeWidth = 24,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        links = [];

    sankey.nodeWidth = function(_) {
        if (!arguments.length) return nodeWidth;
        nodeWidth = +_;
        return sankey;
    };

    sankey.nodePadding = function(_) {
        if (!arguments.length) return nodePadding;
        nodePadding = +_;
        return sankey;
    };

    sankey.nodes = function(_) {
        if (!arguments.length) return nodes;
        nodes = _;
        return sankey;
    };

    sankey.links = function(_) {
        if (!arguments.length) return links;
        links = _;
        return sankey;
    };

    sankey.size = function(_) {
        if (!arguments.length) return size;
        size = _;
        return sankey;
    };

    sankey.layout = function(iterations) {
        computeNodeLinks();
        computeNodeValues();
        computeNodeBreadths();
        computeNodeDepths(iterations);
        computeLinkDepths();
        return sankey;
    };

    sankey.relayout = function() {
        computeLinkDepths();
        return sankey;
    };

    sankey.link = function() {
        var curvature = .5;

        function link(d) {
            var x0 = d.source.x + d.source.dx,
                x1 = d.target.x + 1,
                xi = d3.interpolateNumber(x0, x1),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = d.source.y + d.sy + d.dy / 2,
                y1 = d.target.y + d.ty + d.dy / 2;
            return "M" + x0 + "," + y0
                + "C" + x2 + "," + y0
                + " " + x3 + "," + y1
                + " " + x1 + "," + y1;
        }

        link.curvature = function(_) {
            if (!arguments.length) return curvature;
            curvature = +_;
            return link;
        };

        return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
        nodes.forEach(function(node) {
            node.sourceLinks = [];
            node.targetLinks = [];
        });
        links.forEach(function(link) {
            var source = link.source,
                target = link.target;
            if (typeof source === "number") source = link.source = nodes[link.source];
            if (typeof target === "number") target = link.target = nodes[link.target];
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
        nodes.forEach(function(node) {
            node.value = Math.max(
                d3.sum(node.sourceLinks, value),
                d3.sum(node.targetLinks, value)
            );
        });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
        var remainingNodes = nodes;
        var nextNodes;

        while (remainingNodes.length){
            nextNodes = [];
            remainingNodes.forEach(function(node) {
                node.x = tl_x(node.date);
                node.dx = nodeWidth;
                node.sourceLinks.forEach(function(link) {
                    if (nextNodes.indexOf(link.target) < 0) {
                        nextNodes.push(link.target);
                    }
                });
            });
            remainingNodes = nextNodes;
        }

    }

    function computeNodeDepths(iterations) {
        var nodesByBreadth = d3.nest()
            .key(function(d) { return d.x; })
            .sortKeys(d3.ascending)
            .entries(nodes)
            .map(function(d) { return d.values; });

        initializeNodeDepth();

        function initializeNodeDepth() {
            nodesByBreadth.forEach(function(nodes) {
                nodes.forEach(function(node) {
                    node.y = (node.node * node_position_factor) % (tl_expansion_height - 20);
                    node.dy = 10;
                });
            });

            links.forEach(function(link) {
                link.dy = 5;
            });
        }
    }

    function computeLinkDepths() {
        nodes.forEach(function(node) {
            node.sourceLinks.sort(ascendingTargetDepth);
            node.targetLinks.sort(ascendingSourceDepth);
        });
        nodes.forEach(function(node) {
            var sy = 0, ty = 0;
            node.sourceLinks.forEach(function(link) {
                link.sy = sy;
            });
            node.targetLinks.forEach(function(link) {
                link.ty = ty;
            });
        });

        function ascendingSourceDepth(a, b) {
            return a.source.y - b.source.y;
        }

        function ascendingTargetDepth(a, b) {
            return a.target.y - b.target.y;
        }
    }

    function value(link) {
        return link.value;
    }

    return sankey;
};


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

    tl_x_time.domain([tl_minYear, tl_maxYear]);

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
            .attr("stroke", "#d9d9d9")
            .attr("stroke-width", 1)
            .on('mouseenter', tlMouseEnter)
            .on('mouseout', tlMouseOut)
            .on("click", tlClick)
    };

    tl_events = metadata["event"];
    tl_caseMetadata = metadata["case"];
    tl_caseLinks = caseLinks;
    tl_policies = metadata["policy"];


    tl_caseMetadata.forEach(function(d,i){
        tl_nodes.push({
            "node":i,
            "name":d.title,
            "expanded":d.expanded,
            "src":d.src,
            "date":d.date
        })
    });

    tl_caseLinks.forEach(function(d){
        var srcId = tl_nodes.filter(function(e){ return e["name"] == d.src; });
        var destId = tl_nodes.filter(function(e){ return e["name"] == d.dest; });
        if (srcId.length == 1 && destId.length == 1){
            tl_links.push({
                "source":srcId[0],
                "target":destId[0],
                "value":1
            })
        }
        else{
            console.log("Missing node information for the link: ",d, srcId, destId);
        }

    });

    node_position_factor = tl_expansion_height/tl_nodes.length;
    drawSankey(tl_expansion_case, tl_nodes, tl_links.slice(0,19), tl_links.slice(19));
}

function tlMouseEnter(data){
}

function tlMouseOut(data){
}

function tlClick(data){
    if ("title" in data){
        $("#tl-title").text(data.title);
    }
    if ("expanded" in data){
        $("#tl-text").text(data.expanded);
    }
    if ("src" in data){
        $("#tl-src").text("Source: " + data.src);
    }
}




