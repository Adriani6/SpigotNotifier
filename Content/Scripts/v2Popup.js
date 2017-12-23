/**
 * @file 
 * v2Popup.js
 *
 * Implementation of SN Manager with Update events
 * to show updated stats on the pop up page.
 * 
 * @author
 * Adrian Iwaszkiewicz (Adriani6)
 * @version
 * 2.0
 * 
 */

$(document).ready(function(){

    $("#copyrightDate").text(new Date().getFullYear());

    //  Define the SN events

    //  Alert Update Event
    $("#alerts").on("SN:AlertUpdate", function(event){

        if (event.count > 0) {
            $(this).css("color", "#D6847B");
        } else {
            $(this).css("color", "");
        }

        $(this).text(event.count + " new");

    });

    //  Message Update Event
    $("#messages").on("SN:MessageUpdate", function(event){

        if (event.count > 0) {
            $(this).css("color", "#D6847B");
        } else {
            $(this).css("color", "");
        }

        $(this).text(event.count + " new");

    });

    $("#posts").on("SN:PostCountUpdate", function(event){
        $(this).text(event.count);
    });

    $("#ratings").on("SN:RatingsUpdate", function(event){
        $(this).text(event.count);
    });

    Manager.Start(true);    //  Start the SN Manager with Popup flag

    //  Listen to options click event
    $('#options').click('click', function() {
        location.pathname = "/options.html";
        return false;
    });

    $("[data-href], [data-base-href]").click(function(){
        if($(this).data("href") != undefined){
            chrome.tabs.create({ url: Manager.GetBaseURL() + $(this).data("href") });
        }

        if($(this).data("base-href") != undefined){
            chrome.tabs.create({ url: $(this).data("base-href") });
        }
    })
});

// 23/12/2017