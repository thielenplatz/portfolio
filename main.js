require('./node_modules/font-awesome/css/font-awesome.css');
require('./node_modules/bootstrap/dist/css/bootstrap.css');
require('./node_modules/bootstrap-material-design/dist/css/bootstrap-material-design.css');
require('./node_modules/bootstrap-material-design/dist/css/ripples.css');
require('./style.less');

var $ = require('jquery');

// velocity-animate relies on window.jQuery in order to work (which cannot be imported with imports-loader)
// Set window.jQuery and delete reference when finished
window.jQuery = $;
require('velocity-animate');
delete window.jQuery;

require('imports?jQuery=jquery!./node_modules/bootstrap-material-design/dist/js/material');
require('imports?jQuery=jquery!./node_modules/bootstrap-material-design/dist/js/ripples');
require('imports?jQuery=jquery,this=>window!./node_modules/jquery-file-download/src/Scripts/jquery.fileDownload');
require('imports?jQuery=jquery!./node_modules/bootstrap/dist/js/bootstrap');

$.material.init();
$.material.ripples();

var fastclick = require('fastclick');
fastclick.attach(document.body);


// Start
$('body').css("visibility", "visible");

var getBackgroundImageElementForName = function (name) {
    // Image url from url loader
    var imageUrl = require('./images/background/' + name);
    return $("<img src=" + imageUrl + " class='floating-image' />")
};
var getPortfolioImageElementForName = function (name, description) {
    // Image url from url loader
    var imageUrl = require('./images/portfolio/' + name);
    return $("<img src=" + imageUrl + " data-description=" + description + " style='width: 100%;' />")
};

var backgroundImageNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg'];
var portfolioImageNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'];

// backgroundImageNames and portfolioImageNames variables exposed from the express server using express-state
var $backgroundImages = backgroundImageNames.map(function(backgroundImageName){return getBackgroundImageElementForName(backgroundImageName)});
var $portfolioImages = portfolioImageNames.map(function(portfolioImageName){return getPortfolioImageElementForName(portfolioImageName)});


var $navbar = $(".navbar");

var getRandomLoadedImage = function () {
    var imageIndex = Math.floor((Math.random() * $backgroundImages.length) + 1) - 1;
    var $image = $backgroundImages[imageIndex];

    if ($image.hasClass("loaded")) {
        return $image;
    }
    return getRandomLoadedImage();
};


