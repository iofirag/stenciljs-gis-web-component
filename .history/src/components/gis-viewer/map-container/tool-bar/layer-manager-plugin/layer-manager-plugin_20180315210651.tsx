import { Component, Prop, State } from "@stencil/core";
import * as search from 'leaflet.styledlayercontrol';
import { LAYER_MANAGER_PLUGIN_TAG } from "../../../../../utils/statics";
import { } from "../../../../../models/apiModels";
import Utils from "../../../../../utils/utilities";
import L from "leaflet";


@Component({
    tag: 'search-plugin',
    styleUrls: [
        '../../../../../../node_modules/leaflet.styledlayercontrol/css/styledLayerControl.css',
        // './search-plugin.scss',
    ]
})
export class layerManagerPlugin {
    compName: string = LAYER_MANAGER_PLUGIN_TAG
    // @Prop() config: SearchBoxConfig
    @Prop() gisMap: L.Map

    @State() control: L.Control;
    
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        if (!this.gisMap) return;

        Utils.doNothing(search);
        
        this.control = this.createPlugin(null);
        this.gisMap.addControl(this.control);
    }

//     componentDidUnload() {
//         console.log(`componentDidUnload - ${this.compName}`);
//         this.gisMap.removeControl(this.control);
//     }
    private createPlugin(options: any): L.Control {
        Utils.doNothing(options);

        const control: L.Control;

        const layerControllerOptionsDev: any = {
            position: "topleft",
            collapsed: false,
            container_maxHeight: "500px"
        };
        const baseMaps: any[] = [
            {
                groupName: "Base Maps",
                layers: this.context.mapState.baseMaps
            }
        ];
        return control;
    }
}
















private createElement(): void {
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
    const baseMaps: any[] = [
        {
            groupName: "Base Maps",
            layers: this.context.mapState.baseMaps
        }
    ];

    const mapState: MapState = this.context.mapState;
    // const layers: any[] = this.overlayMapsProjection(mapState);  // Remove this

    let styledLayerConroller: any = new L.Control.StyledLayerControl(
        baseMaps, // null,
        null,
        layerControllerOptionsDev
    );

    this.context.map.addControl(styledLayerConroller);

    const control = L.Control.extend({
        options: {
            position: 'topleft'
        },

        onAdd: (map: any) => {
            const div: HTMLElement = L.DomUtil.create('div', 'custom-layer-controller');

            if (_.get(this, 'context.props.isImportExport')) {
                const optionsListOpenningPosition: string = 'left';
                const buttonId: string = `demo-menu-lower-${optionsListOpenningPosition}`;
                const container: string = `
            <div class="custom-layer-controller-header">
              <h2 class="custom-layer-controller-header-title">
                <span>Layers</span>
                <button class="mdl-button mdl-js-button mdl-button--icon" id="${ buttonId}">
                  <i class='material-icons add-circle'>add_circle</i>
                </button>
              </h2>
              <ul id="custom-layer-controller-add-layer-menu" class="mdl-menu mdl-menu--bottom-${optionsListOpenningPosition} mdl-js-menu mdl-js-ripple-effect" for="${buttonId}">
                <li class="mdl-menu__item" for="import-layer">
                  <label class="drop-down-label">
                    Import
                    <input type="file" accept="${ImportFileFormats}" id="import-layer" class="hidden" attachEvent="change:onChangeImport"/>
                  </label>
                </li>
                <li class="mdl-menu__item" disabled>Load</li>
              </ul>
            </div>
          `;

                Utils.appendHtmlWithContext(div, container, this);
            }

            return div;
        },

        onRemove: (map: any) => {
            styledLayerConroller.onRemove(map);
        },

        addBaseLayer: (layer: any, name: any, group: any) => {
            return styledLayerConroller.addBaseLayer(layer, name, group);
        },

        addOverlay: (layer: any, name: any, group: any, className?: string) => {
            return styledLayerConroller.addOverlay(layer, name, group, className);
        },
        deleteLayer: (layer: any) => {
            styledLayerConroller.deleteLayer(layer);
        },
        removeLayer: (layer: any) => {
            return styledLayerConroller.removeLayer(layer);
        },
        removeGroup: (group_Name: string, del: any) => {
            styledLayerConroller.removeGroup(group_Name, del);
        },
        removeAllGroups: (del: any) => {
            styledLayerConroller.removeAllGroups(del);
        },
        selectLayer: (layer: any) => {
            styledLayerConroller.selectLayer(layer);
        },
        unSelectLayer: (layer: any) => {
            styledLayerConroller.unSelectLayer(layer);
        },
        changeGroup: (group_Name: string, select: any) => {
            styledLayerConroller.changeGroup(group_Name, select);
        }
    });

    this.element = new control();
}