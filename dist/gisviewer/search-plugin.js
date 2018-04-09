/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { commonjsGlobal, createCommonjsModule, default$1 as L$1, SEARCH_PLUGIN_TAG } from './chunk1.js';
import require$$0 from './chunk2.js';

var leafletSearch_src = createCommonjsModule(function (module) {
/* 
 * Leaflet Control Search v2.7.2 - 2017-04-08 
 * 
 * Copyright 2017 Stefano Cudini 
 * stefano.cudini@gmail.com 
 * http://labs.easyblog.it/ 
 * 
 * Licensed under the MIT license. 
 * 
 * Demo: 
 * http://labs.easyblog.it/maps/leaflet-search/ 
 * 
 * Source: 
 * git@github.com:stefanocudini/leaflet-search.git 
 * 
 */
(function (factory) {
    if(typeof undefined === 'function' && undefined.amd) {
    //AMD
        undefined(['leaflet'], factory);
    } else {
    // Node/CommonJS
        module.exports = factory(require$$0);
    }
})(function (L) {

	function _getPath(obj, prop) {
		var parts = prop.split('.'),
			last = parts.pop(),
			len = parts.length,
			cur = parts[0],
			i = 1;

		if(len > 0)
			while((obj = obj[cur]) && i < len)
				cur = parts[i++];

		if(obj)
			return obj[last];
	}

	function _isObject(obj) {
		return Object.prototype.toString.call(obj) === "[object Object]";
	}

//TODO implement can do research on multiple sources layers and remote		
//TODO history: false,		//show latest searches in tooltip		
//FIXME option condition problem {autoCollapse: true, markerLocation: true} not show location
//FIXME option condition problem {autoCollapse: false }
//
//TODO here insert function that search inputText FIRST in _recordsCache keys and if not find results.. 
//  run one of callbacks search(sourceData,jsonpUrl or options.layer) and run this.showTooltip
//
//TODO change structure of _recordsCache
//	like this: _recordsCache = {"text-key1": {loc:[lat,lng], ..other attributes.. }, {"text-key2": {loc:[lat,lng]}...}, ...}
//	in this mode every record can have a free structure of attributes, only 'loc' is required
//TODO important optimization!!! always append data in this._recordsCache
//  now _recordsCache content is emptied and replaced with new data founded
//  always appending data on _recordsCache give the possibility of caching ajax, jsonp and layersearch!
//
//TODO here insert function that search inputText FIRST in _recordsCache keys and if not find results.. 
//  run one of callbacks search(sourceData,jsonpUrl or options.layer) and run this.showTooltip
//
//TODO change structure of _recordsCache
//	like this: _recordsCache = {"text-key1": {loc:[lat,lng], ..other attributes.. }, {"text-key2": {loc:[lat,lng]}...}, ...}
//	in this way every record can have a free structure of attributes, only 'loc' is required

L.Control.Search = L.Control.extend({
	includes: L.Mixin.Events,
	//
	//	Name					Data passed			   Description
	//
	//Managed Events:
	//	search:locationfound	{latlng, title, layer} fired after moved and show markerLocation
	//	search:expanded			{}					   fired after control was expanded
	//  search:collapsed		{}					   fired after control was collapsed
	//
	//Public methods:
	//  setLayer()				L.LayerGroup()         set layer search at runtime
	//  showAlert()             'Text message'         show alert message
	//  searchText()			'Text searched'        search text by external code
	//
	options: {
		url: '',						//url for search by ajax request, ex: "search.php?q={s}". Can be function that returns string for dynamic parameter setting
		layer: null,					//layer where search markers(is a L.LayerGroup)				
		sourceData: null,				//function that fill _recordsCache, passed searching text by first param and callback in second				
		//TODO implements uniq option 'sourceData' that recognizes source type: url,array,callback or layer				
		jsonpParam: null,				//jsonp param name for search by jsonp service, ex: "callback"
		propertyLoc: 'loc',				//field for remapping location, using array: ['latname','lonname'] for select double fields(ex. ['lat','lon'] ) support dotted format: 'prop.subprop.title'
		propertyName: 'title',			//property in marker.options(or feature.properties for vector layer) trough filter elements in layer,
		formatData: null,				//callback for reformat all data from source to indexed data object
		filterData: null,				//callback for filtering data from text searched, params: textSearch, allRecords
		moveToLocation: null,			//callback run on location found, params: latlng, title, map
		buildTip: null,					//function that return row tip html node(or html string), receive text tooltip in first param
		container: '',					//container id to insert Search Control		
		zoom: null,						//default zoom level for move to location
		minLength: 1,					//minimal text length for autocomplete
		initial: true,					//search elements only by initial text
		casesensitive: false,			//search elements in case sensitive text
		autoType: true,					//complete input with first suggested result and select this filled-in text.
		delayType: 400,					//delay while typing for show tooltip
		tooltipLimit: -1,				//limit max results to show in tooltip. -1 for no limit, 0 for no results
		tipAutoSubmit: true,			//auto map panTo when click on tooltip
		firstTipSubmit: false,			//auto select first result con enter click
		autoResize: true,				//autoresize on input change
		collapsed: true,				//collapse search control at startup
		autoCollapse: false,			//collapse search control after submit(on button or on tips if enabled tipAutoSubmit)
		autoCollapseTime: 1200,			//delay for autoclosing alert and collapse after blur
		textErr: 'Location not found',	//error message
		textCancel: 'Cancel',		    //title in cancel button		
		textPlaceholder: 'Search...',   //placeholder value			
		position: 'topleft',
		hideMarkerOnCollapse: false,    //remove circle and marker on search control collapsed		
		marker: {						//custom L.Marker or false for hide
			icon: false,				//custom L.Icon for maker location or false for hide
			animate: true,				//animate a circle over location found
			circle: {					//draw a circle in location found
				radius: 10,
				weight: 3,
				color: '#e03',
				stroke: true,
				fill: false
			}
		}
	},

	initialize: function(options) {
		L.Util.setOptions(this, options || {});
		this._inputMinSize = this.options.textPlaceholder ? this.options.textPlaceholder.length : 10;
		this._layer = this.options.layer || new L.LayerGroup();
		this._filterData = this.options.filterData || this._defaultFilterData;
		this._formatData = this.options.formatData || this._defaultFormatData;
		this._moveToLocation = this.options.moveToLocation || this._defaultMoveToLocation;
		this._autoTypeTmp = this.options.autoType;	//useful for disable autoType temporarily in delete/backspace keydown
		this._countertips = 0;		//number of tips items
		this._recordsCache = {};	//key,value table! that store locations! format: key,latlng
		this._curReq = null;
	},

	onAdd: function (map) {
		this._map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-search');
		this._input = this._createInput(this.options.textPlaceholder, 'search-input');
		this._tooltip = this._createTooltip('search-tooltip');
		this._cancel = this._createCancel(this.options.textCancel, 'search-cancel');
		this._button = this._createButton(this.options.textPlaceholder, 'search-button');
		this._alert = this._createAlert('search-alert');

		if(this.options.collapsed===false)
			this.expand(this.options.collapsed);

		if(this.options.marker) {
			
			if(this.options.marker instanceof L.Marker || this.options.marker instanceof L.CircleMarker)
				this._markerSearch = this.options.marker;

			else if(_isObject(this.options.marker))
				this._markerSearch = new L.Control.Search.Marker([0,0], this.options.marker);

			this._markerSearch._isMarkerSearch = true;
		}

		this.setLayer( this._layer );

		map.on({
			// 		'layeradd': this._onLayerAddRemove,
			// 		'layerremove': this._onLayerAddRemove
			'resize': this._handleAutoresize
			}, this);
		return this._container;
	},
	addTo: function (map) {

		if(this.options.container) {
			this._container = this.onAdd(map);
			this._wrapper = L.DomUtil.get(this.options.container);
			this._wrapper.style.position = 'relative';
			this._wrapper.appendChild(this._container);
		}
		else
			L.Control.prototype.addTo.call(this, map);

		return this;
	},

	onRemove: function(map) {
		this._recordsCache = {};
		// map.off({
		// 		'layeradd': this._onLayerAddRemove,
		// 		'layerremove': this._onLayerAddRemove
		// 	}, this);
	},

	// _onLayerAddRemove: function(e) {
	// 	//without this, run setLayer also for each Markers!! to optimize!
	// 	if(e.layer instanceof L.LayerGroup)
	// 		if( L.stamp(e.layer) != L.stamp(this._layer) )
	// 			this.setLayer(e.layer);
	// },

	setLayer: function(layer) {	//set search layer at runtime
		//this.options.layer = layer; //setting this, run only this._recordsFromLayer()
		this._layer = layer;
		this._layer.addTo(this._map);
		return this;
	},
	
	showAlert: function(text) {
		text = text || this.options.textErr;
		this._alert.style.display = 'block';
		this._alert.innerHTML = text;
		clearTimeout(this.timerAlert);
		var that = this;		
		this.timerAlert = setTimeout(function() {
			that.hideAlert();
		},this.options.autoCollapseTime);
		return this;
	},
	
	hideAlert: function() {
		this._alert.style.display = 'none';
		return this;
	},
		
	cancel: function() {
		this._input.value = '';
		this._handleKeypress({ keyCode: 8 });//simulate backspace keypress
		this._input.size = this._inputMinSize;
		this._input.focus();
		this._cancel.style.display = 'none';
		this._hideTooltip();
		return this;
	},
	
	expand: function(toggle) {
		toggle = typeof toggle === 'boolean' ? toggle : true;
		this._input.style.display = 'block';
		L.DomUtil.addClass(this._container, 'search-exp');
		if ( toggle !== false ) {
			this._input.focus();
			this._map.on('dragstart click', this.collapse, this);
		}
		this.fire('search:expanded');
		return this;	
	},

	collapse: function() {
		this._hideTooltip();
		this.cancel();
		this._alert.style.display = 'none';
		this._input.blur();
		if(this.options.collapsed)
		{
			this._input.style.display = 'none';
			this._cancel.style.display = 'none';			
			L.DomUtil.removeClass(this._container, 'search-exp');		
			if (this.options.hideMarkerOnCollapse) {
				this._map.removeLayer(this._markerSearch);
			}
			this._map.off('dragstart click', this.collapse, this);
		}
		this.fire('search:collapsed');
		return this;
	},
	
	collapseDelayed: function() {	//collapse after delay, used on_input blur
		if (!this.options.autoCollapse) return this;
		var that = this;
		clearTimeout(this.timerCollapse);
		this.timerCollapse = setTimeout(function() {
			that.collapse();
		}, this.options.autoCollapseTime);
		return this;		
	},

	collapseDelayedStop: function() {
		clearTimeout(this.timerCollapse);
		return this;		
	},

	////start DOM creations
	_createAlert: function(className) {
		var alert = L.DomUtil.create('div', className, this._container);
		alert.style.display = 'none';

		L.DomEvent
			.on(alert, 'click', L.DomEvent.stop, this)
			.on(alert, 'click', this.hideAlert, this);

		return alert;
	},

	_createInput: function (text, className) {
		var label = L.DomUtil.create('label', className, this._container);
		var input = L.DomUtil.create('input', className, this._container);
		input.type = 'text';
		input.size = this._inputMinSize;
		input.value = '';
		input.autocomplete = 'off';
		input.autocorrect = 'off';
		input.autocapitalize = 'off';
		input.placeholder = text;
		input.style.display = 'none';
		input.role = 'search';
		input.id = input.role + input.type + input.size;
		
		label.htmlFor = input.id;
		label.style.display = 'none';
		label.value = text;

		L.DomEvent
			.disableClickPropagation(input)
			.on(input, 'keydown', this._handleKeypress, this)
			.on(input, 'blur', this.collapseDelayed, this)
			.on(input, 'focus', this.collapseDelayedStop, this);
		
		return input;
	},

	_createCancel: function (title, className) {
		var cancel = L.DomUtil.create('a', className, this._container);
		cancel.href = '#';
		cancel.title = title;
		cancel.style.display = 'none';
		cancel.innerHTML = "<span>&otimes;</span>";//imageless(see css)

		L.DomEvent
			.on(cancel, 'click', L.DomEvent.stop, this)
			.on(cancel, 'click', this.cancel, this);

		return cancel;
	},
	
	_createButton: function (title, className) {
		var button = L.DomUtil.create('a', className, this._container);
		button.href = '#';
		button.title = title;

		L.DomEvent
			.on(button, 'click', L.DomEvent.stop, this)
			.on(button, 'click', this._handleSubmit, this)			
			.on(button, 'focus', this.collapseDelayedStop, this)
			.on(button, 'blur', this.collapseDelayed, this);

		return button;
	},

	_createTooltip: function(className) {
		var tool = L.DomUtil.create('ul', className, this._container);
		tool.style.display = 'none';

		var that = this;
		L.DomEvent
			.disableClickPropagation(tool)
			.on(tool, 'blur', this.collapseDelayed, this)
			.on(tool, 'mousewheel', function(e) {
				that.collapseDelayedStop();
				L.DomEvent.stopPropagation(e);//disable zoom map
			}, this)
			.on(tool, 'mouseover', function(e) {
				that.collapseDelayedStop();
			}, this);
		return tool;
	},

	_createTip: function(text, val) {//val is object in recordCache, usually is Latlng
		var tip;
		
		if(this.options.buildTip)
		{
			tip = this.options.buildTip.call(this, text, val); //custom tip node or html string
			if(typeof tip === 'string')
			{
				var tmpNode = L.DomUtil.create('div');
				tmpNode.innerHTML = tip;
				tip = tmpNode.firstChild;
			}
		}
		else
		{
			tip = L.DomUtil.create('li', '');
			tip.innerHTML = text;
		}
		
		L.DomUtil.addClass(tip, 'search-tip');
		tip._text = text; //value replaced in this._input and used by _autoType

		if(this.options.tipAutoSubmit)
			L.DomEvent
				.disableClickPropagation(tip)		
				.on(tip, 'click', L.DomEvent.stop, this)
				.on(tip, 'click', function(e) {
					this._input.value = text;
					this._handleAutoresize();
					this._input.focus();
					this._hideTooltip();	
					this._handleSubmit();
				}, this);

		return tip;
	},

	//////end DOM creations

	_getUrl: function(text) {
		return (typeof this.options.url === 'function') ? this.options.url(text) : this.options.url;
	},

	_defaultFilterData: function(text, records) {
	
		var I, icase, regSearch, frecords = {};

		text = text.replace(/[.*+?^${}()|[\]\\]/g, '');  //sanitize remove all special characters
		if(text==='')
			return [];

		I = this.options.initial ? '^' : '';  //search only initial text
		icase = !this.options.casesensitive ? 'i' : undefined;

		regSearch = new RegExp(I + text, icase);

		//TODO use .filter or .map
		for(var key in records) {
			if( regSearch.test(key) )
				frecords[key]= records[key];
		}
		
		return frecords;
	},

	showTooltip: function(records) {
		

		this._countertips = 0;
		this._tooltip.innerHTML = '';
		this._tooltip.currentSelection = -1;  //inizialized for _handleArrowSelect()

		if(this.options.tooltipLimit)
		{
			for(var key in records)//fill tooltip
			{
				if(this._countertips === this.options.tooltipLimit)
					break;
				
				this._countertips++;

				this._tooltip.appendChild( this._createTip(key, records[key]) );
			}
		}
		
		if(this._countertips > 0)
		{
			this._tooltip.style.display = 'block';
			
			if(this._autoTypeTmp)
				this._autoType();

			this._autoTypeTmp = this.options.autoType;//reset default value
		}
		else
			this._hideTooltip();

		this._tooltip.scrollTop = 0;

		return this._countertips;
	},

	_hideTooltip: function() {
		this._tooltip.style.display = 'none';
		this._tooltip.innerHTML = '';
		return 0;
	},

	_defaultFormatData: function(json) {	//default callback for format data to indexed data
		var propName = this.options.propertyName,
			propLoc = this.options.propertyLoc,
			i, jsonret = {};

		if( L.Util.isArray(propLoc) )
			for(i in json)
				jsonret[ _getPath(json[i],propName) ]= L.latLng( json[i][ propLoc[0] ], json[i][ propLoc[1] ] );
		else
			for(i in json)
				jsonret[ _getPath(json[i],propName) ]= L.latLng( _getPath(json[i],propLoc) );
		//TODO throw new Error("propertyName '"+propName+"' not found in JSON data");
		return jsonret;
	},

	_recordsFromJsonp: function(text, callAfter) {  //extract searched records from remote jsonp service
		L.Control.Search.callJsonp = callAfter;
		var script = L.DomUtil.create('script','leaflet-search-jsonp', document.getElementsByTagName('body')[0] ),			
			url = L.Util.template(this._getUrl(text)+'&'+this.options.jsonpParam+'=L.Control.Search.callJsonp', {s: text}); //parsing url
			//rnd = '&_='+Math.floor(Math.random()*10000);
			//TODO add rnd param or randomize callback name! in recordsFromJsonp
		script.type = 'text/javascript';
		script.src = url;
		return { abort: function() { script.parentNode.removeChild(script); } };
	},

	_recordsFromAjax: function(text, callAfter) {	//Ajax request
		if (window.XMLHttpRequest === undefined) {
			window.XMLHttpRequest = function() {
				try { return new ActiveXObject("Microsoft.XMLHTTP.6.0"); }
				catch  (e1) {
					try { return new ActiveXObject("Microsoft.XMLHTTP.3.0"); }
					catch (e2) { throw new Error("XMLHttpRequest is not supported"); }
				}
			};
		}
		var IE8or9 = ( L.Browser.ie && !window.atob && document.querySelector ),
			request = IE8or9 ? new XDomainRequest() : new XMLHttpRequest(),
			url = L.Util.template(this._getUrl(text), {s: text});

		//rnd = '&_='+Math.floor(Math.random()*10000);
		//TODO add rnd param or randomize callback name! in recordsFromAjax			
		
		request.open("GET", url);

		request.onload = function() {
			callAfter( JSON.parse(request.responseText) );
		};
		request.onreadystatechange = function() {
		    if(request.readyState === 4 && request.status === 200) {
		    	this.onload();
		    }
		};

		request.send();
		return request;   
	},
	
	_recordsFromLayer: function() {	//return table: key,value from layer
		var retRecords = {},
			propName = this.options.propertyName,
			loc;
		
		this._layer.eachLayer(function(layer) {

			if(layer.hasOwnProperty('_isMarkerSearch')) return;

			if(layer instanceof L.Marker || layer instanceof L.CircleMarker)
			{
				try {
					if(_getPath(layer.options,propName))
					{
						loc = layer.getLatLng();
						loc.layer = layer;
						retRecords[ _getPath(layer.options,propName) ] = loc;			
						
					}
					else if(_getPath(layer.feature.properties,propName)){
	
						loc = layer.getLatLng();
						loc.layer = layer;
						retRecords[ _getPath(layer.feature.properties,propName) ] = loc;
						
					}
					else
						throw new Error("propertyName '"+propName+"' not found in marker");
					
				}
				catch(err){
				}
			}
            else if(layer.hasOwnProperty('feature'))//GeoJSON
			{
				try {
					if(layer.feature.properties.hasOwnProperty(propName))
					{
						loc = layer.getBounds().getCenter();
						loc.layer = layer;			
						retRecords[ layer.feature.properties[propName] ] = loc;
					}
					else
						throw new Error("propertyName '"+propName+"' not found in feature");
				}
				catch(err){
				}
			}
			else if(layer instanceof L.LayerGroup)
            {
                //TODO: Optimize
                layer.eachLayer(function(m) {
                    loc = m.getLatLng();
                    loc.layer = m;
                    retRecords[ m.feature.properties[propName] ] = loc;
                });
            }
			
		},this);
		
		return retRecords;
	},

	_autoType: function() {
		
		//TODO implements autype without selection(useful for mobile device)
		
		var start = this._input.value.length,
			firstRecord = this._tooltip.firstChild ? this._tooltip.firstChild._text : '',
			end = firstRecord.length;

		if (firstRecord.indexOf(this._input.value) === 0) { // If prefix match
			this._input.value = firstRecord;
			this._handleAutoresize();

			if (this._input.createTextRange) {
				var selRange = this._input.createTextRange();
				selRange.collapse(true);
				selRange.moveStart('character', start);
				selRange.moveEnd('character', end);
				selRange.select();
			}
			else if(this._input.setSelectionRange) {
				this._input.setSelectionRange(start, end);
			}
			else if(this._input.selectionStart) {
				this._input.selectionStart = start;
				this._input.selectionEnd = end;
			}
		}
	},

	_hideAutoType: function() {	// deselect text:

		var sel;
		if ((sel = this._input.selection) && sel.empty) {
			sel.empty();
		}
		else if (this._input.createTextRange) {
			sel = this._input.createTextRange();
			sel.collapse(true);
			var end = this._input.value.length;
			sel.moveStart('character', end);
			sel.moveEnd('character', end);
			sel.select();
		}
		else {
			if (this._input.getSelection) {
				this._input.getSelection().removeAllRanges();
			}
			this._input.selectionStart = this._input.selectionEnd;
		}
	},
	
	_handleKeypress: function (e) {	//run _input keyup event

		switch(e.keyCode)
		{
			case 27://Esc
				this.collapse();
			break;
			case 13://Enter
				if(this._countertips == 1 || (this.options.firstTipSubmit && this._countertips > 0))
					this._handleArrowSelect(1);
				this._handleSubmit();	//do search
			break;
			case 38://Up
				this._handleArrowSelect(-1);
			break;
			case 40://Down
				this._handleArrowSelect(1);
			break;
			case  8://Backspace
			case 45://Insert
			case 46://Delete
				this._autoTypeTmp = false;//disable temporarily autoType
			break;
			case 37://Left
			case 39://Right
			case 16://Shift
			case 17://Ctrl
			case 35://End
			case 36://Home
			break;
			default://All keys

				if(this._input.value.length)
					this._cancel.style.display = 'block';
				else
					this._cancel.style.display = 'none';

				if(this._input.value.length >= this.options.minLength)
				{
					var that = this;

					clearTimeout(this.timerKeypress);	//cancel last search request while type in				
					this.timerKeypress = setTimeout(function() {	//delay before request, for limit jsonp/ajax request

						that._fillRecordsCache();
					
					}, this.options.delayType);
				}
				else
					this._hideTooltip();
		}

		this._handleAutoresize();
	},

	searchText: function(text) {
		var code = text.charCodeAt(text.length);

		this._input.value = text;

		this._input.style.display = 'block';
		L.DomUtil.addClass(this._container, 'search-exp');

		this._autoTypeTmp = false;

		this._handleKeypress({keyCode: code});
	},
	
	_fillRecordsCache: function() {

		var inputText = this._input.value,
			that = this, records;

		if(this._curReq && this._curReq.abort)
			this._curReq.abort();
		//abort previous requests

		L.DomUtil.addClass(this._container, 'search-load');	

		if(this.options.layer)
		{
			//TODO _recordsFromLayer must return array of objects, formatted from _formatData
			this._recordsCache = this._recordsFromLayer();
			
			records = this._filterData( this._input.value, this._recordsCache );

			this.showTooltip( records );

			L.DomUtil.removeClass(this._container, 'search-load');
		}
		else
		{
			if(this.options.sourceData)
				this._retrieveData = this.options.sourceData;

			else if(this.options.url)	//jsonp or ajax
				this._retrieveData = this.options.jsonpParam ? this._recordsFromJsonp : this._recordsFromAjax;

			this._curReq = this._retrieveData.call(this, inputText, function(data) {
				
				that._recordsCache = that._formatData(data);

				//TODO refact!
				if(that.options.sourceData)
					records = that._filterData( that._input.value, that._recordsCache );
				else
					records = that._recordsCache;

				that.showTooltip( records );
 
				L.DomUtil.removeClass(that._container, 'search-load');
			});
		}
	},
	
	_handleAutoresize: function() {	//autoresize this._input
	    //TODO refact _handleAutoresize now is not accurate
	    if (this._input.style.maxWidth != this._map._container.offsetWidth) //If maxWidth isn't the same as when first set, reset to current Map width
	        this._input.style.maxWidth = L.DomUtil.getStyle(this._map._container, 'width');

		if(this.options.autoResize && (this._container.offsetWidth + 45 < this._map._container.offsetWidth))
			this._input.size = this._input.value.length<this._inputMinSize ? this._inputMinSize : this._input.value.length;
	},

	_handleArrowSelect: function(velocity) {
	
		var searchTips = this._tooltip.hasChildNodes() ? this._tooltip.childNodes : [];
			
		for (i=0; i<searchTips.length; i++)
			L.DomUtil.removeClass(searchTips[i], 'search-tip-select');
		
		if ((velocity == 1 ) && (this._tooltip.currentSelection >= (searchTips.length - 1))) {// If at end of list.
			L.DomUtil.addClass(searchTips[this._tooltip.currentSelection], 'search-tip-select');
		}
		else if ((velocity == -1 ) && (this._tooltip.currentSelection <= 0)) { // Going back up to the search box.
			this._tooltip.currentSelection = -1;
		}
		else if (this._tooltip.style.display != 'none') {
			this._tooltip.currentSelection += velocity;
			
			L.DomUtil.addClass(searchTips[this._tooltip.currentSelection], 'search-tip-select');
			
			this._input.value = searchTips[this._tooltip.currentSelection]._text;

			// scroll:
			var tipOffsetTop = searchTips[this._tooltip.currentSelection].offsetTop;
			
			if (tipOffsetTop + searchTips[this._tooltip.currentSelection].clientHeight >= this._tooltip.scrollTop + this._tooltip.clientHeight) {
				this._tooltip.scrollTop = tipOffsetTop - this._tooltip.clientHeight + searchTips[this._tooltip.currentSelection].clientHeight;
			}
			else if (tipOffsetTop <= this._tooltip.scrollTop) {
				this._tooltip.scrollTop = tipOffsetTop;
			}
		}
	},

	_handleSubmit: function() {	//button and tooltip click and enter submit

		this._hideAutoType();
		
		this.hideAlert();
		this._hideTooltip();

		if(this._input.style.display == 'none')	//on first click show _input only
			this.expand();
		else
		{
			if(this._input.value === '')	//hide _input only
				this.collapse();
			else
			{
				var loc = this._getLocation(this._input.value);
				
				if(loc===false)
					this.showAlert();
				else
				{
					this.showLocation(loc, this._input.value);
					this.fire('search:locationfound', {
							latlng: loc,
							text: this._input.value,
							layer: loc.layer ? loc.layer : null
						});
				}
			}
		}
	},

	_getLocation: function(key) {	//extract latlng from _recordsCache

		if( this._recordsCache.hasOwnProperty(key) )
			return this._recordsCache[key];//then after use .loc attribute
		else
			return false;
	},

	_defaultMoveToLocation: function(latlng, title, map) {
		if(this.options.zoom)
 			this._map.setView(latlng, this.options.zoom);
 		else
			this._map.panTo(latlng);
	},

	showLocation: function(latlng, title) {	//set location on map from _recordsCache
		var self = this;

		self._map.once('moveend zoomend', function(e) {

			if(self._markerSearch) {
				self._markerSearch.addTo(self._map).setLatLng(latlng);
			}
			
		});

		self._moveToLocation(latlng, title, self._map);
		//FIXME autoCollapse option hide self._markerSearch before that visualized!!
		if(self.options.autoCollapse)
			self.collapse();

		return self;
	}
});

L.Control.Search.Marker = L.Marker.extend({

	includes: L.Mixin.Events,
	
	options: {
		icon: new L.Icon.Default(),
		animate: true,
		circle: {
			radius: 10,
			weight: 3,
			color: '#e03',
			stroke: true,
			fill: false
		}
	},
	
	initialize: function (latlng, options) {
		L.setOptions(this, options);

		if(options.icon === true)
			options.icon = new L.Icon.Default();

		L.Marker.prototype.initialize.call(this, latlng, options);
		
		if( _isObject(this.options.circle) )
			this._circleLoc = new L.CircleMarker(latlng, this.options.circle);
	},

	onAdd: function (map) {
		L.Marker.prototype.onAdd.call(this, map);
		if(this._circleLoc) {
			map.addLayer(this._circleLoc);
			if(this.options.animate)
				this.animate();
		}
	},

	onRemove: function (map) {
		L.Marker.prototype.onRemove.call(this, map);
		if(this._circleLoc)
			map.removeLayer(this._circleLoc);
	},
	
	setLatLng: function (latlng) {
		L.Marker.prototype.setLatLng.call(this, latlng);
		if(this._circleLoc)
			this._circleLoc.setLatLng(latlng);
		return this;
	},
	
	_initIcon: function () {
		if(this.options.icon)
			L.Marker.prototype._initIcon.call(this);
	},

	_removeIcon: function () {
		if(this.options.icon)
			L.Marker.prototype._removeIcon.call(this);
	},

	animate: function() {
	//TODO refact animate() more smooth! like this: http://goo.gl/DDlRs
		if(this._circleLoc)
		{
			var circle = this._circleLoc,
				tInt = 200,	//time interval
				ss = 5,	//frames
				mr = parseInt(circle._radius/ss),
				oldrad = this.options.circle.radius,
				newrad = circle._radius * 2,
				acc = 0;

			circle._timerAnimLoc = setInterval(function() {
				acc += 0.5;
				mr += acc;	//adding acceleration
				newrad -= mr;
				
				circle.setRadius(newrad);

				if(newrad<oldrad)
				{
					clearInterval(circle._timerAnimLoc);
					circle.setRadius(oldrad);//reset radius
					//if(typeof afterAnimCall == 'function')
						//afterAnimCall();
						//TODO use create event 'animateEnd' in L.Control.Search.Marker 
				}
			}, tInt);
		}
		
		return this;
	}
});

L.Map.addInitHook(function () {
    if (this.options.searchControl) {
        this.searchControl = L.control.search(this.options.searchControl);
        this.addControl(this.searchControl);
    }
});

L.control.search = function (options) {
    return new L.Control.Search(options);
};

return L.Control.Search;

});
});


