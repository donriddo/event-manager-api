const Event = require('./model');

const requiredFields = [
  'address',
  'coordinates',
  'from',
  'to',
  'title',
  'details'
];

function dateInRange(start, end, check) {
  return new Date(check) >= new Date(start) && new Date(check) <= new Date(end);
}

exports.create = async (req, res) => {
  const missingFields = _.difference(requiredFields, Object.keys(req.body));

  if (missingFields.length) {
    return res.status(400).json({
      message: 'Some required fields are missing',
      data: missingFields,
    });
  }

  const body = _.pick(req.body, requiredFields);

  const now = new Date();
  const startOfToday = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  if (new Date(body.from) < startOfToday || new Date(body.to) < startOfToday)
    return res.status(400).json({
      message: 'Sorry, you cannot add a date in the past'
    });

  if (new Date(body.to) < new Date(body.from))
    return res.status(400).json({
      message: 'End date cannot be less than Start date'
    });

  body.user = req.user._id;

  if (body.coordinates) {
    body.location = {
      type: 'Point',
      coordinates: [body.coordinates.long, body.coordinates.lat]
    };
  }

  try {
    let existingEvent = await Event.findOne({
      address: body.address },
      null,
      { sort: { createdAt: -1 }
    });

    // reject event if already booked
    // i.e check to make sure start/end date/time doesn't overlap
    if (
      existingEvent && (
        dateInRange(existingEvent.from, existingEvent.to, body.from) ||
        dateInRange(existingEvent.from, existingEvent.to, body.to) ||
        dateInRange(body.from, body.to, existingEvent.from) ||
        dateInRange(body.from, body.to, existingEvent.to)
      )
    ) {
      return res.status(400).json({
        message: 'Sorry, an event has been booked for this place and date range',
        data: {
          from: existingEvent.from,
          to: existingEvent.to,
        }
      });
    }

    let event = await Event.create(body);

    return res.status(200).json({
      message: 'Event created successfully',
      data: event
    });
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
};

exports.list = async (req, res) => {
  try {
    let events = await Event.find({ isDeleted: false }).populate('user');

    if (!events.length)
      return res.status(404).json({ message: 'No event found' });

    return res.status(200).json({
      message: 'Events retrieved successfully',
      data: events
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.listTodayEvents = async (req, res) => {
  const now = new Date();
  const startOfToday = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  startOfToday.setUTCDate(now.getUTCDate());
  startOfToday.setUTCHours(0);

  try {
    let events = await Event.find({
      isDeleted: false,
      from: { $lte: startOfToday },
      to: { $gte: startOfToday }
    }).populate('user');

    if (!events.length)
      return res.status(404).json({ message: 'No event found' });

    return res.status(200).json({
      message: 'Events retrieved successfully',
      data: events
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.read = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id).where(
      'isDeleted', false
    ).populate('user');

    if (!event)
      return res.status(404).json({ message: 'Event not found' });

    return res.status(200).json({
      message: 'Event retrieved successfully',
      data: event
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let event = await Event.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body
    );

    if (!event)
      return res.status(404).json({ message: 'Event not found' });

    return res.status(200).json({
      message: 'Event updated successfully',
      data: event
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    let event = await Event.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true }
    );

    if (!event)
      return res.status(404).json({ message: 'Event not found' });

    return res.status(200).json({
      message: 'Event deleted successfully',
      data: event
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
