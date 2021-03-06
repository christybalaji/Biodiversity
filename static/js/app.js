function buildMetadata(sample) {

   /* data route */
   
  var url = `/metadata/${sample}`;

   //Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(response => {
    console.log(response);

     // Use d3 to select the panel with id of `#sample-metadata`

    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");
// Use `Object.entries` to add each key and value pair to the panel
// tags for each key-value in the metadata.
    Object.entries(response).forEach(item=>{
      panel.append("h6").text(`${item[0]}: ${item[1]}`)
    })
      // console.log(Object.entries(response));


   });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(sampleData => {
    console.log(sampleData)

    var trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: "Earth"
      }
    };
    
    var bubbleData = [trace1];
    
    var layout = {
      title: 'Bubble Chart',
      showlegend: false,
    };
    
    Plotly.newPlot('bubble', bubbleData, layout);

    var pieData =[{
      labels: sampleData.otu_ids.slice(0, 10),
      values: sampleData.sample_values.slice(0, 10),
      type: "pie"
    }];

    var layout = {
      height: 400,
      width: 500
    };

    Plotly.newPlot('pie', pieData, layout);
  })

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart


    
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
