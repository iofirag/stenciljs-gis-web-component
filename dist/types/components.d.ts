import './stencil.core';
/**
 * This is an autogenerated file created by the Stencil build process.
 * It contains typing information for all components that exist in this project
 * and imports for stencil collections that might be configured in your stencil.config.js file
 */
declare global {
  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {}
  }
  namespace JSXElements {}

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;
    componentOnReady(done: (ele?: this) => void): void;

    forceUpdate(): void;
  }

  interface HTMLAttributes {}
}

import {
  ClusterHeat,
  CoordinateSystemType,
  DistanceUnitType,
  DrawBarConfig,
  FullScreenConfig,
  GisViewerProps,
  LayerManagerConfig,
  MeasureConfig,
  MiniMapConfig,
  MouseCoordinateConfig,
  ScaleConfig,
  SearchConfig,
  ToolbarConfig,
  ZoomToExtentConfig,
} from './models';

import {
  DevComponent as DevComponent
} from './components/dev-component/dev-component';

declare global {
  interface HTMLDevComponentElement extends DevComponent, HTMLStencilElement {
  }
  var HTMLDevComponentElement: {
    prototype: HTMLDevComponentElement;
    new (): HTMLDevComponentElement;
  };
  interface HTMLElementTagNameMap {
    "dev-component": HTMLDevComponentElement;
  }
  interface ElementTagNameMap {
    "dev-component": HTMLDevComponentElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "dev-component": JSXElements.DevComponentAttributes;
    }
  }
  namespace JSXElements {
    export interface DevComponentAttributes extends HTMLAttributes {
      
      
    }
  }
}


import {
  GisViewer as GisViewer
} from './components/gis-viewer/gis-viewer';

declare global {
  interface HTMLGisViewerElement extends GisViewer, HTMLStencilElement {
  }
  var HTMLGisViewerElement: {
    prototype: HTMLGisViewerElement;
    new (): HTMLGisViewerElement;
  };
  interface HTMLElementTagNameMap {
    "gis-viewer": HTMLGisViewerElement;
  }
  interface ElementTagNameMap {
    "gis-viewer": HTMLGisViewerElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "gis-viewer": JSXElements.GisViewerAttributes;
    }
  }
  namespace JSXElements {
    export interface GisViewerAttributes extends HTMLAttributes {
      gisViewerProps?: GisViewerProps;
      
    }
  }
}


import {
  MapContainer as MapContainer
} from './components/gis-viewer/map-container/map-container';

declare global {
  interface HTMLMapContainerElement extends MapContainer, HTMLStencilElement {
  }
  var HTMLMapContainerElement: {
    prototype: HTMLMapContainerElement;
    new (): HTMLMapContainerElement;
  };
  interface HTMLElementTagNameMap {
    "map-container": HTMLMapContainerElement;
  }
  interface ElementTagNameMap {
    "map-container": HTMLMapContainerElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "map-container": JSXElements.MapContainerAttributes;
    }
  }
  namespace JSXElements {
    export interface MapContainerAttributes extends HTMLAttributes {
      gisViewerProps?: GisViewerProps;
      
    }
  }
}


import {
  MiniMapPlugin as MiniMapPlugin
} from './components/gis-viewer/map-container/mini-map-plugin/mini-map-plugin';

declare global {
  interface HTMLMiniMapPluginElement extends MiniMapPlugin, HTMLStencilElement {
  }
  var HTMLMiniMapPluginElement: {
    prototype: HTMLMiniMapPluginElement;
    new (): HTMLMiniMapPluginElement;
  };
  interface HTMLElementTagNameMap {
    "mini-map-plugin": HTMLMiniMapPluginElement;
  }
  interface ElementTagNameMap {
    "mini-map-plugin": HTMLMiniMapPluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "mini-map-plugin": JSXElements.MiniMapPluginAttributes;
    }
  }
  namespace JSXElements {
    export interface MiniMapPluginAttributes extends HTMLAttributes {
      config?: MiniMapConfig;
      gisMap?: L.Map;
      
    }
  }
}


import {
  MouseCoordinagePlugin as MouseCoordinatePlugin
} from './components/gis-viewer/map-container/mouse-coordinate-plugin/mouse-coordinate-plugin';

declare global {
  interface HTMLMouseCoordinatePluginElement extends MouseCoordinatePlugin, HTMLStencilElement {
  }
  var HTMLMouseCoordinatePluginElement: {
    prototype: HTMLMouseCoordinatePluginElement;
    new (): HTMLMouseCoordinatePluginElement;
  };
  interface HTMLElementTagNameMap {
    "mouse-coordinate-plugin": HTMLMouseCoordinatePluginElement;
  }
  interface ElementTagNameMap {
    "mouse-coordinate-plugin": HTMLMouseCoordinatePluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "mouse-coordinate-plugin": JSXElements.MouseCoordinatePluginAttributes;
    }
  }
  namespace JSXElements {
    export interface MouseCoordinatePluginAttributes extends HTMLAttributes {
      config?: MouseCoordinateConfig;
      coordinateSystemType?: CoordinateSystemType;
      gisMap?: L.Map;
      
    }
  }
}


