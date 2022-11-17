// gsap.registerPlugin(ScrollTrigger);

	const $wrap = document.getElementById("wrap");
	let scroller;
	if (location.search.indexOf("scroller") > -1) {
		scroller = window._scroller($wrap);
	}

	window.addEventListener("load", function () {
		//logo
		const $sectionLogo = $wrap.querySelector(".section-logo");
		gsap.fromTo(
			$sectionLogo.querySelector(".svg-title"),
			{ scale: 10, fill: "#2db400" },
			{
				scale: 0.5,
				fill: "#ffffff",
				ease: "expo.easeOut",
				scrollTrigger: {
					trigger: $sectionLogo,
					// start: "top top",
					end: "bottom bottom",
					scrub: true,
				},
			}
    );
    gsap.fromTo(
      $sectionLogo.querySelector(".text"),
      {opacity:0,
        
    }, {
        opacity: 1, y: 200, duration:1,ease:"linear",
      scrollTrigger: {
					trigger: $sectionLogo,
					start: "top top",
					end: "bottom bottom",
					scrub: true,
				},
      }
    )

		//intro
		const $sectionIntro = $wrap.querySelector(".section-intro");
		let searchBox = $sectionIntro.querySelector(".search-keyword");

		ScrollTrigger.create({
			trigger: $sectionIntro,
			start: "top center",
			end: "bottom bottom",
			onEnter: () => searchTyper(),
			onLeaveBack: () => searchTyper(),
		});
		function searchTyper() {
			searchBox.classList.toggle("on");
		}

		//Tunnel
		const $sectionTunnel = $wrap.querySelector(".section-tunnel");
    const $tunnel = $sectionTunnel.querySelectorAll(".tunnel");
    const $dialogueBox = $sectionTunnel.querySelectorAll(".dialogue-box");
    const $opentalk = $sectionTunnel.querySelectorAll('.opentalk')
    
    gsap.set($tunnel[0], { scale:1 });
    gsap.set($dialogueBox[0], { y:100, opacity: 0 });
    gsap.set($dialogueBox[1], { y:100, opacity: 0 });
    gsap.set($dialogueBox[2], { y:100, opacity: 0 });
    gsap.set($dialogueBox[3], { y:100, opacity: 0 });
    gsap.set($opentalk[0], { x:-900, opacity: 0 });
    gsap.set($opentalk[1], { x:300, opacity: 0 });
    
    const intotheTunnel = gsap.timeline({ pausedt: true });
    intotheTunnel.to($tunnel[0], { scale: 20, duration:5 }, '0')
    
    intotheTunnel.to($dialogueBox[0], {y:-100, opacity:1})
    intotheTunnel.to($dialogueBox[1], {y:0, opacity:1})
    intotheTunnel.to($dialogueBox[2], {y:-100, opacity:1})
    intotheTunnel.to($dialogueBox[3], { y: 0, opacity: 1 })
    
    intotheTunnel.to($opentalk[0],{x:-300, opacity:1})
    intotheTunnel.to($opentalk[1],{x:0, opacity:1})

    ScrollTrigger.create({
			animation: intotheTunnel,
			trigger: $sectionTunnel,
			scrub: 1,
			start: "top -50%",
			end: "bottom bottom",
		});


		// timeline
		const $sectionTimeline = $wrap.querySelector(".section-timeline");
		const $sectionTimelineBoxes = $sectionTimeline.querySelectorAll(".box");
    const $sectionTimelineText = $sectionTimeline.querySelector(".text svg");
    const $zombie = $sectionTimeline.querySelector('.zombie')

		gsap.set($sectionTimelineBoxes[0], { x: -100, lineHeight: 0 });
		gsap.set($sectionTimelineBoxes[1], { x: 100 });
		gsap.set($sectionTimelineBoxes[2], { y: 100, lineHeight: 0 });
    gsap.set($sectionTimelineBoxes[3], { y: -100 });
    gsap.set($sectionTimelineText, {scale:0.02, opacity:0, fill:"#000"})
    gsap.set($zombie, {opacity:0, x:0})

		const timeline = gsap.timeline({ paused: true });
		timeline.to($sectionTimelineBoxes[0], { x: 0, duration: 1, ease: "cubic.out" }, 0);
		timeline.to($sectionTimelineBoxes[1], { x: 0, duration: 1, ease: "cubic.out" }, 0);
		timeline.to($sectionTimelineBoxes[2], { y: 0, duration: 1, ease: "cubic.out" }, 0);
		timeline.to($sectionTimelineBoxes[3], { y: 0, duration: 1, ease: "cubic.out" }, 0);
    
		timeline.to($sectionTimelineBoxes[0], { x: 100, rotation: 180, duration: 1, ease: "back.out(2)" });
		timeline.to($sectionTimelineBoxes[0], { borderRadius: "50%", backgroundColor: "#0f0", duration: 1, ease: "cubic.out" }, 1);
		timeline.to($sectionTimelineBoxes[1], { x: -100, rotation: -180, duration: 1, ease: "back.out(2)" }, 1);
		timeline.to($sectionTimelineBoxes[1], { borderRadius: "50%", backgroundColor: "#f00", duration: 1, ease: "cubic.out" }, 1);
		timeline.to($sectionTimelineBoxes[2], { y: -100, rotation: -180, duration: 1, ease: "back.out(2)" }, 1);
		timeline.to($sectionTimelineBoxes[2], { borderRadius: "50%", backgroundColor: "#00f", duration: 1, ease: "cubic.out" }, 1);
		timeline.to($sectionTimelineBoxes[3], { y: 100, rotation: 180, duration: 1, ease: "back.out(2)" }, 1);
    timeline.to($sectionTimelineBoxes[3], { borderRadius: "50%", backgroundColor: "#000", duration: 1, ease: "cubic.out" }, 1);
    

		timeline.to($sectionTimelineBoxes[0], {
			lineHeight: 100,
			duration: 1,
			ease: "cubic.out",
			onUpdate: function () {
				const progress = $sectionTimelineBoxes[0].style.lineHeight / 100;
				const angle = -Math.PI / 2;
				gsap.set($sectionTimelineBoxes[0], {
					x: Math.cos(progress * angle) * 100,
					y: Math.sin(progress * angle) * 100,
				});
				gsap.set($sectionTimelineBoxes[1], {
					x: Math.cos(progress * angle + Math.PI) * 100,
					y: Math.sin(progress * angle + Math.PI) * 100,
				});
				gsap.set($sectionTimelineBoxes[2], {
					x: Math.sin(progress * angle) * 100,
					y: Math.cos(progress * angle) * 100,
				});
				gsap.set($sectionTimelineBoxes[3], {
					x: Math.sin(progress * angle + Math.PI) * 100,
					y: Math.cos(progress * angle + Math.PI) * 100,
				});
			},
		});
		timeline.to($sectionTimelineBoxes[0], { y: 0, duration: 3, ease: "cubic.out" }, "beforeEnd");
		timeline.to($sectionTimelineBoxes[1], { y: 0, duration: 3, ease: "cubic.out" }, "beforeEnd");
		timeline.to($sectionTimelineBoxes[2], { x: 0, duration: 3, ease: "cubic.out" }, "beforeEnd");
		timeline.to($sectionTimelineBoxes[3], { x: 0, duration: 3, ease: "cubic.out" }, "beforeEnd");
    timeline.to($sectionTimelineBoxes[3], { borderRadius:"0", x: 0, duration: 5, scale: 30, ease: "cubic.out" }, "endFrame");
    timeline.to($sectionTimelineText, { scale: 2, opacity: 1, duration: 5, fill: "#fff" }, "endFrame");
    timeline.to($zombie,{opacity:1, duration:5, x:-200}, )

		ScrollTrigger.create({
			animation: timeline,
			trigger: $sectionTimeline,
			scrub: 1,
			start: "top top",
			end: "bottom bottom",
		});



		// lottie
		const $sectionLottie = $wrap.querySelector(".section-lottie");
		const animation = lottie.loadAnimation({
			container: $sectionLottie.querySelector(".sticky"),
			path: "./lottie/earth.json",
			renderer: "svg",
			loop: false,
			autoplay: false,
		});
		ScrollTrigger.create({
			trigger: $sectionLottie,
			scrub: 2,
			start: "top 90%",
			end: "bottom 20%",
			onUpdate: function (self) {
				animation.goToAndStop(self.progress * (animation.totalFrames - 1), true);
			},
		});

		let startCount = { let: 1 };
		gsap.to(startCount, {
			let: 999,
			duration: 1,
			ease: "linear",
			onUpdate: changeNumber,
			scrollTrigger: {
				trigger: $sectionLottie,
				scrub: true,
				start: "top -100%",
				end: "bottom 350%",
			},
		});

		function changeNumber() {
			let number = $sectionLottie.querySelector(".numberCount");
			number.innerHTML = startCount.let.toFixed();
		}

		// horizontal scroll
		const $sectionHorizontal = $wrap.querySelector(".section-horizontal");
		const $sectionHorizontalInwrap = $sectionHorizontal.querySelector(".img-list");
		const $sectionImageitems = $sectionHorizontalInwrap.querySelectorAll(".listitem");
		const $sectionImagetexts = $sectionHorizontalInwrap.querySelectorAll(".block");
		const $cloud = $sectionHorizontal.querySelector(".cloud");
		const sectionHorizontalInwrapMoveValue = $sectionHorizontal.querySelector(".img-list").scrollWidth - $wrap.offsetWidth;
		$sectionHorizontal.style.height = window.innerHeight + sectionHorizontalInwrapMoveValue + "px";

		gsap.from($sectionImagetexts, { y: 200, color: "#333", duration: 1, ease: "cubic.out" });
		gsap.to($sectionImagetexts[0], {
			y: -100,
			ease: "elastic",
			scrollTrigger: { trigger: $sectionHorizontal, start: "top -10%", end: "bottom bottom", scrub: 1 },
		});
		gsap.to($sectionImagetexts[1], {
			y: -70,
			ease: "elastic",
			scrollTrigger: { trigger: $sectionHorizontal, start: "top -50%", end: "bottom bottom", scrub: 1 },
		});
		gsap.to($sectionImagetexts[2], {
			y: -80,
			ease: "elastic",
			scrollTrigger: { trigger: $sectionHorizontal, start: "top -100%", end: "bottom bottom", scrub: 1 },
		});
		gsap.to($sectionImagetexts[3], {
			y: -70,
			ease: "elastic",
			scrollTrigger: { trigger: $sectionHorizontal, start: "bottom bottom", end: "bottom bottom", scrub: 1 },
		});
		gsap.to($cloud, {
			x: sectionHorizontalInwrapMoveValue,
			ease: "linear",
			scrollTrigger: {
				trigger: $sectionHorizontal,
				start: "top top",
				end: "bottom bottom",
				scrub: true,
				id: "section-horizontal",
			},
		});

		let increaseCount = { let: 1 };
		gsap.to(increaseCount, {
			let: 999,
			duration: 1,
			ease: "linear",
			onUpdate: changePopulation,
			scrollTrigger: {
				trigger: $sectionHorizontal,
				scrub: true,
				start: "top -10%",
				end: "bottom bottom",
			},
		});
		function changePopulation() {
			let number = $sectionHorizontal.querySelector(".numberCount");
			number.innerHTML = increaseCount.let.toFixed();
		}

		gsap.to($sectionHorizontalInwrap, {
			x: -sectionHorizontalInwrapMoveValue,
			ease: "linear",
			scrollTrigger: {
				trigger: $sectionHorizontal,
				start: "top -10%",
				end: "bottom bottom",
				scrub: true,
				id: "section-horizontal",
			},
		});
	});

	let stats = new Stats();
	document.body.appendChild(stats.dom);
	gsap.ticker.add(function () {
		stats.update();
	});
