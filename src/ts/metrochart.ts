class MetroChart {

    nodes: any;
    links: any;
    w: number;
    h: number;
    stationShapeRadius: number;
    url: string;
    linelabel: string;
    stationlabel: string;

    constructor(url:string) {

        // initialize the width and height parameters
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.stationShapeRadius = 5;
        this.url = url;

        this.loaddata();

    } // end method constructor()



    loaddata() {
        // load data from local file

        // capture the 'this' object from the current context
        let that = this;

        let xmlHttp = new XMLHttpRequest();

        // define what to do after the data has been downloaded successfully
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.status === 429) {
                console.log('Throttle limit exceeded. See "https://dev.socrata.com/docs/' +
                            'app-tokens.html#throttling-limits" for more information.');
            }
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {

                let data: any = JSON.parse(xmlHttp.responseText);

                that.nodes = data.nodes;
                that.links = data.links;
                that.linelabel = data.linelabel;
                that.stationlabel = data.stationlabel;

                console.log(that);

                console.log('MetroChart: done loading data from ' + that.url);

                // execute the callback
                that.drawForceDirectedGraph();
            }
        };

        // make the actual request
        xmlHttp.open('GET', this.url, true); // true for asynchronous

        // not sure what this is...end the connection?
        xmlHttp.send(null);


    }



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





     calcStationShape(nLines: number): string {

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




    calcLinkShape(link: any): string {
        // determine the coordinates of the given link

        let str:string = '';

        // draw straight lines between nodes

        // The first time this method gets called, source and target are
        // simply integer numbers, not objects with .x and .y properties.
        // Therefore you need these two if-statementd to make sure you don't
        // generate any errors:
        if (typeof link.source === 'object') {

            // x-from
            let xf: number = link.source.x;
            // y-from
            let yf: number = link.source.y + this.calcStubOffset(link, 'source');

            str += 'M' + xf + ',' + yf + ' ';

        } else {
            str += 'M0,0 ';
        }
        if (typeof(link.target) === 'object') {

            // x-to
            let xt: number = link.target.x;
            // y-to
            let yt: number = link.target.y + this.calcStubOffset(link, 'target');

            str += 'L' + xt + ',' + yt;

        } else {
            str += 'L100,100';
        }


        return str;

    } // end method calcLinkShape()




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

        // set the initial position on all nodes:
        for (let node of this.nodes) {
            node.x = this.w / 2;
            node.y = this.h / 2;
            node.nLines = node.lines.length;
        }

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

        //force.linkDistance(10 * this.stationShapeRadius);
        force.linkStrength(0.001);
        force.gravity(0.0005);
        force.charge(-10);

        var link = vis.selectAll('.link')
            .data(this.links)
            .enter().append('path')
                .attr('class', function (d:any) {return ('link line' + d.line); })
                .attr('d', function(d:any) {return that.calcLinkShape(d); })
                .on('click', function(d:any) {console.log(that.linelabel + ' ' + d.line); });

        var node = vis.selectAll('.node')
            .data(this.nodes)
            .enter().append('path')
                .attr('class', 'node')
                .attr('d', function(d: any) {return that.calcStationShape(d.nLines); })
                .on('click', function(d:any) {console.log(that.stationlabel + ' ' + d.index + ': ' + d.name); })
                .call(force.drag);


        force.on('tick', function(e) {

            node.attr('transform', function(d:any) {return 'translate(' + d.x + ',' + d.y + ')'; });
            link.attr('d', function(d:any) {return that.calcLinkShape(d); });

        });


        // Restart the layout.
        force.start();


    } // end method drawForceDirectedGraph()

}







