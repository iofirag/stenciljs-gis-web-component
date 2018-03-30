import { CUSTOM_DROP_DOWN_PLUGIN_TAG } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import { Component, Prop, State, Method } from "@stencil/core";
import L from 'leaflet';
import _ from "lodash";
import { DropDownItemType } from "../../../../../models";
// import store from "../../../../store/store";
// import { reaction } from "mobx";
// import store from "../../../../store/store";


@Component({
    tag: 'custom-drop-down-plugin',
    styleUrls: [
        '../drop-down-plugin/drop-down-plugin.scss',
        // 'custom-drop-down-plugin.scss'
    ]
})
export class CustomDropDownPlugin {
    compName: string = CUSTOM_DROP_DOWN_PLUGIN_TAG;
    @Prop() gisMap: L.Map;
    @Prop() dropDownData: any[];
    @Prop() customControlName: string;
    @Prop() dropDownTitle?: string;

    @State() control: L.Control.CustomDropDownPlugin;


    @Method()
    getControl(): L.Control.CustomDropDownPlugin {
        return this.control;
    }

    // constructor() {
    // }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
    }
    // componentWillUpdate() {
    //     // debugger
    //     // this.control.customUpdate();
    // }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        const customControllerName = /* CUSTOM_DROP_DOWN_PLUGIN_TAG + '_' +  */this.customControlName;
        this.control = this.createCustomControl(this.dropDownData, customControllerName, this.dropDownTitle);
        this.gisMap.addControl(this.control);
    }

    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }

    private createCustomControl(dropDownData: any[], customControlName: string, dropDownTitle: string = ''): L.Control.CustomDropDownPlugin {
        try {
            const customControl = L.Control.extend({
                options: {},
                onAdd: () => {
                    const container = L.DomUtil.create('div', 'leaflet-draw-toolbar leaflet-bar');
                    const menuBtn = L.DomUtil.create('a', 'btn-menu custom-icon ' + customControlName);
                    const list = L.DomUtil.create('ul', 'menu');

                    menuBtn.title = dropDownTitle;
                    menuBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        Utils.toggleCustomDropDownMenu(list);
                    });
                    // add list items according to the state (see received dropDownData structure)
                    _.reduce(dropDownData, (list: HTMLElement, group: any/* , key: string */) => {
                        const li = L.DomUtil.create('li', 'menu-item custom-group');
                        // fill list item with the relevant markup according to the state
                        _.reduce(group.itemList, (li: HTMLElement, item: any/* , key: string */) => {
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
            }).bind(this)

            return new customControl();
        } catch (e) {
            console.error('failed to create custom control: ' + e);
            return null;
        }
    }
    private createDropDownItem(dropDownDataItem: any) {
        const mainId = dropDownDataItem.name.replace(/\s+/g, '-').toLowerCase();
        const id = `${mainId}-${dropDownDataItem.label.replace(/\s+/g, '-').toLowerCase()}`;
        const gItem = L.DomUtil.create('div', 'group-item');
        const input = L.DomUtil.create('input', 'group-item-input');
        const label = L.DomUtil.create('label', 'group-item-input-label');
        const icon = L.DomUtil.create('i', 'group-item-icon ' + dropDownDataItem.iconClassName);

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
                _.forEach(gItem.childNodes, (item: HTMLElement) => {
                    item.style.pointerEvents = 'none';
                });

                // init selected item
                if (dropDownDataItem.value === dropDownDataItem.storeValue ) {
                    input.setAttribute('checked', 'true');
                }
                // Set on click function
                gItem.addEventListener('click', () => {
                    dropDownDataItem.changeAction.bind(dropDownDataItem.value.toLowerCase())
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
                _.forEach(gItem.childNodes, (item: HTMLElement) => {
                    item.style.pointerEvents = 'none';
                });

                // add click event on the group item
                gItem.addEventListener('click', (e: any) => {
                    e.stopPropagation();
                    const allInputs = e.target.parentElement.querySelectorAll('.group-item-input');

                    // remove all 'checked' attributes (this attribute is in charge of selecting the radio button)
                    _.forEach(allInputs, (input: HTMLElement) => {
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
                const gItem = L.DomUtil.create('div', 'group-item');
                return gItem;
            },
        };
        return itemTemplate[dropDownDataItem.type]();
    }
}