/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","jquery","hammerjs","promise","ojs/ojjquery-hammer","ojs/ojcomponentcore"],function(e,t,l){e.PullToRefreshUtils={},e.PullToRefreshUtils.setupPullToRefresh=function(a,s,o){var r,n,i,u,d,h,c,f,p,T,g,v,R,m,j,P,U;P=e.DomUtils.isTouchSupported(),e.PullToRefreshUtils.tearDownPullToRefresh(a),r=t(document.createElement("div")).addClass("oj-pulltorefresh-outer"),e.PullToRefreshUtils._renderAccessibleLink(a,r,s,o),n=t(document.createElement("div")).addClass("oj-pulltorefresh-panel"),r.append(n),(i=t(a)).prepend(r),P?U="touch":(U="pan",j={recognizers:[[l.Pan,{direction:l.DIRECTION_VERTICAL}]]},i.ojHammer(j)),i.ojHammer(j).on(U+"start.pulltorefresh",function(l){null==t.data(n[0],"data-pullstart")&&0===i[0].scrollTop&&(e.PullToRefreshUtils._handlePull(l,n,o),(p=n.find(".oj-pulltorefresh-icon")).length>0&&(T=p.parent().outerHeight(!0)),o&&!isNaN(o.threshold)&&(d=parseInt(o.threshold,10)),d=isNaN(d)?n.outerHeight(!0):Math.max(0,Math.min(d,n.outerHeight(!0))),n.css("height",0),n.removeClass("oj-pulltorefresh-transition"),P?(t.data(n[0],"data-pullstart",l.originalEvent.touches[0].clientY),t.data(n[0],"data-pullstart-horiz",l.originalEvent.touches[0].clientX)):t.data(n[0],"data-pullstart",0),u=!0)}).on(U+"move.pulltorefresh",function(l){if(null!=(h=t.data(n[0],"data-pullstart"))&&!((c=P?l.originalEvent.touches[0].clientY-parseInt(h,10):l.gesture.deltaY)<0)&&(l.preventDefault(),null==t.data(n[0],"data-closing")))if(null==t.data(n[0],"data-loading")){if(u){if(f=P?l.originalEvent.touches[0].clientX-parseInt(t.data(n[0],"data-pullstart-horiz"),10):l.gesture.deltaX,Math.abs(f)>c)return;u=!1}n.css("height",c),e.PullToRefreshUtils._fireEvent(l,"pull",n,c),null!=p&&p.length>0&&(null!=(g=t.data(n[0],"data-lasticonclass"))&&p.removeClass(g),(R=10*Math.round(c/d*10))>=100?(m="oj-pulltorefresh-icon-full",v=e.Translations.getTranslatedString("oj-pullToRefresh.titleIconFull")):(m="oj-pulltorefresh-icon-"+R+"-percent",v=e.Translations.getTranslatedString("oj-pullToRefresh.titleIcon"+R+"percent")),p.addClass(m),p.attr("title",v),t.data(n[0],"data-lasticonclass",m),e.PullToRefreshUtils._showHideDefaultText(n,c>T))}else n.css("height",Math.max(c,d))}).on(U+"cancel.pulltorefresh",function(t){e.PullToRefreshUtils._cleanup(n)}).on(U+"end.pulltorefresh",function(l){if(null!=(h=t.data(n[0],"data-pullstart"))&&null==t.data(n[0],"data-closing"))return null!=t.data(n[0],"data-loading")?(c=t.data(n[0],"data-panelheight"),void n.css("height",c)):void(n.outerHeight()<d?(n.addClass("oj-pulltorefresh-transition").css("height",0),e.PullToRefreshUtils._cleanup(n)):e.PullToRefreshUtils._handleRelease(l,a,n,s))})},e.PullToRefreshUtils._handlePull=function(l,a,s){var o,r;e.PullToRefreshUtils._fireEvent(l,"pull",a,0),0==a.children().length&&(s&&(o=s.primaryText,r=s.secondaryText),e.PullToRefreshUtils._createDefaultContent(a,o,r)),a.prev().text(e.Translations.getTranslatedString("oj-pullToRefresh.ariaRefreshingLink")),a.css("height","auto"),t.data(a[0],"data-panelheight",a.outerHeight())},e.PullToRefreshUtils._handleRelease=function(l,a,s,o){var r,n,i,u,d;r=t.data(s[0],"data-panelheight"),s.addClass("oj-pulltorefresh-transition").css("height",r),e.PullToRefreshUtils._fireEvent(l,"release",s,r),t.data(s[0],"data-loading",!0),(n=s.find(".oj-pulltorefresh-icon")).length>0&&(null!=(i=t.data(s[0],"data-lasticonclass"))&&n.removeClass(i),n.addClass("oj-pulltorefresh-icon-full")),u=e.Context.getContext(a).getBusyContext().addBusyState({description:"PullToRefresh:handleRelease"}),t.data(t(a)[0],"data-pulltorefresh-busystate",u),o().then(function(o){d=function(){e.PullToRefreshUtils._fireEvent(l,"complete",s,r),e.PullToRefreshUtils._cleanup(s),s.off("transitionend",d),s.prev().text(""),e.PullToRefreshUtils._resolveBusyState(a)},s.prev().text(e.Translations.getTranslatedString("oj-pullToRefresh.ariaRefreshCompleteLink")),s.prev().prev().css("position",""),t.data(s[0],"data-closing",!0),s.on("transitionend",d),s.css("height",0)},function(l){d=function(){e.PullToRefreshUtils._cleanup(s),s.off("transitionend",d),s.prev().text(""),e.PullToRefreshUtils._resolveBusyState(a)},s.prev().prev().css("position",""),t.data(s[0],"data-closing",!0),s.on("transitionend",d),s.css("height",0)})},e.PullToRefreshUtils.tearDownPullToRefresh=function(l){t(l).children(".oj-pulltorefresh-outer").remove(),t(l).off(".pulltorefresh"),e.PullToRefreshUtils._resolveBusyState(l)},e.PullToRefreshUtils._resolveBusyState=function(e){var l,a;l=t(e)[0],(a=t.data(l,"data-pulltorefresh-busystate"))&&(a(null),t.removeData(l,"data-pulltorefresh-busystate"))},e.PullToRefreshUtils._fireEvent=function(e,l,a,s){var o=t.Event("oj"+l);o.originalEvent=e,a.trigger(o,{content:a,distance:s})},e.PullToRefreshUtils._createDefaultContent=function(e,l,a){var s,o,r,n;e.addClass("oj-pulltorefresh-content").attr("aria-hidden","true"),(s=t(document.createElement("div"))).addClass("oj-icon oj-pulltorefresh-icon oj-pulltorefresh-icon-initial"),(o=t(document.createElement("div"))).addClass("oj-pulltorefresh-icon-container"),o.append(s),t.data(e[0],"data-lasticonclass","oj-pulltorefresh-icon-initial"),e.append(o),null!=l&&(r=t(document.createElement("div")).addClass("oj-pulltorefresh-primary-text").text(l),e.append(r),null!=a&&(n=t(document.createElement("div")).addClass("oj-pulltorefresh-secondary-text").text(a),e.append(n)))},e.PullToRefreshUtils._showHideDefaultText=function(e,t){var l,a;l=e.find(".oj-pulltorefresh-primary-text"),a=e.find(".oj-pulltorefresh-secondary-text"),t?(l&&l.show(),a&&a.show()):(l&&l.hide(),a&&a.hide())},e.PullToRefreshUtils._renderAccessibleLink=function(l,a,s,o){var r,n,i;(r=t(document.createElement("a"))).text(e.Translations.getTranslatedString("oj-pullToRefresh.ariaRefreshLink")),r.addClass("oj-helper-hidden-accessible").attr("href","#").focus(function(){r.css("position","static")}).blur(function(e){null!=e.relatedTarget&&r.css("position","")}).click(function(t){n=a.children().last(),e.PullToRefreshUtils._handlePull(t,n,o),e.PullToRefreshUtils._handleRelease(t,l,n,s)}),(i=t(document.createElement("div"))).addClass("oj-helper-hidden-accessible").attr("aria-live","polite"),a.append(r),a.append(i)},e.PullToRefreshUtils._cleanup=function(e){t.removeData(e[0],"data-pullstart"),t.removeData(e[0],"data-pullstart-horiz"),t.removeData(e[0],"data-loading"),t.removeData(e[0],"data-closing"),e.find(".oj-pulltorefresh-icon").length>0&&e.empty()}});