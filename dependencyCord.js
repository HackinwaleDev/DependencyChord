/**This is the implementationn of dependency chord for Marirs */

// SECTION A:: PREPARATION OF THE DATA READY FOR THE CHART
function chordDataProcessor(){
    
    d3.csv('data.csv').then(function(response){
        // process the data to return matrix, datarow with dummy inbetween        
        let headers = []
        let arcNames = []
        let matrix = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1,5,1,5,1,5,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40], //dummy
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
            [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0]

        ];

        // Construct a dynamic square matrix if possible
        /**Code later */
        response.map(function(d){
            // add all category name to the array
            arcNames.push(d.category)
        })
        // Add the last empty string to the arc
        arcNames.push('')
        response.map(function(d){
            // add all users to the array
            if(!arcNames.includes(d.users))
                arcNames.push(d.users)
        })
        // Add the last empty string to the arc
        arcNames.push('')
        headers = Object.keys(response[0])
        
        return {matrix, arcNames, headers};
    })
    .then(function(data){
        // Use the data anyhow you want it here

        // init
        let myChart = drawChart().data(data);

        // fire
        d3.select('#dependency-chart').call(myChart);

    })
}
//call for testing
chordDataProcessor()

// SECTION B:: DRAWING THE CHART
function drawChart(){
    // updatable variables
    let data;

    function draw(selection){
        selection.each(function(){
            // chart implementation begins here
            chartEngine(this)
        });

        function chartEngine(sel){
            // Defining the svg property
            let width = 700, //to be replaced with container width
                height = 600 //to be calculated with container width
            let margin = {top: 50, bottom: 50, left: 50, right: 50}
            let svgWidth = width - margin.left - margin.right,
                svgHeight = height - margin.top - margin.bottom

            // Setting the svg in place of container
            var svg = d3.select(sel).append('svg')
                        .attr('width', svgWidth)
                        .attr('height', svgHeight)

            // common property
            let outerRadius = Math.min(svgWidth, svgHeight) * .5
            let innerRadius = outerRadius - 50
            logger(outerRadius)
            logger(innerRadius)
            // logger(data.headers)

            /** Define each component function */
            // chord function
            chord = d3.chord()
                        .padAngle(.04)
                        .sortSubgroups(d3.descending)
                        .sortChords(d3.descending)
            // arc function
            arc = d3.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(innerRadius + 10)
            // ribbon function
            ribbon = d3.ribbon()
                        .radius(innerRadius)
            // color function
            color = d3.scaleOrdinal(d3.schemeCategory10)
            // fade function
            function fade(opacity) {
                return function(d, i) {
                  svg.selectAll("path.chord")
                      .filter(function(d) { return d.source.index !== i && d.target.index !== i && data.arcNames[d.source.index] !== ""; })
                      .transition()
                      .style("opacity", opacity);
                };
              }// end fade

            // Instantiate the chords 
            const chords = chord(data.matrix)

            // Set up the group for holding the components and pass in the data
            let group = svg.append('g')
                        .attr('transform', 'translate('+ svgWidth/2 + ',' +svgHeight/2+ ')')
                        .selectAll('g')
                        .data(chords.groups)
                      .enter().append('g')
                      .on('mouseover', fade(0.1))
                      .on('mouseout', fade(0.7))
            // Create path for the arcs
            group.append('path')
                        .attr('fill', function(d){ logger(d.index); return data.arcNames[d.index] === ""? 'none': color(d.index)})
                        .attr('stroke', function(d){ return data.arcNames[d.index] === ""? 'none': color(d.index)})
                        .attr('d', arc)
            // Set the name for each arc
            group.append("text")
                        .each(function(d) { return d.angle = (d.startAngle + d.endAngle) / 2; })
                        .attr("dy", ".35em")
                        .attr("transform", function(d){ return `
                            rotate(${(d.angle * 180 / Math.PI - 90)})
                            translate(${innerRadius + 26})
                            ${d.angle > Math.PI ? "rotate(180)" : ""}
                        `})
                        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null})
                        .text(function(d) { return data.arcNames[d.index]});

            // Now draw the chords connecting the arcs using ribbon
            svg.append("g")
                        .attr('transform', 'translate('+ svgWidth/2 + ',' +svgHeight/2+ ')')
                        .attr("fill-opacity", 0.7)
                        .selectAll("path")
                      .data(chords)
                      .enter().append("path")
                        .attr('class', 'chord')
                        // .attr("stroke", function(d) {return  d3.rgb(color(d.source.index)).darker()})
                        .attr("fill", function(d) {return data.arcNames[d.source.index] === ""? 'none': color(d.source.index)})
                        .attr("d", ribbon);

        }// end chartEngine

    }//end draw

    draw.data = function(value){
        if(!arguments.length){
            return draw;
        }
        data = value;
        return draw;
    }//end draw

    return draw;
}//end drawChart




// Universal logger
let debugMode = true;
function logger(param){
    if(debugMode)
        console.log(param);
}