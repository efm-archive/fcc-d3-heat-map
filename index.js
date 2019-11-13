// Margin Convention as per https://bl.ocks.org/mbostock/3019563

const margin = { top: 50, right: 50, bottom: 150, left: 80 };

const width = 1200 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const bodySvg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

bodySvg
  .append("text")
  .attr("id", "title")
  .attr("x", width / 2)
  .attr("y", -36)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .style("font-family", "sans-serif")
  .text("FCC D3 Data Visualization Projects - Visualize Data with a Heat Map");

const scaleX = d3.scaleBand().range([0, width]);
const scaleY = d3.scaleBand().range([0, height]);

const colorScale = d3.scaleLinear().range(["blue", "crimson"]);
// .domain([1, 9]);

const tooltipDiv = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

const tooltipDivFlex = d3
  .select("#tooltip")
  .append("div")
  .attr("id", "tooltipFlex");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then(json => {
    // console.log('json :', json);
    const data = json.monthlyVariance;
    const base = json.baseTemperature;

    const minMax = {
      months: {},
      years: {},
      vRange: { min: 0, max: 0 }
    };
    data.forEach(item => {
      if (!minMax.hasOwnProperty(item.year)) {
        minMax.years[item.year] = 1;
      }
      if (!minMax.hasOwnProperty(item.month)) {
        minMax.months[item.month] = 1;
      }
      if (minMax.vRange.min >= item.variance) {
        minMax.vRange.min = item.variance;
      }
      if (minMax.vRange.max <= item.variance) {
        minMax.vRange.max = item.variance;
      }
    });
    console.log("minMax :", minMax);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const monthsArray = [];

    for (const month in minMax.months) {
      monthsArray.push(parseInt(month - 1));
    }

    const yearsArray = [];
    for (const year in minMax.years) {
      yearsArray.push(parseInt(year));
    }

    scaleX.domain(yearsArray);
    scaleY.domain(monthsArray);
    colorScale.domain();
    const axisX = d3
      .axisBottom(scaleX)
      .tickValues(scaleX.domain().filter(year => year % 10 === 0));

    const axisY = d3
      .axisLeft(scaleY)
      .tickValues(scaleY.domain())
      .tickFormat(month => monthNames[month]);
    const colorRange =
      Math.abs(minMax.vRange.min) + Math.abs(minMax.vRange.max);
    const axisColorScale = d3
      .axisLeft(colorScale)
      .tickValues(colorScale.domain([0, colorRange]));
    console.log("colorRange :", colorRange);
    // .tickFormat(month => monthNames[month]);

    bodySvg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(axisX);

    bodySvg
      .append("g")
      .attr("id", "y-axis")
      .call(axisY);

    bodySvg
      .append("g")
      .attr("id", "colorScale")
      .attr("transform", "translate(0," + parseInt(height + 50) + ")")
      .call(colorScale);

    bodySvg
      .append("text")
      .attr("id", "description")
      .attr("x", width / 2)
      .attr("y", -16)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .text("Global Land-Surface Temperature (1753 - 2015)");

    const rect = d3
      .select("svg")
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("fill", d => {
        return colorScale(base + d.variance);
      })
      .attr("data-month", d => {
        return d.month - 1;
      })
      .attr("data-year", d => {
        return d.year;
      })
      .attr("data-temp", d => {
        return base + d.variance;
      })
      .attr("x", d => {
        return scaleX(d.year) + margin.left;
      })
      .attr("y", d => {
        return scaleY(d.month - 1) + margin.top;
      })
      .attr("width", scaleX.bandwidth())
      .attr("height", scaleY.bandwidth())
      .on("mouseover", d => {
        tooltipDiv
          .style("left", d3.event.pageX + 10 + "px")
          .style("top", d3.event.pageY + 10 + "px")
          .attr("data-year", d.year);

        tooltipDivFlex
          .style("font-size", "14px")
          .style("font-family", "sans-serif")
          .html(
            "Month: " +
              d.month +
              "<br/>Year: " +
              d.year +
              "<br/>Temp: " +
              parseFloat(base + d.variance).toFixed(2) +
              "°C"
          );

        tooltipDiv
          .transition()
          .duration(50)
          .style("opacity", 0.8);
      })
      .on("mouseout", d => {
        tooltipDiv
          .transition()
          .duration(600)
          .style("opacity", 0);
      });

    const rangeArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const boxSize = {
      width: 16,
      height: 16
    };
    const legend = bodySvg
      .append("g")
      .attr("id", "legend")
      .attr("transform", "translate(0," + parseInt(height + 30) + ")");

    const legendRect = legend
      .selectAll("rect")
      .data(rangeArr)
      .enter()
      .append("rect")
      .attr("class", "legendRect")
      .attr("fill", d => colorScale(d))
      .attr("x", d => {
        return d * 16 - 16;
      })
      .attr("width", boxSize.width - 1)
      .attr("height", boxSize.height);

    legend
      .append("text")
      .attr("id", "legendDescriptionMin")
      .data(rangeArr)
      .attr("x", 0)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .text(parseFloat(base + minMax.vRange.min).toFixed(1) + "°C");
    legend
      .append("text")
      .attr("id", "legendDescriptionMax")
      .data(rangeArr)
      .attr("x", rangeArr.length * boxSize.width)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .text(parseFloat(base + minMax.vRange.max).toFixed(1) + "°C");
  })
  .catch(err => {
    console.error(err);
  });
