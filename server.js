const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for mock data
let complaints = [
    {
        id: 1,
        title: 'Broken AC in Library',
        description: 'The AC on the 2nd floor of the central library has been leaking water and not cooling since yesterday. It is creating a puddle on the floor which might be dangerous for students walking by with books.',
        category: 'Facilities',
        priority: 'high',
        status: 'pending',
        date: 'Mar 7',
        submittedBy: 'Ananya M. (RA2211003010198)'
    },
    {
        id: 2,
        title: 'Wi-Fi Issue in UB Block',
        description: 'Unable to connect to SRM_Student Wi-Fi network in the UB building across multiple classrooms on the 4th floor.',
        category: 'Technology',
        priority: 'high',
        status: 'in progress',
        date: 'Mar 6',
        submittedBy: 'Rahul S. (RA2211003010452)'
    },
    {
        id: 3,
        title: 'Mess Food Quality',
        description: "The food served in the men's hostel mess(block M) yesterday dinner was cold and the paneer curry seemed stale.",
        category: 'Food Services',
        priority: 'medium',
        status: 'pending',
        date: 'Mar 7',
        submittedBy: 'Karthik V. (RA2211003010892)'
    },
    {
        id: 4,
        title: 'Gym Equipment Maintenance',
        description: "Two treadmills in the campus gym are out of order. The belts are completely loose and the emergency stop buttons don't seem to work.Needs immediate attention to prevent injuries.",
        category: 'Facilities',
        priority: 'high',
        status: 'resolved',
        date: 'Mar 4',
        submittedBy: 'Deepa L. (RA2211003010421)'
    }
];

let nextId = 5;

// Auth Route
app.post('/api/auth/login', (req, res) => {
    const { regNumber, email, password } = req.body;

    // Mock login validation
    if (regNumber && email && password) {
        res.json({
            success: true,
            user: {
                name: 'Rahul S.',
                role: 'Student',
                regNumber,
                email
            }
        });
    } else {
        res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
});

// Get all complaints
app.get('/api/complaints', (req, res) => {
    res.json(complaints);
});

// Get single complaint by ID
app.get('/api/complaints/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const complaint = complaints.find(c => c.id === id);
    if (complaint) {
        res.json(complaint);
    } else {
        res.status(404).json({ message: 'Complaint not found' });
    }
});

// Create a new complaint
app.post('/api/complaints', (req, res) => {
    const newComplaint = {
        id: nextId++,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        priority: req.body.priority,
        status: 'pending', // Default status
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        submittedBy: 'Rahul S. (RA2211003010452)' // Hardcoded for demo based on mock user
    };

    complaints.unshift(newComplaint); // Add to top of list
    res.status(201).json({ success: true, complaint: newComplaint });
});

// Route for all other requests - send the dashboard file if we want SPA-like routing, 
// though the front end uses index.html for login and dashboard.html.
// We keep it simple since express.static will serve index.html by default.

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
