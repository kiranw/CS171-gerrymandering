// --> CREATE SVG DRAWING AREA

// var margin = { top: 30, right: 0, bottom: 20, left: 0 };
// var width = 800,
//     height = 350;

var margin = { top: 30, right: 40, bottom: 60, left: 60 };
var width = 940,
    height = 500;

var chartsSvg = d3.select("#districtCharts").append("svg")
    .attr("width", width)
    .attr("height", height);

//var curYear;

// Add demographic charts for the selected district
function createLineCharts(error){
    // curYear = document.getElementById("current-year");
    // console.log("Current Year: " + curYear)

    function findDistrict(d) {
        var dInfo = d.stateDist.split(".");
        return d.state == stateCode && dInfo[1] == districtID && d.Year == curYear;
    }

    var districtData = congressData.filter(findDistrict);
    // console.log(districtData)
    createRaceChart(districtData)
    createIncomeChart(districtData)
    createEmploymentChart(districtData)

}

function createRaceChart(districtData){

    var prcntAsian = districtData[0].prcntAsian;
    var prcntBlackNotHisp = districtData[0].prcntBlackNotHisp;
    var prcntHisp = districtData[0].prcntHisp
    var prcntWhite = districtData[0].prcntWhite
    var other = 100 - prcntAsian - prcntBlackNotHisp - prcntHisp - prcntWhite;
    var raceData = [];
    raceData.push(prcntAsian)
    raceData.push(prcntBlackNotHisp)
    raceData.push(prcntHisp)
    raceData.push(prcntWhite)
    // raceData.push(other)
    // console.log(raceData)
    chartsSvg.append("text")
        .attr("class","race-title")
        .style("fill", "black")
        .attr("x", 20)
        .attr("y", 16)
        .text("Race");

    var races = ["Asian", "Black", "Hispanic", "White"]

    var raceChart = chartsSvg.append("g")
        .attr("class", "race")
    
    var dataRaceBars = raceChart.selectAll("rect")
        .data(raceData, function(d) {
            return d.key;
        });

    d3.selectAll(".race-bars").remove();
    d3.selectAll(".race-percent").remove();

    var raceBars = dataRaceBars.enter()
        .append("rect")
        .attr('transform', 'translate(60, 40)')
        .attr("class", "race-bars")
        .attr("fill", "grey")

    raceBars.merge(raceBars)
        //.transition()
        //.duration(1000)
        .attr("width", function(d) {return d})
        .attr("height", 20)
        .attr("x", 0)
        .attr("y", function(d, index) {
            return (3+index * 30);
        })

    chartsSvg.selectAll("text.race")
        .data(races)
        .enter().append("text")
        .attr("text-anchor", "end")
        .style("fill", "black")
        .attr("font-size", "10px")
        .attr("height", 10)
        .attr("x", 50)
        .attr("y", function(d, index) {
            return (50+index * 30);
        })
        .text(function(d) {
            return d;
        });
    chartsSvg.selectAll("text.racePercent")
        .data(raceData)
        .enter().append("text")
        .attr("class","race-percent")
        .style("fill", "black")
        .attr("font-size", "10px")
        .attr("height", 10)
        .attr("x", function(d) {
            return 80+parseFloat(d)})
        .attr("y", function(d, index) {
            return (50+index * 30);
        })
        .text(function(d) {
            return d + "%";
        });

    //raceBars.exit().transition(500).remove();
}

