/*! Built with http://stenciljs.com */
(function(win, doc, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components) {

function init(win, doc, docScripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCorePolyfilled, hydratedCssClass, components, x, y) {
    // create global namespace if it doesn't already exist
    (win[appNamespace] = win[appNamespace] || {}).components = components;
    y = components.filter(function (c) { return c[2]; }).map(function (c) { return c[0]; });
    if (y.length) {
        // auto hide components until they been fully hydrated
        // reusing the "x" and "i" variables from the args for funzies
        x = doc.createElement('style');
        x.innerHTML = y.join() + '{visibility:hidden}.' + hydratedCssClass + '{visibility:inherit}';
        x.setAttribute('data-styles', '');
        doc.head.insertBefore(x, doc.head.firstChild);
    }
    // get this current script
    // script tag cannot use "async" attribute
    if (discoverPublicPath) {
        x = docScripts[docScripts.length - 1];
        if (x && x.src) {
            y = x.src.split('/').slice(0, -1);
            publicPath = (y.join('/')) + (y.length ? '/' : '') + urlNamespace + '/';
        }
    }
    // request the core this browser needs
    // test for native support of custom elements and fetch
    // if either of those are not supported, then use the core w/ polyfills
    // also check if the page was build with ssr or not
    x = doc.createElement('script');
    x.src = publicPath + (usePolyfills(win, win.location, x, 'import("")') ? appCorePolyfilled : appCore);
    x.setAttribute('data-path', publicPath);
    x.setAttribute('data-namespace', urlNamespace);
    doc.head.appendChild(x);
}
function usePolyfills(win, location, scriptElm, dynamicImportTest) {
    // fyi, dev mode has verbose if/return statements
    // but it minifies to a nice 'lil one-liner ;)
    if (location.search.indexOf('core=es5') > -1) {
        // force es5 polyfill w/ ?core=es5 querystring
        return true;
    }
    if (location.protocol === 'file:') {
        // file protocol cannot use dynamic module imports
        return true;
    }
    if (!win.customElements) {
        // does not have customElement support
        return true;
    }
    if (!win.fetch) {
        // does not have fetch support
        return true;
    }
    if (!(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) {
        // does not have CSS variables support
        return true;
    }
    if (!('noModule' in scriptElm)) {
        // does not have static ES module support
        return true;
    }
    return doesNotSupportsDynamicImports(dynamicImportTest);
}
function doesNotSupportsDynamicImports(dynamicImportTest) {
    try {
        new Function(dynamicImportTest);
        return false;
    }
    catch (e) { }
    return true;
}


init(win, doc, doc.scripts, appNamespace, urlNamespace, publicPath, discoverPublicPath, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components);

})(window, document, "gisviewer","gisviewer","/build/gisviewer/",true,"gisviewer.core.js","es5-build-disabled.js","hydrated",[["dev-component","dev-component",1,[["gisViewerState",5]]],["draw-bar-plugin","draw-bar-plugin",1,[["config",1],["drawControl",5],["drawnLayer",5],["gisMap",1],["metric",1,1,3]]],["full-screen-plugin","dev-component",1,[["config",1],["fullScreenControl",5],["gisMap",1]]],["gis-viewer","dev-component",1,[["changeCoordinateSystem",6],["changeUnits",6],["gisViewerProps",1]]],["map-container","dev-component",1,[["changeCoordinateSystem",6],["changeUnits",6],["coordinateSystemType",5],["gisMap",5],["gisViewerProps",1],["metric",5]]],["mini-map-plugin","mini-map-plugin",1,[["config",1],["gisMap",1],["minimapControl",5]]],["mouse-coordinate-plugin","mouse-coordinate-plugin",1,[["config",1],["controlGps",5],["controlUtm",5],["controlUtmref",5],["coordinateSystemType",1],["gisMap",1]]],["scale-control-plugin","scale-control-plugin",1,[["config",1],["elementControl",5],["gisMap",1],["metric",1,1,3]]],["tool-bar","dev-component",1,[["config",1],["gisMap",1],["metric",1,1,3]]],["zoom-to-extent-plugin","zoom-to-extent-plugin",1,[["config",1],["gisMap",1],["zoomControl",5]]]]);