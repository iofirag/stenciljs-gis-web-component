/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { commonjsGlobal, createCommonjsModule, MINI_MAP_PLUGIN_TAG, default$1 as L$1 } from './chunk1.js';
import require$$0 from './chunk3.js';

var Control_MiniMap_min = createCommonjsModule(function (module, exports) {
(function(factory,window){if(typeof undefined==="function"&&undefined.amd){undefined(["leaflet"],factory);}else {module.exports=factory(require$$0);}if(typeof window!=="undefined"&&window.L){window.L.Control.MiniMap=factory(L);window.L.control.minimap=function(layer,options){return new window.L.Control.MiniMap(layer,options)};}})(function(L){var MiniMap=L.Control.extend({includes:L.Evented?L.Evented.prototype:L.Mixin.Events,options:{position:"bottomright",toggleDisplay:false,zoomLevelOffset:-5,zoomLevelFixed:false,centerFixed:false,zoomAnimation:false,autoToggleDisplay:false,minimized:false,width:150,height:150,collapsedWidth:19,collapsedHeight:19,aimingRectOptions:{color:"#ff7800",weight:1,clickable:false},shadowRectOptions:{color:"#000000",weight:1,clickable:false,opacity:0,fillOpacity:0},strings:{hideText:"Hide MiniMap",showText:"Show MiniMap"},mapOptions:{}},initialize:function(layer,options){L.Util.setOptions(this,options);this.options.aimingRectOptions.clickable=false;this.options.shadowRectOptions.clickable=false;this._layer=layer;},onAdd:function(map){this._mainMap=map;this._container=L.DomUtil.create("div","leaflet-control-minimap");this._container.style.width=this.options.width+"px";this._container.style.height=this.options.height+"px";L.DomEvent.disableClickPropagation(this._container);L.DomEvent.on(this._container,"mousewheel",L.DomEvent.stopPropagation);var mapOptions={attributionControl:false,dragging:!this.options.centerFixed,zoomControl:false,zoomAnimation:this.options.zoomAnimation,autoToggleDisplay:this.options.autoToggleDisplay,touchZoom:this.options.centerFixed?"center":!this._isZoomLevelFixed(),scrollWheelZoom:this.options.centerFixed?"center":!this._isZoomLevelFixed(),doubleClickZoom:this.options.centerFixed?"center":!this._isZoomLevelFixed(),boxZoom:!this._isZoomLevelFixed(),crs:map.options.crs};mapOptions=L.Util.extend(this.options.mapOptions,mapOptions);this._miniMap=new L.Map(this._container,mapOptions);this._miniMap.addLayer(this._layer);this._mainMapMoving=false;this._miniMapMoving=false;this._userToggledDisplay=false;this._minimized=false;if(this.options.toggleDisplay){this._addToggleButton();}this._miniMap.whenReady(L.Util.bind(function(){this._aimingRect=L.rectangle(this._mainMap.getBounds(),this.options.aimingRectOptions).addTo(this._miniMap);this._shadowRect=L.rectangle(this._mainMap.getBounds(),this.options.shadowRectOptions).addTo(this._miniMap);this._mainMap.on("moveend",this._onMainMapMoved,this);this._mainMap.on("move",this._onMainMapMoving,this);this._miniMap.on("movestart",this._onMiniMapMoveStarted,this);this._miniMap.on("move",this._onMiniMapMoving,this);this._miniMap.on("moveend",this._onMiniMapMoved,this);},this));return this._container},addTo:function(map){L.Control.prototype.addTo.call(this,map);var center=this.options.centerFixed||this._mainMap.getCenter();this._miniMap.setView(center,this._decideZoom(true));this._setDisplay(this.options.minimized);return this},onRemove:function(map){this._mainMap.off("moveend",this._onMainMapMoved,this);this._mainMap.off("move",this._onMainMapMoving,this);this._miniMap.off("moveend",this._onMiniMapMoved,this);this._miniMap.removeLayer(this._layer);},changeLayer:function(layer){this._miniMap.removeLayer(this._layer);this._layer=layer;this._miniMap.addLayer(this._layer);},_addToggleButton:function(){this._toggleDisplayButton=this.options.toggleDisplay?this._createButton("",this._toggleButtonInitialTitleText(),"leaflet-control-minimap-toggle-display leaflet-control-minimap-toggle-display-"+this.options.position,this._container,this._toggleDisplayButtonClicked,this):undefined;this._toggleDisplayButton.style.width=this.options.collapsedWidth+"px";this._toggleDisplayButton.style.height=this.options.collapsedHeight+"px";},_toggleButtonInitialTitleText:function(){if(this.options.minimized){return this.options.strings.showText}else{return this.options.strings.hideText}},_createButton:function(html,title,className,container,fn,context){var link=L.DomUtil.create("a",className,container);link.innerHTML=html;link.href="#";link.title=title;var stop=L.DomEvent.stopPropagation;L.DomEvent.on(link,"click",stop).on(link,"mousedown",stop).on(link,"dblclick",stop).on(link,"click",L.DomEvent.preventDefault).on(link,"click",fn,context);return link},_toggleDisplayButtonClicked:function(){this._userToggledDisplay=true;if(!this._minimized){this._minimize();}else{this._restore();}},_setDisplay:function(minimize){if(minimize!==this._minimized){if(!this._minimized){this._minimize();}else{this._restore();}}},_minimize:function(){if(this.options.toggleDisplay){this._container.style.width=this.options.collapsedWidth+"px";this._container.style.height=this.options.collapsedHeight+"px";this._toggleDisplayButton.className+=" minimized-"+this.options.position;this._toggleDisplayButton.title=this.options.strings.showText;}else{this._container.style.display="none";}this._minimized=true;this._onToggle();},_restore:function(){if(this.options.toggleDisplay){this._container.style.width=this.options.width+"px";this._container.style.height=this.options.height+"px";this._toggleDisplayButton.className=this._toggleDisplayButton.className.replace("minimized-"+this.options.position,"");this._toggleDisplayButton.title=this.options.strings.hideText;}else{this._container.style.display="block";}this._minimized=false;this._onToggle();},_onMainMapMoved:function(e){if(!this._miniMapMoving){var center=this.options.centerFixed||this._mainMap.getCenter();this._mainMapMoving=true;this._miniMap.setView(center,this._decideZoom(true));this._setDisplay(this._decideMinimized());}else{this._miniMapMoving=false;}this._aimingRect.setBounds(this._mainMap.getBounds());},_onMainMapMoving:function(e){this._aimingRect.setBounds(this._mainMap.getBounds());},_onMiniMapMoveStarted:function(e){if(!this.options.centerFixed){var lastAimingRect=this._aimingRect.getBounds();var sw=this._miniMap.latLngToContainerPoint(lastAimingRect.getSouthWest());var ne=this._miniMap.latLngToContainerPoint(lastAimingRect.getNorthEast());this._lastAimingRectPosition={sw:sw,ne:ne};}},_onMiniMapMoving:function(e){if(!this.options.centerFixed){if(!this._mainMapMoving&&this._lastAimingRectPosition){this._shadowRect.setBounds(new L.LatLngBounds(this._miniMap.containerPointToLatLng(this._lastAimingRectPosition.sw),this._miniMap.containerPointToLatLng(this._lastAimingRectPosition.ne)));this._shadowRect.setStyle({opacity:1,fillOpacity:.3});}}},_onMiniMapMoved:function(e){if(!this._mainMapMoving){this._miniMapMoving=true;this._mainMap.setView(this._miniMap.getCenter(),this._decideZoom(false));this._shadowRect.setStyle({opacity:0,fillOpacity:0});}else{this._mainMapMoving=false;}},_isZoomLevelFixed:function(){var zoomLevelFixed=this.options.zoomLevelFixed;return this._isDefined(zoomLevelFixed)&&this._isInteger(zoomLevelFixed)},_decideZoom:function(fromMaintoMini){if(!this._isZoomLevelFixed()){if(fromMaintoMini){return this._mainMap.getZoom()+this.options.zoomLevelOffset}else{var currentDiff=this._miniMap.getZoom()-this._mainMap.getZoom();var proposedZoom=this._miniMap.getZoom()-this.options.zoomLevelOffset;var toRet;if(currentDiff>this.options.zoomLevelOffset&&this._mainMap.getZoom()<this._miniMap.getMinZoom()-this.options.zoomLevelOffset){if(this._miniMap.getZoom()>this._lastMiniMapZoom){toRet=this._mainMap.getZoom()+1;this._miniMap.setZoom(this._miniMap.getZoom()-1);}else{toRet=this._mainMap.getZoom();}}else{toRet=proposedZoom;}this._lastMiniMapZoom=this._miniMap.getZoom();return toRet}}else{if(fromMaintoMini){return this.options.zoomLevelFixed}else{return this._mainMap.getZoom()}}},_decideMinimized:function(){if(this._userToggledDisplay){return this._minimized}if(this.options.autoToggleDisplay){if(this._mainMap.getBounds().contains(this._miniMap.getBounds())){return true}return false}return this._minimized},_isInteger:function(value){return typeof value==="number"},_isDefined:function(value){return typeof value!=="undefined"},_onToggle:function(){L.Util.requestAnimFrame(function(){L.DomEvent.on(this._container,"transitionend",this._fireToggleEvents,this);if(!L.Browser.any3d){L.Util.requestAnimFrame(this._fireToggleEvents,this);}},this);},_fireToggleEvents:function(){L.DomEvent.off(this._container,"transitionend",this._fireToggleEvents,this);var data={minimized:this._minimized};this.fire(this._minimized?"minimize":"restore",data);this.fire("toggle",data);}});L.Map.mergeOptions({miniMapControl:false});L.Map.addInitHook(function(){if(this.options.miniMapControl){this.miniMapControl=(new MiniMap).addTo(this);}});return MiniMap},window);
});

