/**
 * MetroChartData combines a list of {@link Station}s with a list of
 * {@link MetroLine}s, and adds the optional properties <code>source</code>,
 * <code>stationlabel</code>, and <code>linelabel</code>.
 */
interface MetroChartData {
    /**
     * By default the links are labeled as 'metrolines', but depending on the
     * nature of the data, it can be convenient to label the links in accordance
     * with the entity they represent. This property stores that entity name.
     */
    linelabel?: string;
    /**
     * The list of {@link MetroLine}s, where each element in the list connects
     * one {@link Station} to another.
     */
    links: MetroLine[];
    /**
     * The list of {@link Station}s.
     */
    nodes: Station[];
    /**
     * A description of where the data comes from.
     */
    source?: string;
    /**
     * By default the nodes are labeled as 'station', but depending on the
     * nature of the data, it can be convenient to label the nodes in accordance
     * with the entity they represent. This property stores that entity name.
     */
    stationlabel?: string;
}
