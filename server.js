const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const nodemailer = require('nodemailer');
const Event = require('./models/Event'); 

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
mongoose.connect('mongodb://localhost:27017/eventsDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'balasubramanyamchilukala@gmail.com',
        pass: 'frgx kdky sjld ptol', 
    },
});
app.get('/submit', (req, res) => {
    res.render('submit');
});
app.post('/submit', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.send('Event submitted successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting event.');
    }
});
app.get('/admin/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.render('admin', { events });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching events.');
    }
});
app.post('/admin/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        const event = await Event.findByIdAndUpdate(id, { status }, { new: true });
        const mailOptions = {
            from: 'balasubramanyamchilukala@gmail.com',
        to: 'baluchilukala900@gmail.com', 
            subject: `Event ${status}`,
            text: `Dear User,\n\nYour event "${event.title}" has been ${status.toLowerCase()}.\n\nThank you for using our platform!`,
        };

        await transporter.sendMail(mailOptions);

        res.send(`Event has been ${status.toLowerCase()}! Email notification sent.`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating event status or sending email.');
    }
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
