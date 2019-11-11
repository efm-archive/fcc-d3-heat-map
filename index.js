// Margin Convention as per https://bl.ocks.org/mbostock/3019563

const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const bodySvg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

bodySvg
  .append('text')
  .attr('id', 'title')
  .attr('x', width / 2)
  .attr('y', -20)
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .style('font-family', 'sans-serif')
  .text('FCC D3 Data Visualization Projects - Visualize Data with a Heat Map');

const scaleX = d3.scaleBand().range([0, width]);
const scaleY = d3.scaleBand().range([0, height]);

const axisX = d3.axisBottom(scaleX);
const axisY = d3.axisLeft(scaleY);

const description = d3
  .select('body')
  .append('div')
  .attr('id', 'description');

const tooltipDiv = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

const tooltipDivFlex = d3
  .select('#tooltip')
  .append('div')
  .attr('id', 'tooltipFlex');

const legendDiv = d3
  .select('body')
  .append('div')
  .attr('id', 'legend');

d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
)
  .then(json => {
    // console.log('json :', json);
    const data = json.monthlyVariance;
    // debugger;

    const yearsArray = [];
    data.forEach(({ year }) => {
      // console.log('yearsArray :', yearsArray);
      // console.log('item.month :', month);
      // console.log('monthsArray.indexOf:', monthsArray.includes(month));
      if (yearsArray.includes(year)) {
        return null;
      }
      yearsArray.push(year);
    });
    console.log('yearsArray :', yearsArray);
    scaleX.domain(yearsArray);

    const monthsArray = [];
    data.forEach(({ month }) => {
      // console.log('monthsArray :', monthsArray);
      // console.log('item.month :', month);
      // console.log('monthsArray.indexOf:', monthsArray.includes(month));
      if (monthsArray.includes(month)) {
        return null;
      }
      monthsArray.push(month);
    });
    console.log('monthsArray :', monthsArray);
    scaleY.domain(monthsArray);
    // scaleY.domain([new Date(1970, 0, 1), new Date(1970, 11, 31)]);

    bodySvg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(axisX);

    bodySvg
      .append('g')
      .attr('id', 'y-axis')
      .call(axisY);
    // console.log('data :', data);
    const rect = d3
      .select('svg')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('fill', d => {
        return 'red';
      })
      .attr('x', d => {
        return scaleX(d.year) + margin.left;
      })
      .attr('y', (d, i) => {
        return scaleY(d.month) + margin.top;
      })
      .attr('width', scaleX.bandwidth())
      .attr('height', scaleY.bandwidth());
  })
  .catch(err => {
    console.error(err);
  });
