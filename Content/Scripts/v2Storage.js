var v2Storage = (function(){

    var sounds = [
        {
            name: "FX 1",
            file: "FX 1.mp3"
        },
        {
            name: "Pluck 1",
            file: "Pluck 1.mp3"
        },
        {
            name: "Pluck 2",
            file: "Pluck 2.mp3"
        },
        {
            name: "Pluck 3",
            file: "Pluck 3.mp3"
        },
        {
            name: "Pluck 4",
            file: "Pluck 4.mp3"
        },
        {
            name: "Pluck 5",
            file: "Pluck 5.mp3"
        },
        {
            name: "Pluck 6",
            file: "Pluck 6.mp3"
        },
        {
            name: "Pluck 7",
            file: "Pluck 7.mp3"
        },
        {
            name: "Soft 1",
            file: "Soft 1.mp3"
        },
        {
            name: "Soft 2",
            file: "Soft 2.mp3"
        }
    ];
    
    var storage = {
        GetSoundByIndex: function(index, callback){
            if(index > (sounds.length - 1)){
                index = 0;
            }

            chrome.storage.sync.set({
                "sound": JSON.stringify(sounds[index])
            });

            callback(index, sounds[index]);
        },
        GetVersion: function(){
            chrome.storage.local.get("SNVersion", function(ver){
                return ver.SNVersion;
            })
        },

        SetVersion: function(ver){
            chrome.storage.local.set({
                'SNVersion': ver
            });
        },

        Volume: {
            Get: function(callback){
                chrome.storage.sync.get("volume", function(response) {
                    var volume = 50;
                    console.log(response)

                    if (response.hasOwnProperty("volume")) {
                        volume = response.volume;
                    }

                    callback(volume / 100);
                });

            },
            Set: function(vol){
                chrome.storage.sync.set({
                    'volume': vol
                });
            }
        },

        Sound: {
            Get: function(callback){
                chrome.storage.sync.get("sound", function(response) {

                    sound = sounds[0];

                    if (response.hasOwnProperty("sound")) {
                        sound = $.parseJSON(response.sound);
                    }

                    callback(sound);
                });
            },
            Set: function(sound){
                chrome.storage.sync.set({'sound': JSON.stringify(sound)});
            }
        },

        Temp: {
            Alerts: {
                Get: function(){
                    var tempAlerts = localStorage.getItem("SNTempAlerts");

                    return tempAlerts != undefined ? tempAlerts : 0;
                },
                Set: function(i){
                    localStorage.setItem("SNTempAlerts", i);
                }
            },
            Messages: {
                Get: function(){
                    var tempMessages = localStorage.getItem("SNTempMessages")
                    return tempMessages != undefined ? tempMessages : 0;
                },
                Set: function(i){
                    localStorage.setItem("SNTempMessages", i);
                }
            },
            Clear: function(){
                localStorage.clear();
            }
        },

        Timers: {
            Disable: {
                Set: function(minutes){
                    if(minutes == 0){
                        localStorage.removeItem("SNDisableFor");
                    }else{
                        var obj = {
                            created: new Date().getTime(),
                            disableFor: minutes * 60000
                        }

                        localStorage.setItem("SNDisableFor", JSON.stringify(obj));
                    }
                },
                IsDisabled: function(){
                    var objItem = localStorage.getItem("SNDisableFor");
                    var disabled = false;

                    if(objItem != undefined){
                        var obj = $.parseJSON(objItem);
                        disabled = (obj.created + obj.disableFor) - new Date().getTime() > 0 ? true : false;

                        if(!disabled){
                            storage.Timers.Disable.Set(0);
                        }
                    }

                    return disabled;
                },
                Get: function(callback){

                        var objItem = localStorage.getItem("SNDisableFor");

                        if(objItem != undefined){
                            var item = $.parseJSON(objItem);

                            var reminder = (item.created + item.disableFor) - new Date().getTime();

                            reminder = reminder < 0 ? 0 : reminder / 60000;

                            reminder = reminder > 1 ? Math.floor(reminder) : reminder;

                            callback(reminder);

                        }
                        else
                        {
                            callback(0);
                        }
                }

            }
        }
    }

    return storage;

});