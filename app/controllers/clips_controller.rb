class ClipsController < ApplicationController

  def index

    if current_user
      @clips = Clip.where(user_id: current_user.id)
      @songs = Song.where(user_id: current_user.id)
    end
    render :index
  end

  def show

  end

  def new

  end

  def create
    coords = params[:coords]
    user_id = params[:user_id]
    # if session[:user_id] == user_id


    @clip = Clip.new(clip_params(params))

    @clip.save
    # end
    if current_user
      @clips = Clip.where(user_id: current_user.id)
      @songs = Song.where(user_id: current_user.id)
      respond_to do |format|
      format.js
      end
    end

  end

  def edit

  end

  def update
    @clip = Clip.find(params[:id])
    @clip.update(clip_params(params))

    if current_user
      @clips = Clip.where(user_id: current_user.id)
      @songs = Song.where(user_id: current_user.id)
      respond_to do |format|
      format.js
      end
    end
  end

  def delete_clip
    if current_user
      Clip.destroy(params[:id])
      @clips = Clip.where(user_id: current_user.id)
      @songs = Song.where(user_id: current_user.id)

      respond_to do |format|
      format.js
      end
    end
  end

  def load_clip


    clip_id = params["id"]

    respond_to do |format|
    return_clip = Clip.find(clip_id)
    format.json  { render :json => return_clip }
    end

  end
  private
  def clip_params params

    params = ActionController::Parameters.new({
      clip: {
        coords: params[:coords],
        user_id: params[:user_id],
        name: params[:name],
        instrument: params[:instrument]
      }
    })
    params.require(:clip).permit(:coords, :user_id, :name, :instrument)

  end
end
