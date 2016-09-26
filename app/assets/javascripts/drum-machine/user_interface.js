var controls;
var library_listeners;
var canvas_listeners;
$(document).ready(function()
{

})

function Control_listeners()
{
  self = this;
  this.mouse_down;
  $(window).on('mousedown', toggle_mouse);
  $(window).on('mouseup', toggle_mouse);
  this.save_button = $('.save_button');
  this.save_button.on('click', save);
  this.stop_button = $('.stop_button');
  this.stop_button.on('click', stop);
  this.play_button = $('.play_button');
  this.play_button.on('click', play);
  this.switch_view = $('.switch_button');
  this.switch_view.on('click', toggle_view);
  this.add_segment_button = $('#add_segment_button');
  this.add_segment_button.on('click', insert_segment);
  this.song_specific_buttons = $('.song_specific_buttons');
  this.new_button = $('#new_button');
  this.new_button.on('click', new_canvas);
  this.mount;
  this.mount_listener;
  this.mount_target;
  this.mount_destination;
  this.editing;
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
  $('.clip_card').each(function(button)
    {
        $(this).on('mousedown', prime_cursor)
        $(this).on('mouseup', function(e)
        {
          if (!$(e.target).hasClass('delete'))
            {
              var clip = e.target.getAttribute('clip');
              load_clip(e, clip, clip_editor);
              $(e.target).off('mouseout', mount_cursor);
            }
        })
    });
  $('.load_song_button').each(function(button)
    {
      $(this).on('click', load_song);
    });
}

var prime_cursor = function(e)
{
  if (!$(e.target).hasClass('delete'))
  {
    console.log($(e.target))
    $(e.target).on('mouseout', mount_cursor);
  }

}

var mount_cursor = function(e)
  {

    $('body').css({'opacity': '0.6', 'cursor':'copy'})
    $('canvas').off('mouseup', unmount_cursor);
    $('canvas').on('mouseup', unmount_cursor);
    var id = $(e.target).attr('clip');
    controls.mount = id;
    add_hover_class();
    $(e.target).off('mouseout', mount_cursor);
  }

var unmount_cursor = function(e)
{
  var clip = undefined;
  controls.mount_target = e.target.getAttribute('id');
  if (controls.mount_target == clip_editor.id)
  {
    clip = clip_editor

  } else {
    find_mount_destination()
    clip = controls.mount_destination;
  }

  if (clip)
  {
    load_clip(e, controls.mount, clip)
    controls.editing = true;
  }

  controls.mount = undefined;
  controls.mount_target = undefined;
  controls.mount_destination = undefined;
  $('canvas').off('mouseup', unmount_cursor);
  $('body').css({'opacity': '1','cursor':'initial'})
  remove_hover_class();
}

var check_screen = function()
{
  if (!$('#s_d').is(':visible'))
  {
    if (song.editing)
    {
      var pattern = clip_editor.pattern;
      var canvas = song.clips[song.editing_segment][song.editing_clip]
      loadPattern(pattern, canvas);

    }
    else if (!song.editing)
    {


    }
    controls.song_specific_buttons.css({'visibility':'hidden'});
    stop();
  }
  else if ($('#s_d').is(':visible'))
  {
    stop();
    controls.song_specific_buttons.css({'visibility':'visible'});
  }
}

var on_song_page = function()
{
  return $('#s_d').is(':visible')
}

var find_mount_destination = function()
{

  var target = controls.mount_target;
  song.clips.forEach(function(clip)
  {
    clip.forEach(function(pattern)
    {
      if (pattern.id == target)
      {

        controls.mount_destination = pattern;
        console.log("destination", pattern)
      }
    })

  });
}

function save()
{
  if (on_song_page())
  {
    if (session.song_data)
    {
      update_song();
    }
    else
    {
      save_song();
    }

  } else
  {
    if (session.editor_data)
    {
      update_clip();
    }
    else
    {
      save_clip();
    }
  }
}

function stop(e)
{

  clearInterval(song.pattern_tracker)

  song.clips.forEach(function(segment)
    {
      segment.forEach(function(clip)
      {
        reset_tracker(clip);
      })
    })
  song.tracker_segments.forEach(function(segment)
    {

        reset_tracker(segment);

    })
  song.current_segment = 0;

  clearInterval(song.editor_tracker);
  reset_tracker(clip_editor);
  if ($(controls.stop_button).is(':visible'))
  {
    toggle_playback_buttons();
  }

}

function play()
{
  if (on_song_page())
  {
    song.pattern_tracker = setInterval(song.track, 100);
  }
  else if (!on_song_page())
  {
    song.editor_tracker = setInterval(song.editor_track, 100);
  }

  toggle_playback_buttons();
}

var toggle_playback_buttons = function()
{
  controls.play_button.toggle();
  controls.stop_button.toggle();
}

var reset_tracker = function(pattern)
{

  pattern.data.step = 0;

}

var toggle_view = function(e)
{

  $('#clip_container').toggle(250);
  $('#s_d').toggle(250, check_screen);

}

var switch_playback = function()
{


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
  if (!controls.mouse_down) {controls.mouse_down = true}
  else if (controls.mouse_down){controls.mouse_down = false}
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

function new_canvas()
{

  if ($('#s_d').is(':visible'))
  {
    session.song_data = undefined;
    reset_song();
  }
  else
  {
    session.editor_data = undefined;
    clearKit(clip_editor);
  }
}

function reset_song()
{
  clear_song();
  insert_segment();
}

function disable_buttons()
{
  $('button').prop('disabled', true);
}

function enable_buttons()
{
  $('button').prop('disabled', false);
}

