var id = 'SpigotNotifier';
var oldData = [0, 0];
var messages = 0;
var notifications = 0;

function checkNotifications() {

    $('#result').load('http://www.spigotmc.org #AlertsMenu_Counter', function() {
        $('#messages').load('http://www.spigotmc.org #ConversationsMenu_Counter', function() {

            oldData[0] = notifications;
            oldData[1] = messages;

            notifications = parseInt($("#result").text().replace(/\.\.\./g, ""));
            messages = parseInt($("#messages").text().replace(/\.\.\./g, ""));

            var total = notifications + messages;

            chrome.browserAction.setBadgeText({
                text: (total == 0) ? "" : total.toString()
            });
        });
    });
}

$(document).ready(function() {
    checkNotifications();
    setInterval(function() {
        checkNotifications();
        var notification;
        if (notifications > oldData[0]) {
            notification_alert = new Notification('New Notification(s)', {
                icon: 'spigot256.png',
                body: "You've got " + notifications + " new notifications.",
            });
            notification_alert.onclick = function() {
                window.open("https://www.spigotmc.org/account/alerts");
            };
        }

        if (messages > oldData[1]) {
            notification_message = new Notification('New Message(s)', {
                icon: 'spigot256.png',
                body: "You've got " + messages + " unread messages.",
            });
            notification_message.onclick = function() {
                window.open("https://www.spigotmc.org/conversations/");
            };
        }

    }, 15000);

    $('body').on('click', 'a', function() {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });

});