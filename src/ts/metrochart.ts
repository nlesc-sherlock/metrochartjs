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
                'source': 43,
                'target': 44,
                'line': 50
            },
            {
                'source': 44,
                'target': 45,
                'line': 50
            },
            {
                'source': 45,
                'target': 46,
                'line': 50
            },
            {
                'source': 46,
                'target': 47,
                'line': 50
            },
            {
                'source': 47,
                'target': 48,
                'line': 50
            },
            {
                'source': 48,
                'target': 49,
                'line': 50
            },
            {
                'source': 49,
                'target': 50,
                'line': 50
            },
            {
                'source': 50,
                'target': 51,
                'line': 50
            },
            {
                'source': 51,
                'target': 16,
                'line': 50
            },
            {
                'source': 16,
                'target': 15,
                'line': 50
            },
            {
                'source': 15,
                'target': 14,
                'line': 50
            },
            {
                'source': 14,
                'target': 7,
                'line': 50
            },
            {
                'source': 7,
                'target': 36,
                'line': 50
            },
            {
                'source': 36,
                'target': 37,
                'line': 50
            },
            {
                'source': 37,
                'target': 38,
                'line': 50
            },
            {
                'source': 38,
                'target': 39,
                'line': 50
            },
            {
                'source': 39,
                'target': 40,
                'line': 50
            },
            {
                'source': 40,
                'target': 41,
                'line': 50
            },
            {
                'source': 41,
                'target': 42,
                'line': 50
            },
            {
                'source': 0,
                'target': 1,
                'line': 51
            },
            {
                'source': 1,
                'target': 2,
                'line': 51
            },
            {
                'source': 2,
                'target': 3,
                'line': 51
            },
            {
                'source': 3,
                'target': 4,
                'line': 51
            },
            {
                'source': 4,
                'target': 5,
                'line': 51
            },
            {
                'source': 5,
                'target': 6,
                'line': 51
            },
            {
                'source': 6,
                'target': 14,
                'line': 51
            },
            {
                'source': 14,
                'target': 15,
                'line': 51
            },
            {
                'source': 15,
                'target': 16,
                'line': 51
            },
            {
                'source': 16,
                'target': 17,
                'line': 51
            },
            {
                'source': 17,
                'target': 18,
                'line': 51
            },
            {
                'source': 18,
                'target': 19,
                'line': 51
            },
            {
                'source': 19,
                'target': 20,
                'line': 51
            },
            {
                'source': 20,
                'target': 21,
                'line': 51
            },
            {
                'source': 21,
                'target': 22,
                'line': 51
            },
            {
                'source': 22,
                'target': 23,
                'line': 51
            },
            {
                'source': 23,
                'target': 24,
                'line': 51
            },
            {
                'source': 24,
                'target': 25,
                'line': 51
            },
            {
                'source': 25,
                'target': 26,
                'line': 51
            },
            {
                'source': 26,
                'target': 27,
                'line': 51
            },
            {
                'source': 27,
                'target': 28,
                'line': 51
            },
            {
                'source': 28,
                'target': 29,
                'line': 51
            },
            {
                'source': 29,
                'target': 30,
                'line': 51
            },
            {
                'source': 30,
                'target': 31,
                'line': 51
            },
            {
                'source': 31,
                'target': 32,
                'line': 51
            },
            {
                'source': 32,
                'target': 33,
                'line': 51
            },
            {
                'source': 33,
                'target': 34,
                'line': 51
            },
            {
                'source': 34,
                'target': 35,
                'line': 51
            }
        );


        this.nodes.push(
            {
                'index': 0,
                'name': 'Centraal Station',
                'lines': [51, 53, 54],
            },
            {
                'index': 1,
                'name': 'Nieuwmarkt',
                'lines': [51, 53, 54],
            },
            {
                'index': 2,
                'name': 'Waterlooplein',
                'lines': [51, 53, 54],
            },
            {
                'index': 3,
                'name': 'Weesperplein',
                'lines': [51, 53, 54],
            },
            {
                'index': 4,
                'name': 'Wibautstraat',
                'lines': [51, 53, 54],
            },
            {
                'index': 5,
                'name': 'Amstelstation',
                'lines': [51, 53, 54],
            },
            {
                'index': 6,
                'name': 'Spaklerweg',
                'lines': [51, 53, 54],
            },
            {
                'index': 7,
                'name': 'Van der Madeweg',
                'lines': [50, 53, 54],
            },
            {
                'index': 8,
                'name': 'Venserpolder',
                'lines': [53],
            },
            {
                'index': 9,
                'name': 'Station Diemen Zuid',
                'lines': [53],
            },
            {
                'index': 10,
                'name': 'Verrijn Stuartweg',
                'lines': [53],
            },
            {
                'index': 11,
                'name': 'Ganzenhoef',
                'lines': [53],
            },
            {
                'index': 12,
                'name': 'Kraaiennest',
                'lines': [53],
            },
            {
                'index': 13,
                'name': 'Gaasperplas',
                'lines': [53],
            },
            {
                'index': 14,
                'name': 'Overamstel',
                'lines': [50, 51],
            },
            {
                'index': 15,
                'name': 'Station RAI',
                'lines': [50, 51],
            },
            {
                'index': 16,
                'name': 'Station Zuid',
                'lines': [50, 51],
            },
            {
                'index': 17,
                'name': 'De Boelelaan/VU',
                'lines': [51],
            },
            {
                'index': 18,
                'name': 'A.J. Ernststraat',
                'lines': [51],
            },
            {
                'index': 19,
                'name': 'Van Boshuizenstraat',
                'lines': [51],
            },
            {
                'index': 20,
                'name': 'Uilenstede',
                'lines': [51],
            },
            {
                'index': 21,
                'name': 'Kronenburg',
                'lines': [51],
            },
            {
                'index': 22,
                'name': 'Zonnestein',
                'lines': [51],
            },
            {
                'index': 23,
                'name': 'Onderuit',
                'lines': [51],
            },
            {
                'index': 24,
                'name': 'Oranjebaan',
                'lines': [51],
            },
            {
                'index': 25,
                'name': 'Amstelveen Centrum',
                'lines': [51],
            },
            {
                'index': 26,
                'name': 'Ouderkerkerlaan',
                'lines': [51],
            },
            {
                'index': 27,
                'name': 'Sportlaan',
                'lines': [51],
            },
            {
                'index': 28,
                'name': 'Marne',
                'lines': [51],
            },
            {
                'index': 29,
                'name': 'Gondel',
                'lines': [51],
            },
            {
                'index': 30,
                'name': 'Meent',
                'lines': [51],
            },
            {
                'index': 31,
                'name': 'Brink',
                'lines': [51],
            },
            {
                'index': 32,
                'name': 'Poortwachter',
                'lines': [51],
            },
            {
                'index': 33,
                'name': 'Spinnerij',
                'lines': [51],
            },
            {
                'index': 34,
                'name': 'Sacharovlaan',
                'lines': [51],
            },
            {
                'index': 35,
                'name': 'Westwijk',
                'lines': [51],
            },
            {
                'index': 36,
                'name': 'Station Duivendrecht',
                'lines': [50, 54],
            },
            {
                'index': 37,
                'name': 'Strandvliet',
                'lines': [50, 54],
            },
            {
                'index': 38,
                'name': 'Station Bijlmer ArenA',
                'lines': [50, 54],
            },
            {
                'index': 39,
                'name': 'Bullewijk',
                'lines': [50, 54],
            },
            {
                'index': 40,
                'name': 'Station Holendrecht',
                'lines': [50, 54],
            },
            {
                'index': 41,
                'name': 'Reigersbos',
                'lines': [50, 54],
            },
            {
                'index': 42,
                'name': 'Gein',
                'lines': [50, 54],
            },
            {
                'index': 43,
                'name': 'Isolatorweg',
                'lines': [50],
            },
            {
                'index': 44,
                'name': 'Station Sloterdijk',
                'lines': [50],
            },
            {
                'index': 45,
                'name': 'De Vlugtlaan',
                'lines': [50],
            },
            {
                'index': 46,
                'name': 'Jan van Galenstraat',
                'lines': [50],
            },
            {
                'index': 47,
                'name': 'Postjesweg',
                'lines': [50],
            },
            {
                'index': 48,
                'name': 'Station Lelylaan',
                'lines': [50],
            },
            {
                'index': 49,
                'name': 'Heemstedestraat',
                'lines': [50],
            },
            {
                'index': 50,
                'name': 'Henk Sneevlietweg',
                'lines': [50],
            },
            {
                'index': 51,
                'name': 'Amstelveenseweg',
                'lines': [50],
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
        force.gravity(0.02);
        force.charge(-30);

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







