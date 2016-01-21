

// Station is basically a d3.layout.force.Node with added properties 'name',
// and 'lines', and optional property 'nLines'.
interface Station extends d3.layout.force.Node {
    lines   : string[];
    name    : string;
    nLines? : number;
    time?   : number;
};


// Connection is basically a d3.layout.force.Link of Station
// objects, except that it adds the 'line' property
interface Connection extends d3.layout.force.Link<Station> {
    line : string;
    uindex: number;
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

interface DefaultOptions {
    colors            : {name:string, hexcode:string}[];
    charge            : number;
    enableTimeAxis    : boolean;
    gravity           : number;
    linkDistance      : number;
    linkStrength      : number;
    stationShapeRadius: number;
}



class MetroChart {

//    public static defaultOptions: DefaultOptions;
    public datasource           : string;
    public elem                 : string;
    public elemSelection        : d3.Selection<any>;
    public h                    : number;
    public linelabel            : string;
    public links                : Connection[];
    public nodes                : Station[];
    public stationlabel         : string;
    public stationShapeRadius   : number;
    public timeValueLeft        : number;
    public timeValueRight       : number;
    public ulinks               : string[];
    public url                  : string;
    public w                    : number;
    private _colors             : string[];
    private _enableTimeAxis     : boolean;
    private _forceCharge        : number;
    private _forceLinkDistance  : number;
    private _forceGravity       : number;
    private _forceLinkStrength  : number;




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

        this.applyDefaultOptions();

        // load the data (internally defers to this.drawForceDirectedGraph() )
        this.loaddata();

    } // end method constructor()




    applyDefaultOptions(): MetroChart {


        // set static class property defaultOptions
        let defaultOptions: DefaultOptions = {
            'charge': 0,
            'colors': [
                {'name': 'red', 'hexcode': '#FF0000'},
                {'name': 'olive', 'hexcode': '#008000'},
                {'name': 'blue', 'hexcode': '#0080FF'},
                {'name': 'orange', 'hexcode': '#FF8000'},
                {'name': 'magenta', 'hexcode': '#FF0080'},
                {'name': 'yellow', 'hexcode': '#FFee00'},
                {'name': 'lime', 'hexcode': '#80DD00'},
                {'name': 'purple', 'hexcode': '#b200ff'},
                {'name': 'seagreen', 'hexcode': '#00DD80'},
                {'name': 'dark gray', 'hexcode': '#888888'},
                {'name': 'black', 'hexcode': '#000000'}
            ],
            'enableTimeAxis': true,
            'gravity': 0.0005,
            'linkDistance': 1,
            'linkStrength': 0.0,
            'stationShapeRadius': 7.0
        };


        // set the colors:
        let colors: string[];
        colors = [];
        for (let color of defaultOptions.colors) {
            colors.push(color.hexcode);
        }
        this.colors = colors;

        // set the force directed graph parameters
        this.forceCharge = defaultOptions.charge;
        this.forceGravity = defaultOptions.gravity;
        this.forceLinkDistance = defaultOptions.linkDistance;
        this.forceLinkStrength = defaultOptions.linkStrength;

        // define whether to enable the time axis
        this.enableTimeAxis = defaultOptions.enableTimeAxis;

        // set the radius of the station symbols
        this.stationShapeRadius = defaultOptions.stationShapeRadius;

        return this;
    }


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

                console.log('MetroChart: \'Done loading data from "' + that.url + '"\'');

