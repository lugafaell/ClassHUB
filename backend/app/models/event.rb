class Event < ApplicationRecord
  belongs_to :admin

  validates :title, presence: true
  validates :description, presence: true
  validates :date, presence: true
  validates :location, presence: true
  validates :simple_description, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true

  validate :end_time_after_start_time

  has_many :notifications, as: :notifiable, dependent: :destroy
  has_many :event_notification_trackers, dependent: :destroy

  # after_create :notify_all_alunos

  private

  def end_time_after_start_time
    return if end_time.blank? || start_time.blank?

    if end_time < start_time
      errors.add(:end_time, "deve ser depois do horário de início")
    end
  end

  # def notify_all_alunos
  #   Aluno.all.each do |aluno|
  #     Notification.create!(
  #       aluno: aluno,
  #       notifiable: self,
  #       message: "Novo evento: #{self.title}",
  #       read: false
  #     )
  #     
  #     NotificationsChannel.broadcast_to(
  #       aluno,
  #       {
  #         type: 'event',
  #         message: "Novo evento: #{self.title}",
  #         id: self.id,
  #         date: self.date.strftime("%d/%m/%Y"),
  #         location: self.location
  #       }
  #     )
  #   end
  # end
end