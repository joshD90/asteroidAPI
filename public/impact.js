let earthCentre = {
  x: 200,
  y: 200
};

let asteroidCentre = {
  x: 100,
  y: 100
};

let asteroidElem = document.getElementById("impactAsteroid");
let earthElem = document.querySelector('#earthPic');

asteroidElem.style.width = 30 + "px";
earthElem.style.width = 120 + "px";

let collision = false;

function doMove() {

  let id = null;
  clearInterval(id);

  id = setInterval(animateFunc, 5);

  function animateFunc() {
    asteroidElem.style.left = (asteroidCentre.x - 15) + "px";
    asteroidElem.style.top = (asteroidCentre.y - 15) + "px";

    let dx = asteroidCentre.x - earthCentre.x;
    let dy = asteroidCentre.y - earthCentre.y;

    if (Math.sqrt((dx * dx) + (dy * dy)) < (60)) {
      clearInterval(id);
      collision = true;
      doCollision(document.querySelector('.myHidden').value);
    } else {

      collision = false;
      asteroidElem.style.visibility = "visible";
      //document.querySelector(".moreInfoTitle").innerText = "Impact the Asteroid";
      let radTheta = Math.atan2(dy, dx);
      let degreeTheta = radTheta * (180 / Math.PI)
      if (degreeTheta < 0) {
        degreeTheta += 360;
      }
      console.log(degreeTheta);
      asteroidCentre.x += -1 * Math.cos(radTheta);
      asteroidCentre.y += -1 * Math.sin(radTheta);

    }
  }
}

function clickAndDrag(elem, center, radius) {

  const myDiv = document.getElementsByClassName("impactContainerDiv")[0];

  let isDown = false;

  elem.addEventListener('mousedown', function(e) {
    isDown = true;
  }, true);

  document.addEventListener('mouseup', function() {
    isDown = false;
  }, true);

  document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (isDown === true) {

      center.x = event.clientX - myDiv.offsetLeft;
      center.y = event.clientY - myDiv.offsetTop;

      let posx = center.x - radius;
      let posy = center.y - radius;


      elem.style.left = posx + "px";
      elem.style.top = posy + "px";

    };

  })
}

function doCollision(numBombs) {
  if (collision) {
    //document.querySelector(".moreInfoTitle").innerText = "BOOM";
    asteroidElem.style.visibility = "hidden";
    createMushroom(numBombs);
  }

}

function createMushroom(numBombs) {
  console.log("blurgh");
  let mushroomDiv = [];
  let mushroomImg = [];

  for (let i = 0; i < numBombs; i++) {

    mushroomDiv.push(document.createElement("div"));
    mushroomImg.push(document.createElement("img"));

    mushroomImg[i].setAttribute('src', 'mushroomCloud.jpeg');
    mushroomImg[i].style.height = 100 + "px";
    mushroomImg[i].style.width = 100 + "px";
    mushroomImg[i].style.display = "inline-block";
    mushroomDiv[i].style.flex = 1;
    mushroomDiv[i].style.flexBasis = 100 + "px";
    mushroomDiv[i].appendChild(mushroomImg[i]);



    document.querySelector('.bombContainer').appendChild(mushroomDiv[i]);
    //  document.querySelector('.bombContainer').style.
    document.querySelector('.bombContainer').style.visibility = "visible";
    console.log('working');
    console.log((document.getElementsByClassName('bombContainer')[0])) // = "red";
    // console.log("creating");
    console.log(mushroomDiv[0]);

  }
}



clickAndDrag(earthElem, earthCentre, 60);
clickAndDrag(asteroidElem, asteroidCentre, 15);