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
     * Opens a stub with the provided name
     */
    openStub: function(name){
        console.log("Trying to open: " + name);
    }
}

/**
 * HTML TEMPLATES
 */
const navItem = "<a class='nav-link' onclick='ipn.openStub(\"%TITLE%\")' href='#'><i class='%ICON%'></i>&nbsp;%TITLE%</a>";