const Event = require('../models/Event');


exports.createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !date) return res.status(400).json({ message: 'Title and date required' });


    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; 
    }

    const ev = new Event({
      user: req.userId,
      title,
      description: description || '',
      date: new Date(date),
      imageUrl
    });

    await ev.save();
    res.json(ev);
  } catch (err) {
    console.error('createEvent err', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getEvents = async (req, res) => {
  try {
    const status = req.query.status; 
    const filter = { user: req.userId };
    if (status) filter.status = status;
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('getEvents err', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };


    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const ev = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateData,
      { new: true }
    );
    if (!ev) return res.status(404).json({ message: 'Not found' });
    res.json(ev);
  } catch (err) {
    console.error('updateEvent', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// delete
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteEvent', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
