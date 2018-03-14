/**
 * Entry point for the JS code. Called when the page is done loading
 */
$(document).ready(function(){
    //Prevent Ajax caching
    $.ajaxSetup({cache: false});
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
            ipn.menu = JSON.parse(data);
        });
    }
}