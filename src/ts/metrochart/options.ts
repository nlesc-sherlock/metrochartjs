/**
 * Options defines the options
 */
interface Options {
    /**
     * <p>
     * The colors defined by <code>colors</code> specify the colors with which
     * to draw metrolines. Each color must be an Object literal with properties
     * <code>name</code> (a descriptive name of the color, such as 'dark blue'
     * or 'seagreen') and <code>hexcode</code> (the hexadecimal representation
     * of a color in <code>#RRGGBB</code>).
     * </p>
     * <p>
     * If no colors are specified, the default metroline colors from
     * {@link MetroChart.defaultOptions.colors} are used. In any case, if there
     * are more unique metrolines than colors, modulo math is used to wrap the
     * colors.
     * </p>
     */
    colors?: {name:string, hexcode:string}[];
    /**
     * Defines the charge parameter of the force-directed graph.
     */
    charge?: number;
    /**
     * Whether or not to use an additional constraint in positioning the
     * stations along the x-axis.
     */
    enableTimeAxis?: boolean;
    /**
     * Defines the gravity parameter of the force-directed graph.
     */
    gravity?: number;
    /**
     * Defines the link distance parameter of the force-directed graph.
     */
    linkDistance?: number;
    /**
     * Defines the link strength parameter of the force-directed graph.
     */
    linkStrength?: number;
    /**
     * Defines the radius to be used for drawing the symbol representing
     * stations.
     */
    stationShapeRadius?: number;
}
