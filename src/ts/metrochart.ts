

// Station is basically a d3.layout.force.Node with added properties 'name',
// and 'lines', and optional property 'nLines'.
interface Station extends d3.layout.force.Node {
    lines   : string[];
    name    : string;
    nLines? : number;
};


// Connection is basically a d3.layout.force.Link of Station
// objects, except that it adds the 'line' property
interface Connection extends d3.layout.force.Link<Station> {
    line : string;
}

// MetroChartData combines Station and Connection, and adds the optional
// properties 'source', 'stationlabel', and 'linelabel'.

interface MetroChartData {
    linelabel?    : string;
    links         : Connection[];
    nodes         : Station[];
    source?       : string;
    stationlabel? : string;
}


class MetroChart {

    public datasource         : string;
    public elem               : string;
    public elemSelection      : d3.Selection<any>;
    public h                  : number;
    public linelabel          : string;
    public links              : Connection[];
    public nodes              : Station[];
    public stationlabel       : string;
    public stationShapeRadius : number;
    public url                : string;
    public w                  : number;

    private _forceCharge      : number;
    private _forceLinkDistance: number;
    private _forceGravity     : number;
    private _forceLinkStrength: number;

    constructor(elem: string, url:string) {

        // store the string containing the DOM element ID
        this.elem = elem;

        // store the url to the data that was provided by the user
        this.url = url;



        // store the D3 selection of the element we want to draw in
        this.elemSelection = d3.select(this.elem);

        // store the width and height of the DOM element we want to draw in
        // (somehow typescript gives an error about getBoundingClientRect() but
        // it works in the browser (Google Chrome version 46.0.2490.71 (64-bit)))
        this.w = this.elemSelection.node().getBoundingClientRect().width;
        this.h = this.elemSelection.node().getBoundingClientRect().height;

        // set the radius of the station symbols
        this.stationShapeRadius = 5;

        // set the force directed graph parameters
        this.forceCharge = -10;
        this.forceGravity = 0.0005;
        this.forceLinkDistance = 0;
        this.forceLinkStrength = 0.1;

        // load the data (internally defers to this.drawForceDirectedGraph() )
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

                let data: MetroChartData = JSON.parse(xmlHttp.responseText);

                // get the nodes and links from the parsed data
                that.nodes = data.nodes;
                that.links = data.links;

                // if the data includes an alternative descriptive name for
                // line, use it, otherwise use 'line'
                if (typeof data.linelabel === 'undefined') {
                    that.linelabel = 'line';
                } else {
                    that.linelabel = data.linelabel;
                }

                // if the data includes an alternative descriptive name for
                // station, use it, otherwise use 'station'
                if (typeof data.stationlabel === 'undefined') {
                    that.stationlabel = 'station';
                } else {
                    that.stationlabel = data.stationlabel;
                }

                // if the data includes a data source, use it, otherwise use
                // 'unknown'
                if (typeof data.source === 'undefined') {
                    that.datasource = 'unknown';
                } else {
                    that.datasource = data.source;
                }


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

        let iSection: number;
        let nSections: number;
        let outputStr;
        let angle: number;
        let dx: number;
        let dy: number;

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
        // Therefore you need these two if-statements to make sure you don't
        // generate any errors:
        if (typeof link.source === 'object') {

            // x-from
            let xf: number = link.source.x;
            // y-from
            let yf: number = link.source.y + this.calcStubOffset(link, 'source');

            str += 'M' + xf + ',' + yf + ' ';

        } else {
            // starting point of a temporary line (only displayed in the very first frame)
            str += 'M0,0 ';
        }
        if (typeof(link.target) === 'object') {

            // x-to
            let xt: number = link.target.x;
            // y-to
            let yt: number = link.target.y + this.calcStubOffset(link, 'target');

            str += 'L' + xt + ',' + yt;

        } else {
            // ending point of a temporary line (only displayed in the very first frame)
            str += 'L10,10';
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
        let that = this;

        // set the initial position on all nodes:
        for (let node of this.nodes) {
            node.x = this.w / 2;
            node.y = this.h / 2;
            node.nLines = node.lines.length;
        }

        // if an metrochart-svg element exists, clear its contents:
        d3.select('#metrochart-svg').remove();

        // select the DOM element to draw in, and set its identifier, as well
        // as its width and height
        let vis = this.elemSelection.append('svg')
            .attr('id', 'metrochart-svg')
            .attr('width', this.w)
            .attr('height', this.h);

        // initialize the force layout, set its width and height, then update it with
        // the nodes and links arrays (which initially are empty),
        let force = d3.layout.force()
            .size([this.w, this.h])
            .nodes(this.nodes)
            .links(this.links);

        // set the directed-graph force parameters:
        force.charge(this.forceCharge);
        force.gravity(this.forceGravity);
        force.linkDistance(this.forceLinkDistance);
        force.linkStrength(this.forceLinkStrength);

        let link = vis.selectAll('.link')
            .data(this.links)
            .enter().append('path')
                .attr('class', function (d:any) {return ('link line' + d.line); })
                .attr('d', function(d:any) {return that.calcLinkShape(d); })
                .on('click', function(d:any) {console.log(that.linelabel + ' ' + d.line); });

        let node = vis.selectAll('.node')
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


    public set forceCharge(forceCharge: number) {
        this._forceCharge = forceCharge;
    }
    public get forceCharge():number {
        return this._forceCharge;
    }


    public set forceLinkDistance(forceLinkDistance: number) {
        this._forceLinkDistance = forceLinkDistance;
    }
    public get forceLinkDistance():number {
        return this._forceLinkDistance;
    }


    public set forceGravity(forceGravity: number) {
        this._forceGravity = forceGravity;
    }
    public get forceGravity():number {
        return this._forceGravity;
    }


    public set forceLinkStrength(forceLinkStrength: number) {
        this._forceLinkStrength = forceLinkStrength;
    }
    public get forceLinkStrength():number {
        return this._forceLinkStrength;
    }

}







