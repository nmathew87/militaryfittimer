/*
Timer functions for each workout in the set
*/

// global variables
var workoutTime = 0;
var getReadyTimer = 0;

var timerText = document.querySelector('.timedisplay');
var getReadyText = document.querySelector('.getready');

var settimerpage = document.querySelector('.settimerpage');
var daysummarypage = document.querySelector('.daysummarypage');
var successpage = document.querySelector('.successcompletionpage');

var id = 0;
var getreadyId = 0;
var audio = new Audio('assets/sounds/beep.mp3');


var setcounter = 1;
var exercisecounter = 1;
var exercisesInSet = 0;
var dayData;

var getReadyTextSteps = 
[
    '<span style="color:grey">Get Ready</span>', 
    '<span style="color:grey"><span style="color:red">G</span>et Ready</span>', 
    '<span style="color:grey"><span style="color:red">Ge</span>t Ready</span>', 
    '<span style="color:grey"><span style="color:red">Get</span> Ready</span>', 
    '<span style="color:grey"><span style="color:red">Get R</span>eady</span>', 
    '<span style="color:grey"><span style="color:red">Get Re</span>ady</span>', 
    '<span style="color:grey"><span style="color:red">Get Rea</span>dy</span>', 
    '<span style="color:grey"><span style="color:red">Get Read</span>y</span>', 
    '<span style="color:grey"><span style="color:red">Get Ready</span></span>' 
]


console.log(workouts)

function startGetReadyTimer()
{
    getReadyTimer = 0;
    getreadyId = setInterval(updateGetReadyTimer, 500);

    getReadyText.style.display = 'flex';
    timerText.style.display = 'none';

    getReadyText.innerHTML = getReadyTextSteps[getReadyTimer];
    
}

function updateGetReadyTimer() {

    getReadyTimer += 1;
    getReadyText.innerHTML = getReadyTextSteps[getReadyTimer];

    if (getReadyTimer >= 9)
    {
        clearInterval(getreadyId);
        audio.play();

        startWorkoutTimer();

    }


}




function startWorkoutTimer() {
    workoutTime = dayData.set.exercises[exercisecounter].time;

    id = setInterval(updateTimer, 1000) // per second

    timerText.style.display = 'flex';
    getReadyText.style.display = 'none';

    writeTimerValue();

}

function updateTimer() {
    
    workoutTime -= 1;

    writeTimerValue();

    if (workoutTime <= 0) {
      clearInterval(id)
      console.log("Timer complete");
    
      // play a beep
      audio.play();

      // switch to next workout
      exercisecounter += 1;

     

      updatePageToNextWorkout();
    }

  }

  function writeTimerValue()
  {
    var minutes = Math.floor(workoutTime / 60);
    var seconds = workoutTime % 60;
    timerText.innerHTML = minutes + ':' + seconds; 
  }

// Using spacebar to control the workout timer


window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
      
        // prevent default space bar behaviour to scroll
        e.preventDefault();

        // start the timer
        startTimer(5);
    }
  });

// document.body.onkeyup = function(e){
//     if(e.keyCode == 32){
//         //your code

//         startTimer(30);

//     }
// }


/*
Set database functions
*/

function startDay(dayIndex)
{
    settimerpage.style.display = 'flex';
    daysummarypage.style.display = 'none';
    successpage.style.display = 'none';

    dayData = workouts[dayIndex];

    // reset all counters
    setcounter = 1;
    exercisecounter = 0;
    exercisesInSet = dayData.set.exercises.length;

    console.log("exercises in set = " + exercisesInSet);

    document.getElementById("setindicator").innerHTML = "Set " + setcounter + " of 3";
    // start with first workout
    updatePageToNextWorkout();
}


// run after timer is done each time
function updatePageToNextWorkout() {

    if (exercisecounter < exercisesInSet)
    {
        document.getElementById("workoutdesc").innerHTML = dayData.set.exercises[exercisecounter].name;
        document.getElementById("workoutimage").src = dayData.set.exercises[exercisecounter].image;

        var time = dayData.set.exercises[exercisecounter].time;

         // update percentage fill bar
        document.getElementById("filler").style.width = (exercisecounter/exercisesInSet)*100 + "%";

        //startTimer(time);
        startGetReadyTimer();
        
    }
    else
    {
        if (setcounter < 3)
        {
            // next set
            setcounter += 1;
            exercisecounter = 0;

            document.getElementById("workoutdesc").innerHTML = dayData.set.exercises[exercisecounter].name;
            document.getElementById("workoutimage").src = dayData.set.exercises[exercisecounter].image;
    
            var time = dayData.set.exercises[exercisecounter].time;
            
            // updtae set indicator
            document.getElementById("setindicator").innerHTML = "Set " + setcounter + " of 3";

             // update percentage fill bar
            document.getElementById("filler").style.width = (exercisecounter/exercisesInSet)*100 + "%";
    

            //startTimer(time);
            startGetReadyTimer();

        }
        else {
            // day complete

            settimerpage.style.display = 'none';
            daysummarypage.style.display = 'none';
            successpage.style.display = 'flex';

        }
    }



}

/*
Functions if i need to read a json file.
It only works if JSON file is hosted on server. Not local files for security reasons.
*/

// function readTextFile(file, callback) {
//     var rawFile = new XMLHttpRequest();
//     rawFile.overrideMimeType("application/json");
//     rawFile.open("GET", file, true);
//     rawFile.onreadystatechange = function() {
//         if (rawFile.readyState === 4 && rawFile.status == "200") {
//             callback(rawFile.responseText);
//         }
//     }
//     rawFile.send(null);
// }

//usage:
// readTextFile("workouts.json", function(text){
//     var data = JSON.parse(text);
//     console.log(data);
// });

