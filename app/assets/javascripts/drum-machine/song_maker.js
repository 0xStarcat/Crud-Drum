
$(document).ready(function(){



})


function Song()
{
  self = this;
  this.clips = [];
  this.tracker_segments = [];
  this.current_segment = 0;
  this.track_length = 0;
  this.isPlaying = false;
  this.editing = false;
  this.editing_segment = 0;
  this.editing_clip = 0;
  this.instrument_tracks = [{"wave": "simple_sine", "mult": 3}, {"wave": "simple_sawtooth", "mult": 3}, {"wave": "simple_square", "mult": 3}, {"wave": "drum_kit", "mult": 3}];
  this.master_step = 0;
  self.editor_step = 0;
  this.track = function()
  {

    //Handle tracking for entire song
    if (self.clips.length > 0 )
    {
      self.clips[self.current_segment].forEach(function(segment)
      {
        segment.data.tracks
        .filter(function(track) {

          //console.log(track[segment.data.step])

          return track.steps[segment.data.step];
        })
        .forEach(function(track)
          {
            track.playSound();

          });
        })
      };

      // Increase `data.step` by one for current clip.  If `data.step` is `15` (the last
      // step), move to next clip reset step value to 0
        //self.tracker_segments[self.current_segment].data.step = (self.tracker_segments[self.current_segment].data.step + 1) % 16;
        self.clips[self.current_segment].forEach(function(segment, index)
          {
            //Move the tracker to right
            segment.data.step = (segment.data.step + 1) % 16;
            if (index == 0)
            {
              self.master_step = (segment.data.step + 1) % 16;
            }



          });

      if (self.master_step == 0)
      {
        //
        self.current_segment = (self.current_segment + 1) % self.clips.length;


      }

      // Find all the tracks where the current step is on.  Play the
      // sounds for those tracks.

  }
  this.editor_track = function(){


    clip_editor.data.tracks
      .filter(function(track) {  return track.steps[clip_editor.data.step]; })
      .forEach(function(track)
        {
          track.playSound();
        });

    clip_editor.data.step = (clip_editor.data.step + 1) % clip_editor.data.tracks[0].steps.length;
    self.editor_step = clip_editor.data.step;
  }
  //move these trackers to the pattern
  //and clear the trackers in the stop function

    //this.pattern_tracker = setInterval(this.track, 100);

    //this.editor_tracker = setInterval(this.editor_track, 100);


};

function render_song(data)
{
  console.log(data)
  clear_song();
  if (data)
  {
   data.forEach(function(segment, i)
    {
      insert_segment();
      segment.forEach(function(clip, j)
      {
        data[i][j].screen = song.clips[i][j].screen;
        var canvas = song.clips[i][j];
        var pattern = clip.pattern;
        loadPattern(pattern, canvas);
      })
    })
  } else {
    console.log('no data to render')
  }

}

function clear_song()
{
  clearInterval(song.pattern_tracker);
  $('.canvas_container').empty();
  $('#tracking_container').empty();
  song = new Song();
}







