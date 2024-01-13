'use client'

const Event = require('../models/eventModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const { findById } = require('../models/userModel');
const JWT = require('jsonwebtoken');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function sendEmail(invitation, eventTitle, description, eventId) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: invitation,
    subject: 'You are invited to ' + eventTitle + "!",
    text: description + '\n\nClick the link below to confirm your participation.\n\n',
    html: '<p>Click <a href="http://localhost:3000/event/' + eventId + '">here</a> to confirm your participation.</p>',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent to', invitation, ':', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email to', invitation, ':', error);
    throw error;
  }
}

exports.attend = async (req, res) => {
  const eventId = req.params.eventId;
  const userMail = req.params.userMail;

  try {
    console.log('Event ID:', eventId);
    console.log('User Email:', userMail);

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(400).json({ message: 'Event not found' });
    }

    if (event.participants.includes(userMail)) {
      return res.status(400).json({ message: 'User is already a participant in this event.' });
    }

    event.participants.push(userMail);

    await event.save();

    return res.status(200).json({ message: 'Successfully attended the event.' });

  } catch (error) {
    console.error('Error attending event: ', error);
    return res.status(500).json({ message: 'An error occurred while attending the event.' });
  }
};



exports.confirmation = async (req, res) => {
  const eventId = req.params.eventId;
  const userMail = req.params.userMail;

  try {
    // Find the event by its ID
    const event = await Event.findById(eventId);

    if (!event) {
      // Event not found
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the userMail is present in the invitations array
    const invitationIndex = event.invitations.indexOf(userMail);

    if (invitationIndex === -1) {
      // userMail is not found in the invitations array
      return res.status(400).json({ message: 'Invalid userMail for this event' });
    }

    // Remove the userMail from the invitations array
    event.invitations.splice(invitationIndex, 1);

    // Add the userMail to the participants list
    event.participants.push(userMail);

    // Save the updated event
    await event.save();

    // Return a success message or any other response as needed
    return res.status(200).json({ message: 'Event confirmation successful' });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error confirming event:', error);
    return res.status(500).json({ message: 'An error occurred while confirming the event' });
  }
};


exports.createEvent = async (req, res) => {
  const event = new Event({
    name: req.body.name,
    description: req.body.description,
    organizer: req.body.organizer,
    date: req.body.date,
    location: req.body.location,
    invitations: req.body.invitations,
    participants: req.body.participants,
    category: req.body.category,
  });

  try {
    const newEvent = await event.save();

    const invitations = req.body.invitations;

    const eventId = newEvent._id;

    invitations.forEach((invitation) => {
      sendEmail(invitation, req.body.name, req.body.description, eventId);
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const id = req.params.eventId;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    
    if (deletedEvent) {
      res.json(deletedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};