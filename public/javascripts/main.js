jQuery(document).ready(function ($) {

  // Header fixed and Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
      $('#header').addClass('header-fixed');
    } else {
      $('.back-to-top').fadeOut('slow');
      $('#header').removeClass('header-fixed');
    }
  });

  if ($(this).scrollTop() > 100) {
    $('.back-to-top').fadeIn('slow');
    $('#header').addClass('header-fixed');
  }

  $('.back-to-top').click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // Initiate the wowjs animation library
  new WOW().init();

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 300
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function (e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function (e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function (e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll on page hash links
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if (!$('#header').hasClass('header-fixed')) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Gallery - uses the magnific popup jQuery plugin
  $('.gallery-popup').magnificPopup({
    type: 'image',
    removalDelay: 300,
    mainClass: 'mfp-fade',
    gallery: {
      enabled: true
    },
    zoom: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out',
      opener: function (openerElement) {
        return openerElement.is('img') ? openerElement : openerElement.find('img');
      }
    }
  });

  // Gallery Show Toggle
  $('#show-hidden-menu').click(function () {
    $('.theimages').slideToggle("slow");
    $('#galarrow').toggleClass("fa-arrow-circle-down");
    $('#galarrow').toggleClass("fa-arrow-circle-up");
  });

  // Company Form EWaste Add
  $(document).ready(function () {
    let maxField = 10; //Input fields increment limitation
    let addButton = $('.addwastec'); //Add button selector
    let wrapper = $('.ewastewrapc'); //Input field wrapper
    let fieldHTML = '<div class="form-row extrawasteinput"><div class="form-group col-lg-6">\n' +
        '                    <select required class="form-control typeselect" name="etype[]" data-rule="required">\n' +
        '                      <option class="hidden" selected disabled value="" >E-waste type</option>\n' +
        '                      <option value="Batteries">Batteries</option>\n' +
        '                      <option value="Cellphone">Cellphone</option>\n' +
        '                      <option value="Computer">Computer</option>\n' +
        '                      <option value="Fax machine">Fax machine</option>\n' +
        '                      <option value="Microwave">Microwave</option>\n' +
        '                      <option value="Printer">Printer</option>\n' +
        '                      <option value="Receiver">Receiver</option>\n' +
        '                      <option value="Refrigerator">Refrigerator</option>\n' +
        '                      <option value="Television">Television</option>\n' +
        '                      <option value="Others">Others</option>\n' +
        '                    </select>\n' +
        '                    <div class="validation"></div>\n' +
        '                  </div>\n' +
        '                  <div class="form-group col-lg-5">\n' +
        '                    <input type="number" name="equantity[]" class="form-control" value="" data-rule="required" placeholder="E-waste Quantity"   />\n' +
        '                    <div class="validation"></div>\n' +
        '                  </div>\n' +
        '                  <div class="form-group col-lg-1">\n' +
        '                    <i style="color: #b21f2d" class="fas fa-minus removewastec"></i>\n' +
        '                  </div> </div>'; //New input field html
    let x = 1; //Initial field counter is 1

    //Once add button is clicked
    $(addButton).click(function () {
      //Check maximum number of input fields
      if (x < maxField) {
        x++; //Increment field counter
        $(wrapper).append(fieldHTML); //Add field html
      }
    });

    //Once remove button is clicked
    $(wrapper).on('click', '.removewastec', function (e) {
      e.preventDefault();
      $(this).parent('div').parent('div').remove(); //Remove field html
      x--; //Decrement field counter
    });

    $(wrapper).on('change', '.typeselect', function (e) {
      e.preventDefault();
      let othertype = '<div class="form-group col-lg-11 extrat"><input type="text" name="etype[]" class="form-control"  placeholder="EWaste Type"/><div/>';
      if ($(this).val() === 'Others') {
        $(this).parent('div').parent('div').append(othertype);
        $(this).attr('name', 'type');
      } else {
        $(this).attr('name', 'etype[]');
        $(this).parent('div').siblings(".extrat").remove();
      }
    });
  });
  // Individual Form EWaste Add
  $(document).ready(function () {
    let maxField = 10; //Input fields increment limitation
    let addButton = $('.addwastei'); //Add button selector
    let wrapper = $('.ewastewrapi'); //Input field wrapper
    let fieldHTML = '<div class="form-row extrawasteinput"><div class="form-group col-lg-6">\n' +
        '                    <select required class="form-control typeselect" name="etype[]" data-rule="required">\n' +
        '                      <option class="hidden" selected disabled value="" >E-waste type</option>\n' +
        '                      <option value="Batteries">Batteries</option>\n' +
        '                      <option value="Cellphone">Cellphone</option>\n' +
        '                      <option value="Computer">Computer</option>\n' +
        '                      <option value="Fax machine">Fax machine</option>\n' +
        '                      <option value="Microwave">Microwave</option>\n' +
        '                      <option value="Printer">Printer</option>\n' +
        '                      <option value="Receiver">Receiver</option>\n' +
        '                      <option value="Refrigerator">Refrigerator</option>\n' +
        '                      <option value="Television">Television</option>\n' +
        '                      <option value="Others">Others</option>\n' +
        '                    </select>\n' +
        '                    <div class="validation"></div>\n' +
        '                  </div>\n' +
        '                  <div class="form-group col-lg-5">\n' +
        '                    <input type="number" name="equantity[]" class="form-control" value="" data-rule="required" placeholder="E-waste Quantity"   />\n' +
        '                    <div class="validation"></div>\n' +
        '                  </div>\n' +
        '                  <div class="form-group col-lg-1">\n' +
        '                    <i style="color: #b21f2d" class="fas fa-minus removewastei"></i>\n' +
        '                  </div> </div>'; //New input field html
    let x = 1; //Initial field counter is 1

    //Once add button is clicked
    $(addButton).click(function () {
      //Check maximum number of input fields
      if (x < maxField) {
        x++; //Increment field counter
        $(wrapper).append(fieldHTML); //Add field html
      }
    });

    //Once remove button is clicked
    $(wrapper).on('click', '.removewastei', function (e) {
      e.preventDefault();
      $(this).parent('div').parent('div').remove(); //Remove field html
      x--; //Decrement field counter
    });
    $(wrapper).on('change', '.typeselect', function (e) {
      e.preventDefault();
      let othertype = '<div class="form-group col-lg-11 extrat"><input type="text" name="etype[]" class="form-control"  placeholder="EWaste Type"/><div/>';
      if ($(this).val() === 'Others') {
        $(this).parent('div').parent('div').append(othertype);
        $(this).attr('name', 'type');
      } else {
        $(this).attr('name', 'etype[]');
        $(this).parent('div').siblings(".extrat").remove();
      }
    });

  });
  $(document).ready(function () {
    $(".typeselect").on('change', function () {
      let othertype = '<div class="form-group col-lg-11 extrat"><input type="text" name="etype[]" class="form-control"  placeholder="EWaste Type"/><div/>';
      if ($(this).val() === 'Others') {
        $(this).parent('div').parent('div').append(othertype);
        $(this).attr('name', 'type');
      } else {
        $(this).attr('name', 'etype[]');
        $(this).parent('div').siblings(".extrat").remove();
      }
      return false;
    });
  });
});
