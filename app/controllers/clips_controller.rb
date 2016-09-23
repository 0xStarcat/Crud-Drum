class ClipsController < ApplicationController

  def index

    if current_user
      @clips = Clip.where(user_id: current_user.id)

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
      respond_to do |format|
      format.js
      end
    end

  end

  def edit

  end

  def update

  end

  def destroy

  end

  def load_clip


    user_id = params["id"]

    respond_to do |format|
    return_clip = Clip.find(user_id)
    format.json  { render :json => return_clip } # don't do msg.to_json
    end

  end

  def clip_params params

    params = ActionController::Parameters.new({
      clip: {
        coords: params[:coords],
        user_id: params[:user_id]
      }
    })
    params.require(:clip).permit(:coords, :user_id)

  end
end
