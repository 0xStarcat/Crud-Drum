function Session_Data()
{
  this.user;
  this.editor_data;
  this.song_data;
}

var save_clip = function()
{
  if (check_name_input())
  {
    disable_buttons();
    var user_id = document.querySelector('.user_id').getAttribute('user');
    var name = controls.name_input.val();
    var data = {user_id: parseInt(user_id), name: name, coords: JSON.stringify(clip_editor.pattern), instrument: JSON.stringify(clip_editor.data)};
    console.log(name);
    console.log("SAVE CLIP", data);
    ajax_this('/clips', 'POST', data, success, error_function)
  } else
  {

  }

  function success(data)
  {
    controls.name_error.text('');
    library_listeners = new Library_Listeners;
    enable_buttons();
  }
};

var save_song = function()
{
  if (check_name_input())
  {
    disable_buttons();
    var bpm = parseInt(controls.bpm);
    var user_id = document.querySelector('.user_id').getAttribute('user');
    var name = controls.name_input.val();
    var data = {user_id: parseInt(user_id), name: name, data: JSON.stringify(song.clips), instrument: JSON.stringify(clip_editor.data), bpm: bpm, instrument_tracks: JSON.stringify(song.instrument_tracks)};
    console.log("SAVE SONG", data);
    ajax_this('/songs', 'POST', data, success, error_function)
  } else
  {

  }
    function success(data)
    {
      controls.name_error.text('');
      library_listeners = new Library_Listeners;
      enable_buttons();
    }
}

var load_clip = function(e, clip, canvas)
{
  disable_buttons();
  console.log("LOADING clip", clip, " to ", canvas);
  var id = clip;

  ajax_this('/clip_req', 'GET', {id: id}, success, error_function)
  function success(data)
  {
    stop();
    console.log("CLIP LOADED FROM SERVER", data);
    var pattern = JSON.parse(data.coords);
    var instrument = JSON.parse(data.instrument);
    var instrument_data = {step: instrument.step, tracks: instrument.tracks, type: instrument.type, instr_tags: instrument.instr_tags}

    session.editor_data = data;
    loadPattern(pattern, canvas, instrument_data);
    check_instrument_type(instrument_data);

    //loadInstrument(instrument);
    enable_buttons();
    if (controls.editing == true && !on_song_page())
    {
      controls.name_input.val(data.name);
    }


  }
};

var load_song = function(e)
{

  disable_buttons();
  var id = $(e.target).attr('song') || $(e.target).parent().attr('song');
  console.log("get song id:", id)
  ajax_this('/song_req', 'GET', {id: id}, success, error_function)
  function success(data)
  {
    stop();
    setBPM(data.bpm);
    console.log("SONG LOADED", data);
    var load_song = JSON.parse(data.song_data);
    var instrument_tracks = JSON.parse(data.instrument_tracks)
    session.song_data = data;
    render_song(load_song);
    enable_buttons();
    set_instrument_tracks(instrument_tracks);
    if (on_song_page)
    {
      controls.name_input.val(data.name);
    }

  }
}

var update_clip = function()
{
  disable_buttons();

  var clip_id = session.editor_data.id;
  var user_id = session.editor_data.user_id;
  var name = controls.name_input.val();
  var data = {id: parseInt(clip_id), user_id: parseInt(user_id), name: name, coords: JSON.stringify(clip_editor.pattern), instrument: JSON.stringify(clip_editor.data)};
  console.log("UPDATE DATA", data);
  session.editor_data = data;
  ajax_this('/clips/'+clip_id, 'PATCH', data, success, error_function)

  function success(data)
  {
    library_listeners = new Library_Listeners;
    enable_buttons();
  }
}

var update_song = function()
{
  disable_buttons();
  var song_id = session.song_data.id;
  var user_id = session.song_data.user_id;
  var name = controls.name_input.val();
  var bpm = parseInt(controls.bpm);
  var data = {id: parseInt(song_id), user_id: parseInt(user_id), name: name, data: JSON.stringify(song.clips), instrument: JSON.stringify(clip_editor.instrument), bpm: bpm, instrument_tracks: JSON.stringify(song.instrument_tracks)};
  session.song_data = data;
  console.log("UPDATE SONG", data);

  ajax_this('/songs/'+song_id, 'PATCH', data, success, error_function)
  function success(data)
  {
    library_listeners = new Library_Listeners;
    enable_buttons();

  }
}

function check_name_input()
{
  var reg = /\s/ig; //reg ex, all whitespace
  var parsed = controls.name_input.val().replace(reg, "");
  if (parsed == "" )
  {
    controls.name_error.text('Please enter a valid name');
    return false;
  } else {
    if (check_name_length(parsed))
    {
      return true;
    }
  }
}

function check_name_length(parsed)
{
  if (parsed.length > 20)
  {
    controls.name_error.text('Titles must be less than 20 chars.');
    return false;
  } else {

    return true;
  }
}

function set_instrument_tracks(instrument_tracks)
{
  console.log(instrument_tracks);
  debugger

  instrument_tracks.forEach(function(track, index)
  {
    $('.synth_pick').eq(index).val(track.wave);
    $('.octave_pick').eq(index).val(track.mult);
  })



  $('.synth_pick').each(function(box)
    {
      $(this).trigger('change');
    });
  $('.octave_pick').each(function(box)
    {
      $(this).trigger('change');
    });
}

function setBPM(bpm)
{
  controls.bpm = bpm;
  controls.bpm_slider.val(bpm);
  $('#bpm_label').text(String(bpm))
  controls.millisecond_conversion = ((60/controls.bpm)/4)*1000//((-1.56 * controls.bpm) + 343.6);
}
