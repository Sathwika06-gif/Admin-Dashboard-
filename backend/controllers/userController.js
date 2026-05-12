const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../data/accounts.csv');

// ======================================================
// Convert users in MongoDB to accounts.csv
// ======================================================
async function rewriteCSV() {
  const users = await User.find().lean();

  const headers = [
    'account',
    'name',
    'email',
    'password',
    'role',
    'status',
    'joined',
    'sector',
    'year_established',
    'revenue',
    'employees',
    'office_location',
    'subsidiary_of'
  ];

  const lines = [headers.join(',')];

  users.forEach((user) => {
    const row = [
      user.account || user.name || '',
      user.name || '',
      user.email || '',
      user.password || '',
      user.role || 'User',
      user.status || 'Active',
      user.joined || '',
      user.sector || '',
      user.year_established || '',
      user.revenue || '',
      user.employees || '',
      user.office_location || '',
      user.subsidiary_of || ''
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(',');

    lines.push(row);
  });

  fs.writeFileSync(csvPath, lines.join('\n'), 'utf8');
}

// ======================================================
// GET /api/users
// ======================================================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ joined: -1 });

    const formattedUsers = users.map((user) => {
      const name = user.name || user.account || 'Unknown User';

      return {
        _id: user._id,
        account: user.account || name,
        name: name,
        email:
          user.email ||
          name.toLowerCase().replace(/[^a-z0-9]+/g, '.') + '@example.com',
        password: user.password || '',
        role: user.role || 'User',
        status: user.status || 'Active',
        joined: user.joined || '',
        sector: user.sector || '',
        year_established: user.year_established || '',
        revenue: user.revenue || '',
        employees: user.employees || '',
        office_location: user.office_location || '',
        subsidiary_of: user.subsidiary_of || ''
      };
    });

    res.json(formattedUsers);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({
      message: 'Failed to load users',
      error: error.message
    });
  }
};

// ======================================================
// POST /api/users
// ======================================================
exports.createUser = async (req, res) => {
  try {
    const body = req.body;

    const userData = {
      account: body.account || body.name || '',
      name: body.name || body.account || '',
      email: body.email || '',
      password: body.password || '',
      role: body.role || 'User',
      status: body.status || 'Active',
      joined:
        body.joined ||
        new Date().toISOString().split('T')[0],
      sector: body.sector || '',
      year_established: body.year_established || '',
      revenue: body.revenue || '',
      employees: body.employees || '',
      office_location: body.office_location || '',
      subsidiary_of: body.subsidiary_of || ''
    };

    const user = await User.create(userData);

    // Update CSV
    await rewriteCSV();

    res.json(user);
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// ======================================================
// PUT /api/users/:id
// ======================================================
exports.updateUser = async (req, res) => {
  try {
    const body = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        account: body.account || body.name || '',
        name: body.name || body.account || '',
        email: body.email || '',
        password: body.password || '',
        role: body.role || 'User',
        status: body.status || 'Active',
        joined: body.joined || '',
        sector: body.sector || '',
        year_established: body.year_established || '',
        revenue: body.revenue || '',
        employees: body.employees || '',
        office_location: body.office_location || '',
        subsidiary_of: body.subsidiary_of || ''
      },
      { new: true }
    );

    // Update CSV
    await rewriteCSV();

    res.json(updatedUser);
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// ======================================================
// DELETE /api/users/:id
// ======================================================
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    // Update CSV
    await rewriteCSV();

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      message: 'Failed to delete user',
      error: error.message
    });
  }
};