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
    /**If there is currently a mouse over icon */
    hasHand: false,
    /**If we're currently showing content */
    showingContent: false,

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
     * @param {String} breadcrumb the html to set as breadcrumb
     */
    showContent: function(html, breadcrumb){
        this.showingContent = true;
        //First start animating it into view
        $('#content').removeClass('animated slideOutDown').fadeIn(1000, function(){
            $(this).removeClass('animated slideInUp');
        }).addClass('animated slideInUp');

        //Then set content
        $('#content .container').html(html);
        $('#breadcrumb').html(breadcrumb);

        //And reload the sketch
        reload(true);
    },

    /**
     * Hides the content.
     */
    hideContent: function(html){
        this.showingContent = false;
        $('#content').removeClass('animated slideInUp').fadeOut(1000, function(){
            $(this).removeClass('animated slideOutDown');
        }).addClass('animated slideOutDown');
    },

    /**
     * Tries to read the variable with the name from the url vars
     */
    getURLVar: function(name){
        //If no URL vars are defined, return undefined
        if(window.location.href.indexOf('?') == -1) return undefined;
        //Else split on that char
        var url = window.location.href.split("?")[1];
        var vars = url.split("&");
        var found = undefined;
        $.each(vars, function(index, variable){
            var parts = variable.split('=');
            if(parts[0] == name) found = parts[1];
        });
        return found;
    }
}

/**
 * HTML TEMPLATES
 */
const navItem = "<a class='nav-link' onclick='centerStub(\"%TITLE%\")' href='#'><i class='%ICON%'></i>&nbsp;%TITLE%</a>";