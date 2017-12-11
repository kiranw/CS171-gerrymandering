var width = 520,
    height = 400;

var chartsSvg = d3.select("#districtCharts").append("svg")
    .attr("width", width)
    .attr("height", height);

var arc = d3.arc().outerRadius(50).innerRadius(0);
// Purple/blue
// var color = ['#edf8fb','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d','#6e016b'];

// Purple to red
var color = ['#3B0090', '#6702FF', '#00328D', '#44C0FF', '#FFE600', '#FFA502',  '#CD2E2E'];

// Red to purple
// var color = ['#CD2E2E','#FFA502','#FFE600','#44C0FF','#00328D','#6702FF','#3B0090'];
    

    chartsSvg.append("text")
        .attr("class","race-title")
        .attr("x", 0)
        .attr("y", 16)
        .text("District Race");

    chartsSvg.append("text")
        .attr("class","ntl-title")
        .attr("x", 0)
        .attr("y", 160)
        .text("Nationwide Race");

    chartsSvg.append("text")
        .attr("class","emp-title")
        .attr("x", 140)
        .attr("y", 16)
        .text("District Income");

    chartsSvg.append("text")
        .attr("class","ntl-title")
        .attr("x", 140)
        .attr("y", 160)
        .text("Nationwide Income");

    chartsSvg.append("text")
        .attr("class","emp-title")
        .attr("x", 300)
        .attr("y", 16)
        .text("District Employment");
        
    chartsSvg.append("text")
        .attr("class","ntl-title")
        .attr("x", 300)
        .attr("y", 160)
        .text("Nationwide Employment");

// Add demographic charts for the selected district
function createLineCharts(error, districtData){
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
    var other = (100 - prcntAsian - prcntBlackNotHisp - prcntHisp - prcntWhite).toFixed(2);
    var raceData = [];
    raceData.push(prcntWhite)
    raceData.push(prcntHisp)
    raceData.push(prcntBlackNotHisp)
    raceData.push(prcntAsian)
    raceData.push(other)
    // console.log(raceData)

    var races = ["White","Hispanic","Black","Asian", "Other"]

    var raceChart = chartsSvg.append("g")
        .attr("class", "race")
        .attr("height",200)
        .attr("width",200);

    var raceUS = chartsSvg.append("g")
        .attr("class", "raceUS")
        .attr("height",200)
        .attr("width",200);

    var pie = d3.pie()
        .value(function(d,i) {
            return d
        }).sort(null);

    var path = raceChart.selectAll('path')
        .data(pie(raceData))
        .enter().append('path')
        .attr('d', arc)
        .attr("transform", "translate(50,80)")
        .attr('stroke', '#fff')
        .attr('stroke-width', '0.5')
        .attr('fill', function(d, i) {
            return color[i];
        })
        .transition().delay(function(d,i) {
            return i * 500; }).duration(500);

    var raceUSData = ["62","18","12","6","2"]
    // http://www.pewresearch.org/fact-tank/2015/10/05/future-immigration-will-change-the-face-of-america-by-2065/
    var path1 = raceUS.selectAll('path')
        .data(pie(raceUSData))
        .enter().append('path')
        .attr('d', arc)
        .attr("transform", "translate(50,230)")
        .attr('stroke', '#fff')
        .attr('stroke-width', '0.5')
        .attr('fill', function(d, i) {
            return color[i];
        })
        .transition().delay(function(d,i) {
            return i * 500; }).duration(500);

    var legend = raceChart.selectAll('.legend')
        .data(races)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+300;
            return 'translate(0,' + y + ')';
        });

    legend.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', function(d, i) {
            return color[i];
        });

    d3.selectAll(".race-legend-names").remove();

    legend.append('text')
        .attr("class", "race-legend-names")
        .attr('x', 20)
        .attr('y', 10)
        .text(function(d,i) {
            var pieData = raceData;
            return d + " " + pieData[i] + "%  (" + raceUSData[i] + "%)";
        });

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
    incomeData.push(under25k.toFixed(2));
    incomeData.push(from25to50.toFixed(2));
    incomeData.push(from50to75.toFixed(2));
    incomeData.push(from75to100.toFixed(2));
    incomeData.push(from100to150.toFixed(2));
    incomeData.push(from150to200.toFixed(2));
    incomeData.push(over200k);
    // console.log(incomeData)
    var incomes = ["<25k","25-50k", "50-75k", "75-100k", "100-150k","150-200k","200k+"];
    var incomeUSData = ["22.1","22.7","16.7","12.1","14.1","6.2","6.1"]
    // https://www.statista.com/statistics/203183/percentage-distribution-of-household-income-in-the-us/

    var incomeChart = chartsSvg.append("g")
        .attr("class", "income")
        .attr("transform", "translate(100,0)")
        .attr("height",200)
        .attr("width",200);

    var incomeUS = chartsSvg.append("g")
        .attr("class", "incomeUS")
        .attr("transform", "translate(100,0)")
        .attr("height",200)
        .attr("width",200);

    var pie = d3.pie()
        .value(function(d,i) {
            return d
        }).sort(null);

    var path = incomeChart.selectAll('path')
        .data(pie(incomeData))
        .enter().append('path')
        .attr('d', arc)
        .attr("transform", "translate(100,80)")
        .attr('stroke', '#fff')
        .attr('stroke-width', '0.5')
        .attr('fill', function(d, i) {
            return color[i];
        })
        .transition().delay(function(d,i) {
            return i * 500; }).duration(500);

    var path1 = incomeUS.selectAll('path')
        .data(pie(incomeUSData))
        .enter().append('path')
        .attr('d', arc)
        .attr("transform", "translate(100,230)")
        .attr('stroke', '#fff')
        .attr('stroke-width', '0.5')
        .attr('fill', function(d, i) {
            return color[i];
        })
        .transition().delay(function(d,i) {
            return i * 500; }).duration(500);

    var legend = incomeChart.selectAll('.legend')
        .data(incomes)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+300;
            return 'translate(40,' + y + ')';
        });

    legend.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', function(d, i) {
            return color[i];
        });

    d3.selectAll(".income-legend-names").remove();
    legend.append('text')
        .attr("class", "income-legend-names")
        .attr('x', 20)
        .attr('y', 10)
        .text(function(d,i) {
            var pieData = incomeData
            return d + " " + pieData[i] + "%" + " (" + incomeUSData[i] + "%)";
        });

}

