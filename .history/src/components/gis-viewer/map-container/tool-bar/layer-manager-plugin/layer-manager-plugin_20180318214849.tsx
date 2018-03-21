import { Component, Prop, State } from "@stencil/core";
import * as styledLayerControl from 'leaflet.styledlayercontrol';
// import * as materialDesign from 'material-design-lite'
import { LAYERS_MANAGER_PLUGIN_TAG, ImportFileFormats } from "../../../../../utils/statics";
// import { } from "../../../../../models/apiModels";
import Utils from "../../../../../utils/utilities";
import L from "leaflet";
import { LayerManagerConfig } from "../../../../../models/apiModels";
import _ from "lodash";


@Component({
    tag: 'layer-manager-plugin',
    styleUrls: [
        // '../../../../../../node_modules/leaflet.styledlayercontrol/css/styledLayerControl.css',
        '../../../../../../node_modules/material-design-lite/dist/material.min.css',             // Need to import this from styledLayerControl.css
        // '../../../../../../node_modules/leaflet.styledlayercontrol/css/MaterialIcons.css',  // Need to import this from styledLayerControl.css
        '../../../../../../node_modules/leaflet.styledlayercontrol/css/styledLayerControl.css',
        './layer-manager-plugin.scss',
    ]
})
export class layerManagerPlugin {
    compName: string = LAYERS_MANAGER_PLUGIN_TAG
    @Prop() config: LayerManagerConfig
    @Prop() gisMap: L.Map
    
    @State() htmlBtElement: HTMLElement;
    @State() element: L.Control.StyledLayerControl;
    @State() customLayerManagerBtEl: HTMLElement;
    
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        Utils.doNothing([this.config, styledLayerControl, /* materialDesign */]);
        
        this.control = this.createPlugin(null);
        this.gisMap.addControl(this.control as L.Control);

        this.htmlBtElement = this.createToolbarButton("div", "layer-controller", "Layer Controller") as HTMLElement;
        this.htmlBtElement.addEventListener("click", () => {
            this.toggleClassNamefromElement(this.element._container, "show");
            this.toggleClassNamefromElement(this.htmlBtElement, "clicked");
        });