class MiniMapPlugin {
    constructor() {
        this.compName = MINI_MAP_PLUGIN_TAG;
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        if (!this.gisMap)
            return;
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        // Minimap
        let osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
        var minimapLayer = L$1.tileLayer(osmUrl, { minZoom: 0, maxZoom: 13 });
        console.log(minimapLayer, osmUrl);
        this.minimapControl = new Control_MiniMap_min(minimapLayer, this.config.miniMapOptions);
        this.minimapControl.addTo(this.gisMap);
        this.gisMap.addControl(this.minimapControl);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.minimapControl);
    }
    static get is() { return "mini-map-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "gisMap": { "type": "Any", "attr": "gis-map" }, "minimapControl": { "state": true } }; }
    static get style() { return ".leaflet-control-minimap{border:rgba(255,255,255,1) solid;box-shadow:0 1px 5px rgba(0,0,0,.65);border-radius:3px;background:#f8f8f9;transition:all .6s}.leaflet-control-minimap a{background-color:rgba(255,255,255,1);background-repeat:no-repeat;z-index:99999;transition:all .6s}.leaflet-control-minimap a.minimized-bottomright{-webkit-transform:rotate(180deg);transform:rotate(180deg);border-radius:0}.leaflet-control-minimap a.minimized-topleft{-webkit-transform:rotate(0deg);transform:rotate(0deg);border-radius:0}.leaflet-control-minimap a.minimized-bottomleft{-webkit-transform:rotate(270deg);transform:rotate(270deg);border-radius:0}.leaflet-control-minimap a.minimized-topright{-webkit-transform:rotate(90deg);transform:rotate(90deg);border-radius:0}.leaflet-control-minimap-toggle-display{background-image:url(images/toggle.svg);background-size:cover;position:absolute;border-radius:3px 0 0}.leaflet-oldie .leaflet-control-minimap-toggle-display{background-image:url(images/toggle.png)}.leaflet-control-minimap-toggle-display-bottomright{bottom:0;right:0}.leaflet-control-minimap-toggle-display-topleft{top:0;left:0;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.leaflet-control-minimap-toggle-display-bottomleft{bottom:0;left:0;-webkit-transform:rotate(90deg);transform:rotate(90deg)}.leaflet-control-minimap-toggle-display-topright{top:0;right:0;-webkit-transform:rotate(270deg);transform:rotate(270deg)}.leaflet-oldie .leaflet-control-minimap{border:1px solid #999}.leaflet-oldie .leaflet-control-minimap a{background-color:#fff}.leaflet-oldie .leaflet-control-minimap a.minimized{filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=2)}"; }
}

export { MiniMapPlugin };
