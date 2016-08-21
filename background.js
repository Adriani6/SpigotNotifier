$(document).ready(function()
{
	SpigotNotifier.init();
    

chrome.webNavigation.onCompleted.addListener(function(details) {
        var alertc = parseInt(SpigotNotifier.getAlertCount());
        var msgc = parseInt(SpigotNotifier.getMessagesCount());


        chrome.tabs.executeScript(details.tabId, {
            code:   'if('+alertc+' > 0){'+
                    '$("#AlertsMenu_Counter").removeClass("Zero");'+
                    '$("#AlertsMenu_Counter span.Total").text('+alertc+');}'+
                    'if('+msgc+' > 0){'+
                    '$("#ConversationsMenu_Counter").removeClass("Zero");'+
                    '$("#ConversationsMenu_Counter span.Total").text('+msgc+');}'
        });

        SpigotNotifier.resetCounters();
    }, {
        url: [{
            hostContains: '.spigotmc.'
        }]
    });

    
});

chrome.notifications.onClosed.addListener(function(notificationid, byuser) {
    if (my_notids_alerts.indexOf(notificationid) > -1) {
        my_notids_alerts.pop(notificationid);
    } else if (my_notids_messages.indexOf(notificationid) > -1) {
        my_notids_messages.pop(notificationid);
    }
});

chrome.notifications.onClicked.addListener(function(notificationid) {
    if (my_notids_alerts.indexOf(notificationid) > -1) {
        my_notids_alerts.pop(notificationid);
        chrome.notifications.clear(notificationid);
        window.open("https://www.spigotmc.org/account/alerts");
    } else if (my_notids_messages.indexOf(notificationid) > -1) {
        my_notids_messages.pop(notificationid);
        chrome.notifications.clear(notificationid);
        window.open("https://www.spigotmc.org/conversations/");
    }
});
