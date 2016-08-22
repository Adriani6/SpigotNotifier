$(document).ready(function()
{
	SpigotNotifier.init();
    

chrome.webNavigation.onCompleted.addListener(function(details) {
        var msgc = parseInt(SpigotNotifier.getMessagesCount());
        var alerts = parseInt(localStorage.getItem("TemporaryAlertsCounter"));

        chrome.tabs.executeScript(details.tabId, {
            code:   'if('+alerts+' > 0){'+
                    '$("#AlertsMenu_Counter").removeClass("Zero");'+
                    '$("#AlertsMenu_Counter span.Total").text('+alerts+');}'+
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
