class Event
  attr_reader :name, :transitions_to, :turn_to_role, :current_role, :status

  def initialize(name, transitions_to, turn_to_role, current_role, status)
    @name = name
    @transitions_to = transitions_to
    @turn_to_role = turn_to_role
    @current_role = current_role
    @status = status
  end

end