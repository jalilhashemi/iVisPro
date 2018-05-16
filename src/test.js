var margin = { top: 20, right: 50, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg2 = d3.select("#svg2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

bisectDate = d3.bisector(function (d) { return d.year; }).left,
    formatPercent = d3.format(",.1f"),
    hoverText = function (d) { return "%" + formatPercent(d); };

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 17000]);

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

d3.csv("./data/in_and_out_zurich.csv", function (d) {
    d.year = +d.StichtagDatJahr;
    d.outM = +d.aus_m_out;
    d.inM = +d.aus_m_in;
    d.outW = +d.aus_f_out;
    d.inW = +d.aus_f_in;
    return d;
}, function (error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain(d3.extent(data, function (d) { return d.outM; }));
    xaxis = d3.axisBottom().tickFormat(d3.format(".0f")).scale(x);

    svg2.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(0)")
        .attr("y", -6)
        .attr("dx", "0.71em")
        .attr("text-anchor", "start")
        .text("years");

    svg2.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Number of influx and outflux in Zürich");

        svg2.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr("class", "line")
            .attr("d", lineOutM);
       
            svg2.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr("class", "line")
            .attr("d", lineInM);

            svg2.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr("class", "line")
            .attr("d", lineOutW);

            svg2.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr("class", "line")
            .attr("d", lineInW);
});
