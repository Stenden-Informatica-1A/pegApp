var page;
$(document).on("pagechange", function (e, data) {
    page = data.toPage[0].id;
});
$(document).on('swipeleft swiperight', function (event) {
    // next page
    if (event.type == 'swipeleft' && page !="weatherDay") {
        var nextPage = $.mobile.activePage.next('[data-role=page]');
        if (nextPage) {
            $.mobile.changePage(nextPage, {
                transition: "slide" // or any transition
            }
          );
        }
        activePage = $( ".selector" ).pagecontainer( "getActivePage" );
    }
    // previous page
    if (event.type == 'swiperight' && page != "main" ) {
        var prevPage = $.mobile.activePage.prev('[data-role=page]');
        if (prevPage) {
            $.mobile.changePage(prevPage, {
                transition: "slide",
                reverse: true // reverse effect

            }
          );
          activePage = $( ".selector" ).pagecontainer( "getActivePage" );
        }
    }
});
