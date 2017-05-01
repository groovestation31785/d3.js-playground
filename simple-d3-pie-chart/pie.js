// margin and radius
var margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width / 2;

var color = d3.scaleOrdinal()
    .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

// arc generator
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

// centers the label names in the sections of the pie
var labelArc = d3.arc()
    .outerRadius(radius - 50)
    .innerRadius(radius - 50);

// pie generator
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.count; });

// define svg
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + radius + "," + height/2 + ")");


// import data
d3.csv("data.csv", function(error, data) {
    if (error) throw error;

    // parse the data
    data.forEach(function(d) {
      // the csv file returns a string when d.count is called
      // the plus converts a string to an integer "23" -> 23
      d.count = +d.count;
      d.fruit = d.fruit;
    });

    // append g elements (arc)
    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    // append the path of the arc
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
          return color(d.data.fruit);
        }).transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attrTween("d", pieTween);

    // append the text (labels)
    g.append("text")
      .transition()
      .ease(d3.easeLinear)
      .duration(2000)
      .attr("transform", function(d) {
        return "translate(" + labelArc.centroid(d) + ")";
      }).attr("dy", ".35em")
      .text(function(d) {
        return d.data.fruit;
      });

});

function pieTween(b) {
  b.innerRadius = 0;
  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
  return function(t) {
    return arc(i(t));
  }
}
