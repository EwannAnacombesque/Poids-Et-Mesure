function mouseReleased(){
  for (const point of points){
    point.is_selected = false;
  }
}

function mousePressed(){
  if (selected_point){
    selected_point = 0;
    return
  }

  // Grab a point
  if (!keyIsPressed){
    for (const point of points){
      if (sqrt((point.x-mouseX)**2+(point.y-mouseY)**2)<10){
        // If a point is grabbed, change its status and register it 
        selected_point = point
        selected_point.is_selected = true;
        
        // Set its velocity as zero
        selected_point.vx = 0;
        selected_point.vy = 0;
        
        
        break
      }
    }
    return
  }
  
  // Create a new point or a set of point

  points.push(new Point(mouseX,mouseY,selected_point_weight,is_point_fixed))
  
  switch (selected_generator){
    case 0:
      createWeb()
      break
    case 2:
      createHexagon()
      break;
    case 3:
      createChains()  
  }



  
}

function keyPressed(){
  switch (keyCode){
    // GRAVITY
    case LEFT_ARROW: 
      gx -= 1;
      break;
    case UP_ARROW: 
      gy -= 1;
      break
    case RIGHT_ARROW: 
      gx += 1;
      break
    case DOWN_ARROW: 
      gy += 1;
      break
    // DRAG
    case 83:
      cx -= 0.1;
      cy -= 0.1;
      break
    case 90:
      cx += 0.1;
      cy += 0.1;
      break
    // STOP AND PLAY
    case 32:
      dt = dt ? 0 : 0.1;
      break
    case 82:
      createMap()
      break;
    case 27:
      wave_mode = !wave_mode;
      break;
    case 13:
      selected_preset = (selected_preset + 1) % 4
      createMap()
      break
    case 80:
      selected_generator = (selected_generator + 1) % 4
      break
    case 79:
      is_point_fixed = !is_point_fixed
      break
    case 66:
      are_springs_breakable = !are_springs_breakable;
      break
  }

  if (keyCode ==77){
    points[points.length-2].x += 0
    points[points.length-2].y += 10
  }
}

function mouseWheel(event) {
  selected_point_weight = min(30,max(1,selected_point_weight+event.delta/500)) 

}
 
function drawIndicator(){
  switch (selected_generator){
    case 3:
      stroke(255)
      strokeWeight(5)
      noFill()
      circle(0.025*screen_width,0.95*screen_height,20)
      break;
    case 1:
      fill(255)
      circle(0.025*screen_width,0.95*screen_height,20)
      break;
    case 2:

      stroke(255)
      strokeWeight(5)
      noFill()
      beginShape()
      vertex(0.020*screen_width,0.93*screen_height)
      vertex(0.030*screen_width,0.93*screen_height)
      vertex(0.037*screen_width,0.95*screen_height)
      vertex(0.030*screen_width,0.97*screen_height)
      vertex(0.020*screen_width,0.97*screen_height)
      vertex(0.013*screen_width,0.95*screen_height)
      vertex(0.020*screen_width,0.93*screen_height)
      endShape()
      break
    case 0:
      stroke(255)
      strokeWeight(5)
      noFill()
      line(0.025*screen_width,0.95*screen_height,0.023*screen_width,0.98*screen_height)
      line(0.025*screen_width,0.95*screen_height,0.025*screen_width,0.92*screen_height)
      line(0.025*screen_width,0.95*screen_height,0.033*screen_width,0.95*screen_height)
      line(0.025*screen_width,0.95*screen_height,0.011*screen_width,0.96*screen_height)
      line(0.025*screen_width,0.95*screen_height,0.011*screen_width,0.91*screen_height)
    break
  }
  stroke(255)
  strokeWeight(5)
  if (is_point_fixed){
    line(0.065*screen_width,0.95*screen_height,0.095*screen_width,0.95*screen_height)
    line(0.065*screen_width,0.95*screen_height,0.078*screen_width,0.92*screen_height)
    line(0.080*screen_width,0.95*screen_height,0.093*screen_width,0.92*screen_height)
    line(0.095*screen_width,0.95*screen_height,0.108*screen_width,0.92*screen_height)
  }
  else{
    line(0.065*screen_width,0.95*screen_height,0.095*screen_width,0.95*screen_height)
    line(0.080*screen_width,0.95*screen_height,0.080*screen_width,0.98*screen_height)
    
  }
      
  fill(255)
  circle(0.135*screen_width,0.95*screen_height,selected_point_weight)
}