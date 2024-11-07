

$(document).ready(function(){
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 100) {
          $("#toTop").fadeIn();
        } else {
          $("#toTop").fadeOut();
        }
      });
      
      $(document).on("click", "#toTop", function () {
        $("html, body").animate({ scrollTop: 0 }, 500);
      });
});

$(document).ready(function(){
    $('.ct_toggle_icon').click(function(){
        $('.ct_menu_link').addClass('active')
    })
    $('.ct_close_menu_icon').click(function(){
        $('.ct_menu_link').removeClass('active')
    })

    $('.ct_product_slider').owlCarousel({
        center: true,
        dots:true,
        nav:true,
        items:1,
        loop:true,
        stagePadding: 100,
        autoplay:true,
autoplayTimeout:3000 ,
smartSpeed: 1500,
        margin:20,
        responsive:{
            600:{
                items:2
            }
        }
    });


    $('.ct_client_logo_slider').owlCarousel({
        loop:true,
        margin:10,
        autoplay:true,
        smartSpeed: 1000,
        autoplayTimeout:2000 ,
        nav:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }
    })

    AOS.init();

    
})



$(document).ready(function(){
    $('.ct_toggle_side').click(function(){
        $('.ct_dashbaord_main').toggleClass('ct_active')
    })
})



// chart js


var opts = {
    angle: 0, // The span of the gauge arc
    lineWidth: 0.3, // The line thickness
    radiusScale: 0.9, // Relative radius
    pointer: {
      length: 0.42, // // Relative to gauge radius
      strokeWidth: 0.029, // The thickness
      color: '#000000' // Fill color
    },
    limitMax: true,     // If false, max value increases automatically if value > maxValue
    limitMin: true,     // If true, the min value of the gauge will be fixed
    colorStart: '#6F6EA0',   // Colors
    colorStop: '#C0C0DB',    // just experiment with them
    strokeColor: '#EEEEEE',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    // renderTicks is Optional
    // renderTicks: {
    //   divisions: 0,
    //   divWidth: 0.1,
    //   divLength: 0.41,
    //   divColor: '#333333',
    //   subDivisions: 0,
    //   subLength: 0.14,
    //   subWidth: 3.1,
    //   subColor: '#ffffff'
    // },
    staticZones: [
     {strokeStyle: "#F03E3E", min: 70, max: 80}, // Red from 70 to 80
     {strokeStyle: "#FFDD00", min: 80, max: 90}, // Yellow 80 to 90
     {strokeStyle: "#30B32D", min: 90, max: 100}, // Green 90 to 100
    ],
    staticLabels: {
    font: "10px sans-serif",  // Specifies font
    labels: [70, 80, 90, 100],  // Print labels at these values
    color: "#000000",  // Optional: Label text color
    fractionDigits: 0  // Optional: Numerical precision. 0=round off.
  },
    
  };
  var target = document.getElementById('foo'); // your canvas element
  var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
  gauge.maxValue = 100; // set max gauge value
  gauge.setMinValue(70);  // Prefer setter over gauge.minValue = 0
  gauge.animationSpeed = 10; // set animation speed (32 is default value)
  gauge.set(92); // set actual value






