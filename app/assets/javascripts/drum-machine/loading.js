var tracking_control;
var instr;
var session;

$('document').ready(function()
{
  console.log('Loading resources...')

  disable_buttons();

  b = new Buffer();
  session = new Session_Data();
  load_samples(b.index);

  controls = new Control_listeners;
  library_listeners = new Library_Listeners;

})


function load_samples(index)
  {

   var source = audio.createBufferSource();
   var request = new XMLHttpRequest();
   var audioURL = '/load_samples'
   var params = ["kick1", "kick2","kick3", "snare1", "snare2","snare3", "hihat1", "hihat2","hihat3", "cymbal1", "cymbal2","cymbal3", "clap1", "clap2","clap3", "tom1", "tom2","tom3", "percus1", "percus2","percus3"]

      request.open('GET', audioURL+"?"+"sample="+params[index], true);
      console.log(params[index]);
      request.responseType = 'arraybuffer';
      request.onload = function() {

        var audioData = request.response;
        console.log(audioData);
        audio.decodeAudioData(audioData, function(buffer) {

          b[params[index]] = audioData;
          b[params[index]+"_play"] = function()
          {
            play_sample(b[params[index]])
          }
          b.index++;
          if (b.index < params.length)
          {
            load_samples(b.index)
          } else {
            samples_loaded();
            console.log('done loading samples!')
          }
            //play_sample();
        },
        function(e){"Error with decoding audio data" + e.err});
      }
      request.send();
  };

  function samples_loaded()
  {
    var large_screen = 687;
    instr = new Instruments(undefined, "drum_kit", 3);
    song = new Song();
    insert_segment();
    clip_editor = new Pattern(large_screen, -1, instr, -1);
    enable_buttons();

   // test();
  }

  function test()
  {
    var new_data = {step: 0, tracks: instr.drum_kit, type: instr.type};
    console.log(new_data);
    loadInstrument(clip_editor, new_data)
  }