var search = Object.freeze({
	default: leafletSearch_src,
	__moduleExports: leafletSearch_src
});

class SearchPlugin {
    constructor() {
        this.compName = SEARCH_PLUGIN_TAG;
    }
    getControl() {
        return this.control;
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        this.control = this.createPlugin(this.config.searchOptions);
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        Utils.doNothing(search);
        this.gisMap.addControl(this.control);
        this.fixCss();
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }
    createPlugin(options) {
        Utils.doNothing(options);
        const searchController = new L$1.Control.Search({
            url: options.queryServerUrl,
            jsonpParam: 'json_callback',
            propertyName: 'display_name',
            propertyLoc: ['lat', 'lon'],
            marker: new L$1.Marker([0, 0]),
            autoCollapse: true,
            autoType: false,
            minLength: 2
        });
        return searchController;
    }
    fixCss() {
        // Fix css, remove 2 props
        const searchElements = document.getElementsByClassName("search-button");
        if (searchElements.length) {
            const elem = searchElements[0];
            elem.classList.add('leaflet-bar');
        }
    }
    static get is() { return "search-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "control": { "state": true }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return "/* \n * Leaflet Control Search v2.7.2 - 2017-04-08 \n * \n * Copyright 2017 Stefano Cudini \n * stefano.cudini\@gmail.com \n * http://labs.easyblog.it/ \n * \n * Licensed under the MIT license. \n * \n * Demo: \n * http://labs.easyblog.it/maps/leaflet-search/ \n * \n * Source: \n * git\@github.com:stefanocudini/leaflet-search.git \n * \n */\n\n.leaflet-container .leaflet-control-search{position:relative;float:left;background:#fff;color:#1978cf;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;background-color:rgba(255,255,255,.8);z-index:1000;box-shadow:0 1px 7px rgba(0,0,0,.65);margin-left:10px;margin-top:10px}.leaflet-control-search.search-exp{box-shadow:0 1px 7px #999;background:#fff}.leaflet-control-search .search-input{display:block;float:left;background:#fff;border:1px solid #666;border-radius:2px;height:18px;padding:0 18px 0 2px;margin:3px 0 3px 3px}.leaflet-control-search.search-load .search-input{background:url(../images/loader.gif) no-repeat center right #fff}.leaflet-control-search.search-load .search-cancel{visibility:hidden}.leaflet-control-search .search-cancel{display:block;width:22px;height:18px;position:absolute;right:22px;margin:3px 0;background:url(../images/search-icon.png) no-repeat 0 -46px;text-decoration:none;filter:alpha(opacity=80);opacity:.8}.leaflet-control-search .search-cancel:hover{filter:alpha(opacity=100);opacity:1}.leaflet-control-search .search-cancel span{display:none;font-size:18px;line-height:20px;color:#ccc;font-weight:700}.leaflet-control-search .search-cancel:hover span{color:#aaa}.leaflet-control-search .search-button{display:block;float:left;width:26px;height:26px;background:url(../images/search-icon.png) no-repeat 2px 2px #fff;border-radius:4px}.leaflet-control-search .search-button:hover{background:url(../images/search-icon.png) no-repeat 2px -22px #fafafa}.leaflet-control-search .search-tooltip{position:absolute;top:100%;left:0;float:left;list-style:none;padding-left:0;min-width:120px;max-height:122px;box-shadow:1px 1px 6px rgba(0,0,0,.4);background-color:rgba(0,0,0,.25);z-index:1010;overflow-y:auto;overflow-x:hidden;cursor:pointer}.leaflet-control-search .search-tip{margin:2px;padding:2px 4px;display:block;color:#000;background:#eee;border-radius:.25em;text-decoration:none;white-space:nowrap;vertical-align:center}.leaflet-control-search .search-button:hover{background-color:#f4f4f4}.leaflet-control-search .search-tip-select,.leaflet-control-search .search-tip:hover{background-color:#fff}.leaflet-control-search .search-alert{cursor:pointer;clear:both;font-size:.75em;margin-bottom:5px;padding:0 .25em;color:#e00;font-weight:700;border-radius:.25em}\n\n.leaflet-control-search.leaflet-control.search-exp {\n  background: #fff;\n  box-shadow: 0 1px 7px #999; }\n  .leaflet-control-search.leaflet-control.search-exp .search-cancel:hover {\n    width: 17px;\n    height: 17px;\n    right: 33px;\n    top: 1px; }\n  .leaflet-control-search.leaflet-control.search-exp .search-cancel {\n    width: 17px;\n    height: 18px;\n    border: none;\n    right: 33px; }\n\n.leaflet-control-search.leaflet-control {\n  display: flex;\n  flex-direction: row-reverse;\n  box-shadow: none;\n  background: none; }\n  .leaflet-control-search.leaflet-control .search-button {\n    background-position: 4px 5px !important; }\n\n.leaflet-control-search.leaflet-control.search-exp .search-cancel {\n  right: 3px; }\n\n.search-button.leaflet-bar {\n  width: 30px;\n  height: 30px;\n  border: 2px solid rgba(0, 0, 0, 0.2);\n  background-clip: padding-box; }\n\n.leaflet-control-search .search-input {\n  min-width: 200px;\n  height: 33px;\n  margin: 0px;\n  border: none; }\n\n.leaflet-control-search .search-cancel {\n  top: 4px; }\n\n.leaflet-control-search.leaflet-control.search-exp .search-cancel:hover {\n  right: 3px;\n  top: 4px; }"; }
}

export { SearchPlugin };
