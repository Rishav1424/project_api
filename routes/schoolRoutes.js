const express = require('express');
const router = express.Router();
const db = require('../config/db');
const geolib = require('geolib');

// Add School API
router.post('/addSchool', async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        // Validate input data
        if (!name || !address || !latitude || !longitude) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate latitude and longitude
        if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Latitude and/or longitude is invalid' });
        }

        const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        const [result] = await db.promise().query(query, [name, address, latitude, longitude]);

        res.status(201).json({ message: 'School added successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// List Schools API
router.get('/listSchools', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        // Validate input data
        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const query = 'SELECT * FROM schools';
        const [results] = await db.promise().query(query);

        const schoolsWithDistance = results.map(school => ({
            ...school,
            distance: geolib.getDistance(
                { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
                { latitude: school.latitude, longitude: school.longitude }
            )
        }));

        const sortedSchools = schoolsWithDistance.sort((a, b) => a.distance - b.distance);
        res.status(200).json(sortedSchools);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
