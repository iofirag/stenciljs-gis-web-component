/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

// =========== SHAPES =========
var ShapeType;
(function (ShapeType) {
    ShapeType[ShapeType["CIRCLE"] = 0] = "CIRCLE";
    ShapeType[ShapeType["POLYGON"] = 1] = "POLYGON";
    ShapeType[ShapeType["MARKER"] = 2] = "MARKER";
    ShapeType[ShapeType["POLYLINE"] = 3] = "POLYLINE";
    ShapeType[ShapeType["LABEL"] = 4] = "LABEL";
    ShapeType[ShapeType["MULTIPOLYGON"] = 5] = "MULTIPOLYGON";
})(ShapeType || (ShapeType = {}));
var DropDownItemType;
(function (DropDownItemType) {
    DropDownItemType[DropDownItemType["REGULAR"] = 0] = "REGULAR";
    DropDownItemType[DropDownItemType["RADIO_BUTTON"] = 1] = "RADIO_BUTTON";
    DropDownItemType[DropDownItemType["CHECK_BOX"] = 2] = "CHECK_BOX";
})(DropDownItemType || (DropDownItemType = {}));

// export * from './shapeLayerContainer'

export { DropDownItemType };
