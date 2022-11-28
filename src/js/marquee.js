
const marquee = {
	textClass: "marquee__text",
	playClass: "marquee--play",
	spacer: " ",

	getSpanWidth: function (text) {
		const t = document.createElement("span");
		t.classList.add(this.textClass);
		document.body.appendChild(t);

		t.style.height = "auto";
		t.style.width = "auto";
		t.style.position = "absolute";
		t.style.whiteSpace = "no-wrap";
		t.innerHTML = text + " ";

		const width = Math.ceil(t.clientWidth);
		document.body.removeChild(t);
		return width;
	},

	resizeMarquee: function (marquee) {
		if (!marquee.hasAttribute("data-times")) {
			marquee.innerHTML = "";
			marquee.setAttribute("data-times", 0);

			const style = getComputedStyle(marquee, "::before");
			marquee.setAttribute("data-baseduration", parseFloat(style.animationDuration));
		}

		const text = marquee.getAttribute("data-text").trim() + this.spacer;
		const wWidth = window.innerWidth;
		const times = Math.ceil(wWidth / this.getSpanWidth(text));

		if (times != marquee.getAttribute("data-times")) {
			marquee.setAttribute("data-times", times);
			marquee.setAttribute("data-multitext", "");
			for (let i = 0; i < times; i++) {
				marquee.setAttribute("data-multitext", marquee.getAttribute("data-multitext") + text);
			}
		} 
		marquee.style.animationDuration = (marquee.getAttribute("data-baseduration") / 1000) * wWidth + "s";
	},

  init: function (base) {
		const that = this;
		const marqueeElements = document.querySelectorAll(".marquee__inner");
		marqueeElements.forEach(marquee => {
			const text = marquee.innerText + " ";
			marquee.setAttribute("data-text", text);

			that.resizeMarquee(marquee);
			marquee.classList.add(that.playClass);

			window.addEventListener("resize", function () {
				that.resizeMarquee(marquee);
			});
    });
  },
};

marquee.init();

const $sectionLogo = document.querySelector('.section-logo');
let marqueeText = document.querySelector('.marquee p');

const io = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
            marqueeText.classList.remove('marquee--play');
            marqueeText.classList.add('marquee--play');
		} else {
            marqueeText.classList.remove('marquee--play');
		}
	});
});
io.observe($sectionLogo);