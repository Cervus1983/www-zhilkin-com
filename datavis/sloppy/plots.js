var sloppy = {
	// Example data
	onlineCourse: [
		{ started: 100, finished: 95 },
		{ started: 90, finished: 87 },
		{ started: 85, finished: 81 },
		{ started: 80, finished: 65 },
		{ started: 65, finished: 63 },
		{ started: 62, finished: 58 },
		{ started: 57, finished: 55 },
		{ started: 55, finished: 54 },
		{ started: 54, finished: 51 },
		{ started: 50, finished: 50 }
	],
	
	// Plot dimensions
	width: 480,
	height: 240,
	margin: 20,
	barWidth: 36
}


// Scales
sloppy.xScale = d3.scale.linear()
	.domain([0, sloppy.onlineCourse.length])
	.range([0, sloppy.width])

sloppy.yScale = d3.scale.linear()
	.domain([0, d3.max(sloppy.onlineCourse, function(d) { return d.started })])
	.range([sloppy.height, 0])


// Figure 1
sloppy.fig1 = d3.select('#fig1').selectAll('g')
	.data(sloppy.onlineCourse)
	.enter()
	.append('g')
		.attr({
			'ordinal': function(d, i) { return i + 1 },
			'started': function(d) { return d.started }
		})
		.on('mouseover', function() {
			d3.select(this).select('rect').attr('opacity', 0.5)
			d3.select(this).selectAll('text').style('visibility', 'visible')
			d3.select('#fig1_caption').text(d3.select(this).attr('started') + ' students started watching lecture #' + d3.select(this).attr('ordinal') + '.')
		})
		.on('mouseout', function() {
			d3.select(this).select('rect').attr('opacity', 0.2)
			d3.select(this).selectAll('text').style('visibility', 'hidden')
			d3.select('#fig1_caption').text('')
		})

sloppy.fig1.append('rect')
	.attr({
		'x': function(d, i) { return sloppy.xScale(i) },
		'y': function(d) { return sloppy.yScale(d.started) },
		'width': sloppy.barWidth,
		'height': function(d) { return sloppy.height - sloppy.yScale(d.started) },
		'fill': 'black',
		'opacity': 0.2
	})

sloppy.fig1.append('text')
	.attr({
		'class': 'label started',
		'text-anchor': 'middle',
		'x': function(d, i) { return sloppy.xScale(i) + sloppy.barWidth / 2 },
		'y': function(d) { return sloppy.yScale(d.started) - sloppy.margin / 4 }
	})
	.style('visibility', 'hidden')
	.text(function(d) { return d.started })

sloppy.fig1.append('text')
	.attr({
		'class': 'label ordinal',
		'text-anchor': 'middle',
		'x': function(d, i) { return sloppy.xScale(i) + sloppy.barWidth / 2 },
		'y': function(d) { return sloppy.yScale(0) + sloppy.margin / 1.67 }
	})
	.style('visibility', 'hidden')
	.text(function(d, i) { return i + 1 })


// Figure 2
sloppy.fig2 = d3.select('#fig2').selectAll('g')
	.data(sloppy.onlineCourse)
	.enter()
	.append('g')
		.attr({
			'ordinal': function(d, i) { return i + 1 },
			'started': function(d) { return d.started },
			'finished': function(d) { return d.finished }
		})
		.on('mouseover', function() {
			d3.select(this).selectAll('rect').attr('opacity', 0.5)
			d3.select(this).selectAll('text').style('visibility', 'visible')
			d3.select('#fig2_caption').text(d3.select(this).attr('started') + ' students started watching lecture #' + d3.select(this).attr('ordinal') + ' and ' + d3.select(this).attr('finished') + ' finished.')
		})
		.on('mouseout', function() {
			d3.select(this).selectAll('rect').attr('opacity', 0.2)
			d3.select(this).selectAll('text').style('visibility', 'hidden')
			d3.select('#fig2_caption').text('')
		})

sloppy.fig2.append('rect')
	.attr({
		'x': function(d, i) { return sloppy.xScale(i) },
		'y': function(d) { return sloppy.yScale(d.started) },
		'width': sloppy.barWidth / 2,
		'height': function(d) { return sloppy.height - sloppy.yScale(d.started) },
		'fill': 'black',
		'opacity': 0.2
	})

sloppy.fig2.append('rect')
	.attr({
		'x': function(d, i) { return sloppy.xScale(i) + sloppy.barWidth / 2 },
		'y': function(d) { return sloppy.yScale(d.finished) },
		'width': sloppy.barWidth / 2,
		'height': function(d) { return sloppy.height - sloppy.yScale(d.finished) },
		'fill': 'firebrick',
		'opacity': 0.2
	})

sloppy.fig2.append('text')
	.attr({
		'class': 'label',
		'text-anchor': 'middle',
		'x': function(d, i) { return sloppy.xScale(i) + sloppy.barWidth / 4 },
		'y': function(d) { return sloppy.yScale(d.started) - sloppy.margin / 4 }
	})
	.style('visibility', 'hidden')
	.text(function(d) { return d.started })

