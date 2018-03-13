/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { FULL_SCREEN_PLUGIN_TAG, default$1 as L$1, GIS_VIEWER_TAG, MAP_CONTAINER_TAG, TOOL_BAR_TAG } from './chunk1.js';
import _ from './chunk2.js';

class DevComponent {
    //document.querySelector('gis-viewer').addEventListener('drawCreated', (e) => { console.log(e.detail) })
    // @Listen('mapReady') mapReadyEventHandler(e: CustomEvent) {
    //     console.log('Received the custom mapReady event', e);
    // }
    // @Listen('moveEnd') moveEndEventHandler(e: CustomEvent) {
    //     console.log('Received the custom moveEnd event:', e.detail);
    // }
    // @Listen('drawCreated') drawCreatedEventHandler(e: CustomEvent) {
    //     console.log(e.detail)
    // }
    // @Listen('drawEdited') drawEditedEventHandler(e: CustomEvent) {
    //     console.log(e.detail)
    // }
    // @Listen('drawDeleted') drawDeletedEventHandler(e: CustomEvent) {
    //     console.log(e.detail)
    // }
    // @Listen('endImportDraw') endImportDrawEventHandler(e: CustomEvent) {
    //     console.log(e.detail)
    // }
    // @Listen('selectionDone') selectionDoneEventHandler(e: CustomEvent) {
    //     console.log(e.detail)
    // }
    // @Listen('boundsChanged') boundsChangedEventHandler(e: CustomEvent) {
    //     console.log(e.detail)
    // }
    componentWillLoad() {
        this.gisViewerState = this.createDevState();
    }
    render() {
        return h("div", { class: "dev-components" },
            h("div", { class: "header" },
                h("header", { title: "This is a GIS Viewer component Application" })),
            h("div", { class: "body" },
                h("div", { class: "sideMenu" },
                    h("input", { type: "button", value: "Zoom To Extend", onClick: e => this.testZoomToExtend(e) }),
                    h("input", { type: "button", value: "Change Units distance", onClick: e => this.testChangeDistanceUnits(e) }),
                    h("input", { type: "button", value: "Change Coordinate System", onClick: e => this.testChangeCoordinateSystem(e) })),
                h("div", { class: "gisWrapper" },
                    h("gis-viewer", { gisViewerProps: this.gisViewerState }))));
    }
    componentDidLoad() {
        this.gisViewerEl = document.querySelector('gis-viewer');
        // this.gisViewerEl.addEventListener('moveEnd', (ev: any) => {
        //     console.log(ev.detail);
        // });
        // this.gisViewerEl.addEventListener('mapReady', (ev) => {
        //     console.log(ev, this);
        //     // ev.detail contains the data passed out from the component
        //     // Handle event here...
        // });
    }
    // @Event
    testZoomToExtend(e) {
        console.log("Testing zoomToExtent command", e.type);
        // this.gisViewerEl.zoomToExtend();
    }
    testChangeDistanceUnits(e) {
        console.log("Testing ChangeDistanceUnits command", e.type);
        this.gisViewerEl.changeDistanceUnits();
    }
    testChangeCoordinateSystem(e) {
        console.log("Testing changeCoordinateSystem command", e.type);
        this.gisViewerEl.changeCoordinateSystem();
    }
    createDevState() {
        const protocol = "http:";
        const mapConfig = {
            isMetric: true,
            isZoomToExtentOnNewData: true,
            isWheelZoomOnlyAfterClick: true,
            isFlyToBounds: true,
            clusterOptions: {},
            mode: "cluster",
            distanceUnitType: 'km',
            coordinateSystemType: 'gps',
        };
        const tileLayers = [
            {
                name: "Online Map",
                tilesURI: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
                // zoom: 1,
                // center: {
                // 	lat:0,
                // 	lng: 0
                // },
                minZoom: 1,
                maxZoom: 18,
                attributionControl: false
                // zoomControl: false
            },
            {
                name: "Verint Map",
                tilesURI: protocol + "//osm/osm_tiles/{z}/{x}/{y}.png",
                // zoom: 1,
                // center: {
                // 	lat: 32.076304,
                // 	lng: 35.013960
                // },
                minZoom: 1,
                maxZoom: 20,
                attributionControl: false
                // zoomControl: false
            }
        ];
        const shapeLayers = [
            {
                layerName: "Test data 1",
                // isDisplay: false,
                shapes: [
                    {
                        shapeWkt: "POLYGON((-14.765625 17.052584352706003,-12.83203125 15.703433338617463,-15.99609375 15.534142999890243,-14.765625 17.052584352706003))",
                        data: {
                            name: "232 (known as polygon1)",
                            id: "polygon1"
                        }
                    },
                    {
                        shapeWkt: "POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))",
                        data: {
                            name: "232 (known as polygon1)",
                            id: "polygon1"
                        }
                    },
                    {
                        shapeWkt: "LINESTRING(1 1 1,5 5 5,7 7 5)",
                        data: {
                            name: "232 (known as polygon1)",
                            id: "polygon1"
                        }
                    }
                ]
            }
        ];
        const layersControllerConfig = {
            enable: true
        };
        const scaleControlConfig = {
            enable: true,
            scaleControlOptions: {
                position: "bottomright"
            }
        };
        const searchBoxConfig = {
            enable: true,
            searchBoxOptions: {
                searchOnLayer: true,
                queryServerUrl: protocol +
                    "//osm/nominatim?format=json&limit=3&type=administrative&q={s}" // 'http://10.164.39.38/nominatim/search.php?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}'
            }
        };
        const miniMapConfig = {
            enable: true,
            miniMapOptions: {
                toggleDisplay: true
            }
        };
        const zoomControlConfig = {
            enable: true
        };
        const drawBarConfig = {
            enable: true,
            drawBarOptions: {
                draw: {
                    polyline: true,
                    polygon: true,
                    circle: true,
                    rectangle: true,
                    marker: true,
                },
                edit: {
                    remove: true // Turns on remove button
                }
            }
        };
        const mouseCoordinateConfig = {
            enable: true,
        };
        const measureConfig = {
            enable: true,
            measureOptions: {}
        };
        const zoomToExtentConfig = {
            enable: true,
            zoomToExtentOptions: {
                position: "topright"
            }
        };
        const unitsChangerConfig = {
            enable: true
        };
        const fullScreenConfig = {
            enable: true
        };
        const toolbarConfig = {
            isImportExport: true,
            isToolbarSettings: true,
            toolbarPluginsConfig: {
                layersControllerConfig, fullScreenConfig, measureConfig,
                unitsChangerConfig, zoomControlConfig, zoomToExtentConfig,
                drawBarConfig, searchBoxConfig
            }
        };
        const mapPluginsConfig = {
            miniMapConfig, scaleControlConfig, mouseCoordinateConfig
        };
        return {
            tileLayers,
            mapConfig,
            shapeLayers,
            toolbarConfig,
            mapPluginsConfig,
        };
    }
    static get is() { return "dev-component"; }
    static get properties() { return { "gisViewerState": { "state": true } }; }
    static get style() { return "dev-component {\n  width: 100%;\n}"; }
}

