let metrochart: MetroChart;




let datasetNames = [
    'tintin',
    'amsterdam',
    'simultaneous-events'
];
let randomIndex = Math.floor(Math.random() * datasetNames.length);
let showDataSet: string = datasetNames[randomIndex];

switch (showDataSet) {
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
            metrochart = new MetroChart('#metrochart', window.location.href + '/data/metrolines-amsterdam.json', options);
        }
        break;
    case 'tintin': {
            let options: Options = {
                charge: 0,
                linkStrength: 0.0
            };
            metrochart = new MetroChart('#metrochart', window.location.href + '/data/tintin-the-black-island.json', options);
        }
        break;
    case 'simultaneous-events': {
            let options: Options = {
                charge: -100,
                stationShapeRadius: 10,
                gravity: 0.005
            };
            metrochart = new MetroChart('#metrochart', window.location.href + '/data/simultaneous-events.json', options);
        }
}
