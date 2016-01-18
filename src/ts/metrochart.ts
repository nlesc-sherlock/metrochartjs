class MetroChart {

    nodes: any;
    links: any;
    w: number;
    h: number;
    stationShapeRadius: number;

    constructor() {

        // initialize the width and height parameters
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.nodes = [];
        this.links = [];
        this.stationShapeRadius = 10;

        // for now, use inline data until I figure out how to load it
        this.links.push(
            {
                'source': 0,
                'target': 1,
                'line': 51
            },
            {
                'source': 0,
                'target': 1,
                'line': 53
            },
            {
                'source': 0,
                'target': 1,
                'line': 54
            },
            {
                'source': 1,
                'target': 2,
                'line': 51
            },
            {
                'source': 1,
                'target': 2,
                'line': 53
            }
        );


        this.nodes.push(
            {
                'index': 0,
                'name': 'Centraal Station',
                'lines': [51, 53, 54],
                'x': undefined,
                'y': undefined
            },
            {
                'index': 1,
                'name': 'Nieuwmarkt',
                'lines': [51, 53, 54],
                'x': undefined,
                'y': undefined
            },
            {
                'index': 2,
                'name': 'Waterlooplein',
                'lines': [51, 53],
                'x': undefined,
                'y': undefined
            }
        );

        // set the initial position on all nodes:
        for (let node of this.nodes) {
            node.x = this.w / 2;
            node.y = this.h / 2;
            node.nLines = node.lines.length;
        }
        this.drawForceDirectedGraph();

    } // end method constructor()




    calcStationShapeArc(fromy, r, topOrBottomStr) {

        var iSection,
            nSections,
            outputStr,
            angle,
            dx,
            dy;

        nSections = 8;
        outputStr = '';

        if (topOrBottomStr === 'top') {
            for (iSection = 0; iSection <= nSections; iSection += 1) {
                angle = (nSections - iSection) / nSections * Math.PI;
                dx = Math.cos(angle) * r;
                dy = Math.sin(angle) * -r;
                outputStr += 'L ' + (dx) + ' ' + (fromy + dy) + ' ';
            }
            return outputStr;
        } else if (topOrBottomStr === 'bottom') {
            for (iSection = 0; iSection < nSections; iSection += 1) {
                angle = (iSection) / nSections * Math.PI;
                dx = Math.cos(angle) * r;
                dy = Math.sin(angle) * r;
                outputStr += 'L ' + (dx) + ' ' + (fromy + dy) + ' ';
                }
            return outputStr;
        } else {
            throw '\'Fourth argument should be either \'top\' or \'bottom\'.\'';
        }
    } // end method calcStationShapeArc





     calcStationShape(nLines) {


        // half the width of the entire station symbol
        let hw: number = this.stationShapeRadius;
        // half the height of the entire station symbol
        let hh: number = nLines * this.stationShapeRadius;

        let str: string = 'M ' + (-hw) + ' 0 ' +
                          'L ' + (-hw) + ' ' + ((nLines - 1) * -this.stationShapeRadius) + ' ' +
                          this.calcStationShapeArc((nLines - 1) * -this.stationShapeRadius, this.stationShapeRadius, 'top') +
                          'L ' + (+hw) + ' ' + ((nLines - 1) * this.stationShapeRadius) + ' ' +
                          this.calcStationShapeArc((nLines - 1) * this.stationShapeRadius, this.stationShapeRadius, 'bottom') +
                          'L ' + (-hw) + ' ' + ((nLines - 1) * this.stationShapeRadius) + ' ' +
                          'Z';
         return str;
     } // end method calcStationShape()




    calcStubOffset(link, sourceOrTargetStr:string): number {
        // a node can have multiple lines coming from it. The order is
        // determined by the current method
        let stubIndex: number;
        let stubOffset: number;
        let nLines: number;

        if (sourceOrTargetStr === 'source') {
            let linesAtSource = this.nodes[link.source.index].lines;
            nLines = linesAtSource.length;
            stubIndex = linesAtSource.indexOf(link.line);
        } else if (sourceOrTargetStr === 'target') {
            let linesAtTarget = this.nodes[link.target.index].lines;
            nLines = linesAtTarget.length;
            stubIndex = linesAtTarget.indexOf(link.line);
        } else {
            throw '\'Input argument should be \'source\' or \'target\' .\'';
        }
        stubOffset = -1 * (nLines * this.stationShapeRadius - this.stationShapeRadius) + (stubIndex * 2 * this.stationShapeRadius);
        return stubOffset;

    }




    drawForceDirectedGraph() {

        // capture the 'this' object:
        var that = this;

        // select the DOM element to draw in, and set its width and height
        var vis = d3.select('#metrochart').append('svg')
            .attr('width', this.w)
            .attr('height', this.h);

        // initialize the force layout, set its width and height, then update it with
        // the nodes and links arrays (which initially are empty),
        var force = d3.layout.force()
            .size([this.w, this.h])
            .nodes(this.nodes)
            .links(this.links);


        force.linkDistance(5 * this.stationShapeRadius);
        force.gravity(0.01);
        force.linkStrength(15);

        var link = vis.selectAll('.link')
            .data(this.links)
            .enter().append('line')
            .attr('class', function (d:any) {return ('link line' + d.line); })
            .on('click', function(d:any) {console.log('line ' + d.line); });

        var node = vis.selectAll('.node')
            .data(this.nodes)
            .enter().append('path')
                .attr('class', 'node')
                .attr('transform', function(d:any) { return 'translate(' + d.x + ',' + d.y + ')'; })
                .attr('d', function (d: any) {return that.calcStationShape(d.nLines); })
                .on('click', function(d:any) {console.log('station ' + d.index + ': ' + d.name); })
                .call(force.drag);



        force.on('tick', function(e) {

            vis.selectAll('path')
                .attr('transform', function(d:any) { return 'translate(' + d.x + ',' + d.y + ')'; });

            link.attr('x1', function(d:any) { return d.source.x; })
                .attr('y1', function(d:any) { return d.source.y + that.calcStubOffset(d, 'source'); })
                .attr('x2', function(d:any) { return d.target.x; })
                .attr('y2', function(d:any) { return d.target.y + that.calcStubOffset(d, 'target'); });

        });


        // Restart the layout.
        force.start();


    } // end method drawForceDirectedGraph()

}







