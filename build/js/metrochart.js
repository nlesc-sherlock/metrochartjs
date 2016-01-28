var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MetroChartError = (function (_super) {
    __extends(MetroChartError, _super);
    function MetroChartError(message) {
        _super.call(this, message);
        this.name = 'MetroChartError';
        this.message = message;
    }
    return MetroChartError;
})(Error);
;
var MetroChart = (function () {
    function MetroChart(elem, url, options) {
        this.elem = elem;
        this._url = url;
        this.elemSelection = d3.select(this.elem);
        var elemNoHash = elem.slice(1);
        this.w = document.getElementById(elemNoHash).getBoundingClientRect().width;
        this.h = document.getElementById(elemNoHash).getBoundingClientRect().height;
        if (typeof options === 'undefined') {
            this.applyDefaultOptions(MetroChart.defaultOptions);
        }
        else {
            this.applyDefaultOptions(options);
        }
        this.loaddata();
    }
    MetroChart.prototype.applyDefaultOptions = function (options) {
        var colors;
        colors = [];
        if (typeof options.colors === 'undefined') {
            for (var _i = 0, _a = MetroChart.defaultOptions.colors; _i < _a.length; _i++) {
                var color = _a[_i];
                colors.push(color.hexcode);
            }
        }
        else {
            for (var _b = 0, _c = options.colors; _b < _c.length; _b++) {
                var color = _c[_b];
                colors.push(color.hexcode);
            }
        }
        this.colors = colors;
        if (typeof options.charge === 'undefined') {
            this.charge = MetroChart.defaultOptions.charge;
        }
        else {
            this.charge = options.charge;
        }
        if (typeof options.gravity === 'undefined') {
            this.gravity = MetroChart.defaultOptions.gravity;
        }
        else {
            this.gravity = options.gravity;
        }
        if (typeof options.linkDistance === 'undefined') {
            this.linkDistance = MetroChart.defaultOptions.linkDistance;
        }
        else {
            this.linkDistance = options.linkDistance;
        }
        if (typeof options.linkStrength === 'undefined') {
            this.linkStrength = MetroChart.defaultOptions.linkStrength;
        }
        else {
            this.linkStrength = options.linkStrength;
        }
        if (typeof options.enableTimeAxis === 'undefined') {
            this.enableTimeAxis = MetroChart.defaultOptions.enableTimeAxis;
        }
        else {
            this.enableTimeAxis = options.enableTimeAxis;
        }
        if (typeof options.stationShapeRadius === 'undefined') {
            this.stationShapeRadius = MetroChart.defaultOptions.stationShapeRadius;
        }
        else {
            this.stationShapeRadius = options.stationShapeRadius;
        }
        if (typeof options.labelSpaceVert === 'undefined') {
            this.labelSpaceVert = MetroChart.defaultOptions.labelSpaceVert;
        }
        else {
            this.labelSpaceVert = options.labelSpaceVert;
        }
        if (typeof options.labelRotation === 'undefined') {
            this.labelRotation = MetroChart.defaultOptions.labelRotation;
        }
        else {
            this.labelRotation = options.labelRotation;
        }
        if (typeof options.padding === 'undefined') {
            this.padding = MetroChart.defaultOptions.padding;
        }
        else {
            this.padding = options.padding;
        }
        return this;
    };
    MetroChart.prototype.calcLinkShape = function (link) {
        var str = '';
        if (typeof link.source === 'object') {
            var xf = link.source.x;
            var yf = link.source.y + this.calcStubOffset(link, 'source');
            str += 'M' + xf + ',' + yf + ' ';
        }
        else {
            str += 'M0,0 ';
        }
        if (typeof (link.target) === 'object') {
            var xt = link.target.x;
            var yt = link.target.y + this.calcStubOffset(link, 'target');
            str += 'L' + xt + ',' + yt;
        }
        else {
            str += 'L10,10';
        }
        return str;
    };
    MetroChart.prototype.calcLabelTopOrBottom = function (station) {
        var yTop = 0 + this.labelSpaceVert;
        var yBottom = this.h - this.labelSpaceVert;
        var distToTop = station.y - yTop;
        var distToBottom = yBottom - station.y;
        if (distToTop < distToBottom) {
            return 'top';
        }
        else {
            return 'bottom';
        }
    };
    MetroChart.prototype.calcLabelTranslate = function (station) {
        var yTop = 0 + this.labelSpaceVert;
        var yBottom = this.h - this.labelSpaceVert;
        station = this.observeBoundingBox(station);
        var topOrBottom = this.calcLabelTopOrBottom(station);
        if (topOrBottom === 'top') {
            return 'translate(' + station.x + ',' + (yTop - 10 - 15) + ') rotate(' + this.labelRotation + ')';
        }
        else if (topOrBottom === 'bottom') {
            return 'translate(' + station.x + ',' + (yBottom + 10 + 15) + ') rotate(' + this.labelRotation + ')';
        }
        else {
            throw new MetroChartError('This should not happen.');
        }
    };
    MetroChart.prototype.calcStationShape = function (node) {
        var calcStationShapeArc = function (fromy, r, topOrBottomStr) {
            var iSection;
            var nSections;
            var outputStr;
            var angle;
            var dx;
            var dy;
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
            }
            else if (topOrBottomStr === 'bottom') {
                for (iSection = 0; iSection < nSections; iSection += 1) {
                    angle = (iSection) / nSections * Math.PI;
                    dx = Math.cos(angle) * r;
                    dy = Math.sin(angle) * r;
                    outputStr += 'L ' + (dx) + ' ' + (fromy + dy) + ' ';
                }
                return outputStr;
            }
            else {
                throw new MetroChartError(' in .calcStationShapeArc(): \'Fourth argument should be either \'top\' or \'bottom\'.\'');
            }
        };
        var hw = this.stationShapeRadius;
        var hh = node.nLines * this.stationShapeRadius;
        var str = 'M ' + (-hw) + ' 0 ' +
            'L ' + (-hw) + ' ' + ((node.nLines - 1) * -this.stationShapeRadius) + ' ' +
            calcStationShapeArc((node.nLines - 1) * -this.stationShapeRadius, this.stationShapeRadius, 'top') +
            'L ' + (+hw) + ' ' + ((node.nLines - 1) * this.stationShapeRadius) + ' ' +
            calcStationShapeArc((node.nLines - 1) * this.stationShapeRadius, this.stationShapeRadius, 'bottom') +
            'L ' + (-hw) + ' ' + ((node.nLines - 1) * this.stationShapeRadius) + ' ' +
            'Z';
        return str;
    };
    MetroChart.prototype.calcStationTranslate = function (node) {
        if (typeof node.time === 'number' && this.enableTimeAxis === true) {
            var f = (node.time - this.timeValueLeft) / (this.timeValueRight - this.timeValueLeft);
            node.x = this.padding.left + f * (this.w - this.padding.right - this.padding.left);
        }
        node = this.observeBoundingBox(node);
        return 'translate(' + node.x + ',' + node.y + ')';
    };
    MetroChart.prototype.calcStubOffset = function (link, sourceOrTargetStr) {
        var stubIndex;
        var stubOffset;
        var nLines;
        if (sourceOrTargetStr === 'source') {
            var linesAtSource = this.nodes[link.source.index].lines;
            nLines = linesAtSource.length;
            stubIndex = linesAtSource.indexOf(link.line);
        }
        else if (sourceOrTargetStr === 'target') {
            var linesAtTarget = this.nodes[link.target.index].lines;
            nLines = linesAtTarget.length;
            stubIndex = linesAtTarget.indexOf(link.line);
        }
        else {
            throw new MetroChartError(' in .calcStubOffset(): \'Input argument should be \'source\' or \'target\' .\'');
        }
        stubOffset = -1 * (nLines * this.stationShapeRadius - this.stationShapeRadius) + (stubIndex * 2 * this.stationShapeRadius);
        return stubOffset;
    };
    MetroChart.prototype.calcUniqueLines = function () {
        this.ulinks = [];
        for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
            var link = _a[_i];
            if (this.ulinks.indexOf(link.line) === -1) {
                this.ulinks.push(link.line);
            }
        }
        this.ulinks.sort();
        for (var _b = 0, _c = this.links; _b < _c.length; _b++) {
            var link = _c[_b];
            link.uindex = this.ulinks.indexOf(link.line);
        }
    };
    MetroChart.prototype.calcVerticalLine = function (station) {
        var h = this.labelSpaceVert;
        var yTop = 0 + h;
        var yBottom = this.h - h;
        var distToTop = station.y - yTop;
        var distToBottom = yBottom - station.y;
        station = this.observeBoundingBox(station);
        var halfStationHeight = station.nLines * this.stationShapeRadius;
        var buffer = 30;
        if (distToTop < distToBottom) {
            return 'M ' + station.x + ' ' + (station.y - halfStationHeight - 5) + ' ' +
                'L ' + station.x + ',' + (yTop - buffer + 15);
        }
        else {
            return 'M ' + station.x + ' ' + (station.y + halfStationHeight + 5) + ' ' +
                'L ' + station.x + ',' + (yBottom + buffer - 15);
        }
    };
    MetroChart.prototype.drawForceDirectedGraph = function () {
        var onMouseOutNodeGroup = function (eventsource) {
            var children = d3.select(eventsource).selectAll('.nodegroup-child');
            children.classed('highlight', false);
        };
        var onMouseOverNodeGroup = function (eventsource) {
            var children = d3.select(eventsource).selectAll('.nodegroup-child');
            children.classed('highlight', true);
            d3.selectAll('.nodegroup-parent').each(function () {
                if (this === eventsource) {
                    this.parentNode.appendChild(this);
                }
                ;
            });
        };
        var onMouseOutMetroLine = function (eventsource) {
            var uindex = d3.select(eventsource).datum().uindex;
            var classname = '.link.line' + uindex;
            d3.selectAll(classname).classed('highlight', false);
        };
        var onMouseOverMetroLine = function (eventsource) {
            var uindex = d3.select(eventsource).datum().uindex;
            var classname = '.link.line' + uindex;
            d3.selectAll(classname).classed('highlight', true);
        };
        var that = this;
        d3.select('#metrochart-svg').remove();
        var vis = this.elemSelection.append('svg')
            .attr('id', 'metrochart-svg')
            .attr('width', this.w)
            .attr('height', this.h);
        var force = d3.layout.force()
            .size([this.w, this.h])
            .nodes(this.nodes)
            .links(this.links);
        force.charge(this.charge);
        force.gravity(this.gravity);
        force.linkDistance(this.linkDistance);
        force.linkStrength(this.linkStrength);
        var link = vis.selectAll('.link')
            .data(this.links)
            .enter().append('path')
            .attr('class', function (d) { return 'link' + ' ' + 'line' + d.uindex; })
            .attr('d', function (d) { return that.calcLinkShape(d); })
            .style('stroke', function (d) { return that.getColor(d.uindex); })
            .on('click', function (d) { console.log(that.linelabel + ' ' + d.line); })
            .on('mouseover', function () {
            var eventsource = this;
            onMouseOverMetroLine(eventsource);
        })
            .on('mouseout', function () {
            var eventsource = this;
            onMouseOutMetroLine(eventsource);
        });
        var nodeGroup = vis.selectAll('.node')
            .data(this.nodes)
            .enter().append('g')
            .attr('class', 'nodegroup-parent')
            .on('mouseover', function () {
            var eventsource = this;
            onMouseOverNodeGroup(eventsource);
        })
            .on('mouseout', function () {
            var eventsource = this;
            onMouseOutNodeGroup(eventsource);
        });
        var label = nodeGroup.append('text')
            .attr('class', 'label nodegroup-child')
            .attr('transform', 'translate(0,0) rotate(45)')
            .text(function (d) { return d.name; });
        var vline = nodeGroup.append('path')
            .attr('class', 'vline nodegroup-child')
            .attr('d', function (d) { return that.calcVerticalLine(d); });
        var node = nodeGroup.append('path')
            .attr('class', 'node nodegroup-child')
            .attr('d', function (d) { return that.calcStationShape(d); })
            .on('click', function (d) { console.log(that.stationlabel + ' ' + d.index + ': ' + d.name); })
            .call(force.drag);
        force.on('tick', function (e) {
            node.attr('transform', function (d) { return that.calcStationTranslate(d); });
            label.attr('transform', function (d) { return that.calcLabelTranslate(d); })
                .style('text-anchor', function (d) {
                var topOrBottom = that.calcLabelTopOrBottom(d);
                if (topOrBottom === 'top') {
                    return 'start';
                }
                else if (topOrBottom === 'bottom') {
                    return 'end';
                }
                else {
                    throw new MetroChartError('This should not happen.');
                }
            });
            vline.attr('d', function (d) { return that.calcVerticalLine(d); });
            link.attr('d', function (d) { return that.calcLinkShape(d); });
        });
        force.start();
        return this;
    };
    MetroChart.prototype.getColor = function (uindex) {
        var str;
        if (typeof this.colors === 'undefined' || this.colors.length === 0) {
            str = '#808080';
        }
        else {
            var nColors = this.colors.length;
            str = this.colors[uindex % nColors];
        }
        return str;
    };
    MetroChart.prototype.loaddata = function () {
        var that = this;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.status === 429) {
                console.log('Throttle limit exceeded. See "https://dev.socrata.com/docs/' +
                    'app-tokens.html#throttling-limits" for more information.');
            }
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                var data = JSON.parse(xmlHttp.responseText);
                that.nodes = data.nodes;
                that.links = data.links;
                if (typeof data.linelabel === 'undefined') {
                    that.linelabel = 'line';
                }
                else {
                    that.linelabel = data.linelabel;
                }
                if (typeof data.stationlabel === 'undefined') {
                    that.stationlabel = 'station';
                }
                else {
                    that.stationlabel = data.stationlabel;
                }
                if (typeof data.source === 'undefined') {
                    that.datasource = 'unknown';
                }
                else {
                    that.datasource = data.source;
                }
                console.log('MetroChart: \'Done loading data from "' + that._url + '"\'');
                that.calcUniqueLines();
                that.verifyData();
                that.drawForceDirectedGraph();
            }
        };
        xmlHttp.open('GET', this._url, true);
        xmlHttp.send(null);
    };
    MetroChart.prototype.observeBoundingBox = function (node) {
        var hw = this.stationShapeRadius;
        var hh = node.nLines * this.stationShapeRadius;
        if (node.x > this.w - hw - this.padding.right) {
            node.x = this.w - hw - this.padding.right;
        }
        if (node.x < 0 + hw + this.padding.left) {
            node.x = 0 + hw + this.padding.left;
        }
        if (node.y > this.h - hh - this.labelSpaceVert) {
            node.y = this.h - hh - this.labelSpaceVert;
        }
        if (node.y < 0 + hh + this.labelSpaceVert) {
            node.y = 0 + hh + this.labelSpaceVert;
        }
        return node;
    };
    MetroChart.prototype.verifyData = function () {
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.x = this.w / 2;
            node.y = this.h / 2;
            node.nLines = node.lines.length;
            if (typeof node.time === 'undefined') {
                console.log('MetroChart: \'No time information.\'');
            }
            else if (typeof node.time === 'number') {
                if (node.time < this.timeValueLeft || typeof this.timeValueLeft === 'undefined') {
                    this.timeValueLeft = node.time;
                }
                if (node.time > this.timeValueRight || typeof this.timeValueRight === 'undefined') {
                    this.timeValueRight = node.time;
                }
            }
            else {
                throw new MetroChartError(' in .verifyData(): \'node.time\'s type should be \'number\'.');
            }
        }
        return this;
    };
    Object.defineProperty(MetroChart.prototype, "colors", {
        get: function () {
            return this._colors;
        },
        set: function (colors) {
            this._colors = colors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetroChart.prototype, "enableTimeAxis", {
        get: function () {
            return this._enableTimeAxis;
        },
        set: function (enableTimeAxis) {
            this._enableTimeAxis = enableTimeAxis;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetroChart.prototype, "charge", {
        get: function () {
            return this._charge;
        },
        set: function (charge) {
            this._charge = charge;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetroChart.prototype, "linkDistance", {
        get: function () {
            return this._linkDistance;
        },
        set: function (linkDistance) {
            this._linkDistance = linkDistance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetroChart.prototype, "gravity", {
        get: function () {
            return this._gravity;
        },
        set: function (gravity) {
            this._gravity = gravity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetroChart.prototype, "linkStrength", {
        get: function () {
            return this._linkStrength;
        },
        set: function (linkStrength) {
            this._linkStrength = linkStrength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetroChart.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    MetroChart.defaultOptions = {
        charge: 0,
        colors: [
            { name: 'red', hexcode: '#FF0000' },
            { name: 'olive', hexcode: '#008000' },
            { name: 'blue', hexcode: '#0080FF' },
            { name: 'orange', hexcode: '#FF8000' },
            { name: 'magenta', hexcode: '#FF0080' },
            { name: 'yellow', hexcode: '#FFee00' },
            { name: 'lime', hexcode: '#80DD00' },
            { name: 'purple', hexcode: '#b200ff' },
            { name: 'seagreen', hexcode: '#00DD80' },
            { name: 'dark gray', hexcode: '#888888' },
            { name: 'black', hexcode: '#000000' }
        ],
        enableTimeAxis: true,
        gravity: 0.0005,
        labelSpaceVert: 130,
        labelRotation: -45,
        padding: { left: 50, right: 50 },
        linkDistance: 1,
        linkStrength: 0.0,
        stationShapeRadius: 7.0
    };
    return MetroChart;
})();
var metrochart;
var datasetNames = [
    'tintin',
    'amsterdam',
    'simultaneous-events'
];
var randomIndex = Math.floor(Math.random() * datasetNames.length);
var showDataSet = datasetNames[randomIndex];
switch (showDataSet) {
    case 'amsterdam':
        {
            var options = {
                enableTimeAxis: false,
                charge: -5,
                linkStrength: 0.5,
                linkDistance: 50,
                gravity: 0.0005,
                colors: [
                    { name: 'green', hexcode: '#008000' },
                    { name: 'orange', hexcode: '#FF8000' },
                    { name: 'red', hexcode: '#FF0000' },
                    { name: 'yellow', hexcode: '#FFFF00' }
                ],
                stationShapeRadius: 5
            };
            metrochart = new MetroChart('#metrochart', '/data/metrolines-amsterdam.json', options);
        }
        break;
    case 'tintin':
        {
            var options = {
                charge: 0,
                linkStrength: 0.0
            };
            metrochart = new MetroChart('#metrochart', '/data/tintin-the-black-island.json', options);
        }
        break;
    case 'simultaneous-events': {
        var options = {
            charge: -100,
            stationShapeRadius: 10,
            gravity: 0.005
        };
        metrochart = new MetroChart('#metrochart', '/data/simultaneous-events.json', options);
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldHJvY2hhcnQvbWV0cm9jaGFydGVycm9yLnRzIiwibWV0cm9jaGFydC9zdGF0aW9uLnRzIiwibWV0cm9jaGFydC9tZXRyb2NoYXJ0LnRzIiwibWFpbi1zY3JpcHQudHMiXSwibmFtZXMiOlsiTWV0cm9DaGFydEVycm9yIiwiTWV0cm9DaGFydEVycm9yLmNvbnN0cnVjdG9yIiwiTWV0cm9DaGFydCIsIk1ldHJvQ2hhcnQuY29uc3RydWN0b3IiLCJNZXRyb0NoYXJ0LmFwcGx5RGVmYXVsdE9wdGlvbnMiLCJNZXRyb0NoYXJ0LmNhbGNMaW5rU2hhcGUiLCJNZXRyb0NoYXJ0LmNhbGNMYWJlbFRvcE9yQm90dG9tIiwiTWV0cm9DaGFydC5jYWxjTGFiZWxUcmFuc2xhdGUiLCJNZXRyb0NoYXJ0LmNhbGNTdGF0aW9uU2hhcGUiLCJNZXRyb0NoYXJ0LmNhbGNTdGF0aW9uVHJhbnNsYXRlIiwiTWV0cm9DaGFydC5jYWxjU3R1Yk9mZnNldCIsIk1ldHJvQ2hhcnQuY2FsY1VuaXF1ZUxpbmVzIiwiTWV0cm9DaGFydC5jYWxjVmVydGljYWxMaW5lIiwiTWV0cm9DaGFydC5kcmF3Rm9yY2VEaXJlY3RlZEdyYXBoIiwiTWV0cm9DaGFydC5nZXRDb2xvciIsIk1ldHJvQ2hhcnQubG9hZGRhdGEiLCJNZXRyb0NoYXJ0Lm9ic2VydmVCb3VuZGluZ0JveCIsIk1ldHJvQ2hhcnQudmVyaWZ5RGF0YSIsIk1ldHJvQ2hhcnQuY29sb3JzIiwiTWV0cm9DaGFydC5lbmFibGVUaW1lQXhpcyIsIk1ldHJvQ2hhcnQuY2hhcmdlIiwiTWV0cm9DaGFydC5saW5rRGlzdGFuY2UiLCJNZXRyb0NoYXJ0LmdyYXZpdHkiLCJNZXRyb0NoYXJ0LmxpbmtTdHJlbmd0aCIsIk1ldHJvQ2hhcnQudXJsIl0sIm1hcHBpbmdzIjoiOzs7OztBQUdBO0lBQThCQSxtQ0FBS0E7SUFLL0JBLHlCQUFZQSxPQUFlQTtRQUd2QkMsa0JBQU1BLE9BQU9BLENBQUNBLENBQUNBO1FBRWZBLElBQUlBLENBQUNBLElB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Q2pDQSxDQUFDQTtRQUlEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxPQUFPQSxDQUFDQSxPQUFPQSxLQUFLQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUV6Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsVUFBVUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDckRBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBRUpBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO1FBQ25DQSxDQUFDQTtRQUlEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxPQUFPQSxDQUFDQSxZQUFZQSxLQUFLQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUU5Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsVUFBVUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsWUFBWUEsQ0FBQ0E7UUFDL0RBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBRUpBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLE9BQU9BLENBQUNBLFlBQVlBLENBQUNBO1FBQzdDQSxDQUFDQTtRQUlEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxPQUFPQSxDQUFDQSxZQUFZQSxLQUFLQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUU5Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsVUFBVUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsWUFBWUEsQ0FBQ0E7UUFDL0RBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBRUpBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLE9BQU9BLENBQUNBLFlBQVlBLENBQUNBO1FBQzdDQSxDQUFDQTtRQUlEQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxPQUFPQSxDQUFDQSxjQUFjQSxLQUFLQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVoREEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsVUFBVUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsY0FBY0EsQ0FB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cUJBQXFCO0NBQ3hCLENBQUM7QUFDRixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEUsSUFBSSxXQUFXLEdBQVcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBR3BELE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbEIsS0FBSyxXQUFXO1FBQUUsQ0FBQztZQUNYLElBQUksT0FBTyxHQUFZO2dCQUNuQixjQUFjLEVBQUUsS0FBSztnQkFDckIsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDVixZQUFZLEVBQUUsR0FBRztnQkFDakIsWUFBWSxFQUFFLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRSxNQUFNO2dCQUNmLE1BQU0sRUFBRTtvQkFDSixFQUFDLElBQUksRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBQztvQkFDbEMsRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUM7b0JBQ25DLEVBQUMsSUFBSSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFDO29CQUNoQyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBQztpQkFDdEM7Z0JBQ0Qsa0JBQWtCLEVBQUUsQ0FBQzthQUN4QixDQUFDO1lBQ0YsVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLGFBQWEsRUFBRSxpQ0FBaUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzRixDQUFDO1FBQ0QsS0FBSyxDQUFDO0lBQ1YsS0FBSyxRQUFRO1FBQUUsQ0FBQztZQUNSLElBQUksT0FBTyxHQUFZO2dCQUNuQixNQUFNLEVBQUUsQ0FBQztnQkFDVCxZQUFZLEVBQUUsR0FBRzthQUNwQixDQUFDO1lBQ0YsVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLGFBQWEsRUFBRSxvQ0FBb0MsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5RixDQUFDO1FBQ0QsS0FBSyxDQUFDO0lBQ1YsS0FBSyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3JCLElBQUksT0FBTyxHQUFZO1lBQ25CLE1BQU0sRUFBRSxDQUFDLEdBQUc7WUFDWixrQkFBa0IsRUFBRSxFQUFFO1lBQ3RCLE9BQU8sRUFBRSxLQUFLO1NBQ2pCLENBQUM7UUFDRixVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsYUFBYSxFQUFFLGdDQUFnQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFGLENBQUM7QUFDVCxDQUFDIiwiZmlsZSI6ImJ1aWxkL2pzL21ldHJvY2hhcnQuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsbnVsbCxudWxsLG51bGxdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
