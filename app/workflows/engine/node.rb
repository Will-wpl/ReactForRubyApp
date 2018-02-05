class Node
  attr_reader :name, :code, :events, :status

  def initialize(name, code, status, events)
    @name = name
    @code = code
    @events = events
    @status = status
  end

  def find_event_by_name(event_name)
    events[event_name]
  end

  def pervious_node(event)

  end
end