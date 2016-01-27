///<reference path="metrochartdata.ts" />
///<reference path="metrocharterror.ts" />
///<reference path="metroline.ts" />
///<reference path="options.ts" />
///<reference path="station.ts" />


/**
 * <p>
 * A MetroChart is a force-directed graph. Being a graph, it is made up of nodes
 * and links. The nodes represent stations (see interface {@link Station}) while
 * the links represent metrolines (see interface {@link MetroLine}).
 * </p>
 *
 * <p>
 * The data may include an attribute <code>time</code> on each node. The property
 * may be used to order nodes along the horizontal axis (by setting
 * <code>this.enableTimeAxis</code> to <code>true</code>). This is convenient
 * for visualizing certain types of data, such as narratives in stories or plays
 * (which character occurs together with which other characters in any given
 * scene, with nodes representing scenes and links representing characters).
 * </p>
 */
class MetroChart {



    /**
     * The JSON data may include an optional <code>source</code> property (see
     * interface {@link MetroChartData}). Property <code>this.datasource</code>
     * stores the data source, or if the data source is omitted from the JSON,
     * <code>this.datasource</code> is set to <code>'unknown'</code>.
     */
    public datasource: string;
    /**
     * Identifier of the DOM element such as <code>#metrochart</code>, in
     * which to draw the MetroChart.
     */
    private elem: string;
    /**
     * The D3 selection representation of <code>this.elem</code>.
     */
    private elemSelection: d3.Selection<any>;
    /**
     * The height of the DOM element containing the MetroChart.
     */
    private h: number;
    /**
     * When the graph is visualized, station names can be displayed in a
     * reserved area at the top of the visualization as well as at the bottom.
     * This property sets the height of these reserved areas.
     */
    private labelSpaceVert: number;
    /**
     * Defines the rotation of the station labels
     */
    private labelRotation: number;
    /**
     * The graph is padded to avoid having elements very close to the left-side
     * and right-side edges of the visualization, or even falling off of it.
     * This property defines how much padding there is (in pixels). Note that
     * the bounding box takes into account the padding value.
     */
    private padding: {left:number, right:number};
    /**
     * When the data represents different entities than metrolines and stations
     * this property may be used to define an alternative name to identify
     * metrolines. Let's say your data represents the storyline of a comic book,
     * then individual frames could be represented by a station, while the
     * characters that occur in a frame could be represented by a line. In this
     * case, <code>this.stationlabel</code> could be set to <code>'frame'</code>
     * and <code>this.linelabel</code> could be set to <code>'character'</code>.
     */
    public linelabel: string;
    /**
     * The list of links/metrolines, pointing to the indices of two nodes/
     * stations.
     */
    private links: MetroLine[];
    /**
     * The list of stations.
     */
    private nodes: Station[];
    /**
     * When the data represents different entities than metrolines and stations
     * this property may be used to define an alternative name to identify
     * stations. Let's say your data represents the storyline of a comic book,
     * then individual frames could be represented by a station, while the
     * characters that occur in a frame could be represented by a line. In this
     * case, <code>this.stationlabel</code> could be set to <code>'frame'</code>
     * and <code>this.linelabel</code> could be set to <code>'character'</code>.
     */
    public stationlabel: string;
    /**
     * Radius in pixels used in drawing the station symbols.
     */
    public stationShapeRadius: number;
    /**
     * The time value corresponding to the left-most pixel.
     */
    public timeValueLeft: number;
    /**
     * The time value corresponding to the right-most pixel.
     */
    public timeValueRight: number;
    /**
     * List of strings containing the unique metroline names.
     */
    private ulinks: string[];
    /**
     * The URL of where the data is located. Data should be compliant with the
     * {@link MetroChartData} interface.
     */
    private _url: string;
    /**
     * The width of the DOM element containing the MetroChart.
     */
    private w: number;
    /**
     * See {@link Options.colors}.
     */
    private _colors: string[];
    /**
     * Defines the charge parameter of the force-directed graph.
     */
    private _charge: number;
    /**
     * See {@link Options.enableTimeAxis}.
     */
    private _enableTimeAxis: boolean;
    /**
     * Defines the gravity parameter of the force-directed graph.
     */
    private _gravity: number;
    /**
     * Defines the link distance parameter of the force-directed graph.
     */
    private _linkDistance: number;
    /**
     * Defines the link strength parameter of the force-directed graph.
     */
    private _linkStrength: number;
    /**
     * See {@link Options}.
     */
    private static defaultOptions: Options = {
        /**
         * See {@link Options.charge}.
         */
        charge: 0,
        /**
         * See {@link Options.colors}. Here are the default colors:
         * <table>
         *    <tr><td>1.</td><td bgcolor="#FF0000"></td><td>red</td></tr>
         *    <tr><td>2.</td><td bgcolor="#008000"></td><td>olive</td></tr>
         *    <tr><td>3.</td><td bgcolor="#0080FF"></td><td>blue</td></tr>
         *    <tr><td>4.</td><td bgcolor="#FF8000"></td><td>orange</td></tr>
         *    <tr><td>5.</td><td bgcolor="#FF0080"></td><td>magenta</td></tr>
         *    <tr><td>6.</td><td bgcolor="#FFee00"></td><td>yellow</td></tr>
         *    <tr><td>7.</td><td bgcolor="#80DD00"></td><td>lime</td></tr>
         *    <tr><td>8.</td><td bgcolor="#b200ff"></td><td>purple</td></tr>
         *    <tr><td>9.</td><td bgcolor="#00DD80"></td><td>seagreen</td></tr>
         *    <tr><td>10.</td><td bgcolor="#888888"></td><td>dark gray</td></tr>
         *    <tr><td>11.</td><td bgcolor="#000000"></td><td>black</td></tr>
         * </table>
         */
        colors: [
            {name: 'red',       hexcode: '#FF0000'},
            {name: 'olive',     hexcode: '#008000'},
            {name: 'blue',      hexcode: '#0080FF'},
            {name: 'orange',    hexcode: '#FF8000'},
            {name: 'magenta',   hexcode: '#FF0080'},
            {name: 'yellow',    hexcode: '#FFee00'},
            {name: 'lime',      hexcode: '#80DD00'},
            {name: 'purple',    hexcode: '#b200ff'},
            {name: 'seagreen',  hexcode: '#00DD80'},
            {name: 'dark gray', hexcode: '#888888'},
            {name: 'black',     hexcode: '#000000'}
        ],
        /**
         * See {@link Options.enableTimeAxis}.
         */
        enableTimeAxis: true,
        /**
         * See {@link Options.gravity}.
         */
        gravity: 0.0005,
        /**
         * See {@link Options.labelSpaceVert}.
         */
        labelSpaceVert: 130,
        /**
         * See {@link Options.labelRotation}.
         */
        labelRotation: -45,
        /**
         * See {@link Options.padding}.
         */
        padding: {left:50, right:50},
        /**
         * See {@link Options.linkDistance}.
         */
        linkDistance: 1,
        /**
         * See {@link Options.linkStrength}.
         */
        linkStrength: 0.0,
        /**
         * See {@link Options.stationShapeRadius}.
         */
        stationShapeRadius: 7.0
    };

