const express = require('express');
const router = express.Router();
const PaymentAppointment = require('../models/Payment'); // Note: model name is Payment
const auth = require('../middleware/authMiddleware');

// GET all payment appointments
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await PaymentAppointment.find({ user: req.user.id });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new payment appointment
router.post('/', auth, async (req, res) => {
  const appointment = new PaymentAppointment({
    title: req.body.title,
    amount: req.body.amount,
    date: req.body.date,
    notes: req.body.notes,
    user: req.user.id,
  });

  try {
    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH/PUT to update a payment appointment (e.g., status to 'Paid')
router.patch('/:id', auth, async (req, res) => {
  try {
    const appointment = await PaymentAppointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Payment appointment not found' });
    }

    // Ensure the payment appointment belongs to the authenticated user
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    if (req.body.title != null) {
      appointment.title = req.body.title;
    }
    if (req.body.amount != null) {
      appointment.amount = req.body.amount;
    }
    if (req.body.date != null) {
      appointment.date = req.body.date;
    }
    if (req.body.status != null) {
      appointment.status = req.body.status;
    }
    if (req.body.notes != null) {
      appointment.notes = req.body.notes;
    }

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a payment appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await PaymentAppointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Payment appointment not found' });
    }

    // Ensure the payment appointment belongs to the authenticated user
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await PaymentAppointment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;