function createIncomeChart(districtData){
    // console.log("Income")

    var over25k = parseFloat(districtData[0].over25k).toFixed(2);
    var over50k = parseFloat(districtData[0].over50k).toFixed(2);
    var over75k = parseFloat(districtData[0].over75k).toFixed(2);
    var over100k = parseFloat(districtData[0].over100k).toFixed(2);
    var over150k = parseFloat(districtData[0].over150k).toFixed(2);
    var over200k = parseFloat(districtData[0].over200k).toFixed(2);
    var under25k = 100 - over25k;
    var from25to50 = over25k-over50k;
    var from50to75 = over50k-over75k;
    var from75to100 = over75k-over100k;
    var from100to150 = over100k-over150k;
    var from150to200 = over150k-over200k;
    var incomeData = [];
    incomeData.push(under25k);
    incomeData.push(from25to50);
    incomeData.push(from50to75);
    incomeData.push(from75to100);
    incomeData.push(from100to150);
    incomeData.push(from150to200);
    // console.log(incomeData)
    var incomes = ["<25k", "25-50k", "50-75k", "75-100k","100-150k","150k+"];

    var incomeChart = chartsSvg.append("g")
        .attr("class", "income")
        .attr("transform", "translate(200,30)")
        .attr("width", 100)
        .attr("height", 600);

    var x = d3.scaleLinear().domain([0,5]).range([0, 200]);
    var y = d3.scaleLinear().domain([0,100]).range([200, 0]);
    var xAxis = d3.axisBottom(x).ticks(6).tickFormat(function (d,i) {return incomes[i]});
    var yAxis = d3.axisLeft(y);

    incomeChart.append('g')
        .attr("transform", 'translate(50, 200)')
        .attr("id", "xAxis")
        .attr("class", "x axis")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 15)
        .attr("x", -35)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-60)")
        //.style("text-anchor", "start");
    incomeChart.append('g')
        .attr("transform", 'translate(50, 0)')
        .attr("id", "yAxis")
        .attr("class", "y axis")
        .call(yAxis);

    var incomeLine = d3.line()
        .x(function(d,i) {
            // console.log(i)
            return x(+i); })
        .y(function(d) {
            // console.log(d)
            return y(+d); });

    d3.selectAll(".income-line").remove();

    incomeChart.append("path")
        .data([incomeData])
        .attr("class", "income-line")
        .attr("transform", 'translate(50, 0)')
        .attr("d", incomeLine);

    chartsSvg.append("text")
        .attr("class","income-title")
        .style("fill", "black")
        .attr("x", 260)
        .attr("y", 16)
        .text("Income Distribution");

    chartsSvg.append("text")
        .attr("transform", "translate(280,310)")
        .text("Annual Income Bracket");
    chartsSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 205 )
        .attr("x",-130)
        .attr("dy", "1em")
        //.attr("transform", "translate(40,0)")
        .style("text-anchor", "middle")
        .text("% of Total Population");

}

function createEmploymentChart(districtData){
    // console.log(districtData)
    var unemp = districtData[0].prcntUnemp
    var emData = []
    emData.push(100-unemp)
    emData.push(unemp)
    // console.log(unemp)
    var color = ["grey", "orange"];
    var arc = d3.arc().outerRadius(50).innerRadius(0);

    var employmentChart = chartsSvg.append("g")
        .attr("class", "employment")
        .attr("transform", "translate(450,0)")

    chartsSvg.append("text")
        .attr("class","emp-title")
        .style("fill", "black")
        .attr("x", 500)
        .attr("y", 16)
        .text("Employment");

    var pie = d3.pie()
        .value(function(d,i) {
            return d
        }).sort(null);

    var path = employmentChart.selectAll('path')
        .data(pie(emData))
        .enter().append('path')
        .attr('d', arc)
        .attr("transform", "translate(100,100)")
        .attr('stroke', '#fff') // <-- THIS
        .attr('stroke-width', '2') // <-- THIS
        .attr('fill', function(d, i) {
            return color[i];
        });

    var employStatus = ["Employed", "Unemployed"]

    var legend = employmentChart.selectAll('.legend')
        .data(employStatus)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+180;
            return 'translate(90,' + y + ')';
        });

    legend.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', function(d, i) {
            console.log(d)
            return color[i];
        });
    legend.append('text')
        .attr("class", "legend-names")
        .attr('x', 20)
        .attr('y', 10)
        .text(function(d,i) {return d; });
}