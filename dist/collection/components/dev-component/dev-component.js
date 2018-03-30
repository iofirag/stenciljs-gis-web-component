import { GIS_VIEWER_TAG } from '../../utils/statics';
import store from '../store/store';
export class DevComponent {
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
        return h("div", { class: 'dev-components' },
            h("div", { class: 'header' },
                h("header", { title: 'This is a GIS Viewer component Application' })),
            h("div", { class: 'body' },
                h("div", { class: 'sideMenu' },
                    h("input", { type: 'button', value: 'Zoom To Extend', onClick: e => this.testZoomToExtend(e) }),
                    h("input", { type: 'button', value: 'Change Units distance', onClick: e => this.testChangeDistanceUnits(e) }),
                    h("input", { type: 'button', value: 'Change Coordinate System', onClick: e => this.testChangeCoordinateSystem(e) }),
                    h("input", { type: 'button', value: 'Change Coordinate System in props', onClick: e => this.testChangeCoordinateSystemInProps(e) })),
                h("div", { class: 'gisWrapper' },
                    h("gis-viewer", { gisViewerProps: this.gisViewerState }))));
    }
    componentDidLoad() {
        this.gisViewerEl = document.querySelector(GIS_VIEWER_TAG);
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
        console.log('Testing zoomToExtent command', e.type);
        this.gisViewerEl.zoomToExtent();
    }
    testChangeDistanceUnits(e) {
        console.log('Testing ChangeDistanceUnits command', e.type);
        this.gisViewerEl.changeDistanceUnits();
    }
    testChangeCoordinateSystem(e) {
        console.log('Testing changeCoordinateSystem command', e.type);
        this.gisViewerEl.changeCoordinateSystem();
    }
    testChangeCoordinateSystemInProps(e) {
        console.log('Testing testChangeCoordinateSystemInProps command', e.type);
        const coordinateSystemTypes = ['utm', 'utmref', 'gps'];
        let index = coordinateSystemTypes.indexOf(store.state.mapConfig.coordinateSystemType);
        index++;
        if (index === coordinateSystemTypes.length)
            index = 0;
        this.gisViewerState.mapConfig.coordinateSystemType = coordinateSystemTypes[index];
        this.gisViewerState = Object.assign({}, this.gisViewerState);
    }
    createDevState() {
        const protocol = 'http:';
        const mapConfig = {
            isZoomToExtentOnNewData: true,
            isWheelZoomOnlyAfterClick: true,
            isZoomControl: true,
            isFlyToBounds: true,
            // isExport: true,
            clusterOptions: {},
            mode: 'cluster',
            distanceUnitType: 'km',
            coordinateSystemType: 'gps',
        };
        const tileLayers = [
            {
                name: 'Online Map',
                tilesURI: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
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
                name: 'Verint Map',
                tilesURI: protocol + '//osm/osm_tiles/{z}/{x}/{y}.png',
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
                layerName: 'Test data 1',
                // isDisplay: false,
                shapes: [
                    {
                        shapeWkt: 'POLYGON((-14.765625 17.052584352706003,-12.83203125 15.703433338617463,-15.99609375 15.534142999890243,-14.765625 17.052584352706003))',
                        data: {
                            name: '232 (known as polygon1)',
                            id: 'polygon1'
                        }
                    },
                    {
                        shapeWkt: 'POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))',
                        data: {
                            name: '232 (known as polygon1)',
                            id: 'polygon1'
                        }
                    },
                    {
                        shapeWkt: 'LINESTRING(1 1 1,5 5 5,7 7 5)',
                        data: {
                            name: '232 (known as polygon1)',
                            id: 'polygon1'
                        }
                    }
                ]
            }
        ];
        const layerManagerConfig = {
            enable: true,
            isImport: true
        };
        const scaleConfig = {
            enable: true,
            scaleOptions: {
                position: 'bottomright'
            }
        };
        const searchConfig = {
            enable: true,
            searchOptions: {
                searchOnLayer: true,
                queryServerUrl: 'http://nominatim.openstreetmap.org/search?format=json&q={s}' // protocol + '//osm/nominatim?format=json&limit=3&type=administrative&q={s}' // 'http://10.164.39.38/nominatim/search.php?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}'
            }
        };
        const miniMapConfig = {
            enable: true,
            miniMapOptions: {
                toggleDisplay: true
            }
        };
        // const zoomControlConfig: ZoomConfig = {
        //   enable: true
        // };
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
                position: 'topright'
            }
        };
        const unitsChangerConfig = {
            enable: true
        };
        const fullScreenConfig = {
            enable: true
        };
        const toolbarConfig = {
            isExport: true,
            isSettings: true,
            toolbarPluginsConfig: {
                layerManagerConfig, fullScreenConfig, measureConfig,
                unitsChangerConfig, zoomToExtentConfig,
                drawBarConfig, searchConfig
            }
        };
        const mapPluginsConfig = {
            miniMapConfig, scaleConfig, mouseCoordinateConfig
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
    static get style() { return "/**style-placeholder:dev-component:**/"; }
}
