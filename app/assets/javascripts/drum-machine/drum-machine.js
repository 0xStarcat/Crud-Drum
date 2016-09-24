// Create the object that contains functions that use web audio to
// make sound.


$(document).ready(function()
{
  //setUp();
});
  var screen;
  //var pattern;
  var current_pattern;



function Pattern(clip_number, width){

  var self = this;
  this.id = makeId();
  this.clip_number = clip_number;
  this.width = width;
  this.pattern = []
  this.data = {
    // `step` represents the current step (or beat) of the loop.
    step: 0,

    // `tracks` holds the six tracks of the drum machine.  Each track
    // has a sound and sixteen steps (or beats).
    tracks: [createTrack("gold", note(audio, 880)),
             createTrack("gold", note(audio, 659)),
             createTrack("gold", note(audio, 587)),
             createTrack("gold", note(audio, 523)),
             createTrack("gold", note(audio, 440)),
             createTrack("dodgerblue", kick(audio))]
  };
  this.setupButtonClicking = function() {

  // Every time the user clicks on the canvas...
  document.querySelector("#"+self.id).addEventListener("click", function(e) {

    // ...Get the coordinates of the mouse pointer relative to the
    // canvas...
    var p = { x: e.offsetX, y: e.offsetY };

    // ...Go through every track...
    self.data.tracks.forEach(function(track, row) {

      // ...Go through every button in this track...
      track.steps.forEach(function(on, column) {

        // ...If the mouse pointer was inside this button...
        if (isPointInButton(p, column, row, self.BUTTON_SIZE)) {
          console.log(self.BUTTON_SIZE)
          // ...Switch it off if it was on or on if it was off.
          track.steps[column] = !on;

          if (track.steps[column])
          {
            self.pattern.push({step: column, track: row})
          }
          else
          {
            var remove_index = self.pattern.indexOf({column, row})
            self.pattern.splice (remove_index, 1)
          }
        }
      });
    });
  });
};
  this.draw = function() {

    // Clear away the previous drawing.
    self.screen.clearRect(0, 0, self.screen.canvas.width, self.screen.canvas.height);

    // Draw all the tracks.
    drawTracks(self.screen, self.data, self.BUTTON_SIZE)

    // Draw the pink square that indicates the current step (beat).
    drawButton(self.screen, self.data.step, self.data.tracks.length, "deeppink", self.BUTTON_SIZE);

    // Ask the browser to call `draw()` again in the near future.
    requestAnimationFrame(self.draw);
  };

  (this.setUp = function(width)
  {
    var screen_id = $('<canvas id='+self.id+' width="'+width+'px" height="'+(width*0.45)+'px"></canvas>');//document.querySelector("#screen")
    $('#song_container').append(screen_id);
    self.screen = document.querySelector('#'+self.id).getContext("2d");
    self.BUTTON_SIZE = (self.screen.canvas.width / 16)/ 1.5;
    self.setupButtonClicking();

    self.draw();
  })(width)
}

var audio = new AudioContext();

// Create the data for the drum machine.

function loadPattern(pattern)
{
  var load_data = JSON.parse(pattern.coords);
  console.log("PATTERN", pattern)
  clearKit();
  current_pattern.pattern = [];
  //row = data.tracks
  //column = data.tracks[i].steps
  load_data.forEach(function(block)
  {
    //console.log(block);
    current_pattern.data.tracks[block["track"]].steps[block["step"]] = true;
    current_pattern.pattern.push({step: block["step"], track: block["track"]})
  })
}

