///-- About Poids et mesure --///
// Spring simulation based on Hooke's Law, illustration of phonon phenomen, and mecanical waves propagation
// Differents presets are available, to study and play with springs
//- Controls -//
//     -Press ENTER to switch between presets 

//     -Press any KEY and LEFT CLICK to create a spring
//     -Press P to switch between spring generation presets (see first indicator)
//     -Press O to change spring ends types : static or moving ones (see second indicator)
//     -SCROLL mouse WHEEL, to change newly created point weight (see third indicator)

//     -Press LEFT CLICK on a point, to grab and move it
//     -Press any ARROW KEY to add gravity in this direction
//     -Press B to make the springs breakable
//     -Press Z or S to add or remove drag (frictions)
//     -Press SPACE to stop the time
//     -Presss ESCAPE to switch between velocity-based color mode, and normal one

///-- A propos de Poids et mesure --///
// La simulation de ressorts se base sur la loi d'Hooke, peut servir d'illustration à ce qu'est un phonon,
// Et peut illustrer la propagation d'ondes mécaniques (conduction thermique, sons)
// Différents préréglages sont à disposition, pour jouer et observer les ressorts, 
// leurs intreractions. Le gros du code de la simulation est dans la class spring,
// le reste étant accessoire.
//- Contrôles -//
//     -Appuyer sur ENTRÉE pour changer de préréglage 

//     -Appuyer sur n'importe quelle touche et clique gauche pour placer un ressort ou une structure
//     -Appuyer sur P pour changer de structure de ressort (première icone)
//     -Appuyer sur O pour définir la staticité des points (seconde icone)
//     -Scroller pour changer le poids du point créé (troisième icone)

//     -Press LEFT CLICK on a point, to grab and move it
//     -Appuyer sur une touche directionnelle pour ajouter de la gravité orientée
//     -Appuyer sur B pour rendre le ressort cassable (limite modifiable dans le code)
//     -Appuyer sur Z ou S pour ajouter / enlever des frottements
//     -Appuyer sur ESPACE pour mettre en pause
//     -Appuyer sur ÉCHAP pour changer le mode de couleur, du normal, à celui basé sur la vitesse des points


const screen_width = 950;
const screen_height = screen_width*9/16;
const DEFAULT_BREAKABLE_LIMIT = 900;
const DEFAULT_GENERATED_SPRING_STRENGTH = 2;
const DEFAULT_GENERATED_SPRING_LENGTH = 45;


function setup() {
  dt= 0.05
  selected_preset = 0
  selected_generator = 0
  is_point_fixed = false
  are_springs_breakable = false
  selected_point_weight = 5
  
  createCanvas(screen_width, screen_height);
  collision_box = [0,0,screen_width,screen_height]

  createMap()
  selected_point = 0;
  
}

function draw() {
  background(16,15,21);
  
  updateElements()
  drawElements()
  updateUX()
}

function updateUX(){
  drawIndicator()
  if (mouseIsPressed || selected_point != 0){
    selected_point.x = mouseX
    selected_point.y = mouseY

  }
  
  if (!mouseIsPressed){
    selected_point = 0;
  }
}

function updateElements(){
  // Set back acceleration to 0 or gravity
   for (const point of points){
    point.resetAcceleration()
  }
  
  // Update the acceleration of the points
  for (const spring_object of springs){
    spring_object.applyRestoringForce()
  }
  
  // Change points positions, velocities etc
  for (const point of points){
    if (!point.anchored){
    point.update()
    }
  }
  
  // Break springs if there is too much stress
  if (! are_springs_breakable){
    return
  }
  for (const spring_object of springs){
    if (spring_object.stress > DEFAULT_BREAKABLE_LIMIT){
      springs.splice(springs.indexOf(spring_object),1)
    }
  }
}

function drawElements(){
  // Draw the springs
  for (const spring_object of springs){
    spring_object.draw()
  }
  
  // Draw the points
  noStroke()
  for (const point of points){
    point.draw()
  }
  
}

