$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
	if( !originalOptions.retryMax || !originalOptions.retryMax >=2 ) return;
	if( !originalOptions.timeout >0 ) return;
	if( originalOptions.retryCount ) {
		originalOptions.retryCount++;
		if(originalOptions.retryCount == originalOptions.retryMax) $('#loader').html("Connection Failed.");
	}else{
		originalOptions.retryCount = 1;
		originalOptions._error = originalOptions.error;
	};

	options.error = function( _jqXHR, _textStatus, _errorThrown ){
	if( originalOptions.retryCount >= originalOptions.retryMax || _textStatus!='timeout' ){
		if( originalOptions._error ) originalOptions._error( _jqXHR, _textStatus, _errorThrown );
		return;
	}
		$.ajax( originalOptions);
	}
});

// $(document).ready(function(){
// 	// For browser testing
// 	if(typeof device == 'undefined'){
// 		$(document).trigger('deviceready');
// 	}
// });

$(document).on('deviceready',function(){
	navigator.splashscreen.hide();
	window.isSubmitting = false;
	window.uuid = 1234;
	if(typeof device !== 'undefined'){
		window.uuid = device.uuid;
	}
	// INIT
	Auth.updateVersion();
	var loader = $('#loader');
	var loaderContent = $('#loader span');
	loaderContent.html("Checking Device...")
	Auth.checkDevice(window.uuid,function(data){
		if(typeof data === 'undefined' || data == false){
			loader.html("Invalid server response.");
		}else if(data[0] == "error"){
			loader.html(data[1]);
		}else if(data[0] == "404"){
			loader.hide();
			$('#content').fadeIn(400).animate({'height': '400px'},'slow','easeOutCubic', function(){
				$('#newUserContent').fadeIn('fast');
			});
		}else{
			loader.hide();
			window.user_id = data[0].id;
			$('#userFill').html(data[0].username);
			$('#content').fadeIn(400).animate({'height': '400px'},'slow','easeOutCubic', function(){
				$('#keyContent').fadeIn('fast',function(){
					newKey();					
				});
			});
		}
	});

	function keyTimer(){
		var t = setInterval(function(){
			var num = $('#seconds').html();
			var newNum = parseInt(num);
			newNum--;
			$('#seconds').html(newNum);
			console.log(newNum);
			if(newNum < 0){
				newKey();
				$('#seconds').html(20);
				clearInterval(t);
			}
		},1000);
	}

	function newKey(){
		$('#key').val('');
		$('#key').attr('style','background: rgba(255,255,255,0.2) url("./images/loadingCircle.gif") no-repeat center center / 20px 20px');
		Auth.renewKey(window.user_id,function(d){
			if(typeof d === 'undefined' || d == false){
				$('#key').val("Invalid server response.");
			}else if(d[0] == "error"){
				$('#key').val(d[1]);
			}else{
				$('#key').val(d[0]);
			}
			$('#key').css('background','');
			keyTimer();
		});
	}

	$('#newUserSubmit').click(function(){
		if(window.isSubmitting == true) return;
		window.isSubmitting = true;
		var u = $('#username').val();
		var p = $('#pin').val();
		if(p < 0 || p > 9999){
			$('#pin').css('borderColor','#990000');
			return;
		}
		$('#newUserContent').fadeOut('fast');
		$('#content').animate({'height':'3px'},'slow','easeOutCubic', function(){
			$(this).fadeOut(400, function(){
				loader.show();
				loaderContent.html('Registering Device...');
			});
		});
		Auth.registerDevice(window.uuid,u,p,function(data){
			window.isSubmitting = false;
			if(typeof data === 'undefined' || data == false){
				loader.html("Invalid server response.");
			}else if(data[0] == "error"){
				loader.html(data[1]+" App restarting in 3s.");
				setTimeout(function(){
					document.location.reload(true);
				},5000);
			}else{
				loader.html("Device registered. App restarting in 3s.");
				setTimeout(function(){
					document.location.reload(true);
				},5000);
			}

		});
	});
	// // LOGIN
	// $('#loginError').html("<img src='./images/loadingCircle.gif' style='width: 20px;height:20px;vertical-align:bottom;' />");
	// $('#loginSubmit,#user,#pass').attr('disabled','disabled');
	// Auth.isLoggedIn(function(data){
	// 	$('#loginError').html("");
	// 	$('#loginSubmit,#user,#pass').attr('disabled',false);
	// 	if(data == true){
	// 		Auth.changeFrame('#menuFrame');
	// 	}else{
	// 		if(data == "There was a problem connecting to the database."){
	// 			$('#loginError').html('Bad Connection');
	// 		}
	// 		$('#loginForm').submit(function(e){
	// 			e.preventDefault();
	// 		});
	// 		$('#loginSubmit').on('click',function(){
	// 			$('#loginError').html("<img src='./images/loadingCircle.gif' style='width: 20px;height:20px;vertical-align:bottom;' />");
	// 			$('#loginSubmit').attr('disabled','disabled');
	// 			var user = $('#user').val();
	// 			var pass = $('#pass').val();
	// 			if(user != "" && pass != ""){
	// 				var args = [user,pass];
	// 				Auth.call("login.php",args,function(data){
	// 					if(data[0] == "bad"){
	// 						$('#loginError').html(data[1]);
	// 					}else{
	// 						$('#loginError').css('color','#008000').html("Login successful");
	// 						Auth.changeFrame('#menuFrame');
	// 					}
	// 					$('#loginSubmit').attr('disabled',false);
	// 				});
	// 			}else{
	// 				$('#loginError').html('Invalid Login');
	// 				$('#loginSubmit').attr('disabled',false);
	// 			}
	// 		});
	// 	}
	// });
});

/** EVENTS / TRIGGERS **/

$(window).on('orientationchange',function(){
	Auth.refreshScreen();
});

/** UTILITY FUNCTIONS **/

function waitOn(elem,ev,callback){
	if(ev === 'undefined') ev = 'click';
	$(elem).on(ev,function(){
		if(callback && {}.toString.call(callback) === '[object Function]'){
			$(this).off(ev);
			callback();
		}
	});
}