var startAnimationForImage = function ($image) {
    $("#images").append($image);

    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    $image.css({width: "", height: windowHeight - $navbar.height(), opacity: 0});

    var animationTimeInMilliseconds = 15000;

    var pixelsToMoveImage;

    if ($image.width() >= windowWidth) {
        // Extend image height to fit screen
        $image.css("height", windowHeight - $navbar.height());

        var widthDifferenceBetweenImageAndScreen = Math.abs($image.width() - windowWidth);
        pixelsToMoveImage = widthDifferenceBetweenImageAndScreen / 3;
        var positionLeftOfImageAfterAnimation;

        // Determine if image should start at the left or right of the screen
        var left = Math.random() < .5;
        if (left) {
            // Align image to the left of the screen (left edge of image touching the left edge of the screen)
            $image.css({top: $navbar.height(), left: 0});

            // Calculate where the left of the image should be after the animation concludes (minus means the image will be moving to the LEFT)
            positionLeftOfImageAfterAnimation = $image.offset().left - pixelsToMoveImage;
            pixelsToMoveImage *= -1;
        } else {
            // Align image to the right of the screen (right edge of image touching right edge of screen)
            $image.css({top: $navbar.height(), left: -($image.width() - windowWidth)});

            // Calculate where the left of the image should be after the animation concludes (plus means the image will be moving to the RIGHT)
            positionLeftOfImageAfterAnimation = $image.offset().left + pixelsToMoveImage;
        }

        // Animate image upwards or downwards using the velocity animation framework
        $image.velocity({translateX: pixelsToMoveImage}, {duration: animationTimeInMilliseconds});
        $image.velocity("fadeIn", {duration: animationTimeInMilliseconds / 2, queue: false});
        $image.velocity("fadeOut", {
            duration: animationTimeInMilliseconds / 2,
            delay: animationTimeInMilliseconds / 2,
            queue: false
        });
    } else {
        // Extend image width to fit screen
        $image.css({width: windowWidth, height: ""});

        var heightDifferenceBetweenImageAndScreen = Math.abs($image.height() - windowHeight);
        pixelsToMoveImage = heightDifferenceBetweenImageAndScreen / 3;
        var positionTopOfImageAfterAnimation;

        // Determine if image should start at the top or bottom of the screen
        var top = Math.random() < .5;
        var topPositionInPixels;
        if (top) {
            // Align image to the top of the screen (top of image touching the bottom of the Navbar)
            topPositionInPixels = $navbar.height();
            $image.css({top: topPositionInPixels, left: 0});

            // Calculate where the top of the image should be after the animation concludes (minus means the image will be moving upwards)
            positionTopOfImageAfterAnimation = topPositionInPixels - pixelsToMoveImage;
            pixelsToMoveImage *= -1;
        } else {
            // Align image to the bottom of the screen (bottom of image touching bottom of screen)
            topPositionInPixels = windowHeight - $image.height() + $navbar.height();
            $image.css({top: topPositionInPixels, left: 0});

            // Calculate where the top of the image should be after the animation concludes (plus means the image will be moving downwards)
            positionTopOfImageAfterAnimation = topPositionInPixels + pixelsToMoveImage;
        }

        // Animate image upwards or downwards using the velocity animation framework
        $image.velocity({translateY: pixelsToMoveImage}, {duration: animationTimeInMilliseconds});
        $image.velocity("fadeIn", {duration: animationTimeInMilliseconds / 2, queue: false});
        $image.velocity("fadeOut", {
            duration: animationTimeInMilliseconds / 2,
            delay: animationTimeInMilliseconds / 2,
            queue: false
        });
    }


    var callStartAnimationForImageAgain = function () {
        $image.remove();
        var $randomImage = getRandomLoadedImage();
        while ($randomImage.prop('src') === $image.prop('src')) {
            $randomImage = getRandomLoadedImage();
        }
        startAnimationForImage($randomImage);
    };
    setTimeout(callStartAnimationForImageAgain, animationTimeInMilliseconds);
};

var $originalPortfolioImg;
var scrollTopBeforeExpanding;
var expandPortfolioPicture = function (event) {
    var $body = $('body');

    $originalPortfolioImg = $(event.target.closest(".portfolio-picture")).find("img");
    var $portfolioImgClone = $originalPortfolioImg.clone();
    var $closeBtn = $("<button type='button' class='close-expanded-portfolio-picture-btn btn btn-fab' style='position: fixed; color: white; background-color: #000059; z-index: 1000;'><span class='glyphicon glyphicon-remove'></span></button>");

    $body.append($portfolioImgClone);
    $body.append($closeBtn);

    // Since #portfolio-section is going to be hidden when showing the expanded portfolio img, we need to find the top for the image to have to make it look like it's in the same place when scrolling goes away
    var topForWhenScrollingGoesAway = $originalPortfolioImg[0].getBoundingClientRect().top;

    $portfolioImgClone.addClass('expanded-portfolio-picture-clone');
    $portfolioImgClone.css({
        position: 'absolute',
        left: $originalPortfolioImg.offset().left,
        top: topForWhenScrollingGoesAway,
        width: $originalPortfolioImg.width(),
        height: $originalPortfolioImg.height(),
        'z-index': 500
    });

    // Hide real #portfolio-section and fade a cloned .main-container
    var $mainContainer = $(".main-container");
    var $mainContainerClone = $mainContainer.clone();
    $mainContainerClone.removeClass("main-container").addClass("main-container-clone");
    $mainContainerClone.css({"position": "fixed", "top": $mainContainer.offset().top - $(window).scrollTop() + "px", "left": $mainContainer.offset().left + "px"});
    $body.append($mainContainerClone);
    $mainContainerClone.velocity({opacity: 0}, {duration: 500});

    scrollTopBeforeExpanding = $(window).scrollTop();
    $(window).scrollTop(0);

    resizePortfolioPictureCloneToFitWindow(true);

    $('#portfolio-section').addClass('hidden');


    window.addEventListener('resize', resizePortfolioPictureHandlerThrottler, false);
    $closeBtn.on('click', closeExpandedPortfolioPictureClone);
};

