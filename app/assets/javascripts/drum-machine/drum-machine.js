// Create the object that contains functions that use web audio to
// make sound.


$(document).ready(function()
{
  //setUp();
});
  var screen;
  //var pattern;
  var current_pattern;



function Pattern(width, track_number, instrument){

  var self = this;

  this.id = makeId();
  this.width = width;
  this.pattern = []
  this.is_playing = true;
  this.data = {
    // `step` represents the current step (or beat) of the loop.
    step: 0,

    // `tracks` holds the six tracks of the drum machine.  Each track
    // has a sound and sixteen steps (or beats).
    tracks: instrument
  };
  this.setupButtonClicking = function() {

  // Every time the user clicks on the canvas...
  document.querySelector("#"+self.id).addEventListener("mousemove", function(e) {
    // ...Get the coordinates of the mouse pointer relative to the
    // canvas...
    if (clips_listeners.mouse_down && clips_listeners.mount == undefined)
    {
      var p = { x: e.offsetX, y: e.offsetY };

      // ...Go through every track...
      self.data.tracks.forEach(function(track, row) {

        // ...Go through every button in this track...
        track.steps.forEach(function(on, column) {

          // ...If the mouse pointer was inside this button...
          if (isPointInButton(p, column, row, self.BUTTON_SIZE)) {
            // ...Switch it off if it was on or on if it was off.
            if (track.steps[column] == false)
            {
              track.steps[column] = !on;
              console.log(track.steps[column])
            }
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
    }
  });
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
    if (track_number < 0)
    {
      drawButton(self.screen, self.data.step, self.data.tracks.length, "deeppink", self.BUTTON_SIZE);
    }

    // Ask the browser to call `draw()` again in the near future.
    requestAnimationFrame(self.draw);
  };

  (this.setUp = function(width, track_number)
  {

    var segment_id = (track_number >= 0) ? (song.clips.length) : "editor";
    var clip_id = (track_number >= 0) ? track_number : "editor";
    //var screen_container = $('<div><label for='+self.id+'>'+(song.clips.length+1)+'</label></div>')
    //$('#track_'+track_number+'_container').append(screen_container);
    var screen_id = $('<canvas class="song_canvas" segment="'+segment_id+'" clip="'+clip_id+'" id='+self.id+' width="'+width+'px" height="'+(width*0.45)+'px"></canvas>');//document.querySelector("#screen")
    $('#track_'+track_number+'_container').append(screen_id);
    //$(screen_container).append(screen_id);
    if (track_number < 0)
    {
      screen_id.removeClass('song_canvas');
    }
    self.screen = document.querySelector('#'+self.id).getContext("2d");
    self.BUTTON_SIZE = (self.screen.canvas.width / 16)/ 1.5;
    self.setupButtonClicking();

    self.draw();
  })(width, track_number)
}

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
        if (column == 0 || column % 4 == 0)
        {
          drawButton(screen,
                     column,
                     row,
                     on ? track.color : 'rgba(235,185,185,1)',
                     BUTTON_SIZE);
        } else {
          drawButton(screen,
                     column,
                     row,
                     on ? track.color : 'rgba(205,205,205,1)',
                     BUTTON_SIZE);
        }
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


function Tracker(width, track_number)
{
  var self = this;
  this.id = makeId();
  this.width = width;
  this.data = {
    // `step` represents the current step (or beat) of the loop.
    step: 0,

    // `tracks` holds the six tracks of the drum machine.  Each track
    // has a sound and sixteen steps (or beats).
    tracks: []
  };
  this.draw = function() {

    // Clear away the previous drawing.
    self.screen.clearRect(0, 0, self.screen.canvas.width, self.screen.canvas.height);

    // Draw all the tracks.
    //drawTracks(self.screen, self.data, self.BUTTON_SIZE)

    // Draw the pink square that indicates the current step (beat).
    if (song.current_segment == track_number)
    {
      drawButton(self.screen, self.data.step, self.data.tracks.length, "deeppink", self.BUTTON_SIZE);
    }

    // Ask the browser to call `draw()` again in the near future.
    requestAnimationFrame(self.draw);
  };
  (this.setUp = function(width, track_number)
  {

    var screen_id = $('<canvas class="tracking" segment = "'+track_number+'" id='+self.id+' width="'+width+'px" height="'+(width*0.45)+'px"></canvas>');//document.querySelector("#screen")
    $('#tracking_container').append(screen_id);
    self.screen = document.querySelector('#'+self.id).getContext("2d");
    self.draw();
    self.BUTTON_SIZE = (self.screen.canvas.width / 16)/ 1.5;

  })(width, track_number)
}
function loadPattern(pattern, clip)
{
  console.log("PATTERN", pattern)
  clearKit(clip);

  //row = data.tracks
  //column = data.tracks[i].steps
  pattern.forEach(function(block)
  {

    //console.log(block);
    clip.data.tracks[block["track"]].steps[block["step"]] = true;
    clip.pattern.push({step: block["step"], track: block["track"]})

  })

}

function clearKit(clip)
{
  console.log("clearing", clip)
  clip.pattern = [];
  for (var i = 0; i < clip.data.tracks.length; i++)
  {
    for (var j = 0; j < clip.data.tracks[i].steps.length; j++)
    {
      clip.data.tracks[i].steps[j] = false;
    }
  }
}

function makeId()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
