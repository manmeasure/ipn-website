/**
 * Contains the Node class
 * @param {Object} definition loaded from the JSON file
 */
function Node(definition){
    this.title = definition.title;
    this.icon = definition.icon;
    this.links = definition.links;
    this.radius = this.links ? 60: 30;
    this.color = this.links ? stubColor : childColor;
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    //List of children attached nodes
    this.children = [];

    var self = this;
    if(this.links){
        $.each(this.links, function(index, child){
            var childNode = new Node(child);
            self.children.push(childNode);
            links.push(new Link(self, childNode))
        });
    }

    /**
     * Draws this node
     */
    this.draw = function(){
        fill(this.color);
        stroke(this.color);
        ellipse(this.x, this.y, this.radius, this.radius);
        
        //Now also draw all children
        $.each(this.children, function(index, child){
            child.draw();
        });
    }

    /**
     * Handles the updating of the spheres
     */
    this.update = function(){
        //Now also update all children
        $.each(this.children, function(index, child){
            child.update();
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

    /**
     * Draws the line between the two centers
     */
    this.draw = function(){
        stroke(0);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }

    /**
     * Runs the update function
     */
    this.update = function(){
        var dx = this.a.x - this.b.x;
        var dy = this.a.y - this.b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var diff = (100 - dist) * 0.2;//multiplied by easefactor
        var diffX = (dx * diff) / dist;
        var diffY = (dy * diff) / dist;
        this.a.x += diffX * 0.5;
        this.a.y += diffY * 0.5;
        this.b.x -= diffX * 0.5;
        this.b.y -= diffY * 0.5;
    }
}