var SpigotNotifier = {};
var mode = undefined;


SpigotNotifier.init = function()
{
    SpigotNotifier.getMode(function(resp)
    {
        if(!resp)
        {
            SpigotNotifier.setMode("simple");
            mode = "simple";
        }
        else
        {
            mode = resp;
        }

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
    })
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

        var alertCounter = 0;

        if(alerts > 0)
        {
            if(alerts > 0 && mode == "rich" || mode == "simple")
            {
                notificationManager.createNotification("New Alerts!", "You have " + alerts + " new alerts!"); 
                notificationManager.updateBadge(alerts);
                SpigotNotifier.setAlertCount(alerts);
                return;
            }
            else
            {
                var alertpromise = SpigotNotifier.getAlertsData();
                alertpromise.success(function(alertData){
                    var newData = $(alertData).find(".alertsScroller").html();
                    SpigotNotifier.getLastAlertID(function(lastAlertID)
                    {
                        var topID = 0;
                        $(newData).find('.primaryContent').each(function(){
                            var newAlertID = parseInt($(this).attr('id').replace("alert", ""));
                            if($(this).find(".timeRow .newIcon").length > 0){                            
                                if(parseInt(lastAlertID) < newAlertID){
                                    
                                    SpigotNotifier.updateLastAlertID(newAlertID);
                                    var subject = $(this).find("h3").text();
                                    alertCounter++;
                                    notificationManager.createNotification("New Alert!", subject);
                                }
                            }
                        });
                    });
                
                
                
                    var tempAlertCount = localStorage.getItem("TemporaryAlertsCounter");

                    if(tempAlertCount < alertCounter)
                        localStorage.setItem("TemporaryAlertsCounter", alertCounter);

                    SpigotNotifier.setAlertCount(alertCounter);
                    notificationManager.updateBadge(alertCounter);
                });
            }

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

SpigotNotifier.setMode = function(mode)
{
    chrome.storage.local.set({
        'mode': mode
    });
}

SpigotNotifier.getMode = function(callback)
{
    chrome.storage.local.get('mode', function(response) {
        callback(response.mode);
    });
}


SpigotNotifier.setMessageCount = function(c)
{
    chrome.storage.local.set({
        'SNMsgCount': c
    });
}

SpigotNotifier.setAlertCount = function(c)
{
    chrome.storage.local.set({
        'SNAlertCount': c
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

    localStorage.setItem("TemporaryAlertsCounter", 0);

    notificationManager.updateBadge(0);
}

SpigotNotifier.getAlertCount = function()
{
    chrome.storage.local.get('SNAlertCount', function(response) { 
        return response.SNAlertCount;    
    }); 
}

SpigotNotifier.getMessagesCount = function()
{
    chrome.storage.local.get('SNMsgCount', function(response) { 
        return response.SNMsgCount;    
    });
}

SpigotNotifier.updateLastAlertID = function(id)
{
    chrome.storage.local.set({
        'SNLastAlertID': id
    });
}

SpigotNotifier.getLastAlertID = function(cb)
{
    chrome.storage.local.get('SNLastAlertID', function(response) { 
        cb(response.SNLastAlertID);    
    });
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