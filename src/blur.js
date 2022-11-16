  const _flowMotion = () => {
    const flowWrap = document.querySelector(".flow");
    const textBox = document.querySelector(".text-box");
    let nameArr = ["ORANGE", "BANANA", "APPLE", "MANGO", "STRAWBERRY", "KIWI"];
    let counter = 0;

    const _addText = () => {
      for (let i = 0; i < nameArr.length; i++) {
        let textTag = document.createElement("span");
        textTag.classList.add("text");
        textTag.innerText = nameArr[i];
        textBox.appendChild(textTag);
      }

      let raf = requestAnimationFrame(_addText);

      if (innerWidth * 2 <= textBox.offsetWidth) {
        cancelAnimationFrame(raf);
        if (counter < 2) {
          for (let i = 0; i < nameArr.length; i++) {
            let textTag = document.createElement("span");
            textTag.classList.add("text");
            textTag.innerText = nameArr[i];
            textBox.appendChild(textTag);
          }
        }
      }
    };

    let time = Date.now();
    let speed = 0.1;
    let moveDistance = 0;
    let raf;

    const _flowText = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - time;
      time = currentTime; //same time will be used 

      if (moveDistance < textBox.offsetWidth / 2) {
        moveDistance += speed * deltaTime;
      } else {
        moveDistance = 0;
      }
      textBox.style.transform = `translate3d(-${moveDistance}px,0,0)`;
      raf = requestAnimationFrame(_flowText);
    };

    _addText();

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          _flowText();
        } else {
          cancelAnimationFrame(raf);
        }
      });
    });

    io.observe(flowWrap);
  };





  