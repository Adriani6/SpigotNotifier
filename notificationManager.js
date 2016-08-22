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

notificationManager.updateBadge = function(total)
{
    var storageTotal = 0;

    chrome.storage.local.get('SNAlertCount', function(response) {
        storageTotal += response.SNAlertCount;
    });

    if(total != undefined){
        if(total > storageTotal){
            chrome.browserAction.setBadgeText({
                text: (total == 0) ? "" : total.toString()
            });
        }else{
            chrome.browserAction.setBadgeText({
                text: (storageTotal == 0) ? "" : storageTotal.toString()
            });
        }  
    } 
    
}

notificationManager.playSound = function(name)
{
    audobj = new Audio("sounds/" + name);
    audobj.volume = volume / 100;
    audobj.play();
}

