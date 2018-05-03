import { Component, State } from '@stencil/core';
import {
  GisViewerProps,
  TileLayerDefinition,
  ShapeLayerDefinition,
  LayerManagerConfig,
  ScaleConfig,
  SearchConfig,
  MiniMapConfig,
  DrawBarConfig,
  MouseCoordinateConfig,
  MeasureConfig,
  ZoomToExtentConfig,
  UnitsChangerConfig,
  MapPluginsConfig,
  ToolbarConfig,
  FullScreenConfig,
  MapConfig,
  WktShape,
} from '../../models';
import { GIS_VIEWER_TAG } from '../../utils/statics';
import { saveAs } from 'file-saver';

@Component({
  tag: 'dev-component',
  styleUrl: 'dev-component.scss'
})
export class DevComponent {
  gisViewerEl: HTMLGisViewerElement;
  @State() gisViewerState: GisViewerProps;

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
    const callbacks = {
      onSaveKmlFormat: ev => this.onSaveFileTypeFormatCB(ev.detail, 'kml'),
      onSaveCsvFormat: ev => this.onSaveFileTypeFormatCB(ev.detail, 'csv'),
      onSaveShpFormat: ev => this.onSaveFileTypeFormatCB(ev.detail, 'zip'),
      onEndImportDraw: ev => this.endImportDrawCB(ev.detail)
    };

    return (
    <div class='dev-components'>
      <header>
        <input type='button' value='Zoom To Extend' onClick={e => this.testZoomToExtend(e)} />
        <input type='button' value='Change Units distance' onClick={e => this.testChangeDistanceUnits(e)} />
        <input type='button' value='Change Coordinate System' onClick={e => this.testChangeCoordinateSystem(e)} />
        <input type='button' value='Add shape in props' onClick={e => this.testAddShapeInProps(e)} />
        <input type='button' value='Export image' onClick={e => this.testExportImage(e)} />
        <input type='button' value='Get bounds' onClick={e => this.testExportBounds(e)} />
        <input type='button' value='Remove Highlight' onClick={e => this.testRemoveHighlightPOIs(e)} />
        <input type='button' value='Get All Selected Shapes' onClick={e => this.testGetAllSelectedShape(e)} />
        <input type='button' value='Clear draw layer' onClick={e => this.testClearDrawLayer(e)} />
        <input type='button' value='Export draw layers' onClick={e => this.testExportDrawLayer(e)} />
        <input type='button' value='Import draw layers' onClick={e => this.testImportDrawState(e)} />
        <input type='button' value='Toggle Shape Selection' onClick={e => this.testToggleShapeSelectionById(e)} />
        <input type='button' value='Highlight Group' onClick={e => this.testHighlightPOIsByGroupId(e)} />
        <input type='button' value='Export Kml' onClick={e => this.testExportKmlBlobCMD(e)} />
        <input type='button' value='Export Csv' onClick={e => this.testExportCsvBlobCMD(e)} />
        <input type='button' value='Export Shp' onClick={e => this.testExportShpBlobCMD(e)} />
        {/* <input type='button' value='' onClick={() => {}} /> */}

        {/* <RaisedButton label='Export draw' primary={true} onClick={this.testExportDraw} />
                    <RaisedButton label='Import user draw' primary={true} onClick={this.testImportUserDraw} />
                    <RaisedButton label='Clear draws' primary={true} onClick={this.testClearDraws} />
                    <RaisedButton label='Export bounds' primary={true} onClick={this.testExportBounds} />
                    <RaisedButton label='test Export CSV' primary={true} onClick={this.testExportCSV} />
                    <RaisedButton label='Get Selected Shapes' primary={true} onClick={this.testGetAllSelectedShape} />
                    <RaisedButton label='Get Drawable Multipolygon wkt' primary={true} onClick={this.testGetMultiPolygon} />
                    <RaisedButton label='Select shape by id' primary={true} onClick={this.testSelectShapeById} />
                    <RaisedButton label='Zoom to extend' primary={true} onClick={this.testZoomToExtend} />
                    <RaisedButton label='Export image' primary={true} onClick={this.testExportImage} />
                    <RaisedButton label='Export KML' primary={true} onClick={this.exportKmlCMD} />
                    <RaisedButton label='Add shape' primary={true} onClick={this.addShape} />
                    <input type='file' id='fileInput' onChange={this.testImportKmlFormatByStringCMD} accept={ImportFileFormats} /> */}

        {/* <input type='button' value='' onClick={() => {}} /> */}
      </header>
      <main class='gisWrapper'>
          <gis-viewer gisViewerProps={this.gisViewerState} {...callbacks} />
      </main>
    </div>)
    // </div>;
    ;
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

