const express = require('express');
const router = express.Router();

let users = [
  { name: 'John', email: 'john@gmail.com', role: 'Admin', status: 'Active' },
  { name: 'Sara', email: 'sara@gmail.com', role: 'User', status: 'Inactive' }
];

router.get('/', (req, res) => {
  res.json(users);
});

router.post('/', (req, res) => {
  users.push(req.body);
  res.json({ message: 'User added' });
});

module.exports = router;