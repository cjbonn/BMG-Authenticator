$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
	if( !originalOptions.retryMax || !originalOptions.retryMax >=2 ) return;
	if( !originalOptions.timeout >0 ) return;
	if( originalOptions.retryCount ) {
		originalOptions.retryCount++;
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

$(document).on('deviceready ready',function(){
	//var uuid = device.uuid;
	var uuid = 1234;
	// INIT
	Auth.refreshScreen();
	Auth.updateVersion();
	// Auth.checkDevice();
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