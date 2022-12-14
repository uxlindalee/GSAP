const $sectionSvg = document.querySelector(".section-svg");
let path = $sectionSvg.querySelector("#bike-path");

let pathLength = path.getTotalLength();
path.style.strokeDasharray = pathLength + " " + pathLength;
path.style.strokeDashoffset = pathLength;
path.getBoundingClientRect();

window.addEventListener("scroll", function (e) {
	let scrollPercentage = (document.documentElement.scrollTop - $sectionSvg.offsetTop + $sectionSvg.scrollTop) / ($sectionSvg.scrollHeight - window.innerHeight);
	let drawLength = pathLength * scrollPercentage;
	path.style.strokeDashoffset = pathLength - drawLength;

	if (scrollPercentage >= 0.99) {
		path.style.strokeDasharray = "none";
	} else {
		path.style.strokeDasharray = pathLength + " " + pathLength;
	}
});

select = (e) => document.querySelector(e);
selectAll = (e) => document.querySelectorAll(e);

const tubeContainer = select(".stage");
const tubeInner = select(".tube__inner");
const clone = document.getElementsByClassName("line");
const numLines = 10;
const angle = 360 / numLines;
let radius = 0;
let origin = 0;

function set3D() {
	let width = window.innerWidth;
	radius = fontSizePx / 2 / Math.sin((180 / numLines) * (Math.PI / 180));
	origin = `50% 50% -${radius}px`;
}

function clodeNode() {
	for (var i = 0; i < numLines - 1; i++) {
		let newClone = clone[0].cloneNode(true);
		let lineClass = "line--" + (i + 2);
		newClone.classList.add(lineClass);
		tubeInner.appendChild(newClone);
	}
	clone[0].classList.add("line--1");
}

function positionTxt() {
	gsap.set(".line", {
		rotationX: function (index) {
			return -angle * index;
		},
		z: radius,
		transformOrigin: origin,
	});
}

function setProps(targets) {
	targets.forEach(function (target) {
		let paramSet = gsap.quickSetter(target, "css");
		let degrees = gsap.getProperty(target, "rotateX");
		let radians = degrees * (Math.PI / 180);
		let conversion = Math.abs(Math.cos(radians) / 2 + 0.5);

		paramSet({
			opacity: conversion + 0.1,
		});
	});
}

function scrollRotate() {
	gsap.to(".line", {
		scrollTrigger: {
			trigger: ".section-roll",
			scrub: 1,
			start: "top top",
		},
		rotateX: "+=1080",
		onUpdate: function () {
			setProps(this.targets());
		},
	});

	gsap.to(".tube", {
		scrollTrigger: {
			trigger: ".section-roll",
			scrub: 1,
			start: "top top",
		},
		perspective: "1vw",
		ease: "expo.out",
	});
}

function rollInit() {
	clodeNode();
	set3D();
	window.onresize = () => {
		set3D();
		positionTxt();
	};
	positionTxt();
	setProps(gsap.utils.toArray(".line"));
	scrollRotate();
	gsap.to(tubeContainer, { autoAlpha: 1, duration: 2, delay: 2 });
}

window.onload = () => {
	rollInit();
};
