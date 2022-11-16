const $sectionSvg = document.querySelector('.section-svg');
let path = $sectionSvg.querySelector('#bike-path');

// Get length of path... ~577px in this case
let pathLength = path.getTotalLength();

// Make very long dashes (the length of the path itself)
path.style.strokeDasharray = pathLength + ' ' + pathLength;

// Offset the dashes so the it appears hidden entirely
path.style.strokeDashoffset = pathLength;
path.getBoundingClientRect();

// When the page scrolls...
window.addEventListener("scroll", function(e) {
 
  // What % down is it? 
  // Had to try three or four differnet methods here. Kind of a cross-browser nightmare.
  let scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    
  // Length to offset the dashes
  let drawLength = pathLength * scrollPercentage;
  path.style.strokeDashoffset = pathLength - drawLength;
    
  if (scrollPercentage >= 0.99) {
    path.style.strokeDasharray = "none";
  } else {
    path.style.strokeDasharray = pathLength + ' ' + pathLength;
  }
});






		//roll
		select = e => document.querySelector(e);
		selectAll = e => document.querySelectorAll(e);
		
		// const $sectionRoll = select('.section-roll');
		const stage = select('.stage');
		const tubeInner = select(".tube__inner");
		const clone = document.getElementsByClassName("line"); // as need to update node list
		const numLines = 10;
		const fontSize = gsap.getProperty(':root', '--fontSize');
		const angle = 360/numLines;
		let radius = 0;
		let origin = 0;
		
		function set3D() {
			let width = window.innerWidth;
			let fontSizePx = (width/100)*fontSize;
			radius = (fontSizePx/2)/Math.sin((180/numLines)*(Math.PI/180)); // using Pythagoras Eq
			origin = `50% 50% -${radius}px`;
		}
		
		function clodeNode() {
			
			for (var i = 0; i < (numLines-1); i++) {
				let newClone = clone[0].cloneNode(true); // clone the header
				let lineClass = "line--"+(i+2); // create class name to append
				newClone.classList.add(lineClass); // add incremented line class
				tubeInner.appendChild(newClone); // append the clone
			}
			
			clone[0].classList.add("line--1"); // add line1 class to the first node
		}
		
		function positionTxt() {
			gsap.set('.line', {
				rotationX: function(index) {
					return -angle*index;
				},
				z: radius,
				transformOrigin: origin
			});
		}
		
		function setProps(targets) {
			targets.forEach( function(target) {
				let paramSet = gsap.quickSetter(target, "css");
				let degrees = gsap.getProperty(target, "rotateX");
				let radians = degrees * (Math.PI/180);
				let conversion = Math.abs(Math.cos(radians) / 2 + 0.5); // 1 - 0 half cosine wave
				let fontW = 200 + 700*conversion;
				let fontS = `${100 + 700*conversion}%`;
		
				paramSet({
					opacity: conversion+0.1, 
					fontWeight: fontW, 
					fontStretch: fontS 
				});
				console.log(fontW);
			})
		}
		
		function scrollRotate() {
			gsap.to('.line', {
				scrollTrigger: {
					trigger: '.section-roll',
					scrub: 1,
					start: "top top",
				},
				rotateX: "+=1080",
				onUpdate: function() {
					setProps(this.targets());
				}
			})
			
			gsap.to('.tube', {
				scrollTrigger: {
					trigger: '.section-roll',
					scrub: 1,
					start: "top top"
				},
				perspective: '1vw',
				ease: 'expo.out'
			})
		}
		
		function rollInit() {
			clodeNode();
			set3D();
			window.onresize = () => {
				set3D();
				positionTxt();
			}
			positionTxt(); 
			setProps(gsap.utils.toArray(".line"));
			scrollRotate();
			gsap.to(stage, { autoAlpha: 1, duration: 2, delay: 2 });
		}
		
		window.onload = () => {
			rollInit();
		};





