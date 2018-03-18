"use strict";
/**
 * Contains the Node class
 * @param {Object} definition loaded from the JSON file
 */
function Node(definition, parent){
    this.highlighted = false;
    this.title = definition.title;
    this.icon = definition.icon;
    this.links = definition.links;
    this.radius = this.links ? 60: 30;
    this.highSize = this.radius * 1.1;
    this.lowSize = this.radius;
    this.color = this.links ? stubColor : childColor;
    this.img = loadImage("data/img/" + this.icon.replace(' ', '_') + ".svg");

    //Get the coordinates depending on stuff
    if(!parent){
        this.x = Math.random() * W;
        this.y = Math.random() * H;
    }else{
        this.x = parent.x + (Math.random() * 100 - 50);
        this.y = parent.y + (Math.random() * 100 - 50);
    }
    //List of children attached nodes
    this.children = [];

    /**
     * Starts spawning links
     */
    this.spawnLinks = function(){
        var self = this;
        var pos = {x: this.x, y: this.y};
        if(this.links){
            $.each(this.links, function(index, child){
                var childNode = new Node(child, pos);
                nodes.push(childNode);
                links.push(new Link(self, childNode))
            });
        }
    }
    /**
     * Keep within bounds
     */
    this.update = function(){
        this.x = constrain(this.x, this.radius + 3, W - this.radius - 3);
        this.y = constrain(this.y, this.radius + 3, H - this.radius - 3);

        if(this.highlighted){
            this.radius += ((this.highSize) - this.radius) * 0.1;
        }else{
            this.radius += ((this.lowSize) - this.radius) * 0.1;
        }
    }

    /**
     * Draws this node
     */
    this.draw = function(){
        //Draw shadow
        fill(shadowColor);
        noStroke();
        ellipse(this.x + 2, this.y + 2, this.radius, this.radius);
        //Draw actual body
        fill(this.color);
        //Only highlight shape if it is a mouse over
        if(this.highlighted){
            stroke(lineColor);
            strokeWeight(2);
        }else{
            noStroke();
        }
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);

        if(this.links && showStubs || !this.links && showSubs){
            //Now draw text
            fill(shadowColor);
            noStroke();
            textSize(16);
            var tw = textWidth(this.title);
            var th = textAscent(this.title)  * -.5;
            var offX = (this.radius * 2 - tw) / 2;
            var offY = (this.radius * 2 - th) / 2;
            text(this.title, this.x - this.radius + offX, this.y - this.radius + offY);
            fill(255);
            text(this.title, this.x - this.radius + offX + 1, this.y - this.radius + offY + 1);
        }

        if(!this.showStubs && !this.links){
            var scale = (this.radius / this.img.width) * 0.8;
            var w =  this.img.width * scale;
            var h = this.img.height * scale;
            image(this.img, this.x - w * 0.5, this.y - h * 0.5, w, h);
        }
    }

    /**
     * This function tests a hit with the specified coordinates
     * @param {Number} x 
     * @param {Number} y 
     * @returns if this was a hit
     */
    this.testHit = function(x, y){
        //Don't change highlighting if we're not showing the stubs
        if(!this.links && !showSubs) return false;
        var dx = x - this.x;
        var dy = y - this.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        //Now calculate if we're touching
        if(dist <= this.radius){
            this.highlighted = true;
            return true;
        }else{
            this.highlighted = false;
        }
        return false;
    }

    /**
     * This function tests a click hit with the specified coordinates
     * @param {Number} x 
     * @param {Number} y 
     * @returns if this was a hit
     */
    this.testClick = function(x, y){
        //Don't change highlighting if we're not showing the stubs
        if(!this.links && !showSubs) return false;
        var dx = x - this.x;
        var dy = y - this.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        //Now calculate if we're touching
        if(dist <= this.radius){
            centerStub(this.title);
            return true;
        }
        return false;
    }
}
/**
 * Creates a link between the two provided nodes
 * @param {Node} nodeA
 * @param {Node} nodeB
 */
function Link(nodeA, nodeB){
    this.a = nodeA;
    this.b = nodeB;
    this.l = (nodeA.links && nodeB.links) ? 200 : 100;
    this.deltaL = this.l * 0.1;
    this.angleDelta = 0;

    /**
     * Draws the line between the two centers
     */
    this.draw = function(){
        stroke(linkColor);
        strokeWeight(1);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }

    /**
     * Runs the update function, keeping 2 nodes at a distance
     */
    this.update = function(){
        this.angleDelta += Math.random() * 0.02;
        var dx = this.a.x - this.b.x;
        var dy = this.a.y - this.b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var diff = ((this.l + this.deltaL * Math.sin(this.angleDelta)) - dist) * 0.2;//multiplied by easefactor
        var diffX = (dx * diff) / dist;
        var diffY = (dy * diff) / dist;
        if(!this.a.links) this.a.x += diffX * 0.5;
        this.a.y += diffY * 0.5;
        if(!this.b.links) this.b.x -= diffX * 0.5;
        this.b.y -= diffY * 0.5;
    }
}
/**
 * Keeps two nodes at least a minimum distance apart
 * @param {Node} nodeA 
 * @param {Node} nodeB 
 */
function keepApart(a, b){
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if(dist > 100) return;
    var diff = (100 - dist);//multiplied by easefactor
    var diffX = (dx * diff) / dist;
    var diffY = (dy * diff) / dist;
    if(!a.links) a.x += diffX * 0.5;
    a.y += diffY * 0.5;
    if(!b.links) b.x -= diffX * 0.5;
    b.y -= diffY * 0.5;
}