    /**
     * Create a new MetroChart instance
     * @param {string} elem The name of the DOM element in which you want to
     *                      draw the MetroChart.
     * @param {string} url The URL of the data file, which should be a JSON file
     *                     formatted according to the <code>MetroChartData</code> interface.
     * @param {Options} [options] Optional parameter containing the options.
     */
    constructor(elem: string, url:string, options?:Options) {

        // store the string containing the DOM element ID
        this.elem = elem;

        // store the url to the data that was provided by the user
        this._url = url;

        // store the D3 selection of the element we want to draw in
        this.elemSelection = d3.select(this.elem);

        // store the width and height of the DOM element we want to draw in
        // (somehow typescript gives an error about getBoundingClientRect() but
        // it works in the browser (Google Chrome version 46.0.2490.71 (64-bit)))
        let elemNoHash: string = elem.slice(1);
        this.w = document.getElementById(elemNoHash).getBoundingClientRect().width;
        this.h = document.getElementById(elemNoHash).getBoundingClientRect().height;

        if (typeof options === 'undefined') {
            this.applyDefaultOptions(MetroChart.defaultOptions);
        } else {
            this.applyDefaultOptions(options);
        }

        // load the data (internally defers to this.drawForceDirectedGraph() )
        this.loaddata();

    } // end method constructor()




