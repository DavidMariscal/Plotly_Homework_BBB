// Creating function for Data plotting (Bar, gauge, bubble)
function BuildCharts(id) {
  // getting data from the json file
  d3.json("data/samples.json").then((data)=> {
      console.log(data)

      var wfreq = data.metadata.map(d => d.wfreq)
      console.log(`Washing Freq: ${wfreq}`)
      
      // filter sample values by id 
      var samples = data.samples.filter(s => s.id.toString() === id)[0];
      
      console.log(samples);

      // Getting the top 10 
      var samplevalues = samples.sample_values.slice(0, 10).reverse();

      // get only top 10 otu ids for the plot OTU and reversing it. 
      var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
      
      // get the otu id's to the desired form for the plot
      var OTU_id = OTU_top.map(d => "OTU " + d)

    //   console.log(`OTU IDS: ${OTU_id}`)


      // get the top 10 labels for the plot
      var labels = samples.otu_labels.slice(0, 10);

    //   console.log(`Sample Values: ${samplevalues}`)
    //   console.log(`Id Values: ${OTU_top}`)
      // create trace variable for the plot
      var trace = {
          x: samplevalues,
          y: OTU_id,
          text: labels,
          marker: {
            color: 'rgb(142,124,195)'},
          type:"bar",
          orientation: "h",
      };

      // create data variable
      var data = [trace];

      // create layout variable to set plots layout
      var layout = {
          title: "Top 10 OTU",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 30
          }
      };

      // create the bar plot
      Plotly.newPlot("bar", data, layout);

      //console.log(`ID: ${samples.otu_ids}`)
    
      // The bubble chart
      var trace1 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
              size: samples.sample_values,
              color: samples.otu_ids
          },
          text: samples.otu_labels

      };

      // set the layout for the bubble plot
      var layout_b = {
          xaxis:{title: "OTU ID"},
          height: 600,
          width: 1000
      };

      // creating data variable 
      var data1 = [trace1];

      // create the bubble plot
      Plotly.newPlot("bubble", data1, layout_b); 

      // The guage chart

     // var data_g = [
     //  {
     //   domain: { x: [0, 1], y: [0, 1] },
     //   value: parseFloat(wfreq),
     //   title: { text: `Weekly Washing Frequency ` },
     //   type: "indicator",
        
     //   mode: "gauge+number",
     //   gauge: { axis: { range: [null, 9] },
     //            steps: [
     //             { range: [0, 2], color: "yellow" },
     //             { range: [2, 4], color: "cyan" },
     //             { range: [4, 6], color: "teal" },
     //             { range: [6, 8], color: "lime" },
     //             { range: [8, 9], color: "green" },
     //           ]}
            
      //  }
      // ];
      // var layout_g = { 
      //    width: 700, 
      //    height: 600, 
      //    margin: { t: 20, b: 40, l:100, r:100 } 
      //  };
      // Plotly.newPlot("gauge", data_g, layout_g);
    });
}  

function BuildGauge(wfreq) {
  // Enter the washing frequency between 0 and 180
  var level = parseFloat(wfreq) * 20;

  // Trig to calc meter point
  var degrees = 180 - level;
  var radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = "M -.0 -0.05 L .0 0.05 L ";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 12, color: "850000" },
      showlegend: false,
      name: "Freq",
      text: level,
      hoverinfo: "text+name"
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0, 105, 11, .5)",
          "rgba(10, 120, 22, .5)",
          "rgba(14, 127, 0, .5)",
          "rgba(110, 154, 22, .5)",
          "rgba(170, 202, 42, .5)",
          "rgba(202, 209, 95, .5)",
          "rgba(210, 206, 145, .5)",
          "rgba(232, 226, 202, .5)",
          "rgba(240, 230, 215, .5)",
          "rgba(255, 255, 255, 0)"
        ]
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }
  ];

  var layout = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000"
        }
      }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  };

  var GAUGE = document.getElementById("gauge");
  Plotly.newPlot(GAUGE, data, layout);
}



// create the function to get the necessary data
function GetSamples(id) {
  // read the json file to get data
  d3.json("data/samples.json").then((data)=> {
      
      // get the metadata info for the demographic panel
      var metadata = data.metadata;

      console.log(metadata)

      // filter meta data info by id
      var result = metadata.filter(meta => meta.id.toString() === id)[0];

      // select demographic panel to put data
      var demographicInfo = d3.select("#sample-metadata");
      
      // empty the demographic info panel each time before getting new id info
      demographicInfo.html("");

      // grab the necessary demographic data data for the id and append the info to the panel
      Object.entries(result).forEach((key) => {   
              demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}

// create the function for the change event
function optionChanged(id) {
  BuildCharts(id);
  BuildGauge(id);
  GetSamples(id);
}

// create the function for the initial data rendering
function init() {
  // select dropdown menu 
  var dropdown = d3.select("#selDataset");

  // read the data 
  d3.json("data/samples.json").then((data)=> {
      console.log(data)

      // get the id data to the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // call the functions to display the data and the plots to the page
      BuildCharts(data.names[0]);
      BuildGauge(data.mames[0]);
      GetSamples(data.names[0]);
  });
}

init();