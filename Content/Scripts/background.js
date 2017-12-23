/**
 * @file 
 * background.js
 *
 * Implementation of SN Manager for background tasks
 * and attaching default Chrome events for notification management.
 * 
 * @author
 * Adrian Iwaszkiewicz (Adriani6)
 * @version
 * 2.0
 * 
 */

$(document).ready(function()
{
	Manager.Start();
	
});

chrome.notifications.onClicked.addListener(function(notificationid) {

	var type = Manager.GetNotificationType(notificationid);

	if (type == 2) {
		Manager.RemoveAlertNotification();
		chrome.notifications.clear(notificationid);
		window.open("https://www.spigotmc.org/account/alerts");
	} else if (type == 1) {
		Manager.RemoveMessageNotification();
		chrome.notifications.clear(notificationid);
		window.open("https://www.spigotmc.org/conversations/");
	}

});

chrome.notifications.onClosed.addListener(function(notificationid, byuser) {

	var type = Manager.GetNotificationType(notificationid);

    if (type == 2) {
        Manager.RemoveAlertNotification();
    } else if (type == 1) {
		Manager.RemoveMessageNotification();
    }
});

// 23/12/2017