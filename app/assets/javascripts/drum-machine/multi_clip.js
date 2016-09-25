var song;
var clip_editor;
$(document).ready(function(){
  song = new Song();

  var small_screen = 300;
  var large_screen = 687;
  clip_editor = new Pattern(large_screen, -1)

})

function Song()
{
  self = this;
  this.clips = [];
  this.current_segment = 0;
  this.track_length = 0;
  this.isPlaying = true;
  this.editing = false;
  this.editing_segment = 0;
  this.editing_clip = 0;
  this.temp;
  this.track = function()
  {

    //Handle tracking for editor pattern

    //Handle tracking for entire song
    if (self.clips.length > 0 )
    {
      // Increase `data.step` by one for current clip.  If `data.step` is `15` (the last
      // step), move to next clip reset step value to 0

      self.clips[self.current_segment].forEach(function(segment)
        {
          segment.data.step = (segment.data.step + 1)
       });
      if (self.clips[self.current_segment][0].data.step == self.clips[self.current_segment][0].data.tracks[0].steps.length)
      {
        self.clips[self.current_segment].forEach(function(segment)
        {
          segment.data.step = 0;
        });
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
  this.pattern_tracker = setInterval(this.track, 100);
  this.editor_tracker = setInterval(this.editor_track, 100);

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
  $('.song_container').empty();
  song = new Song();

}