L.Control.Fullscreen = L.Control.extend({
    options: {
        position: 'topleft',
        title: {
            'false': 'View Fullscreen',
            'true': 'Exit Fullscreen'
        }
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar leaflet-control');

        this.link = L.DomUtil.create('a', 'leaflet-control-fullscreen-button leaflet-bar-part', container);
        this.link.href = '#';

        this._map = map;
        this._map.on('fullscreenchange', this._toggleTitle, this);
        this._toggleTitle();

        L.DomEvent.on(this.link, 'click', this._click, this);

        return container;
    },

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        this._map.toggleFullscreen(this.options);
    },

    _toggleTitle: function() {
        this.link.title = this.options.title[this._map.isFullscreen()];
    }
});

L.Map.include({
    isFullscreen: function () {
        return this._isFullscreen || false;
    },

    toggleFullscreen: function (options) {
        var container = this.getContainer();
        if (this.isFullscreen()) {
            if (options && options.pseudoFullscreen) {
                this._disablePseudoFullscreen(container);
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else {
                this._disablePseudoFullscreen(container);
            }
        } else {
            if (options && options.pseudoFullscreen) {
                this._enablePseudoFullscreen(container);
            } else if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            } else {
                this._enablePseudoFullscreen(container);
            }
        }

    },

    _enablePseudoFullscreen: function (container) {
        L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
        this._setFullscreen(true);
        this.fire('fullscreenchange');
    },

    _disablePseudoFullscreen: function (container) {
        L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
        this._setFullscreen(false);
        this.fire('fullscreenchange');
    },

    _setFullscreen: function(fullscreen) {
        this._isFullscreen = fullscreen;
        var container = this.getContainer();
        if (fullscreen) {
            L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
        } else {
            L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');
        }
        this.invalidateSize();
    },

    _onFullscreenChange: function (e) {
        var fullscreenElement =
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement;

        if (fullscreenElement === this.getContainer() && !this._isFullscreen) {
            this._setFullscreen(true);
            this.fire('fullscreenchange');
        } else if (fullscreenElement !== this.getContainer() && this._isFullscreen) {
            this._setFullscreen(false);
            this.fire('fullscreenchange');
        }
    }
});

L.Map.mergeOptions({
    fullscreenControl: false
});

L.Map.addInitHook(function () {
    if (this.options.fullscreenControl) {
        this.fullscreenControl = new L.Control.Fullscreen(this.options.fullscreenControl);
        this.addControl(this.fullscreenControl);
    }

    var fullscreenchange;

    if ('onfullscreenchange' in document) {
        fullscreenchange = 'fullscreenchange';
    } else if ('onmozfullscreenchange' in document) {
        fullscreenchange = 'mozfullscreenchange';
    } else if ('onwebkitfullscreenchange' in document) {
        fullscreenchange = 'webkitfullscreenchange';
    } else if ('onmsfullscreenchange' in document) {
        fullscreenchange = 'MSFullscreenChange';
    }

    if (fullscreenchange) {
        var onFullscreenChange = L.bind(this._onFullscreenChange, this);

        this.whenReady(function () {
            L.DomEvent.on(document, fullscreenchange, onFullscreenChange);
        });

        this.on('unload', function () {
            L.DomEvent.off(document, fullscreenchange, onFullscreenChange);
        });
    }
});

L.control.fullscreen = function (options) {
    return new L.Control.Fullscreen(options);
};


var fullscreen = Object.freeze({

});

