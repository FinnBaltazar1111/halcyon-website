let world = document.getElementById("cloud_world");
let viewport = document.getElementById("cloud_viewport");
let objects = [];
let layers = [];
let world_angle_x = 0;
let world_angle_y = 0;
let distance = 0;
let frame_count = 0;
let previous_time = 0;
let previous_frame = 0;
let framerate;
window.addEventListener("mousemove", event => {
  let degrees = 10;
  world_angle_y = -(0.5 - (event.clientX / window.innerWidth)) * degrees;
  world_angle_x = (0.5 - (event.clientY / window.innerHeight)) * degrees;
  update_view();
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
window.addEventListener("scroll", event => {
  let pos = document.documentElement.scrollTop || document.body.scrollTop;
  let max = document.documentElement.scrollHeight || document.body.scrollHeight;
  distance = (pos / max) * 2400;
  update_view();
})
function update_view() {
  world.style.transform = `
    translateZ(${distance}px)
    rotateX(${world_angle_x}deg)
    rotateY(${world_angle_y}deg)
  `;
}
function generate() {
  objects = [];
  layers = [];
  if (world.hasChildNodes()) {
    while (world.childNodes.length >= 1) {
      world.removeChild(world.firstChild);
    }
  }

  for (let i = 0; i < 5; i++) {
    objects.push(create_cloud());
  }
}
function create_cloud() {
  let cloud_base = document.createElement("div");
  cloud_base.className = "cloud_base";

  let cloud_x = -window.innerWidth / 4 + Math.random() * window.innerWidth / 2;
  let cloud_y = Math.random() * window.innerHeight / 2;
  let cloud_z = Math.random() * 200;

  cloud_base.style.transform = `
    translateX(${cloud_x}px)
    translateY(${cloud_y}px)
    translateZ(${cloud_z}px)
  `;
  world.append(cloud_base);

  let iterations = 5 + Math.round(Math.random() * 10);
  for (let i = 0; i < iterations; i++) {
    let cloud_layer = document.createElement("div");
    let data = {
      x: -256 + Math.random() * 512,
      y: -170 + Math.random() * 340,
      z: -256 + Math.random() * 512,
      rotation: Math.random() * 360,
      scale: 1 + Math.random(),
      speed: -1 / 32 + Math.random() / 16
    };
    cloud_layer.className = "cloud_layer";
    cloud_layer.style.transform = `
      translateX(${data.x}px)
      translateY(${data.y}px)
      translateZ(${data.z}px)
      rotateZ(${data.rotation}deg)
      scale(${data.scale})
    `;
    cloud_layer.data = data;

    cloud_base.append(cloud_layer);
    layers.push(cloud_layer);
  }

  return cloud_base;
}
function timer() {
  let now = performance.now() / 1000;
  framerate = (frame_count - previous_frame) / (now - previous_time);
  previous_frame = frame_count;
  previous_time = now;
}
function apply_rotations() {
  for (let layer of layers) {
    let data = layer.data;
    data.rotation += data.speed;
    data.rotation %= 360;
  }
}

function update() {
  for (let layer of layers) {
    let data = layer.data;

    layer.style.transform = `
      translateX(${data.x}px)
      translateY(${data.y}px)
      translateZ(${data.z}px)
      rotateY(${-world_angle_y}deg)
      rotateX(${-world_angle_x}deg)
      rotateZ(${data.rotation}deg)
      scale(${data.scale})
    `;
  }

  frame_count++;
  requestAnimationFrame(update);
}

update();
setInterval(timer, 500);
setInterval(apply_rotations, 50 / 3);
