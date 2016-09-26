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
  //this.instrument = instrument;
  this.id = makeId();
  this.width = width;
  this.pattern = []
  this.is_playing = true;
  this.data = {
    // `step` represents the current step (or beat) of the loop.
    step: 0,
    // `tracks` holds the six tracks of the drum machine.  Each track
    // has a sound and sixteen steps (or beats).
    tracks: instrument.current_instrument,
    type: instrument.type,
    instr_tags: instrument.instr_tags
  };



  this.synth_sliders = undefined;
  this.setupButtonClicking = function() {

  // Every time the user clicks on the canvas...
  document.querySelector("#"+self.id).addEventListener("mousemove", function(e) {
    // ...Get the coordinates of the mouse pointer relative to the
    // canvas...
    if (controls.mouse_down && controls.mount == undefined)
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
              self.pattern.push({step: column, track: row})
              console.log(track.steps[column])
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

            // ...Switch it off if it was on or on if it was off.

              track.steps[column] = !on;

            if (track.steps[column])
            {
              var check = {"column": column, "row": row};
              if (self.pattern.includes(check) == false)
              {

                self.pattern.push({step: column, track: row})
                console.log(self.pattern.includes(check))
              }
            }
            else
            {
              var remove_index = self.pattern.indexOf({"column": column, "row": row})
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
function loadPattern(pattern, canvas, instrument_data)
{
  //Draws pattern onto the canvas
  console.log("PATTERN", pattern, canvas, instrument_data)
  clearKit(canvas);

  //row = data.tracks
  //column = data.tracks[i].steps

  if (instrument_data)
  {
    reconstruct_instrument(canvas, instrument_data);

  }
  pattern.forEach(function(block)
  {

    canvas.data.tracks[block["track"]].steps[block["step"]] = true;
    canvas.pattern.push({step: block["step"], track: block["track"]})

  })
}

function change_track_instrument(canvas,index,value)
{

  canvas.data.instr_tags.splice(index, 1, value);
  canvas.data.step = 0;
  canvas.data.type = "custom_kit";
  session.editor_data = canvas.data;
  reconstruct_instrument(canvas, canvas.data);
  loadPattern(clip_editor.pattern, canvas, undefined)
}

function reconstruct_instrument(canvas, instrument_data)
{
  //Javascript function variables don't getp assed to database
  //so need to reconstruct the instrument array if a custom instrument was made
  switch (instrument_data.type){
    case "custom_kit":
      var new_instr = new Instruments(instrument_data.instr_tags, instrument_data.type)
      canvas.data.tracks = new_instr.current_instrument
    break
    default:
    var default_instr = instrument_data.type
    var instrument_tracks = instr[default_instr]
    console.log(instrument_data, instr[instrument_data.type]);
    instrument_data.tracks = instrument_tracks;
    loadInstrument(canvas, instrument_data)
    break
  }
}

function loadInstrument(canvas, instrument_data)
{
  console.log(instrument_data);
  canvas.data = instrument_data;
}



function clearKit(clip)
{
  clip.pattern = [];
  for (var i = 0; i < clip.data.tracks.length; i++)
  {
    for (var j = 0; j < clip.data.tracks[i].steps.length; j++)
    {
      clip.data.tracks[i].steps[j] = false;
    }
  }
}


function addClip(width)
{

  var instr_list = ["synth_1", "synth_2", "synth_3", "drum_kit"];

  var segment = [];
  for (var i = 0; i < 4; i++)
  {
    var instr_assignments = assign_instruments(instr_list[i])
    console.log("ASSIGNMENTS", instr_assignments)
    var instr = new Instruments(instr_assignments, instr_list[i]); //pass an array of string instr values
    //console.log(instr[instr_list[i]])

    var new_clip = new Pattern(width, i, instr);
    segment.push(new_clip);
  }
  $('.song_canvas').off('dblclick', add_dblclick);
  canvas_listeners = Canvas_Listeners();
  song.clips.push(segment);
  song.track_length+=16;

  var tracking_control = new Tracker(width, song.tracker_segments.length);
  song.tracker_segments.push(tracking_control);
}

function assign_instruments(instr)
{
  switch (instr)
  {
    case "custom_kit":
    return ["percus1_play","hihat1_play","tom1_play","clap1_play","snare1_play","kick1_play"]
    break
    case "synth_1":
    return []
    break
    case "synth_2":
    return []
    break
    case "synth_3":
    return []
    break
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