var resizePortfolioPictureCloneToFitWindow = function (animate) {
    var $portfolioSection = $('#portfolio-section');
    var wasHidden = $portfolioSection.hasClass('hidden');
    $portfolioSection.removeClass('hidden');

    var $expandedPortfolioPictureClone = $('.expanded-portfolio-picture-clone');

    var modifier = .7;
    var modifiedPortfolioSectionWidth = $portfolioSection.width() * modifier;

    var widthRatio = $expandedPortfolioPictureClone.width() / modifiedPortfolioSectionWidth;
    var newHeight = $expandedPortfolioPictureClone.height() / widthRatio;

    if (newHeight < $(window).height() && $(window).width() < 500) {
        modifier = 1;
        modifiedPortfolioSectionWidth = $portfolioSection.width() * modifier;

        widthRatio = $expandedPortfolioPictureClone.width() / modifiedPortfolioSectionWidth;
        newHeight = $expandedPortfolioPictureClone.height() / widthRatio;
    }

    var toBeTop = $navbar.height();

    // If picture does not take up the whole view, place in middle of screen
    if (newHeight < $(window).height() - $navbar.height()) {
        toBeTop = $navbar.height() + ($(window).height() - $navbar.height() - newHeight) / 2;
    }

    $expandedPortfolioPictureClone.velocity({
        left: ($(window).width() - modifiedPortfolioSectionWidth) / 2,
        top: toBeTop,
        width: modifiedPortfolioSectionWidth,
        height: newHeight
    }, {duration: animate ? 500 : 0});

    if (wasHidden) {
        $portfolioSection.addClass('hidden');
    }
};

var closeExpandedPortfolioPictureClone = function () {
    var $expandedPortfolioPictureClone = $('.expanded-portfolio-picture-clone');
    if (!$expandedPortfolioPictureClone.length > 0) {
        return;
    }
    $('.close-expanded-portfolio-picture-btn').remove();
    $('.main-container-clone').remove();

    var $portfolioSection = $("#portfolio-section");
    $portfolioSection.removeClass('hidden');
    $portfolioSection.css("opacity", 0);
    $portfolioSection.velocity({opacity: 1}, {duration: 300});

    var pictureCloneOffsetTop = $expandedPortfolioPictureClone.offset().top;
    var currentScrollTop = $(window).scrollTop();
    $(window).scrollTop(scrollTopBeforeExpanding);

    $expandedPortfolioPictureClone.css("top", (scrollTopBeforeExpanding + pictureCloneOffsetTop - currentScrollTop) + "px");
    $expandedPortfolioPictureClone.velocity({
        left: $originalPortfolioImg.offset().left,
        top: $originalPortfolioImg.offset().top,
        width: $originalPortfolioImg.width(),
        height: $originalPortfolioImg.height()
    }, {
        duration: 300, complete: function () {
            $expandedPortfolioPictureClone.remove();
            $originalPortfolioImg = undefined;
        }
    });

    window.removeEventListener('resize', resizePortfolioPictureHandlerThrottler, false);
};

function actualResizePortfolioPictureHandler() {
    resizePortfolioPictureCloneToFitWindow(false);
}
var resizeTimeout;
function resizePortfolioPictureHandlerThrottler() {
    // Ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
            resizeTimeout = null;
            actualResizePortfolioPictureHandler();
            // Will execute at a rate of 15fps
        }, 66);
    }
}

document.addEventListener('keydown', function (event) {
    if (event.keyCode === 27 /* 27 is the escape key */) {
        closeExpandedPortfolioPictureClone();
    }
}, false);

