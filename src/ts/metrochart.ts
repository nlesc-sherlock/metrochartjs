//
// interface GraphLink {
//
//     source: number;
//     target: number;
// }
//
//
//
// interface GraphNode {
//
//     index: number;
//     name: string;
//     nLines: number;
// }
//
//


class MetroChart {

    nodes: any;
    links: any;
    w: number;
    h: number;

    constructor() {

        // initialize the width and height parameters
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.nodes = [];
        this.links = [];

        // for now, use inline data until I figure out how to load it
        this.links.push(
            {
                'source': 0,
                'target': 1
            },
            {
                'source': 1,
                'target': 2
            },
            {
                'source': 2,
                'target': 3
            },
            {
                'source': 3,
                'target': 4
            },
            {
                'source': 4,
                'target': 5
            },
            {
                'source': 5,
                'target': 6
            },
            {
                'source': 6,
                'target': 7
            },
            {
                'source': 7,
                'target': 8
            },
            {
                'source': 8,
                'target': 9
            },
            {
                'source': 9,
                'target': 10
            },
            {
                'source': 10,
                'target': 11
            },
            {
                'source': 11,
                'target': 12
            },
            {
                'source': 12,
                'target': 13
            },
            {
                'source': 6,
                'target': 14
            },
            {
                'source': 14,
                'target': 15
            },
            {
                'source': 15,
                'target': 16
            },
            {
                'source': 16,
                'target': 17
            },
            {
                'source': 17,
                'target': 18
            },
            {
                'source': 18,
                'target': 19
            },
            {
                'source': 19,
                'target': 20
            },
            {
                'source': 20,
                'target': 21
            },
            {
                'source': 21,
                'target': 22
            },
            {
                'source': 22,
                'target': 23
            },
            {
                'source': 23,
                'target': 24
            },
            {
                'source': 24,
                'target': 25
            },
            {
                'source': 25,
                'target': 26
            },
            {
                'source': 26,
                'target': 27
            },
            {
                'source': 27,
                'target': 28
            },
            {
                'source': 28,
                'target': 29
            },
            {
                'source': 29,
                'target': 30
            },
            {
                'source': 30,
                'target': 31
            },
            {
                'source': 31,
                'target': 32
            },
            {
                'source': 32,
                'target': 33
            },
            {
                'source': 33,
                'target': 34
            },
            {
                'source': 34,
                'target': 35
            },
            {
                'source': 7,
                'target': 36
            },
            {
                'source': 36,
                'target': 37
            },
            {
                'source': 37,
                'target': 38
            },
            {
                'source': 38,
                'target': 39
            },
            {
                'source': 39,
                'target': 40
            },
            {
                'source': 40,
                'target': 41
            },
            {
                'source': 41,
                'target': 42
            },
            {
                'source': 43,
                'target': 44
            },
            {
                'source': 44,
                'target': 45
            },
            {
                'source': 45,
                'target': 46
            },
            {
                'source': 46,
                'target': 47
            },
            {
                'source': 47,
                'target': 48
            },
            {
                'source': 48,
                'target': 49
            },
            {
                'source': 49,
                'target': 50
            },
            {
                'source': 50,
                'target': 51
            },
            {
                'source': 16,
                'target': 51
            }
        );


        this.nodes.push(
            {
                'index': 0,
                'name': 'Centraal Station',
                'nLines': 3,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 1,
                'name': 'Nieuwmarkt',
                'nLines': 3,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 2,
                'name': 'Waterlooplein',
                'nLines': 3,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 3,
                'name': 'Weesperplein',
                'nLines': 3,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 4,
                'name': 'Wibautstraat',
                'nLines': 3,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 5,
                'name': 'Amstelstation',
                'nLines': 3,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 6,
                'name': 'Spaklerweg',
                'nLines': 3,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 7,
                'name': 'Van der Madeweg',
                'nLines': 3,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 8,
                'name': 'Venserpolder',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 9,
                'name': 'Station Diemen Zuid',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 10,
                'name': 'Verrijn Stuartweg',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 11,
                'name': 'Ganzenhoef',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 12,
                'name': 'Kraaiennest',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 13,
                'name': 'Gaasperplas',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 14,
                'name': 'Overamstel',
                'nLines': 2,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 15,
                'name': 'Station RAI',
                'nLines': 2,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 16,
                'name': 'Station Zuid',
                'nLines': 2,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 17,
                'name': 'De Boelelaan/VU',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 18,
                'name': 'A.J. Ernststraat',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 19,
                'name': 'Van Boshuizenstraat',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 20,
                'name': 'Uilenstede',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 21,
                'name': 'Kronenburg',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 22,
                'name': 'Zonnestein',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 23,
                'name': 'Onderuit',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 24,
                'name': 'Oranjebaan',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 25,
                'name': 'Amstelveen Centrum',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 26,
                'name': 'Ouderkerkerlaan',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 27,
                'name': 'Sportlaan',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 28,
                'name': 'Marne',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 29,
                'name': 'Gondel',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 30,
                'name': 'Meent',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 31,
                'name': 'Brink',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 32,
                'name': 'Poortwachter',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 33,
                'name': 'Spinnerij',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 34,
                'name': 'Sacharovlaan',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 35,
                'name': 'Westwijk',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 36,
                'name': 'Station Duivendrecht',
                'nLines': 2,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 37,
                'name': 'Strandvliet',
                'nLines': 2,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 38,
                'name': 'Station Bijlmer ArenA',
                'nLines': 2,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 39,
                'name': 'Bullewijk',
                'nLines': 2,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 40,
                'name': 'Station Holendrecht',
                'nLines': 2,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 41,
                'name': 'Reigersbos',
                'nLines': 2,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 42,
                'name': 'Gein',
                'nLines': 2,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 43,
                'name': 'Isolatorweg',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 44,
                'name': 'Station Sloterdijk',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 45,
                'name': 'De Vlugtlaan',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 46,
                'name': 'Jan van Galenstraat',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 47,
                'name': 'Postjesweg',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 48,
                'name': 'Station Lelylaan',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 49,
                'name': 'Heemstedestraat',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 50,
                'name': 'Henk Sneevlietweg',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            },
            {
                'index': 51,
                'name': 'Amstelveenseweg',
                'nLines': 1,
                'x': undefined,
                'y': undefined
            }
        );

        // set the initial position on all nodes:
        for (let node of this.nodes) {
            node.x = this.w / 2;
            node.y = this.h / 2;
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

         // the radius
         let r: number = 5;
         // the width of the entire station symbol
         let w: number = 2 * r;
         // the height of the entire station symbol
         let h:number = nLines * r * 2;
         // half the width of the entire station symbol
         let hw: number = r;
         // half the height of the entire station symbol
         let hh: number = h / 2;

         let str: string = 'M ' + (-hw) + ' 0 ' +
                           'L ' + (-hw) + ' ' + ((nLines - 1) * -r) + ' ' +
                           this.calcStationShapeArc((nLines - 1) * -r, r, 'top') +
                           'L ' + (+hw) + ' ' + ((nLines - 1) * r) + ' ' +
                           this.calcStationShapeArc((nLines - 1) * r, r, 'bottom') +
                           'L ' + (-hw) + ' ' + ((nLines - 1) * r) + ' ' +
                           'Z';

         return str;
     } // end method calcStationShape()




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


        force.linkDistance(35);
        force.gravity(0.01);
        force.linkStrength(1.5);

        var link = vis.selectAll('.link')
            .data(this.links)
            .enter().append('line')
            .attr('class', 'link');

        var node = vis.selectAll('.node')
            .data(this.nodes)
            .enter().append('path')
                .attr('class', 'node')
                .attr('transform', function(d:any) { return 'translate(' + d.x + ',' + d.y + ')'; })
                .attr('d', function (d: any) {return that.calcStationShape(d.nLines); })
                .on('click', function(d:any) {console.log(d.index + ': ' + d.name); })
                .call(force.drag);



        force.on('tick', function(e) {

            vis.selectAll('path')
                .attr('transform', function(d:any) { return 'translate(' + d.x + ',' + d.y + ')'; });

            link.attr('x1', function(d:any) { return d.source.x; })
                .attr('y1', function(d:any) { return d.source.y; })
                .attr('x2', function(d:any) { return d.target.x; })
                .attr('y2', function(d:any) { return d.target.y; });

        });


        // Restart the layout.
        force.start();


    } // end method drawForceDirectedGraph()

}







