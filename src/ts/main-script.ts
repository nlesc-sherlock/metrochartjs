let map: Map;
let histogram: Histogram;
let timeline: Timeline;
let punchcard: Punchcard;
let spiral: Spiral;
let metrochart: MetroChart;

function doit(data: any) {


    // make a new map
    map = new Map('leaflet');
    map.binddata(data);
    map.circleMarkerOptions = {
        fillColor: '#F80',
        fillOpacity: 0.5,
        stroke: true,
        color: '#000'
    };
    map.circleMarkerRadius = 6;
    map.showCrimeLocations();


    // make the histogram and then add it to the timeline
    histogram = new Histogram(data);

    let size: ISize = {
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.4
    };

    let padding: IPadding = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 50
    };
    timeline = new Timeline(size, padding, histogram);

    punchcard = new Punchcard();
    punchcard.binddata(data);

    spiral = new Spiral('spiral');
    spiral.data = data;
    spiral.render();

    let showDataset: string = (Math.random() < 0.5) ? 'amsterdam' : 'tintin';

    switch (showDataset) {
        case 'amsterdam': {
                let options: Options = {
                    enableTimeAxis: false,
                    charge: -5,
                    linkStrength: 0.5,
                    linkDistance: 50,
                    gravity: 0.0005,
                    colors: [
                        {name:'green', hexcode: '#008000'},
                        {name:'orange', hexcode: '#FF8000'},
                        {name:'red', hexcode: '#FF0000'},
                        {name:'yellow', hexcode: '#FFFF00'}
                    ],
                    stationShapeRadius: 5
                };
                metrochart = new MetroChart('#metrochart', '/data/metrolines-amsterdam.json', options);
            }
            break;
        case 'tintin': {
                let options: Options = {
                    charge: 0,
                    linkStrength: 0.0
                };
                metrochart = new MetroChart('#metrochart', '/data/tintin-the-black-island.json', options);
            }
            break;
        case 'simultaneous': {
                metrochart = new MetroChart('#metrochart', '/data/simultaneous-events.json');
            }
    }
}


// make a new dataloader
let dataloader: DataLoader = new DataLoader();

// configure the dataloader
dataloader.limit = 1000;

// set the offset to a large value to get to the more recent records (the
// results are sorted by increasing date); the more recent records are more
// likely to have valid coordinates.
dataloader.offset = 0;

// load the data
dataloader.loadData(doit);

