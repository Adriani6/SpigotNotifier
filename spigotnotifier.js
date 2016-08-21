var SpigotNotifier = {};

SpigotNotifier.init = function()
{
    SpigotNotifier.checkData(); 

    setInterval(function(){ 
        SpigotNotifier.checkData(); 
    }, 120000);    
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
    
    var promise = SpigotNotifier.getAlertsData();

    promise.success(function(data){
        var alerts, messages = undefined;

        alerts = parseInt($(data).find("#AlertsMenu_Counter").text());
        messages = parseInt($(data).find("#ConversationsMenu_Counter").text());

        if(alerts > 0)
        {
                var newData = $(data).find(".alertsScroller").html();
                var lastAlertID = SpigotNotifier.getLastAlertID();
                var topID = 0;
		        $(newData).find('.primaryContent').each(function(){
                        var subject = $(this).find("h3").text();
                        var id = $(this).attr('id').replace("alert", "");
                        if(lastAlertID < id){
                            notificationManager.createNotification("New Alert!", subject);
                            SpigotNotifier.setAlertCount(1); 
                            notificationManager.updateBadge();
                        }

                        if(topID < id)
                            topID = id;
		        });
                SpigotNotifier.updateLastAlertID(topID);

            alertpromise.error(function(){
                console.log("Couldn't get data");
            })
        }
        
        if(messages > 0)
        {
            var messagepromise = SpigotNotifier.getMessagesData();
            notificationManager.createNotification("New Message!", "You have received a new Message.");
            SpigotNotifier.setMessageCount(1);
            notificationManager.updateBadge();
        }
    })
}

SpigotNotifier.setMessageCount = function(c)
{
    localStorage.setItem("SN-MsgCount", c);
}

SpigotNotifier.setAlertCount = function(c)
{
    var count = parseInt(localStorage.getItem("SN-AlertCount"));
    localStorage.setItem("SN-AlertCount", count + c);
}

SpigotNotifier.resetCounters = function()
{
    localStorage.setItem("SN-AlertCount", 0);
    localStorage.setItem("SN-MsgCount", 0);
    notificationManager.updateBadge();
}

SpigotNotifier.getAlertCount = function()
{
    return localStorage.getItem("SN-AlertCount");
}

SpigotNotifier.getMessagesCount = function()
{
    return localStorage.getItem("SN-MsgCount");
}

SpigotNotifier.updateLastAlertID = function(id)
{
    localStorage.setItem("SN-LastAlertID", id);
}

SpigotNotifier.getLastAlertID = function()
{
    return localStorage.getItem("SN-LastAlertID");
}