sloppy.fig2.append('text')
	.attr({
		'class': 'label',
		'text-anchor': 'middle',
		'x': function(d, i) { return sloppy.xScale(i) + sloppy.barWidth * 3 / 4 },
		'y': function(d) { return sloppy.yScale(d.finished) - sloppy.margin / 4 }
	})
	.style('visibility', 'hidden')
	.text(function(d) { return d.finished })

sloppy.fig2.append('text')
	.attr({
		'class': 'label',
		'text-anchor': 'middle',
		'x': function(d, i) { return sloppy.xScale(i) + sloppy.barWidth / 2 },
		'y': function(d) { return sloppy.yScale(0) + sloppy.margin / 1.67 }
	})
	.style('visibility', 'hidden')
	.text(function(d, i) { return i + 1 })


// Figure 3
sloppy.fig3 = d3.select('#fig3').selectAll('g').data(sloppy.onlineCourse)

sloppy.fig3_enter = sloppy.fig3.enter().append('g')
	.attr({
		'ordinal': function(d, i) { return i + 1 },
		'started': function(d) { return d.started },
		'finished': function(d) { return d.finished }
	})
	.on('mouseover', function() {
		d3.select(this).selectAll('polygon').attr('opacity', 0.5)
		d3.select(this).selectAll('text').style('visibility', 'visible')
		d3.select('#fig3_caption').text(d3.select(this).attr('started') + ' students started watching lecture #' + d3.select(this).attr('ordinal') + ' and ' + d3.select(this).attr('finished') + ' finished.')
	})
	.on('mouseout', function() {
		d3.select(this).selectAll('polygon').attr('opacity', 0.2)
		d3.select(this).selectAll('text').style('visibility', 'hidden')
		d3.select('#fig3_caption').text('')
	})

sloppy.fig3_enter.append('polygon')
	.attr({
		'class': 'started',
		'fill': 'black',
		'opacity': 0.2
	})

sloppy.fig3_enter.append('polygon')
	.attr({
		'class': 'finished',
		'fill': 'firebrick',
		'opacity': 0.2
	})

sloppy.fig3_enter.append('text')
	.attr({
		'class': 'label',
		'text-anchor': 'middle',
		'x': function(d, i) { return sloppy.xScale(i) + sloppy.barWidth / 4 },
		'y': function(d) { return sloppy.yScale(d.started) - sloppy.margin / 4 }
	})
	.style('visibility', 'hidden')
	.text(function(d) { return d.started })

sloppy.fig3_enter.append('text')
	.attr({
		'class': 'label',
		'text-anchor': 'middle',
		'x': function(d, i) { return sloppy.xScale(i) + sloppy.barWidth * 3 / 4 },
		'y': function(d) { return sloppy.yScale(d.finished) - sloppy.margin / 4 }
	})
	.style('visibility', 'hidden')
	.text(function(d) { return d.finished })

sloppy.fig3_enter.append('text')
	.attr({
		'class': 'label',
		'text-anchor': 'middle',
		'x': function(d, i) { return sloppy.xScale(i) + sloppy.barWidth / 2 },
		'y': function(d) { return sloppy.yScale(0) + sloppy.margin / 1.67 }
	})
	.style('visibility', 'hidden')
	.text(function(d, i) { return i + 1 })

sloppy.updateFig3 = function() {
	sloppy.fig3_isSloppy = !sloppy.fig3_isSloppy

	sloppy.fig3.data(sloppy.onlineCourse)

	sloppy.fig3.select('.started')
		.transition()
		.duration(1000)
		.attr('points', function(d, i) {
			sloppy.x1 = sloppy.xScale(i)
			sloppy.x2 = sloppy.xScale(i) + sloppy.barWidth / 2
			if(sloppy.fig3_isSloppy) {
				return '' + sloppy.x1 + ',' + sloppy.yScale(0) + ' ' + sloppy.x1 + ',' + sloppy.yScale(d.started) + ' ' + sloppy.x2 + ',' + sloppy.yScale((d.started + d.finished) / 2) + ' ' + sloppy.x2 + ',' + sloppy.yScale(0)
			} else {
				return '' + sloppy.x1 + ',' + sloppy.yScale(0) + ' ' + sloppy.x1 + ',' + sloppy.yScale(d.started) + ' ' + sloppy.x2 + ',' + sloppy.yScale(d.started) + ' ' + sloppy.x2 + ',' + sloppy.yScale(0) }
			})

	sloppy.fig3.select('.finished')
		.transition()
		.duration(1000)
		.attr({
			'points': function(d, i) {
				sloppy.x1 = sloppy.xScale(i) + sloppy.barWidth / 2
				sloppy.x2 = sloppy.xScale(i) + sloppy.barWidth
				if(sloppy.fig3_isSloppy) {
					return '' + sloppy.x1 + ',' + sloppy.yScale(0) + ' ' + sloppy.x1 + ',' + sloppy.yScale((d.started + d.finished) / 2) + ' ' + sloppy.x2 + ',' + sloppy.yScale(d.finished) + ' ' + sloppy.x2 + ',' + sloppy.yScale(0)
				} else {
					return '' + sloppy.x1 + ',' + sloppy.yScale(0) + ' ' + sloppy.x1 + ',' + sloppy.yScale(d.finished) + ' ' + sloppy.x2 + ',' + sloppy.yScale(d.finished) + ' ' + sloppy.x2 + ',' + sloppy.yScale(0) }
			},
			'fill': function() { if(sloppy.fig3_isSloppy) { return 'black' } else { return 'firebrick' } }
		})

	return true }

