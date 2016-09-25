var clips_listeners;
var library_listeners;
$(document).ready(function()
{

  clips_listeners = new Clips_Listeners;
  library_listeners = new Library_Listeners;

})

function Clips_Listeners()
{
  self = this;
  this.mouse_down;
  $(window).on('mousedown', toggle_mouse);
  $(window).on('mouseup', toggle_mouse);
  this.save_clip_button = $('#save_clip');
  this.save_clip_button.on('click', save_clip);
  this.playback_button = $('#playback_button');
  this.playback_button.on('click', song_stop);
  this.switch_view = $('#switch_button');
  this.switch_view.on('click', toggle_view);
  this.add_clip_button = $('#add_clip_button');
  this.add_clip_button.on('click', insert_segment);
  this.save_song_button = $('#save_song');
  this.save_song_button.on('click', save_song);
  $('#load_song').on('click', load_song);
  this.new_song_button = $('#new_song');
  this.new_song_button.on('click', clear_song);
};

function Library_Listeners()
{
  $('.load_clip_button').each(function(button)
    {
      $(this).on('click', load_clip);
    });
  $('.load_song_button').each(function(button)
    {
      $(this).on('click', load_song);
    });
}

var save_clip = function()
{
  var user_id = document.querySelector('.user_id').getAttribute('user');

  var data = {user_id: user_id, coords: JSON.stringify(clip_editor.pattern)};
  console.log("SAVE DATA", data);
  //grab user id first
  //then return ajax with data
  ajax_this('/clips', 'POST', data, success, error_function)
  function success(data)
  {
    library_listeners = new Library_Listeners;
  }
};

var load_clip = function(e)
{

  var id = e.target.getAttribute('clip');
  var canvas = clip_editor;
  console.log("get clip id:", id)
  ajax_this('/clip_req', 'GET', {id: id}, success, error_function)
  function success(data)
  {
    console.log("CLIP LOADED FROM SERVEr", data);
    var pattern = JSON.parse(data.coords);

    loadPattern(pattern, canvas);
  }
};

var song_stop = function(e)
{

  if (song.isPlaying)
  {
    song.current_segment = 0;
    //song.pattern_tracker = setInterval(song.track, 100)
    clearInterval(song.pattern_tracker)
    clips_listeners.playback_button.text('Play')
    song.isPlaying = false;
  } else if (!song.isPlaying)
  {
    song.pattern_tracker = setInterval(song.track, 100)
    clips_listeners.playback_button.text('Stop')
    song.isPlaying = true;
  }
  song.clips.forEach(function(segment)
    {
      segment.forEach(function(clip)
      {
        reset_tracker(clip);
      })
    })
}

var reset_tracker = function(pattern)
{

  pattern.is_playing = !pattern.is_playing;
  pattern.data.step = (pattern.is_playing) ? pattern.data.step : 0;

}

var toggle_view = function(e)
{

  $('#clip_container').toggle(250);
  $('#song_display').toggle(250, switch_playback);

}

var switch_playback = function()
{
  if ($('#song_display').is(':visible'))
  {
    if (song.editing)
      {
        var pattern = clip_editor.pattern;
        var canvas = song.clips[song.editing_segment][song.editing_clip]
        loadPattern(pattern, canvas);
      }
    clearInterval(song.editor_tracker)
    reset_tracker(clip_editor);
    song_stop();
  } else {

    song_stop();
    song.editor_tracker = setInterval(song.editor_track, 100);
    reset_tracker(clip_editor)
  }
}

var insert_segment = function(e)
{
  var small_screen = 300;
  var large_screen = 687;
  addClip(small_screen);

}

function addClip(width)
{

  var segment = []
  for (var i = 0; i < 4; i++)
  {
    var new_clip = new Pattern(width, i)
    segment.push(new_clip);
  }
  song.clips.push(segment)
  song.track_length+=16;
}

function toggle_mouse(e)
{
  if (!clips_listeners.mouse_down) {clips_listeners.mouse_down = true}
  else if (clips_listeners.mouse_down){clips_listeners.mouse_down = false}
}

function expand_clip(id)
{
  var segment = $(id).attr('segment');
  var clip = $(id).attr('clip');
  var pattern = song.clips[segment][clip]["pattern"];
  loadPattern(pattern, clip_editor);
  song.editing_segment = segment;
  song.editing_clip = clip;

  toggle_view();
  song.editing = true;
}

var save_song = function()
{
  //song.temp = (song.clips)
  var user_id = document.querySelector('.user_id').getAttribute('user');

  var data = {user_id: user_id, data: JSON.stringify(song.clips)};
  console.log("SAVE SONG", data);
  //grab user id first
  //then return ajax with data
  ajax_this('/songs', 'POST', data, success, error_function)
  function success(data)
  {
    library_listeners = new Library_Listeners;
  }
}

var load_song = function(e)
{

  // console.log("load song", song.temp);
  // render_song(song.temp);
  var id = e.target.getAttribute('song');
  console.log("get clip id:", id)
  ajax_this('/song_req', 'GET', {id: id}, success, error_function)
  function success(data)
  {
    console.log("SONG LOADED", data);

    var load_song = JSON.parse(data.data);
    render_song(load_song);
  }
}