        // this.customLayerManagerBtEl = this.createCustomLayerController(/* this.control */);
        // this.gisMap.addControl(this.htmlBtElement);
    }
    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        this.gisMap.removeControl(this.control as L.Control);
    }

    private createToolbarButton(
        tagElement: string,
        className: string,
        title?: string,
        innerHTML?: any
    ) {
        const button = L.DomUtil.create(
            tagElement,
            `custom-toolbar-button ${className}`
        );

        if (title) {
            button.title = title;
        }

        if (innerHTML) {
            button.innerHTML = innerHTML;
        }

        if (tagElement.toLocaleLowerCase() === "a") {
            button.setAttribute("href", "#");
        }

        return button;
    }
    // private createPlugin(options: any): L.Control {
    //     Utils.doNothing(options);

    //     const osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
    //     let osmTiles = new L.TileLayer(osmUrl, {});
    //     const baseMaps: any[] = [
    //         {
    //             groupName: "Base Maps",
    //             layers: {
    //                 'osm': osmTiles
    //             }
    //         }
    //     ];

    //     const featureGroup: L.FeatureGroup = new L.FeatureGroup();
    //     const marker1: L.Marker = new L.Marker(new L.LatLng(32, 35))
    //     const marker2: L.Marker = new L.Marker([30,25])
    //     featureGroup.addLayer(marker1);
    //     featureGroup.addLayer(marker2);
    //     const overlays: any[] = [
    //         {
    //             groupName: "Initiate Layers",
    //             layers: {
    //                 'Results': featureGroup
    //             }
    //         }
    //     ];

    //     const layerControllerOptionsDev: any = {
    //         position: "topleft",
    //         collapsed: false,
    //         container_maxHeight: "500px"
    //     };

    //     let styledLayerConroller: L.Control = new L.Control.StyledLayerControl(
    //         baseMaps, overlays,
    //         this.gisMap,
    //         layerControllerOptionsDev
    //     ) as L.Control;
    //     return styledLayerConroller;
    // }

    // private createCustomLayerController(/* styledLayerConroller: L.Control.StyledLayerControl */): HTMLElement {
    //     const control = L.Control.extend({
    //         options: {
    //             position: 'topleft'
    //         },

    //         onAdd: (/* map: any */) => {
    //             const div: HTMLElement = L.DomUtil.create('div', 'custom-layer-controller');

    //             if (_.get(this, 'context.props.isImportExport')) {
    //                 const optionsListOpenningPosition: string = 'left';
    //                 const buttonId: string = `demo-menu-lower-${optionsListOpenningPosition}`;
    //                 const container: string = `
    //                     <div class="custom-layer-controller-header">
    //                     <h2 class="custom-layer-controller-header-title">
    //                         <span>Layers</span>
    //                         <button class="mdl-button mdl-js-button mdl-button--icon" id="${ buttonId}">
    //                         <i class='material-icons add-circle'>add_circle</i>
    //                         </button>
    //                     </h2>
    //                     <ul id="custom-layer-controller-add-layer-menu" class="mdl-menu mdl-menu--bottom-${optionsListOpenningPosition} mdl-js-menu mdl-js-ripple-effect" for="${buttonId}">
    //                         <li class="mdl-menu__item" for="import-layer">
    //                         <label class="drop-down-label">
    //                             Import
    //                             <input type="file" accept="${ImportFileFormats}" id="import-layer" class="hidden" attachEvent="change:onChangeImport"/>
    //                         </label>
    //                         </li>
    //                         <li class="mdl-menu__item" disabled>Load</li>
    //                     </ul>
    //                     </div>
    //                 `;

    //                 (div as any).appendHtmlWithContext(container, this);
    //             }

    //             return div;
    //         },

    //         // onRemove: (map: any) => {
    //         //     // styledLayerConroller.onRemove(map);
    //         // },

    //         // addBaseLayer: (layer: any, name: any, group: any) => {
    //         //     // return styledLayerConroller.addBaseLayer(layer, name, group);
    //         // },

    //         // addOverlay: (layer: any, name: any, group: any, className?: string) => {
    //         //     // return styledLayerConroller.addOverlay(layer, name, group, className);
    //         // },
    //         // deleteLayer: (layer: any) => {
    //         //     // styledLayerConroller.deleteLayer(layer);
    //         // },
    //         // removeLayer: (layer: any) => {
    //         //     // return styledLayerConroller.removeLayer(layer);
    //         // },
    //         // removeGroup: (group_Name: string, del: any) => {
    //         //     // styledLayerConroller.removeGroup(group_Name, del);
    //         // },
    //         // removeAllGroups: (del: any) => {
    //         //     // styledLayerConroller.removeAllGroups(del);
    //         // },
    //         // selectLayer: (layer: any) => {
    //         //     // styledLayerConroller.selectLayer(layer);
    //         // },
    //         // unSelectLayer: (layer: any) => {
    //         //     // styledLayerConroller.unSelectLayer(layer);
    //         // },
    //         // changeGroup: (group_Name: string, select: any) => {
    //         //     // styledLayerConroller.changeGroup(group_Name, select);
    //         // }
    //     });

    //     return new control();
    // }

    // private toggleClassNamefromElement(elm: HTMLElement, className: string) {
    //     const AddOrRemove =
    //         elm.className.indexOf(className) > -1 ? "remove" : "add";
    //     elm.classList[AddOrRemove](className);
    // }
    // private createToolbarButton(
    //     tagElement: string,
    //     className: string,
    //     title?: string,
    //     innerHTML?: any
    // ) {
    //     const button = L.DomUtil.create(
    //         tagElement,
    //         `custom-toolbar-button ${className}`
    //     );
    //     if (title) {
    //         button.title = title;
    //     }
    //     if (innerHTML) {
    //         button.innerHTML = innerHTML;
    //     }
    //     if (tagElement.toLocaleLowerCase() === "a") {
    //         button.setAttribute("href", "#");
    //     }
    //     return button;
    // }
}
















