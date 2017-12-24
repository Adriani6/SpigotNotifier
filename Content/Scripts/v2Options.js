var Options = (function(v2Storage){

    v2Storage = v2Storage();

    return v2Storage;

})(v2Storage);

$(document).ready(function(){

    Manager.LoadSettings();

    $("#goBack").click(function(){
        location.pathname = "/popup.html";
        return false;
    });

    Options.Sound.Get(function(sound){
        $("#soundName").html(sound.name);
    });

    Options.Volume.Get(function(vol){
        $("#volPercentage").text(vol * 100);
        noUiSlider.create($("#volumeSlider").get(0), {
            start: [ vol * 100 ],
            range: {
                'min': [ 0 ],
                'max': [ 100 ]
            }
        });

        $("#volumeSlider").get(0).noUiSlider.on('change', function ( values, handle ) {

            $("#volPercentage").text(Math.floor(values[handle]));
            Options.Volume.Set(Math.floor(values[handle]));

        });
    })

    Options.Timers.Disable.Get(function(min){
        $("#disableMinutes").text(min);
        noUiSlider.create($("#tempDisableSlider").get(0), {
            start: [ min ],
            range: {
                'min': [ 0 ],
                'max': [ 60 ]
            }
        });

        $("#tempDisableSlider").get(0).noUiSlider.on('change', function ( values, handle ) {

            $("#disableMinutes").text(Math.floor(values[handle]));
            Options.Timers.Disable.Set(Math.floor(values[handle]));

        });
    })

    $("[data-href], [data-base-href]").click(function(){
        if($(this).data("href") != undefined){
            chrome.tabs.create({ url: Manager.GetBaseURL() + $(this).data("href") });
        }

        if($(this).data("base-href") != undefined){
            chrome.tabs.create({ url: $(this).data("base-href") });
        }
    });

    var soundIndex = 0;

    $("#prevSound").click(function(){
        if(soundIndex > 0){

            soundIndex--;

            Options.GetSoundByIndex(soundIndex, function(index, sound){
                soundIndex = index;
                $("#soundName").html(sound.name);

                Options.Volume.Get(function(vol){
                    sound.volume = vol;
                    Manager.PlaySound(sound);
                    Manager.LoadSettings();
                })
            });
        }
    });

    $("#nextSound").click(function(){
        soundIndex++;

        Options.GetSoundByIndex(soundIndex, function(index, sound){
            soundIndex = index;
            $("#soundName").html(sound.name);
            
            Options.Volume.Get(function(vol){
                sound.volume = vol;
                Manager.PlaySound(sound);
                Manager.LoadSettings();
            })
            
        });
    })

    $("#soundName").click(function(){
        Manager.PlaySound();
    })
})
