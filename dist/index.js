var GIFWORKER ="!function(){function t(e,i,r){function s(n,a){if(!i[n]){if(!e[n]){var h=\"function\"==typeof require&&require;if(!a&&h)return h(n,!0);if(o)return o(n,!0);var l=new Error(\"Cannot find module '\"+n+\"'\");throw l.code=\"MODULE_NOT_FOUND\",l}var u=i[n]={exports:{}};e[n][0].call(u.exports,function(t){return s(e[n][1][t]||t)},u,u.exports,t,e,i,r)}return i[n].exports}for(var o=\"function\"==typeof require&&require,n=0;n<r.length;n++)s(r[n]);return s}return t}()({1:[function(t,e,i){function r(){this.page=-1,this.pages=[],this.newPage()}function s(t,e){this.width=~~t,this.height=~~e,this.transparent=null,this.transIndex=0,this.repeat=-1,this.delay=0,this.image=null,this.pixels=null,this.indexedPixels=null,this.colorDepth=null,this.colorTab=null,this.neuQuant=null,this.usedEntry=new Array,this.palSize=7,this.dispose=-1,this.firstFrame=!0,this.sample=10,this.dither=!1,this.globalPalette=!1,this.out=new r}var o=t(\"./TypedNeuQuant.js\"),n=t(\"./LZWEncoder.js\");r.pageSize=4096,r.charMap={};for(var a=0;a<256;a++)r.charMap[a]=String.fromCharCode(a);r.prototype.newPage=function(){this.pages[++this.page]=new Uint8Array(r.pageSize),this.cursor=0},r.prototype.getData=function(){for(var t=\"\",e=0;e<this.pages.length;e++)for(var i=0;i<r.pageSize;i++)t+=r.charMap[this.pages[e][i]];return t},r.prototype.writeByte=function(t){this.cursor>=r.pageSize&&this.newPage(),this.pages[this.page][this.cursor++]=t},r.prototype.writeUTFBytes=function(t){for(var e=t.length,i=0;i<e;i++)this.writeByte(t.charCodeAt(i))},r.prototype.writeBytes=function(t,e,i){for(var r=i||t.length,s=e||0;s<r;s++)this.writeByte(t[s])},s.prototype.setDelay=function(t){this.delay=Math.round(t/10)},s.prototype.setFrameRate=function(t){this.delay=Math.round(100/t)},s.prototype.setDispose=function(t){t>=0&&(this.dispose=t)},s.prototype.setRepeat=function(t){this.repeat=t},s.prototype.setTransparent=function(t){this.transparent=t},s.prototype.addFrame=function(t){this.image=t,this.colorTab=this.globalPalette&&this.globalPalette.slice?this.globalPalette:null,this.getImagePixels(),this.analyzePixels(),!0===this.globalPalette&&(this.globalPalette=this.colorTab),this.firstFrame&&(this.writeLSD(),this.writePalette(),this.repeat>=0&&this.writeNetscapeExt()),this.writeGraphicCtrlExt(),this.writeImageDesc(),this.firstFrame||this.globalPalette||this.writePalette(),this.writePixels(),this.firstFrame=!1},s.prototype.finish=function(){this.out.writeByte(59)},s.prototype.setQuality=function(t){t<1&&(t=1),this.sample=t},s.prototype.setDither=function(t){!0===t&&(t=\"FloydSteinberg\"),this.dither=t},s.prototype.setGlobalPalette=function(t){this.globalPalette=t},s.prototype.getGlobalPalette=function(){return this.globalPalette&&this.globalPalette.slice&&this.globalPalette.slice(0)||this.globalPalette},s.prototype.writeHeader=function(){this.out.writeUTFBytes(\"GIF89a\")},s.prototype.analyzePixels=function(){if(!this.colorTab){var t,e,i,r,s={};for(i=0;i<this.pixels.length;i+=3)t=65536*this.pixels[i]+256*this.pixels[i+1]+this.pixels[i+2],s[t]=(s[t]||0)+1;if(e=Object.keys(s),e.length<256){for(this.colorTab=[],i=0;i<e.length;i++)r=+e[i],this.colorTab.push(parseInt(r/65536)),this.colorTab.push(parseInt(r%65536/256)),this.colorTab.push(r%256);for(i=e.length;i<256;i++)this.colorTab.push(255),this.colorTab.push(255),this.colorTab.push(255)}else this.neuQuant=new o(this.pixels,this.sample),this.neuQuant.buildColormap(),this.colorTab=this.neuQuant.getColormap()}this.dither?this.ditherPixels(this.dither.replace(\"-serpentine\",\"\"),null!==this.dither.match(/-serpentine/)):this.indexPixels(),this.pixels=null,this.colorDepth=8,this.palSize=7,null!==this.transparent&&(this.transIndex=this.findClosest(this.transparent,!0))},s.prototype.indexPixels=function(t){var e=this.pixels.length/3;this.indexedPixels=new Uint8Array(e);for(var i=0,r=0;r<e;r++){var s=this.findClosestRGB(255&this.pixels[i++],255&this.pixels[i++],255&this.pixels[i++]);this.usedEntry[s]=!0,this.indexedPixels[r]=s}},s.prototype.ditherPixels=function(t,e){var i={FalseFloydSteinberg:[[3/8,1,0],[3/8,0,1],[.25,1,1]],FloydSteinberg:[[7/16,1,0],[3/16,-1,1],[5/16,0,1],[1/16,1,1]],Stucki:[[8/42,1,0],[4/42,2,0],[2/42,-2,1],[4/42,-1,1],[8/42,0,1],[4/42,1,1],[2/42,2,1],[1/42,-2,2],[2/42,-1,2],[4/42,0,2],[2/42,1,2],[1/42,2,2]],Atkinson:[[1/8,1,0],[1/8,2,0],[1/8,-1,1],[1/8,0,1],[1/8,1,1],[1/8,0,2]]};if(!t||!i[t])throw\"Unknown dithering kernel: \"+t;var r=i[t],s=0,o=this.height,n=this.width,a=this.pixels,h=e?-1:1;this.indexedPixels=new Uint8Array(this.pixels.length/3);for(var l=0;l<o;l++){e&&(h*=-1);for(var u=1==h?0:n-1,p=1==h?n:0;u!==p;u+=h){s=l*n+u;var f=3*s,c=a[f],y=a[f+1],w=a[f+2];f=this.findClosestRGB(c,y,w),this.usedEntry[f]=!0,this.indexedPixels[s]=f,f*=3;for(var d=this.colorTab[f],g=this.colorTab[f+1],x=this.colorTab[f+2],b=c-d,v=y-g,P=w-x,m=1==h?0:r.length-1,B=1==h?r.length:0;m!==B;m+=h){var T=r[m][1],S=r[m][2];if(T+u>=0&&T+u<n&&S+l>=0&&S+l<o){var F=r[m][0];f=s+T+S*n,f*=3,a[f]=Math.max(0,Math.min(255,a[f]+b*F)),a[f+1]=Math.max(0,Math.min(255,a[f+1]+v*F)),a[f+2]=Math.max(0,Math.min(255,a[f+2]+P*F))}}}}},s.prototype.findClosest=function(t,e){return this.findClosestRGB((16711680&t)>>16,(65280&t)>>8,255&t,e)},s.prototype.findClosestRGB=function(t,e,i,r){if(null===this.colorTab)return-1;for(var s=0,o=16777216,n=this.colorTab.length,a=0,h=0;a<n;h++){var l=t-(255&this.colorTab[a++]),u=e-(255&this.colorTab[a++]),p=i-(255&this.colorTab[a++]),f=l*l+u*u+p*p;(!r||this.usedEntry[h])&&f<o&&(o=f,s=h)}return s},s.prototype.getImagePixels=function(){var t=this.width,e=this.height;this.pixels=new Uint8Array(t*e*3);for(var i=this.image,r=0,s=0,o=0;o<e;o++)for(var n=0;n<t;n++)this.pixels[s++]=i[r++],this.pixels[s++]=i[r++],this.pixels[s++]=i[r++],r++},s.prototype.writeGraphicCtrlExt=function(){this.out.writeByte(33),this.out.writeByte(249),this.out.writeByte(4);var t,e;null===this.transparent?(t=0,e=0):(t=1,e=2),this.dispose>=0&&(e=7&this.dispose),e<<=2,this.out.writeByte(0|e|t),this.writeShort(this.delay),this.out.writeByte(this.transIndex),this.out.writeByte(0)},s.prototype.writeImageDesc=function(){this.out.writeByte(44),this.writeShort(0),this.writeShort(0),this.writeShort(this.width),this.writeShort(this.height),this.firstFrame||this.globalPalette?this.out.writeByte(0):this.out.writeByte(128|this.palSize)},s.prototype.writeLSD=function(){this.writeShort(this.width),this.writeShort(this.height),this.out.writeByte(240|this.palSize),this.out.writeByte(0),this.out.writeByte(0)},s.prototype.writeNetscapeExt=function(){this.out.writeByte(33),this.out.writeByte(255),this.out.writeByte(11),this.out.writeUTFBytes(\"NETSCAPE2.0\"),this.out.writeByte(3),this.out.writeByte(1),this.writeShort(this.repeat),this.out.writeByte(0)},s.prototype.writePalette=function(){this.out.writeBytes(this.colorTab);for(var t=768-this.colorTab.length,e=0;e<t;e++)this.out.writeByte(0)},s.prototype.writeShort=function(t){this.out.writeByte(255&t),this.out.writeByte(t>>8&255)},s.prototype.writePixels=function(){new n(this.width,this.height,this.indexedPixels,this.colorDepth).encode(this.out)},s.prototype.stream=function(){return this.out},e.exports=s},{\"./LZWEncoder.js\":2,\"./TypedNeuQuant.js\":3}],2:[function(t,e,i){function r(t,e,i,r){function h(t,e){T[x++]=t,x>=254&&c(e)}function l(t){u(n),I=P+2,C=!0,d(P,t)}function u(t){for(var e=0;e<t;++e)S[e]=-1}function p(t,e){var i,r,a,h,p,f,c;for(v=t,C=!1,n_bits=v,b=y(n_bits),P=1<<t-1,m=P+1,I=P+2,x=0,h=w(),c=0,i=n;i<65536;i*=2)++c;c=8-c,f=n,u(f),d(P,e);t:for(;(r=w())!=s;)if(i=(r<<o)+h,a=r<<c^h,S[a]!==i){if(S[a]>=0){p=f-a,0===a&&(p=1);do{if((a-=p)<0&&(a+=f),S[a]===i){h=F[a];continue t}}while(S[a]>=0)}d(h,e),h=r,I<1<<o?(F[a]=I++,S[a]=i):l(e)}else h=F[a];d(h,e),d(m,e)}function f(i){i.writeByte(B),remaining=t*e,curPixel=0,p(B+1,i),i.writeByte(0)}function c(t){x>0&&(t.writeByte(x),t.writeBytes(T,0,x),x=0)}function y(t){return(1<<t)-1}function w(){return 0===remaining?s:(--remaining,255&i[curPixel++])}function d(t,e){for(g&=a[M],M>0?g|=t<<M:g=t,M+=n_bits;M>=8;)h(255&g,e),g>>=8,M-=8;if((I>b||C)&&(C?(b=y(n_bits=v),C=!1):(++n_bits,b=n_bits==o?1<<o:y(n_bits))),t==m){for(;M>0;)h(255&g,e),g>>=8,M-=8;c(e)}}var g,x,b,v,P,m,B=Math.max(2,r),T=new Uint8Array(256),S=new Int32Array(n),F=new Int32Array(n),M=0,I=0,C=!1;this.encode=f}var s=-1,o=12,n=5003,a=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];e.exports=r},{}],3:[function(t,e,i){function r(t,e){function i(){G=[],z=new Int32Array(256),U=new Int32Array(o),_=new Int32Array(o),Q=new Int32Array(o>>3);var t,e;for(t=0;t<o;t++)e=(t<<a+8)/o,G[t]=new Float64Array([e,e,e,0]),_[t]=l/o,U[t]=0}function r(){for(var t=0;t<o;t++)G[t][0]>>=a,G[t][1]>>=a,G[t][2]>>=a,G[t][3]=t}function y(t,e,i,r,s){G[e][0]-=t*(G[e][0]-i)/b,G[e][1]-=t*(G[e][1]-r)/b,G[e][2]-=t*(G[e][2]-s)/b}function d(t,e,i,r,s){for(var n,a,h=Math.abs(e-t),l=Math.min(e+t,o),u=e+1,p=e-1,f=1;u<l||p>h;)a=Q[f++],u<l&&(n=G[u++],n[0]-=a*(n[0]-i)/P,n[1]-=a*(n[1]-r)/P,n[2]-=a*(n[2]-s)/P),p>h&&(n=G[p--],n[0]-=a*(n[0]-i)/P,n[1]-=a*(n[1]-r)/P,n[2]-=a*(n[2]-s)/P)}function M(t,e,i){var r,s,n,l,y,w=~(1<<31),d=w,g=-1,x=g;for(r=0;r<o;r++)s=G[r],n=Math.abs(s[0]-t)+Math.abs(s[1]-e)+Math.abs(s[2]-i),n<w&&(w=n,g=r),l=n-(U[r]>>h-a),l<d&&(d=l,x=r),y=_[r]>>p,_[r]-=y,U[r]+=y<<u;return _[g]+=f,U[g]-=c,x}function I(){var t,e,i,r,s,a,h=0,l=0;for(t=0;t<o;t++){for(i=G[t],s=t,a=i[1],e=t+1;e<o;e++)r=G[e],r[1]<a&&(s=e,a=r[1]);if(r=G[s],t!=s&&(e=r[0],r[0]=i[0],i[0]=e,e=r[1],r[1]=i[1],i[1]=e,e=r[2],r[2]=i[2],i[2]=e,e=r[3],r[3]=i[3],i[3]=e),a!=h){for(z[h]=l+t>>1,e=h+1;e<a;e++)z[e]=t;h=a,l=t}}for(z[h]=l+n>>1,e=h+1;e<256;e++)z[e]=n}function C(t,e,i){for(var r,s,n,a=1e3,h=-1,l=z[e],u=l-1;l<o||u>=0;)l<o&&(s=G[l],n=s[1]-e,n>=a?l=o:(l++,n<0&&(n=-n),r=s[0]-t,r<0&&(r=-r),(n+=r)<a&&(r=s[2]-i,r<0&&(r=-r),(n+=r)<a&&(a=n,h=s[3])))),u>=0&&(s=G[u],n=e-s[1],n>=a?u=-1:(u--,n<0&&(n=-n),r=s[0]-t,r<0&&(r=-r),(n+=r)<a&&(r=s[2]-i,r<0&&(r=-r),(n+=r)<a&&(a=n,h=s[3]))));return h}function A(){var i,r=t.length,o=30+(e-1)/3,n=r/(3*e),h=~~(n/s),l=b,u=g,p=u>>w;for(p<=1&&(p=0),i=0;i<p;i++)Q[i]=l*((p*p-i*i)*v/(p*p));var f;r<F?(e=1,f=3):f=r%m!=0?3*m:r%B!=0?3*B:r%T!=0?3*T:3*S;var c,P,I,C,A=0;for(i=0;i<n;)if(c=(255&t[A])<<a,P=(255&t[A+1])<<a,I=(255&t[A+2])<<a,C=M(c,P,I),y(l,C,c,P,I),0!==p&&d(p,C,c,P,I),A+=f,A>=r&&(A-=r),i++,0===h&&(h=1),i%h==0)for(l-=l/o,u-=u/x,p=u>>w,p<=1&&(p=0),C=0;C<p;C++)Q[C]=l*((p*p-C*C)*v/(p*p))}function D(){i(),A(),r(),I()}function E(){for(var t=[],e=[],i=0;i<o;i++)e[G[i][3]]=i;for(var r=0,s=0;s<o;s++){var n=e[s];t[r++]=G[n][0],t[r++]=G[n][1],t[r++]=G[n][2]}return t}var G,z,U,_,Q;this.buildColormap=D,this.getColormap=E,this.lookupRGB=C}var s=100,o=256,n=o-1,a=4,h=16,l=1<<h,u=10,p=10,f=l>>p,c=l<<u-p,y=o>>3,w=6,d=1<<w,g=y*d,x=30,b=1024,v=256,P=1<<18,m=499,B=491,T=487,S=503,F=3*S;e.exports=r},{}],4:[function(t,e,i){var r,s;r=t(\"./GIFEncoder.js\"),s=function(t){var e,i,s,o;return e=new r(t.width,t.height),0===t.index?e.writeHeader():e.firstFrame=!1,e.setTransparent(t.transparent),e.setDispose(t.dispose),e.setRepeat(t.repeat),e.setDelay(t.delay),e.setQuality(t.quality),e.setDither(t.dither),e.setGlobalPalette(t.globalPalette),e.addFrame(t.data),t.last&&e.finish(),!0===t.globalPalette&&(t.globalPalette=e.getGlobalPalette()),s=e.stream(),t.data=s.pages,t.cursor=s.cursor,t.pageSize=s.constructor.pageSize,t.canTransfer?(o=function(){var e,r,s,o;for(s=t.data,o=[],e=0,r=s.length;e<r;e++)i=s[e],o.push(i.buffer);return o}(),self.postMessage(t,o)):self.postMessage(t)},self.onmessage=function(t){return s(t.data)}},{\"./GIFEncoder.js\":1}]},{},[4]); ";(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GIF = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){

/* CoffeeScript version of the browser detection from MooTools */
var UA, browser, mode, platform, ua;

ua = navigator.userAgent.toLowerCase();

platform = navigator.platform.toLowerCase();

UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0];

