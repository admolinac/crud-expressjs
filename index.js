
require('dotenv').config();

const express = require('express');
const logger = require('./logger');
const { validate, createEventValidation, getEventByIdValidation, updateEventValidation } = require('./validation');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());

app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
    const time = process.uptime();
    res.json({ status: 'OK', message: 'Service is healthy!', time });
});

// CRUD endpoints for event entity
let events = [
    {
        id: "a6b2d36f-6d2e-48f2-9f3a-12d9b6d0c7a1",
        name: "Salary",
        description: "Monthly salary payment",
        amount: 1500,
        date: new Date("2025-03-01"),
        type: "income",
        attachment: "salary-slip.pdf"
    },
];

// Get all events
app.get('/api/events', (req, res) => {
    let { page, limit } = req.query;

    if (page && limit) {
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        const start = (page - 1) * limit;
        const end = start + limit;
        const eventsPage = events.slice(start, end);

        res.status(200).json({
            code: 'OK',
            message: 'Events retrieved successfully in pagination',
            data: eventsPage,
            pagination: {
                page,
                limit,
                total: events.length
            }
        });
    }

    res.status(200).json(
        {
            code: 'OK',
            message: 'Events retrieved successfully',
            data: events
        }
    );
});

//Get event by ID
app.get('/api/events/:id', validate(getEventByIdValidation), (req, res) => {
    const { id } = req.params;
    const event = events.find(event => event.id === id);

    if (!event) {
        return res.status(404).json({ code: 'NF', message: 'Event not found' });
    }

    res.status(200).json(
        {
            code: 'OK',
            message: 'Event found',
            data: event
        }
    );
});

//Create event
app.post('/api/events', validate(createEventValidation), (req, res) => {
    const { name, description, amount, date, type, attachment } = req.body;
    const newEvent = {
        id: require('uuid').v4(),
        name,
        amount,
        date: new Date(date),
        type,
    };

    if (description) {
        newEvent.description = description;
    }

    if (attachment) {
        newEvent.attachment = attachment;
    }

    events.push(newEvent);
    res.status(200).json(
        {
            code: 'OK',
            message: 'Event created successfully!',
            data: newEvent

        }
    );
});

//Update event
app.put('/api/events/:id', validate(updateEventValidation), (req, res) => {
    const { id } = req.params;
    const event = events.find(event => event.id === id);

    if (event) {
        const { name, description, amount, date, type, attachment } = req.body;

        if (name) event.name = name;
        if (description) event.description = description;
        if (amount) event.amount = amount;
        if (date) event.date = new Date(date);
        if (type) event.type = type;
        if (attachment) event.attachment = attachment;

        res.status(200).json({ code: 'OK', message: 'Event updated!', data: event });
        return;
    }
    res.status(404).json({ code: 'NF', message: 'Event not found!' });
});

//Delete event
app.delete('/api/events/:id', (req, res) => {
    const { id } = req.params;
    const event = events.find(event => event.id === id);
    if (event) {
        events = events.filter(user => user.id != id);
        return res.json({ code: 'OK', message: 'Event deleted!', data: event })
    }
    res.status(404).json({ code: 'PF', message: 'Event not found!' });
});



app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ code: 'ERR', message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});