    /**
     * @param {Options} options User supplied options that override the default
     *                          options from {@link MetroChart.defaultOptions}.
     */
    public applyDefaultOptions(options?:Options): MetroChart {

        // set the colors:
        let colors: string[];
        colors = [];
        if (typeof options.colors === 'undefined') {
            // use default colors
            for (let color of MetroChart.defaultOptions.colors) {
                colors.push(color.hexcode);
            }
        } else {
            // use user-supplied colors
            for (let color of options.colors) {
                colors.push(color.hexcode);
            }
        }
        this.colors = colors;


        // set the force directed graph parameter 'charge'
        if (typeof options.charge === 'undefined') {
            // use default
            this.charge = MetroChart.defaultOptions.charge;
        } else {
            // use user supplied value
            this.charge = options.charge;
        }


        // set the force directed graph parameter 'gravity'
        if (typeof options.gravity === 'undefined') {
            // use default
            this.gravity = MetroChart.defaultOptions.gravity;
        } else {
            // use user supplied value
            this.gravity = options.gravity;
        }


        // set the force directed graph parameter 'linkDistance'
        if (typeof options.linkDistance === 'undefined') {
            // use default
            this.linkDistance = MetroChart.defaultOptions.linkDistance;
        } else {
            // use user supplied value
            this.linkDistance = options.linkDistance;
        }


        // set the force directed graph parameter 'linkStrength'
        if (typeof options.linkStrength === 'undefined') {
            // use default
            this.linkStrength = MetroChart.defaultOptions.linkStrength;
        } else {
            // use user supplied value
            this.linkStrength = options.linkStrength;
        }


        // define whether to enable the time axis
        if (typeof options.enableTimeAxis === 'undefined') {
            // use default
            this.enableTimeAxis = MetroChart.defaultOptions.enableTimeAxis;
        } else {
            // use user supplied value
            this.enableTimeAxis = options.enableTimeAxis;
        }


        // set the radius of the station symbols
        if (typeof options.stationShapeRadius === 'undefined') {
            // use default
            this.stationShapeRadius = MetroChart.defaultOptions.stationShapeRadius;
        } else {
            // use user supplied value
            this.stationShapeRadius = options.stationShapeRadius;
        }

        // set the vertical space reserved for plotting the station labels
        if (typeof options.labelSpaceVert === 'undefined') {
            // use default
            this.labelSpaceVert = MetroChart.defaultOptions.labelSpaceVert;
        } else {
            // use user supplied value
            this.labelSpaceVert = options.labelSpaceVert;
        }

        // set the station label rotation
        if (typeof options.labelRotation === 'undefined') {
            // use default
            this.labelRotation = MetroChart.defaultOptions.labelRotation;
        } else {
            // use user supplied value
            this.labelRotation = options.labelRotation;
        }

        // set the MetroChart's internal spacing (padding)
        if (typeof options.padding === 'undefined') {
            // use default
            this.padding = MetroChart.defaultOptions.padding;
        } else {
            // use user supplied value
            this.padding = options.padding;
        }



        return this;
    } // end method applyDefaultOptions()




