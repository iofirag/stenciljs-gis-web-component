import _ from "lodash";
export default class Utils {
    static log_componentWillLoad(compName) {
        console.log(`componentWillLoad ${compName}`);
    }
    static log_componentDidLoad(compName) {
        console.log(`componentDidLoad ${compName}`);
    }
    static log_componentDidUnload(compName) {
        console.log(`componentDidUnload ${compName}`);
    }
    static doNothing(imports) {
        !!imports;
    }
    static stopDoubleClickOnPlugin(htmlElement) {
        // Disable double-click
        htmlElement.addEventListener("dblclick", (eventData) => {
            eventData.stopPropagation();
        });
    }
    static fitLayerControllerPosition(LayerControllerMode = '') {
        const layerControllerButton = document.querySelector('.custom-toolbar-button.layer-controller');
        const layerControllerPlugin = document.querySelector('.custom-layer-controller');
        if (!(layerControllerButton && layerControllerPlugin)) {
            return;
        }
        layerControllerPlugin.style.left = layerControllerButton.offsetLeft + 'px';
        // layerControllerPlugin.className = layerControllerPlugin.className+ ' ' + isShowLayerController;
        const customLayerController = document.querySelector('.custom-layer-controller');
        customLayerController.className = layerControllerPlugin.className + ' ' + LayerControllerMode;
        const styledLayerControllerElement = document.querySelector('.leaflet-control-layers-expanded');
        styledLayerControllerElement.parentNode.removeChild(styledLayerControllerElement);
        customLayerController.appendChild(styledLayerControllerElement);
        // Empty class list for this Form element
        // styledLayerControllerElement.firstElementChild.firstElementChild.classList = '';
    }
    static exportBlobFactory(fileType, selectedLeafletObjects, mapState, callback) {
        this.doNothing([fileType, selectedLeafletObjects, mapState, callback]);
        // const relevantExportedLayers: L.Layer[] = Utils.getRelevantExportedLayers(selectedLeafletObjects, mapState, map);
        // const geoJsonList: L.GeoJSON[] = Utils.shapeListToGeoJson(relevantExportedLayers);
        // return Utils.getBlobByType(fileType, geoJsonList, callback);
        return null;
    }
    static toggleCustomDropDownMenu(elm) {
        const toogleState = elm.style.display;
        Utils.closeAllCustomDropDownMenus();
        elm.style.display = (toogleState === 'block') ? 'none' : 'block';
        if (elm.style.display === 'block') {
            document.querySelector('.custom-toolbar-button.layer-controller').classList.remove('clicked');
            document.querySelector('.custom-layer-controller').classList.remove('show');
        }
    }
    static closeAllCustomDropDownMenus() {
        const allDropDownMenus = document.querySelectorAll('.menu');
        _.forEach(allDropDownMenus, (menu) => {
            menu.style.display = 'none';
        });
    }
}
Utils.appendHtmlWithContext = function (elm, dom, context) {
    elm.innerHTML = dom;
    const elements = elm.querySelectorAll("[attachEvent]");
    _.forEach(elements, (element) => {
        element.getAttribute("attachEvent").split(";").forEach(function (event) {
            const eventNameAndHandler = event.split(":");
            const eventName = eventNameAndHandler[0];
            const eventHandler = eventNameAndHandler[1];
            if (eventName && eventHandler) {
                element.addEventListener(eventName, context[eventHandler].bind(context));
            }
        });
    });
};
