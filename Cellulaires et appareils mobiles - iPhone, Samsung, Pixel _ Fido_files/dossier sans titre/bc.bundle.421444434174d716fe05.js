var bc;(bc=window.bc=window.bc||{}).ApiFrame=function(e,t,i){var a=!!bc.config.serverSet||""===bc.config.serverSet;this.accountId=e,this.frame=t,this.frameLoadQueue=[],this.framePendingResults={},this.serverSet=a?bc.config.serverSet:i||"",this.frameOrigin="https://api"+this.serverSet+".boldchat.com",this.messageListener=null,this.id=1,this.isFrameLoaded=!1,this.retryTimeout=15e3,this.initialize()},bc.ApiFrame.prototype.initialize=function(){this.frame||(this.frame=bc.util.createElement("iframe",{class:"bc-api-frame",src:"about:blank",frameborder:0,style:"float: right; width: 1px; height: 1px; visibility: hidden"}),document.body.appendChild(this.frame)),this.frame&&this.frame.setAttribute("src",this.frameOrigin+"/aid/"+this.accountId+"/ext/api/apiframe.html");var e=this,t=function(t){e._receiveApiMessage(t)};window.addEventListener?window.addEventListener("message",t):window.attachEvent("message",t)},bc.ApiFrame.prototype.setMessageListener=function(e){this.messageListener=e},bc.ApiFrame.prototype._receiveApiMessage=function(e){if(e.origin===this.frameOrigin){var t={};try{t=JSON.parse(e.data)}catch(o){bc.util.log(e.data,!0),bc.util.log(o,!0)}var i=t.method;if(i)if("loaded"===i){var a=this.frameLoadQueue.shift();for(this.isFrameLoaded=!0;a;)this._callRestObj(a),a=this.frameLoadQueue.shift();var n=this;setInterval((function(){var e=(new Date).getTime();for(var t in n.framePendingResults){var i=n.framePendingResults[t];e-i.time>Math.min(n.retryTimeout*i.tries,6e4)&&n._callRestObj(i.rest,i.tries)}}),this.retryTimeout)}else this.messageListener(t.method,t.params,t.id);else{var s=this.framePendingResults[t.id];s&&(t.error?bc.util.log("** pending failed : _receiveApiMessage",t,s):(delete this.framePendingResults[t.id],s.rest.callback.finished(t)))}}},bc.ApiFrame.prototype.call=function(e,t){return this._callRestObj({request:{method:e,params:t,id:this.id++},callback:new bc.Rpc})},bc.ApiFrame.prototype._callRestObj=function(e,t){if(this.isFrameLoaded){"connect"!==e.request.method&&"disconnect"!==e.request.method&&(this.framePendingResults[e.request.id]={time:(new Date).getTime(),rest:e,tries:(t||0)+1});try{this.frame.contentWindow.postMessage(JSON.stringify(e.request),this.frameOrigin)}catch(i){console.log(i)}}else this.frameLoadQueue.push(e),bc.util.log("** adding to frameLoadQueue : _callRestObj",!1,e);return e.callback},function(){if("function"==typeof window.CustomEvent)return!1;function e(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var i=document.createEvent("CustomEvent");return i.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),i}e.prototype=window.Event.prototype,window.CustomEvent=e}(),(bc=window.bc=window.bc||{}).subscriber=function(e,t){var i={};e.subscribe=function(t,a){return i[t]=i[t]||[],i[t].push(a),e},e.unsubscribe=function(t,a){for(var n=0;i[t]&&n<i[t].length;n++)i[t][n]===a&&i[t].splice(n,1);return e},e.fireEvent=function(t){for(var a=Array.prototype.slice.call(arguments,1),n=i[t],s=0;n&&s<n.length;s++)if(bc.config.throwErrors)n[s].apply(e,a);else try{n[s].apply(e,a)}catch(o){bc.util.log(o)}return e};for(var a=0;a<t.length;a++)e[t[a]]=function(){var i=t[a];return function(t){return e.subscribe(i,t)}}()},bc.Rpc=function(){var e=this;return bc.subscriber(e,["success","failure"]),e.finished=function(t){t&&(t.error||"error"===t.Status||t.result&&"error"===t.result.Status)?e.fireEvent("failure",t.error||t.result&&t.result.Message||t.Message):e.fireEvent("success",t&&t.result||t)},e},bc.RpcError=function(e){var t=this;return t.success=function(){return t},t.failure=function(i){return i(e),t},t},bc.VisitorClient=function(e){var t=e.split(":"),i=t[0],a=null;t.length>3&&(a="-"+t[3],e=t.slice(0,3).join(":")),e=bc.util.base64(e);var n=new bc.ApiFrame(i,null,a);bc.subscriber(this,["updateChat","updateTyper","addMessage","autoMessage","updateBusy","beginActiveAssist","updateActiveAssist","reconnecting","chatEndedByOp","chatEnded","closed"]);var s=this,o=null;s.setChatKey=function(e){o=e,e&&(c="started")};var r=null,c=o?"started":"create",u=null,l=null,d=function(t,i){return o&&(i.ChatKey=o),i.auth=e,i.stream=!0,n.call(t,i)},h=function(t,i){return o&&(i.ChatKey=o),i.auth=e,n.call(t,i)},g=function(e){bc.util.createCookie(bc.config.chatCookie,o,.08),u=e.ClientID,n.call("connect",e),e.Brandings&&r.setBrandings(e.Brandings)},f=function(){n.call("disconnect",{}),l=null,u=null,s.fireEvent("closed")},b=function(e){bc.util.log(e)},m={},p=null,v={},w=!1;s.hasChatKey=function(){return!!o},s.getChatParams=function(){return r&&r.getChatParams()||{}},s.addChatParams=function(e){r.addChatParams(e)},s.getVisitInfo=function(){return r&&r.getVisitInfo()||{}},s.addVisitInfo=function(e){r.addVisitInfo(e)},s.updateVisitInfo=function(e){r.addVisitInfo(e)},s.getMessages=function(){return r.getMessages()},s.getPerson=function(e){return v[e]||r.getPeople()[e]||{}},s.getChat=function(){return p},s.getPostChatFormIfAvail=function(){s.finishChat().success((function(e){s.fireEvent("chatEnded",e)}))},s.getLastMessageId=function(){return r.getLastMessageId()},s.isMinimized=function(){return r&&r.getMinimizedStatus()},s.changeMinimizedStatus=function(e){return r.changeMinimizedStatus(e)},s.chatContainsStatusMessage=!1;var C=function(e){!s.chatContainsStatusMessage&&e.PersonType&&"operator"===e.PersonType&&(s.chatContainsStatusMessage=!0)};m.updateChat=function(e){var t=e.Values;for(var i in p=p||{},t)t.hasOwnProperty(i)&&(p[i]=t[i])},m.updateTyper=function(e){if(e&&e.PersonID&&e.Values&&"visitor"===e.Values.PersonType){var t=new CustomEvent("VA_BoldChatVisitorId",{detail:e.PersonID});window.dispatchEvent(t)}_(e)},m.addMessage=function(e){bc.util.log("Received a message from the server",!1,e);var t=e.Values,i=e.MessageID;C(t),r.addMessage(i,t),_(e)},m.autoMessage=function(){},m.updateBusy=function(e){bc.util.log("Received an updateBusy message from the server: ",!1,e),r.setQueueIndicator(e)},m.beginActiveAssist=function(e){l=e.ActiveAssistID},m.updateActiveAssist=function(e){e.Values.Ended&&(l=null)},m.startChat=function(){"started"!==c||w||s.startChat()},m.finishChat=function(){bc.util.log("messageHandler.finishChat"),"started"!==c||w||s.fireEvent("chatEndedByOp")},m.chatEndedByOp=function(){bc.util.log("client:messageHandlers.chatEndedByop")},m.chatEnded=function(){bc.util.log("chatEnded")},m.reconnecting=function(){s.fireEvent("reconnecting")},s.handleMessage=function(e,t){if("finishChat"===e||"updateChat"===e&&t.Values.Ended&&"operator"===t.Values.EndedReason){var i=new CustomEvent("VA_BoldChatEndedByOp");window.dispatchEvent(i)}if("addMessage"===e&&"operator"===t.Values.PersonType){var a={text:t.Values.Text,operatorName:t.Values.Name,messageId:t.MessageID};i=new CustomEvent("VA_BoldChatMessage",{detail:a});window.dispatchEvent(i)}if("updateChat"===e&&t.ChatID){i=new CustomEvent("VA_BoldChatId",{detail:{boldChatId:t.ChatID}});window.dispatchEvent(i)}if("addMessage"===e&&"system"===t.Values.PersonType&&(-1!==t.Values.Text.indexOf("http://www.rogers.com/cms/rogers/images/boldchat/LiveChat-Transfer-Animation")||-1!==t.Values.Text.indexOf("Your chat is now being transferred. Another support representative will greet you as soon as they are ready to assist you.")||-1!==t.Values.Text.indexOf("Votre séance de clavardage est en cours de transfert. Veuillez ne pas fermer cette fenêtre. Un autre conseiller sera en mesure de vous aider dès qu’il sera disponible."))){i=new CustomEvent("VA_Transferring_Agents",{detail:{text:t.Values.Text}});window.dispatchEvent(i)}bc.util.log("messageHandler.handleMessage:method = ",!1,e),bc.util.log("messageHandler.handleMessage:params = ",!1,t);var n=m[e];n&&n(t),s.fireEvent(e,t)},n.setMessageListener(s.handleMessage),s.getChatAvailability=function(e){return h("getChatAvailability",{VisitorId:e||null}).failure(b)},s.createChat=function(e,t,i,a,n,s,u,l){if("create"!==c)return new bc.RpcError("You can only call createChat once");var d={VisitorID:e,Language:t,IncludeBrandingValues:!0,SkipPreChat:i,Data:JSON.stringify(a),Secured:n,ButtonID:s,ChatUrl:u,CustomUrl:l},f=function(){var e=bc.util.readRawCookie(bc.config.chatRecoverCookie);if(e){return{chatKey:e.split(":")[0]}}return null}();return f&&(d.ChatKey=f.chatKey),h("createChat",d).failure(b).success((function(e){"function"==typeof bc.setOverrides&&bc.setOverrides(),o=e.ChatKey;var t=new CustomEvent("VA_BoldChatKey",{detail:{boldChatKey:o}});window.dispatchEvent(t),(r=new bc.SessionStorage(o)).setBrandings(e.Brandings),"started"===(c=e.UnavailableReason?"unavailable":e.PreChat?"prechat":"started")&&g(e),M()}))},s.cancelChat=function(){bc.util.eraseCookie(bc.config.chatCookie),bc.util.eraseCookie(bc.config.configCookie)},s.submitUnavailableEmail=function(e,t,i){return"unavailable"!==c?new bc.RpcError("You can only submit the unavailable form on the unavailable form"):h("submitUnavailableEmail",{From:e,Subject:t,Body:i}).failure(b).success((function(){c="unavailable_submitted"}))},s.submitPreChat=function(e){return"prechat"!==c?new bc.RpcError("You can only submit a pre chat when on the pre chat"):h("submitPreChat",{Data:JSON.stringify(e)}).failure(b).success((function(e){"started"===(c=e.UnavailableReason?"unavailable":e.PreChat?"prechat":"started")&&g(e)}))},s.changeLanguage=function(e){return"prechat"!==c?new bc.RpcError("You can only change language on the pre chat form"):h("changeLanguage",{Language:e}).failure(b).success((function(e){e.Brandings&&r.setBrandings(e.Brandings)}))},s.startChat=function(){if("started"!==c&&!o)return bc.util.eraseCookie(bc.config.chatCookie),new bc.RpcError("You can only start a chat once it is started (needs a chat key from createChat)");n.call("disconnect",{}),"function"==typeof bc.setOverrides&&bc.setOverrides();var e={};if(!r&&o){(r=new bc.SessionStorage(o)).getBrandings()||(e.IncludeBrandingValues=!0);var t=r.getMessages();try{for(var i=0;i<t.length;i++)C(t[i]),t[i].IsReconstitutedMsg=!0,s.fireEvent("addMessage",{MessageID:t[i].MessageID,Values:t[i]});e.LastChatMessageID=r.getLastMessageId()}catch(l){bc.util.log(l,!0)}var a=r.getQueueIndicator();try{var u={Position:a.Position,UnavailableFormEnabled:a.UnavailableFormEnabled};s.fireEvent("updateBusy",u)}catch(l){bc.util.log(l,!0)}}return y||M(),h("startChat",e).success(g).failure((function(e){bc.util.eraseCookie(bc.config.chatCookie),b(e)}))},s.visitorTyping=function(e){return"started"!==c?new bc.RpcError("You cannot change typing state if the chat is not active"):d("visitorTyping",{IsTyping:e}).failure(b)},s.sendMessage=function(e,t,i){if("started"!==c)return new bc.RpcError("You cannot send messages if the chat is not active");var a={Name:e,Message:t,ChatMessageID:i||bc.util.getId()};return d("sendMessage",a).failure((function(e){b("bc-client.sendMessage error:"),b(e)}))},s.emailChatHistory=function(e){return"started"!==c&&"postchat"!==c&&"done"!==c?new bc.RpcError("You cannot email the chat before it is started"):d("emailChatHistory",{EmailAddress:e}).failure(b)},s.finishChat=function(){return"started"!==c?(E(),new bc.RpcError("You cannot finish the chat unless it is started")):(w=!0,h("finishChat",{ClientID:u}).failure((function(e){E(),b(e)})).success((function(e){f(),bc.util.eraseCookie(bc.config.chatCookie),bc.util.eraseCookie(bc.config.configCookie),c=e.PostChat?"postchat":"done"})))},s.getUnavailableForm=function(){return"started"!==c?new bc.RpcError("You cannot get the unavailable form unless the chat has started"):(w=!0,h("getUnavailableForm",{ClientID:u}).failure(b).success((function(){f(),c="unavailable"})))},s.acceptActiveAssist=function(){return l?d("acceptActiveAssist",{ClientID:u,ActiveAssistID:l}).failure(b):new bc.RpcError("There is no active assist to accept")},s.cancelActiveAssist=function(){return d("cancelActiveAssist",{ClientID:u,ActiveAssistID:l}).failure(b)},s.submitPostChat=function(e){return"postchat"!==c?new bc.RpcError("Cannot call post chat when not on the post chat"):h("submitPostChat",{Data:JSON.stringify(e)}).failure(b).success((function(e){c=e.PostChat?"postchat":"done"}))},s.getState=function(){return c},s.isStarted=function(){return"started"===c},s.setState=function(e){c=e},s.getBrandings=function(){return r.getBrandings()};var y=null,M=function(e){y=setTimeout((function(){P()}),e||3e4)},E=function(){bc.util.log("Stopping ping chat loop"),clearTimeout(y)},I=0,P=function(){if("create"!==c&&"done"!==c)return h("pingChat",{Closed:!1}).success((function(){M(3e4),I=0})).failure((function(){++I<50&&M(5e3)}));bc.util.log("Exiting ping chat loop state = "+c),clearTimeout(y),y=null},S=function(){},_=function(e){var t=e.Values&&e.Values.PersonID||e.PersonID;e.Values&&t&&(v[t]=v[t]||r.getPeople()[t]||{},e.Values.ImageURL&&(v[t].Avatar=e.Values.ImageURL),e.Values.Name&&(v[t].Name=e.Values.Name),r.setPeople(v))};return s.setEmailTranscript=function(e){if(o)return h("emailChatHistory",{ChatKey:o,EmailAddress:e}).failure(b)},window.addEventListener?window.addEventListener("beforeunload",S,!1):window.attachEvent("onbeforeunload",S),s},(bc=window.bc=window.bc||{}).config&&bc.config.initialized||(bc.config={initialized:!0,logging:!0,throwErrors:!0,useWebsocket:null,jsonp:!0,sessionApiKey:null,messageCache:!0,chatCookie:"_bcck",chatRecoverCookie:"_bc-curl",configCookie:"_bccfg",chatWindowUrl:"",forcePopup:null,addViewportMetaTag:!0,viewPortMetaTagContent:"width=device-width, height=device-height, initial-scale=1, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",displayTypingOperatorImage:!0,defaultCompanyLogoLocation:"images/unknown-customer.png"}),(bc=window.bc=window.bc||{}).PersonType={Operator:"operator",Visitor:"visitor",System:"system"},Object.freeze&&Object.freeze(bc.PersonType),(bc=window.bc=window.bc||{}).startSession=function(e,t,i){"use strict";if(bc&&bc.ViewManager){var a=new bc.ViewManager;i&&"function"==typeof i&&(a.closeChat=i);var n=document.getElementById("bc-layered-chat")||document.getElementById("bc-popup-chat");if(n){var s=bc.util.msieversion();s&&0!==s&&bc.util.addClass(n,"bc-ie bc-ie"+s.toString())}bc.currentSession=new bc.Session(bc.config.sessionApiKey,e,t,a),bc.currentSession.startChat(),bc.currentSession.isMinimized()?(bc.currentSession.minimizeChat(),setTimeout((function(){n.style.visibility="visible"}),500)):n.style.visibility="visible"}},bc.openChat=function(e,t){"use strict";var i=null,a=null,n=null,s=bc.util.readCookie(bc.config.configCookie);s&&(bc.config=JSON.parse(s)),void 0!==window._bcForcePopup&&(bc.config.forcePopup=window._bcForcePopup),void 0!==window._bcSessionApiKey&&(bc.config.sessionApiKey=window._bcSessionApiKey),void 0!==window._bcServerSet&&(bc.config.serverSet=window._bcServerSet),void 0!==window._bcChatWindowUrl&&(bc.config.chatWindowUrl=window._bcChatWindowUrl),void 0!==window._bcDebug&&(bc.config.debug=window._bcDebug);var o=function(e){if(0===e){var t=document.getElementsByName("bt_invite_box");if(t&&t.length>0)for(var i=0;i<t.length;i++)bc.util.removeElement(t[i]);if((t=document.getElementsByName("bc-invite-box"))&&t.length>0)for(i=0;i<t.length;i++)bc.util.removeElement(t[i])}},r=function(){n.style.visibility="hidden",!bc.config.forcePopup&&bc.config&&bc.config.addViewportMetaTag&&(bc.util.removeElement(a),i&&document.getElementsByTagName("head")[0].appendChild(i)),document.body&&(document.body.removeChild(n),window.bcChatOpen=!1)},c=function(){bc.util.log("startSession"),bc.startSession(e,t,r)};window.bcChatOpen||(bc.config.forcePopup?bc.util.readCookie(bc.config.chatCookie)||bc.util.readCookie(bc.config.configCookie)?bc.startSession(e,t,null):function(i){var a=function(e){if(0===e){var t=document.head||document.getElementsByTagName("head")[0];if(!t.querySelector("#bc-hide-style")){var i=".bc-hide-buttons {display: none !important;}",a=bc.util.createElement("style",{type:"text/css",id:"bc-hide-style"});a.styleSheet?a.styleSheet.cssText=i:a.appendChild(document.createTextNode(i)),t.appendChild(a)}}o(e);var n=document.getElementsByClassName("bcFloat"),s=document.getElementsByClassName("bcStatic"),r=[];n&&n.length>0&&r.push(n),s&&s.length>0&&r.push(s);for(var c=0;c<r.length;c++)for(var u=0;u<r[c].length;u++)0===e?bc.util.addClass(r[c][u],"bc-hide-buttons"):bc.util.removeClass(r[c][u],"bc-hide-buttons")},n=480,s=640;e&&e.width&&e.height&&(e.height>e.width?(s=e.height,n=e.width):(s=e.width,n=e.height));var r="width="+n+",height="+s+",resizable=0,menubar=no,location=0,titlebar=0",c=window.open(i,"BoldChatbyLogMeIn",r);if(c){window.bcChatOpen=!0,a(0);var u=100,l=window.setInterval((function(){try{c.bc.setConfig(bc.config,e,t),window.clearTimeout(l)}catch(i){(u-=1)<=0&&(window.clearTimeout(l),bc.util.log("Could not invoke setConfig on the popup window. Error: "+i,!0))}}),100),d=window.setInterval((function(){!1!==c.closed&&(window.clearInterval(d),bc.util.eraseCookie(bc.config.chatCookie),bc.util.eraseCookie(bc.config.configCookie),window.bcChatOpen=!1,a(1))}),500)}}(bc.config.chatWindowUrl+"/popup.html"):function(e,t){if(!window.bcChatOpen){var i=new XMLHttpRequest;i.onreadystatechange=function(){4===i.readyState&&200===i.status&&t&&"function"==typeof t&&t(i.responseText)},i.open("GET",e),i.send()}}(bc.config.chatWindowUrl,(function(e){var t,s;window.bcChatOpen||(window.bcChatOpen=!0,n||function(e,t,i){(n=t.createElement("div")).id=i,n.innerHTML=e}(e,document,"bc-layered-chat"),o(0),t=document.getElementsByTagName("head")[0],s=document,(bc.config.forcePopup||bc.config.addViewportMetaTag)&&((i=t.querySelector("meta[name=viewport]"))&&bc.util.removeElement(i),a||((a=s.createElement("meta")).id="bc-viewport",a.name="viewport",a.content=bc.config.viewPortMetaTagContent),t.appendChild(a)),bc.util.loadJavascript(n,c),bc.util.log("afterLoadJavascript"),document.body.appendChild(n),n.style.visibility="hidden")})))},function(){"use strict";window.bcChatOpen||(window._bcvma=window._bcvma||[],window._bcvma.push(["setCustomChatWindow",bc.openChat]),bc.util&&(bc.util.readCookie(bc.config.chatCookie)||bc.util.readCookie(bc.config.configCookie))&&bc.openChat())}(),(bc=window.bc=window.bc||{}).Session=function(e,t,i,a){var n=this,s=0,o=null,r=null,c=!1,u=0;this.viewManager=a,this.client=new bc.VisitorClient(e),this.chatParams=t||{},this.visitorInfo=i||{};var l=function(e){n.viewManager.hideBusy(),n.viewManager.showError(e)};this.getApiKey=function(){return e},this.getVisitorId=function(){var e=this.visitorInfo.visitorId;if(!e){var t=bc.util.readCookie("bc-visitor-id");if(t){var i=t.indexOf("=");if(-1!==i){var a=t.indexOf("&",i);e=t.substring(i+1,-1===a?t.length:a)}}}return e},this.getChatAvailability=function(e,t){this.client.getChatAvailability(n.getVisitorId()).success((function(t){e(t.Available,t.UnavailableReason)})).failure(t)};var d=function(e){var t="api#unavailable#no_operators",i="api#chat#close";e.UnavailableForm&&(e.UnavailableForm.Fields?(t="api#unavailable#intro",i="api#chat#send"):"unsecure"===e.UnavailableReason&&(t="api#unsecure#message")),n.viewManager.showForm(t,e.UnavailableForm,null,i,n._unavailableFormSubmitted)},h=function(e,t){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])},g=function(){if(!n.client.chatContainsStatusMessage){var e=null;(e=0!==s?n.viewManager.getLocalizedValue("api#chat#operators_busy"):n.viewManager.getLocalizedValue("api#chat#waiting_for_operator"))&&n.viewManager.showStatusMessage(e)}},f=function(){if(n.client.isStarted()){var e=n.client.getChat();return null===e||!e.Answered&&!e.Ended&&!e.Closed}},b=function(e){e&&(bc.util.log("Starting answer timeout for "+e+" seconds"),o&&(clearTimeout(o),o=null),f()&&(o=setTimeout((function(){bc.util.log("Answer timed out"),f()&&n.cancelQueueWait(),o=null}),1e3*e)))};this.startChat=function(e,t,a,s,o,r){if(this.viewManager||(this.viewManager=new bc.ViewManager),this.viewManager.initialize(this),n.viewManager.showBusy(),this.client.hasChatKey())this.client.startChat().success((function(e){n.viewManager.showChatForm(),n.viewManager.hideBusy(),n.chatParams=n.client.getChatParams(),n.visitorInfo=n.client.getVisitInfo(),(e.Brandings||n.client.getBrandings())&&n.viewManager.setLocalizationValues(e.Brandings||n.client.getBrandings()),g()})).failure((function(e){bc.util.log("Failed to resume previous chat session: "+e,!0),n.viewManager.closeChat()}));else{var c=setTimeout((function(){n.client.setState("error"),n.viewManager.hideBusy(),n.viewManager.showError("Error creating chat, please try again.")}),15e3),u={};h(i,u),h(a,u),u.language=u.language||n.chatParams.language,this.client.createChat(s,t||n.chatParams.language,e,u,n.chatParams.secure,o,r,n.chatParams.customUrl).success((function(e){var t,i,a,s;clearTimeout(c),n.viewManager.setLocalizationValues(e.Brandings),n.chatParams&&n.client.addChatParams(n.chatParams),n.visitorInfo&&n.client.addVisitInfo(n.visitorInfo),n.viewManager.hideBusy(),e.PreChat?n.viewManager.showForm("api#prechat#intro",e.PreChat,null,"api#prechat#start",n._preChatFormSubmitted):e.UnavailableForm?(d(e),i="",a=(t=e).UnavailableReason,s=!1,"outside_hours"===a?(i=t.Brandings["api#unavailable#unavailable_hours_operators"],s=!0):i="queue_full"===a?t.Brandings["api#unavailable#unavailable_max_queue"]:t.Brandings["api#unavailable#unavailable"],""===i&&t.Message&&(i=t.Message),n.viewManager.rogers_showUnavailableMessage(i,s)):(b(e.AnswerTimeout),n.viewManager.showChatForm(),g())})).failure((function(e){clearTimeout(c),l(e)}))}},this.setLanguage=function(e){n.viewManager.showBusy(),this.client.changeLanguage(e).success((function(e){n.viewManager.hideBusy(),e.Brandings&&n.viewManager.setLocalizationValues(e.Brandings),e.Departments&&n.viewManager.changeDepartments(e.Departments)})).failure(l)},this.setVisitorTyping=function(e){this.client.visitorTyping(e)},this.addVisitorMessage=function(e){var t=bc.util.getId();return this.client.sendMessage(n.getVisitorName(),e,t),t},this.setEmailTranscript=function(e){this.client.setEmailTranscript(e)},this.cancelQueueWait=function(){n.viewManager.showBusy(),n.client.cancelChat(),n.client.getUnavailableForm().success((function(e){n.viewManager.hideQueueMessage(),n.viewManager.clearOperatorTypers(),n.viewManager.hideBusy(),d(e)})).failure(l)},this.endChat=function(){switch(n.viewManager.showBusy(),n.viewManager.hideChatInteraction(),n.client.getState()){case"error":case"prechat":case"postchat":case"unavailable":n.client.finishChat(),n.viewManager.closeChat(),n.viewManager.hideForm();break;default:n.client.finishChat().success((function(e){n._processChatEndData(e)})).failure((function(){n._processChatEndData()}))}},this.getVisitorName=function(){return n.visitorInfo||(n.visitorInfo=n.client.getVisitInfo()),n.visitorInfo?n.visitorInfo.first_name||n.visitorInfo.name||n.visitorInfo.last_name:n.viewManager.getLocalizedValue("api#generic#you")},this.getOperatorName=function(){return n.viewManager.getOperatorTranslation()},this._updateChat=function(e){(e.Values.Answered||e.Values.Ended)&&n.viewManager.hideStatusMessage(),e.Values.Ended&&n.viewManager.hideChatInteraction()},this._updateTyper=function(e){if(e.Values.PersonType===bc.PersonType.Operator)if(e.Values.IsTyping){if(e.Values.Name)return n.viewManager.setOperatorTyping(e.Values.Name,e.Values.ImageURL,e.PersonID);n.getOperatorName().subscribe((function(t){n.viewManager.setOperatorTyping(t,e.Values.ImageURL,e.PersonID)}))}else n.viewManager.hideOperatorTyping(e.PersonID)},this._addMessage=function(e){var t=e.Values.ImageURL||n.client.getPerson(e.Values.PersonID).Avatar,i=e.Values.Name||n.client.getPerson(e.Values.PersonID).Name||n.getOperatorName();n.viewManager.addOrUpdateMessage(e.MessageID,e.Values.PersonType,i,new Date(e.Values.Created),e.Values.Text,t,e.Values.IsReconstitutedMsg,e.Values.OriginalText),r&&(clearTimeout(r),r=null);var a=n.client.getLastMessageId();(c&&u!==a||!a)&&(r=n.viewManager.notifyMinimizeButton()),(c=a===e.MessageID)&&(u=a)},this._autoMessage=function(e){n.client.chatContainsStatusMessage=!0,n.viewManager.showStatusMessage(e.Text)},this._updateBusyQueue=function(e){s=e.Position,e.Position<=0?n.viewManager.hideQueueMessage():e&&e.Position&&e.Position>0&&n.viewManager.showOrUpdateQueueMessage(e.Position,e.UnavailableFormEnabled),g()};this._preChatFormSubmitted=function(e){n.viewManager.hideForm(),n.viewManager.showBusy(),function(e){e.name?n.visitorInfo.name=e.name:e.first_name&&(n.visitorInfo.name=e.first_name),e.last_name&&(n.visitorInfo.last_name=e.last_name),e.email&&(n.visitorInfo.email=e.email),e.information&&(n.visitorInfo.information=e.information),e.initial_question&&(n.visitorInfo.initial_question=e.initial_question),e.language&&(n.visitorInfo.language=e.language),e.phone&&(n.visitorInfo.phone=e.phone),n.client.updateVisitInfo(n.visitorInfo)}(e),n.client.submitPreChat(e).success((function(e){n.viewManager.hideBusy(),e.UnavailableReason?d(e):(b(e.AnswerTimeout),n.viewManager.showChatForm(),g())})).failure(l)},this._postChatFormSubmitted=function(e){n.viewManager.hideForm(),n.viewManager.showBusy(),n.viewManager.hideCloseButton();var t=null;n.client.submitPostChat(e).success((function(){"use strict";var i=0;for(var a in e)e[a]&&e.hasOwnProperty(a)&&i++;var s="api#chat#ended";e.email&&1===i?(s="api#postchat#emailed",t={Fields:[{Key:"email",Type:"label",Value:e.email}]}):e.email&&i>1?(s="api#postchat#submitted_and_emailed",t={Fields:[{Key:"email",Type:"label",Value:e.email}]}):i>0&&(s="api#postchat#submitted"),n.viewManager.hideBusy(),n.viewManager.showForm(s,t,null,"api#chat#close",(function(){n.viewManager.closeChat(),n.viewManager.hideForm()}))})).failure((function(e){"use strict";l(e),n.viewManager.closeChat(),n.viewManager.hideForm()}))},this._unavailableFormSubmitted=function(e){n.viewManager.hideForm(),e.email&&e.subject&&e.body?n.client.submitUnavailableEmail(e.email,e.subject,e.body).success((function(){n.viewManager.hideForm(),n.viewManager.hideCloseButton(),n.viewManager.showForm("api#unavailable#emailed",null,null,"api#chat#close",(function(){"use strict";n.viewManager.closeChat(),n.viewManager.hideForm()}))})).failure((function(e){"use strict";l(e),n.viewManager.closeChat(),n.viewManager.hideForm()})):n.viewManager.closeChat()},this._chatEnded=function(e){bc.util.log("session:this_chatEnded"),n.viewManager.hideChatInteraction(),n._processChatEndData(e)},this._chatEndedByOpSubmitted=function(e){n.viewManager.hideForm(),n.client.getPostChatFormIfAvail()},this._chatEndedByOp=function(e){bc.util.log("session:this_chatEndeByOp"),n.viewManager.hideChatInteraction(),n.viewManager.showForm("api#chat#operator_ended",null,null,"api#chat#close",n._chatEndedByOpSubmitted,null,null,!0)},this._processChatEndData=function(e){if(n.viewManager.hideBusy(),e&&e.PostChat){var t="api#postchat#intro",i="api#email#transcript";e.PostChat.Fields&&1===e.PostChat.Fields.length&&e.PostChat.Fields[0].Key&&"email"===e.PostChat.Fields[0].Key&&(t="api#email#transcript",i=null),n.viewManager.showForm(t,e.PostChat,null,"api#postchat#done",n._postChatFormSubmitted,null,i,!0)}else n.viewManager.showForm("api#chat#ended",null,null,"api#chat#close",(function(){n.viewManager.closeChat(),n.viewManager.hideForm()}),null,null,!0)},this.minimizeChat=function(){clearTimeout(r),n.viewManager.minimizeChat()},this.changeMinimizedStatus=function(e){n.client.changeMinimizedStatus(e)},this.isMinimized=function(){return n.client.isMinimized()},this.client.updateChat(this._updateChat),this.client.updateTyper(this._updateTyper),this.client.autoMessage(this._autoMessage),this.client.updateBusy(this._updateBusyQueue),this.client.addMessage(this._addMessage),this.client.chatEnded(this._chatEnded),this.client.chatEndedByOp(this._chatEndedByOp)},(bc=window.bc=window.bc||{}).SessionState={Idle:0,InitialLoading:1,PreChat:2,PreChatSending:3,ChatActive:4,ChatInactive:5,ChatEnding:6,PostChat:7,PostChatSending:8,UnavailableChat:9,UnavailableChatSending:10,Finished:11,Error:12},Object.freeze&&Object.freeze(bc.SessionState),(bc=window.bc=window.bc||{}).SessionStorage=function(e){var t,i={},a=function(){if(bc.config&&!bc.config.messageCache)return!1;try{return bc.config&&bc.config.logging&&bc.util.log("sessionStorage available: "+!!window.sessionStorage),!!window.sessionStorage}catch(e){return bc.util.log(e,!0),!1}},n=function(){if(t.lastUpdated=new Date,a())try{sessionStorage.bc=JSON.stringify(t),bc.util.log("Wrote to session storage")}catch(e){bc.util.log(e,!0)}};this.addMessage=function(e,a){var s=this._clone(a);s.MessageID=e,void 0!==i[e]?t.chat.messages[i[e]]=s:(t.chat.messages.push(s),i[e]=t.chat.messages.length-1,t.chat.lastMessageId=e),n()},this._clone=function(e){if("object"==typeof e){var t={};for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);return t}return e||{}},this.getLastMessageId=function(){return t.chat.lastMessageId},this.getMinimizedStatus=function(){return t.chat.isMinimized},this.changeMinimizedStatus=function(e){t.chat.isMinimized=e,n()},this.getMessages=function(){return t.chat.messages},this.getChatParams=function(){return t.chatParams},this.addChatParams=function(e){t.chatParams=e,n()},this.getVisitInfo=function(){return t.visitInfo},this.addVisitInfo=function(e){t.visitInfo=e,n()},this.getQueueIndicator=function(){return t.queueIndicator},this.setQueueIndicator=function(e){t.queueIndicator=e,n()},this.setBrandings=function(e){t.chat.brandings=e,n()},this.getBrandings=function(){return t.chat.brandings},this.setPeople=function(e){t.people=e,n()},this.getPeople=function(){return t.people||{}},function(){if(a()){var n;try{n=sessionStorage.bc}catch(o){bc.util.log(o)}if(n)try{t=JSON.parse(n);for(var s=0;s<t.chat.messages.length;s++)t.chat.messages[s].MessageID&&(i[t.chat.messages[s].MessageID]=s)}catch(o){bc.util.log("Failed to parse session storage: "+o),sessionStorage.removeItem("bc")}}t&&t.chat&&t.chat.chatKey===e||(t={chat:{chatKey:e,messages:[]},queueIndicator:{},chatParams:{},visitInfo:{},lastUpdated:new Date,isMinimized:"false"})}()},(bc=window.bc=window.bc||{}).util=bc.util||{},bc.util.createCookie=function(e,t,i){var a;if(void 0===e||0===e.length)return!1;if(void 0!==t&&""!==t||(i=-1),t=t||"",i){var n=new Date;n.setTime(n.getTime()+24*i*60*60*1e3),a="; expires="+n.toGMTString()}else a="";return document.cookie=encodeURIComponent(e)+"="+encodeURIComponent(t)+a+"; path=/",!0},bc.util.readCookie=function(e){var t=bc.util.readRawCookie(e);return t?decodeURIComponent(t):null},bc.util.readRawCookie=function(e){for(var t=encodeURIComponent(e)+"=",i=document.cookie.split(";"),a=0;a<i.length;a++){for(var n=i[a];" "===n.charAt(0);)n=n.substring(1,n.length);if(0===n.indexOf(t))return n.substring(t.length,n.length)}return null},bc.util.eraseCookie=function(e){return this.createCookie(e,"",-1)},bc.util.isDebugEnabled=function(){return void 0===bc.config.debug||bc.config.debug},bc.util.log=function(e,t,i){(bc.util.isDebugEnabled()||t)&&(window.console&&(i?window.console.log(e,i):window.console.log(e)),t&&window.console&&window.console.trace&&window.console.trace())},bc.util.createElement=function(e,t,i){t=t||{},i=i||"";var a=document.createElement(e);for(var n in t)t.hasOwnProperty(n)&&a.setAttribute(n,t[n]);var s=document.createTextNode(i);return a.appendChild(s),a},bc.util.getAbsPathFromRelative=function(e,t){for(var i,a,n="",s=e.pathname.replace(/[^\/]*$/,t.replace(/(\/|^)(?:\.?\/+)+/g,"$1")),o=0;(a=s.indexOf("/../",o))>-1;o=a+i)i=/^\/(?:\.\.\/)*/.exec(s.slice(a))[0].length,n=(n+s.substring(o,a)).replace(new RegExp("(?:\\/+[^\\/]*){0,"+(i-1)/3+"}$"),"/");return n+s.substr(o)},bc.util.loadJavascript=function(e,t){bc.util.log("loadJavascript");for(var i=0,a=0,n=function(){i===a&&t&&"function"==typeof t&&t()},s=function(){this.done||(bc.util.log(i+" - "+this.src),this.done=!0,i++,n())},o=function(){this.done||"complete"===this.readyState&&s()},r=function(){this.done||(this.done=!0,i++,n())},c=[],u=e.getElementsByTagName("script");u.length>0;){var l=document.createElement("script");l.setAttribute("type","text/javascript"),u[0].getAttribute("src")&&l.setAttribute("src",u[0].getAttribute("src")),bc.util.log(u[0].src+u[0].innerHTML),l.innerHTML=u[0].innerHTML,l.onload=s,l.onreadystatechange=o,l.onerror=r,u[0].parentNode.removeChild(u[0]),c.push(l)}for(var d=0;d<c.length;d++)e.appendChild(c[d]);a=c.length},bc.util.getId=function(e){var t=Math.floor(9223372037*Math.random());return(0===t?"":t)+""+Math.floor(Math.random()*(9223372036===t?854775808:1e9))},bc.util._base64={},bc.util._base64.PADCHAR="=",bc.util._base64.ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bc.util.base64=function(e){if(window.btoa)return window.btoa(e);if(1!==arguments.length)throw new SyntaxError("Not enough arguments");var t,i,a=bc.util._base64.PADCHAR,n=bc.util._base64.ALPHA,s=bc.util._getbyte,o=[],r=(e=""+e).length-e.length%3;if(0===e.length)return e;for(t=0;t<r;t+=3)i=s(e,t)<<16|s(e,t+1)<<8|s(e,t+2),o.push(n.charAt(i>>18)),o.push(n.charAt(i>>12&63)),o.push(n.charAt(i>>6&63)),o.push(n.charAt(63&i));switch(e.length-r){case 1:i=s(e,t)<<16,o.push(n.charAt(i>>18)+n.charAt(i>>12&63)+a+a);break;case 2:i=s(e,t)<<16|s(e,t+1)<<8,o.push(n.charAt(i>>18)+n.charAt(i>>12&63)+n.charAt(i>>6&63)+a)}return o.join("")},bc.util._getbyte=function(e,t){var i=e.charCodeAt(t);if(i>255)throw"Invalid byte";return i},bc.util.isNodeList=function(e){var t=Object.prototype.toString.call(e);return"object"==typeof e&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(t)&&void 0!==e.length&&(0===e.length||"object"==typeof e[0]&&e[0].nodeType>0)},bc.util.addClass=function(e,t){"use strict";if(e&&t&&t.length>0)if(bc.util.isNodeList(e))for(var i=0;i<e.length;i++)bc.util.addClass(e[i],t);else{var a=e.className;if(-1!==a.indexOf(t))return;""!==a&&(t=" "+t),e.className=a+t}},bc.util._leadingSpacesPattern=new RegExp("^\\s*","g"),bc.util.removeClass=function(e,t){"use strict";if(e)if(bc.util.isNodeList(e))for(var i=0;i<e.length;i++)bc.util.removeClass(e[i],t);else{var a=e.className,n=new RegExp("\\s?\\b"+t+"\\b","g");a=(a=a.replace(n,"")).replace(bc.util._leadingSpacesPattern,""),e.className=a}},bc.util.hasClass=function(e,t){"use strict";if(e)return(" "+e.className+" ").indexOf(" "+t+" ")>-1},bc.util.toggleVisibility=function(e,t){"use strict";if(e){var i=bc.util.isNodeList(e)?e[0]:e;if("boolean"==typeof t)return void(i.style.display=t?"":"none");i.style.display&&"none"===i.style.display?i.style.display="":i.style.display="none"}},bc.util.toggleClass=function(e,t,i,a){"use strict";if(!(a=a||!1)&&e.classList)"boolean"==typeof i?i?e.classList.contains(t)||e.classList.add(t):e.classList.contains(t)&&e.classList.remove(t):e.classList.toggle(t);else{var n=e.className.split(" "),s=n.indexOf(t);"boolean"==typeof i?i?-1===s&&n.push(t):-1!==s&&n.splice(s,1):s>=0?n.splice(s,1):n.push(t),e.className=n.join(" ")}},bc.util.closest=function(e,t){var i,a;for(["matches","webkitMatchesSelector","mozMatchesSelector","msMatchesSelector","oMatchesSelector"].some((function(e){return"function"==typeof document.body[e]&&(i=e,!0)}));null!==e;){if(null!==(a=e.parentElement)&&a[i](t))return a;e=a}return null},bc.util._forEachElement=function(e,t){if(bc.util.isNodeList(e))for(var i=0;i<e.length;i++)t(e[i]);else t(e)},bc.util.addEventListener=function(e,t,i){bc.util._forEachElement(e,(function(e){e.addEventListener(t,i)}))},bc.util.removeElement=function(e){if(bc.util.isNodeList(e))for(;e.length;)bc.util.removeElement(e[0]);else e&&e.parentNode&&e.parentNode.removeChild(e)},bc.util.getHeight=function(e){return bc.util.isNodeList(e)&&e.length>0?bc.util.getHeight(e[0]):e.getBoundingClientRect().height},bc.util.setText=function(e,t){e&&bc.util._forEachElement(e,(function(e){e.textContent=t}))},bc.util.setHtml=function(e,t){e&&bc.util._forEachElement(e,(function(e){e.innerHTML=t}))},bc.util.setAttribute=function(e,t,i){e&&bc.util._forEachElement(e,(function(e){e.setAttribute(t,i)}))},bc.util.setStyle=function(e,t,i){e&&bc.util._forEachElement(e,(function(e){e.style[t]=i}))},bc.util.checkIsIos=function(){var e,t=!1;return e=navigator.userAgent,/(iPad|iPhone|iPod)/g.test(e)&&(t=!0),t},bc.util.checkIsMobile=function(){var e,t=!1;return e=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4)))&&(t=!0),t},bc.util.msieversion=function(){var e=window.navigator.userAgent;if(e){var t=e.indexOf("MSIE ");return t>0?parseInt(e.substring(t+5,e.indexOf(".",t))):Object.hasOwnProperty.call(window,"ActiveXObject")&&!window.ActiveXObject?11:0}return 0};