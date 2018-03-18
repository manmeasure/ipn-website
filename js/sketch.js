/**The heigt of the canvas */
const W = 960;
/**The width of the canvas */
const H = 500;
/**List of nodes to draw */
var nodes = [];
/**List of links to draw */
var links = [];
/**Color of the stub */
var stubColor;
/**Color of the child */
var childColor;
/**If setup has run already */
var sketchReady = false;
/**Holds the definitions if we need to cache them */
var holdDefs;
/**
 * Setup function
 */
function setup(){
    //Set the canvas to scale according to CSS
    $(createCanvas(W, H).canvas).attr('style', '');
    //Set the framerate to 30, this is enough for smooth animation
    frameRate(30);
    //Set the colors
    stubColor = color(255, 0, 0);
    childColor = color(0, 255, 0);
    //If setup is done, set the flag accordingly
    sketchReady = true;
    //See if we have any cached data
    if(holdDefs) loadNodes(holdDefs);
}

/**
 * Draws every frame
 */
function draw(){
    //First cls
    background(255);

    //Update all links
    $.each(links, function(index, link){
        link.update();
    }) 
    //Draw all links
    $.each(links, function(index, link){
        link.draw();
    })
    //Draw all nodes
    $.each(nodes, function(index, node){
        node.draw();
    });
}

/**
 * Starts to load the array of nodes that is the menu
 * @param {Array} defNodes 
 */
function loadNodes(defNodes){
    //If the skecth is not ready yet, hold the data untill it is
    if(!sketchReady) {
        holdDefs = defNodes;
        return;
    }
    //The previous node
    var prevNode;
    $.each(defNodes, function(index, node){
        var n = new Node(node);
        nodes.push(n);
        if(prevNode != undefined) links.push(new Link(prevNode, n));
        prevNode = n;
    });
}