mode = UA[1] === 'ie' && document.documentMode;

browser = {
  name: UA[1] === 'version' ? UA[3] : UA[1],
  version: mode || parseFloat(UA[1] === 'opera' && UA[4] ? UA[4] : UA[2]),
  platform: {
    name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
  }
};

browser[browser.name] = true;

browser[browser.name + parseInt(browser.version, 10)] = true;

browser.platform[browser.platform.name] = true;

module.exports = browser;


},{}],3:[function(require,module,exports){
var EventEmitter, GIF, browser,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  slice = [].slice;

EventEmitter = require('events').EventEmitter;

browser = require('./browser.coffee');

GIF = (function(superClass) {
  var defaults, frameDefaults, url;

  extend(GIF, superClass);

  url = URL.createObjectURL(new Blob([GIFWORKER], {
    type: "application/javascript"
  }));

  console.log(url);

  defaults = {
    workerScript: url,
    workers: 2,
    repeat: 0,
    background: '#fff',
    quality: 10,
    width: null,
    height: null,
    transparent: null,
    debug: false,
    dither: false
  };

  frameDefaults = {
    delay: 500,
    copy: false,
    dispose: -1
  };

  function GIF(options) {
    var base, key, value;
    this.running = false;
    this.options = {};
    this.frames = [];
    this.freeWorkers = [];
    this.activeWorkers = [];
    this.setOptions(options);
    for (key in defaults) {
      value = defaults[key];
      if ((base = this.options)[key] == null) {
        base[key] = value;
      }
    }
  }

  GIF.prototype.setOption = function(key, value) {
    this.options[key] = value;
    if ((this._canvas != null) && (key === 'width' || key === 'height')) {
      return this._canvas[key] = value;
    }
  };

  GIF.prototype.setOptions = function(options) {
    var key, results, value;
    results = [];
    for (key in options) {
      if (!hasProp.call(options, key)) continue;
      value = options[key];
      results.push(this.setOption(key, value));
    }
    return results;
  };

  GIF.prototype.addFrame = function(image, options) {
    var frame, key;
    if (options == null) {
      options = {};
    }
    frame = {};
    frame.transparent = this.options.transparent;
    for (key in frameDefaults) {
      frame[key] = options[key] || frameDefaults[key];
    }
    if (this.options.width == null) {
      this.setOption('width', image.width);
    }
    if (this.options.height == null) {
      this.setOption('height', image.height);
    }
    if ((typeof ImageData !== "undefined" && ImageData !== null) && image instanceof ImageData) {
      frame.data = image.data;
    } else if (((typeof CanvasRenderingContext2D !== "undefined" && CanvasRenderingContext2D !== null) && image instanceof CanvasRenderingContext2D) || ((typeof WebGLRenderingContext !== "undefined" && WebGLRenderingContext !== null) && image instanceof WebGLRenderingContext)) {
      if (options.copy) {
        frame.data = this.getContextData(image);
      } else {
        frame.context = image;
      }
    } else if (image.childNodes != null) {
      if (options.copy) {
        frame.data = this.getImageData(image);
      } else {
        frame.image = image;
      }
    } else {
      throw new Error('Invalid image');
    }
    return this.frames.push(frame);
  };

  GIF.prototype.render = function() {
    var i, j, numWorkers, ref;
    if (this.running) {
      throw new Error('Already running');
    }
    if ((this.options.width == null) || (this.options.height == null)) {
      throw new Error('Width and height must be set prior to rendering');
    }
    this.running = true;
    this.nextFrame = 0;
    this.finishedFrames = 0;
    this.imageParts = (function() {
      var j, ref, results;
      results = [];
      for (i = j = 0, ref = this.frames.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        results.push(null);
      }
      return results;
    }).call(this);
    numWorkers = this.spawnWorkers();
    if (this.options.globalPalette === true) {
      this.renderNextFrame();
    } else {
      for (i = j = 0, ref = numWorkers; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        this.renderNextFrame();
      }
    }
    this.emit('start');
    return this.emit('progress', 0);
  };

  GIF.prototype.abort = function() {
    var worker;
    while (true) {
      worker = this.activeWorkers.shift();
      if (worker == null) {
        break;
      }
      this.log('killing active worker');
      worker.terminate();
    }
    this.running = false;
    return this.emit('abort');
  };

  GIF.prototype.spawnWorkers = function() {
    var j, numWorkers, ref, results;
    numWorkers = Math.min(this.options.workers, this.frames.length);
    (function() {
      results = [];
      for (var j = ref = this.freeWorkers.length; ref <= numWorkers ? j < numWorkers : j > numWorkers; ref <= numWorkers ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this).forEach((function(_this) {
      return function(i) {
        var worker;
        _this.log("spawning worker " + i);
        worker = new Worker(_this.options.workerScript);
        worker.onmessage = function(event) {
          _this.activeWorkers.splice(_this.activeWorkers.indexOf(worker), 1);
          _this.freeWorkers.push(worker);
          return _this.frameFinished(event.data);
        };
        return _this.freeWorkers.push(worker);
      };
    })(this));
    return numWorkers;
  };

  GIF.prototype.frameFinished = function(frame) {
    var i, j, ref;
    this.log("frame " + frame.index + " finished - " + this.activeWorkers.length + " active");
    this.finishedFrames++;
    this.emit('progress', this.finishedFrames / this.frames.length);
    this.imageParts[frame.index] = frame;
    if (this.options.globalPalette === true) {
      this.options.globalPalette = frame.globalPalette;
      this.log('global palette analyzed');
      if (this.frames.length > 2) {
        for (i = j = 1, ref = this.freeWorkers.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
          this.renderNextFrame();
        }
      }
    }
    if (indexOf.call(this.imageParts, null) >= 0) {
      return this.renderNextFrame();
    } else {
      return this.finishRendering();
    }
  };

  GIF.prototype.finishRendering = function() {
    var data, frame, i, image, j, k, l, len, len1, len2, len3, offset, page, ref, ref1, ref2;
    len = 0;
    ref = this.imageParts;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      frame = ref[j];
      len += (frame.data.length - 1) * frame.pageSize + frame.cursor;
    }
    len += frame.pageSize - frame.cursor;
    this.log("rendering finished - filesize " + (Math.round(len / 1000)) + "kb");
    data = new Uint8Array(len);
    offset = 0;
    ref1 = this.imageParts;
    for (k = 0, len2 = ref1.length; k < len2; k++) {
      frame = ref1[k];
      ref2 = frame.data;
      for (i = l = 0, len3 = ref2.length; l < len3; i = ++l) {
        page = ref2[i];
        data.set(page, offset);
        if (i === frame.data.length - 1) {
          offset += frame.cursor;
        } else {
          offset += frame.pageSize;
        }
      }
    }
    image = new Blob([data], {
      type: 'image/gif'
    });
    return this.emit('finished', image, data);
  };

  GIF.prototype.renderNextFrame = function() {
    var frame, task, worker;
    if (this.freeWorkers.length === 0) {
      throw new Error('No free workers');
    }
    if (this.nextFrame >= this.frames.length) {
      return;
    }
    frame = this.frames[this.nextFrame++];
    worker = this.freeWorkers.shift();
    task = this.getTask(frame);
    this.log("starting frame " + (task.index + 1) + " of " + this.frames.length);
    this.activeWorkers.push(worker);
    return worker.postMessage(task);
  };

  GIF.prototype.getContextData = function(ctx) {
    return ctx.getImageData(0, 0, this.options.width, this.options.height).data;
  };

  GIF.prototype.getImageData = function(image) {
    var ctx;
    if (this._canvas == null) {
      this._canvas = document.createElement('canvas');
      this._canvas.width = this.options.width;
      this._canvas.height = this.options.height;
    }
    ctx = this._canvas.getContext('2d');
    ctx.setFill = this.options.background;
    ctx.fillRect(0, 0, this.options.width, this.options.height);
    ctx.drawImage(image, 0, 0);
    return this.getContextData(ctx);
  };

  GIF.prototype.getTask = function(frame) {
    var index, task;
    index = this.frames.indexOf(frame);
    task = {
      index: index,
      last: index === (this.frames.length - 1),
      delay: frame.delay,
      dispose: frame.dispose,
      transparent: frame.transparent,
      width: this.options.width,
      height: this.options.height,
      quality: this.options.quality,
      dither: this.options.dither,
      globalPalette: this.options.globalPalette,
      repeat: this.options.repeat,
      canTransfer: browser.name === 'chrome'
    };
    if (frame.data != null) {
      task.data = frame.data;
    } else if (frame.context != null) {
      task.data = this.getContextData(frame.context);
    } else if (frame.image != null) {
      task.data = this.getImageData(frame.image);
    } else {
      throw new Error('Invalid frame');
    }
    return task;
  };

  GIF.prototype.log = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (!this.options.debug) {
      return;
    }
    return console.log.apply(console, args);
  };

  return GIF;

})(EventEmitter);

module.exports = GIF;


},{"./browser.coffee":2,"events":1}]},{},[3])(3)
});
