"use strict";
/**
 * Entry point for the JS code. Called when the page is done loading
 */
$(document).ready(function(){
    //Prevent Ajax caching
    $.ajaxSetup({cache: false});
    //Run the initialization function of the IPN website
    ipn.init();
});

/**
 * Main global variable to prevent global namespace pollution
 */
const ipn = {
    author: "Mees Gelein",
    version: "0.0.1",
    menu: "",
    hasHand: false,

    /**
     * Starts loading the main menu data
     */
    init: function(){

        //Load the menu structure json
        $.get('data/structure.json', function(data){
            ipn.menu = data;
            //Create the nav bar now that the data is loaded
            ipn.createNavBar();

            //Load the structure into the graphic
            loadNodes(ipn.menu);
        });
    },

    /**
     * Starts to create the nav bar
     */
    createNavBar: function(){
        //Go through all the menu items
        var html = "";
        for(var i = 0; i < ipn.menu.length; i++){
            var item = navItem.replace(/%TITLE%/g, ipn.menu[i].title);
            item = item.replace(/%ICON%/g, ipn.menu[i].icon);
            html += item;
        }
        //Now append the generated code
        $('#navbar').append(html);
    },

    /**
     * Adds a cursor to the HTML5 canvas
     */
    addCursor: function(){
        if(this.hasHand) return;
        this.hasHand = true;
        $('canvas').addClass('handCursor');
    },

    /**
     * REmoves a cursor from the HTML5 canvas
     */
    removeCursor: function(){
        if(!this.hasHand) return;
        this.hasHand = false;
        $('canvas').removeClass('handCursor');
    },

    /**
     * Shows the content that is provided as html string
     * @param {String} html the html string to display in the popover div
     */
    showContent: function(html){
        //First start animating it into view
        $('#content').removeClass('animated slideOutDown').fadeIn(1000, function(){
            $(this).removeClass('animated slideInUp');
        }).addClass('animated slideInUp');

        //Then set content
        $('#content .container').html(html);

        //And reload the sketch
        reload(true);
    },

    /**
     * Hides the content.
     */
    hideContent: function(html){
        $('#content').removeClass('animated slideInUp').fadeOut(1000, function(){
            $(this).removeClass('animated slideOutDown');
        }).addClass('animated slideOutDown');
    }
}

/**
 * HTML TEMPLATES
 */
const navItem = "<a class='nav-link' onclick='centerStub(\"%TITLE%\")' href='#'><i class='%ICON%'></i>&nbsp;%TITLE%</a>";