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
    @Prop() dropDownTitle: string;

    @Prop() dropDownData: any[];
    @Prop() dropDownTitle: string;

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
        this.control = this.createCustomControl(this.dropDownData, this.dropDownTitle);
        this.gisMap.addControl(this.control);
    }

    private createCustomControl(dropDownData: any[], dropDownTitle: string) {
        try {
            const customControl = L.Control.extend({
                options: {},
                onAdd: () => {
                    const container = L.DomUtil.create('div', 'leaflet-draw-toolbar leaflet-bar');
                    const menuBtn = L.DomUtil.create('a', 'export-bt btn-menu custom-icon');
                    const list = L.DomUtil.create('ul', 'menu');

                    menuBtn.title = dropDownTitle;
                    menuBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        Utils.toggleCustomDropDownMenu(list);
                    });

                    container.appendChild(menuBtn);

                    // create list items
                    _.forEach(dropDownData, (item: any) => {
                        const listItem = L.DomUtil.create('li', 'menu-item');
                        const icon = L.DomUtil.create('i', 'menu-item-icon ' + item.className);
                        const label = L.DomUtil.create('span', 'menu-item-label');

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
        } catch (e) {
            console.error('failed to create custom control: ' + e);
            return null;
        }
    }

    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }
}