  testHighlightPOIsByGroupId(e: UIEvent): void {
    console.log('Testing HighlightPOIsByGroupId: ', e.type);
    this.gisViewerEl.highlightPOIsByGroupId('cell1');
  }

  testToggleShapeSelectionById(e: UIEvent): void {
    console.log('Testing ToggleShapeSelectionById: ', e.type);
    this.gisViewerEl.toggleShapeSelectionById([{id: 'cell1coverage', isSelected: true}, {groupId: 'group0', isSelected: false}]);
  }

  testGetAllSelectedShape(e: UIEvent): void {
    console.log('Testing GetAllSelectedShape: ', e.type);
    console.log('Selected Shapes: ', this.gisViewerEl.getSelectedShapes());
  }

  testRemoveHighlightPOIs(e: UIEvent) {
    console.log('Testing RemoveHighlightPOIs: ', e.type);
		this.gisViewerEl.removeHighlightPOIs();
	}

  testExportBounds(e: UIEvent): void {
    console.log('Testing getBounds: ', e.type);
		console.log(this.gisViewerEl.getBounds());
  }

  testZoomToExtend(e: UIEvent) {
    console.log('Testing zoomToExtent api method', e.type);
    this.gisViewerEl.zoomToExtent();
  }
  testChangeDistanceUnits(e: UIEvent) {
    console.log('Testing ChangeDistanceUnits api method', e.type);
    this.gisViewerEl.changeDistanceUnits();
  }

  testExportImage(e: UIEvent): void {
    console.log('Testing ExportImage api method', e.type);
		this.gisViewerEl.exportMapImage().then((canvasObj: any) => {
			const img = document.createElement('img');
			img.src = canvasObj.toDataURL('image/png');
			document.body.appendChild(img);
		}).catch((ex: any) => {
			console.error("Error retrieving image data url", ex);
		});
	}

  testChangeCoordinateSystem(e: UIEvent) {
    console.log('Testing changeCoordinateSystem api method', e.type);
    this.gisViewerEl.changeCoordinateSystem();
  }
  testAddShapeInProps(e: UIEvent) {
    console.log('Testing ChangeCoordinateSystemInProps api method', e.type);
    this.gisViewerState.shapeLayers[0].shapes.push({
      shapeWkt: 'POLYGON((-14.765625 17.052584352706003,-12.83203125 15.703433338617463,-15.99609375 15.534142999890243,-14.765625 17.052584352706003))',
      data: {
        name: '232 (known as polygon1)',
        id: 'polygon999999'
      }
    })
    this.gisViewerState = { ...this.gisViewerState };
  }
  testClearDrawLayer(e: UIEvent) {
    console.log('Testing ClearDrawLayer api method', e.type);
    this.gisViewerEl.clearDrawLayer();
  }
  testExportDrawLayer(e: UIEvent) {
    console.log('Testing ExportDrawLayer api method', e.type);
    const drawState: WktShape[] = this.gisViewerEl.exportDrawLayer();
		const drawStateStringify: string = JSON.stringify(drawState);
		console.log("Draw state is", drawStateStringify);
		localStorage.setItem('drawStateStringify', drawStateStringify);
    console.log(drawState);
  }

