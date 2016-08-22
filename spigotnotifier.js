var SpigotNotifier = {};

SpigotNotifier.init = function()
{
    SpigotNotifier.resetCounters();
    SpigotNotifier.checkData();
    notificationManager.updateBadge();

    setInterval(function(){ 
        SpigotNotifier.checkData(); 
    }, 120000);
    
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

SpigotNotifier.getForumData = function()
{
    return $.ajax({
        url: 'https://www.spigotmc.org'
    });	
}

SpigotNotifier.getAlertsData = function()
{
    return $.ajax({
        url: 'https://www.spigotmc.org/account/alerts'
    });	
}

SpigotNotifier.getMessagesData = function()
{
    
}

SpigotNotifier.checkData = function()
{
    
    var promise = SpigotNotifier.getForumData();

    promise.success(function(data){
        var alerts, messages = undefined;

        alerts = parseInt($(data).find("#AlertsMenu_Counter").text());
        messages = parseInt($(data).find("#ConversationsMenu_Counter").text());

        SpigotNotifier.updateProfileStats(data);

        if(alerts > 0)
        {
            var alertpromise = SpigotNotifier.getAlertsData();
            alertpromise.success(function(alertData){
                var newData = $(alertData).find(".alertsScroller").html();
                var lastAlertID = SpigotNotifier.getLastAlertID();
                var topID = 0;
		        $(newData).find('.primaryContent').each(function(){
                    if($(this).find(".newItem").length > 0){
                        var subject = $(this).find("h3").text();

                        notificationManager.createNotification("New Alert!", subject);
                        SpigotNotifier.setAlertCount(1); 
                        notificationManager.updateBadge();
                    }
		        });
                //SpigotNotifier.updateLastAlertID(topID);
            });

            alertpromise.error(function(){
                console.log("Couldn't get data");
            })
        }
        
        if(messages > 0)
        {
            //var messagepromise = SpigotNotifier.getMessagesData();
            notificationManager.createNotification("New Message!", "You have received a new Message.");
            SpigotNotifier.setMessageCount(1);
            notificationManager.updateBadge();
        }
    })
}

SpigotNotifier.setMessageCount = function(c)
{
    var count = parseInt(SpigotNotifier.getMessagesCount()) + c;

    chrome.storage.local.set({
        'SNMsgCount': count
    });
}

SpigotNotifier.setAlertCount = function(c)
{
    var count = parseInt(SpigotNotifier.getAlertCount()) + c;

    chrome.storage.local.set({
        'SNAlertCount': count
    });
}

SpigotNotifier.resetCounters = function()
{
    chrome.storage.local.set({
        'SNAlertCount': 0
    });

    chrome.storage.local.set({
        'SNMsgCount': 0
    });

    notificationManager.updateBadge();
}

SpigotNotifier.getAlertCount = function()
{
    chrome.storage.local.get('SNAlertCount', function(response) { 
        console.log(response.SNAlertCount);
        return response.SNAlertCount;    
    }); 
}

SpigotNotifier.getMessagesCount = function()
{
    chrome.storage.local.get('SNMsgCount', function(response) { 
        console.log(response.SNMsgCount);
        return response.SNMsgCount;    
    });
}

SpigotNotifier.updateLastAlertID = function(id)
{
    localStorage.setItem("SNLastAlertID", id);
}

SpigotNotifier.getLastAlertID = function()
{
    return localStorage.getItem("SNLastAlertID");
}

SpigotNotifier.updateProfileStats = function(data)
{
    chrome.storage.local.set({
        'posts': $(data).find("#content").find(".stats").text().split(":")[1].replace("\nRatings","").replace("\n","")
    });
    chrome.storage.local.set({
        'rating': $(data).find("#content").find(".dark_postrating_positive").text()
    });
}