    /**
     * Method to calculate the position of the lines connecting the stations.
     * The method takes into account how many lines there are at each station,
     * so the vertical offset can be calculated by <code>this.calcStubOffset()</code>.
     * @param {MetroLine} link - The link between two Stations.
     * @return {string} - The SVG path string describing the position of the line.
     */
    private calcLinkShape(link: MetroLine): string {
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




    calcLabelTopOrBottom(station: Station):string {

        let yTop:number = 0 + this.labelSpaceVert;
        let yBottom:number = this.h - this.labelSpaceVert;

        let distToTop:number = station.y - yTop;
        let distToBottom:number = yBottom - station.y;

        if (distToTop < distToBottom) {
            return 'top';
        } else {
            return 'bottom';
        }
    }




    calcLabelTranslate(station: Station) {

        let yTop:number = 0 + this.labelSpaceVert;
        let yBottom:number = this.h - this.labelSpaceVert;


        // apply the bounding box
        station = this.observeBoundingBox(station);

        let topOrBottom:string = this.calcLabelTopOrBottom(station);


        if (topOrBottom === 'top') {
            return 'translate(' + station.x + ',' + (yTop - 10 - 15) + ') rotate(' + this.labelRotation + ')';
        } else if (topOrBottom === 'bottom') {
            return 'translate(' + station.x + ',' + (yBottom + 10 + 15) + ') rotate(' + this.labelRotation + ')';
        } else {
            throw new MetroChartError('This should not happen.');
        }
    }





    /**
     * Method that calculates the shape of the station symbol.
     *
     * @param {Station} node - The station for which to draw a symbol.
     * @return {string} - String containing the SVG path 'd' data for the
     * station symbol.
     */
    private calcStationShape(node: Station): string {




        /**
         * Local function that calculates the shape of the station symbol's top or bottom part.
         *
         * @param {number} fromy - The y-value of where the arc should start.
         * @param {number} r - The radius of the arc.
         * @param {string} topOrBottomString - whether the method is used to draw
         *                                     the top part or the bottom part.
         * @return {string} - String containing the SVG path 'd' data (for the part
         * that describes the top or bottom arc).
         */
        let calcStationShapeArc = function(fromy:number, r:number, topOrBottomStr:string): string {

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
                throw new MetroChartError(' in .calcStationShapeArc(): \'Fourth argument should be either \'top\' or \'bottom\'.\'');
            }
        }; // end local method calcStationShapeArc





        // half the width of the entire station symbol
        let hw: number = this.stationShapeRadius;
        // half the height of the entire station symbol
        let hh: number = node.nLines * this.stationShapeRadius;

        let str: string = 'M ' + (-hw) + ' 0 ' +
                          'L ' + (-hw) + ' ' + ((node.nLines - 1) * -this.stationShapeRadius) + ' ' +
                          calcStationShapeArc((node.nLines - 1) * -this.stationShapeRadius, this.stationShapeRadius, 'top') +
                          'L ' + (+hw) + ' ' + ((node.nLines - 1) * this.stationShapeRadius) + ' ' +
                          calcStationShapeArc((node.nLines - 1) * this.stationShapeRadius, this.stationShapeRadius, 'bottom') +
                          'L ' + (-hw) + ' ' + ((node.nLines - 1) * this.stationShapeRadius) + ' ' +
                          'Z';
         return str;
    } // end method calcStationShape()




    /**
     * Method that calculates the translation of the station symbol, while
     * observing the bounding box set by the dimensions of the SVG area and the
     * dimension of the station symbols.
     *
     * @param {Station} node - The station that needs to be translated.
     * @return {string} - String containing the translate offsets.
     */
    private calcStationTranslate(node:Station): string {


        // if nodes have time labels and time axis is enabled, set x-position
        if (typeof node.time === 'number' && this.enableTimeAxis === true) {
            // calculate the fraction
            let f: number = (node.time - this.timeValueLeft) / (this.timeValueRight - this.timeValueLeft);

            node.x = this.padding.left + f * (this.w - this.padding.right - this.padding.left);
        }

        // apply the bounding box
        node = this.observeBoundingBox(node);

        return 'translate(' + node.x + ',' + node.y + ')';

    }




