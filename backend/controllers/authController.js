const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email, password);

    // Check if email and password are entered
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please enter email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    console.log('Found user:', user);

    // User not found
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Password mismatch
    if ((user.password || '').trim() !== password.trim()) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Successful login
    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        status: user.status,
        joined: user.joined
      }
    });

  } catch (error) {
    console.error('Login Error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
};
