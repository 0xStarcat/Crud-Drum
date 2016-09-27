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
  $(window).on('mousedown', mouse_down);
  $(window).on('mouseup', mouse_up);
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
  this.name_input = $('#edit_name_input');
  this.name_error = $('#name_error');
  this.selection_boxes = $('select');
  this.selection_boxes.on('change', selection);
  this.synth_boxes = $('.synth_pick');
  this.synth_boxes.on('change', synth_selection);
  this.octave_boxes = $('.octave_pick');
  this.octave_boxes.on('change', octave_selection);
  this.bpm_slider = $('#bpm_display');
  this.bpm_slider.on('input change', bpm_adjust);
  this.bpm = 120;
  this.millisecond_conversion = 125;
  this.mount;
  this.mount_listener;
  this.mount_target;
  this.mount_destination;
  this.editing = false;
  $(document).on('keypress', function(e)
  {
    if (e.which == 32)
    {

      if (song.isPlaying)
      {
        $('.stop_button').trigger('click');
      } else {
        $('.play_button').trigger('click');
      }
    }
  });
};

function Canvas_Listeners()
{
  $('.song_canvas').on('dblclick', add_dblclick);
}

function add_dblclick(e)
{
  var id = $(e.target).attr('id');
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
              var clip = ($(e.target).attr('clip') != null) ? $(e.target).attr('clip') : $(e.target).parent().attr('clip');
              console.log(clip)
              load_clip(e, clip, clip_editor);
              $(e.target).off('mouseout', mount_cursor);
            }
        })
    });
  $('.load_song_button').each(function(button)
    {
      $(this).on('click', load_song);
    });
  $('.song_card').each(function(button)
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
    $(window).on('mouseup', unmount_cursor);
    var id = ($(e.target).attr('clip') != null) ? $(e.target).attr('clip') : $(e.target).parent().attr('clip');
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

    if (!on_song_page())
    {
      controls.editing = true;
    }

  }

  controls.mount = undefined;
  controls.mount_target = undefined;
  controls.mount_destination = undefined;
  $('canvas').off('mouseup', unmount_cursor);
  $(window).off('mouseup', unmount_cursor);
  $('body').css({'opacity': '1','cursor':'initial'})
  remove_hover_class();
}

var check_screen = function()
{
  if (!$('#s_d').is(':visible'))
  {

    if (controls.editing)
    {
      var pattern = clip_editor.pattern;
      var canvas = song.clips[song.editing_segment][song.editing_clip]
      var instrument_data = song.clips[song.editing_segment][song.editing_clip]["data"];
      loadPattern(pattern, canvas, instrument_data);

    }
    else if (!controls.editing)
    {

    }
    controls.song_specific_buttons.css({'visibility':'hidden'});
    stop();
  }
  else if ($('#s_d').is(':visible'))
  {
    controls.name_input.val('');
    controls.editing = false;
    stop();
    controls.song_specific_buttons.css({'visibility':'visible'});
  }
}

function check_instrument_type(instrument_data)
{
  console.log("CHECK INSTRUMENT",instrument_data.type)
  if (instrument_data.type == "drum_kit" || instrument_data.type == "custom_kit")
  {
    $('.drum_sample_pick').show();
  }
  else
  {
    $('.drum_sample_pick').hide();
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
    if (controls.editing)
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
  song.isPlaying=false;
  clearInterval(song.pattern_tracker)
  song.master_step = 0;
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
  song.editor_step = 0;
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
    song.pattern_tracker = setInterval(song.track, controls.millisecond_conversion);
  }
  else if (!on_song_page())
  {

    song.editor_tracker = setInterval(song.editor_track, controls.millisecond_conversion);
  }
  song.isPlaying = true;
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




function mouse_down(e)
{
  controls.mouse_down = true;
}

function mouse_up(e)
{
  controls.mouse_down = false;
}

function expand_clip(id)
{
  var segment = $(id).attr('segment');
  var clip = $(id).attr('clip');
  var pattern = song.clips[segment][clip]["pattern"];

  var instrument_data = song.clips[segment][clip]["data"];
  loadPattern(pattern, clip_editor, instrument_data);
  song.editing_segment = segment;
  song.editing_clip = clip;
  check_instrument_type(instrument_data);
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
  controls.editing = false;
  controls.name_input.val('');
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

function selection(e)
{
  var value = $(e.target).closest('select').val();
  value = value+'_play';
  var index = $(e.target).closest('select').attr('index');
  //stop();
  change_track_instrument(clip_editor, index, value);
}

function synth_selection(e)
{
  var value = $(e.target).closest('select').val();
  var index = $(e.target).closest('select').attr('index');
  //stop();

  song.instrument_tracks[index]["wave"] = value;
  for (var i=0;i<song.clips.length;i++)
  {
    for (var j = index; j < song.clips[i].length; j+=4)
    {
      console.log(j,i)
      change_synth_track(song.clips[i][j], value, song.clips[i][j].data.mult);

    }
  }
}

function octave_selection(e)
{
  var mult = $(e.target).closest('select').val();
  var index = $(e.target).closest('select').attr('index');


  song.instrument_tracks[index]["mult"] = mult;
  for (var i=0;i<song.clips.length;i++)
  {
    for (var j = index; j < song.clips[i].length; j+=4)
    {

      var value = song.clips[i][j].data.type;

      change_synth_track(song.clips[i][j], value, mult);
    }
  }
}


function bpm_adjust(e)
{
  controls.bpm = controls.bpm_slider.val();
  $('#bpm_label').text(String(controls.bpm))
  controls.bpm_slider.html(String(controls.bpm))
  clearInterval(song.pattern_tracker);
  clearInterval(song.editor_tracker);
  controls.millisecond_conversion = ((60/controls.bpm)/4)*1000 //((-1.56 * controls.bpm) + 343.6);
  if (on_song_page())
  {
    song.pattern_tracker = setInterval(song.track, controls.millisecond_conversion);
  } else
  {
    song.editor_tracker = setInterval(song.editor_track, controls.millisecond_conversion);
  }


  console.log(controls.bpm, controls.millisecond_conversion);
}

