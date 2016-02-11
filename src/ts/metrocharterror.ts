/*
 * Not sure why the {@link MetroChartError} class works like it does
 */
class MetroChartError extends Error {

    public message : string;
    public name    : string;

    constructor(message: string) {

        // call the super class (Error)'s constructor:
        super(message);

        this.name = 'MetroChartError';
        this.message = message;
    }
}
