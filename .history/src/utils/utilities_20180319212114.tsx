import _ from "lodash";

export default class Utils {
    public static log_componentWillLoad(compName: string) {
        console.log(`componentWillLoad ${compName}`);
    }
    public static log_componentDidLoad(compName: string) {
        console.log(`componentDidLoad ${compName}`);
    }
    public static log_componentDidUnload(compName: string) {
        console.log(`componentDidUnload ${compName}`);
    }
    public static doNothing(imports: any) {
        !!imports
    }
    public static appendHtmlWithContext = function (elm: HTMLElement, dom: string, context: any) {
        elm.innerHTML = dom;
        const elements = elm.querySelectorAll("[attachEvent]");

        _.forEach(elements, (element: any) => {
            element.getAttribute("attachEvent").split(";").forEach(function (event: any) {
                const eventNameAndHandler = event.split(":");
                const eventName = eventNameAndHandler[0];
                const eventHandler = eventNameAndHandler[1];

                if (eventName && eventHandler) {
                    element.addEventListener(eventName, context[eventHandler].bind(context));
                }
            });
        });
    };
    public static stopDoubleClickOnPlugin(htmlElement: HTMLElement) {
        // Disable double-click
        htmlElement.addEventListener("dblclick", (eventData: any) => {
            eventData.stopPropagation();
        });
    }
    public static fitLayerControllerPosition(LayerControllerMode: string = ''): void {
        const layerControllerButton: any = document.querySelector('.custom-toolbar-button.layer-controller');
        const layerControllerPlugin: any = document.querySelector('.custom-layer-controller');
        if (!(layerControllerButton && layerControllerPlugin)) { return; }
debugger
        layerControllerPlugin.style.left = layerControllerButton.offsetLeft + 'px';
        // layerControllerPlugin.className = layerControllerPlugin.className+ ' ' + isShowLayerController;

        const customLayerController: any = document.querySelector('.custom-layer-controller');
        customLayerController.className = layerControllerPlugin.className + ' ' + LayerControllerMode;
        const styledLayerControllerElement: any = document.querySelector('.leaflet-control-layers-expanded');

        styledLayerControllerElement.parentNode.removeChild(styledLayerControllerElement);
        customLayerController.appendChild(styledLayerControllerElement);
        
    }
}

