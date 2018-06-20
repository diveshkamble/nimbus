
// Navbar

$(window).scroll(function() {

    var scroll = $(window).scrollTop();

    if (scroll > 0) {
        $("#navbar-style-dark").addClass("navbar-light");
        $("#navbar-style-dark").removeClass("navbar-dark");
        $(".navbar").addClass("bg-white");

    } else {
        $("#navbar-style-dark").removeClass("navbar-light");
        $("#navbar-style-dark").addClass("navbar-dark");
        $(".navbar").removeClass("bg-white");
    }

});

// Tooltips

$(function() {

    $('[data-toggle="tooltip"]').tooltip();

    var width = $(window).width();

    if (width < 1200) {
        $("#navbar-style-dark").addClass("navbar-light");
        $("#navbar-style-dark").removeClass("navbar-dark");
        $(".navbar").addClass("bg-white");
    } else {
        $("#navbar-style-dark").removeClass("navbar-light");
        $("#navbar-style-dark").addClass("navbar-dark");
        $(".navbar").removeClass("bg-white");
    }

})
