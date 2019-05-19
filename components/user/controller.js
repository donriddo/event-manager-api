const User = require('./model');
const Event = require('../event/model');

const requiredFields = [
  'firstName',
  'lastName',
  'email',
  'password'
];


exports.create = async (req, res) => {
  const missingFields = _.difference(requiredFields, Object.keys(req.body));

  if (missingFields.length) {
    return res.status(400).json({
      message: 'Some required fields are missing',
      data: missingFields,
    });
  }

  const body = _.pick(req.body, requiredFields);

  try {
    let user = await User.create(body);

    return res.status(200).json({
      message: 'User created successfully',
      data: user
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({
        message: "Email exists"
      });

    return res.status(400).json({ message: err.message })
  }
};

exports.list = async (req, res) => {
  try {
    let users = await User.find({ isDeleted: false });

    if (!users.length)
      return res.status(404).json({ message: 'No user found' });

    return res.status(200).json({
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.read = async (req, res) => {
  try {
    let user = await User.findById(req.params.id).where('isDeleted', false);

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      message: 'User retrieved successfully',
      data: user
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      _.pick(req.body, requiredFields)
    );

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      message: 'User updated successfully',
      data: user
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true }
    );

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      message: 'User deleted successfully',
      data: user
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.listUserEvents = async (req, res) => {
  try {
    let events = await Event.find({
      user: req.user._id, isDeleted: false
    }).populate('user');
    if (!events.length)
      return res.status(404).json({ message: 'You have not added any event' });

    return res.status(200).json({
      message: 'Events retrieved successfully',
      data: events
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