    /**
     * Method to calculate the vertical offset that indicates that there is more
     * than one line at a station.
     * @param {MetroLine} link - The link object connecting two stations.
     * @param {string} sourceOrTargetString - The stub's offset can be different
     * at the source than at the target nodes, this parameter indicates which we
     * are currently calculating.
     * @return {number} - The vertical offset in pixels
     */
    private calcStubOffset(link: MetroLine, sourceOrTargetStr:string): number {
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
            throw new MetroChartError(' in .calcStubOffset(): \'Input argument should be \'source\' or \'target\' .\'');
        }
        stubOffset = -1 * (nLines * this.stationShapeRadius - this.stationShapeRadius) + (stubIndex * 2 * this.stationShapeRadius);
        return stubOffset;

    }




    /**
     * Method to calculate the set of unique line names, <code>this.ulinks</code>.
     */
    private calcUniqueLines(): void {
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




    calcVerticalLine(station: Station) {

        let h:number = this.labelSpaceVert;
        let yTop:number = 0 + h;
        let yBottom:number = this.h - h;

        let distToTop:number = station.y - yTop;
        let distToBottom:number = yBottom - station.y;

        // apply the bounding box
        station = this.observeBoundingBox(station);

        let halfStationHeight: number = station.nLines * this.stationShapeRadius;

        let buffer: number = 30;

        if (distToTop < distToBottom) {
            return 'M ' + station.x + ' ' + (station.y - halfStationHeight - 5) + ' ' +
                   'L ' + station.x + ',' + (yTop - buffer + 15);
        } else {
            return 'M ' + station.x + ' ' + (station.y + halfStationHeight + 5) + ' ' +
                   'L ' + station.x + ',' + (yBottom + buffer - 15);
        }
    }





    /**
     * Draw/update force-directed metrochart graph using the current settings.
     */
    public drawForceDirectedGraph(): MetroChart {



        // define onMouseOutNodeGroup as a local function to the drawForceDirectedGraph() method
        let onMouseOutNodeGroup = function(eventsource) {
            //  Note the d3 selector magic that is applied here. I get the
            //  source of the event, which is an svg group, and on that
            //  selection I subselect everything of class 'nodegroup-child' (which
            //  I set myself when I created the child objects). On that
            //  selection, I remove the class 'highlight' which was set by
            //  onMouseOver() using d3's classed method:
            d3.select(eventsource).selectAll('.nodegroup-child').classed('highlight', false);
        };

        // define onMouseOverNodeGroup as a local function to the drawForceDirectedGraph() method
        let onMouseOverNodeGroup = function(eventsource) {
            //  Note the d3 selector magic that is applied here. I get the
            //  source of the event, which is an svg group, and on that
            //  selection I subselect everything of class 'nodegroup-child' (which
            //  I set myself when I created the child objects). On that
            //  selection, I add a class using d3's classed method:
            d3.select(eventsource).selectAll('.nodegroup-child').classed('highlight', true);
        };

        // define onMouseOutMetroLine as a local function to the drawForceDirectedGraph() method
        let onMouseOutMetroLine = function(eventsource) {
            // Here, 'eventsource' refers to the line segment (path)
            // that generated the event, not the instance of MetroChart!
            let uindex: number = d3.select(eventsource).datum().uindex;
            let classname = '.link.line' + uindex;
            d3.selectAll(classname).classed('highlight', false);
        };

        // define onMouseOverMetroLine as a local function to the drawForceDirectedGraph() method
        let onMouseOverMetroLine = function(eventsource) {
            // Here, 'eventsource' refers to the line segment (path)
            // that generated the event, not the instance of MetroChart!
            let uindex: number = d3.select(eventsource).datum().uindex;
            let classname = '.link.line' + uindex;
            d3.selectAll(classname).classed('highlight', true);
        };





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
        force.charge(this.charge);
        force.gravity(this.gravity);
        force.linkDistance(this.linkDistance);
        force.linkStrength(this.linkStrength);

        // In this next part, the order in which link, vline, node etc are
        // initialized is significant for which object is drawn on top of which
        // object

        // initialize the links between stations
        let link = vis.selectAll('.link')
            .data(this.links)
            .enter().append('path')
                .attr('class', function(d:MetroLine) {return 'link' + ' ' + 'line' + d.uindex; } )
                .attr('d', function(d:MetroLine) {return that.calcLinkShape(d); })
                .style('stroke', function(d:MetroLine) {return that.getColor(d.uindex); })
                .on('click', function(d:MetroLine) {console.log(that.linelabel + ' ' + d.line); })
                .on('mouseover', function() {
                    // somehow the 'this' object does not refer to the instance
                    // of MetroChart here, but to the event that generated the
                    // mouseover event, in this case the line segment.
                    let eventsource = this;
                    onMouseOverMetroLine(eventsource); } )
                .on('mouseout', function() {
                    // somehow the 'this' object does not refer to the instance
                    // of MetroChart here, but to the event that generated the
                    // mouseout event, in this case the line segment.
                    let eventsource = this;
                    onMouseOutMetroLine(eventsource);
                });


        // make a group of class nodegroup that will contain the station symbol,
        // the vertical line, and the station label:
        let nodeGroup = vis.selectAll('.node')
            .data(this.nodes)
            .enter().append('g')
            .attr('class', 'nodegroup-parent')
            .on('mouseover', function() {
                // somehow the 'this' object does not refer to the instance
                // of MetroChart here, but to the event that generated the
                // mouseover event, in this case the svg group element.
                let eventsource = this;
                onMouseOverNodeGroup(eventsource); } )
            .on('mouseout', function() {
                // somehow the 'this' object does not refer to the instance
                // of MetroChart here, but to the event that generated the
                // mouseout event, in this case the svg group element.
                let eventsource = this;
                onMouseOutNodeGroup(eventsource);
            });

        // label the nodes by adding their name as text
        let label = nodeGroup.append('text')
            .attr('class', 'label nodegroup-child')
            .attr('transform', 'translate(0,0) rotate(45)')
            .text(function(d:Station) {return d.name; });

        // draw a vertical line from each node to its corresponding label:
        let vline = nodeGroup.append('path')
            .attr('class', 'vline nodegroup-child')
            .attr('d', function(d:Station) {return that.calcVerticalLine(d); });

        // draw the station symbol:
        let node = nodeGroup.append('path')
                .attr('class', 'node nodegroup-child')
                .attr('d', function(d:Station) {return that.calcStationShape(d); })
                .on('click', function(d:Station) {console.log(that.stationlabel + ' ' + d.index + ': ' + d.name); })
                .call(force.drag);


        force.on('tick', function(e) {

            // this is actually a loop in which the force-directing algorithm adjusts
            // the values of node.x and node.y for all node of this.nodes.
            node.attr('transform', function(d:Station) {return that.calcStationTranslate(d); });

            label.attr('transform', function(d:Station) {return that.calcLabelTranslate(d); })
                .style('text-anchor', function(d:Station) {
                    let topOrBottom:string = that.calcLabelTopOrBottom(d);
                    if (topOrBottom === 'top') {
                        return 'start';
                    } else if (topOrBottom === 'bottom') {
                        return 'end';
                    } else {
                        throw new MetroChartError('This should not happen.');
                    }
                });

            vline.attr('d', function(d:Station) {return that.calcVerticalLine(d); });

            // for each link of this.links, recalculate the path connecting the stations (since
            // these were just changed)
            link.attr('d', function(d:MetroLine) {return that.calcLinkShape(d); });


        });


        // Restart the layout.
        force.start();

        return this;


    } // end method drawForceDirectedGraph()



    /**
     * Get the color of a line from <code>this.colors</code>, given its index
     * <code>uindex</code> into <code>this.ulinks</code>. If <code>this.colors</code>
     * is <code>undefined</code> or zero-length, return a color string representing
     * 50% gray. If there are not enough colors in <code>this.colors</code>, use modulo
     * math to determine the appropriate index into the color table.
     * @param {number} uindex - Index into <code>this.ulinks</code>
     * @return {string} The hexadecimal color string used for drawing <code>this.ulinks[uindex]</code>.
     */
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




    /**
     * Method to load the data from <code>this._url</code> using an <code>XMLHttpRequest</code>.
     */
    private loaddata() {
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

                console.log('MetroChart: \'Done loading data from "' + that._url + '"\'');

                // determine the list of unique line names:
                that.calcUniqueLines();
                // verify the data and add some properties:
                that.verifyData();

                // draw the force directed graph:
                that.drawForceDirectedGraph();
            }
        };

        // make the actual request
        xmlHttp.open('GET', this._url, true); // true for asynchronous

        // not sure what this is...end the connection?
        xmlHttp.send(null);


    } // end method loaddata()




    private observeBoundingBox(node:Station):Station {

        // half the width of the entire station symbol
        let hw: number = this.stationShapeRadius;
        // half the height of the entire station symbol
        let hh: number = node.nLines * this.stationShapeRadius;

        // observe the bounding box edge on the right
        if (node.x > this.w - hw - this.padding.right) {
            node.x = this.w - hw - this.padding.right;
        }

        // observe the bounding box edge on the left
        if (node.x < 0 + hw + this.padding.left) {
            node.x = 0 + hw + this.padding.left;
        }

        // observe the bounding box edge on the top
        if (node.y > this.h - hh - this.labelSpaceVert) {
            node.y = this.h - hh - this.labelSpaceVert;
        }

        // observe the bounding box edge on the bottom
        if (node.y < 0 + hh + this.labelSpaceVert) {
            node.y = 0 + hh + this.labelSpaceVert;
        }

        return node;

    }




    /**
     * Updates the data on the MetroChart object:
     * <ul>
     * <li>adds <code>this.nodes.x</code>, <code>this.nodes.y</code>,
     * <code>this.nodes.nLines</code> for all nodes</li>
     * <li>calculates minimum time value (<code>this.timeValueLeft</code>) and maximum time
     * value (<code>this.timeValueRight</code>) if applicable</li>
     * </ul>
     * @return {MetroChart} - Returns the MetroChart object with updated data
     */
    private verifyData(): MetroChart {


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
                throw new MetroChartError(' in .verifyData(): \'node.time\'s type should be \'number\'.');
            }
        }
        return this;
    }

    // getters and setters from here

    /**
    * Sets the list of colors to be used for visualizing the lines.
    */
    public set colors(colors: string[]) {
        this._colors = colors;
    }
    public get colors():string[] {
        return this._colors;
    }

    /**
    * Defines whether or not to apply the time axis constraint in positioning
    * the stations horizontally.
    */
    public set enableTimeAxis(enableTimeAxis: boolean) {
        this._enableTimeAxis = enableTimeAxis;
    }
    public get enableTimeAxis():boolean {
        return this._enableTimeAxis;
    }

    /**
    * Sets the force-directed graph's charge parameter.
    */
    public set charge(charge: number) {
        this._charge = charge;
    }
    public get charge():number {
        return this._charge;
    }


    /**
    * Sets the force-directed graph's link distance parameter.
    */
    public set linkDistance(linkDistance: number) {
        this._linkDistance = linkDistance;
    }
    public get linkDistance():number {
        return this._linkDistance;
    }


    /**
    * Sets the force-directed graph's gravity parameter.
    */
    public set gravity(gravity: number) {
        this._gravity = gravity;
    }
    public get gravity():number {
        return this._gravity;
    }

    /**
    * Sets the force-directed graph's link strength parameter.
    */
    public set linkStrength(linkStrength: number) {
        this._linkStrength = linkStrength;
    }
    public get linkStrength():number {
        return this._linkStrength;
    }


    /**
    * Gets the url of where the data was loaded from.
    */
    public get url(): string {
        return this._url;
    }


}







