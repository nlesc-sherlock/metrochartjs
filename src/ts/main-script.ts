let metrochart: MetroChart;


let showDataset: string = (Math.random() < 0.99) ? 'amsterdam' : 'tintin';

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