  testImportDrawState(e: UIEvent) {
    console.log('Testing ImportDrawState api method', e.type);
    const drawStateStringify: string | null = localStorage.getItem('drawStateStringify');

    if (drawStateStringify) {
			const drawState: Array<WktShape> = JSON.parse(drawStateStringify);
      this.gisViewerEl.importDrawState(drawState);
    }
  }

  testExportKmlBlobCMD(e: UIEvent) {
    console.log('Testing testExportKmlBlobCMD api method', e.type);
    const kml: Blob = this.gisViewerEl.exportKmlBlob();
		// alert('export kml blob'+ kml);
		saveAs(kml, 'map-data.kml');
  }

	testExportCsvBlobCMD(e: UIEvent): void {
    console.log('Testing testExportCsvBlobCMD api method', e.type);
		const csv: Blob = this.gisViewerEl.exportCsvBlob();
    saveAs(csv, 'map-data.csv');
  }

	testExportShpBlobCMD(e: UIEvent): void {
    console.log('Testing testExportShpBlobCMD api method', e.type);
		const shp: Blob = this.gisViewerEl.exportShpBlob();
    saveAs(shp, 'map-data.zip');
  }

  private onSaveFileTypeFormatCB(blob: Blob, fileType: string) {
		// alert('export kml blob'+ kml);
		saveAs(blob, `map-data.${fileType}`);
  }

  private endImportDrawCB(allImportedLayers: WktShape[]): void {
		console.log('Imported shapes:', allImportedLayers);
	}
	// private onSaveCsvFormatCB(csv: Blob) {
	// 	// alert('export csv blob' + csv);
	// 	saveAs(csv, 'map-data.csv');
	// }
	// private onSaveShpFormatCB(shp: Blob) {
	// 	// alert('export shp blob' + shp);
	// 	saveAs(shp, "download.zip");
	// }





