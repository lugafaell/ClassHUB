class EventNotificationTracker < ApplicationRecord
  belongs_to :event
  belongs_to :trackable, polymorphic: true

  validates :event, presence: true
  validates :trackable, presence: true
  validates :trackable_type, inclusion: { in: ['Aluno', 'Professor'] }
end