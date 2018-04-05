(function() {
	var margin = {top: 250, left: 150, right: 100, bottom: 120},
		height = 100, //-margin.top - margin.bottom,
		width = 1200-margin.left - margin.right;

	var svg = d3.select("#map")
			.append("svg")
			.attr("height", height )
			.attr("width", width + margin.left + margin.right)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

	/* read in world.topojson
	read in projects */

	d3.queue()
		.defer(d3.json, "./images/map/ne_50m_admin_0_countries_merged.topojson")
		.defer(d3.csv, "./images/map/projects.csv")
		.await(ready)

	/*  create a new projection using Mercator (geoMercator)
		and center it (translate)
 		and oom in a certain amount (scale) */

 		var projection = d3.geoMercator()
 			.translate([width/2, height/2]) // makes this center
 			.scale(142)

	/*  create a path a path (geoPath) using the projection */
		var path = d3.geoPath()
			.projection(projection)


function ready (error, data, projects) {

		//console.log(data)

		/*

		topojson.features converts our RAW geo data into USEABLE geo data
		always pass it data, then data.objects.___something___
		then get .features out of it
		  */




		  var tooltip = d3.select('body').append('div')
            .attr('class', 'hidden tooltip');
		  var countries = topojson.feature(data, data.objects.countries).features
		  //console.log(countries)

		//  var maptext = d3.select('body').append('div')
        //    .attr('class', 'map')
	 	//	.html("Projects I Made");


		  /* Add a path for each country  */
		  svg.selectAll(".country")
		  	.data(countries)
		  	.enter().append("path")
		  	.attr("class", "country")
		  	.attr("d", path)
		 // 	.attr("fill", "#cccccc") // this is moved at the html style section

		  /*Add the cities   */


		  svg.selectAll(".city-circle")
		  	.data(projects)
		  	//.console.log(projects)
		  	.enter().append("circle")
		  	.attr("r", 6)
		  	.attr("cx", function(d) {
		  		var coords = projection([d.long, d.lat])
		  		return coords[0];
		  	})
		  	 .attr("cy", function(d) {
		  		var coords = projection([d.long, d.lat])
		  		return coords[1];
		  	})

		  svg.selectAll(".project-label")
		  	.data(projects)
		  	.enter().append("text")
		  	.attr("class", "project-label")
		  	.attr("x", function(d) {
		  		var coords = projection([d.long, d.lat])
		  		return coords[0];
		  	})
		  	 .attr("y", function(d) {
		  		var coords = projection([d.long, d.lat])
		  		return coords[1];
		  	})
		  	 .text(function(d) {
		  	 	return d.NumberofProject
		  	 })
			.on('mouseover', function(d) {
                    var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
                    tooltip.classed('hidden', false)
                        .attr('style', 'position: absolute; left:25%; bottom: 100px;')
                        .html("Project: <a href='"+d.Link+"' class='post-tag' target='_blank' style='color:white'>"
                        	 + d.Project +"</a>  |  " + d.OrgType + ": " + d.Publisher +"  |  Role: "+ d.Role
	                        	);
                })





}




 })();