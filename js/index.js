// IIFE to ensure safe use of $
(function( $ ) {

  // Create plugin
  $.fn.tooltips = function(el) {

    var $tooltip,
      $body = $('body'),
      $el;

    // Ensure chaining works
    return this.each(function(i, el) {
    
      $el = $(el).attr("data-tooltip", i);

      // Make DIV and append to page 
      var $tooltip = $('<div class="tooltip" data-tooltip="' + i + '">' + $el.attr('title') + '<div class="arrow"></div></div>').appendTo("body");

      // Position right away, so first appearance is smooth
      var linkPosition = $el.position();

      $tooltip.css({
        top: linkPosition.top - $tooltip.outerHeight() - 13,
        left: linkPosition.left - ($tooltip.width()/2)
      });

      $el
      // Get rid of yellow box popup
      .removeAttr("alt")

      // Mouseenter
      .hover(function() {

        $el = $(this);

        $tooltip = $('div[data-tooltip=' + $el.data('tooltip') + ']');

        // Reposition tooltip, in case of page movement e.g. screen resize                        
        var linkPosition = $el.position();

        $tooltip.css({
          top: linkPosition.top - $tooltip.outerHeight() + 45,
          left: linkPosition.left - ($tooltip.width()/2) + 55
        });

        // Adding class handles animation through CSS
        $tooltip.addClass("active");

        // Mouseleave
      }, function() {

        $el = $(this);

        // Temporary class for same-direction fadeout
        $tooltip = $('div[data-tooltip=' + $el.data('tooltip') + ']').addClass("out");

        // Remove all classes
        setTimeout(function() {
          $tooltip.removeClass("active").removeClass("out");
          }, 300);

        });

      });

    }

})(jQuery);

$("img[title]").tooltips();

// function changeColor() {
//     //rgb
//     // console.log('event fired');
//     var colors = [0, 0, 0];
//     var hour = new Date().getHours();
//     console.log(hour);

//     //Will get an valid rgb color
//     var color = parseInt(255/24*hour);
//     console.log(color);
//     for(var i = 0; i < colors.length; i++) {
//         colors[i] = color;
//     }
//     //add the color to the element you want:
//     (document.getElementById("parallax")).style.backgroundColor = "rgb("+colors[0] + "," + colors[1] + "," + colors[2] + ")";
//     console.log("event fired. color get:" + "rgb("+colors[0] + "," + colors[1] + "," + colors[2] + ")");
//   }

// changeColor();

$("g.titles").innerHTML = '';

// Particles.
// init
//     ({

//         // normal options
//         selector: '.background',
//         maxParticles: 450,

//         // options for breakpoints
//         responsive: [{
//             breakpoint: 768,
//             options: {
//                 maxParticles: 200,
//                 color: '#48F2E3',
//                 connectParticles: false
//             }
//         }, {
//             breakpoint: 425,
//             options: {
//                 maxParticles: 100,
//                 connectParticles: true
//             }
//         }, {
//             breakpoint: 320,
//             options: {
//                 maxParticles: 0

//                 // disables particles.js
//             }
//         }]
//     });

var slider = {
  
  // Not sure if keeping element collections like this
  // together is useful or not.
  el: {
    slider: $("#slider"),
    allSlides: $(".slide"),
    sliderNav: $(".slider-nav"),
    allNavButtons: $(".slider-nav > a")
  },
  
  timing: 800,
  slideWidth: 300, // could measure this
 
  // In this simple example, might just move the
  // binding here to the init function
  init: function() {
    this.bindUIEvents();
  },
  
  bindUIEvents: function() {
    // You can either manually scroll...
    this.el.slider.on("scroll", function(event) {
      slider.moveSlidePosition(event);
    });
    // ... or click a thing
    this.el.sliderNav.on("click", "a", function(event) {
      slider.handleNavClick(event, this);
    });
    // What would be cool is if it had touch
    // events where you could swipe but it
    // also kinda snapped into place.
  },
  
  moveSlidePosition: function(event) {
    // Magic Numbers =(
    this.el.allSlides.css({
      "background-position": $(event.target).scrollLeft()/6-100+ "px 0"
    });  
  },
  
  handleNavClick: function(event, el) {
    event.preventDefault();
    var position = $(el).attr("href").split("-").pop();
    
    this.el.slider.animate({
      scrollLeft: position * this.slideWidth
    }, this.timing);
    
    this.changeActiveNav(el);
  },
  
  changeActiveNav: function(el) {
    this.el.allNavButtons.removeClass("active");
    $(el).addClass("active");
  }
  
};

slider.init();

ping('http://157.38.121.88').then(function(delta) {
    console.log('Ping time was ' + String(delta) + ' ms');
    $("#status a:before").css("background-color","green");
}).catch(function(err) {
    console.error('Could not ping remote URL', err);
    $("#status a:before").css("background-color","red");
});
