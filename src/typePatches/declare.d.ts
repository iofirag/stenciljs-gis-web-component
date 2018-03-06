
declare module "@cc/shp-write" {
    var module: {
        zip: (obj: { type: string, features: L.GeoJSON[]}) => string, write: Function, download: Function };
    export = module;
}