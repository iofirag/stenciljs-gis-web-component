/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { DROP_DOWN_PLUGIN_TAG, default$1 as L$1, default$2 as _ } from './chunk1.js';

class DropDownPlugin {
    constructor() {
        this.compName = DROP_DOWN_PLUGIN_TAG;
    }
    // @Event() zoomToExtentDoneEm: EventEmitter<null>;
    getControl() {
        return this.control;
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.control = this.createCustomControl(this.dropDownData, this.dropDownTitle);
        this.gisMap.addControl(this.control);
    }
    createCustomControl(dropDownData, dropDownTitle) {
        try {
            const customControl = L$1.Control.extend({
                options: {},
                onAdd: () => {
                    const container = L$1.DomUtil.create('div', 'leaflet-draw-toolbar leaflet-bar');
                    const menuBtn = L$1.DomUtil.create('a', 'export-bt btn-menu custom-icon');
                    const list = L$1.DomUtil.create('ul', 'menu');
                    menuBtn.title = dropDownTitle;
                    menuBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        Utils.toggleCustomDropDownMenu(list);
                    });
                    container.appendChild(menuBtn);
                    // create list items
                    _.forEach(dropDownData, (item) => {
                        const listItem = L$1.DomUtil.create('li', 'menu-item');
                        const icon = L$1.DomUtil.create('i', 'menu-item-icon ' + item.className);
                        const label = L$1.DomUtil.create('span', 'menu-item-label');
                        label.innerText = item.label;
                        listItem.appendChild(icon);
                        listItem.appendChild(label);
                        listItem.addEventListener('click', () => {
                            item.onClick();
                            Utils.toggleCustomDropDownMenu(list);
                        });
                        list.appendChild(listItem);
                    });
                    container.appendChild(list);
                    return container;
                },
            });
            return new customControl();
        }
        catch (e) {
            console.error('failed to create custom control: ' + e);
            return null;
        }
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }
    static get is() { return "drop-down-plugin"; }
    static get properties() { return { "control": { "state": true }, "dropDownData": { "type": "Any", "attr": "drop-down-data" }, "dropDownTitle": { "type": String, "attr": "drop-down-title" }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return ".export-map {\n  position: absolute;\n  right: 68px;\n  top: -44px; }\n\n.button-wrapper {\n  position: relative; }\n\n.btn-menu {\n  cursor: pointer; }\n  .btn-menu:hover {\n    background-color: #f4f4f4; }\n\n.menu {\n  list-style: none;\n  padding-left: 0;\n  width: fit-content;\n  margin: 0;\n  top: 34px;\n  display: none;\n  position: absolute;\n  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.36); }\n\n.menu-item {\n  height: 30px;\n  padding: 0 10px;\n  white-space: nowrap;\n  border-bottom: 1px solid lightgray;\n  box-sizing: border-box;\n  background-color: white;\n  display: flex;\n  align-items: center;\n  cursor: pointer; }\n  .menu-item:last-child {\n    border-bottom: none; }\n  .menu-item:hover {\n    background-color: lightyellow; }\n\n.custom-icon {\n  width: 30px;\n  height: 30px;\n  background-repeat: no-repeat;\n  background-size: 19px 19px;\n  background-position: 50%; }\n\n.icon-kml {\n  background-image: url(\"./assets/icons/kml-icon.png\"); }\n\n.icon-shp {\n  background-image: url(\"./assets/icons/icon-shp.png\"); }\n\n.icon-csv {\n  background-image: url(\"./assets/icons/csv-icon.png\"); }\n\n.icon-pin {\n  background-image: url(\"./assets/icons/pin-icon.png\"); }\n\n.icon-heatmap {\n  background-image: url(\"./assets/icons/heatmap-icon.png\"); }\n\n.icon-cluster {\n  background-image: url(\"./assets/icons/cluster-icon.png\"); }\n\n.icon-csv,\n.icon-shp,\n.icon-kml,\n.icon-pin,\n.icon-heatmap,\n.icon-cluster {\n  width: 14px;\n  height: 14px;\n  background-size: 14px;\n  margin-right: 5px; }\n\n.export-bt {\n  background-image: url(\"./assets/icons/export-icon.png\") !important;\n  background-size: 14px 14px !important; }\n\n.settings {\n  background-image: url(\"./assets/icons/settings-icon.png\") !important;\n  background-size: 14px 14px !important; }\n\n.menu-item.custom-group {\n  display: flex;\n  flex-direction: column;\n  border-bottom: 1px solid black;\n  height: initial;\n  cursor: initial; }\n  .menu-item.custom-group:last-child {\n    border: none; }\n  .menu-item.custom-group:hover {\n    background: white; }\n\n.group-item {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  width: 100%;\n  height: 30px;\n  border-bottom: 1px solid lightgrey;\n  padding: 0 10px;\n  cursor: pointer; }\n  .group-item:last-child {\n    border: none; }\n  .group-item:hover {\n    background-color: lightyellow; }\n\n.group-item-input-label {\n  text-transform: uppercase; }\n\n.group-item-input {\n  justify-self: self-end;\n  display: flex;\n  margin-left: auto;\n  margin-right: 0;\n  outline: none; }\n"; }
}

export { DropDownPlugin };