sloppy.fig3_isSloppy = true
sloppy.updateFig3()

setInterval(function() { sloppy.updateFig3() }, 3000)


// Figure 4
d3.select('#fig4').append('line')
	.attr({
		'class': 'crisp',
		'stroke': 'red',
		'x1': 0,
		'y1': 0,
		'x2': 0,
		'y2': sloppy.yScale(sloppy.onlineCourse[sloppy.onlineCourse.length - 1].finished)
	})

sloppy.fig4 = d3.select('#fig4').selectAll('g')
	.data(sloppy.onlineCourse)
	.enter()
	.append('g')
		.attr({
			'ordinal': function(d, i) { return i + 1 },
			'started': function(d) { return d.started },
			'finished': function(d) { return d.finished }
		})
		.on('mouseover', function() {
			d3.select(this).select('polygon').attr('opacity', 0.2)
			d3.select(this).selectAll('text').style('visibility', 'visible')
			d3.select('#fig4_caption').text(d3.select(this).attr('started') + ' students started watching lecture #' + d3.select(this).attr('ordinal') + ' and ' + d3.select(this).attr('finished') + ' finished.')
		})
		.on('mouseout', function() {
			d3.select(this).select('polygon').attr('opacity', 0)
			d3.select(this).selectAll('text').style('visibility', 'hidden')
			d3.select('#fig4_caption').text('')
		})

sloppy.fig4.append('polygon')
	.attr({
		'fill': 'black',
		'opacity': 0,
		'points': function(d, i) { return ''
			+ sloppy.xScale(i) + ',' + sloppy.yScale(0) + ' '
			+ sloppy.xScale(i) + ',' + sloppy.yScale(d.started) + ' '
			+ sloppy.xScale(i + 1) + ',' + sloppy.yScale(d.finished) + ' '
			+ sloppy.xScale(i + 1) + ',' + sloppy.yScale(0) }
	})

sloppy.fig4.append('line')
	.attr({
		'stroke': 'black',
		'x1': function(d, i) { return sloppy.xScale(i) },
		'y1': function(d) { return sloppy.yScale(d.started) },
		'x2': function(d, i) { return sloppy.xScale(i + 1) },
		'y2': function(d) { return sloppy.yScale(d.finished) }
	})

sloppy.fig4.append('line')
	.attr({
		'class': 'crisp',
		'stroke': 'lightgrey',
		'x1': function(d, i) { return sloppy.xScale(i) },
		'y1': function() { return sloppy.yScale(0) },
		'x2': function(d, i) { return sloppy.xScale(i + 1) },
		'y2': function() { return sloppy.yScale(0) }
	})

sloppy.fig4.append('line')
	.attr({
		'class': 'crisp',
		'stroke': 'white',
		'x1': function() { return sloppy.xScale(0) },
		'y1': function(d) { return sloppy.yScale(d.started) },
		'x2': function() { return sloppy.xScale(0) },
		'y2': function(d) { return sloppy.yScale(d.finished) }
	})

sloppy.fig4.append('text')
	.attr({
		'class': 'label',
		'text-anchor': 'end',
		'x': function(d, i) { return sloppy.xScale(i) - sloppy.margin / 4 },
		'y': function(d) { return sloppy.yScale(d.started / 2) }
	})
	.style('visibility', 'hidden')
	.text(function(d) { return d.started })

sloppy.fig4.append('text')
	.attr({
		'class': 'label',
		'text-anchor': 'start',
		'x': function(d, i) { return sloppy.xScale(i + 1) + sloppy.margin / 4 },
		'y': function(d) { return sloppy.yScale(d.finished / 2) }
	})
	.style('visibility', 'hidden')
	.text(function(d) { return d.finished })

sloppy.fig4.append('text')
	.attr({
		'class': 'label',
		'text-anchor': 'middle',
		'x': function(d, i) { return sloppy.xScale(i + 0.5) },
		'y': function(d) { return sloppy.yScale(0) + sloppy.margin / 1.67 }
	})
	.style('visibility', 'hidden')
	.text(function(d, i) { return i + 1 })