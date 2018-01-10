class Event
  attr_reader :name, :transitions_to, :turn_to_role

  def initialize(name, transitions_to, turn_to_role)
    @name = name
    @transitions_to = transitions_to
    @turn_to_role = turn_to_role
  end

end