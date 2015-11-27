var id = 'SpigotNotifier';

$(document).ready(function() {
    chrome.storage.local.get('alerts', function(response) {
        $("#alerts").text(response.alerts + " new");
    });

    chrome.storage.local.get('messages', function(response) {
        $("#messages").text(response.messages + " new");
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

});