class Spring{
  constructor(point_1,point_2,distance=45,strength=2){
    // Ends of the spring
    this.p1 = point_1;
    this.p2 = point_2;
    
    // Distance to the neutral point //
    this.l = distance//random(50,100)
    // Quantity of stress (=R1+R2 - g*strength)
    this.strength = strength

    // Decorative
    this.color = color(random(0,255),random(0,255),random(0,255))

  }
  applyRestoringForce(){
    ///- A string apply a restoring force to both its ends X and X' -///
    ///- /!\ The frame is oriented to the bottom /!\ -///
    
    //   Focusing on X : 
    //   Each spring has its strength, and its neutral point L
    //   Neutral point l is relative to the other end of the spring X'
    //   Hooke's law gives the expression R = kdl ; k a constant
    //                                            ; dL = L - X or X - L
    
    //   Second Law of Newton : Sum(Fext) = ma, Sum(Fext) = W + R
    //   And so given W = mg : W + R = ma -> a = R/m + g
    //   By projecting on axes, designating by θ the angle between X and X' 
    //                          so we get dLx = L*cos(θ), dly = L*sin(θ)
    //   And so ax = k * (x'+L*cos(θ)-x)/m and g is applied at the very beginning
    let angle = atan2(this.p1.y-this.p2.y,this.p1.x-this.p2.x)
    
    
   
    // Apply restoring force to the first point
    this.p1.ax += this.strength*(this.p2.x+this.l*cos(angle)-this.p1.x)/this.p1.m;
    this.p1.ay += this.strength*(this.p2.y+this.l*sin(angle)-this.p1.y)/this.p1.m;
    
    // Apply restoring force to the second point 
    this.p2.ax += this.strength*(this.p1.x-this.l*cos(angle)-this.p2.x)/this.p2.m;
    this.p2.ay += this.strength*(this.p1.y-this.l*sin(angle)-this.p2.y)/this.p2.m;
  
    this.stress = max(0,this.p1.m*sqrt(this.p1.ax**2 + this.p1.ay**2) + this.p2.m*sqrt(this.p2.ax**2 + this.p2.ay**2) -gy*this.strength); 


  }
  draw(){
    // Make sure to draw the spring with the right color
    stroke(wave_mode ? (this.p1.vx*this.p1.vx+this.p1.vy*this.p1.vy+this.p2.vx*this.p2.vx+this.p2.vy*this.p2.vy)/2 : this.color)
    strokeWeight(max(1,5-sqrt(this.stress)/8))
    // Draw the spring 
    line(this.p1.x,this.p1.y,this.p2.x,this.p2.y)
  }
}

class Point{
  constructor(x,y,m,anchored){
    //- Point's vectors coordinates -//
    // Position 
    this.x = x;
    this.y = y;
    // Velocity
    this.vx = 0;
    this.vy = 0;
    // Acceleration
    this.ax = 0;
    this.ay = 0;
    
    //- Point's attributes -//
    // Point mass
    this.m = m
    // Static point
    this.anchored = anchored;
    // Elasticity
    this.elasticity = 0.7;
    this.is_selected = false;

  }

  resetAcceleration(){
    // Make sure the acceleration is resetted at each tick
    this.ax = gx
    this.ay = gy
    // Apply weight force, g cause y is oriented to the bottom
  }
  update(){
    if (!this.is_selected){
    // Air friction 
    this.ax -= this.vx*cx
    this.ay -= this.vy*cy
    
    // a = dv/dt => dv = a*dt
    this.vx += this.ax*dt ;
    this.vy += this.ay*dt ;
    
    // v = dx/dt => dx = v*dt
    this.x += this.vx*dt ;
    this.y += this.vy*dt
    }
    
    if (this.y >= collision_box[3]){
      this.y = collision_box[3]
      this.vy = - this.vy*this.elasticity
    }
    if (this.y <= collision_box[1]){
      this.y = collision_box[1]
      this.vy = - this.vy*this.elasticity
    }
    if (this.x <= collision_box[0]){
      this.x = collision_box[0]
      this.vx = - this.vx*this.elasticity
    }
    if (this.x  >= collision_box[2]){
      this.x = collision_box[2]
      this.vx = - this.vx*this.elasticity
    }
  }
  draw(){
    fill(wave_mode ? this.vx*this.vx+this.vy*this.vy : 255)
    // Draw the point proportionnaly to its mass
    circle(this.x,this.y,10+int(this.m/2))

  }
}