import {
  ScalePlugin as ScalePlugin
} from './components/gis-viewer/map-container/scale-plugin/scale-plugin';

declare global {
  interface HTMLScalePluginElement extends ScalePlugin, HTMLStencilElement {
  }
  var HTMLScalePluginElement: {
    prototype: HTMLScalePluginElement;
    new (): HTMLScalePluginElement;
  };
  interface HTMLElementTagNameMap {
    "scale-plugin": HTMLScalePluginElement;
  }
  interface ElementTagNameMap {
    "scale-plugin": HTMLScalePluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "scale-plugin": JSXElements.ScalePluginAttributes;
    }
  }
  namespace JSXElements {
    export interface ScalePluginAttributes extends HTMLAttributes {
      config?: ScaleConfig;
      distanceUnitType?: DistanceUnitType;
      gisMap?: L.Map;
      
    }
  }
}


import {
  CustomDropDownPlugin as CustomDropDownPlugin
} from './components/gis-viewer/map-container/tool-bar/custom-drop-down-plugin/custom-drop-down-plugin';

declare global {
  interface HTMLCustomDropDownPluginElement extends CustomDropDownPlugin, HTMLStencilElement {
  }
  var HTMLCustomDropDownPluginElement: {
    prototype: HTMLCustomDropDownPluginElement;
    new (): HTMLCustomDropDownPluginElement;
  };
  interface HTMLElementTagNameMap {
    "custom-drop-down-plugin": HTMLCustomDropDownPluginElement;
  }
  interface ElementTagNameMap {
    "custom-drop-down-plugin": HTMLCustomDropDownPluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "custom-drop-down-plugin": JSXElements.CustomDropDownPluginAttributes;
    }
  }
  namespace JSXElements {
    export interface CustomDropDownPluginAttributes extends HTMLAttributes {
      customControlName?: string;
      dropDownData?: any[];
      dropDownTitle?: string;
      gisMap?: L.Map;
      
    }
  }
}


import {
  DrawBarPlugin as DrawBarPlugin
} from './components/gis-viewer/map-container/tool-bar/draw-bar-plugin/draw-bar-plugin';

declare global {
  interface HTMLDrawBarPluginElement extends DrawBarPlugin, HTMLStencilElement {
  }
  var HTMLDrawBarPluginElement: {
    prototype: HTMLDrawBarPluginElement;
    new (): HTMLDrawBarPluginElement;
  };
  interface HTMLElementTagNameMap {
    "draw-bar-plugin": HTMLDrawBarPluginElement;
  }
  interface ElementTagNameMap {
    "draw-bar-plugin": HTMLDrawBarPluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "draw-bar-plugin": JSXElements.DrawBarPluginAttributes;
    }
  }
  namespace JSXElements {
    export interface DrawBarPluginAttributes extends HTMLAttributes {
      config?: DrawBarConfig;
      distanceUnitType?: DistanceUnitType;
      gisMap?: L.Map;
      
    }
  }
}


import {
  DropDownPlugin as DropDownPlugin
} from './components/gis-viewer/map-container/tool-bar/drop-down-plugin/drop-down-plugin';

declare global {
  interface HTMLDropDownPluginElement extends DropDownPlugin, HTMLStencilElement {
  }
  var HTMLDropDownPluginElement: {
    prototype: HTMLDropDownPluginElement;
    new (): HTMLDropDownPluginElement;
  };
  interface HTMLElementTagNameMap {
    "drop-down-plugin": HTMLDropDownPluginElement;
  }
  interface ElementTagNameMap {
    "drop-down-plugin": HTMLDropDownPluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "drop-down-plugin": JSXElements.DropDownPluginAttributes;
    }
  }
  namespace JSXElements {
    export interface DropDownPluginAttributes extends HTMLAttributes {
      dropDownData?: any[];
      dropDownTitle?: string;
      gisMap?: L.Map;
      
    }
  }
}


import {
  FullScreenPlugin as FullScreenPlugin
} from './components/gis-viewer/map-container/tool-bar/full-screen-plugin/full-screen-plugin';

declare global {
  interface HTMLFullScreenPluginElement extends FullScreenPlugin, HTMLStencilElement {
  }
  var HTMLFullScreenPluginElement: {
    prototype: HTMLFullScreenPluginElement;
    new (): HTMLFullScreenPluginElement;
  };
  interface HTMLElementTagNameMap {
    "full-screen-plugin": HTMLFullScreenPluginElement;
  }
  interface ElementTagNameMap {
    "full-screen-plugin": HTMLFullScreenPluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "full-screen-plugin": JSXElements.FullScreenPluginAttributes;
    }
  }
  namespace JSXElements {
    export interface FullScreenPluginAttributes extends HTMLAttributes {
      config?: FullScreenConfig;
      gisMap?: L.Map;
      
    }
  }
}


