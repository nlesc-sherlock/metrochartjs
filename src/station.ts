
import 'd3';

/**
 * Station is basically a <code>d3.layout.force.Node</code> with added properties:
 * <ol>
 * <li><code>name</code></li>
 * <li><code>lines</code></li>
 * <li><code>nLines</code></li>
 * <li><code>time</code></li>
 * </ol>
 */
export interface Station extends d3.layout.force.Node {
    /**
    * The list of metrolines that stop at this station.
    */
    lines: string[];
    /**
    * The name of this station.
    */
    name: string;
    /**
     * The total number of metrolines that stop at this station.
     * {@link MetroChart.verifyData}() (re)calculates this value once the data
     * is loaded.
     */
    nLines?: number;
    /**
     * Property to help position Stations along the horizontal axis (if
     * {@link MetroChart}'s <code>_enableTimeAxis</code> property <code>=== true</code>).
     */
    time?: number;
};
