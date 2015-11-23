var id = 'SpigotNotifier';
var oldData = [0, 0];
var messages = 0;
var notifications = 0;

function checkNotifications(){
	
	$('#result').load('http://www.spigotmc.org #AlertsMenu_Counter', function(){
		$('#messages').load('http://www.spigotmc.org #ConversationsMenu_Counter', function(){
			
			oldData[0] = notifications;
			oldData[1] = messages;
		
			notifications = $("#result").text().replace(/\s/g, "");
			messages = $("#messages").text().replace(/\s/g, "");

			var total = parseInt(notifications) + parseInt(messages);
	
			chrome.browserAction.setBadgeText({text: total.toString()});
		});
	});
}
	
$(document).ready(function(){
	checkNotifications();
	setInterval(function(){ 
		checkNotifications();
		var notification;
		if(notifications > oldData[0]){
			notification = new Notification('New Notification(s)', {
			icon: 'spigot.png',
			body: "You've got " + notifications + " new notifications.",
			});
		}
		
		if(messages > oldData[1]){
			notification = new Notification('New Message(s)', {
			icon: 'spigot.png',
			body: "You've got " + messages + " unread messages.",
			});
		}
		
	notification.onclick = function () {
		window.open("http://www.spigotmc.org");      
    };
	
	}, 15000);
	
	$('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
	
});