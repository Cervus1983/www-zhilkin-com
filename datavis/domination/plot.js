var vs = {
	width: 1200,
	height: 1080,
	margin: { top: 20, right: 120, bottom: 80, left: 120 }
}

vs.svg = d3.select('body').append('svg')
	.attr({
		'width': vs.width,
		'height': vs.height
	}),

vs.dateLabel = d3.select('#date'),

vs.AliceLabel = vs.svg.append('text')
	.attr({
		'class': 'Alice axisLabel',
		'fill': 'firebrick',
		'text-anchor': 'end',
		'x': vs.margin.left,
		'dx': -40,
		'y': vs.height / 2
	})
	.text('Alice'),

vs.BobLabel = vs.svg.append('text')
	.attr({
		'class': 'Bob axisLabel',
		'fill': 'darkcyan',
		'text-anchor': 'start',
		'x': vs.width - vs.margin.right,
		'dx': 40,
		'y': vs.height / 2
	})
	.text('Bob'),

vs.plot = vs.svg.append('g')
	.attr('transform', 'translate(' + vs.margin.left + ',' + vs.margin.top + ')')


/* Load data & plot */
d3.tsv('data.tsv', function(data) {
	var maxDate = new Date(d3.max(data, function(d) { return d.dt })),
		minDate = new Date(d3.min(data, function(d) { return d.dt }))
	
	minDate.setTime(minDate.getTime() - 1000 * 3600 * 24)

	var format = d3.time.format('%Y-%m-%d'),
		showDate = new Date(format(minDate)),
		
		minLevel = d3.min(data, function(d) { return parseInt(d.level) }),
		maxLevel = d3.max(data, function(d) { return parseInt(d.level) }),

		barHeight = Math.floor((vs.height - vs.margin.top - vs.margin.bottom) / (maxLevel - minLevel + 1)),

		animation = false

	/* Controls */
	d3.select('#forward').style('visibility', 'visible')
	d3.select('#play').style('visibility', 'visible')

	function toggleAnimation() {
		if(animation) {
			animation = false
			d3.select('#play')
				.html('play')
		} else {
			animation = true
			d3.select('#play')
 				.html('pause')
			updatePlot(data)
		}
	}

	d3.select('#rewind')
		.on('click', function()
			{
				if(animation) { toggleAnimation() }
				showDate.setTime(minDate.getTime())
				d3.select('#back').style('visibility', 'hidden')
				d3.select('#forward').style('visibility', 'visible')
				d3.select('#play').style('visibility', 'visible')
				updatePlot(data)
			})

	d3.select('#back')
		.on('click', function()
			{
				if(animation) { toggleAnimation() }
				showDate.setDate(showDate.getDate() - 1)
				if(format(showDate) === format(minDate)) { d3.select('#back').style('visibility', 'hidden') }
				d3.select('#forward').style('visibility', 'visible')
				d3.select('#play').style('visibility', 'visible')
				updatePlot(data)
			})

	d3.select('#forward')
		.on('click', function()
			{
				if(animation) { toggleAnimation() }
				showDate.setDate(showDate.getDate() + 1)
				if(format(showDate) === format(maxDate)) {
					d3.select('#forward').style('visibility', 'hidden')
					d3.select('#play').style('visibility', 'hidden')
				}
				d3.select('#rewind').style('visibility', 'visible')
				d3.select('#back').style('visibility', 'visible')
				updatePlot(data)		
			})

	d3.select('#play')
		.on('click', function() { toggleAnimation() })

	/* Axes */
	vs.AliceAxis = vs.svg.append('line')
		.attr({
			'stroke': 'black',
			'stroke-width': 1,
			'x1': vs.margin.left - 2,
			'y1': vs.margin.top,
			'x2': vs.margin.left - 2,
			'y2': vs.margin.top + barHeight * (maxLevel - minLevel + 1) - 1
		})

	vs.BobAxis = vs.svg.append('line')
	.attr({
		'stroke': 'black',
		'stroke-width': 1,
		'x1': vs.width - vs.margin.left + 1,
		'y1': vs.margin.top,
		'x2': vs.width - vs.margin.left + 1,
		'y2': vs.margin.top + barHeight * (maxLevel - minLevel + 1) - 1
	})

	/* Finally, the plot */
	updatePlot = function(data) {
		var group = vs.plot.selectAll('g').data(data.filter(function(d) { return d.dt === format(showDate) }))

		var groupEnter = group.enter().append('g')
			.on('mouseover', function() {
				d3.select(this).selectAll('.score').style('visibility', 'visible')
			})
			.on('mouseout', function() {
				d3.select(this).selectAll('.score').style('visibility', 'hidden')
			})

		/* Add */
		groupEnter.append('rect')
			.attr({
				'class': 'Alice',
				'fill': 'firebrick',
				'opacity': 0.25,
				'x': 0,
				'y': function(d) { return barHeight * (d.level - 1) },
				'width': 0,
				'height': barHeight - 1
			})

		groupEnter.append('text')
			.attr({
				'class': 'Alice lvlOrd',
				'fill': 'firebrick',
				'opacity': 0,
				'text-anchor': 'end',
				'x': 0,
				'dx': -6,
				'y': function(d) { return barHeight * (d.level - 1) },
				'dy': Math.floor(barHeight / 2) + 5
			})
			.text(function(d) { return d.level })

		groupEnter.append('text')
			.attr({
				'class': 'Alice score',
				'fill': 'firebrick',
				'text-anchor': 'middle',
				'y': function(d) { return barHeight * (d.level - 1) },
				'dy': Math.floor(barHeight / 2) + 5
			})
			.style('visibility', 'hidden')

		groupEnter.append('rect')
			.attr({
				'class': 'Bob',
				'fill': 'darkcyan',
				'opacity': 0.25,
				'x': vs.width - vs.margin.left - vs.margin.right,
				'y': function(d) { return barHeight * (d.level - 1) },
				'width': 0,
				'height': barHeight - 1
			})

		groupEnter.append('text')
			.attr({
				'class': 'Bob lvlOrd',
				'fill': 'darkcyan',
				'opacity': 0,
				'text-anchor': 'start',
				'x': vs.width - vs.margin.left - vs.margin.right,
				'dx': 6,
				'y': function(d) { return barHeight * (d.level - 1) },
				'dy': Math.floor(barHeight / 2) + 5
			})
			.text(function(d) { return d.level })

		groupEnter.append('text')
			.attr({
				'class': 'Bob score',
				'fill': 'darkcyan',
				'text-anchor': 'middle',
				'y': function(d) { return barHeight * (d.level - 1) },
				'dy': Math.floor(barHeight / 2) + 5
			})
			.style('visibility', 'hidden')

		/* Update */
		group.select('.Alice')
			.transition()
			.attr({
				'opacity': function(d) { if(parseInt(d.Alice) > parseInt(d.Bob)) { return 0.5 } else { return 0.25 } },
				'width': function(d) { if(parseInt(d.Bob) > 0) { return (vs.width - vs.margin.left - vs.margin.right) * parseInt(d.Alice) / (parseInt(d.Alice) + parseInt(d.Bob)) } else { if(parseInt(d.Alice) > 0) { return (vs.width - vs.margin.left - vs.margin.right) / 2 } else { return 0 } } }
			})

		group.select('.Alice.lvlOrd')
			.transition()
			.attr({
				'opacity': function(d) { if(parseInt(d.Alice) > 0) { return 1 } else { return 0 } }
			})

		group.select('.Alice.score')
			.attr({
				'x': function(d) { if(parseInt(d.Bob) > 0) { return (vs.width - vs.margin.left - vs.margin.right) * parseInt(d.Alice) / (parseInt(d.Alice) + parseInt(d.Bob)) / 2 } else { if(parseInt(d.Alice) > 0) { return (vs.width - vs.margin.left - vs.margin.right) / 4 } else { return 0 } } },
				'opacity': function(d) { if(parseInt(d.Alice) > 0) { return 1 } else { return 0 } }
			})
			.text(function(d) { return parseInt(d.Alice).toLocaleString() })

		group.select('.Bob')
			.transition()
			.attr({
				'opacity': function(d) { if(parseInt(d.Alice) <= parseInt(d.Bob)) { return 0.5 } else { return 0.25 } },
				'x': function(d) { if(parseInt(d.Alice) > 0) { return (vs.width - vs.margin.left - vs.margin.right) * parseInt(d.Alice) / (parseInt(d.Alice) + parseInt(d.Bob)) } else { if(parseInt(d.Bob) > 0) { return (vs.width - vs.margin.left - vs.margin.right) / 2 } else { return vs.width - vs.margin.left - vs.margin.right } } },
				'width': function(d) { if(parseInt(d.Alice) > 0) { return (vs.width - vs.margin.left - vs.margin.right) * parseInt(d.Bob) / (parseInt(d.Alice) + parseInt(d.Bob)) } else { if(parseInt(d.Bob) > 0) { return (vs.width - vs.margin.left - vs.margin.right) / 2 } else { return 0 } } }
			})

		group.select('.Bob.lvlOrd')
			.transition()
			.attr({
				'opacity': function(d) { if(parseInt(d.Bob) > 0) { return 1 } else { return 0 } }
			})

		group.select('.Bob.score')
			.attr({
				'x': function(d) { if(parseInt(d.Alice) > 0) { return (vs.width - vs.margin.left - vs.margin.right) * (parseInt(d.Alice) + parseInt(d.Bob) / 2) / (parseInt(d.Alice) + parseInt(d.Bob)) } else { if(parseInt(d.Bob) > 0) { return (vs.width - vs.margin.left - vs.margin.right) / 4 *3 } else { return 0 } } },
				'opacity': function(d) { if(parseInt(d.Bob) > 0) { return 1 } else { return 0 } }
			})
			.text(function(d) { return parseInt(d.Bob).toLocaleString() })

		/* Remove */
		group.exit().remove()

		/* Date label */
		vs.dateLabel
			.html(format(showDate))
			.transition()
			.each('end', function() {
				if(animation) {
					showDate.setDate(showDate.getDate() + 1)
					if(format(showDate) === format(maxDate)) {
						toggleAnimation()
						d3.select('#forward').style('visibility', 'hidden')
						d3.select('#play').style('visibility', 'hidden')
					}
					d3.select('#rewind').style('visibility', 'visible')
					d3.select('#back').style('visibility', 'visible')
					updatePlot(data)
				}
			})
	}

	/* Start animation */
	toggleAnimation()
})