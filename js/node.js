"use strict";
/**
 * Contains the Node class
 * @param {Object} definition loaded from the JSON file
 */
function Node(definition, parent){
    /**If this node is currently being highlighted */
    this.highlighted = false;
    /**The title of this node */
    this.title = definition.title;
    /**The icon name for this node */
    this.icon = definition.icon;
    /**Scaling factor */
    this.visibility = 1;
    /**The page this links to, if any at all*/
    this.page = definition.link;
    /**The value of the visibilty (scaling factor) */
    this.visVal = 0;
    /** Depending on the links */
    this.links = definition.links;
    /**Set the normal size of the node depending on type */
    this.radius = this.links ? 60: 30;
    /**Set the maximum size of the node */
    this.highSize = this.radius * 1.1;
    /**Set the minimum size of the node */
    this.lowSize = this.radius;
    /**Set the color depending on the node kind */
    this.color = this.links ? stubColor : childColor;
    /**Load the SVG image from the data directory */
    this.img = loadImage("data/img/" + this.icon.replace(' ', '_') + ".svg");
    /**If we're currently easing to the target coordinates */
    this.easing = false;

    //Get the coordinates depending on if we're providing parent coords
    if(!parent){
        this.x = Math.random() * W;
        this.y = Math.random() * H;
    }else{
        //Else set random coords
        this.x = parent.x + (Math.random() * 100 - 50);
        this.y = parent.y + (Math.random() * 100 - 50);
    }
    //List of children attached nodes
    this.children = [];
    /**This target-x */
    this.tx = this.x;
    /**THis target-y */
    this.ty = this.y;
    /**Holds the original x-value to go back to after being eased */
    this.ox = this.x;

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
        this.x = constrain(this.x, this.radius + sketchBuffer, W - this.radius - sketchBuffer);
        this.y = constrain(this.y, this.radius + sketchBuffer, H - this.radius - sketchBuffer);

        if(this.highlighted){
            this.radius += ((this.highSize) - this.radius) * 0.1;
        }else{
            this.radius += ((this.lowSize) - this.radius) * 0.1;
        }

        this.visVal -= (this.visVal - this.visibility) * 0.2;
        //Ease towards target if that is enabled
        if(this.easing){
            this.x -= (this.x - this.tx) * .1;
            this.y -= (this.y - this.ty) * .1;
        }
    },

    /**
     * Sets easing to true or false and sets the target
     * @param {Boolean} enabled if we're enabling easing.
     * @param {Number} tx (optional)the x-coord
     * @param {Number} ty (optional)the y-coord 
     */
    this.setEasing = function(enabled, targetx, targety){
        this.easing = enabled;
        if(enabled){
            this.ox = this.x;
            this.tx = targetx;
            this.ty = targety;
        }
    },

    /**
     * Draws this node
     */
    this.draw = function(){
        //Don't draw if we don't need to 
        if(this.visVal < 0.01) return;
        //Draw shadow
        fill(shadowColor);
        noStroke();
        ellipse(this.x + 1, this.y + 1, this.radius * 2 * this.visVal, this.radius * 2 * this.visVal);
        //Draw actual body
        fill(this.color);
        //Only highlight shape if it is a mouse over
        if(this.highlighted){
            stroke(lineColor);
            strokeWeight(2);
        }else{
            noStroke();
        }
        ellipse(this.x, this.y, this.radius * 2 * this.visVal, this.radius * 2 * this.visVal);

        if(this.links && showStubs || !this.links && showSubs){
            if(this.visVal >= 0.9){//Keep the barrier at 0.9 to prevent easing problems not reaching exact 1 values
                //Now draw text
                fill(shadowColor);
                noStroke();
                if(!this.links && showSubs){
                    textSize(14);
                }else{
                    textSize(16 * this.visVal);
                }
                var tw = textWidth(this.title);
                var th = textAscent(this.title)  * -.5;
                var offX = (this.radius * 2 - tw) / 2;
                var offY = (this.radius * 2 - th) / 2;
                //If we are a sub and we're focused on a stub
                if(!this.links && showSubs) offY -= 20;
                text(this.title, this.x - this.radius + offX, this.y - this.radius + offY);
                fill(255);
                text(this.title, this.x - this.radius + offX + 1, this.y - this.radius + offY + 1);
            }
        }
        if(!this.showStubs && !this.links ){
            if(this.visVal >= 0.9){//Keep the barrier at 0.9 to prevent easing problems not reaching exact 1 values
                var scale = (this.radius / this.img.width) * 0.8;
                if(showSubs) scale *= 0.6;
                var w =  this.img.width * scale * this.visVal;
                var h = this.img.height * scale * this.visVal;
                var offY = showSubs ? 20 : 0;
                image(this.img, this.x - w * 0.5, this.y - h * 0.5 + offY, w, h);
            }
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
        //If we're showing subs don't highlight a stub
        if(this.links && showSubs) return false;
        var dx = x - this.x;
        var dy = y - this.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        //Now calculate if we're touching
        if(dist <= this.radius * this.visVal){
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
        if(dist <= this.radius * this.visVal){
            if(this.links){//What to do in case of clicking on a stub
                if(!showSubs) centerStub(this.title);
                else zoomOut();
            }else{//What to do in case of clicking on a sub
                this.loadSub();
            }
            return true;
        }
        return false;
    }

    /**
     * Starts to load this sub, if it is one
     */
    this.loadSub = function(){
        var self = this;
        $.get('data/pages/' + this.page, function(data){
            ipn.showContent(data, getBreadCrumb(self), self.page);
        });
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
        if(this.a.visibility > 0 && this.b.visibility > 0){
            stroke(linkColor);
            strokeWeight(1);
            line(this.a.x, this.a.y, this.b.x, this.b.y);
        }
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