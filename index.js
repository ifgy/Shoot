// const { svg } = require("./d3");

d3.select("svg").style("background-color", "purple");


d3.selectAll("p").style("font-size", "30px");

d3.select("svg").on("mousemove", function(e){
    let p = d3.pointer(e);
    d3.select("image").attr("x", p[0])
        .attr("y", p[1])
        .style("transform","translateX(-7px) translateY(-7px)")
})

let tab=[];

setInterval(function(){

    let aleat_y = Math.floor(Math.random()*100);

    d3.select("svg").append("image")
        .attr("xlink:href","images/cat.png")
        .attr("x", "100")
        .attr("y", aleat_y)
        .attr("width", "15px")
        .attr("class", "cat")
    
    var x_cat = parseInt(d3.select(".cat").attr("x"));
    var y_cat = aleat_y;

    tab.push([x_cat,y_cat]);

}, 1000)


tab.forEach( )
while(x_cat>0){
    x_cat = x_cat - 10;
    d3.select(".cat").attr("x", x_cat);
}
