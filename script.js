/**
 * Created by c on 2015/3/26.
 */
function startTime () {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  h = checkTime(h);
  s = checkTime(s);
  document.getElementById('text').innerHTML = h+":"+m+":"+s;
  var t =  setTimeout(function() {startTime ();}, 500);
}

function checkTime(i) {
  if (i<10) {
    i = "0" + i;
  }
  return i;
}

startBtn = document.getElementById("start");
stopBtn = document.getElementById("stop");
resetBtn = document.getElementById("reset");

var startMS, startS, startM;
var showMS = 0, showS = 0, showM = 0;
var cacheMS = 0, cacheS = 0, cacheM = 0;
var currSetTimeOutId = null;
var hasCallSetTimeOutId = false;
var used = false;   //used to tell if newly called or continue from last calling startCount method
var running = false;//used to indicate the state of running


startBtn.onclick = function(event){
  //when the timer is running, variable is set to true
  //so, it won't work if click start button when running
  if(!running){
    startCount ();
  }
};

stopBtn.onclick = function (event) {
  //to be accurate, we call clearTimeout method firstly,
  //then store show-variable to cache-variable
  clearTimeout(currSetTimeOutId);
  running = false;
  hasCallSetTimeOutId = true;
  cacheMS = showMS;
  cacheS  = showS;
  cacheM  = showM;
};

resetBtn.onclick = function (event) {
  if(!hasCallSetTimeOutId) {
    clearTimeout(currSetTimeOutId);
  }
  cacheMS = 0;
  cacheS = 0;
  cacheM = 0;
  used = false;
  hasCallSetTimeOutId = false;
  running = false;
  document.getElementById('minute').innerHTML = "0";
  document.getElementById('second').innerHTML = "0";
  document.getElementById('millisecond').innerHTML = "0";
};

function startCount () {
  running = true;
  var startPoint = new Date();
  startMS = startPoint.getMilliseconds();
  startS = startPoint.getSeconds();
  startM = startPoint.getMinutes();
  if(!used) {
    used = true;
  }
  else {
    if(startMS<cacheMS) {
      --startS;
      startMS = 1000 + startMS - cacheMS;
      if (startMS >1000) {
        ++startS;
        startMS = startMS % 1000;
      }
    }
    else {
      startMS = startMS - cacheMS;
    }

    if(startS<cacheS){
      --startM;
      startS = 60 + startS - cacheS;
      if (startS > 60) {
        ++startM;
        startS = startS % 60;
      }
    }
    else{
      startS = startS - cacheS;
    }

    if(startM < cacheM) {
      startM = 60 + startM - cacheM;
    }
    else {
      startM = startM - cacheM;
    }

  }

  checkNow();
}

function checkNow() {
  var currMS,  currS,  currM;
  var currPoint = new Date();
  currMS = currPoint.getMilliseconds();
  currS = currPoint.getSeconds();
  currM = currPoint.getMinutes();

  //initialize variables used to show every time when calling checkNum method
  //showMS, showS, showM should be the result by making a difference of related component
  showMS = 0, showS = 0, showM = 0;

  //we need to borrow 1 from second component if (currMS<startMS)
  if(currMS<startMS){
    --currS;
    showMS = 1000+currMS-startMS;
    if(showMS>1000) {
      ++showS;
      showMS = showMS % 1000;
    }
  }
  else {
    showMS = currMS - startMS;
  }

  if(currS<startS) {
    --currM;
    showS += 60 + currS - startS;
    if(showS>60){
      ++showM;
      showS = showS % 60;
    }
  }
  else {
    showS += currS - startS;
  }

  //when leaving the timer running, finding the minute turns to be negative
  //realizing that starts from 5:56, when it comes to 6:00
  //the minute component become zero, that is the problem
  if(currM < startM) {
    showM += 60 + currM - startM;
  }
  else {
    showM += currM - startM;
  }



  //document.getElementById('text').innerHTML = showM+":"+showS+":"+showMS;
  document.getElementById('minute').innerHTML = showM;
  document.getElementById('second').innerHTML = showS;
  //document.getElementById('millisecond').innerHTML = showMS;
  var showMSOneBit = (showMS - showMS % 100) / 100;
  document.getElementById('millisecond').innerHTML = showMSOneBit;
  currSetTimeOutId = setTimeout(checkNow, 50);
}
