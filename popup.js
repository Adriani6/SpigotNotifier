var id = 'SpigotNotifier';
function getMode(callback)
{
    chrome.storage.local.get('mode', function(response) {
        callback(response.mode);
    });
}

$(document).ready(function() {
    getMode(function(mode)
    {
        $("#mode").text(mode.charAt(0).toUpperCase() + mode.slice(1));
    })
    $("#toggleMode").click(function()
    {        
        getMode(function(mode)
        {
            if(mode == "simple")
            {
                chrome.storage.local.set({
                    'mode': "rich"
                });
                $("#mode").text("Rich");
            }
            else
            {
                chrome.storage.local.set({
                    'mode': "simple"
                });
                $("#mode").text("Simple");
            }
        })
    })

    chrome.storage.local.get('SNAlertCount', function(response) {
        if (response.SNAlertCount > 0) {
            $("#alerts").css("color", "#D6847B");
        } else {
            $("#alerts").css("color", "#B5B5B5");
        }
        $("#alerts").text(response.SNAlertCount + " new");
    });

    chrome.storage.local.get('SNMsgCount', function(response) {
        if (response.SNMsgCount > 0) {
            $("#messages").css("color", "#D6847B");
        } else {
            $("#messages").css("color", "#B5B5B5");
        }
        $("#messages").text(response.SNMsgCount + " new");
    });

    chrome.storage.local.get('posts', function(response) {
        $("#posts").text(response.posts);
    });

    chrome.storage.local.get('rating', function(response) {
        $("#rating").text("+" + response.rating);
    });
    $('body').on('click', 'a', function() {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });

    $('body').on('click', 'area', function() {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });

    $('#options').click('click', function() {
        location.pathname = "/options/options.html";
        return false;
    });

});