$('.github-btn').on('click', function() {
    var win = window.open('https://github.com/thielenplatz/', '_blank');
    if (win) {
        win.focus();
    }
});
$('.download-resume-btn').on('click', function () {
    $.fileDownload('/resume', {
        successCallback: function (url) { },
        failCallback: function (html, url) { }
    });
});


var i;

// Start loading all background images
var firstImageHasNotLoadedYet = true;
 for (i=0; i<$backgroundImages.length; ++i) {
    $backgroundImages[i].on('load', function() {
        var $currentImage = $(this);
        $currentImage.addClass('loaded');

        if (firstImageHasNotLoadedYet) {
            firstImageHasNotLoadedYet = false;

            startAnimationForImage($currentImage);
        }
    });
 }

// Append neccessary elements to portfolio-pictures-row
for (i=0; i < $portfolioImages.length; ++i) {
    $(".portfolio-pictures-row").append(
        "<div class='col-xs-12 col-sm-6 col-md-4 portfolio-picture'>" +
            "<div class='panel panel-default' style='cursor: pointer;'>" +
                "<div class='panel-body'>" +
                    "<div id='image' style='position: relative;'></div>" +
                "</div>" +
            "</div>" +
        "</div>"
    );
}

// Start loading all portfolio images
for (i=0; i < $portfolioImages.length; ++i) {
    $portfolioImages[i].attr('data-portfolio-index', i);
    $portfolioImages[i].on('load', function () {
        var $currentImage = $(this);
        var $portfolioPicturePanel = $($(".portfolio-picture").get(Number($currentImage.attr("data-portfolio-index"))));

        $portfolioPicturePanel.find("#image").append($currentImage);

        $portfolioPicturePanel.on('click', expandPortfolioPicture);
    });
}

var hideAllSections = function (callback) {
    if ($('.expanded-portfolio-picture-clone').length > 0) {
        closeExpandedPortfolioPictureClone();
    }

    // Remove the active status of all links
    $('#about-link').parent().removeClass('active');
    $('#portfolio-link').parent().removeClass('active');
    $('#contact-link').parent().removeClass('active');
    $('body').removeClass('portfolio-section-active');


    var allSections = $("#about-section, #portfolio-section, #contact-section");
    allSections.velocity({scale: 0}, {
        duration: 100, complete: function () {
            allSections.addClass("hidden");
            $(window).scrollTop(0);
            callback();
        }
    });
};
var closeNavbar = function () {
    var $navbar = $("#navbar");
    $navbar.attr("aria-expanded", "false");
    $navbar.removeClass("in");
};

$("#about-link").on("click", function () {
    var $aboutLink = $(this);
    if ($aboutLink.parent().hasClass('active')) {
        hideAllSections(function(){});
        return;
    }

    var $aboutSection = $("#about-section");
    var showAboutSectionCallback = function () {
        closeNavbar();
        $aboutLink.parent().addClass('active');
        $aboutSection.removeClass("hidden");
        $aboutSection.velocity({scale: 1}, {duration: 200});
    };
    hideAllSections(showAboutSectionCallback);
});
$("#portfolio-link").on("click", function () {
    var $portfolioLink = $(this);
    if ($portfolioLink.parent().hasClass('active')) {
        hideAllSections(function(){});
        return;
    }

    var $portfolioSection = $("#portfolio-section");
    var showPortfolioSectionCallback = function () {
        closeNavbar();
        $portfolioLink.parent().addClass('active');
        $portfolioSection.removeClass("hidden");
        $portfolioSection.velocity({scale: 1}, {duration: 200});
        $('body').addClass('portfolio-section-active');
    };
    hideAllSections(showPortfolioSectionCallback);
});
$("#contact-link").on("click", function () {
    var $contactLink = $(this);
    if ($contactLink.parent().hasClass('active')) {
        hideAllSections(function(){});
        return;
    }

    var $contactSection = $("#contact-section");
    var showContactSectionCallback = function () {
        closeNavbar();
        $contactLink.parent().addClass('active');
        $contactSection.removeClass("hidden");
        $contactSection.velocity({scale: 1}, {duration: 200});
    };
    hideAllSections(showContactSectionCallback);
});
