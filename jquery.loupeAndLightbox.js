/*
jQuery loupeAndLightbox Plugin
  * Version 1.0
  * 05-10-2010
  * Author: M.Biscan
  * requires jQuery1.4.2
  
  Copyright (c) 2010 M.Biscan

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Softwarevent.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function($){
  $.fn.loupeAndLightbox = function(options) { 
    var settings = $.extend({}, $.fn.loupeAndLightbox.defaults, options); 
    
    return this.each(function() {
      var $this = $(this),
          $targetImage = $this.find('> img'),
          $magnifiedImage = $('<img src="' + $this.attr('href') + '" alt="' + $targetImage.attr('alt') + '" />'),
          $loupe = $('<div class="Loupe">'),
          $lightbox = $('<div class="Lightbox">');

      ///////////
      // Setup //
      ///////////      
      $this.css({
        cursor:'default'
      });      
      $loupe.css({
        cursor:'none',
        display:'none',
        border:settings.border,
        height:settings.height,
        overflow:'hidden',
        position:'absolute',
        width:settings.width,
        zIndex:settings.zIndex
      });
      $targetImage.css({
        cursor:'pointer'
      });
      $magnifiedImage.css({
        position:'absolute'
      });
        
      ////////////
      // Events //
      ////////////
      $this.click(function() {
        return false;
      });
      $targetImage.click(function(event) {
        var left = event.pageX,
            top = event.pageY;
            
        attachLoupeAndLightbox();   
        magnify(left, top);
      });
      
      $loupe.mousemove(function(event) {
        var left = event.pageX,
            top = event.pageY,
            offsetTop = $targetImage.offset().top,
            offsetLeft = $targetImage.offset().left,
            offsetBottom = $targetImage.offset().top+$targetImage.height(),
            offsetRight = $targetImage.offset().left+$targetImage.width();
        
        if(left < offsetLeft) {
          var left = offsetLeft;
        } else if(left > offsetRight) {
          var left = offsetRight;
        } 
        if(top < offsetTop) {
          var top = offsetTop;
        } else if(top > offsetBottom) {
          var top = offsetBottom;
        }
        
        magnify(left, top);
      }).click(function() {
        detachLoupeAndLightbox();
      }).mouseleave(function() {
        pulseLoupe();
      });
      
      // Closes the dialog when clicking outside of it
      $(document).click(function(event) {
        if(event.target != this) {
          detachLoupeAndLightbox();
        } 
      });
      
      ///////////////////////
      // Private functions //
      ///////////////////////
      function magnify(left, top) {        
        $loupe
          .css({ 
            left:left-(settings.width/2),
            top:top-(settings.height/2)
          });
          
        var heightDiff = $magnifiedImage.height()/$targetImage.height(),
            widthDiff = $magnifiedImage.width()/$targetImage.width(),
            magnifierTop = (-(top - $targetImage.offset().top)*heightDiff)+(settings.height/2),
            magnifierLeft = (-(left - $targetImage.offset().left)*widthDiff)+(settings.width/2);
            
        $magnifiedImage.css({
            top:magnifierTop,
            left:magnifierLeft
        });
      };
      
      function attachLoupeAndLightbox() {
        $loupe
          .appendTo('body')
          .fadeIn(settings.fadeSpeed)
          .append($magnifiedImage);
              
        if(settings.lightbox == true) {  
          attachLightbox();
        }
      };
      
      function detachLoupeAndLightbox() {
        $loupe.fadeOut(settings.fadeSpeed, function() {
          $(this).detach();
          $magnifiedImage.detach();
        });
        
        if(settings.lightbox == true) {  
          detachLightbox();
        }
      };
      
      function attachLightbox() {        
        $lightbox
          .appendTo('body')
          .css({
            background:'#000',
            height:$(document).height(),     
            left:0,
            position:'absolute',
            top:0,
            width:$(document).width(),
            zIndex:98,
            'opacity':0.75,
            'filter':'alpha(opacity=75)'
          })
          .fadeIn(settings.fadeSpeed);
      };
      
      function detachLightbox() {
        $lightbox.fadeOut(settings.fadeSpeed, function() {
          $(this).detach();
        });
      };
      
      function pulseLoupe() {
        $loupe.fadeTo(150, 0.25, function() {
          $(this).fadeTo(150, 1.0);
        });
      };
    });
  };

  ////////////////////
  // Default optons //
  ////////////////////
  $.fn.loupeAndLightbox.defaults = {
    zIndex:1000,
    width:150,
    height:150,
    border:'2px solid #ccc',
    fadeSpeed:250,
    lightbox:true
  };
})(jQuery);