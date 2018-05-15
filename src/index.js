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

var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function (d) { return x(d.year + 6); })
    .y(function (d) { return y(d.percent); });

d3.csv("./data/resident-population-of-Zurich.csv", function (d) {
    d.year = +d.StichtagDatJahr;
    d.percent = +d.AuslAnt;
    return d;
}, function (error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain(d3.extent(data, function (d) { return d.percent; }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("percent of foreigners in Zürich");

    path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("d", line);
});