function clearKit()
{
  for (var i = 0; i < current_pattern.data.tracks.length; i++)
  {
    for (var j = 0; j < current_pattern.data.tracks[i].steps.length; j++)
    {
      current_pattern.data.tracks[i].steps[j] = false;
    }
  }
}
  // Update
  // ------

  // Runs every hundred milliseconds.


  // Draw
  // ----

  // Get the `screen` object.  This is a bundle of functions that draw
  // in the canvas element.

  // **draw()** draws the drum machine.  Called once at the beginning of
  // the program.  It's then called 60 times a second forever (see the
  // call to `requestAnimationFrame()` below).


  // Handle events
  // -------------

  // **setupButtonClicking()** sets up the event handler that will make
  // mouse clicks turn track buttons on and off.


  // **note()** plays a note with a pitch of `frequency` for `1` second.
  function note(audio, frequency) {
    return function() {
      var duration = 1;

      // Create the basic note as a sine wave.  A sine wave produces a
      // pure tone.  Set it to play for `duration` seconds.
      var sineWave = createSineWave(audio, duration);

      // Set the note's frequency to `frequency`.  A greater frequency
      // produces a higher note.
      sineWave.frequency.value = frequency;

      // Web audio works by connecting nodes together in chains.  The
      // output of one node becomes the input to the next.  In this way,
      // sound is created and modified.
      chain([

        // `sineWave` outputs a pure tone.
        sineWave,

        // An amplifier reduces the volume of the tone from 20% to 0
        // over the duration of the tone.  This produces an echoey
        // effect.
        createAmplifier(audio, 0.2, duration),

        // The amplified output is sent to the browser to be played
        // aloud.
        audio.destination]);
    };
  };

  // **kick()** plays a kick drum sound for `1` second.
  function kick(audio) {
    return function() {
      var duration = 2;

      // Create the basic note as a sine wave.  A sine wave produces a
      // pure tone.  Set it to play for `duration` seconds.
      var sineWave = createSineWave(audio, duration);

      // Set the initial frequency of the drum at a low `160`.  Reduce
      // it to 0 over the duration of the sound.  This produces that
      // BBBBBBBoooooo..... drop effect.
      rampDown(audio, sineWave.frequency, 160, duration);

      // Web audio works by connecting nodes together in chains.  The
      // output of one node becomes the input to the next.  In this way,
      // sound is created and modified.
      chain([

        // `sineWave` outputs a pure tone.
        sineWave,

        // An amplifier reduces the volume of the tone from 40% to 0
        // over the duration of the tone.  This produces an echoey
        // effect.
        createAmplifier(audio, 0.4, duration),

        // The amplified output is sent to the browser to be played
        // aloud.
        audio.destination]);
    };
  };

  // **createSineWave()** returns a sound node that plays a sine wave
  // for `duration` seconds.
  function createSineWave(audio, duration) {

    // Create an oscillating sound wave.
    var oscillator = audio.createOscillator();

    // Make the oscillator a sine wave.  Different types of wave produce
    // different characters of sound.  A sine wave produces a pure tone.
    oscillator.type = "sine";

    // Start the sine wave playing right now.
    oscillator.start(audio.currentTime);

    // Tell the sine wave to stop playing after `duration` seconds have
    // passed.
    oscillator.stop(audio.currentTime + duration);

    // Return the sine wave.
    return oscillator;
  };

  // **rampDown()** takes `value`, sets it to `startValue` and reduces
  // it to almost `0` in `duration` seconds.  `value` might be the
  // volume or frequency of a sound.
  function rampDown(audio, value, startValue, duration) {
    value.setValueAtTime(startValue, audio.currentTime);
    value.exponentialRampToValueAtTime(0.01, audio.currentTime + duration);
  };

  // **createAmplifier()** returns a sound node that controls the volume
  // of the sound entering it.  The volume is started at `startValue`
  // and ramped down in `duration` seconds to almost `0`.
  function createAmplifier(audio, startValue, duration) {
    var amplifier = audio.createGain();
    rampDown(audio, amplifier.gain, startValue, duration);
    return amplifier;
  };

  // **chain()** connects an array of `soundNodes` into a chain.  If
  // there are three nodes in `soundNodes`, the output of the first will
  // be the input to the second, and the output of the second will be
  // the input to the third.
  function chain(soundNodes) {
    for (var i = 0; i < soundNodes.length - 1; i++) {
      soundNodes[i].connect(soundNodes[i + 1]);
    }
  };

  // **createTrack()** returns an object that represents a track.  This
  // track contains an array of 16 steps.  Each of these are either on
  // (`true`) or off (`false`).  It contains `color`, the color to draw
  // buttons when they are on.  It contains `playSound`, the function
  // that plays the sound of the track.
  function createTrack(color, playSound) {
    var steps = [];
    for (var i = 0; i < 16; i++) {
      steps.push(false);
    }

    return { steps: steps, color: color, playSound: playSound };
  };



  // **buttonPosition()** returns the pixel coordinates of the button at
  // `column` and `row`.
  function buttonPosition(column, row, BUTTON_SIZE) {
    return {
      x: BUTTON_SIZE / 2 + column * BUTTON_SIZE * 1.5,
      y: BUTTON_SIZE / 2 + row * BUTTON_SIZE * 1.5
    };
  };

  // **drawButton()** draws a button in `color` at `column` and `row`.
  function drawButton(screen, column, row, color, BUTTON_SIZE) {
    var position = buttonPosition(column, row, BUTTON_SIZE);
    screen.fillStyle = color;
    screen.fillRect(position.x, position.y, BUTTON_SIZE, BUTTON_SIZE);
  };

  // **drawTracks()** draws the tracks in the drum machine.
  function drawTracks(screen, data, BUTTON_SIZE) {

    data.tracks.forEach(function(track, row) {
      track.steps.forEach(function(on, column) {
        drawButton(screen,
                   column,
                   row,
                   on ? track.color : "lightgray",
                   BUTTON_SIZE);
      });
    });
  };

  // **isPointInButton()** returns true if `p`, the coordinates of a
  // mouse click, are inside the button at `column` and `row`.
  function isPointInButton(p, column, row, BUTTON_SIZE) {
    var b = buttonPosition(column, row, BUTTON_SIZE);
    return !(p.x < b.x ||
             p.y < b.y ||
             p.x > b.x + BUTTON_SIZE ||
             p.y > b.y + BUTTON_SIZE);
  };


function makeId()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
