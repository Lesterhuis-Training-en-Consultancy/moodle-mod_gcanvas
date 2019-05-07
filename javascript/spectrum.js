!function(t){"use strict";!function(Dt,It){var qt={beforeShow:t,move:t,change:t,show:t,hide:t,color:!1,flat:!1,showInput:!1,allowEmpty:!1,showButtons:!0,clickoutFiresChange:!0,showInitial:!1,showPalette:!1,showPaletteOnly:!1,hideAfterPaletteSelect:!1,togglePaletteOnly:!1,showSelectionPalette:!0,localStorageKey:!1,appendTo:"body",maxSelectionSize:7,cancelText:"cancel",chooseText:"choose",togglePaletteMoreText:"more",togglePaletteLessText:"less",clearText:"Clear Color Selection",noColorSelectedText:"No Color Selected",preferredFormat:!1,className:"",containerClassName:"",replacerClassName:"",showAlpha:!1,theme:"sp-light",palette:[["#ffffff","#000000","#ff0000","#ff8000","#ffff00","#008000","#0000ff","#4b0082","#9400d3"]],selectionPalette:[],disabled:!1,offset:null},jt=[],zt=!!/msie/i.exec(window.navigator.userAgent),Bt=function(){function t(t,e){return!!~(""+t).indexOf(e)}var e=document.createElement("div"),r=e.style;return r.cssText="background-color:rgba(0,0,0,.5)",t(r.backgroundColor,"rgba")||t(r.backgroundColor,"hsla")}(),Lt=["<div class='sp-replacer'>","<div class='sp-preview'><div class='sp-preview-inner'></div></div>","<div class='sp-dd'>&#9660;</div>","</div>"].join(""),Kt=function(){var t="";if(zt)for(var e=1;e<=6;e++)t+="<div class='sp-"+e+"'></div>";return["<div class='sp-container sp-hidden'>","<div class='sp-palette-container'>","<div class='sp-palette sp-thumb sp-cf'></div>","<div class='sp-palette-button-container sp-cf'>","<button type='button' class='sp-palette-toggle'></button>","</div>","</div>","<div class='sp-picker-container'>","<div class='sp-top sp-cf'>","<div class='sp-fill'></div>","<div class='sp-top-inner'>","<div class='sp-color'>","<div class='sp-sat'>","<div class='sp-val'>","<div class='sp-dragger'></div>","</div>","</div>","</div>","<div class='sp-clear sp-clear-display'>","</div>","<div class='sp-hue'>","<div class='sp-slider'></div>",t,"</div>","</div>","<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>","</div>","<div class='sp-input-container sp-cf'>","<input class='sp-input' type='text' spellcheck='false'  />","</div>","<div class='sp-initial sp-thumb sp-cf'></div>","<div class='sp-button-container sp-cf'>","<a class='sp-cancel' href='#'></a>","<button type='button' class='sp-choose'></button>","</div>","</div>","</div>"].join("")}();function Vt(t,e,r,a){for(var n=[],i=0;i<t.length;i++){var s=t[i];if(s){var o=tinycolor(s),l=o.toHsl().l<.5?"sp-thumb-el sp-thumb-dark":"sp-thumb-el sp-thumb-light";l+=tinycolor.equals(e,s)?" sp-thumb-active":"";var c=o.toString(a.preferredFormat||"rgb"),f=Bt?"background-color:"+o.toRgbString():"filter:"+o.toFilter();n.push('<span title="'+c+'" data-color="'+o.toRgbString()+'" class="'+l+'"><span class="sp-thumb-inner" style="'+f+';" /></span>')}else{n.push(Dt("<div />").append(Dt('<span data-color="" style="background-color:transparent;" class="sp-clear-display"></span>').attr("title",a.noColorSelectedText)).html())}}return"<div class='sp-cf "+r+"'>"+n.join("")+"</div>"}function i(t,e){var r,a,n,i,s,o,l,f=(s=e,o=t,(l=Dt.extend({},qt,s)).callbacks={move:Wt(l.move,o),change:Wt(l.change,o),show:Wt(l.show,o),hide:Wt(l.hide,o),beforeShow:Wt(l.beforeShow,o)},l),h=f.flat,c=f.showSelectionPalette,u=f.localStorageKey,d=f.theme,p=f.callbacks,g=(r=Ot,a=10,function(){var t=this,e=arguments;n&&clearTimeout(i),!n&&i||(i=setTimeout(function(){i=null,r.apply(t,e)},a))}),b=!1,v=!1,m=0,y=0,w=0,_=0,x=0,k=0,S=0,C=0,P=0,A=0,M=1,R=[],H=[],F={},T=f.selectionPalette.slice(0),O=f.maxSelectionSize,N="sp-dragging",E=null,D=t.ownerDocument,I=(D.body,Dt(t)),q=!1,j=Dt(Kt,D).addClass(d),z=j.find(".sp-picker-container"),B=j.find(".sp-color"),L=j.find(".sp-dragger"),K=j.find(".sp-hue"),V=j.find(".sp-slider"),$=j.find(".sp-alpha-inner"),W=j.find(".sp-alpha"),X=j.find(".sp-alpha-handle"),Y=j.find(".sp-input"),G=j.find(".sp-palette"),Q=j.find(".sp-initial"),J=j.find(".sp-cancel"),U=j.find(".sp-clear"),Z=j.find(".sp-choose"),tt=j.find(".sp-palette-toggle"),et=I.is("input"),rt=et&&"color"===I.attr("type")&&Yt(),at=et&&!h,nt=at?Dt(Lt).addClass(d).addClass(f.className).addClass(f.replacerClassName):Dt([]),it=at?nt:I,st=nt.find(".sp-preview-inner"),ot=f.color||et&&I.val(),lt=!1,ct=f.preferredFormat,ft=!f.showButtons||f.clickoutFiresChange,ht=!ot,ut=f.allowEmpty&&!rt;function dt(){if(f.showPaletteOnly&&(f.showPalette=!0),tt.text(f.showPaletteOnly?f.togglePaletteMoreText:f.togglePaletteLessText),f.palette){R=f.palette.slice(0),H=Dt.isArray(R[0])?R:[R],F={};for(var t=0;t<H.length;t++)for(var e=0;e<H[t].length;e++){var r=tinycolor(H[t][e]).toRgbString();F[r]=!0}}j.toggleClass("sp-flat",h),j.toggleClass("sp-input-disabled",!f.showInput),j.toggleClass("sp-alpha-enabled",f.showAlpha),j.toggleClass("sp-clear-enabled",ut),j.toggleClass("sp-buttons-disabled",!f.showButtons),j.toggleClass("sp-palette-buttons-disabled",!f.togglePaletteOnly),j.toggleClass("sp-palette-disabled",!f.showPalette),j.toggleClass("sp-palette-only",f.showPaletteOnly),j.toggleClass("sp-initial-disabled",!f.showInitial),j.addClass(f.className).addClass(f.containerClassName),Ot()}function pt(){if(u&&window.localStorage){try{var t=window.localStorage[u].split(",#");1<t.length&&(delete window.localStorage[u],Dt.each(t,function(t,e){gt(e)}))}catch(t){}try{T=window.localStorage[u].split(";")}catch(t){}}}function gt(t){if(c){var e=tinycolor(t).toRgbString();if(!F[e]&&-1===Dt.inArray(e,T))for(T.push(e);T.length>O;)T.shift();if(u&&window.localStorage)try{window.localStorage[u]=T.join(";")}catch(t){}}}function bt(){var r=Mt(),t=Dt.map(H,function(t,e){return Vt(t,r,"sp-palette-row sp-palette-row-"+e,f)});pt(),T&&t.push(Vt(function(){var t=[];if(f.showPalette)for(var e=0;e<T.length;e++){var r=tinycolor(T[e]).toRgbString();F[r]||t.push(T[e])}return t.reverse().slice(0,f.maxSelectionSize)}(),r,"sp-palette-row sp-palette-row-selection",f)),G.html(t.join(""))}function vt(){if(f.showInitial){var t=lt,e=Mt();Q.html(Vt([t,e],e,"sp-palette-row-initial",f))}}function mt(){(y<=0||m<=0||_<=0)&&Ot(),v=!0,j.addClass(N),E=null,I.trigger("dragstart.spectrum",[Mt()])}function yt(){v=!1,j.removeClass(N),I.trigger("dragstop.spectrum",[Mt()])}function wt(){var t=Y.val();if(null!==t&&""!==t||!ut){var e=tinycolor(t);e.isValid()?(At(e),Tt(!0)):Y.addClass("sp-validation-error")}else At(null),Tt(!0)}function _t(){b?Ct():xt()}function xt(){var t=Dt.Event("beforeShow.spectrum");b?Ot():(I.trigger(t,[Mt()]),!1===p.beforeShow(Mt())||t.isDefaultPrevented()||(!function(){for(var t=0;t<jt.length;t++)jt[t]&&jt[t].hide()}(),b=!0,Dt(D).bind("keydown.spectrum",kt),Dt(D).bind("click.spectrum",St),Dt(window).bind("resize.spectrum",g),nt.addClass("sp-active"),j.removeClass("sp-hidden"),Ot(),Ht(),lt=Mt(),vt(),p.show(lt),I.trigger("show.spectrum",[lt])))}function kt(t){27===t.keyCode&&Ct()}function St(t){2!=t.button&&(v||(ft?Tt(!0):Pt(),Ct()))}function Ct(){b&&!h&&(b=!1,Dt(D).unbind("keydown.spectrum",kt),Dt(D).unbind("click.spectrum",St),Dt(window).unbind("resize.spectrum",g),nt.removeClass("sp-active"),j.addClass("sp-hidden"),p.hide(Mt()),I.trigger("hide.spectrum",[Mt()]))}function Pt(){At(lt,!0)}function At(t,e){var r,a;tinycolor.equals(t,Mt())?Ht():(!t&&ut?ht=!0:(ht=!1,r=tinycolor(t),a=r.toHsv(),C=a.h%360/360,P=a.s,A=a.v,M=a.a),Ht(),r&&r.isValid()&&!e&&(ct=f.preferredFormat||r.getFormat()))}function Mt(t){return t=t||{},ut&&ht?null:tinycolor.fromRatio({h:C,s:P,v:A,a:Math.round(100*M)/100},{format:t.format||ct})}function Rt(){Ht(),p.move(Mt()),I.trigger("move.spectrum",[Mt()])}function Ht(){Y.removeClass("sp-validation-error"),Ft();var t=tinycolor.fromRatio({h:C,s:1,v:1});B.css("background-color",t.toHexString());var e=ct;M<1&&(0!==M||"name"!==e)&&("hex"!==e&&"hex3"!==e&&"hex6"!==e&&"name"!==e||(e="rgb"));var r=Mt({format:e}),a="";if(st.removeClass("sp-clear-display"),st.css("background-color","transparent"),!r&&ut)st.addClass("sp-clear-display");else{var n=r.toHexString(),i=r.toRgbString();if(Bt||1===r.alpha?st.css("background-color",i):(st.css("background-color","transparent"),st.css("filter",r.toFilter())),f.showAlpha){var s=r.toRgb();s.a=0;var o=tinycolor(s).toRgbString(),l="linear-gradient(left, "+o+", "+n+")";zt?$.css("filter",tinycolor(o).toFilter({gradientType:1},n)):($.css("background","-webkit-"+l),$.css("background","-moz-"+l),$.css("background","-ms-"+l),$.css("background","linear-gradient(to right, "+o+", "+n+")"))}a=r.toString(e)}f.showInput&&Y.val(a),f.showPalette&&bt(),vt()}function Ft(){var t=P,e=A;if(ut&&ht)X.hide(),V.hide(),L.hide();else{X.show(),V.show(),L.show();var r=t*m,a=y-e*y;r=Math.max(-w,Math.min(m-w,r-w)),a=Math.max(-w,Math.min(y-w,a-w)),L.css({top:a+"px",left:r+"px"});var n=M*x;X.css({left:n-k/2+"px"});var i=C*_;V.css({top:i-S+"px"})}}function Tt(t){var e=Mt(),r="",a=!tinycolor.equals(e,lt);e&&(r=e.toString(ct),gt(e)),et&&I.val(r),t&&a&&(p.change(e),I.trigger("change",[e]))}function Ot(){var t,e,r,a,n,i,s,o,l,c;b&&(m=B.width(),y=B.height(),w=L.height(),K.width(),_=K.height(),S=V.height(),x=W.width(),k=X.width(),h||(j.css("position","absolute"),f.offset?j.offset(f.offset):j.offset((e=it,r=(t=j).outerWidth(),a=t.outerHeight(),n=e.outerHeight(),i=t[0].ownerDocument,s=i.documentElement,o=s.clientWidth+Dt(i).scrollLeft(),l=s.clientHeight+Dt(i).scrollTop(),(c=e.offset()).top+=n,c.left-=Math.min(c.left,c.left+r>o&&r<o?Math.abs(c.left+r-o):0),c.top-=Math.min(c.top,c.top+a>l&&a<l?Math.abs(a+n-0):0),c))),Ft(),f.showPalette&&bt(),I.trigger("reflow.spectrum"))}function Nt(){Ct(),q=!0,I.attr("disabled",!0),it.addClass("sp-disabled")}!function(){zt&&j.find("*:not(input)").attr("unselectable","on");dt(),at&&I.after(nt).hide();ut||U.hide();if(h)I.after(j).hide();else{var t="parent"===f.appendTo?I.parent():Dt(f.appendTo);1!==t.length&&(t=Dt("body")),t.append(j)}pt(),it.bind("click.spectrum touchstart.spectrum",function(t){q||_t(),t.stopPropagation(),Dt(t.target).is("input")||t.preventDefault()}),(I.is(":disabled")||!0===f.disabled)&&Nt();j.click($t),Y.change(wt),Y.bind("paste",function(){setTimeout(wt,1)}),Y.keydown(function(t){13==t.keyCode&&wt()}),J.text(f.cancelText),J.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),Pt(),Ct()}),U.attr("title",f.clearText),U.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),ht=!0,Rt(),h&&Tt(!0)}),Z.text(f.chooseText),Z.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),zt&&Y.is(":focus")&&Y.trigger("change"),Y.hasClass("sp-validation-error")||(Tt(!0),Ct())}),tt.text(f.showPaletteOnly?f.togglePaletteMoreText:f.togglePaletteLessText),tt.bind("click.spectrum",function(t){t.stopPropagation(),t.preventDefault(),f.showPaletteOnly=!f.showPaletteOnly,f.showPaletteOnly||h||j.css("left","-="+(z.outerWidth(!0)+5)),dt()}),Xt(W,function(t,e,r){M=t/x,ht=!1,r.shiftKey&&(M=Math.round(10*M)/10),Rt()},mt,yt),Xt(K,function(t,e){C=parseFloat(e/_),ht=!1,f.showAlpha||(M=1),Rt()},mt,yt),Xt(B,function(t,e,r){if(r.shiftKey){if(!E){var a=P*m,n=y-A*y,i=Math.abs(t-a)>Math.abs(e-n);E=i?"x":"y"}}else E=null;var s=!E||"y"===E;(!E||"x"===E)&&(P=parseFloat(t/m)),s&&(A=parseFloat((y-e)/y)),ht=!1,f.showAlpha||(M=1),Rt()},mt,yt),ot?(At(ot),Ht(),ct=f.preferredFormat||tinycolor(ot).format,gt(ot)):Ht();h&&xt();function e(t){return t.data&&t.data.ignore?(At(Dt(t.target).closest(".sp-thumb-el").data("color")),Rt()):(At(Dt(t.target).closest(".sp-thumb-el").data("color")),Rt(),Tt(!0),f.hideAfterPaletteSelect&&Ct()),!1}var r=zt?"mousedown.spectrum":"click.spectrum touchstart.spectrum";G.delegate(".sp-thumb-el",r,e),Q.delegate(".sp-thumb-el:nth-child(1)",r,{ignore:!0},e)}();var Et={show:xt,hide:Ct,toggle:_t,reflow:Ot,option:function(t,e){if(t===It)return Dt.extend({},f);if(e===It)return f[t];f[t]=e,"preferredFormat"===t&&(ct=f.preferredFormat);dt()},enable:function(){q=!1,I.attr("disabled",!1),it.removeClass("sp-disabled")},disable:Nt,offset:function(t){f.offset=t,Ot()},set:function(t){At(t),Tt()},get:Mt,destroy:function(){I.show(),it.unbind("click.spectrum touchstart.spectrum"),j.remove(),nt.remove(),jt[Et.id]=null},container:j};return Et.id=jt.push(Et)-1,Et}function t(){}function $t(t){t.stopPropagation()}function Wt(t,e){var r=Array.prototype.slice,a=r.call(arguments,2);return function(){return t.apply(e,a.concat(r.call(arguments)))}}function Xt(s,o,e,t){o=o||function(){},e=e||function(){},t=t||function(){};var l=document,c=!1,f={},h=0,u=0,d="ontouchstart"in window,r={};function p(t){t.stopPropagation&&t.stopPropagation(),t.preventDefault&&t.preventDefault(),t.returnValue=!1}function a(t){if(c){if(zt&&l.documentMode<9&&!t.button)return g();var e=t.originalEvent&&t.originalEvent.touches&&t.originalEvent.touches[0],r=e&&e.pageX||t.pageX,a=e&&e.pageY||t.pageY,n=Math.max(0,Math.min(r-f.left,u)),i=Math.max(0,Math.min(a-f.top,h));d&&p(t),o.apply(s,[n,i,t])}}function g(){c&&(Dt(l).unbind(r),Dt(l.body).removeClass("sp-dragging"),setTimeout(function(){t.apply(s,arguments)},0)),c=!1}r.selectstart=p,r.dragstart=p,r["touchmove mousemove"]=a,r["touchend mouseup"]=g,Dt(s).bind("touchstart mousedown",function(t){(t.which?3==t.which:2==t.button)||c||!1!==e.apply(s,arguments)&&(c=!0,h=Dt(s).height(),u=Dt(s).width(),f=Dt(s).offset(),Dt(l).bind(r),Dt(l.body).addClass("sp-dragging"),a(t),p(t))})}function Yt(){return Dt.fn.spectrum.inputTypeColorSupport()}var s="spectrum.id";Dt.fn.spectrum=function(r,t){if("string"!=typeof r)return this.spectrum("destroy").each(function(){var t=Dt.extend({},r,Dt(this).data()),e=i(this,t);Dt(this).data(s,e.id)});var a=this,n=Array.prototype.slice.call(arguments,1);return this.each(function(){var t=jt[Dt(this).data(s)];if(t){var e=t[r];if(!e)throw new Error("Spectrum: no such method: '"+r+"'");"get"==r?a=t.get():"container"==r?a=t.container:"option"==r?a=t.option.apply(t,n):"destroy"==r?(t.destroy(),Dt(this).removeData(s)):e.apply(t,n)}}),a},Dt.fn.spectrum.load=!0,Dt.fn.spectrum.loadOpts={},Dt.fn.spectrum.draggable=Xt,Dt.fn.spectrum.defaults=qt,Dt.fn.spectrum.inputTypeColorSupport=function t(){if(void 0===t._cachedResult){var e=Dt("<input type='color'/>")[0];t._cachedResult="color"===e.type&&""!==e.value}return t._cachedResult},Dt.spectrum={},Dt.spectrum.localization={},Dt.spectrum.palettes={},Dt.fn.spectrum.processNativeColorInputs=function(){var t=Dt("input[type=color]");t.length&&!Yt()&&t.spectrum({preferredFormat:"hex6"})},function(){var l=/^[\s,#]+/,c=/\s+$/,a=0,f=Math,s=f.round,h=f.min,u=f.max,t=f.random,d=function(t,e){if(e=e||{},(t=t||"")instanceof d)return t;if(!(this instanceof d))return new d(t,e);var r=function(t){var e={r:0,g:0,b:0},r=1,a=!1,n=!1;"string"==typeof t&&(t=function(t){t=t.replace(l,"").replace(c,"").toLowerCase();var e,r=!1;if(P[t])t=P[t],r=!0;else if("transparent"==t)return{r:0,g:0,b:0,a:0,format:"name"};if(e=I.rgb.exec(t))return{r:e[1],g:e[2],b:e[3]};if(e=I.rgba.exec(t))return{r:e[1],g:e[2],b:e[3],a:e[4]};if(e=I.hsl.exec(t))return{h:e[1],s:e[2],l:e[3]};if(e=I.hsla.exec(t))return{h:e[1],s:e[2],l:e[3],a:e[4]};if(e=I.hsv.exec(t))return{h:e[1],s:e[2],v:e[3]};if(e=I.hsva.exec(t))return{h:e[1],s:e[2],v:e[3],a:e[4]};if(e=I.hex8.exec(t))return{a:(a=e[1],F(a)/255),r:F(e[2]),g:F(e[3]),b:F(e[4]),format:r?"name":"hex8"};var a;if(e=I.hex6.exec(t))return{r:F(e[1]),g:F(e[2]),b:F(e[3]),format:r?"name":"hex"};if(e=I.hex3.exec(t))return{r:F(e[1]+""+e[1]),g:F(e[2]+""+e[2]),b:F(e[3]+""+e[3]),format:r?"name":"hex"};return!1}(t));"object"==typeof t&&(t.hasOwnProperty("r")&&t.hasOwnProperty("g")&&t.hasOwnProperty("b")?(i=t.r,s=t.g,o=t.b,e={r:255*R(i,255),g:255*R(s,255),b:255*R(o,255)},a=!0,n="%"===String(t.r).substr(-1)?"prgb":"rgb"):t.hasOwnProperty("h")&&t.hasOwnProperty("s")&&t.hasOwnProperty("v")?(t.s=O(t.s),t.v=O(t.v),e=function(t,e,r){t=6*R(t,360),e=R(e,100),r=R(r,100);var a=f.floor(t),n=t-a,i=r*(1-e),s=r*(1-n*e),o=r*(1-(1-n)*e),l=a%6;return{r:255*[r,s,i,i,o,r][l],g:255*[o,r,r,s,i,i][l],b:255*[i,i,o,r,r,s][l]}}(t.h,t.s,t.v),a=!0,n="hsv"):t.hasOwnProperty("h")&&t.hasOwnProperty("s")&&t.hasOwnProperty("l")&&(t.s=O(t.s),t.l=O(t.l),e=function(t,e,r){var a,n,i;function s(t,e,r){return r<0&&(r+=1),1<r&&(r-=1),r<1/6?t+6*(e-t)*r:r<.5?e:r<2/3?t+(e-t)*(2/3-r)*6:t}if(t=R(t,360),e=R(e,100),r=R(r,100),0===e)a=n=i=r;else{var o=r<.5?r*(1+e):r+e-r*e,l=2*r-o;a=s(l,o,t+1/3),n=s(l,o,t),i=s(l,o,t-1/3)}return{r:255*a,g:255*n,b:255*i}}(t.h,t.s,t.l),a=!0,n="hsl"),t.hasOwnProperty("a")&&(r=t.a));var i,s,o;return r=M(r),{ok:a,format:t.format||n,r:h(255,u(e.r,0)),g:h(255,u(e.g,0)),b:h(255,u(e.b,0)),a:r}}(t);this._originalInput=t,this._r=r.r,this._g=r.g,this._b=r.b,this._a=r.a,this._roundA=s(100*this._a)/100,this._format=e.format||r.format,this._gradientType=e.gradientType,this._r<1&&(this._r=s(this._r)),this._g<1&&(this._g=s(this._g)),this._b<1&&(this._b=s(this._b)),this._ok=r.ok,this._tc_id=a++};function n(t,e,r){t=R(t,255),e=R(e,255),r=R(r,255);var a,n,i=u(t,e,r),s=h(t,e,r),o=(i+s)/2;if(i==s)a=n=0;else{var l=i-s;switch(n=.5<o?l/(2-i-s):l/(i+s),i){case t:a=(e-r)/l+(e<r?6:0);break;case e:a=(r-t)/l+2;break;case r:a=(t-e)/l+4}a/=6}return{h:a,s:n,l:o}}function i(t,e,r){t=R(t,255),e=R(e,255),r=R(r,255);var a,n,i=u(t,e,r),s=h(t,e,r),o=i,l=i-s;if(n=0===i?0:l/i,i==s)a=0;else{switch(i){case t:a=(e-r)/l+(e<r?6:0);break;case e:a=(r-t)/l+2;break;case r:a=(t-e)/l+4}a/=6}return{h:a,s:n,v:o}}function e(t,e,r,a){var n=[T(s(t).toString(16)),T(s(e).toString(16)),T(s(r).toString(16))];return a&&n[0].charAt(0)==n[0].charAt(1)&&n[1].charAt(0)==n[1].charAt(1)&&n[2].charAt(0)==n[2].charAt(1)?n[0].charAt(0)+n[1].charAt(0)+n[2].charAt(0):n.join("")}function o(t,e,r,a){var n,i=[T((n=a,Math.round(255*parseFloat(n)).toString(16))),T(s(t).toString(16)),T(s(e).toString(16)),T(s(r).toString(16))];return i.join("")}function r(t,e){e=0===e?0:e||10;var r=d(t).toHsl();return r.s-=e/100,r.s=H(r.s),d(r)}function p(t,e){e=0===e?0:e||10;var r=d(t).toHsl();return r.s+=e/100,r.s=H(r.s),d(r)}function g(t){return d(t).desaturate(100)}function b(t,e){e=0===e?0:e||10;var r=d(t).toHsl();return r.l+=e/100,r.l=H(r.l),d(r)}function v(t,e){e=0===e?0:e||10;var r=d(t).toRgb();return r.r=u(0,h(255,r.r-s(-e/100*255))),r.g=u(0,h(255,r.g-s(-e/100*255))),r.b=u(0,h(255,r.b-s(-e/100*255))),d(r)}function m(t,e){e=0===e?0:e||10;var r=d(t).toHsl();return r.l-=e/100,r.l=H(r.l),d(r)}function y(t,e){var r=d(t).toHsl(),a=(s(r.h)+e)%360;return r.h=a<0?360+a:a,d(r)}function w(t){var e=d(t).toHsl();return e.h=(e.h+180)%360,d(e)}function _(t){var e=d(t).toHsl(),r=e.h;return[d(t),d({h:(r+120)%360,s:e.s,l:e.l}),d({h:(r+240)%360,s:e.s,l:e.l})]}function x(t){var e=d(t).toHsl(),r=e.h;return[d(t),d({h:(r+90)%360,s:e.s,l:e.l}),d({h:(r+180)%360,s:e.s,l:e.l}),d({h:(r+270)%360,s:e.s,l:e.l})]}function k(t){var e=d(t).toHsl(),r=e.h;return[d(t),d({h:(r+72)%360,s:e.s,l:e.l}),d({h:(r+216)%360,s:e.s,l:e.l})]}function S(t,e,r){e=e||6,r=r||30;var a=d(t).toHsl(),n=360/r,i=[d(t)];for(a.h=(a.h-(n*e>>1)+720)%360;--e;)a.h=(a.h+n)%360,i.push(d(a));return i}function C(t,e){e=e||6;for(var r=d(t).toHsv(),a=r.h,n=r.s,i=r.v,s=[],o=1/e;e--;)s.push(d({h:a,s:n,v:i})),i=(i+o)%1;return s}d.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var t=this.toRgb();return(299*t.r+587*t.g+114*t.b)/1e3},setAlpha:function(t){return this._a=M(t),this._roundA=s(100*this._a)/100,this},toHsv:function(){var t=i(this._r,this._g,this._b);return{h:360*t.h,s:t.s,v:t.v,a:this._a}},toHsvString:function(){var t=i(this._r,this._g,this._b),e=s(360*t.h),r=s(100*t.s),a=s(100*t.v);return 1==this._a?"hsv("+e+", "+r+"%, "+a+"%)":"hsva("+e+", "+r+"%, "+a+"%, "+this._roundA+")"},toHsl:function(){var t=n(this._r,this._g,this._b);return{h:360*t.h,s:t.s,l:t.l,a:this._a}},toHslString:function(){var t=n(this._r,this._g,this._b),e=s(360*t.h),r=s(100*t.s),a=s(100*t.l);return 1==this._a?"hsl("+e+", "+r+"%, "+a+"%)":"hsla("+e+", "+r+"%, "+a+"%, "+this._roundA+")"},toHex:function(t){return e(this._r,this._g,this._b,t)},toHexString:function(t){return"#"+this.toHex(t)},toHex8:function(){return o(this._r,this._g,this._b,this._a)},toHex8String:function(){return"#"+this.toHex8()},toRgb:function(){return{r:s(this._r),g:s(this._g),b:s(this._b),a:this._a}},toRgbString:function(){return 1==this._a?"rgb("+s(this._r)+", "+s(this._g)+", "+s(this._b)+")":"rgba("+s(this._r)+", "+s(this._g)+", "+s(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:s(100*R(this._r,255))+"%",g:s(100*R(this._g,255))+"%",b:s(100*R(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return 1==this._a?"rgb("+s(100*R(this._r,255))+"%, "+s(100*R(this._g,255))+"%, "+s(100*R(this._b,255))+"%)":"rgba("+s(100*R(this._r,255))+"%, "+s(100*R(this._g,255))+"%, "+s(100*R(this._b,255))+"%, "+this._roundA+")"},toName:function(){return 0===this._a?"transparent":!(this._a<1)&&(A[e(this._r,this._g,this._b,!0)]||!1)},toFilter:function(t){var e="#"+o(this._r,this._g,this._b,this._a),r=e,a=this._gradientType?"GradientType = 1, ":"";if(t){var n=d(t);r=n.toHex8String()}return"progid:DXImageTransform.Microsoft.gradient("+a+"startColorstr="+e+",endColorstr="+r+")"},toString:function(t){var e=!!t;t=t||this._format;var r=!1,a=this._a<1&&0<=this._a,n=!e&&a&&("hex"===t||"hex6"===t||"hex3"===t||"name"===t);return n?"name"===t&&0===this._a?this.toName():this.toRgbString():("rgb"===t&&(r=this.toRgbString()),"prgb"===t&&(r=this.toPercentageRgbString()),"hex"!==t&&"hex6"!==t||(r=this.toHexString()),"hex3"===t&&(r=this.toHexString(!0)),"hex8"===t&&(r=this.toHex8String()),"name"===t&&(r=this.toName()),"hsl"===t&&(r=this.toHslString()),"hsv"===t&&(r=this.toHsvString()),r||this.toHexString())},_applyModification:function(t,e){var r=t.apply(null,[this].concat([].slice.call(e)));return this._r=r._r,this._g=r._g,this._b=r._b,this.setAlpha(r._a),this},lighten:function(){return this._applyModification(b,arguments)},brighten:function(){return this._applyModification(v,arguments)},darken:function(){return this._applyModification(m,arguments)},desaturate:function(){return this._applyModification(r,arguments)},saturate:function(){return this._applyModification(p,arguments)},greyscale:function(){return this._applyModification(g,arguments)},spin:function(){return this._applyModification(y,arguments)},_applyCombination:function(t,e){return t.apply(null,[this].concat([].slice.call(e)))},analogous:function(){return this._applyCombination(S,arguments)},complement:function(){return this._applyCombination(w,arguments)},monochromatic:function(){return this._applyCombination(C,arguments)},splitcomplement:function(){return this._applyCombination(k,arguments)},triad:function(){return this._applyCombination(_,arguments)},tetrad:function(){return this._applyCombination(x,arguments)}},d.fromRatio=function(t,e){if("object"==typeof t){var r={};for(var a in t)t.hasOwnProperty(a)&&(r[a]="a"===a?t[a]:O(t[a]));t=r}return d(t,e)},d.equals=function(t,e){return!(!t||!e)&&d(t).toRgbString()==d(e).toRgbString()},d.random=function(){return d.fromRatio({r:t(),g:t(),b:t()})},d.mix=function(t,e,r){r=0===r?0:r||50;var a,n=d(t).toRgb(),i=d(e).toRgb(),s=r/100,o=2*s-1,l=i.a-n.a,c=1-(a=((a=o*l==-1?o:(o+l)/(1+o*l))+1)/2),f={r:i.r*a+n.r*c,g:i.g*a+n.g*c,b:i.b*a+n.b*c,a:i.a*s+n.a*(1-s)};return d(f)},d.readability=function(t,e){var r=d(t),a=d(e),n=r.toRgb(),i=a.toRgb(),s=r.getBrightness(),o=a.getBrightness(),l=Math.max(n.r,i.r)-Math.min(n.r,i.r)+Math.max(n.g,i.g)-Math.min(n.g,i.g)+Math.max(n.b,i.b)-Math.min(n.b,i.b);return{brightness:Math.abs(s-o),color:l}},d.isReadable=function(t,e){var r=d.readability(t,e);return 125<r.brightness&&500<r.color},d.mostReadable=function(t,e){for(var r=null,a=0,n=!1,i=0;i<e.length;i++){var s=d.readability(t,e[i]),o=125<s.brightness&&500<s.color,l=s.brightness/125*3+s.color/500;(o&&!n||o&&n&&a<l||!o&&!n&&a<l)&&(n=o,a=l,r=d(e[i]))}return r};var P=d.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},A=d.hexNames=function(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[t[r]]=r);return e}(P);function M(t){return t=parseFloat(t),(isNaN(t)||t<0||1<t)&&(t=1),t}function R(t,e){var r;"string"==typeof(r=t)&&-1!=r.indexOf(".")&&1===parseFloat(r)&&(t="100%");var a,n="string"==typeof(a=t)&&-1!=a.indexOf("%");return t=h(e,u(0,parseFloat(t))),n&&(t=parseInt(t*e,10)/100),f.abs(t-e)<1e-6?1:t%e/parseFloat(e)}function H(t){return h(1,u(0,t))}function F(t){return parseInt(t,16)}function T(t){return 1==t.length?"0"+t:""+t}function O(t){return t<=1&&(t=100*t+"%"),t}var N,E,D,I=(E="[\\s|\\(]+("+(N="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)")+")[,|\\s]+("+N+")[,|\\s]+("+N+")\\s*\\)?",D="[\\s|\\(]+("+N+")[,|\\s]+("+N+")[,|\\s]+("+N+")[,|\\s]+("+N+")\\s*\\)?",{rgb:new RegExp("rgb"+E),rgba:new RegExp("rgba"+D),hsl:new RegExp("hsl"+E),hsla:new RegExp("hsla"+D),hsv:new RegExp("hsv"+E),hsva:new RegExp("hsva"+D),hex3:/^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex8:/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/});window.tinycolor=d}(),Dt(function(){Dt.fn.spectrum.load&&Dt.fn.spectrum.processNativeColorInputs()})}(jQuery)}();