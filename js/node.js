/**
 * Contains the Node class
 * @param {Object} definition loaded from the JSON file
 */
function Node(definition, parent){
    this.title = definition.title;
    this.icon = definition.icon;
    this.links = definition.links;
    this.radius = this.links ? 60: 30;
    this.color = this.links ? stubColor : childColor;
    if(!parent){
        this.x = Math.random() * W;
        this.y = Math.random() * H;
    }else{
        this.x = parent.x + (Math.random() * 100 - 50);
        this.y = parent.y + (Math.random() * 100 - 50);
    }
    //List of children attached nodes
    this.children = [];


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
        this.x = constrain(this.x, this.radius, W - this.radius);
        this.y = constrain(this.y, this.radius, H - this.radius);
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
        stroke(this.color);
        ellipse(this.x, this.y, this.radius, this.radius);
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
    this.l = (nodeA.links && nodeB.links) ? 200 : 80;
    this.deltaL = this.l * 0.1;
    this.angleDelta = 0;

    /**
     * Draws the line between the two centers
     */
    this.draw = function(){
        stroke(linkColor);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }

    /**
     * Runs the update function, keeping 2 nodes at a distance
     */
    this.update = function(){
        this.angleDelta += Math.random() * 0.01;
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
    if(dist > 80) return;
    var diff = (80 - dist);//multiplied by easefactor
    var diffX = (dx * diff) / dist;
    var diffY = (dy * diff) / dist;
    if(!a.links) a.x += diffX * 0.5;
    a.y += diffY * 0.5;
    if(!b.links) b.x -= diffX * 0.5;
    b.y -= diffY * 0.5;
}