//LES VARIABLES
let position = [];
let cat_tab = [];
let poo_tab = [];
let cat_poo = [];
let rat = {
    life:5,
    score:0,
    x : -10,
    y : 0
};
let speed_frequency = 50;
let append_cat_frequency = 3000;
let append_poo_frequency = 1000;
let gamePaused = false;
let cat_come, cat_fast,cat_poop, poo_come, poo_fast, poops_fast;
let message= ["Quel rapidité du click tu as!","Incroyable!", "Attention ils arrivent!", "Noon! Il y en a encore!","Trop fort!","Mais quelle agilité!", "Je n'en crois pas mes yeux!", "Ewww plein de chats","Mon dieu! Un rat!","Oh non ils sont rapides!","Nous sommes damnées","C'est la fin du monde!","Sacrilège!","Allez! Encore un!"];

d3.select("svg").style("background-color", "violet")
    .style("background-image","url('images/background.png')")
    .style("background-repeat","no-repeat")
    .style("background-position","-30 0")
    .style("background-size","cover")
    .style("display","inline-block");
d3.select("body")
    .select(".lives")
    .text(rat.life);
d3.select("body")
    .select(".score")
    .text(rat.score);

//DEPLACEMENT JOUEUR
d3.select("svg").on("mousemove", function(e){
    position = d3.pointer(e);
    rat.y = position[1];
    d3.select("image").attr("x", rat.x)
        .attr("y", rat.y)
        .attr("class","rat");
})

//CREATION ENNEMIS
function append_cat(){
    let aleat_y = Math.floor(1+Math.random()*90);
    let x_cat = 70;
    let vx_cat = Math.floor(1+ Math.random()*2);
    let cat_height;
    if(vx_cat==1){
        cat_height = 6*vx_cat;
    }else{
        cat_height = 2*vx_cat;
    }
    cat_tab.push({x:x_cat,y:aleat_y, vx:vx_cat, height: cat_height});
    d3.select("svg").selectAll(".cat")
        .data(cat_tab)
        .enter()
        .append("image")
        .attr("xlink:href","images/cat.png")
        .attr("x", d => `${d.x}`)
        .attr("y", d => `${d.y}`)
        .attr("vx", d => `${d.vx}`)
        .attr("height", d => `${d.height}`)
        .attr("class", "cat")
}

function attack(){
    cat_tab.forEach(d=> {
        d.x -= d.vx;
    });
    d3.selectAll(".cat")
        .data(cat_tab)
        .attr("x", d => `${d.x}`)
        .attr("y", d => `${d.y}`)
        .attr("height", d => `${d.height}`);
    if(suppressionDansTableau(cat_tab, d=> d.x<0)){
        suppressionCatPoo();
        life();
    } else if (suppressionDansTableau(cat_tab , cat=> 
        suppressionDansTableau(poo_tab, poo => distance(cat, poo) < 5))){
            suppressionCat();
            suppressionPoo();
            score();
    }
}

//CREATION POO ENNEMIS
function append_cat_poo(){

    cat_tab.forEach( cat =>{
        let cp_vx = cat.vx+1;
        cat_poo.push({x:cat.x, y:cat.y, vx:cp_vx});
    })
    d3.select("svg").selectAll(".cat_poo")
        .data(cat_poo)
        .enter()
        .append("image")
        .attr("xlink:href","images/poo.png")
        .attr("x", d => `${d.x}`)
        .attr("y", d => `${d.y}`)
        .attr("vx", d => `${d.vx}`)
        .attr("class", "cat_poo")
}

function attackMore(){
    let max =-30;
    cat_poo.forEach(d=> {
        d.x -= d.vx;
    });
    d3.selectAll(".cat_poo")
        .data(cat_poo)
        .attr("x", d => `${d.x}px`)
        .attr("y", d => `${d.y}px`)
        .attr("vx", d => `${d.vx}px`);
    if(suppressionDansTableau(cat_poo, d=> d.x<-30)){
        suppressionCatPoo();
    } else if (suppressionDansTableau(cat_poo , cat=> distance(cat, rat) < 5)){
        life();
    }
}

//CREATION MISSILES
function append_poo(){
    let y_poo = position[1];
    const vx_poo = 2;
    poo_tab.push({x:rat.x,y:y_poo, vx:vx_poo});
    d3.select("svg").selectAll(".poo")
        .data(poo_tab)
        .enter()
        .append("image")
        .attr("xlink:href","images/poo.png")
        .attr("x", d => `${d.x}`)
        .attr("y", d => `${d.y}`)
        .attr("vx", d => `${d.vx}`)
        .attr("class", "poo")
}

