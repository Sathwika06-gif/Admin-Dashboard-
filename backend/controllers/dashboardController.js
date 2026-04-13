const axios = require('axios');

exports.getStats = async (req, res) => {
  try {
    const usersAPI = await axios.get('https://jsonplaceholder.typicode.com/users');

    const totalUsers = usersAPI.data.length;

    res.json({
      totalUsers,
      activeUsers: totalUsers - 2,
      sales: Math.floor(Math.random() * 10000)
    });

  } catch (err) {
    res.status(500).json(err);
  }
};