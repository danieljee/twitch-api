var channelDetails = new Object();
var myClass = class {
	constructor(usernames){
		this.usernames = usernames;
		usernames.forEach(function(name){
			channelDetails[name] = new Object();
		})
	}
	getData(){		
		this.usernames.forEach(function(name){
			JSONP("https://wind-bow.glitch.me/twitch-api/channels/" + name, function(data){
				channelDetails[name].display_name = data.display_name;
				channelDetails[name].logo = data.logo;
				channelDetails[name].url = data.url;
				JSONP("https://wind-bow.glitch.me/twitch-api/streams/" + name, function(data){			
					if (data.stream != null){
						channelDetails[name].online = "online";
						channelDetails[name].status = data.stream.channel.status;
					} else {
						channelDetails[name].online = "offline";
						channelDetails[name].status = "";
					}	
					displayEach(name);
				});		
			});	
		});
	}
}

function JSONP(url, callback){
	var p = new Promise(function(resolve,reject){
		var callback_name = "json_callback" + Math.floor(Math.random() * 100000 + 1);
		window[callback_name] = function(data){
			delete window[callback_name];
			document.body.removeChild(script);
			callback(data);
		}
		var script = document.createElement("script");
		script.src = url + "?callback=" + callback_name;
		document.body.appendChild(script);
	});
	
	return p;
}

document.addEventListener("DOMContentLoaded", function(){
	var tabs = document.getElementsByClassName("nav-link");
	for(var i=0; i<tabs.length; i++){
		tabs[i].addEventListener("click", tabClicked);
	}
	
	var usernames = ["cretetion", "ESL_SC2", "OgamingSC2", "freecodecamp", "noobs2ninjas", "habathcx", "RobotCaleb"];
	var test = new myClass(usernames);
	test.getData();
	Promise.all(promises).then(function(){
		displayAll();
	});
})

function tabClicked(tab){
	document.getElementsByClassName("active")[0].classList.remove("active");
	this.classList.add("active");
	if(this.innerHTML === "All"){
		displayAll();
	} else if (this.innerHTML === "Online"){
		displayOnline();
	} else if (this.innerHTML === "Offline"){
		displayOffline();
	}
}

function displayEach(channel){
	var div = document.getElementById("channels");
	
	var html = "<div class='row "+channelDetails[channel].online+"' style='position:relative; margin:5px 0; height:50px; padding: 5px 0;'>" +
	"<div class='col-xs-3 col-sm-2'><img class='rounded-circle h-100' src='"+channelDetails[channel].logo+"'></div>"+
	"<div class='col-xs-10 col-sm-2'><p>"+channelDetails[channel].display_name+"</p></div>"+
	"<div class='col-xs-10 col-sm-8' style='overflow:hidden;'><p>"+channelDetails[channel].status+"</p></div>"+
	"<a target='_block' href='"+channelDetails[channel].url+"' style='position:absolute; top:0; bottom:0; left:0; right:0;'>"+
	"</div>";
	channelDetails[channel].online === "online"? div.insertAdjacentHTML("afterbegin", html): div.insertAdjacentHTML("beforeend",html);
}

function displayAll(){
	var online = document.getElementsByClassName("online");
	for(var i=0; i< online.length; i++){
		online[i].classList.remove("hidden");
	}
	var offline = document.getElementsByClassName("offline");
	for(var i=0; i< offline.length; i++){
		offline[i].classList.remove("hidden");
	}
}

function displayOnline(){
	var online = document.getElementsByClassName("online");
	for(var i=0; i< online.length; i++){
		online[i].classList.remove("hidden");
	}
	var offline = document.getElementsByClassName("offline");
	for(var i=0; i< offline.length; i++){
		offline[i].classList.add("hidden");
	}
}

function displayOffline(){
	var online = document.getElementsByClassName("online");
	for(var i=0; i< online.length; i++){
		online[i].classList.add("hidden");
	}
	var offline = document.getElementsByClassName("offline");
	for(var i=0; i< offline.length; i++){
		offline[i].classList.remove("hidden");
	}
}


