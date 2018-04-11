// Data for a stacked bar
var data = [
  { pigeons: 6, doves: 8, eagles: 15 },
  { pigeons: 9, doves: 15, eagles: 5 },
  { pigeons: 11, doves: 13, eagles: 14 },
  { pigeons: 15, doves: 4, eagles: 20 },
  { pigeons: 22, doves: 25, eagles: 23 }
];

var chart_width = 800;
var chart_height = 400;
var color = d3.scaleOrdinal(d3.schemeCategory10);

//stack layout
//identify the key values
var stack = d3.stack().keys(['pigeons', 'doves', 'eagles']);
//assign the data to the stack which rearranges the data for stack format
//each point has a start and end position
var stack_data = stack(data);

//scales
var x_scale = d3
  .scaleBand()
  .domain(d3.range(data.length))
  .range([0, chart_width])
  .paddingInner(0.05);
var y_scale = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(data, function(d) {
      return d.pigeons + d.doves + d.eagles;
    })
  ])
  .range([chart_height, 0]);

// Create SVG Element
var svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', chart_width)
  .attr('height', chart_height);

//add groups
var groups = svg
  .selectAll('g')
  .data(stack_data)
  .enter()
  .append('g')
  .style('fill', function(d, i) {
    return color(i);
  });

//loop thru array and draw the rectangles
//put all 5 arrays into the waiting room and add them after that
groups
  .selectAll('rect')
  .data(function(d) {
    return d;
  })
  .enter()
  .append('rect')
  .attr('x', function(d, i) {
    return x_scale(i);
  })
  .attr('y', function(d) {
    return y_scale(d[1]);
  })
  .attr('height', function(d) {
    // 0 -> 1 stacks can be reversed
    return y_scale(d[0]) - y_scale(d[1]);
  })
  .attr('width', x_scale.bandwidth());
