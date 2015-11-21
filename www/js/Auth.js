// Auth Window Object
(function(window){
	function Auth(){
		var _self = this;
		var currentFrame = '#loginFrame';
		var lastFrame = '#loginFrame';
		var server = "http://bmg.x10host.com/";
		var currentVersion = "0.9";
		var frameWidth = 0;

		init();
		function init(){
			if(!window.jQuery){
				throw new Error("jQuery Required");
			}
		}

		this.call = function(location,args,callback){
			if(args == 'undefined' || args == false || args == "" || args == null) args = [];
			$.ajax({
				type: "GET",
				url: url(location,args),
				dataType: "jsonp",
				timeout: 3000,
				success: function(data){
					if(data !== false){
						if(data[0] == "error"){
							console.log('error: '+data[1]);
						}else{
							if(callback && {}.toString.call(callback) === '[object Function]'){
								callback(data);
							}else{
								console.log("Result: "+data[0]);
							}
						}
					}
				},
				error: function(x, t, m){
					console.log(x);
				},
				retryMax: 5
			});
		}

		this.changeFrame = function(elem, instant){
			if(elem == 'last') elem = lastFrame;
			var pos = $('.frame').index($(elem)) * frameWidth;
			if(elem == currentFrame || instant == true){
				$('#frameWrapper').css('marginLeft','-'+pos+'px');
			}else{
				$('#frameWrapper').animate({marginLeft:'-'+pos+'px'},500,function(){
					$(window).trigger('framechanged',[elem]);
				});
			}
			lastFrame = currentFrame;
			currentFrame = elem;
		}

		this.isLoggedIn = function(callback){
			var result = false;
			_self.call("isLoggedIn.php",false,function(data){
				if(data[0] == "bad"){
					result = false;
				}else{
					result = true;
				}
				if(callback && {}.toString.call(callback) === '[object Function]'){
					callback(result);
				}
			});
		}

		this.refreshScreen = function(){
			var h = $(window).height();
			var w = $(window).width();
			frameWidth = w;
			$('#frameWrapper').css('width',$('#frameWrapper td').length*w+'px');
			$('#frameWrapper tr').css({height:h});
			$('#frameWrapper td').css({height:h,width:w});
			_self.changeFrame(currentFrame);
		}

		this.updateVersion = function(){
			var arr = [currentVersion];
			_self.call("version.php",arr,function(data){
				$('#version > span').html(data[0]);
			});
		}

		function parseTime(s){
			var minutes = Math.floor(s/60).toString();
			var seconds = (s%60).toString();
			if(seconds.length < 2) seconds = "0"+seconds;
			return minutes+":"+seconds;
		}

		function url(url,args){
			var append = "";
			if($.isArray(args)){
				for(var i=0;i<args.length;i++) append += "arg"+i+"="+args[i]+"&";
			}else{
				append = "arg0="+args+"&";
			}
			return server+url+"?"+append+"callback=?";
		}
	}
	window.Auth = new Auth();
})(window);