// private createElement(): void {
    // const layerControllerOptionsDev: any = {
    //     position: "topleft",
    //     collapsed: false,
    //     container_maxHeight: "500px",
    //     callbacks: {
    //         onChangeCheckbox: (event: any, obj: any) => {
    //             if (obj.group.name !== LayerNames.DRAWABLE_LAYER) {
    //                 this.changeDisplayAfterOneOverlayChanged(obj.group.name, obj.name, event.target.checked);
    //             }
    //         }
    //     }
    // };
    // const baseMaps: any[] = [
    //     {
    //         groupName: "Base Maps",
    //         layers: this.context.mapState.baseMaps
    //     }
    // ];

    // const mapState: MapState = this.context.mapState;
    // const layers: any[] = this.overlayMapsProjection(mapState);  // Remove this

    // let styledLayerConroller: any = new L.Control.StyledLayerControl(
    //     baseMaps, // null,
    //     null,
    //     layerControllerOptionsDev
    // );

    // this.context.map.addControl(styledLayerConroller);

//     const control = L.Control.extend({
//         options: {
//             position: 'topleft'
//         },

//         onAdd: (map: any) => {
//             const div: HTMLElement = L.DomUtil.create('div', 'custom-layer-controller');

//             if (_.get(this, 'context.props.isImportExport')) {
//                 const optionsListOpenningPosition: string = 'left';
//                 const buttonId: string = `demo-menu-lower-${optionsListOpenningPosition}`;
//                 const container: string = `
//             <div class="custom-layer-controller-header">
//               <h2 class="custom-layer-controller-header-title">
//                 <span>Layers</span>
//                 <button class="mdl-button mdl-js-button mdl-button--icon" id="${ buttonId}">
//                   <i class='material-icons add-circle'>add_circle</i>
//                 </button>
//               </h2>
//               <ul id="custom-layer-controller-add-layer-menu" class="mdl-menu mdl-menu--bottom-${optionsListOpenningPosition} mdl-js-menu mdl-js-ripple-effect" for="${buttonId}">
//                 <li class="mdl-menu__item" for="import-layer">
//                   <label class="drop-down-label">
//                     Import
//                     <input type="file" accept="${ImportFileFormats}" id="import-layer" class="hidden" attachEvent="change:onChangeImport"/>
//                   </label>
//                 </li>
//                 <li class="mdl-menu__item" disabled>Load</li>
//               </ul>
//             </div>
//           `;

//                 Utils.appendHtmlWithContext(div, container, this);
//             }

//             return div;
//         },

//         onRemove: (map: any) => {
//             styledLayerConroller.onRemove(map);
//         },

//         addBaseLayer: (layer: any, name: any, group: any) => {
//             return styledLayerConroller.addBaseLayer(layer, name, group);
//         },

//         addOverlay: (layer: any, name: any, group: any, className?: string) => {
//             return styledLayerConroller.addOverlay(layer, name, group, className);
//         },
//         deleteLayer: (layer: any) => {
//             styledLayerConroller.deleteLayer(layer);
//         },
//         removeLayer: (layer: any) => {
//             return styledLayerConroller.removeLayer(layer);
//         },
//         removeGroup: (group_Name: string, del: any) => {
//             styledLayerConroller.removeGroup(group_Name, del);
//         },
//         removeAllGroups: (del: any) => {
//             styledLayerConroller.removeAllGroups(del);
//         },
//         selectLayer: (layer: any) => {
//             styledLayerConroller.selectLayer(layer);
//         },
//         unSelectLayer: (layer: any) => {
//             styledLayerConroller.unSelectLayer(layer);
//         },
//         changeGroup: (group_Name: string, select: any) => {
//             styledLayerConroller.changeGroup(group_Name, select);
//         }
//     });

//     this.element = new control();
// }