class FullScreenPlugin {
    constructor() {
        this.compName = FULL_SCREEN_PLUGIN_TAG;
    }
    // @Event() distanceUnitsEm: EventEmitter;
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.fullScreenControl = this.createPlugin();
        this.gisMap.addControl(this.fullScreenControl);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.fullScreenControl);
    }
    createPlugin() {
        try {
            const customControl = L$1.Control.extend({
                // options: options,
                onAdd: () => {
                    const container = L$1.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom leaflet-control-fullscreen");
                    let a = document.createElement("a");
                    container.appendChild(a);
                    container.setAttribute("title", "Full-Screen");
                    container.addEventListener("click", this.buttonClickHandler.bind(this));
                    return container;
                }
            });
            return new customControl();
        }
        catch (e) {
            console.error("failed to create custom control: " + e);
            return null;
        }
    }
    buttonClickHandler() {
        console.log(`${this.compName} click`);
        Utils.doNothing(fullscreen);
        this.gisMap.toggleFullscreen();
        // this.distanceUnitsEm.emit('mile');
        // this.distanceUnitsEm.emit('km');
    }
    static get is() { return "full-screen-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "fullScreenControl": { "state": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return ".leaflet-control-fullscreen a {\n  background:#fff url(fullscreen.png) no-repeat 0 0;\n  background-size:26px 52px;\n  }\n  .leaflet-touch .leaflet-control-fullscreen a {\n    background-position: 2px 2px;\n    }\n  .leaflet-fullscreen-on .leaflet-control-fullscreen a {\n    background-position:0 -26px;\n    }\n  .leaflet-touch.leaflet-fullscreen-on .leaflet-control-fullscreen a {\n    background-position: 2px -24px;\n    }\n\n/* Do not combine these two rules; IE will break. */\n.leaflet-container:-webkit-full-screen {\n  width:100%!important;\n  height:100%!important;\n  }\n.leaflet-container.leaflet-fullscreen-on {\n  width:100%!important;\n  height:100%!important;\n  }\n\n.leaflet-pseudo-fullscreen {\n  position:fixed!important;\n  width:100%!important;\n  height:100%!important;\n  top:0!important;\n  left:0!important;\n  z-index:99999;\n  }\n\n\@media\n  (-webkit-min-device-pixel-ratio:2),\n  (min-resolution:192dpi) {\n    .leaflet-control-fullscreen a {\n      background-image:url(fullscreen\@2x.png);\n    }\n  }\n\n\n.leaflet-control-fullscreen a {\n  background: #fff url(\"./images/fullscreen.png\") no-repeat 0 0;\n}"; }
}

class GisViewer {
    constructor() {
        this.compName = GIS_VIEWER_TAG;
    }
    changeDistanceUnits() {
        this.mapContainerEl.changeDistanceUnits();
    }
    changeCoordinateSystem() {
        this.mapContainerEl.changeCoordinateSystem();
    }
    render() {
        return h("map-container", { id: "map", gisViewerProps: this.gisViewerProps });
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.mapContainerEl = document.querySelector("map-container");
        // const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        // L.tileLayer(osmUrl, {}).addTo(mapContainerEl.gisMap);
        // L.marker([32, 35]).addTo(mapContainerEl.gisMap)
        //   .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        //   .openPopup();
    }
    static get is() { return "gis-viewer"; }
    static get properties() { return { "changeCoordinateSystem": { "method": true }, "changeDistanceUnits": { "method": true }, "gisViewerProps": { "type": "Any", "attr": "gis-viewer-props" } }; }
    static get style() { return "gis-viewer #map {\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 90%;\n  z-index: 1;\n  position: absolute !important;\n}\n\n.marker-svg {\n  stroke-width: 2px;\n  outline: none;\n  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));\n}\n\n.marker-svg path {\n  transition: all 0.2s ease-in-out;\n}\n\n.intecept-svg {\n  outline: none;\n  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));\n}\n\n.intecept-svg .first-circle,\n.intecept-svg .secon-circle,\n.intecept-svg .third-circle {\n  display: none;\n}\n\n.intecept-svg .circle-1, .intecept-svg .circle-2, .intecept-svg .circle-3 {\n  fill: transparent;\n  display: none;\n  stroke: #00a6da;\n  stroke-width: 5%;\n  transform: scale(0.5);\n  transform-origin: center center;\n  animation: pulse-me 1.5s linear infinite;\n}\n\n.intecept-svg .circle-2 {\n  animation-delay: 0.5s;\n}\n\n.intecept-svg .circle-3 {\n  animation-delay: 1s;\n}\n\n.intecept-svg #circle {\n  transition: all 0.2s ease-in-out;\n}\n\n.intecept-svg #v-sign {\n  transition: all 0.2s ease-in-out;\n}\n\n.intecept-svg.highlighted .circle-1, .intecept-svg.highlighted .circle-2, .intecept-svg.highlighted .circle-3,\n.intecept-svg.highlighted .circle-2,\n.intecept-svg.highlighted .circle-3 {\n  display: block;\n}\n\n.intecept-svg.highlighted svg {\n  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1));\n}\n\n.tooltip-row {\n  display: flex;\n  margin: 8px 0;\n}\n\n.tooltip-row-key {\n  margin-right: 24px;\n  min-width: 64px;\n}\n\n.tooltip-row-value {\n  min-width: 100px;\n  color: rgba(0, 0, 0, 0.54);\n}\n\n.tooltip-row-key,\n.tooltip-row-value {\n  display: block;\n}\n\n.tooltip-row-key::first-letter,\n.tooltip-row-value::first-letter {\n  text-transform: capitalize;\n}\n\n.clsCluster {\n  width: 40px !important;\n  height: 40px !important;\n  margin-left: -20px !important;\n  margin-top: -20px !important;\n}\n\n.leaflet-touch .leaflet-control-layers-toggle {\n  width: 30px;\n  height: 30px;\n  background-size: 22px 22px;\n}\n\n.leaflet-touch .geocoder-control {\n  height: 30px;\n  width: 30px;\n  background-size: 22px 22px;\n}\n\n.leaflet-touch .geocoder-control-input {\n  height: 30px;\n}\n\n.leaflet-control-custom {\n  width: 30px;\n  height: 30px;\n  background-color: white;\n  background-size: 22px 22px;\n  background-repeat: no-repeat;\n  background-position: center;\n}\n\n.leaflet-zoom-hide {\n  z-index: 2;\n}\n\n.clsGis {\n  width: 100%;\n  height: 300px;\n}\n\n.clsClusterLastChild {\n  background-color: rgba(188, 188, 188, 0.7);\n}\n\n.leaflet-map-pane canvas {\n  z-index: 450;\n}\n\n.firstSeenWkt {\n  stroke: #06b01c;\n  stroke-opacity: 1;\n  stroke-width: 3;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  fill: #06b01c;\n  fill-opacity: 0.2;\n  fill-rule: evenodd;\n}\n\n.lastSeenWkt {\n  stroke: #15a4f9;\n  stroke-opacity: 1;\n  stroke-width: 3;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  fill: #15a4f9;\n  fill-opacity: 0.2;\n  fill-rule: evenodd;\n}\n\n.leaflet-control-attribution {\n  display: none;\n}\n\n.leaflet-control {\n  cursor: pointer;\n}\n\n.leaflet-left,\n.leaflet-right,\n.leaflet-top,\n.leaflet-bottom {\n  z-index: 50;\n}\n\n.leaflet-marker-icon.textLabelClass {\n  width: initial !important;\n  height: initial !important;\n  white-space: nowrap;\n  text-shadow: 0 0 0.1em black, 0 0 0.1em black, 0 0 0.1em black,\n 0 0 0.1em black, 0 0 0.1em;\n  color: yellow;\n}\n\n.export-button,\n.import-button {\n  position: absolute;\n  z-index: 9;\n}\n\n.export-button {\n  left: 100px;\n}\n\n.import-button {\n  left: 157px;\n}\n\n.close-bt {\n  cursor: pointer;\n  position: absolute;\n  top: 20px;\n  right: 20px;\n  width: 20px;\n}\n\n.leaflet-interactive {\n  transition: fill 0.2s ease-in-out;\n}\n\n\@keyframes pulse-me {\n  0% {\n    stroke: rgba(0, 166, 218, 0);\n  }\n  50% {\n    stroke: rgba(0, 166, 218, 0.4);\n    stroke-width: 5%;\n  }\n  70% {\n    stroke: #00a6da;\n  }\n  100% {\n    transform: scale(1.8);\n    stroke: rgba(0, 166, 218, 0);\n    stroke-width: 1%;\n  }\n}\n\n.marker-cluster {\n  display: flex !important;\n  justify-content: center;\n  align-items: center;\n  background-color: #505050;\n  box-shadow: 1px 1px 3px 2px rgba(61, 61, 61, 0.1);\n}\n\n.marker-cluster div {\n  margin: 0px !important;\n  background-color: initial !important;\n}\n\n.marker-cluster span {\n  color: white;\n  font-size: 9px;\n}\n\n.marker-cluster.highlighted {\n  animation: pulse-me-cluster 1s linear infinite;\n}\n\n.marker-cluster.selected-cluster {\n  background-color: #ffffcc;\n  box-shadow: inset 0px 0px 0px 2px #00a6da, 1px 1px 3px 2px rgba(61, 61, 61, 0.1);\n}\n\n.marker-cluster.selected-cluster span {\n  color: #00a6da;\n}\n\n.marker-cluster.selected-cluster.highlighted {\n  animation: pulse-me-cluster-selected 1s linear infinite;\n}\n\n\@keyframes pulse-me-cluster {\n  0% {\n    box-shadow: 0px 0px 0px 0px rgba(0, 166, 218, 0);\n  }\n  50% {\n    box-shadow: 0px 0px 0px 4px rgba(0, 166, 218, 0.8);\n  }\n  100% {\n    box-shadow: 0px 0px 0px 0px rgba(0, 166, 218, 0);\n  }\n}\n\n\@keyframes pulse-me-cluster-selected {\n  0% {\n    box-shadow: 0px 0px 0px 0px rgba(0, 166, 218, 0), inset 0px 0px 0px 2px rgba(0, 166, 218, 0.8);\n  }\n  50% {\n    box-shadow: 0px 0px 0px 4px rgba(0, 166, 218, 0.8), inset 0px 0px 0px 2px rgba(0, 166, 218, 0.8);\n  }\n  100% {\n    box-shadow: 0px 0px 0px 0px rgba(0, 166, 218, 0), inset 0px 0px 0px 2px rgba(0, 166, 218, 0.8);\n  }\n}\n\n\n/* required styles */\n\n.leaflet-pane,\n.leaflet-tile,\n.leaflet-marker-icon,\n.leaflet-marker-shadow,\n.leaflet-tile-container,\n.leaflet-pane > svg,\n.leaflet-pane > canvas,\n.leaflet-zoom-box,\n.leaflet-image-layer,\n.leaflet-layer {\n	position: absolute;\n	left: 0;\n	top: 0;\n	}\n.leaflet-container {\n	overflow: hidden;\n	}\n.leaflet-tile,\n.leaflet-marker-icon,\n.leaflet-marker-shadow {\n	-webkit-user-select: none;\n	   -moz-user-select: none;\n	        user-select: none;\n	  -webkit-user-drag: none;\n	}\n/* Safari renders non-retina tile on retina better with this, but Chrome is worse */\n.leaflet-safari .leaflet-tile {\n	image-rendering: -webkit-optimize-contrast;\n	}\n/* hack that prevents hw layers \"stretching\" when loading new tiles */\n.leaflet-safari .leaflet-tile-container {\n	width: 1600px;\n	height: 1600px;\n	-webkit-transform-origin: 0 0;\n	}\n.leaflet-marker-icon,\n.leaflet-marker-shadow {\n	display: block;\n	}\n/* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */\n/* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */\n.leaflet-container .leaflet-overlay-pane svg,\n.leaflet-container .leaflet-marker-pane img,\n.leaflet-container .leaflet-shadow-pane img,\n.leaflet-container .leaflet-tile-pane img,\n.leaflet-container img.leaflet-image-layer {\n	max-width: none !important;\n	max-height: none !important;\n	}\n\n.leaflet-container.leaflet-touch-zoom {\n	-ms-touch-action: pan-x pan-y;\n	touch-action: pan-x pan-y;\n	}\n.leaflet-container.leaflet-touch-drag {\n	-ms-touch-action: pinch-zoom;\n	/* Fallback for FF which doesn't support pinch-zoom */\n	touch-action: none;\n	touch-action: pinch-zoom;\n}\n.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {\n	-ms-touch-action: none;\n	touch-action: none;\n}\n.leaflet-container {\n	-webkit-tap-highlight-color: transparent;\n}\n.leaflet-container a {\n	-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);\n}\n.leaflet-tile {\n	filter: inherit;\n	visibility: hidden;\n	}\n.leaflet-tile-loaded {\n	visibility: inherit;\n	}\n.leaflet-zoom-box {\n	width: 0;\n	height: 0;\n	-moz-box-sizing: border-box;\n	     box-sizing: border-box;\n	z-index: 800;\n	}\n/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */\n.leaflet-overlay-pane svg {\n	-moz-user-select: none;\n	}\n\n.leaflet-pane         { z-index: 400; }\n\n.leaflet-tile-pane    { z-index: 200; }\n.leaflet-overlay-pane { z-index: 400; }\n.leaflet-shadow-pane  { z-index: 500; }\n.leaflet-marker-pane  { z-index: 600; }\n.leaflet-tooltip-pane   { z-index: 650; }\n.leaflet-popup-pane   { z-index: 700; }\n\n.leaflet-map-pane canvas { z-index: 100; }\n.leaflet-map-pane svg    { z-index: 200; }\n\n.leaflet-vml-shape {\n	width: 1px;\n	height: 1px;\n	}\n.lvml {\n	behavior: url(#default#VML);\n	display: inline-block;\n	position: absolute;\n	}\n\n\n/* control positioning */\n\n.leaflet-control {\n	position: relative;\n	z-index: 800;\n	pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */\n	pointer-events: auto;\n	}\n.leaflet-top,\n.leaflet-bottom {\n	position: absolute;\n	z-index: 1000;\n	pointer-events: none;\n	}\n.leaflet-top {\n	top: 0;\n	}\n.leaflet-right {\n	right: 0;\n	}\n.leaflet-bottom {\n	bottom: 0;\n	}\n.leaflet-left {\n	left: 0;\n	}\n.leaflet-control {\n	float: left;\n	clear: both;\n	}\n.leaflet-right .leaflet-control {\n	float: right;\n	}\n.leaflet-top .leaflet-control {\n	margin-top: 10px;\n	}\n.leaflet-bottom .leaflet-control {\n	margin-bottom: 10px;\n	}\n.leaflet-left .leaflet-control {\n	margin-left: 10px;\n	}\n.leaflet-right .leaflet-control {\n	margin-right: 10px;\n	}\n\n\n/* zoom and fade animations */\n\n.leaflet-fade-anim .leaflet-tile {\n	will-change: opacity;\n	}\n.leaflet-fade-anim .leaflet-popup {\n	opacity: 0;\n	-webkit-transition: opacity 0.2s linear;\n	   -moz-transition: opacity 0.2s linear;\n	     -o-transition: opacity 0.2s linear;\n	        transition: opacity 0.2s linear;\n	}\n.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {\n	opacity: 1;\n	}\n.leaflet-zoom-animated {\n	-webkit-transform-origin: 0 0;\n	    -ms-transform-origin: 0 0;\n	        transform-origin: 0 0;\n	}\n.leaflet-zoom-anim .leaflet-zoom-animated {\n	will-change: transform;\n	}\n.leaflet-zoom-anim .leaflet-zoom-animated {\n	-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);\n	   -moz-transition:    -moz-transform 0.25s cubic-bezier(0,0,0.25,1);\n	     -o-transition:      -o-transform 0.25s cubic-bezier(0,0,0.25,1);\n	        transition:         transform 0.25s cubic-bezier(0,0,0.25,1);\n	}\n.leaflet-zoom-anim .leaflet-tile,\n.leaflet-pan-anim .leaflet-tile {\n	-webkit-transition: none;\n	   -moz-transition: none;\n	     -o-transition: none;\n	        transition: none;\n	}\n\n.leaflet-zoom-anim .leaflet-zoom-hide {\n	visibility: hidden;\n	}\n\n\n/* cursors */\n\n.leaflet-interactive {\n	cursor: pointer;\n	}\n.leaflet-grab {\n	cursor: -webkit-grab;\n	cursor:    -moz-grab;\n	}\n.leaflet-crosshair,\n.leaflet-crosshair .leaflet-interactive {\n	cursor: crosshair;\n	}\n.leaflet-popup-pane,\n.leaflet-control {\n	cursor: auto;\n	}\n.leaflet-dragging .leaflet-grab,\n.leaflet-dragging .leaflet-grab .leaflet-interactive,\n.leaflet-dragging .leaflet-marker-draggable {\n	cursor: move;\n	cursor: -webkit-grabbing;\n	cursor:    -moz-grabbing;\n	}\n\n/* marker & overlays interactivity */\n.leaflet-marker-icon,\n.leaflet-marker-shadow,\n.leaflet-image-layer,\n.leaflet-pane > svg path,\n.leaflet-tile-container {\n	pointer-events: none;\n	}\n\n.leaflet-marker-icon.leaflet-interactive,\n.leaflet-image-layer.leaflet-interactive,\n.leaflet-pane > svg path.leaflet-interactive {\n	pointer-events: visiblePainted; /* IE 9-10 doesn't have auto */\n	pointer-events: auto;\n	}\n\n/* visual tweaks */\n\n.leaflet-container {\n	background: #ddd;\n	outline: 0;\n	}\n.leaflet-container a {\n	color: #0078A8;\n	}\n.leaflet-container a.leaflet-active {\n	outline: 2px solid orange;\n	}\n.leaflet-zoom-box {\n	border: 2px dotted #38f;\n	background: rgba(255,255,255,0.5);\n	}\n\n\n/* general typography */\n.leaflet-container {\n	font: 12px/1.5 \"Helvetica Neue\", Arial, Helvetica, sans-serif;\n	}\n\n\n/* general toolbar styles */\n\n.leaflet-bar {\n	box-shadow: 0 1px 5px rgba(0,0,0,0.65);\n	border-radius: 4px;\n	}\n.leaflet-bar a,\n.leaflet-bar a:hover {\n	background-color: #fff;\n	border-bottom: 1px solid #ccc;\n	width: 26px;\n	height: 26px;\n	line-height: 26px;\n	display: block;\n	text-align: center;\n	text-decoration: none;\n	color: black;\n	}\n.leaflet-bar a,\n.leaflet-control-layers-toggle {\n	background-position: 50% 50%;\n	background-repeat: no-repeat;\n	display: block;\n	}\n.leaflet-bar a:hover {\n	background-color: #f4f4f4;\n	}\n.leaflet-bar a:first-child {\n	border-top-left-radius: 4px;\n	border-top-right-radius: 4px;\n	}\n.leaflet-bar a:last-child {\n	border-bottom-left-radius: 4px;\n	border-bottom-right-radius: 4px;\n	border-bottom: none;\n	}\n.leaflet-bar a.leaflet-disabled {\n	cursor: default;\n	background-color: #f4f4f4;\n	color: #bbb;\n	}\n\n.leaflet-touch .leaflet-bar a {\n	width: 30px;\n	height: 30px;\n	line-height: 30px;\n	}\n.leaflet-touch .leaflet-bar a:first-child {\n	border-top-left-radius: 2px;\n	border-top-right-radius: 2px;\n	}\n.leaflet-touch .leaflet-bar a:last-child {\n	border-bottom-left-radius: 2px;\n	border-bottom-right-radius: 2px;\n	}\n\n/* zoom control */\n\n.leaflet-control-zoom-in,\n.leaflet-control-zoom-out {\n	font: bold 18px 'Lucida Console', Monaco, monospace;\n	text-indent: 1px;\n	}\n\n.leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out  {\n	font-size: 22px;\n	}\n\n\n/* layers control */\n\n.leaflet-control-layers {\n	box-shadow: 0 1px 5px rgba(0,0,0,0.4);\n	background: #fff;\n	border-radius: 5px;\n	}\n.leaflet-control-layers-toggle {\n	background-image: url(images/layers.png);\n	width: 36px;\n	height: 36px;\n	}\n.leaflet-retina .leaflet-control-layers-toggle {\n	background-image: url(images/layers-2x.png);\n	background-size: 26px 26px;\n	}\n.leaflet-touch .leaflet-control-layers-toggle {\n	width: 44px;\n	height: 44px;\n	}\n.leaflet-control-layers .leaflet-control-layers-list,\n.leaflet-control-layers-expanded .leaflet-control-layers-toggle {\n	display: none;\n	}\n.leaflet-control-layers-expanded .leaflet-control-layers-list {\n	display: block;\n	position: relative;\n	}\n.leaflet-control-layers-expanded {\n	padding: 6px 10px 6px 6px;\n	color: #333;\n	background: #fff;\n	}\n.leaflet-control-layers-scrollbar {\n	overflow-y: scroll;\n	overflow-x: hidden;\n	padding-right: 5px;\n	}\n.leaflet-control-layers-selector {\n	margin-top: 2px;\n	position: relative;\n	top: 1px;\n	}\n.leaflet-control-layers label {\n	display: block;\n	}\n.leaflet-control-layers-separator {\n	height: 0;\n	border-top: 1px solid #ddd;\n	margin: 5px -10px 5px -6px;\n	}\n\n/* Default icon URLs */\n.leaflet-default-icon-path {\n	background-image: url(images/marker-icon.png);\n	}\n\n\n/* attribution and scale controls */\n\n.leaflet-container .leaflet-control-attribution {\n	background: #fff;\n	background: rgba(255, 255, 255, 0.7);\n	margin: 0;\n	}\n.leaflet-control-attribution,\n.leaflet-control-scale-line {\n	padding: 0 5px;\n	color: #333;\n	}\n.leaflet-control-attribution a {\n	text-decoration: none;\n	}\n.leaflet-control-attribution a:hover {\n	text-decoration: underline;\n	}\n.leaflet-container .leaflet-control-attribution,\n.leaflet-container .leaflet-control-scale {\n	font-size: 11px;\n	}\n.leaflet-left .leaflet-control-scale {\n	margin-left: 5px;\n	}\n.leaflet-bottom .leaflet-control-scale {\n	margin-bottom: 5px;\n	}\n.leaflet-control-scale-line {\n	border: 2px solid #777;\n	border-top: none;\n	line-height: 1.1;\n	padding: 2px 5px 1px;\n	font-size: 11px;\n	white-space: nowrap;\n	overflow: hidden;\n	-moz-box-sizing: border-box;\n	     box-sizing: border-box;\n\n	background: #fff;\n	background: rgba(255, 255, 255, 0.5);\n	}\n.leaflet-control-scale-line:not(:first-child) {\n	border-top: 2px solid #777;\n	border-bottom: none;\n	margin-top: -2px;\n	}\n.leaflet-control-scale-line:not(:first-child):not(:last-child) {\n	border-bottom: 2px solid #777;\n	}\n\n.leaflet-touch .leaflet-control-attribution,\n.leaflet-touch .leaflet-control-layers,\n.leaflet-touch .leaflet-bar {\n	box-shadow: none;\n	}\n.leaflet-touch .leaflet-control-layers,\n.leaflet-touch .leaflet-bar {\n	border: 2px solid rgba(0,0,0,0.2);\n	background-clip: padding-box;\n	}\n\n\n/* popup */\n\n.leaflet-popup {\n	position: absolute;\n	text-align: center;\n	margin-bottom: 20px;\n	}\n.leaflet-popup-content-wrapper {\n	padding: 1px;\n	text-align: left;\n	border-radius: 12px;\n	}\n.leaflet-popup-content {\n	margin: 13px 19px;\n	line-height: 1.4;\n	}\n.leaflet-popup-content p {\n	margin: 18px 0;\n	}\n.leaflet-popup-tip-container {\n	width: 40px;\n	height: 20px;\n	position: absolute;\n	left: 50%;\n	margin-left: -20px;\n	overflow: hidden;\n	pointer-events: none;\n	}\n.leaflet-popup-tip {\n	width: 17px;\n	height: 17px;\n	padding: 1px;\n\n	margin: -10px auto 0;\n\n	-webkit-transform: rotate(45deg);\n	   -moz-transform: rotate(45deg);\n	    -ms-transform: rotate(45deg);\n	     -o-transform: rotate(45deg);\n	        transform: rotate(45deg);\n	}\n.leaflet-popup-content-wrapper,\n.leaflet-popup-tip {\n	background: white;\n	color: #333;\n	box-shadow: 0 3px 14px rgba(0,0,0,0.4);\n	}\n.leaflet-container a.leaflet-popup-close-button {\n	position: absolute;\n	top: 0;\n	right: 0;\n	padding: 4px 4px 0 0;\n	border: none;\n	text-align: center;\n	width: 18px;\n	height: 14px;\n	font: 16px/14px Tahoma, Verdana, sans-serif;\n	color: #c3c3c3;\n	text-decoration: none;\n	font-weight: bold;\n	background: transparent;\n	}\n.leaflet-container a.leaflet-popup-close-button:hover {\n	color: #999;\n	}\n.leaflet-popup-scrolled {\n	overflow: auto;\n	border-bottom: 1px solid #ddd;\n	border-top: 1px solid #ddd;\n	}\n\n.leaflet-oldie .leaflet-popup-content-wrapper {\n	zoom: 1;\n	}\n.leaflet-oldie .leaflet-popup-tip {\n	width: 24px;\n	margin: 0 auto;\n\n	-ms-filter: \"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";\n	filter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);\n	}\n.leaflet-oldie .leaflet-popup-tip-container {\n	margin-top: -1px;\n	}\n\n.leaflet-oldie .leaflet-control-zoom,\n.leaflet-oldie .leaflet-control-layers,\n.leaflet-oldie .leaflet-popup-content-wrapper,\n.leaflet-oldie .leaflet-popup-tip {\n	border: 1px solid #999;\n	}\n\n\n/* div icon */\n\n.leaflet-div-icon {\n	background: #fff;\n	border: 1px solid #666;\n	}\n\n\n/* Tooltip */\n/* Base styles for the element that has a tooltip */\n.leaflet-tooltip {\n	position: absolute;\n	padding: 6px;\n	background-color: #fff;\n	border: 1px solid #fff;\n	border-radius: 3px;\n	color: #222;\n	white-space: nowrap;\n	-webkit-user-select: none;\n	-moz-user-select: none;\n	-ms-user-select: none;\n	user-select: none;\n	pointer-events: none;\n	box-shadow: 0 1px 3px rgba(0,0,0,0.4);\n	}\n.leaflet-tooltip.leaflet-clickable {\n	cursor: pointer;\n	pointer-events: auto;\n	}\n.leaflet-tooltip-top:before,\n.leaflet-tooltip-bottom:before,\n.leaflet-tooltip-left:before,\n.leaflet-tooltip-right:before {\n	position: absolute;\n	pointer-events: none;\n	border: 6px solid transparent;\n	background: transparent;\n	content: \"\";\n	}\n\n/* Directions */\n\n.leaflet-tooltip-bottom {\n	margin-top: 6px;\n}\n.leaflet-tooltip-top {\n	margin-top: -6px;\n}\n.leaflet-tooltip-bottom:before,\n.leaflet-tooltip-top:before {\n	left: 50%;\n	margin-left: -6px;\n	}\n.leaflet-tooltip-top:before {\n	bottom: 0;\n	margin-bottom: -12px;\n	border-top-color: #fff;\n	}\n.leaflet-tooltip-bottom:before {\n	top: 0;\n	margin-top: -12px;\n	margin-left: -6px;\n	border-bottom-color: #fff;\n	}\n.leaflet-tooltip-left {\n	margin-left: -6px;\n}\n.leaflet-tooltip-right {\n	margin-left: 6px;\n}\n.leaflet-tooltip-left:before,\n.leaflet-tooltip-right:before {\n	top: 50%;\n	margin-top: -6px;\n	}\n.leaflet-tooltip-left:before {\n	right: 0;\n	margin-right: -12px;\n	border-left-color: #fff;\n	}\n.leaflet-tooltip-right:before {\n	left: 0;\n	margin-left: -12px;\n	border-right-color: #fff;\n	}"; }
}

// import * as leaflet from "leaflet";
// import L from "leaflet-minimap";
class MapContainer {
    constructor() {
        this.compName = MAP_CONTAINER_TAG;
    }
    // @State() toolbarConfig: ToolbarConfig;
    // @Listen("distanceUnitsEm")
    // changeUnitsHandler(event: CustomEvent) {
    //   console.log("Received the custom mile event: ", event.detail);
    //   this.changeUnits();
    // }
    changeDistanceUnits() {
        const distanceUnitTypes = ['km', 'mile', 'nauticalmiles'];
        let index = distanceUnitTypes.indexOf(this.distanceUnitType);
        index++;
        if (index === distanceUnitTypes.length)
            index = 0;
        this.distanceUnitType = distanceUnitTypes[index];
    }
    changeCoordinateSystem() {
        const coordinateSystemTypes = ['utm', 'utmref', 'gps'];
        let index = coordinateSystemTypes.indexOf(this.coordinateSystemType);
        index++;
        if (index === coordinateSystemTypes.length)
            index = 0;
        this.coordinateSystemType = coordinateSystemTypes[index];
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        const mapOptions = {
            // fullscreenControl: true,
            zoom: 12,
            center: { lat: 32, lng: 35 }
        };
        this.gisMap = new L$1.Map("map", mapOptions);
        this.distanceUnitType = this.gisViewerProps.mapConfig.distanceUnitType;
        this.coordinateSystemType = this.gisViewerProps.mapConfig.coordinateSystemType;
    }
    // componentWillUpdate() {
    // }
    render() {
        return (h("div", null,
            h("tool-bar", { gisMap: this.gisMap, distanceUnitType: this.distanceUnitType, config: this.gisViewerProps.toolbarConfig }),
            _.get(this, "gisViewerProps.mapPluginsConfig.scaleControlConfig.enable") ? (h("scale-control-plugin", { gisMap: this.gisMap, config: this.gisViewerProps.mapPluginsConfig.scaleControlConfig, distanceUnitType: this.distanceUnitType })) : (""),
            _.get(this, "gisViewerProps.mapPluginsConfig.miniMapConfig.enable") ? (h("mini-map-plugin", { gisMap: this.gisMap, config: this.gisViewerProps.mapPluginsConfig.miniMapConfig })) : (""),
            _.get(this, "gisViewerProps.mapPluginsConfig.mouseCoordinateConfig.enable") ? (h("mouse-coordinate-plugin", { gisMap: this.gisMap, config: this.gisViewerProps.mapPluginsConfig.mouseCoordinateConfig, coordinateSystemType: this.coordinateSystemType })) : ("")));
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        const osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
        L$1.tileLayer(osmUrl, {}).addTo(this.gisMap);
        L$1.marker([32, 35])
            .addTo(this.gisMap)
            .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
            .openPopup();
    }
    static get is() { return "map-container"; }
    static get properties() { return { "changeCoordinateSystem": { "method": true }, "changeDistanceUnits": { "method": true }, "coordinateSystemType": { "state": true }, "distanceUnitType": { "state": true }, "gisMap": { "state": true }, "gisViewerProps": { "type": "Any", "attr": "gis-viewer-props" } }; }
    static get style() { return ""; }
}

class ToolBar {
    constructor() {
        this.compName = TOOL_BAR_TAG;
    }
    render() {
        return (h("div", null,
            _.get(this, 'config.toolbarPluginsConfig.drawBarConfig.enable') ? (h("draw-bar-plugin", { gisMap: this.gisMap, config: this.config.toolbarPluginsConfig.drawBarConfig, distanceUnitType: this.distanceUnitType })) : (''),
            _.get(this, "config.toolbarPluginsConfig.zoomToExtentConfig.enable") ? (h("zoom-to-extent-plugin", { gisMap: this.gisMap, config: this.config.toolbarPluginsConfig.zoomToExtentConfig })) : (''),
            _.get(this, "config.toolbarPluginsConfig.fullScreenConfig.enable") ? (h("full-screen-plugin", { gisMap: this.gisMap, config: this.config.toolbarPluginsConfig.fullScreenConfig })) : (''),
            _.get(this, "config.toolbarPluginsConfig.measureConfig.enable") ? (h("measure-plugin", { gisMap: this.gisMap, config: this.config.toolbarPluginsConfig.measureConfig, distanceUnitType: this.distanceUnitType })) : ('')));
    }
    static get is() { return "tool-bar"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "distanceUnitType": { "type": "Any", "attr": "distance-unit-type" }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return ""; }
}

export { DevComponent, FullScreenPlugin, GisViewer, MapContainer, ToolBar };