                // determine the list of unique line names:
                that.calcUniqueLines();
                // verify the data and add some properties:
                that.verifyData();
                // draw the force directed graph:
                that.drawForceDirectedGraph();
            }
        };

        // make the actual request
        xmlHttp.open('GET', this.url, true); // true for asynchronous

        // not sure what this is...end the connection?
        xmlHttp.send(null);


    }




    calcStationShapeArc(fromy, r, topOrBottomStr): string {

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




    calcStationShape(node: Station): string {

        // half the width of the entire station symbol
        let hw: number = this.stationShapeRadius;
        // half the height of the entire station symbol
        let hh: number = node.nLines * this.stationShapeRadius;

        let str: string = 'M ' + (-hw) + ' 0 ' +
                          'L ' + (-hw) + ' ' + ((node.nLines - 1) * -this.stationShapeRadius) + ' ' +
                          this.calcStationShapeArc((node.nLines - 1) * -this.stationShapeRadius, this.stationShapeRadius, 'top') +
                          'L ' + (+hw) + ' ' + ((node.nLines - 1) * this.stationShapeRadius) + ' ' +
                          this.calcStationShapeArc((node.nLines - 1) * this.stationShapeRadius, this.stationShapeRadius, 'bottom') +
                          'L ' + (-hw) + ' ' + ((node.nLines - 1) * this.stationShapeRadius) + ' ' +
                          'Z';
         return str;
    } // end method calcStationShape()




    calcStationTranslate(node:Station): string {

        // half the width of the entire station symbol
        let hw: number = this.stationShapeRadius;
        // half the height of the entire station symbol
        let hh: number = node.nLines * this.stationShapeRadius;

        // if nodes have time labels and time axis is enabled, set x-position
        if (typeof node.time === 'number' && this.enableTimeAxis === true) {
            // calculate the fraction
            let f: number = (node.time - this.timeValueLeft) / (this.timeValueRight - this.timeValueLeft);

            // don't use the whole width, only 90%, leaving 5% on the left and right
            node.x = 0.05 * this.w + f * 0.90 * this.w;
        }


        // observe the bounding box edge on the right
        if (node.x > this.w - hw) {
            node.x = this.w - hw;
        }

        // observe the bounding box edge on the left
        if (node.x < 0 + hw) {
            node.x = 0 + hw;
        }

        // observe the bounding box edge on the top
        if (node.y > this.h - hh) {
            node.y = this.h - hh;
        }

        // observe the bounding box edge on the bottom
        if (node.y < 0 + hh) {
            node.y = 0 + hh;
        }

        return 'translate(' + node.x + ',' + node.y + ')';

    }




    calcLinkShape(link: Connection): string {
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




    calcUniqueLines(): void {
        // initialize the array that is going to hold the unique names of lines
        this.ulinks = [];
        // iterate over the links, whenever you see a previously unseen line name,
        // add it to the list of strings in this.ulinks
        for (let link of this.links) {
            if (this.ulinks.indexOf(link.line) === -1 ) {
                this.ulinks.push(link.line);
            }
        }
        // sort the list of unique line names
        this.ulinks.sort();
        // assign the index of each link's line name to property .uindex
        for (let link of this.links) {
            link.uindex = this.ulinks.indexOf(link.line);
        }
    }




    drawForceDirectedGraph(): MetroChart {

        // capture the 'this' object:
        let that = this;

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
                .attr('class', function(d:Connection) {return 'link' + ' ' + 'line' + d.uindex; } )
                .attr('d', function(d:Connection) {return that.calcLinkShape(d); })
                .style('stroke', function(d:Connection) {return that.getColor(d.uindex); })
                .on('click', function(d:Connection) {console.log(that.linelabel + ' ' + d.line); })
                .on('mouseover', this.onMouseOver)
                .on('mouseout', this.onMouseOut);

        let node = vis.selectAll('.node')
            .data(this.nodes)
            .enter().append('path')
                .attr('class', 'node')
                .attr('d', function(d:Station) {return that.calcStationShape(d); })
                .on('click', function(d:Station) {console.log(that.stationlabel + ' ' + d.index + ': ' + d.name); })
                .call(force.drag);


        force.on('tick', function(e) {

            // this is actually a loop in which the force-directing algorithm adjusts
            // the values of node.x and node.y for all node of this.nodes.
            node.attr('transform', function(d:Station) {return that.calcStationTranslate(d); });

            // for each link of this.links, recalculate the path connecting the stations (since
            // these were just changed)
            link.attr('d', function(d:Connection) {return that.calcLinkShape(d); });
        });


        // Restart the layout.
        force.start();

        return this;


    } // end method drawForceDirectedGraph()




    public getColor(uindex:number): string {

        let str:string;

        if (typeof this.colors === 'undefined' || this.colors.length === 0) {
            // in case there are no predefined colors, set all colors to 50% gray
            str = '#808080';
        } else {
            let nColors:number = this.colors.length;
            // use the modulo-nColors of the uindex value as index into the color table
            str = this.colors[uindex % nColors];
        }
        return str;
    }




    private onMouseOver() {

        // Here, 'this' apparently refers to the line segment (path)
        // that generated the event, not the instance of MetroChart!
        let eventSource = this;
        let uindex: number = d3.select(eventSource).datum().uindex;
        let classname = '.link.line' + uindex;
        d3.selectAll(classname).style('stroke-width', '5px');
    }




    private onMouseOut() {

        // Here, 'this' apparently refers to the line segment (path)
        // that generated the event, not the instance of MetroChart!
        let eventSource = this;
        let uindex: number = d3.select(eventSource).datum().uindex;
        let classname = '.link.line' + uindex;
        d3.selectAll(classname).style('stroke-width', '3px');
    }




    verifyData(): MetroChart {

        // set the initial position on all nodes:
        for (let node of this.nodes) {
            node.x = this.w / 2;
            node.y = this.h / 2;
            node.nLines = node.lines.length;
            if (typeof node.time === 'undefined') {
                // this node has no associated information that can be used
                // to position it on a time axis
                console.log('MetroChart: \'No time information.\'');
            } else if (typeof node.time === 'number') {

                if (node.time < this.timeValueLeft || typeof this.timeValueLeft === 'undefined') {
                    this.timeValueLeft = node.time;
                }
                if (node.time > this.timeValueRight || typeof this.timeValueRight === 'undefined') {
                    this.timeValueRight = node.time;
                }
            } else {
                throw 'MetroChart: \'node.time\'s type should be \'number\'.';
            }
        }
        return this;
    }




    public set colors(colors: string[]) {
        this._colors = colors;
    }
    public get colors():string[] {
        return this._colors;
    }


    public set enableTimeAxis(enableTimeAxis: boolean) {
        this._enableTimeAxis = enableTimeAxis;
    }
    public get enableTimeAxis():boolean {
        return this._enableTimeAxis;
    }


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







