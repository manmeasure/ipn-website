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

            //Create the structure in the network model
            ipn.createSVG();
        });
    },

    /**
     * Creates the SVG network model
     */
    createSVG: function(){
        for(var i = 0; i < ipn.menu.length; i++){
            //Go through every stub
            var stub = ipn.menu[i];
            for(var j = 0; j < stub.links.length; j++){
                //For every link in this stub
            }
        }
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