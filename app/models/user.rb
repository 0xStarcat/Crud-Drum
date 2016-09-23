class User < ApplicationRecord
  has_many :clips

  def self.create_with_omniauth(auth)
    create! do |user|
      byebug
      user.provider = auth["provider"]
      user.uid = auth["uid"] #user's github user id
      user.name = auth["info"]["name"]
      user.email = auth["info"]["email"]
      user.image = auth["info"]["image"]
    end
  end
end
