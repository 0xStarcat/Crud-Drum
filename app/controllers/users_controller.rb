class UsersController < ApplicationController

  def index
    render :index
  end

  def return_data

  end

  def send_samples

    sample = params[:sample]

    case sample
    when "kick1"
    send_file 'public/audios/Samples/kick-electro02.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'kick2'
    send_file 'public/audios/Samples/kick-oldschool.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'kick3'
    send_file 'public/audios/Samples/kick-thump.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'snare1'
    send_file 'public/audios/Samples/snare-noise.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'snare2'
    send_file 'public/audios/Samples/snare-vinyl02.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'snare3'
    send_file 'public/audios/Samples/snare-lofi01.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'hihat1'
    send_file 'public/audios/Samples/hihat-808.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'hihat2'
    send_file 'public/audios/Samples/hihat-analog.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'hihat3'
    send_file 'public/audios/Samples/hihat-digital.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'cymbal1'
    send_file 'public/audios/Samples/crash-noise.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'cymbal2'
    send_file 'public/audios/Samples/crash-808.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'cymbal3'
    send_file 'public/audios/Samples/openhat-slick.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'clap1'
    send_file 'public/audios/Samples/clap-crushed.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'clap2'
    send_file 'public/audios/Samples/clap-slapper.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'clap3'
    send_file 'public/audios/Samples/clap-crushed.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'tom1'
    send_file 'public/audios/Samples/tom-808.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'tom2'
    send_file 'public/audios/Samples/tom-acoustic01.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'tom3'
    send_file 'public/audios/Samples/tom-acoustic02.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'percus1'
    send_file 'public/audios/Samples/perc-808.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'percus2'
    send_file 'public/audios/Samples/perc-tambo.wav', :type=>"audio/wav", :x_sendfile=>true
    when 'percus3'
    send_file 'public/audios/Samples/cowbell-808.wav', :type=>"audio/wav", :x_sendfile=>true
    else
      puts "ERROR LOADING SAMPLE: #{sample}"
      render :json => {error: "ERROR LOADING SAMPLE: #{sample}"}
    end
  end

end
