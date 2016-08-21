var notificationManager = {};
var my_notids_alerts = [];
var my_notids_messages = [];

notificationManager.createNotification = function(title, message)
{
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon512.png",
        title: title,
        message: message
    }, function(notificationid) {
        my_notids_alerts.push(notificationid);
    });
}

notificationManager.updateBadge = function()
{
    var total = parseInt(SpigotNotifier.getAlertCount()) + parseInt(SpigotNotifier.getMessagesCount());

    chrome.browserAction.setBadgeText({
        text: (total == 0) ? "" : total.toString()
    });
}