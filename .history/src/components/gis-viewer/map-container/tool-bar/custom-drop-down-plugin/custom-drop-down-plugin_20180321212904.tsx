import { CUSTOM_DROP_DOWN_PLUGIN } from "../../../../../utils/statics";
import Utils from "../../../../../utils/utilities";
import { Component, Prop, State, Method } from "@stencil/core";
import L from 'leaflet';
import _ from "lodash";


@Component({
    tag: 'custom-drop-down-plugin',
    styleUrls: [
        'custom-drop-down-plugin.scss'
    ]
})
export class CustomDropDownPlugin {
    compName: string = CUSTOM_DROP_DOWN_PLUGIN;

    @Prop() gisMap: L.Map;
    @Prop() dropDownData: any[];
    @Prop() customControlName: string;
    @Prop() dropDownTitle?: string;

    @State() control: L.Control;
    
    // @Event() zoomToExtentDoneEm: EventEmitter<null>;

    @Method()
    getControl() {
        return this.control;
    }

    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        const customControllerName = CUSTOM_DROP_DOWN_PLUGIN + '_' + this.customControlName;
        this.control = this.createCustomControl(this.dropDownData, customControllerName, this.dropDownTitle='');
        this.gisMap.addControl(this.control);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }

    private createCustomControl(dropDownData: any[], customControlName: string, dropDownTitle: string) {
        try {
            const customControl = L.Control.extend({
                options: {},
                onAdd: () => {
                    const container = L.DomUtil.create('div', 'leaflet-draw-toolbar leaflet-bar');
                    const menuBtn = L.DomUtil.create('a', 'btn-menu custom-icon ' + this.customControlName);
                    const list = L.DomUtil.create('ul', 'menu');

                    menuBtn.title = this.dropDownTitle;
                    menuBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        Utils.toggleCustomDropDownMenu(list);
                    });

                    // add list items according to the state (see received dropDownData structure)
                    _.reduce(this.dropDownData, (list: HTMLElement, group: any, key: string) => {
                        const li = L.DomUtil.create('li', 'menu-item custom-group');

                        // fill list item with the relevant markup according to the state
                        _.reduce(group.itemList, (li: HTMLElement, item: any, key: string) => {
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
        } catch (e) {
            console.error('failed to create custom control: ' + e);
            return null;
        }
    }
}