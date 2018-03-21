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

        _.forEach(, )
        elements.forEach(function (element: any) {
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
}

