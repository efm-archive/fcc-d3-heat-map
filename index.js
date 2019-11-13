// Margin Convention as per https://bl.ocks.org/mbostock/3019563

const margin = { top: 50, right: 50, bottom: 50, left: 80 };

const width = 1200 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

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

const colorScale = d3
  .scaleLinear()
  .range(["blue", "crimson"])
  .domain([1, 10]);

const description = d3
  .select("body")
  .append("div")
  .attr("id", "description");

const tooltipDiv = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

const tooltipDivFlex = d3
  .select("#tooltip")
  .append("div")
  .attr("id", "tooltipFlex");

const legendDiv = d3
  .select("body")
  .append("div")
  .attr("id", "legend");

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then(json => {
    // console.log('json :', json);
    const data = json.monthlyVariance;
    const base = json.baseTemperature;
    // debugger;
    const minMax = {
      months: {},
      years: {}
    };
    data.forEach(item => {
      // console.log('item :', item);
      if (!minMax.hasOwnProperty(item.year)) {
        minMax.years[item.year] = 1;
      }
      if (!minMax.hasOwnProperty(item.month)) {
        minMax.months[item.month] = 1;
      }
      return;
    });

    const monthsArrayManual = [
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

    console.log("minMax :", minMax);
    // data.forEach(({ year }) => {
    //   if (yearsArray.includes(year)) {
    //     return null;
    //   }
    //   yearsArray.push(year);
    // });
    console.log("yearsArray :", yearsArray);
    scaleX.domain(yearsArray);

    // data.forEach(({ month }) => {
    //   if (monthsArray.includes(month)) {
    //     return null;
    //   }
    //   monthsArray.push(month);
    // });
    console.log("monthsArray :", monthsArray);
    scaleY.domain(monthsArray);

    const axisX = d3
      .axisBottom(scaleX)
      .tickValues(scaleX.domain().filter(year => year % 10 === 0));

    const axisY = d3
      .axisLeft(scaleY)
      .tickValues(scaleY.domain())
      .tickFormat(month => monthsArrayManual[month]);

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
      .append("text")
      .attr("id", "description")
      .attr("x", width / 2)
      .attr("y", -12)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .text("Global Land-Surface Temperature (1753 - 2015)");

    const rect = d3
      .select("svg")
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
      .attr("data-year", (d, i) => {
        return d.year;
      })
      .attr("data-temp", d => {
        return base + d.variance;
      })
      .attr("x", d => {
        return scaleX(d.year) + margin.left;
      })
      .attr("y", (d, i) => {
        return scaleY(d.month - 1) + margin.top;
      })
      .attr("width", scaleX.bandwidth())
      .attr("height", scaleY.bandwidth())
      .on("mouseover", d => {
        // console.log('d :', d);
        // console.log('d3.event :', d3.event);
        // console.log('d3.event.pageX :', d3.event.pageX);
        // console.log('d3.event.pageY :', d3.event.pageY);
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
              d.variance +
              ""
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

    const legend = bodySvg
      .append("g")
      .attr("id", "legend")
      .attr("transform", "translate(0," + height + 100 + ")");
  })
  .catch(err => {
    console.error(err);
  });
