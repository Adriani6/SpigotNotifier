var v2Storage = (function(){
    
    return {
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

                    if (response.hasOwnProperty("volume")) {
                        volume = response.volume;
                    }

                    callback(volume);
                });

            }
        },

        Sound: {
            Get: function(callback){
                chrome.storage.sync.get("sound", function(response) {
                    var sound = "Pluck 6.mp3";

                    if (response.hasOwnProperty("sound")) {
                        sound = response.sound;
                    } 

                    callback(sound);
                });
            }
        },

        Temp: {
            Alerts: {
                Get: function(){
                    return localStorage.getItem("SNTempAlerts");
                },
                Set: function(i){
                    localStorage.setItem("SNTempAlerts", i);
                }
            },
            Messages: {
                Get: function(){
                    return localStorage.getItem("SNTempMessages");
                },
                Set: function(i){
                    localStorage.setItem("SNTempMessages", i);
                }
            },
            Clear: function(){
                localStorage.clear();
            }
        }
    }

});