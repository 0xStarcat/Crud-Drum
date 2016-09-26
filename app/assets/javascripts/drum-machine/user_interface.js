var clips_listeners;
var library_listeners;
var canvas_listeners;
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
  this.playback_button = $('.playback_button');
  this.playback_button.on('click', song_stop);
  this.switch_view = $('.switch_button');
  this.switch_view.on('click', toggle_view);
  this.add_segment_button = $('#add_segment_button');
  this.add_segment_button.on('click', insert_segment);
  this.save_song_button = $('#save_song');
  this.save_song_button.on('click', save_song);
  $('#load_song').on('click', load_song);
  this.new_song_button = $('#new_song');
  this.new_song_button.on('click', reset_song);
  this.mount;
  this.mount_listener;
  this.mount_target;
  this.mount_destination;
};

function Canvas_Listeners()
{
  $('.song_canvas').on('dblclick', add_dblclick);
}

function add_dblclick(e)
{
  var id = $(e.target).attr('id');
  console.log(id)
  expand_clip($(e.target));
}

function Library_Listeners()
{
  $('.load_clip_button').each(function(button)
    {
        $(this).on('mousedown', prime_cursor)
        $(this).on('mouseup', function(e)
        {
          var clip = e.target.getAttribute('clip');
          load_clip(e, clip, clip_editor);
          $(e.target).off('mouseout', mount_cursor);
        })
    });
  $('.load_song_button').each(function(button)
    {
      $(this).on('click', load_song);
    });
}

var prime_cursor = function(e)
{
  $(e.target).on('mouseout', mount_cursor);
}

var mount_cursor = function(e)
  {
    $('body').css({'opacity': '0.6'})
    $('canvas').off('mouseup', unmount_cursor);
    $('canvas').on('mouseup', unmount_cursor);
    var id = $(e.target).attr('clip');
    clips_listeners.mount = id;
    add_hover_class();
    $(e.target).off('mouseout', mount_cursor);
  }

var unmount_cursor = function(e)
{

  clips_listeners.mount_target = e.target.getAttribute('id');
  if (clips_listeners.mount_target == clip_editor.id)
  {
    var clip = clip_editor

  } else {
    find_mount_destination()
    var clip = clips_listeners.mount_destination;
  }
  load_clip(e, clips_listeners.mount, clip)
  clips_listeners.mount = undefined;
  clips_listeners.mount_target = undefined;
  clips_listeners.mount_destination = undefined;
  $('canvas').off('mouseup', unmount_cursor);
  $('body').css({'opacity': '1'})
  remove_hover_class();
}

var on_song_screen = function()
{
  return ($('#s_d').is(':visible'))
}

var find_mount_destination = function()
{

  var target = clips_listeners.mount_target;
  song.clips.forEach(function(clip)
  {
    clip.forEach(function(pattern)
    {
      if (pattern.id == target)
      {

        clips_listeners.mount_destination = pattern;
        console.log("destination", pattern)
      }
    })

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

var load_clip = function(e, clip, canvas)
{
  console.log("LOADING clip", clip, " to ", canvas);
  var id = clip;
  console.log("get clip id:", id)
  ajax_this('/clip_req', 'GET', {id: id}, success, error_function)
  function success(data)
  {
    console.log("CLIP LOADED FROM SERVER", data);
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
  $('#s_d').toggle(250, switch_playback);

}

var switch_playback = function()
{
  if ($('#s_d').is(':visible'))
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
  var instruments = ["original"];
  var segment = []
  for (var i = 0; i < 4; i++)
  {
    var instr = new Instruments();

    var new_clip = new Pattern(width, i, instr[instruments[0]]);
    segment.push(new_clip);
  }
  $('.song_canvas').off('dblclick', add_dblclick);
  canvas_listeners = Canvas_Listeners()
  song.clips.push(segment)
  song.track_length+=16;

  var tracking_control = new Tracker(width, song.tracker_segments.length);
  song.tracker_segments.push(tracking_control);
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

    var load_song = JSON.parse(data.song_data);
    render_song(load_song);
  }
}





function add_hover_class()
{
  $('.song_canvas').each(function(canvas)
    {
      $(this).on('mouseover', onHover);
      $(this).on('mouseout', offHover);
    });
}

function remove_hover_class()
{
  $('.song_canvas').each(function(canvas)
    {
      $(this).removeClass('hover');
      $(this).off('mouseover', onHover);
      $(this).off('mouseout', offHover);
    });
}

var onHover = function()
{
  $(this).addClass('hover');
}

var offHover = function()
{
  $(this).removeClass('hover');
}
