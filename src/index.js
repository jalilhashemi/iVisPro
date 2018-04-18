d3.csv("./data/resident-population-of-Zurich.csv", function (error, data) {
    // Wirtschaftliche Wohnbevölkerung der Stadt Zürich
    data.forEach(function (d) {
        d.year = +d.StichtagDatJahr;
        d.perceOfForeigner = +d.AuslAnt;
        console.log(d.year, d.perceOfForeigner);
    });

});


d3.csv("./data/influx.csv", function (error, data) {
    data.forEach(function (d) {
        d.yearInflux = +d.StichtagDatJahr;
        d.influxM = +d.aus_m;
        d.influxW = +d.aus_f;
        console.log(d.yearInflux, d.influxM, d.influxW);
    });
});

d3.csv("./data/outflux.csv", function (error, data) {
    data.forEach(function (d) {
        d.yearOutflux = +d.StichtagDatJahr;
        d.outfluxM = +d.aus_m;
        d.outfluxW = +d.aus_f;
        console.log(d.yearOutflux, d.outfluxM, d.outfluxW);
    });
});
