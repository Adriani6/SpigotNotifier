var notificationManager = {};
var my_notids_alerts = [];
var my_notids_messages = [];
var volume, sound = undefined;

notificationManager.createNotification = function(title, message)
{
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon512.png",
        title: title,
        message: message
    }, function(notificationid) {
        if (title.startsWith("New A")) {
            my_notids_alerts.push(notificationid);
        } else {
            my_notids_messages.push(notificationid);
        }
        notificationManager.playSound(sound);
    });
}

notificationManager.updateBadge = function()
{
    var total = 0;
    chrome.storage.local.get('SNMsgCount', function(response) {
        total += response.SNMsgCount;
    });

    chrome.storage.local.get('SNAlertCount', function(response) {
        total += response.SNAlertCount;
    });
    
    chrome.browserAction.setBadgeText({
        text: (total == 0) ? "" : total.toString()
    });
}

notificationManager.playSound = function(name)
{
    audobj = new Audio("sounds/" + name);
    audobj.volume = volume / 100;
    audobj.play();
}

