/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { MOUSE_COORDINATE_PLUGIN_TAG, default$1 as L$1 } from './chunk1.js';
import _ from './chunk2.js';

/*! leaflet.mousecoordinatesystems 2018-03-12 Copyright by   */

L.Control.mouseCoordinate=L.Control.extend({options:{gps:!0,gpsLong:!0,utm:!1,utmref:!1,position:"bottomright",_sm_a:6378137,_sm_b:6356752.314,_sm_EccSquared:.00669437999013,_UTMScaleFactor:.9996},onAdd:function(t){if(this._map=t, L.Browser.mobile||L.Browser.mobileWebkit||L.Browser.mobileWebkit3d||L.Browser.mobileOpera||L.Browser.mobileGecko)return L.DomUtil.create("div");var n="leaflet-control-mouseCoordinate"+((this.options.gps?" gps":"")+(this.options.gpsLong?" gpsLong":"")+(this.options.utm?" utm":"")+(this.options.utmref?" utmref":"")),r=this._container=L.DomUtil.create("div",n);return this._gpsPositionContainer=L.DomUtil.create("div","gpsPos",r), t.on("mousemove",this._update,this), r},_update:function(t){var n=(t.latlng.lat+90)%180,r=(t.latlng.lng+180)%360;n<0&&(n+=180), n-=90, r<0&&(r+=360);var a={lat:n,lng:r-=180},e="<table>";if(this.options.gps&&(e+="<tr class='gps-coordinates'><td>GPS</td><td>Lat(y): "+Math.round(1e5*n)/1e5+"</td><td>Lng(x): "+Math.round(1e5*r)/1e5+"</td></tr>", this.options.gpsLong)){var s=this._geo2geodeziminuten(a);e+="<tr class='gps-long-coordinates'><td></td><td class='coords'>"+s.NS+" "+s.latgrad+"&deg; "+s.latminuten+"</td><td class='coords'> "+s.WE+" "+s.lnggrad+"&deg; "+s.lngminuten+"</td></tr>";var o=this._geo2gradminutensekunden(a);e+="<tr class='gps-long-coordinates'><td></td><td>"+o.NS+" "+o.latgrad+"&deg; "+o.latminuten+"&prime; "+o.latsekunden+"&Prime;</td><td> "+o.WE+" "+o.lnggrad+"&deg; "+o.lngminuten+"&prime; "+o.lngsekunden+"&Prime;</td></tr>";}if(this.options.utm){var i=UTM.fromLatLng(a);void 0!==i&&(e+="<tr class='utm-coordinates'><td>UTM</td><td colspan='2'>"+i.zone+"&nbsp;x: "+i.x+"&nbsp;y: "+i.y+"</td></tr>");}if(this.options.utmref){var d=UTMREF.fromUTM(UTM.fromLatLng(a));void 0!==d&&(e+="<tr class='utmref-coordinates'><td>UTM REF</td><td colspan='2'>"+d.zone+"&nbsp;"+d.band+"&nbsp;x: "+d.x+"&nbsp;y: "+d.y+"</td></tr>");}if(this.options.qth&&(e+="<tr class='qth-coordinates'><td>QTH</td><td colspan='2'>"+QTH.fromLatLng(a)+"</td></tr>"), this.options.nac){var l=NAC.fromLatLng(a);e+="<tr class='nac-coordinates'><td>NAC</td><td colspan='2'>y: "+l.y+" x:"+l.x+"</td></tr>";}e+="</table>", this._gpsPositionContainer.innerHTML=e;},_geo2geodeziminuten:function(t){var n=parseInt(t.lat,10),r=Math.round(60*(t.lat-n)*1e4)/1e4,a=parseInt(t.lng,10),e=Math.round(60*(t.lng-a)*1e4)/1e4;return this._AddNSEW({latgrad:n,latminuten:r,lnggrad:a,lngminuten:e})},_geo2gradminutensekunden:function(t){var n=parseInt(t.lat,10),r=60*(t.lat-n),a=Math.round(60*(r-parseInt(r,10))*100)/100;r=parseInt(r,10);var e=parseInt(t.lng,10),s=60*(t.lng-e),o=Math.round(60*(s-parseInt(s,10))*100)/100;return s=parseInt(s,10), this._AddNSEW({latgrad:n,latminuten:r,latsekunden:a,lnggrad:e,lngminuten:s,lngsekunden:o})},_AddNSEW:function(t){return t.NS="N", t.WE="E", t.latgrad<0&&(t.latgrad=-1*t.latgrad, t.NS="S"), t.lnggrad<0&&(t.lnggrad=-1*t.lnggrad, t.WE="W"), t}}), L.control.mouseCoordinate=function(t){return new L.Control.mouseCoordinate(t)};var NAC={fromLatLng:function(t){var n=t.lat,r=t.lng,a=[],e=[],s=[];if(s.x="", s.y="", r>=-180&&r<=180){var o=(r+180)/360;a=this._calcValues(o);}else a[0]=0;if(n>=-90&&n<=90){var i=(n+90)/180;e=this._calcValues(i);}else e[0]=0;for(var d=0;d<a.length;d++)s.x+=this._nac2Letter(a[d]);for(d=0;d<e.length;d++)s.y+=this._nac2Letter(e[d]);return s},_calcValues:function(t){var n=[];return n[0]=parseInt(30*t,10), n[1]=parseInt(30*(30*t-n[0]),10), n[2]=parseInt(30*(30*(30*t-n[0])-n[1]),10), n[3]=parseInt(30*(30*(30*(30*t-n[0])-n[1])-n[2]),10), n[4]=parseInt(30*(30*(30*(30*(30*t-n[0])-n[1])-n[2])-n[3]),10), n[5]=parseInt(30*(30*(30*(30*(30*(30*t-n[0])-n[1])-n[2])-n[3])-n[4]),10), n},_nac2Letter:function(t){return!isNaN(t)&&t<30?"0123456789BCDFGHJKLMNPQRSTVWXZ".substr(t,1):0}},QTH={fromLatLng:function(t){var n,r,a,e,s,o,i="ABCDEFGHIJKLMNOPQRSTUVWXYZ",d=0,l=[0,0,0],u=[0,0,0,0,0,0,0];for(l[1]=t.lng+180, l[2]=t.lat+90, r=1;r<3;++r)for(a=1;a<4;++a)3!==a?(1===r&&(1===a&&(e=20), 2===a&&(e=2)), 2===r&&(1===a&&(e=10), 2===a&&(e=1)), s=l[r]/e, l[r]=s, o=l[r]>0?Math.floor(s):Math.ceil(s), l[r]=(l[r]-o)*e):(e=1===r?12:24, s=l[r]*e, l[r]=s, o=l[r]>0?Math.floor(s):Math.ceil(s)), u[++d]=o;return n=i.charAt(u[1])+i.charAt(u[4])+"0123456789".charAt(u[2]), n+="0123456789".charAt(u[5])+i.charAt(u[3])+i.charAt(u[6])}},UTM={fromLatLng:function(t){var n=t.lng,r=t.lat;if(-180===n&&(n+=1e-13), 180===n&&(n-=1e-13), -90===r&&(r+=1e-13), 90===r&&(r-=1e-13), !(n<=-180||n>=180||r<=-80||r>=84)){n=parseFloat(n), r=parseFloat(r);var a=.00335281068,e=Math.PI,s=6378137/(1-a),o=.006739496773090375,i=s*(e/180)*.9949771060629756,d=parseInt((n+180)/6,10)+1,l=d;d<10&&(l="0"+d), r>=56&&r<64&&n>=3&&n<12&&(l=32), r>=72&&r<84&&(n>=0&&n<9?l=31:n>=9&&n<21?l=33:n>=21&&n<33?l=35:n>=33&&n<42&&(l=37));var u,g=parseInt(1+(r+80)/8,10),c="CDEFGHJKLMNPQRSTUVWXX".substr(g-1,1),p=r*e/180,h=Math.tan(p),m=h*h,f=m*m,L=Math.cos(p),M=L*L,b=M*M,v=M*L,_=b*L,I=o*M,T=s/Math.sqrt(1+I),N=i*r+-16038.508686878376*Math.sin(2*p)+16.832627424514854*Math.sin(4*p)+-.02198090722059709*Math.sin(6*p),U=(n-(6*(d-30)-3))*e/180,A=U*U,x=A*A,C=.9996*(T*L*U+T*v*(1-m+I)*(A*U)/6+T*_*(5-18*m+f)*(x*U)/120)+5e5,E=l+c,S=(u=r<0?1e7+.9996*(N+T*M*h*A/2+T*b*h*(5-m+9*I)*x/24):.9996*(N+T*M*h*A/2+T*b*h*(5-m+9*I)*x/24))-parseInt(u,10);for(u=S<.5?""+parseInt(u,10):""+(parseInt(u,10)+1);u.length<7;)u="0"+u;return S=C-parseInt(C,10), C=S<.5?"0"+parseInt(C,10):"0"+parseInt(C+1,10), {zone:E,x:C,y:u}}console.error("Out of lw <= -180 || lw >= 180 || bw <= -80 || bw >= 84 bounds, which is kinda similar to UTM bounds, if you ignore the poles");},toLatLng:function(t){var n=t.zone,r=t.x,a=t.y;if(""===n||""===r||""===a)return n="", r="", void(a="");var e=n.substr(2,1);n=parseFloat(n), r=parseFloat(r), a=parseFloat(a);var s,o=.00335281068,i=Math.PI,d=6378137/(1-o),l=.006739496773090375,u=d*(i/180)*.9949771060629756,g=180/i*.0025188265953247774,c=180/i*37009497348592385e-22,p=180/i*7.447241158930448e-9,h=(s=e>="N"||""===e?a:a-1e7)/.9996/u,m=h*i/180,f=h+g*Math.sin(2*m)+c*Math.sin(4*m)+p*Math.sin(6*m),L=f*i/180,M=Math.tan(L),b=M*M,v=b*b,_=Math.cos(L),I=l*(_*_),T=d/Math.sqrt(1+I),N=T*T,U=N*N,A=(r-5e5)/.9996,x=A*A,C=x*A;return{lat:f+180/i*(-M*(1+I)/(2*N)*x+M*(5+3*b+6*I*(1-b))/(24*U)*(x*x)+-M*(61+90*b+45*v)/(720*(U*N))*(C*C)),lng:6*(n-30)-3+180/i*(1/(T*_)*A+-(1+2*b+I)/(6*(N*T)*_)*C+(5+28*b+24*v)/(120*(U*T)*_)*(C*x))}}},UTMREF={fromUTM:function(t){if(void 0!==t){var n,r=t.zone,a=t.x,e=t.y,s=r.substr(0,2),o=(r.substr(2,1), parseInt(a.substr(0,2),10)),i=parseInt(e.substr(0,2),10),d=a.substr(2,5),l=e.substr(2,5),u=s%3;1===u&&(n=o-1), 2===u&&(n=o+7), 0===u&&(n=o+15);var g;for(g=1===(u=s%2)?0:5, u=i;u-20>=0;)u-=20;return(g+=u)>19&&(g-=20), {zone:r,band:"ABCDEFGHJKLMNPQRSTUVWXYZ".charAt(n)+"ABCDEFGHJKLMNPQRSTUV".charAt(g),x:d,y:l}}},toUTM:function(t){var n,r=t.zone,a=t.band.substr(0,1),e=(t.band.substr(1,1), parseInt(r.substr(0,2),10)%3);0===e&&(n="STUVWXYZ".indexOf(a)+1), 1===e&&(n="ABCDEFGH".indexOf(a)+1), 2===e&&(n="JKLMNPQR".indexOf(a)+1);var s,o="0"+n,i=this._mgr2utm_find_m_cn(r);return s=1===i.length?"0"+i:""+i, {zone:r,x:o,y:s}}};

