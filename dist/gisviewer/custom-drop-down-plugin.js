/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { CUSTOM_DROP_DOWN_PLUGIN_TAG, default$1 as L$1, default$2 as _ } from './chunk1.js';
import { DropDownItemType } from './chunk2.js';

class CustomDropDownPlugin {
    constructor() {
        this.compName = CUSTOM_DROP_DOWN_PLUGIN_TAG;
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
        const customControllerName = CUSTOM_DROP_DOWN_PLUGIN_TAG + '_' + this.customControlName;
        this.control = this.createCustomControl(this.dropDownData, customControllerName, this.dropDownTitle = '');
        this.gisMap.addControl(this.control);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }
    createCustomControl(dropDownData, customControlName, dropDownTitle) {
        try {
            const customControl = L$1.Control.extend({
                options: {},
                onAdd: () => {
                    const container = L$1.DomUtil.create('div', 'leaflet-draw-toolbar leaflet-bar');
                    const menuBtn = L$1.DomUtil.create('a', 'btn-menu custom-icon ' + customControlName);
                    const list = L$1.DomUtil.create('ul', 'menu');
                    menuBtn.title = dropDownTitle;
                    menuBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        Utils.toggleCustomDropDownMenu(list);
                    });
                    // add list items according to the state (see received dropDownData structure)
                    _.reduce(dropDownData, (list, group /* , key: string */) => {
                        const li = L$1.DomUtil.create('li', 'menu-item custom-group');
                        // fill list item with the relevant markup according to the state
                        _.reduce(group.itemList, (li, item /* , key: string */) => {
                            const customGroupItem = this.createDropDownItem(item);
                            li.appendChild(customGroupItem);
                            return li;
                        }, li);
                        list.appendChild(li);
                        return list;
                    }, list);
                    container.appendChild(menuBtn);
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
    createDropDownItem(dropDownDataItem) {
        const mainId = dropDownDataItem.name.replace(/\s+/g, '-').toLowerCase();
        const id = `${mainId}-${dropDownDataItem.label.replace(/\s+/g, '-').toLowerCase()}`;
        const gItem = L$1.DomUtil.create('div', 'group-item');
        const input = L$1.DomUtil.create('input', 'group-item-input');
        const label = L$1.DomUtil.create('label', 'group-item-input-label');
        const icon = L$1.DomUtil.create('i', 'group-item-icon ' + dropDownDataItem.iconClassName);
        gItem.appendChild(icon);
        gItem.appendChild(label);
        gItem.appendChild(input);
        const itemTemplate = {
            [DropDownItemType.RADIO_BUTTON]: () => {
                input.setAttribute('type', 'radio');
                input.setAttribute('name', dropDownDataItem.name);
                input.setAttribute('value', dropDownDataItem.label);
                input.setAttribute('id', id);
                /*to be able to click all over the item and switch between the radio buttons
                we need to disable all the click events on the this elements*/
                _.forEach(gItem.childNodes, (item) => {
                    item.style.pointerEvents = 'none';
                });
                // init selected item
                if (dropDownDataItem.isSelected) {
                    input.setAttribute('checked', dropDownDataItem.isSelected);
                }
                // add click event on the group item
                gItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const allInputs = e.target.parentElement.querySelectorAll('.group-item-input');
                    // remove all 'checked' attributes (this attribute is in charge of selecting the radio button)
                    _.forEach(allInputs, (input) => {
                        input.removeAttribute('checked');
                    });
                    // select check box
                    e.target.childNodes[2].setAttribute('checked', 'true');
                    dropDownDataItem.onClick(e.target.childNodes[2].value);
                });
                label.innerText = dropDownDataItem.label.replace(/-/g, ' ');
                return gItem;
            },
            [DropDownItemType.CHECK_BOX]: () => {
                input.setAttribute('type', 'checkbox');
                input.setAttribute('value', dropDownDataItem.label);
                input.setAttribute('id', id);
                /*to be able to click all over the item and switch between the radio buttons
                we need to disable all the click events on the this elements*/
                _.forEach(gItem.childNodes, (item) => {
                    item.style.pointerEvents = 'none';
                });
                // add click event on the group item
                gItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const allInputs = e.target.parentElement.querySelectorAll('.group-item-input');
                    // remove all 'checked' attributes (this attribute is in charge of selecting the radio button)
                    _.forEach(allInputs, (input) => {
                        input.removeAttribute('checked');
                    });
                    // select check box
                    e.target.childNodes[2].checked = !e.target.childNodes[2].checked;
                    dropDownDataItem.onClick(e.target.childNodes[2].value);
                });
                label.innerText = dropDownDataItem.label.replace(/-/g, ' ');
                return gItem;
            },
            [DropDownItemType.REGULAR]: () => {
                const gItem = L$1.DomUtil.create('div', 'group-item');
                return gItem;
            },
        };
        return itemTemplate[dropDownDataItem.type]();
    }
    static get is() { return "custom-drop-down-plugin"; }
    static get properties() { return { "control": { "state": true }, "customControlName": { "type": String, "attr": "custom-control-name" }, "dropDownData": { "type": "Any", "attr": "drop-down-data" }, "dropDownTitle": { "type": String, "attr": "drop-down-title" }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return ".export-map {\n  position: absolute;\n  right: 68px;\n  top: -44px; }\n\n.button-wrapper {\n  position: relative; }\n\n.btn-menu {\n  cursor: pointer; }\n  .btn-menu:hover {\n    background-color: #f4f4f4; }\n\n.menu {\n  list-style: none;\n  padding-left: 0;\n  width: fit-content;\n  margin: 0;\n  top: 34px;\n  display: none;\n  position: absolute;\n  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.36); }\n\n.menu-item {\n  height: 30px;\n  padding: 0 10px;\n  white-space: nowrap;\n  border-bottom: 1px solid lightgray;\n  box-sizing: border-box;\n  background-color: white;\n  display: flex;\n  align-items: center;\n  cursor: pointer; }\n  .menu-item:last-child {\n    border-bottom: none; }\n  .menu-item:hover {\n    background-color: lightyellow; }\n\n.custom-icon {\n  width: 30px;\n  height: 30px;\n  background-repeat: no-repeat;\n  background-size: 19px 19px;\n  background-position: 50%; }\n\n.icon-kml {\n  background-image: url(\"./assets/icons/kml-icon.png\"); }\n\n.icon-shp {\n  background-image: url(\"./assets/icons/icon-shp.png\"); }\n\n.icon-csv {\n  background-image: url(\"./assets/icons/csv-icon.png\"); }\n\n.icon-pin {\n  background-image: url(\"./assets/icons/pin-icon.png\"); }\n\n.icon-heatmap {\n  background-image: url(\"./assets/icons/heatmap-icon.png\"); }\n\n.icon-cluster {\n  background-image: url(\"./assets/icons/cluster-icon.png\"); }\n\n.icon-csv,\n.icon-shp,\n.icon-kml,\n.icon-pin,\n.icon-heatmap,\n.icon-cluster {\n  width: 14px;\n  height: 14px;\n  background-size: 14px;\n  margin-right: 5px; }\n\n.export-bt {\n  background-image: url(\"./assets/icons/export-icon.png\") !important;\n  background-size: 14px 14px !important; }\n\n.settings {\n  background-image: url(\"./assets/icons/settings-icon.png\") !important;\n  background-size: 14px 14px !important; }\n\n.menu-item.custom-group {\n  display: flex;\n  flex-direction: column;\n  border-bottom: 1px solid black;\n  height: initial;\n  cursor: initial; }\n  .menu-item.custom-group:last-child {\n    border: none; }\n  .menu-item.custom-group:hover {\n    background: white; }\n\n.group-item {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  width: 100%;\n  height: 30px;\n  border-bottom: 1px solid lightgrey;\n  padding: 0 10px;\n  cursor: pointer; }\n  .group-item:last-child {\n    border: none; }\n  .group-item:hover {\n    background-color: lightyellow; }\n\n.group-item-input-label {\n  text-transform: uppercase; }\n\n.group-item-input {\n  justify-self: self-end;\n  display: flex;\n  margin-left: auto;\n  margin-right: 0;\n  outline: none; }\n"; }
}

export { CustomDropDownPlugin };
