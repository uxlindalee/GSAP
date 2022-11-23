// KR Unicode 시작 44032
const $sectionIntro = $wrap.querySelector('.section-intro');



//Let Korean word to be splited into characters
String.prototype.toKorChars = function() { 
  var cCho = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ], 
      cJung = [ 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ' ], 
      cJong = [ '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ], cho, jung, jong; 
  let str = this, 
      cnt = str.length, 
      chars = [], 
      cCode; 
  for (let i = 0; i < cnt; i++) { 
    cCode = str.charCodeAt(i); 
    if (cCode == 32) { 
      chars.push(" ");
      continue;
    }
    if (cCode < 0xAC00 || cCode > 0xD7A3) { 
      chars.push(str.charAt(i)); continue; 
    } 
    cCode = str.charCodeAt(i) - 0xAC00; 

    jong = cCode % 28; 
    jung = ((cCode - jong) / 28 ) % 21 
    cho = (((cCode - jong) / 28 ) - jung ) / 21 

    chars.push(cCho[cho]);
    chars.push(String.fromCharCode( 44032 + (cho * 588) + (jung  * 28)));
    if (cJong[jong] !== '') { 
      chars.push(String.fromCharCode( 44032 + (cho * 588) + (jung  * 28) + jong ));
    }
  } 
  return chars; 
}


//  To be typed
let result  = "안녕하세요 저는 NAVER 입니다";
let typeing1=[];
result = result.split('');


//Split the words into vowels
for(let i =0; i<result.length; i++){
  typeing1[i]=result[i].toKorChars();
}

let resultDiv = document.getElementsByClassName("output")[0];
var text = "",
    i=0,
    j=0, 
    imax = typeing1.length,
    isPause = false,
    isReset = false,
    timer;

function startTimer() {
  isPause = false;
  if (isReset == true) {
    isReset = false;
    timer = setInterval(function() {
      typing();
    }, 100)
  } else {
    timer = setInterval(function() {
      typing();
    }, 100)
  }
}

function stopTimer() {
  clearInterval(timer);
  isPause = true;
}

function resetTimer() {
  clearInterval(timer);
  isPause = true;
  isReset = true;
  i = 0;
  text = "";
}

function typing() {
  if(i<=imax-1) {
    var jmax = typeing1[i].length;
    resultDiv.innerHTML = text + typeing1[i][j];
    j++;
    if(j==jmax){
      text+=  typeing1[i][j-1];
      i++;
      j=0;
    }
  } else {
    stopTimer();
  }
}

gsap.to('.output-text', {
  duration: 3,
  scrollTrigger: {
    trigger: $sectionIntro,
    toggleActions: "restart none reverse none",
    start: 'top center',
    end: 'bottom bottom',
    onEnter: function() { startTimer() },
    onEnterBack: function() { startTimer() },
    onLeave: function () { resetTimer() },
    onLeaveBack: function () { resetTimer() },
  },
});