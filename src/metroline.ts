/**
 * MetroLine is basically a <code>d3.layout.force.Link</code> between two
 * {@link Station} objects, except that it adds the <code>line</code> and
 * <code>uindex</code> properties.
 */
interface MetroLine extends d3.layout.force.Link<Station> {
    /**
     * Name of the metroline.
     */
    line : string;
    /**
     * Index of this station into a list of unique station names (the list is
     * calculated by {@link MetroChart.calcUniqueLines}() and the result is
     * stored in {@link MetroChart}'s <code>.ulinks</code> property).
     */
    uindex: number;
}
