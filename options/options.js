var volume = 50;
var onoff = true;
var sound = "Pluck 6.mp3";
var audobj = undefined;

chrome.storage.sync.get("volume", function(response) {
    if (response.hasOwnProperty("volume")) {
        volume = response.volume;
        changevoldisplay(volume);
    }
});

chrome.storage.sync.get("onoff", function(response) {
    if (response.hasOwnProperty("onoff")) {
        onoff = response.onoff;
        console.log(onoff);
        fonoff(onoff);
    }
});

chrome.storage.sync.get("sound", function(response) {
    if (response.hasOwnProperty("sound")) {
        sound = response.sound;
        dropdown.value = sound;
        if (dropdown.selectedIndex < 0) {
            dropdown.selectedIndex = 6;
        }
    }
});

function changevoldisplay(vol) {
    if (vol > 90) {
        vol_grey_9.hidden = true;
    }
    if (vol > 80) {
        vol_grey_8.hidden = true;
    }
    if (vol > 70) {
        vol_grey_7.hidden = true;
    }
    if (vol > 60) {
        vol_grey_6.hidden = true;
    }
    if (vol > 50) {
        vol_grey_5.hidden = true;
    }
    if (vol > 40) {
        vol_grey_4.hidden = true;
    }
    if (vol > 30) {
        vol_grey_3.hidden = true;
    }
    if (vol > 20) {
        vol_grey_2.hidden = true;
    }
    if (vol > 10) {
        vol_grey_1.hidden = true;
    }
    if (vol > 0) {
        vol_grey_0.hidden = true;
    }
    if (vol <= 0) {
        vol_grey_0.hidden = false;
    }
    if (vol <= 10) {
        vol_grey_1.hidden = false;
    }
    if (vol <= 20) {
        vol_grey_2.hidden = false;
    }
    if (vol <= 30) {
        vol_grey_3.hidden = false;
    }
    if (vol <= 40) {
        vol_grey_4.hidden = false;
    }
    if (vol <= 50) {
        vol_grey_5.hidden = false;
    }
    if (vol <= 60) {
        vol_grey_6.hidden = false;
    }
    if (vol <= 70) {
        vol_grey_7.hidden = false;
    }
    if (vol <= 80) {
        vol_grey_8.hidden = false;
    }
    if (vol <= 90) {
        vol_grey_9.hidden = false;
    }
    text.innerText = vol + "%";
    volume = vol;
    chrome.storage.sync.set({
        "volume": vol
    });
}

function fonoff(bool) {
    chrome.storage.sync.set({
        "onoff": bool
    });
    if (bool) {
        on.style.color = "#90FF85";
        off.style.color = "#222222";
    } else {
        off.style.color = "#D6847B";
        on.style.color = "#222222";
    }
}

function playAudio(name) {
    if (audobj) {
        if (audobj.currentTime + 1 >= audobj.duration) {
            audobj = new Audio("../sounds/" + name);
            audobj.volume = volume / 100;
            audobj.play();
        }
    } else {
        audobj = new Audio("../sounds/" + name);
        audobj.volume = volume / 100;
        audobj.play();
    }
}

$(document).ready(function() {
    $("body").on("click", "a", function(event) {
        console.log(event.target.id);
        if (event.target.id == "back") {
            location.href = "chrome-extension://bjphopppikbddiifjjpjojddmgonbhgn/popup.html";
        }
        return false;
    });
    $(".icons").click(function(event) {
        if (event.target.id == "vol_minus") {
            if (volume == 0) {
                return false;
            }
            changevoldisplay(volume - 05);
        } else if (event.target.id == "vol_plus") {
            if (volume == 100) {
                return false;
            }
            changevoldisplay(volume + 05);
        } else if (event.target.id == "ns_play") {
            playAudio(sound);
        }
        return false;
    });
    $(".volume").click(function(event) {
        if (event.target.id) {
            if (event.target.id != "text") {
                vol = parseInt(event.target.id.startsWith("vol_blue") ? event.target.id.replace("vol_blue_", "") : event.target.id.replace("vol_grey_", ""));
                vol = (vol * 10) + 10;
                changevoldisplay(vol);
            }
        }
        return false;
    });
    $(".onoff").click(function() {
        fonoff(!onoff);
        onoff = !onoff;
    });
    $("#dropdown").change(function() {
        sound = dropdown.value;
        chrome.storage.sync.set({
            "sound": sound
        });
    });

    //Load volume
    changevoldisplay(volume);
    //Load on/off
    fonoff(onoff);
    //Load chosen sound into dropdown
    dropdown.value = sound;
    if (dropdown.selectedIndex < 0) {
        dropdown.selectedIndex = 6;
    }
});
