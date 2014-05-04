angular.module("app",["ngResource","ngRoute","angular-loading-bar"]),angular.module("app").config(["$routeProvider","$locationProvider",function(a,b){"use strict";var c={user:{auth:["appAuth",function(a){return a.authorizeLoggedInUserForRoute()}]}};b.html5Mode(!0),a.when("/",{templateUrl:"/partials/pages/landingpage",controller:"appPagesCtrl"}).when("/terms",{templateUrl:"/partials/pages/terms",controller:"appPagesCtrl"}).when("/login",{templateUrl:"/partials/account/login",controller:"appLoginCtrl"}).when("/join",{templateUrl:"/partials/account/join",controller:"appJoinCtrl"}),a.when("/search",{templateUrl:"/partials/pages/home",controller:"appHomeCtrl"}).when("/:id",{templateUrl:"/partials/main/main",controller:"appMainCtrl"}).when("/account/readlater",{templateUrl:"/partials/readlater/readlater",controller:"appReadlaterCtrl",resolve:c.user}).when("/account/settings",{templateUrl:"/partials/account/settings",controller:"appSettingsCtrl",resolve:c.user})}]),angular.module("app").run(["$rootScope","$location",function(a,b){"use strict";a.$on("$routeChangeError",function(a,c,d,e){"not authorized"===e&&b.path("/")})}]),angular.module("app").factory("AppUser",["$resource","$rootScope",function(a,b){"use strict";var c=a("/api/users/:id",{_id:"@id"},{update:{method:"PUT",isArray:!1}});return c.prototype.isAdmin=function(){return this.roles&&this.roles.indexOf("admin")>-1},c.prototype.addBuzzr=function(a){-1===this.buzzrs.indexOf(a)&&(this.buzzrs.push(a),this.$update(),b.$broadcast("buzzrsChanged"))},c.prototype.removeBuzzr=function(a){var c=this.buzzrs.indexOf(a);c>-1&&(this.buzzrs.splice(c,1),this.$update(),b.$broadcast("buzzrsChanged"))},c.prototype.indexOfSavedLink=function(a){var b=-1;return this.readlater.forEach(function(c,d){c.url===a&&(b=d)}),b},c.prototype.saveLink=function(a){return this.indexOfSavedLink(a.url)>-1?(this.removeSavedLink(a.url),!1):(this.recordActivity("saved",a.url,a.topic),this.readlater.push(a),this.$update(),b.$broadcast("readlaterChanged"),!0)},c.prototype.removeSavedLink=function(a){var c=this.indexOfSavedLink(a);c>-1&&(this.readlater.splice(c,1),this.$update(),b.$broadcast("readlaterChanged"))},c.prototype.removeLink=function(a,c){this.recordActivity("removed",a,c),this.$update(),b.$broadcast("removedLink")},c.prototype.trackView=function(a,b){this.recordActivity("viewed",a,b),this.$update()},c.prototype.trackShare=function(a,b){this.recordActivity("shared",a,b),this.$update()},c.prototype.recordActivity=function(a,b,c){var d=-1;this.activities.forEach(function(a,b){a.topic===c&&(d=b)}),-1===d&&(this.activities.push({topic:c,removed:[],viewed:[],saved:[],shared:[]}),d=0),this.activities[d][a].push(b)},c}]),angular.module("app").factory("appAuth",["$http","$q","appIdentity","AppUser",function(a,b,c,d){"use strict";return{authenticateUser:function(e,f){var g=b.defer();return a.post("/login",{email:e,password:f}).then(function(a){if(a.data.success){var b=new d;angular.extend(b,a.data.user),c.currentUser=b,g.resolve(!0)}else g.resolve(!1)}),g.promise},createUser:function(a){var e=new d(a),f=b.defer();return e.$save().then(function(){c.currentUser=e,f.resolve(!0)},function(a){f.reject(a.data.reason)}),f.promise},updateCurrentUser:function(a){var d=b.defer();return a.$update().then(function(){c.currentUser=a,d.resolve(!0)},function(a){d.reject(a.data.reason)}),d.promise},logoutUser:function(){var d=b.defer();return a.post("/logout",{logout:!0}).then(function(){c.currentUser=void 0,d.resolve(!0)}),d.promise},authorizeCurrentUserForRoute:function(){return c.isAuthorized("admin")?!0:b.reject("not authorized")},authorizeLoggedInUserForRoute:function(){return c.isAuthenticated()?!0:b.reject("not authorized")}}}]),angular.module("app").factory("appIdentity",["$window","AppUser",function(a,b){"use strict";var c;return a.bootstrappedUser&&(c=new b,angular.extend(c,a.bootstrappedUser)),{currentUser:c,isAuthenticated:function(){return!!this.currentUser},isAuthorized:function(a){return!!this.currentUser&&this.currentUser.roles.indexOf(a)>-1}}}]),angular.module("app").controller("appJoinCtrl",["$scope","$location","appIdentity","appAuth","appNotifier",function(a,b,c,d,e){"use strict";a.signup=function(){var c={email:a.email,password:a.password};d.createUser(c).then(function(){b.path("/search")},function(b){e.error(b,a)})}}]),angular.module("app").controller("appLoginCtrl",["$scope","$location","appAuth","appNotifier",function(a,b,c,d){"use strict";a.signin=function(){c.authenticateUser(a.email,a.password).then(function(c){c?b.path("/search"):d.error("email/password combination incorrect",a)})}}]),angular.module("app").controller("appSettingsCtrl",["$scope","$location","$http","appAuth","appIdentity","appNotifier",function(a,b,c,d,e,f){"use strict";a.currentUser=angular.copy(e.currentUser),a.email={valid:e.currentUser.email.match(/^[\S]+@[\S]+\.[\S]+$/)},a.email.valid||(a.currentUser.email=""),a.update=function(){d.updateCurrentUser(a.currentUser).then(function(){return a.email.valid?void f.notify("Your account has been updated",a):b.path("/search")},function(b){f.error(b,a)})}}]),angular.module("app").controller("appAdminBuzzrsCtrl",["$scope","$http","$window",function(a,b,c){"use strict";a.buzzrs=[],b.get("/api/buzzrs").then(function(b){b.data.buzzrs?a.buzzrs=b.data.buzzrs:c.alert("$http error")})}]),angular.module("app").controller("appAdminErrorsCtrl",["$scope","$http","$window",function(a,b,c){"use strict";a.socketErrors=[],a.titleErrors=[],b.get("/api/errors").then(function(b){b.data.titleErrors?(a.socketErrors=b.data.socketErrors,a.titleErrors=b.data.titleErrors):c.alert("$http error")})}]),angular.module("app").controller("appAdminUsersCtrl",["$scope","AppUser",function(a,b){"use strict";a.users=b.query()}]),function(){"use strict";angular.module("angular-loading-bar",["chieffancypants.loadingBar"]),angular.module("chieffancypants.loadingBar",[]).config(["$httpProvider",function(a){var b=["$q","$cacheFactory","$timeout","$rootScope","cfpLoadingBar",function(b,c,d,e,f){function g(){d.cancel(i),f.complete(),k=0,j=0}function h(b){var d,e=a.defaults;if("GET"!==b.method||b.cache===!1)return b.cached=!1,!1;d=b.cache===!0&&void 0===e.cache?c.get("$http"):void 0!==e.cache?e.cache:b.cache;var f=void 0!==d?void 0!==d.get(b.url):!1;return void 0!==b.cached&&f!==b.cached?b.cached:(b.cached=f,f)}var i,j=0,k=0,l=f.latencyThreshold;return{request:function(a){return a.ignoreLoadingBar||h(a)||(e.$broadcast("cfpLoadingBar:loading",{url:a.url}),0===j&&(i=d(function(){f.start()},l)),j++,f.set(k/j)),a},response:function(a){return h(a.config)||(k++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url}),k>=j?g():f.set(k/j)),a},responseError:function(a){return h(a.config)||(k++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url}),k>=j?g():f.set(k/j)),b.reject(a)}}}];a.interceptors.push(b)}]).provider("cfpLoadingBar",function(){this.includeSpinner=!0,this.includeBar=!0,this.latencyThreshold=100,this.startSize=.02,this.parentSelector="body",this.$get=["$document","$timeout","$animate","$rootScope",function(a,b,c,d){function e(){b.cancel(k),q||(d.$broadcast("cfpLoadingBar:started"),q=!0,t&&c.enter(n,m),s&&c.enter(p,m),f(u))}function f(a){if(q){var c=100*a+"%";o.css("width",c),r=a,b.cancel(j),j=b(function(){g()},250)}}function g(){if(!(h()>=1)){var a=0,b=h();a=b>=0&&.25>b?(3*Math.random()+3)/100:b>=.25&&.65>b?3*Math.random()/100:b>=.65&&.9>b?2*Math.random()/100:b>=.9&&.99>b?.005:0;var c=h()+a;f(c)}}function h(){return r}function i(){d.$broadcast("cfpLoadingBar:completed"),f(1),k=b(function(){c.leave(n,function(){r=0,q=!1}),c.leave(p)},500)}var j,k,l=this.parentSelector,m=a.find(l),n=angular.element('<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>'),o=n.find("div").eq(0),p=angular.element('<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>'),q=!1,r=0,s=this.includeSpinner,t=this.includeBar,u=this.startSize;return{start:e,set:f,status:h,inc:g,complete:i,includeSpinner:this.includeSpinner,latencyThreshold:this.latencyThreshold,parentSelector:this.parentSelector,startSize:this.startSize}}]})}(),angular.module("app").factory("appIsMobile",function(){"use strict";var a={Android:function(){return navigator.userAgent.match(/Android/i)?!0:!1},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry/i)?!0:!1},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)?!0:!1},Windows:function(){return navigator.userAgent.match(/IEMobile/i)?!0:!1},any:function(){return a.Android()||a.BlackBerry()||a.iOS()||a.Windows()}};return a}),angular.module("app").factory("appNotifier",function(){"use strict";return{notify:function(a,b){b.notifier={},b.notifier.notice=a,setTimeout(function(){b.notifier.notice="",b.$digest()},4e3)},error:function(a,b){b.notifier={},b.notifier.error=a,setTimeout(function(){b.notifier.error="",b.$digest()},4e3)}}}),angular.module("app").factory("appTopics",["$window",function(a){"use strict";var b=[];return a.bootstrappedTopics&&(b=a.bootstrappedTopics),b}]),String.prototype.trunc=function(a){"use strict";return this.length>a?this.substr(0,a-1)+"...":this},angular.module("app").factory("appFeedback",["$rootScope",function(a){"use strict";return{toggle:function(){a.$broadcast("toggleFeedback")}}}]),angular.module("app").controller("appFeedbackCtrl",["$scope","$location","$window","$http","appIdentity","appNotifier",function(a,b,c,d,e,f){"use strict";a.success=!1,a.show=!1,a.feedback={},a.feedback.userAgent=c.navigator.userAgent,e.isAuthenticated()&&(a.feedback.name=e.currentUser.name,a.feedback.email=e.currentUser.email),a.send=function(){a.feedback.currentPath=b.path(),d.post("/api/feedback",a.feedback).then(function(b){b.data.success?a.success=!0:f.error(b.data.err||"unknown error",a)},function(b){f.error("error "+b.status+" occurred - please email help@buzzr.io",a)})},a.toggle=function(){a.show=!a.show},a.$on("toggleFeedback",function(){a.toggle()})}]),angular.module("app").controller("appHeaderCtrl",["$scope","$rootScope","$location","appIdentity","appSidebar",function(a,b,c,d,e){"use strict";a.isLoggedIn=function(){return d.isAuthenticated()},a.toggleSidebar=function(){e.toggle()},b.$on("toggleSidebar",function(){a.open=!a.open,a.$$phase||a.$digest()}),a.showLogo=function(){var a=["/","/search","/login","/about","/join","/terms"];return-1===a.indexOf(c.path())}}]),angular.module("app").factory("appBuzzr",["$http","$route","appProcessLinks",function(a,b,c){"use strict";function d(a){a.errorMessage="Oh no, Buzzr did not find anything recent on this topic :( Please come back later and try again!",a.status="error"}function e(a){var c=setInterval(function(){a.$apply(function(){a.countDown-=1,a.countDown<=0&&(a.countDown=0,b.reload(),clearInterval(c))})},1e3)}function f(a,b){a.errorMessage=b,a.links=[],a.status="error"}var g={};return g.updateFeed=function(b){a.get("/api/buzzrs/refresh/"+b.searchText.trim()).then(function(a){var g=a.data.links;return a.data.err?void f(b,a.data.err):a.data.updating?(b.status="updating",void e(b)):0===g.length?d(b):(c.process(b,g),void(b.status="feeding"))},function(){f(b,"Sorry, something went wrong! Please try again!")})},g.startFeed=function(b){a.get("/api/buzzrs/"+b.searchText.trim()).then(function(a){var g=a.data.links;if(a.data.err)return void f(b,a.data.err);if(g){if(0===g.length)return d(b);c.process(b,g),b.status="feeding"}else b.status="creating",e(b)},function(){f(b,"Sorry, something went wrong! Please try again!")})},g}]),angular.module("app").controller("appMainCtrl",["$scope","$routeParams","$location","appIdentity","appProcessLinks","appSidebar","appFeedback","appBuzzr",function(a,b,c,d,e,f,g,h){"use strict";a.countDown=18,a.links=[],a.dates=[],a.lang="",a.identity=d,a.searchText=decodeURI(b.id).toLowerCase(),a.status="searching",a.checkStatus=function(b){return a.status===b},a.encode=function(a){return encodeURI(a)},a.newSearch=function(a){if(a){var b=a.toLowerCase().trim();c.path("/"+b)}},a.toggleSidebar=function(){f.toggle()},a.toggleFeedback=function(){g.toggle()},a.getLang=function(b){return a.lang===b},a.triggerSearch=function(){h.startFeed(a)},a.loadMore=function(){a.status="searching",h.updateFeed(a)},a.showLoading=function(){return a.checkStatus("searching")||a.checkStatus("creating")||a.checkStatus("updating")?!0:!1},d.isAuthenticated()&&(d.currentUser&&d.currentUser.addBuzzr(a.searchText),a.saveLink=function(b){e.saveLink(b,a.searchText)},a.removeLink=function(b){e.removeLink(b,a.searchText)},a.trackView=function(b){d.currentUser.trackView(b,a.searchText)},a.trackShare=function(b){d.currentUser.trackShare(b,a.searchText)}),a.triggerSearch()}]),angular.module("app").factory("appProcessLinks",["appIdentity",function(a){"use strict";function b(a){a.activated&&(a.activated=new Date(a.activated).toLocaleDateString(),h[a.activated]=!0)}function c(a){a.domain=a.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1].toLowerCase().replace("www.","")}function d(){var a=[];for(var b in h)h.hasOwnProperty(b)&&a.push(b);return a.reverse()}function e(a){a.removed=!1,i.indexOf(a.url)>-1&&(a.removed=!0)}function f(a){a.saved=!1,j.indexOf(a.url)>-1&&(a.saved=!0)}function g(a){b(a),c(a),f(a),e(a)}var h={},i=[],j=[];return{process:function(b,c){a.isAuthenticated()&&(a.currentUser.readlater.forEach(function(a){j.push(a.url)}),a.currentUser.activities.forEach(function(a){a.topic===b.searchText&&(i=a.removed)})),c.splice(5,1),c.forEach(g),b.dates=d(),b.links=c},saveLink:function(b,c){var d={url:b.url,title:b.title,topic:c,activated:Date.now()};b.saved=a.currentUser.saveLink(d)},removeLink:function(b,c){a.currentUser.removeLink(b.url,c),b.removed=!0}}}]),angular.module("app").controller("appHomeCtrl",["$scope","$location","$document","appIdentity","appSidebar","appIsMobile",function(a,b,c,d,e,f){"use strict";if(a.identity=d,a.search=function(){a.searchText&&b.path("/"+a.searchText.trim())},d.isAuthenticated()&&(d.currentUser.email.match(/^[\S]+@[\S]+\.[\S]+$/)||b.path("account/settings")),!f.any()){var g=c[0].getElementById("focus");g.focus()}}]),angular.module("app").controller("appPagesCtrl",["$scope","$http","$location","appFeedback",function(a,b,c,d){"use strict";a.toggleFeedback=function(){d.toggle()},a.toggleVideo=function(){a.showVideo=!a.showVideo}}]),angular.module("app").controller("appReadlaterCtrl",["$scope","appFeedback","appSidebar","appIdentity",function(a,b,c,d){"use strict";a.readlater=d.currentUser.readlater||[],a.empty=function(){return 0===a.readlater.length},a.toggleFeedback=function(){b.toggle()},a.removeLink=function(a){d.currentUser.removeSavedLink(a)},a.$on("readlaterChanged",function(){a.readlater=d.currentUser.readlater})}]),angular.module("app").factory("appSidebar",["$rootScope",function(a){"use strict";var b={};return b.toggle=function(){a.$emit("toggleSidebar")},b}]),angular.module("app").controller("appSidebarCtrl",["$scope","$rootScope","appSidebar","$location","$document","appAuth","appNotifier","appIdentity",function(a,b,c,d,e,f,g,h){"use strict";function i(){a.open&&c.toggle()}var j=angular.element(document.querySelector(".blackout"));a.identity=h,a.setBuzzrs=function(){h.isAuthenticated()&&(a.buzzrs=h.currentUser.buzzrs)},a.encode=function(a){return encodeURI(a)},a.signout=function(){f.logoutUser().then(function(){d.path("/")})},a.removeBuzzr=function(a){h.currentUser.removeBuzzr(a)},a.toggleOpen=function(){j.toggleClass("on"),a.open=!a.open,a.open&&(e.one("click",i),e.one("touch",i)),a.$$phase||a.$digest()},b.$on("toggleSidebar",function(){a.setBuzzrs(),a.toggleOpen()}),a.$on("buzzrsChanged",function(){a.setBuzzrs()}),a.setBuzzrs()}]);