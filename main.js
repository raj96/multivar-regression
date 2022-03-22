"use strict";

const rangeMin = 0;
const rangeMax = 1;
const alpha = 0.25;

let xs = [];
let ys = [];
let numberOfThetas = 2;
let lineResolution = 0.1;
let thetas = [];
let fps;

//y = theta1 * x + theta0
function hTheta(x) {
  let retval = 0;
  for (let i = 0; i < numberOfThetas; i++) {
    retval += thetas[i] * Math.pow(x, i)
  }
  return retval;  
}

// for cost = SUM((hTheta(x) - y)^2) / m
function cost() {
  const m = xs.length;
  if (m === 0) return Infinity;
  let costValue = 0;
  for(let i = 0; i < m; i++) {
    costValue += Math.pow((hTheta(xs[i])) - ys[i] ,2)
  }
  costValue /= m;

  return costValue;
}

//for cost = SUM((hTheta(x) - y)^2) / m
function correctThetas() {
  const m = xs.length;
  for (let t = 0; t < numberOfThetas; t++) {
    let error = 0;
    for (let i = 0; i < m; i++) {
      error += 2 * ((hTheta(xs[i]) - ys[i]) * Math.pow(xs[i], t));
    }
    thetas[t] -= alpha * error;
  }
}

function drawLine() {
  strokeWeight(2);
  noFill();
  beginShape();
  for (let x = 0; x <= width; x += lineResolution) {
    drawPoint(x, hTheta(x), true);
  }
  endShape();
}

function drawPoint(x, y, isVertex = false) {
  stroke(255);
  const plotX = map(x, rangeMin, rangeMax, 0, width);
  const plotY = map(y, rangeMax, rangeMin, 0, height);
  if (isVertex) {
    vertex(plotX, plotY);
  } else {
    point(plotX, plotY);
  }
}

function drawDataPoints() {
  strokeWeight(8);
  for(let i = 0; i < xs.length; i++) {
    drawPoint(xs[i], ys[i]);
  }
}

function drawTextInformation() {
  strokeWeight(1);
  fill(255);
  textSize(16);
  let equation = "";
  for (let i = 0; i < numberOfThetas - 1; i++) {
    equation += `${thetas[i].toFixed(2)}x^${i} + `;
  }
  equation = `y = ` + equation + `${thetas[numberOfThetas - 1].toFixed(2)}x^${numberOfThetas - 1}`;
  text(equation, 16, 16);
  text(`Cost Function: ${cost().toFixed(8)}`, 16, 16 * 2 + 1);
  text(`FPS: ${fps}`, 16, 16 * 3 + 1);
  if (frameCount % 30 === 0) {
    fps = frameRate().toFixed(0);
  }
}

function setup() {
  const canvas = createCanvas(document.body.clientWidth, 500);
  canvas.parent("canvas-container")
  background(0);
  stroke(255);
  strokeWeight(2);
  noFill();
  frameRate(144);
  thetas = new Array(numberOfThetas);
  thetas.fill(0);
  fps = frameRate().toFixed(0);
}

function draw() {
  background(0);
  drawLine();
  drawDataPoints();
  drawTextInformation();
  
  if (xs.length > 0) {
    correctThetas();
  }
}

function mousePressed() {
  xs.push(map(mouseX, 0, width, rangeMin, rangeMax));
  ys.push(map(mouseY, 0, height, rangeMax, rangeMin));
}

function resetThetas() {
  thetas.fill(0)
}

function increaseThetas() {
  numberOfThetas += 1;
  thetas.push(0);
}

function decreaseThetas() {
  numberOfThetas-=1;
  if (numberOfThetas <= 2) {
    numberOfThetas = 2;
  }
}

function removeAllPoints() {
  xs = [];
  ys = [];
  resetThetas();
}