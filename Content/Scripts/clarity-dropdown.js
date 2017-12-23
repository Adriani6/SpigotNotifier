/*
    Adrian Iwaszkiewicz © 2017 -

    Functionality for Clarity-Ui dropdown in jquery


    --  Notes
    Required to add expandable rows and their direction which is to be added

*/
(function () {

    //  Detect all clicks on documents
    $(document).on('click', function (e) {

        //  Verify we're not clicking on DOM with .dropdown
        var target = $(e.target);
        if (target.parents('[data-clarity="dropdown-toggle"]').length < 1 && target.parents(".dropdown").length < 1 && !$(e.target).hasClass("dropdown")) {
            $(".dropdown").removeClass("open");
        }

    })

    //  Expand/Collapse Listeners
    $('[data-clarity="dropdown-toggle"]').on("click", function (e) {

        $(this).find(".dropdown").addClass("open");
        //  Check we're not clicking on dropdown menu body 



    })

})();