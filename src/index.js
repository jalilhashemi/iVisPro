// d3.csv("./data/resident-population-of-Zurich.csv", function (error, data) {
//     // Wirtschaftliche Wohnbevölkerung der Stadt Zürich
//     data.forEach(function (d) {
//         d.year = +d.StichtagDatJahr;
//         d.perceOfForeigner = +d.AuslAnt;
//         console.log(d.year, d.perceOfForeigner);
//     });

// });

// d3.csv("./data/influx.csv", function (error, data) {
//     data.forEach(function (d) {
//         d.yearInflux = +d.StichtagDatJahr;
//         d.influxM = +d.aus_m;
//         d.influxW = +d.aus_f;
//         console.log(d.yearInflux, d.influxM, d.influxW);
//     });
// });

// d3.csv("./data/outflux.csv", function (error, data) {
//     data.forEach(function (d) {
//         d.yearOutflux = +d.StichtagDatJahr;
//         d.outfluxM = +d.aus_m;
//         d.outfluxW = +d.aus_f;
//         console.log(d.yearOutflux, d.outfluxM, d.outfluxW);
//     });
// });

var margin = { top: 20, right: 50, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

bisectDate = d3.bisector(function (d) { return d.year; }).left,
    formatValue = d3.format(",.1f"),
    formatPercent = function (d) { return "%" + formatValue(d); };

var x = d3.scaleLinear()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.percent); });

d3.csv("./data/resident-population-of-Zurich.csv", function (d) {
    d.year = +d.StichtagDatJahr;
    d.percent = +d.AuslAnt;
    return d;
}, function (error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain(d3.extent(data, function (d) { return d.percent; }));
    xaxis = d3.axisBottom().tickFormat(d3.format(".0f")).scale(x);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(0)")
        .attr("y", -6)
        .attr("dx", "0.71em")
        .attr("text-anchor", "start")
        .text("years");

    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("percent of foreigners in Zürich");

    d3.select("#start").on("click", function () {
        var path = svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 3)
            .attr("class", "line")
            .attr("d", line);

        var totalLength = path.node().getTotalLength();

        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(6000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5)
            .attr("fill", "steelblue")
            .attr("stroke", "steelblue");

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        svg.append("rect")
            .attr("class", "overlay")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function () { focus.style("display", null); })
            .on("mouseout", function () { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.year) + "," + y(d.percent) + ")");
            focus.select("text").text(formatPercent(d.percent));
        }
    });

    d3.select("#reset").on("click", function () {
        d3.select(".line").remove();
        d3.select(".overlay").remove();
    });
});
