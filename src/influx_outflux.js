var margin = { top: 20, right: 50, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var chart2 = d3.select("#area2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

bisectDate = d3.bisector(function (d) { return d.year; }).left,
    formatPercent = d3.format(",.1f"),
    hoverText = function (d) { return "%" + formatPercent(d); };

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0])

var lineInM = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.inM); });
var lineOutM = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.outM); });
var lineInW = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.inW); });
var lineOutW = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.outW); });

d3.csv("./data/influx-outflux-zurich.csv", function (d) {
    d.year = +d.StichtagDatJahr;
    d.outM = +d.aus_m_out;
    d.inM = +d.aus_m_in;
    d.outW = +d.aus_f_out;
    d.inW = +d.aus_f_in;
    return d;
}, function (error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain([0, d3.max(data, function (d) { return d.outM; })]);
    xaxis = d3.axisBottom().tickFormat(d3.format(".0f")).scale(x);

    chart2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(0)")
        .attr("y", -6)
        .attr("dx", "0.71em")
        .attr("text-anchor", "start")
        .text("years");

    chart2.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Number of influx and outflux in Zürich");

    chart2.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#f4cc70")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("class", "line")
        .attr("d", lineOutM);

    chart2.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#de7a2")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("class", "line")
        .attr("d", lineInM);

    chart2.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#6ab187")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("class", "line")
        .attr("d", lineOutW);

    chart2.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#20948b")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("class", "line")
        .attr("d", lineInW);
});
