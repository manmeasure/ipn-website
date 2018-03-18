"use strict";
/**The heigt of the canvas */
const W = 960;
/**The width of the canvas */
const H = 400;
/**List of nodes to draw */
var nodes = [];
/**List of links to draw */
var links = [];
/**Color of the stub */
var stubColor;
/**Color of the child */
var childColor;
/**Color of the links */
var linkColor;
/**Color of shadow */
var shadowColor;
/**Color of the line */
var lineColor;
/**If setup has run already */
var sketchReady = false;
/**Holds the definitions if we need to cache them */
var holdDefs;
/**Show labels on stubs */
var showStubs = true;
/**Show lables on subs */
var showSubs = false;
/**
 * Setup function
 */
function setup(){
    //Set the canvas to scale according to CSS
    $(createCanvas(W, H).canvas).attr('style', '');
    //Set the framerate to 30, this is enough for smooth animation
    frameRate(30);
    //Set the colors
    stubColor = color(85, 116, 127);
    childColor = color(129, 177, 193);
    linkColor = color(124, 169, 186);
    shadowColor = color(0, 0, 0, 100);
    lineColor = color(150, 170, 190);
    //If setup is done, set the flag accordingly
    sketchReady = true;
    //See if we have any cached data
    if(holdDefs) loadNodes(holdDefs);
}
/**
 * Centers on the stub
 * @param {String} name opens the stub of the name
 */
function centerStub(name){
    console.log("Trying to open: " + name);
    //This will hold the node we're trying to center on
    var centerNode;
    //Find the node that we're trying to open
    $.each(nodes, function(index, node){
        node.visibility = 0;
        if(node.title === name){
            centerNode = node;
        }
    });
    centerNode.visibility = 1;
    $.each(nodes, function(index, node){
        $.each(centerNode.links, function(index, link){
            if(node.title == link.title){
                node.visibility = 1;
            }
        });
    });
}

/**
 * Draws every frame
 */
function draw(){
    //First cls
    background(255);
    
    //Then repel all nodes from eachother
    $.each(nodes, function(indexA, nodeA){
        $.each(nodes, function(indexB, nodeB){
            //Same node, do nothing
            if(indexA == indexB) return;

            //Else, repell from eachother
            keepApart(nodeA, nodeB);
        })
    });

    //Update all nodes
    $.each(nodes, function(index, node){
        node.update();
    });

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
        //For these first nodes, set their starting point
        const interval = W / (defNodes.length + 1);
        n.x = interval * (index + 1);
        n.spawnLinks();
        nodes.push(n);
        if(prevNode != undefined) links.push(new Link(prevNode, n));
        prevNode = n;
    });
}

/**
 * Called when the mouse moves in the main canvas
 */
function mouseMoved(){
    var hasHit = false;
    $.each(nodes, function(index, node){
        if(!hasHit && node.testHit(mouseX, mouseY)){
            hasHit = true;
        }
    });
    if(hasHit){
        ipn.addCursor();
    }else{
        ipn.removeCursor();
    }
}

/**
 * Called when the user clicks on the canvas
 */
function mousePressed(){
    $.each(nodes, function(index, node){
        node.testClick(mouseX, mouseY);
    });
}

/**
 * Zooms out to the main overview
 */
function zoomOut(){
    showStubs = true;
    showSubs = false;
}