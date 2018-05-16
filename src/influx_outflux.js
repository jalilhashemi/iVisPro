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

var lineInM = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function (d) { return x(d.year); })
    .y0(height)
    .y1(function (d) { return y(d.inM); });

var lineOutM = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function (d) { return x(d.year); })
    .y0(height)
    .y1(function (d) { return y(d.outM); });

var lineInW = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function (d) { return x(d.year); })
    .y0(height)
    .y1(function (d) { return y(d.inW); });

var lineOutW = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function (d) { return x(d.year); })
    .y0(height)
    .y1(function (d) { return y(d.outW); });

var div = d3.select("#area2").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("./data/influx-outflux-zurich.csv", function (d) {
    d.year = +d.StichtagDatJahr;
    d.inM = +d.aus_m_in;
    d.outM = +d.aus_m_out;
    d.inW = +d.aus_f_in;
    d.outW = +d.aus_f_out;

    return d;
}, function (error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain([2000, d3.max(data, function (d) { return d.outM; })]);
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
        .attr("fill", "#f5e35633")
        .attr("stroke", "#f5e356")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("class", "line")
        .attr("d", lineInM);

    chart2.append("path")
        .datum(data)
        .attr("fill", "#cb631833")
        .attr("stroke", "#cb6318")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("class", "line")
        .attr("d", lineOutM);

    chart2.append("path")
        .datum(data)
        .attr("fill", "#34888c33")
        .attr("stroke", "#34888c")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("class", "line")
        .attr("d", lineInW);

    chart2.append("path")
        .datum(data)
        .attr("fill", "#7caa2d33")
        .attr("stroke", "#7caa2d")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 3)
        .attr("class", "line")
        .attr("d", lineOutW);

    var svg_aline = chart2.append("line")
        .attr("class", "tooltip-line")
        .style("stroke-dasharray", ("3, 10"))
        .attr("x1", 100)
        .attr("x2", 400)
        .attr("y1", 200)
        .attr("y2", 200)
        .style("display", "None")

    //incoming male
    chart2.selectAll("dot").data(data)
        .enter()
        .append("circle")
        .attr("r", 8)
        .attr("cx", function (d) { return x(d.year) })
        .attr("cy", function (d) { return y(d.inM); })
        .attr("class", "dotInM")
        .on("mouseover", function (d) {
            d3.select(this).transition().duration(100)
                .style("fill", "#f5e356")
                .attr("r", 12);
            div.transition()
                .duration(200)
                .style("opacity", .8);
            div.html(d.year + '<br>' + "came" + '<br>' + d.inM + '<br>' + "male")
                .style("left", x(d.year) + "px")
                .style("top", y(d.inM) + "px");
            svg_aline.transition().duration(10)
                .style("display", "block")
                .attr("x1", x(d.year))
                .attr("y1", y(d.inM))
                .attr("x2", x(d.year))
                .attr("y2", height)
        })
        .on("mouseout", function (d) {
            d3.select(this).transition().duration(100)
                .style("fill", "#f5e356")
                .attr("r", 8);
            div.transition()
                .duration(500)
                .style("opacity", 0);
            svg_aline.style("display", "None")
        });

    //outgoing male
    chart2.selectAll("dot").data(data)
        .enter()
        .append("circle")
        .attr("r", 8)
        .attr("cx", function (d) { return x(d.year) })
        .attr("cy", function (d) { return y(d.outM); })
        .attr("class", "dotOutM")
        .on("mouseover", function (d) {
            d3.select(this).transition().duration(100)
                .style("fill", "#cb6318")
                .attr("r", 12);
            div.transition()
                .duration(200)
                .style("opacity", .8);
            div.html(d.year + '<br>' + "left" + '<br>' + d.outM + '<br>' + "male")
                .style("left", x(d.year) + "px")
                .style("top", y(d.outM) + "px");
            svg_aline.transition().duration(10)
                .style("display", "block")
                .attr("x1", x(d.year))
                .attr("y1", y(d.outM))
                .attr("x2", x(d.year))
                .attr("y2", height)
        })
        .on("mouseout", function (d) {
            d3.select(this).transition().duration(100)
                .style("fill", "#cb6318")
                .attr("r", 8);
            div.transition()
                .duration(500)
                .style("opacity", 0);
            svg_aline.style("display", "None")
        });

    //incoming female
    chart2.selectAll("dot").data(data)
        .enter()
        .append("circle")
        .attr("r", 8)
        .attr("cx", function (d) { return x(d.year) })
        .attr("cy", function (d) { return y(d.inW); })
        .attr("class", "dotInW")
        .on("mouseover", function (d) {
            d3.select(this).transition().duration(100)
                .style("fill", "#34888c")
                .attr("r", 12);
            div.transition()
                .duration(200)
                .style("opacity", .8);
            div.html(d.year + '<br>' + " came " + '<br>' + d.inW + '<br>' + " female ")
                .style("left", x(d.year) + "px")
                .style("top", y(d.inW) + "px");
            svg_aline.transition().duration(10)
                .style("display", "block")
                .attr("x1", x(d.year))
                .attr("y1", y(d.inW))
                .attr("x2", x(d.year))
                .attr("y2", height)
        })
        .on("mouseout", function (d) {
            d3.select(this).transition().duration(100)
                .style("fill", "#34888c")
                .attr("r", 8);
            div.transition()
                .duration(500)
                .style("opacity", 0);
            svg_aline.style("display", "None")
        });

    //outgoing female
    chart2.selectAll("dot").data(data)
        .enter()
        .append("circle")
        .attr("r", 8)
        .attr("cx", function (d) { return x(d.year) })
        .attr("cy", function (d) { return y(d.outW); })
        .attr("class", "dotOutW")
        .on("mouseover", function (d) {
            d3.select(this).transition().duration(100)
                .style("fill", "#7caa2d")
                .attr("r", 12);
            div.transition()
                .duration(200)
                .style("opacity", .8);
            div.html(d.year + '<br>' + " left " + '<br>' + d.outW + '<br>' + " female ")
                .style("left", x(d.year) + "px")
                .style("top", y(d.outW) + "px");
            svg_aline.transition().duration(10)
                .style("display", "block")
                .attr("x1", x(d.year))
                .attr("y1", y(d.outW))
                .attr("x2", x(d.year))
                .attr("y2", height)
        })
        .on("mouseout", function (d) {
            d3.select(this).transition().duration(100)
                .style("fill", "#7caa2d")
                .attr("r", 8);
            div.transition()
                .duration(500)
                .style("opacity", 0);
            svg_aline.style("display", "None")
        });
});
