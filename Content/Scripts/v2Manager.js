var Manager = (function(v2Storage){

    v2Storage = v2Storage();

    var Timer = undefined;
    var _ = {};
    var priv = {
        XHRSite: "https://www.spigotmc.org",
        Timeout: 20000, // 1 Minute = 60000
        AlertsIds: [],
        MessagesIds: [],
        TempAlerts: 0,
        TempMessages: 0
    };

    var NOTIFICATIONTYPE = {
        MESSAGE: 1,
        ALERT: 2
    }

    _.Start = function(Popup){

        if(!Popup){
            //v2Storage.Temp.Clear();
            v2Storage.Temp.Alerts.Set(0);
            v2Storage.Temp.Messages.Set(0);
              
        }

        _.LoadSettings();
        priv.CheckSite();

        Timer = setInterval(function(){
            priv.CheckSite();
        }, priv.Timeout);
    }

    _.LoadSettings = function(){

        v2Storage.Volume.Get(function(vol){
            priv.Volume = vol;
        });

        v2Storage.Sound.Get(function(sound){
            priv.Sound = sound;
        });
    }

    _.ChangeFrequency = function(f){
        priv.Timeout = f * 6000;
    }

    _.CreateDelay = function(d){
        setTimeout(function(){

        }, d*6000);
    }

    _.GetBaseURL = function(){
        return priv.XHRSite;
    }

    _.CreateNotification = function(type, title, body){
        chrome.notifications.create({
            type: "basic",
            iconUrl: "Content/Images/icon512.png",
            title: title,
            message: body
        }, function(notificationid) {

            if(type == NOTIFICATIONTYPE.ALERT){
                priv.AlertsIds.push(notificationid);
            } else if(type == NOTIFICATIONTYPE.MESSAGE){
                priv.MessagesIds.push(notificationid);
            }

            _.PlaySound();
        });
    }

    priv.UpdateBadge = function(){
        chrome.browserAction.setBadgeText({
            text: ((priv.TempAlerts + priv.TempMessages) == 0) ? "" : (priv.TempAlerts + priv.TempMessages).toString()
        });
    }

    //  Private function to play a sound
    _.PlaySound = function(sound){
        console.log(sound)
        var soundFile = sound == undefined ? priv.Sound : sound.file;
        var audobj = new Audio("Content/sounds/" + soundFile);
        audobj.volume = sound == undefined ? priv.Volume / 100 : sound.volume;
        audobj.play();
    }

    priv.MakeRequest = function(){

        return $.ajax({
            url: priv.XHRSite
        });	

    }

    priv.CheckSite = function(){
    
        priv.MakeRequest()
        .done(function(data){
            data = data.replace(/<img[^>]*>/g,"");  //  Remove any images to avoid loading attempts that cause failed image requests

            var alerts = parseInt($(data).find("#AlertsMenu_Counter").text());
            var messages = parseInt($(data).find("#ConversationsMenu_Counter").text());

            var messageTrigger = false, alertTrigger = false;

            priv.TempAlerts = priv.TempAlerts < alerts ? (alertTrigger = true, alerts) : alerts;
            priv.TempMessages = priv.TempMessages < messages ? (messageTrigger = true, messages) : messages; 

            if(v2Storage.Temp.Alerts.Get() == priv.TempAlerts){
                alertTrigger = false;
            }

            if(v2Storage.Temp.Messages.Get() == priv.TempMessages){
                messageTrigger = false;
            }

            $("#alerts").trigger({
                type:"SN:AlertUpdate",
                count: priv.TempAlerts
            });

            $("#messages").trigger({
                type:"SN:MessageUpdate",
                count: priv.TempMessages
            });

            $("#ratings").trigger({
                type: "SN:RatingsUpdate",
                count: $(data).find("#content").find(".dark_postrating_positive").text()
            })

            $("#posts").trigger({
                type: "SN:PostCountUpdate",
                count: $(data).find("#content").find(".stats").text().split(":")[1].replace("\nRatings","").replace("\n","")
            })
            
            priv.UpdateBadge();

            if(!v2Storage.Timers.Disable.IsDisabled()){
            
                if(alertTrigger){
                    _.CreateNotification(NOTIFICATIONTYPE.ALERT, "New Alert", `You have ${priv.TempAlerts} new alerts.`);
                    v2Storage.Temp.Alerts.Set(priv.TempAlerts);
                }

                if(messageTrigger){
                    _.CreateNotification(NOTIFICATIONTYPE.MESSAGE, "New Message", `You have ${priv.TempMessages} new messages.`); 
                    v2Storage.Temp.Messages.Set(priv.TempMessages);
                }
            }

            //console.log(alerts, messages);
        }).fail(function(){
            console.log("Request could not be made.");
        })

    }

    _.GetNotificationType = function(notId){
        if (priv.AlertsIds.indexOf(notId) > -1) {

            return NOTIFICATIONTYPE.ALERT;

        } else if (priv.MessagesIds.indexOf(notId) > -1) {

            return  NOTIFICATIONTYPE.MESSAGE;
        }
    }

    _.RemoveMessageNotification = function(){
        priv.MessagesIds.pop();
    }

    _.RemoveAlertNotification = function(){
        priv.AlertsIds.pop();
    }

    return _;
})(v2Storage);