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
          width = +svg.attr("width"),
          height = +svg.attr("height"),
          radius = Math.min(width, height) / 2,
          g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
      var pie = d3.pie()
          .sort(null)
          .value(function(d) { return d.population; });
      var path = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(0);
      var label = d3.arc()
          .outerRadius(radius - 40)
          .innerRadius(radius - 40);
      d3.csv("data/resident-population-of-Zurich.csv", function(d) {
        d.population = +d.AuslAnt;
        d.year = +d.StichtagDatJahr;
        return d;
      }, function(error, data) {
        if (error) throw error;
        var arc = g.selectAll(".arc")
          .data(pie(data))
          .enter().append("g")
            .attr("class", "arc");
        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d) { return color(d.data.population); });
        arc.append("text")
            .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
            .attr("dy", "0.35em")
            .text(function(d) { return d.data.population; })
      });