function defend(){
    d3.selectAll(".poo")
        .data(poo_tab);
    poo_tab.forEach(d=> {
        d.x += d.vx;
    })
    d3.selectAll(".poo")
        .attr("x", d => `${d.x}`)
        .attr("y", d => `${d.y}`);
    if(suppressionDansTableau(poo_tab, d=> d.x>70)){
        suppressionPoo();
    };
}

//POINTS DE VIE ET SCORE
function life(){
    rat.life -= 1;
    d3.select("body")
            .select(".lives")
            .text(rat.life);
    if(rat.life <= 0){
        end_game();
    }
}

function score(){
    rat.score += 10;
    d3.select("body")
            .select(".score")
            .text(rat.score);
            
    if(rat.score%100==0 && append_cat_frequency>1000){
        append_cat_frequency-=500;
        append_poo_frequency-=70;
        clearInterval(cat_come);
        clearInterval(poo_come);
        cat_come = setInterval(append_cat, append_cat_frequency);  
        poo_come = setInterval(append_poo, append_poo_frequency);  
    }
    if(rat.score%50==0){
        let i = Math.floor(Math.random()*15);
        d3.select(".message")
            .text(message[i]);
    }
}

//DISTANCE
function distance(a,b) {
    let dx=a.x-b.x;
    let dy=a.y-b.y;
    return Math.sqrt(dx*dx+dy*dy);
}

//SUPPRESSION
function suppressionDansTableau(tableau, critere) {
    let suppression=false;
    for (let i=tableau.length-1; i>=0; i-- ) {
        if (critere(tableau[i])) {
            tableau.splice(i,1);
            suppression=true;
        }
    }
    return suppression;
}

function suppressionCat(){
    let lien = d3.select("svg").selectAll(".cat")
        .data(cat_tab);
    lien.enter()
        .append("use")
        .attr("class", "cat")
        .attr("href", "#def_cat");
    lien.exit()
        .remove();    
    attack();
}

function suppressionPoo(){
    let lien=d3.select("svg").selectAll(".poo")
        .data(poo_tab);
    lien.enter()
        .append("use")
        .attr("class", "poo")
        .attr("href", "#poo");
    lien.exit()
        .remove();       
    defend();
}

function suppressionCatPoo(){
    let lien = d3.select("svg").selectAll(".cat_poo")
        .data(cat_poo);
    lien.enter()
        .append("use")
        .attr("class", "cat_poo")
        .attr("href", "#def_catpoo");
    lien.exit()
        .remove();    
    attackMore();
}


//FIN DE JEU

function end_game(){
    clearInterval(cat_come);
    clearInterval(cat_fast);
    clearInterval(poo_come);
    clearInterval(poo_fast);
    clearInterval(cat_poop);
    clearInterval(poops_fast);
    d3.select("body")
        .append("img")
        .attr("src", "images/end_Game.png")
        .attr("class","end_img");
    d3.select("body")
        .append("button")
        .attr("class","again")
        .text("ENCORE")
        .attr("onClick","again()");
    d3.select(".message")
        .text(`Tu as perdu avec ${rat.score} points :c`)
        .style("color","#FF5555");
}

//PAUSE
function again(){
    window.location.reload();
}

window.onkeydown = function(event) {
    if (event.keyCode == 80 && gamePaused){
            cat_come = setInterval(append_cat, append_cat_frequency); 
            poo_come = setInterval(append_poo, append_poo_frequency);   
            cat_poop = setInterval(append_cat_poo, 2000);   
            cat_fast = setInterval(attack, speed_frequency); 
            poo_fast = setInterval(defend, speed_frequency); 
            poops_fast = setInterval(attackMore, speed_frequency); 
            gamePaused = false;
    }else if(event.keyCode == 80 && gamePaused==false){
        clearInterval(cat_come);
        clearInterval(cat_fast);
        clearInterval(poo_come);
        clearInterval(poo_fast);
        clearInterval(cat_poop);
        clearInterval(poops_fast);
        gamePaused = true;
    }
}

//APPEL FONCTIONS
function game(){
    cat_come = setInterval(append_cat, append_cat_frequency); 
    poo_come = setInterval(append_poo, append_poo_frequency);   
    cat_poop = setInterval(append_cat_poo, 2000);   
    cat_fast = setInterval(attack, speed_frequency); 
    poo_fast = setInterval(defend, speed_frequency); 
    poops_fast = setInterval(attackMore, speed_frequency); 
}

function start(){
    game();
    d3.select("body")
        .select(".start")
        .style("display","none");
}