var mousecoordinatesystems = Object.freeze({

});

class MouseCoordinagePlugin {
    constructor() {
        this.compName = MOUSE_COORDINATE_PLUGIN_TAG;
    }
    watchHandler(newValue, oldValue) {
        console.log('The new value of activated is: ', newValue, oldValue);
        this.changeCoordinateSystemHandler(newValue);
    }
    // componentWillLoad() {
    //     Utils.log_componentWillLoad(this.compName);
    // }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        const mouseCoordinateGps = {
            gpsLong: false,
        };
        const mouseCoordinateUtm = {
            utm: true,
            gps: false,
        };
        const mouseCoordinateUtmref = {
            utmref: true,
            gpsLong: false,
            gps: false,
        };
        this.controlGps = this.createPlugin(mouseCoordinateGps);
        this.controlUtm = this.createPlugin(mouseCoordinateUtm);
        this.controlUtmref = this.createPlugin(mouseCoordinateUtmref);
        this.gisMap.addControl(this.controlGps);
        this.gisMap.addControl(this.controlUtm);
        this.gisMap.addControl(this.controlUtmref);
        this.initMouseCoordinates(this.coordinateSystem);
        console.log(mousecoordinatesystems);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.controlGps);
        this.gisMap.removeControl(this.controlUtm);
        this.gisMap.removeControl(this.controlUtmref);
    }
    createPlugin(options) {
        // let options = this.config.mouseCoordinateOptions;
        options.position = 'bottomleft';
        let control = new L$1.Control.mouseCoordinate(options);
        return control;
    }
    initMouseCoordinates(mousecoordinatesystems) {
        debugger;
        const gpsElement = document.querySelector('.gps');
        const utmElement = document.querySelector('.utm');
        const utmrefElement = document.querySelector('.utmref');
        if (mousecoordinatesystems === 'utm') {
            gpsElement.style.display = 'none';
            utmrefElement.style.display = 'none';
        }
        if (mousecoordinatesystems === 'utmref') {
            gpsElement.style.display = 'none';
            utmElement.style.display = 'none';
        }
        if (mousecoordinatesystems === 'gps') {
            utmElement.style.display = 'none';
            utmrefElement.style.display = 'none';
        }
    }
    changeCoordinateSystemHandler(value) {
        // debugger
        const gpsElement = document.querySelector('.gps');
        const utmElement = document.querySelector('.utm');
        const utmrefElement = document.querySelector('.utmref');
        const mouseCoordinateTypesElementCollection = [gpsElement, utmElement, utmrefElement];
        _.forEach(mouseCoordinateTypesElementCollection, (elm) => {
            elm.style.display = elm.classList.contains(value) ? 'flex' : 'none';
        });
    }
    static get is() { return "mouse-coordinate-plugin"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "controlGps": { "state": true }, "controlUtm": { "state": true }, "controlUtmref": { "state": true }, "coordinateSystem": { "type": "Any", "attr": "coordinate-system", "watchCallbacks": ["watchHandler"] }, "gisMap": { "type": "Any", "attr": "gis-map" }, "mouseCoordinateEl": { "elementRef": true } }; }
    static get style() { return ".leaflet-control-mouseCoordinate{width:256px;box-shadow:4px 4px 4px 0 rgba(0,0,0,.36);background:none repeat scroll 0 0 #fff;color:#333;padding:6px 10px 6px 6px}.leaflet-control-mouseCoordinate table{width:100%}"; }
}

export { MouseCoordinagePlugin as MouseCoordinatePlugin };