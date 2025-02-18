class Notification < ApplicationRecord
  belongs_to :recipient, polymorphic: true
  belongs_to :notifiable, polymorphic: true
  
  validates :message, presence: true
  validates :read, inclusion: { in: [true, false] }
  
  scope :unread, -> { where(read: false) }
  scope :recent, -> { order(created_at: :desc) }
end