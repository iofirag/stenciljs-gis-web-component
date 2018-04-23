import { GIS_VIEWER_TAG } from '../../utils/statics';
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
                    h("input", { type: 'button', value: 'Add shape in props', onClick: e => this.testAddShapeInProps(e) })),
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
    testAddShapeInProps(e) {
        console.log('Testing testChangeCoordinateSystemInProps command', e.type);
        this.gisViewerState.shapeLayers[0].shapes.push({
            shapeWkt: 'POLYGON((-14.765625 17.052584352706003,-12.83203125 15.703433338617463,-15.99609375 15.534142999890243,-14.765625 17.052584352706003))',
            data: {
                name: '232 (known as polygon1)',
                id: 'polygon999999'
            }
        });
        this.gisViewerState = Object.assign({}, this.gisViewerState);
    }
    createDevState() {
        const mapConfig = {
            isZoomToExtentOnNewData: true,
            isWheelZoomOnlyAfterClick: true,
            isZoomControl: true,
            isFlyToBounds: true,
            isSelectionDisable: false,
            // isExport: true,
            clusterOptions: {
            // disableClusteringAtZoom: 13,
            // chunkedLoading: true,
            // chunkProgress: true,
            // singleMarkerMode: false
            },
            mode: 'cluster',
            distanceUnitType: 'km',
            coordinateSystemType: 'gps',
        };
        const protocol = 'http:';
        const tileLayers = [
            {
                name: 'Verint Map',
                tilesURI: protocol + '//osm/osm_tiles/{z}/{x}/{y}.png',
                minZoom: 1,
                maxZoom: 20,
                attributionControl: false
            },
            {
                name: 'Rail Ways',
                tilesURI: 'http://www.openptmap.org/tiles/{z}/{x}/{y}.png',
                minZoom: 1,
                maxZoom: 20,
                attributionControl: false
            }
        ];
        const shapeLayers = [
            {
                layerName: 'Test data 1',
                isDisplay: true,
                shapes: [
                    // Uniqe group id (group0)
                    {
                        shapeWkt: 'POINT(35 32)',
                        data: {
                            name: '232 in gorup0',
                            groupId: 'group0',
                            // id: 'specialId1',
                            type: 'intercept',
                        }
                    },
                    {
                        shapeWkt: 'POINT(35 33)',
                        data: {
                            name: '233 in gorup0',
                            groupId: 'group0',
                            id: 'specialId2',
                            type: 'intercept',
                            isSelected: true
                        }
                    },
                    {
                        shapeWkt: 'POINT(30 30)',
                        data: {
                            name: '234 in gorup0',
                            groupId: 'group0',
                            id: 'specialId3',
                            type: 'intercept',
                        }
                    },
                    // Uniqe group id (samepoint1)
                    {
                        shapeWkt: 'POINT(42 42)',
                        data: {
                            name: 'a in samepoint1',
                            groupId: 'samepoint1',
                            id: 'samepoint1a',
                            type: 'intercept',
                        }
                    },
                    {
                        shapeWkt: 'POINT(42 42)',
                        data: {
                            name: 'b in samepoint1',
                            groupId: 'samepoint1',
                            id: 'samepoint1b',
                            type: 'intercept',
                        }
                    },
                    {
                        shapeWkt: 'POINT(43 43)',
                        data: {
                            name: 'c in samepoint1',
                            groupId: 'samepoint1',
                            id: 'samepoint1c',
                            type: 'intercept',
                        }
                    },
                    {
                        shapeWkt: 'POINT(43 43)',
                        data: {
                            name: 'd in samepoint1',
                            groupId: 'samepoint1',
                            id: 'samepoint1d',
                            type: 'intercept',
                        }
                    },
                    // Uniqe group id (cell1)
                    {
                        shapeWkt: 'POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))',
                        data: {
                            name: 'cell coverage in cell1',
                            groupId: 'cell1',
                            id: 'cell1coverage',
                            count: 10
                        }
                    },
                    {
                        shapeWkt: 'POINT(1.40 6.285)',
                        data: {
                            name: 'cell point in cell1',
                            groupId: 'cell1',
                            id: 'cell1point',
                            type: 'intercept',
                        }
                    },
                    // Default group
                    {
                        shapeWkt: 'POINT(37 38)',
                        data: {
                            name: 'd1 in default group',
                            id: 'd1'
                        }
                    },
                    {
                        shapeWkt: 'POINT(38 38)',
                        data: {
                            name: 'd2 in default group',
                            id: 'd2',
                            isSelected: true
                        }
                    },
                    {
                        shapeWkt: 'POINT(39 38)',
                        data: {
                            name: 'd3 in default group',
                            id: 'd3',
                        }
                    },
                ]
            },
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
                // searchOnLayer: true,
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
            measureOptions: {
            // showMeasurementsClearControl: true,
            // clearMeasurementsOnStop: false
            }
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
