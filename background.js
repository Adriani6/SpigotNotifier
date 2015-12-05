var alerts = 0;
var alerts_old = 0;
var messages = 0;
var messages_old = 0;
var my_notids_alerts = [];
var my_notids_messages = [];
var volume = undefined;
var sound = undefined;

function checkEverything() {
    $.ajax({
        url: 'https://www.spigotmc.org',
        success: function(data) {
            data = data.replace(/\"\/\//g, "\"https://");
            checkNotifications(data);
            checkProfileStats(data);
        }
    });

    chrome.storage.sync.get("volume", function(response) {
        if (response.hasOwnProperty("volume")) {
            volume = response.volume;
        } else {
            volume = 50;
        }
    });

    chrome.storage.sync.get("sound", function(response) {
        if (response.hasOwnProperty("sound")) {
            sound = response.sound;
        } else {
            sound = "Pluck 6.mp3"
        }
    });
}

function playSound(name) {
    audobj = new Audio("sounds/" + name);
    audobj.volume = volume / 100;
    audobj.play();
}

function makeNotification(title, message) {
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
        playSound(sound);
    });
}

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

function checkNotifications(data) {
    alerts_old = alerts;
    messages_old = messages;

    alerts = parseInt($(data).find("#AlertsMenu_Counter").text());
    messages = parseInt($(data).find("#ConversationsMenu_Counter").text());

    chrome.storage.local.set({
        'alerts': alerts
    });
    chrome.storage.local.set({
        'messages': messages
    });

    var total = alerts + messages;

    chrome.browserAction.setBadgeText({
        text: (total == 0) ? "" : total.toString()
    });

    if (total > 0) {
        if (alerts > alerts_old) {
            alerts_old = alerts
            makeNotification("New Alert(s)", "You've got " + alerts + " new alerts!");
        }

        if (messages > messages_old) {
            messages_old = messages;
            makeNotification("New Message(s)", "You've got " + messages + " unread messages!");
        }
    }
}

function checkProfileStats(data) {
    chrome.storage.local.set({
        'posts': $(data).find("#content").find(".stats").text().split(":")[1]
    });
    chrome.storage.local.set({
        'rating': $(data).find("#content").find(".dark_postrating_positive").text()
    });
}

setInterval(checkEverything, 15 * 1000);
setTimeout(checkEverything, 1000); // Don't ask...
chrome.browserAction.setBadgeBackgroundColor({
        "color": "#ed8106"
    }) // Set badge colour to orange