  createDevState(): GisViewerProps {

    const mapConfig: MapConfig = {
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
    const tileLayers: TileLayerDefinition[] = [
      {
        name: 'Verint Map',
        tilesURI: protocol + '//osm/osm_tiles/{z}/{x}/{y}.png', // 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // 'http://10.164.39.38/pandonia/{z}/{x}/{y}.png',
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

    const shapeLayers: ShapeLayerDefinition[] = [
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
              // isSelected: true
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
            shapeWkt: 'POINT(39 38)', // roll back this
            data: {
              name: 'a in samepoint1',
              groupId: 'samepoint1',
              id: 'samepoint1a',
              type: 'intercept',
              // isSelected: true
            }
          },
          {
            shapeWkt: 'POINT(42 42)',
            data: {
              name: 'b in samepoint1',
              groupId: 'samepoint1',
              id: 'samepoint1b',
              type: 'intercept',
              // isSelected: true
            }
          },

          {
            shapeWkt: 'POINT(43 43)',
            data: {
              name: 'c in samepoint1',
              groupId: 'samepoint1',
              id: 'samepoint1c',
              type: 'intercept',
              // isSelected: true
            }
          },
          {
            shapeWkt: 'POINT(43 43)',
            data: {
              name: 'd in samepoint1',
              groupId: 'samepoint1',
              id: 'samepoint1d',
              type: 'intercept',
              // isSelected: true
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
            shapeWkt: 'POINT(42 42)', // roll back
            data: {
              name: 'd3 in default group',
              id: 'd3',
            }
          },




          // {
          //   shapeWkt: 'POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))',
          //   data: {
          //     name: 'cell 2',
          //     groupId: 'cell2',
          //     id: 'cell2area',
          //     count: 10
          //   }
          // },
          // {
          //   shapeWkt: 'POINT(1.40 3.285)',
          //   data: {
          //     name: 'cell 2',
          //     groupId: 'cell2',
          //     id: 'cell2center',
          //     type: 'intercept',
          //   }
          // },
        ]
      },
      // {
      //   layerName: 'Test data 2',
      //   isDisplay: false,
      //   shapes: [
      //     {
      //       shapeWkt: 'POINT(32 35)',
      //       data: {
      //         name: '232 (known as point0)',
      //         groupId: 'group00'
      //       }
      //     },
      //     {
      //       shapeWkt: 'POLYGON((0 0 0,0 5 0,5 5 0,5 0 0,0 0 0))',
      //       data: {
      //         name: '232 (known as polygon1)',
      //         groupId: 'group11',
      //         count: 20
      //       }
      //     },
      //     {
      //       shapeWkt: 'LINESTRING(1 1 1,5 5 5,7 7 5)',
      //       data: {
      //         name: '232 (known as polygon1)',
      //         groupId: 'group22'
      //       }
      //     }
      //   ]
      // }
    ];

    const drawBarConfig: DrawBarConfig = {
      enable: true,
      drawBarOptions: {
        draw: {
          polyline: true,
          polygon: true, // Turns off this drawing tool
          circle: true, // Turns off this drawing tool
          rectangle: true, // Turns off this drawing tool
          marker: true, // Turns off this drawing tool
          // circlemarker: false,
          // textualMarker: false // Turns off this drawing tool
        },
        edit: {
          remove: true // Turns on remove button
        }
      }
    };

    const layerManagerConfig: LayerManagerConfig = {
      enable: true,
      drawBarConfig,
      isImport: true
    };

    const scaleConfig: ScaleConfig = {
      enable: true,
      scaleOptions: {
        position: 'bottomright'
      }
    };

    const searchConfig: SearchConfig = {
      enable: true,
      searchOptions: {
        // searchOnLayer: true,
        queryServerUrl: 'http://nominatim.openstreetmap.org/search?format=json&q={s}' // protocol + '//osm/nominatim?format=json&limit=3&type=administrative&q={s}' // 'http://10.164.39.38/nominatim/search.php?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}' // 'http://nominatim.openstreetmap.org/search?format=json&q={s}'
      }
    };

    const miniMapConfig: MiniMapConfig = {
      enable: true,
      miniMapOptions: {
        toggleDisplay: true
      }
    };

    // const zoomControlConfig: ZoomConfig = {
    //   enable: true
    // };



    const mouseCoordinateConfig: MouseCoordinateConfig = {
      enable: true,
    };

    const measureConfig: MeasureConfig = {
      enable: true,
      measureOptions: {
        showMeasurementsClearControl: true,
        clearMeasurementsOnStop: false
      }
    };

    const zoomToExtentConfig: ZoomToExtentConfig = {
      enable: true,
      zoomToExtentOptions: {
        position: 'topright'
      }
    };

    const unitsChangerConfig: UnitsChangerConfig = {
      enable: true
    };
    const fullScreenConfig: FullScreenConfig = {
      enable: true
    };




    const toolbarConfig: ToolbarConfig = {
      isExport: true,
      isSettings: true,
      toolbarPluginsConfig: {
        layerManagerConfig, searchConfig, fullScreenConfig, measureConfig,
        unitsChangerConfig, zoomToExtentConfig,
      }

    };
    const mapPluginsConfig: MapPluginsConfig = {
      miniMapConfig, scaleConfig, mouseCoordinateConfig
    };

    return {
      tileLayers,
      mapConfig,
      shapeLayers,

      toolbarConfig,
      mapPluginsConfig

      //   onMapReady: this.onMapReadyCB.bind(this),
      //   onDrawEdited: this.drawEditedCB.bind(this),
      //   onDrawCreated: this.drawCreatedCB.bind(this),
      //   onSaveKmlBlob: this.onSaveKmlFormatCB.bind(this),
      //   onSaveCsvBlob: this.onSaveCsvFormatCB.bind(this),
      //   onDrawDeleted: this.drawDeletedCB.bind(this),
      //   onSaveShpBlob: this.onSaveShpFormatCB.bind(this),
      //   onSelectionDone: this.onSelectionDoneCB.bind(this),
      //   onBoundsChanged: this.onBoundsChangedCB.bind(this),
      //   onEndImportDraw: this.endImportDrawCB.bind(this),
      //   onChangeMapMode: this.changeMapModeCD.bind(this),
      //   onFetchDataByShapeId: this.fetchDataByShapeIdCB.bind(this)
    };
  }
}
