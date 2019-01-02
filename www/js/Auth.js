// Auth Window Object
(function(window){
	function Auth(){
		var _self = this;
		var currentFrame = '#loginFrame';
		var lastFrame = '#loginFrame';
		var server = "http://bmg.syncstudios.net/";
		var currentVersion = "1.0";
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
					if(callback && {}.toString.call(callback) === '[object Function]'){
						callback(data);
					}else{
						console.log("Result: "+data[0]);
					}
				},
				error: function(x, t, m){
					console.log(x);
					$('#loader span').html("Looking for network...")
				},
				retryMax: 5
			});
		}

		this.checkDevice = function(uid,callback){
			var result = false;
			_self.call("checkDevice.php",uid,function(data){
				if(callback && {}.toString.call(callback) === '[object Function]'){
					callback(data);
				}
			});
		}

		this.registerDevice = function(uid,user,pin,callback){
			var args = [uid,user,pin];
			_self.call("registerDevice.php",args,function(data){
				if(callback && {}.toString.call(callback) === '[object Function]'){
					callback(data);
				}
			});
		}

		this.renewKey = function(iid,callback){
			_self.call("renewKey.php",iid,function(data){
				if(callback && {}.toString.call(callback) === '[object Function]'){
					callback(data);
				}
			});
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