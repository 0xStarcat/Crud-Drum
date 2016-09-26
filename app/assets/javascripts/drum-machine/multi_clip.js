var song;
var clip_editor;
var b;
$(document).ready(function(){

  b = new Buffer();
  load_samples(b.index);


})


function Song()
{
  self = this;
  this.clips = [];
  this.tracker_segments = [];
  this.current_segment = 0;
  this.track_length = 0;
  this.isPlaying = true;
  this.editing = false;
  this.editing_segment = 0;
  this.editing_clip = 0;
  this.track = function()
  {

    //Handle tracking for entire song
    if (self.tracker_segments.length > 0 )
    {
      // Increase `data.step` by one for current clip.  If `data.step` is `15` (the last
      // step), move to next clip reset step value to 0
        self.tracker_segments[self.current_segment].data.step = (self.tracker_segments[self.current_segment].data.step + 1);
        self.clips[self.current_segment].forEach(function(segment)
          {
            //Move the tracker to right
            segment.data.step = (segment.data.step + 1)
          });

      if (self.tracker_segments[self.current_segment].data.step == 16)
      {

        self.clips[self.current_segment].forEach(function(segment)
        {
          //Move the reset tracker position to 0
          segment.data.step = 0;

        });
        self.tracker_segments[self.current_segment].data.step = 0;
        //change which canvas is rendering
        self.current_segment = (self.current_segment + 1) % self.clips.length;
      }

      // Find all the tracks where the current step is on.  Play the
      // sounds for those tracks.
      self.clips[self.current_segment].forEach(function(segment)
      {
      segment.data.tracks
      .filter(function(track) {  return track.steps[segment.data.step]; })
      .forEach(function(track)
        {
          track.playSound();
        });
      })
    };
  }
  this.editor_track = function(){
    clip_editor.data.step = (clip_editor.data.step + 1) % 16;
    clip_editor.data.tracks
      .filter(function(track) {  return track.steps[clip_editor.data.step]; })
      .forEach(function(track)
        {

          track.playSound();
        });
  }
  //move these trackers to the pattern
  //and clear the trackers in the stop function
  if ($('#s_d').is(':visible'))
  {
    this.pattern_tracker = setInterval(this.track, 100);
  } else
  {
    this.editor_tracker = setInterval(this.editor_track, 100);
  }

};

function render_song(data)
{
  console.log(data)
  clear_song();
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
}

function clear_song()
{
  clearInterval(song.pattern_tracker);
  $('.canvas_container').empty();
  $('#tracking_container').empty();
  song = new Song();


}

function reset_song()
{
  clear_song();
  insert_segment();
}