function createEmploymentChart(districtData){
    // console.log(districtData)
    var unemp = districtData[0].prcntUnemp
    // console.log(unemp)
    var emData = []
    emData.push(100-unemp)
    emData.push(unemp)
    var emUS = ["94.2","5.8"]

    var employmentChart = chartsSvg.append("g")
        .attr("class", "employment")
        .attr("id", "employment")
        .attr("transform", "translate(260,0)")
        .attr("height",200)
        .attr("width",200);

    var employmentUS = chartsSvg.append("g")
        .attr("class", "employmentUS")
        .attr("id", "employmentUS")
        .attr("transform", "translate(260,0)")
        .attr("height",200)
        .attr("width",200);

    var pie = d3.pie()
        .value(function(d,i) {
            return d
        }).sort(null);

    var path = employmentChart.selectAll('path')
        .data(pie(emData))
        .enter().append('path')
        .attr('d', arc)
        .attr("transform", "translate(100,80)")
        .attr('stroke', '#fff')
        .attr('stroke-width', '0.5')
        .attr('fill', function(d, i) {
            return color[i];
        })
        .transition().delay(function(d,i) {
            return i * 500; }).duration(500);

    var path1 = employmentUS.selectAll('path')
        .data(pie(emUS))
        .enter().append('path')
        .attr('d', arc)
        .attr("transform", "translate(100,230)")
        .attr('stroke', '#fff')
        .attr('stroke-width', '0.5')
        .attr('fill', function(d, i) {
            return color[i];
        })
        .transition().delay(function(d,i) {
            return i * 500; }).duration(500);

    var employStatus = ["Employed", "Unemployed"]

    var legend = employmentChart.selectAll('.legend')
        .data(employStatus)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var y = 15*i+300;
            return 'translate(50,' + y + ')';
        });

    legend.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .style('fill', function(d, i) {
            return color[i];
        });

    d3.selectAll(".pie-legend-names").remove();
    legend.append('text')
        .attr("class", "pie-legend-names")
        .attr('x', 20)
        .attr('y', 10)
        .text(function(d,i) {
            var pieData = emData
            return d + " " + pieData[i] + "% (" + emUS[i] + "%)";
        });

}