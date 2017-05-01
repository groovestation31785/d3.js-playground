var republicanReds = d3.scale.ordinal()
	.range(['#670101', '#8d0000', '#bf0000', '#e30101', '#ff0000']);

var democratBlues = d3.scale.ordinal()
	.range(['#3c78df', '#1d63db', '#155ad0', '#0c4dbd', '#10459f']);

var width = 800,
    height = 800,
    radius = Math.min(width - 40, height - 40) / 2;

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 200);

var pie = d3.layout.pie()
      .value(function(d) {
        return d.ev;
      });

var labelArc = d3.svg.arc()
    .outerRadius(radius + 20)
    .innerRadius(radius + 20);

var svg = d3.select("#pieContainer")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")");


d3.csv('data.csv', function(d) {
  return {
    state: d.State,
    ev: +d.ElectoralVotes,
    dem: +d.Dem,
    rep: +d.Rep
  }
}, function(data) {
    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
          .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function(data) {
        // first 'data' is the pie data, an object that has at where it should draw the angles for the circles
        // second 'data' accesses the data within the pie's data
        // then finding the data specific to that party
        if (data.data.dem >= data.data.rep) {
          return democratBlues(data.data.state);
        } else {
          return republicanReds(data.data.state);
        }
      });

      g.on('mouseover', function(data) {
         d3.select(this)
           .attr('opacity', '.8');
         d3.select('#pieInfo')
           .append('div')
           .classed('stateInfo', true)
           .html(	'<h1 class="stateName">'+data.data.state+'</h1>'+
               '<span>Electoral Votes: '+data.data.ev+'</span>')
         if (data.data.dem >= data.data.rep) {
           d3.select('.stateInfo')
             .append('h2')
             .text(data.data.dem+'% Democrat');
         } else{
           d3.select('.stateInfo')
             .append('h2')
             .text(data.data.rep+'% Republican');

         };
       });

      g.on('mouseout', function(data) {
         d3.select(this).attr('opacity', '1');
         d3.select('.stateInfo')
           .remove();
       });

      var map = new Datamap({
    		scope: 'usa',
    		element: document.getElementById('mapContainer'), //get our container for our map
    		responsive: true,
    		geographyConfig: {
    			highlightOnHover: false //get rid of highlight on hover
    		}
    	});
    	for (var i = data.length - 1; i >= 0; i--) {
    		//colors list
    		var heavyRepublican = '#B50009',
    			lightRepublican = '#D3818C',
    			heavyDemocrat = '#001460',
    			lightDemocrat = '#293C87';

    		//st is for state
    		var st = d3.select('.' + data[i].state);

    		//if the percent for the democratic candidate was higher than the republican candidate ...
    		if (data[i].dem >= data[i].rep) {
    			//... and the percent democrat was over 60%
    			if (data[i].dem >= 60) {
    				//... fill the state with heavyDemocrat
    				st.style('fill', heavyDemocrat);
    			} else {
    				st.style('fill', lightDemocrat);
    			}
    		} else{
    			if (data[i].rep >= 60) {
    				st.style('fill', heavyRepublican);
    			} else {
    				st.style('fill', lightRepublican);
    			}
    		}
    	}
    	//makes it responsive
    	d3.select(window).on('resize', function() {
            map.resize();
        });

    });
