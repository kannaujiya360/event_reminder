
const Event = require('../models/Event');

exports.markReminderSent = async (eventId) => {
  try {
    await Event.findByIdAndUpdate(eventId, { reminderSent: true });
  } catch (err) {
    console.error('markReminderSent err', err);
  }
};
