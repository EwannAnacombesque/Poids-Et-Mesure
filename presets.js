function resetPhysics(default_cx=0,default_cy=0,default_gx=0,default_gy=0,default_wave_mode=false){
  cx = default_cx
  cy = default_cy
  gx = default_gx
  gy = default_gy
  wave_mode = default_wave_mode
  selected_point = 0
  points = []
  springs = []
}

function createMap(){ 
  switch (selected_preset){
    case 0:
      pofPreset();
      break;
    case 1:
      wavesPreset();
      break;
    case 2:
      tissuePreset();
      break;
    case 3:
      blankPreset();
      break;
  }
}    

function blankPreset(){
  resetPhysics()
}

function pofPreset(){
  resetPhysics(0,0)
  points.push(new Point(200,150,5,true))
  points.push(new Point(200,250,10,false))
  springs.push(new Spring(points[0],points[1],75))
  
  points.push(new Point(100,150,5,true))
  points.push(new Point(100,250,5,false))
  springs.push(new Spring(points[2],points[3],51))
  
  points.push(new Point(150,150,5,true))
  points.push(new Point(150,250,5,false))
  springs.push(new Spring(points[4],points[5],50))
  
  
  points.push(new Point(350,150,5,false))
  points.push(new Point(450,150,5,false))
  points.push(new Point(450,250,5,false))
  points.push(new Point(350,250,5,false))
  springs.push(new Spring(points[6],points[7]))
  springs.push(new Spring(points[7],points[8]))
  springs.push(new Spring(points[8],points[9]))
  springs.push(new Spring(points[9],points[6]))

  points.push(new Point(600,150,5,false))
  points.push(new Point(625,250,8,false))
  points.push(new Point(580,180,5,false))
  points.push(new Point(605,170,2,false))
  springs.push(new Spring(points[10],points[11]))
  springs.push(new Spring(points[10],points[12]))
  springs.push(new Spring(points[10],points[13]))
}

function tissuePreset(){
  resetPhysics(0.3,0.3)
  xn = 10
  yn = 10
  l = 0.045*screen_width
  ls = sqrt(l*l + l*l)

  
  for (let i=0;i<xn;i+=1){
    for (let j=0;j<yn;j+=1){
      points.push(new Point((screen_width-(xn-1)*l)/2+l*i,(screen_height-(yn-1)*l)/2+l*j,5,false))
  }}

  
    
  for (let i=0;i<xn;i+=1){
    for (let j=0;j<yn;j+=1){
      if (i+1 < xn){
        springs.push(new Spring(points[j+i*yn],points[j+(i+1)*yn],l))
      }
      if (j-1 >=0){
        springs.push(new Spring(points[j+i*yn],points[(j-1)+i*yn],l))
      }
      if (j-1 >=0 && i+1 < xn){
        springs.push(new Spring(points[j+i*yn],points[(j-1)+(i+1)*yn],ls))
      }
      if (j-1 >=0 && i-1 >= 0){
        springs.push(new Spring(points[j+i*yn],points[(j-1)+(i-1)*yn],ls))
      }
  }}
}

function wavesPreset(){
  resetPhysics(0.3,0.3,0,0,true)
  xn = 25
  yn = 10
  l = 0.033*screen_width
  ls = sqrt(l*l + l*l)
  
  
  for (let i=0;i<xn;i+=1){
    for (let j=0;j<yn;j+=1){
      points.push(new Point((screen_width-(xn-1)*l)/2+l*i,(screen_height-(yn-1)*l)/2+l*j,5,((i==0 && j==0) || (i==0 && j==yn-1) || (j==0 && i==xn-1) ||(j==yn-1 && i==xn-1))))
  }}

  
    
  for (let i=0;i<xn;i+=1){
    for (let j=0;j<yn;j+=1){
      if (i+1 < xn){
        springs.push(new Spring(points[j+i*yn],points[j+(i+1)*yn],l,100))
      }
      if (j-1 >=0){
        springs.push(new Spring(points[j+i*yn],points[(j-1)+i*yn],l,100))
      }
      if (j-1 >=0 && i+1 < xn){
        springs.push(new Spring(points[j+i*yn],points[(j-1)+(i+1)*yn],ls,100))
      }
      if (j-1 >=0 && i-1 >= 0){
        springs.push(new Spring(points[j+i*yn],points[(j-1)+(i-1)*yn],ls,100))
      }
  }}
}

function createHexagon(){
  let center_id = points.length-1
  for(let i=0;i<6;i++){
      points.push(new Point(mouseX+50*cos(i*PI/3),mouseY+50*sin(i*PI/3),selected_point_weight,is_point_fixed))
      springs.push(new Spring(points[center_id],points[points.length-1],DEFAULT_GENERATED_SPRING_LENGTH,DEFAULT_GENERATED_SPRING_STRENGTH))
      if (i>=1){
      springs.push(new Spring(points[points.length-2],points[points.length-1],DEFAULT_GENERATED_SPRING_LENGTH,DEFAULT_GENERATED_SPRING_STRENGTH))
      }
    }
    springs.push(new Spring(points[points.length-6],points[points.length-1],DEFAULT_GENERATED_SPRING_LENGTH,DEFAULT_GENERATED_SPRING_STRENGTH))
}

function createWeb(){
    for (let i=0;i<points.length-1;i++){
      springs.push(new Spring(points[i],points[points.length-1],DEFAULT_GENERATED_SPRING_LENGTH,DEFAULT_GENERATED_SPRING_STRENGTH))
      
    }
}

function createChains(){
  if (points.length>3){
      springs.pop()
    }
    if (points.length>1){
      
      springs.push(new Spring(points[points.length-2],points[points.length-1],DEFAULT_GENERATED_SPRING_LENGTH,DEFAULT_GENERATED_SPRING_STRENGTH))
    }
    if (points.length>2){
      springs.push(new Spring(points[0],points[points.length-1],DEFAULT_GENERATED_SPRING_LENGTH,DEFAULT_GENERATED_SPRING_STRENGTH))
    
    }
}

