class SongsController < ApplicationController


  def create
    data = params[:data]
    user_id = params[:user_id]
    @song = Song.new(song_params(params))

    @song.save
    # end
    if current_user
      @clips = Clip.where(user_id: current_user.id)
      @songs = Song.where(user_id: current_user.id)
      respond_to do |format|
      format.js
      end
    end

  end

  def load_song
    song_id = params["id"]
    respond_to do |format|
    return_clip = Song.find(song_id)
    format.json  { render :json => return_clip }
    end
  end

  def update
  end

  def destroy
  end
  private
  def song_params params

    params = ActionController::Parameters.new({
      song: {
        user_id: params[:user_id],
        data: params[:data]
      }
    })
    params.require(:song).permit(:data, :user_id)

  end

end