import {
  layerManagerPlugin as LayerManagerPlugin
} from './components/gis-viewer/map-container/tool-bar/layer-manager-plugin/layer-manager-plugin';

declare global {
  interface HTMLLayerManagerPluginElement extends LayerManagerPlugin, HTMLStencilElement {
  }
  var HTMLLayerManagerPluginElement: {
    prototype: HTMLLayerManagerPluginElement;
    new (): HTMLLayerManagerPluginElement;
  };
  interface HTMLElementTagNameMap {
    "layer-manager-plugin": HTMLLayerManagerPluginElement;
  }
  interface ElementTagNameMap {
    "layer-manager-plugin": HTMLLayerManagerPluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "layer-manager-plugin": JSXElements.LayerManagerPluginAttributes;
    }
  }
  namespace JSXElements {
    export interface LayerManagerPluginAttributes extends HTMLAttributes {
      config?: LayerManagerConfig;
      gisMap?: L.Map;
      
    }
  }
}


import {
  MeasurePlugin as MeasurePlugin
} from './components/gis-viewer/map-container/tool-bar/measure-plugin/measure-plugin';

declare global {
  interface HTMLMeasurePluginElement extends MeasurePlugin, HTMLStencilElement {
  }
  var HTMLMeasurePluginElement: {
    prototype: HTMLMeasurePluginElement;
    new (): HTMLMeasurePluginElement;
  };
  interface HTMLElementTagNameMap {
    "measure-plugin": HTMLMeasurePluginElement;
  }
  interface ElementTagNameMap {
    "measure-plugin": HTMLMeasurePluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "measure-plugin": JSXElements.MeasurePluginAttributes;
    }
  }
  namespace JSXElements {
    export interface MeasurePluginAttributes extends HTMLAttributes {
      config?: MeasureConfig;
      distanceUnitType?: DistanceUnitType;
      gisMap?: L.Map;
      
    }
  }
}


import {
  SearchPlugin as SearchPlugin
} from './components/gis-viewer/map-container/tool-bar/search-plugin/search-plugin';

declare global {
  interface HTMLSearchPluginElement extends SearchPlugin, HTMLStencilElement {
  }
  var HTMLSearchPluginElement: {
    prototype: HTMLSearchPluginElement;
    new (): HTMLSearchPluginElement;
  };
  interface HTMLElementTagNameMap {
    "search-plugin": HTMLSearchPluginElement;
  }
  interface ElementTagNameMap {
    "search-plugin": HTMLSearchPluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "search-plugin": JSXElements.SearchPluginAttributes;
    }
  }
  namespace JSXElements {
    export interface SearchPluginAttributes extends HTMLAttributes {
      config?: SearchConfig;
      gisMap?: L.Map;
      
    }
  }
}


import {
  ToolBar as ToolBar
} from './components/gis-viewer/map-container/tool-bar/tool-bar';

declare global {
  interface HTMLToolBarElement extends ToolBar, HTMLStencilElement {
  }
  var HTMLToolBarElement: {
    prototype: HTMLToolBarElement;
    new (): HTMLToolBarElement;
  };
  interface HTMLElementTagNameMap {
    "tool-bar": HTMLToolBarElement;
  }
  interface ElementTagNameMap {
    "tool-bar": HTMLToolBarElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "tool-bar": JSXElements.ToolBarAttributes;
    }
  }
  namespace JSXElements {
    export interface ToolBarAttributes extends HTMLAttributes {
      clusterHeatMode?: ClusterHeat;
      config?: ToolbarConfig;
      coordinateSystemType?: CoordinateSystemType;
      distanceUnitType?: DistanceUnitType;
      gisMap?: L.Map;
      isZoomControl?: boolean;
      mouseCoordinateConfig?: MouseCoordinateConfig;
      onCoordsChangeEm?: (event: CustomEvent) => void;
    }
  }
}


import {
  ZoomToExtentPlugin as ZoomToExtentPlugin
} from './components/gis-viewer/map-container/tool-bar/zoom-to-extent-plugin/zoom-to-extent-plugin';

declare global {
  interface HTMLZoomToExtentPluginElement extends ZoomToExtentPlugin, HTMLStencilElement {
  }
  var HTMLZoomToExtentPluginElement: {
    prototype: HTMLZoomToExtentPluginElement;
    new (): HTMLZoomToExtentPluginElement;
  };
  interface HTMLElementTagNameMap {
    "zoom-to-extent-plugin": HTMLZoomToExtentPluginElement;
  }
  interface ElementTagNameMap {
    "zoom-to-extent-plugin": HTMLZoomToExtentPluginElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      "zoom-to-extent-plugin": JSXElements.ZoomToExtentPluginAttributes;
    }
  }
  namespace JSXElements {
    export interface ZoomToExtentPluginAttributes extends HTMLAttributes {
      config?: ZoomToExtentConfig;
      gisMap?: L.Map;
      onZoomToExtentDoneEm?: (event: CustomEvent<null>) => void;
    }
  }
}

declare global { namespace JSX { interface StencilJSX {} } }