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

    /**
     * Starts loading the main menu data
     */
    init: function(){
        //Load the menu structure json
        $.get('data/structure.json', function(data){
            ipn.menu = data;
            //Create the nav bar now that the data is loaded
            ipn.createNavBar();
        });
    },

    /**
     * Starts to create the nav bar
     */
    createNavBar: function(){
        //Go through all the menu items
        var html = "";
        for(var i = 0; i < ipn.menu.length; i++){

        }
    }
}