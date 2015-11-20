function checkNotifications(){
	
	$('#result').load('http://www.spigotmc.org #AlertsMenu_Counter', function(){
	$('#messages').load('http://www.spigotmc.org #ConversationsMenu_Counter');
	var notifications = $("#result").text().replace(/\s/g, "");
	var messages = $("messages").text().replace(/\s/g, "");
	
	var total = Number(notifications) + Number(messages);
	
		chrome.browserAction.setBadgeText({text: total.toString()});

	});
}
	
$(document).ready(function(){
	checkNotifications();
	setInterval(function(){ 
		checkNotifications();
	}, 30000);
});