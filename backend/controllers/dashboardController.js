const User = require('../models/User');
const Content = require('../models/Content');
const Transaction = require('../models/Transaction');

// Optional Activity model (used to show create/update/delete actions)
let Activity = null;
try {
  Activity = require('../models/Activity');
} catch (err) {
  Activity = null;
}

// GET /api/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // =========================
    // LAST 10 DAYS
    // =========================
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // =========================
    // USERS
    // =========================
    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      status: 'Active'
    });

    // =========================
    // SIGNUP TREND (LAST 10 DAYS)
    // =========================
    const users = await User.find();

    const signupTrend = [];

    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dateStr = date.toISOString().slice(0, 10);

      const count = users.filter((user) => {
        if (!user.joined) return false;
        return String(user.joined).substring(0, 10) === dateStr;
      }).length;

      signupTrend.push({
        date: dateStr,
        value: count
      });
    }

    const newSignups = signupTrend.reduce(
      (sum, item) => sum + item.value,
      0
    );

    // =========================
    // ROLE DISTRIBUTION
    // =========================
    const roleAggregation = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          count: -1
        }
      }
    ]);

    const roleDistribution = roleAggregation.map((item) => ({
      role: item._id || 'User',
      count: item.count
    }));

    // =========================
    // CONTENT
    // =========================
    const totalContent = await Content.countDocuments();

    const publishedContent = await Content.countDocuments({
      status: 'Published'
    });

    // =========================
    // REVENUE
    // =========================
    const revenueResult = await User.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $toDouble: {
                $ifNull: ['$revenue', 0]
              }
            }
          }
        }
      }
    ]);

    const revenue =
      revenueResult.length > 0
        ? Math.round(revenueResult[0].total)
        : 0;

    // =========================
    // REVENUE TREND
    // =========================
    const transactions = await Transaction.find()
      .select('amount')
      .lean();

    const revenueTrend = transactions.map((item, index) => {
      const d = new Date();
      d.setDate(d.getDate() - (transactions.length - index - 1));

      return {
        date: d.toISOString().slice(0, 10),
        value: Number(item.amount || 0)
      };
    });

    // =========================
    // RECENT ACTIVITY
    // Shows:
    // - User created/updated/deleted
    // - Content created/updated/deleted
    // =========================
    let recentActivities = [];

    // If Activity model exists, use it (recommended)
    if (Activity) {
      const activityDocs = await Activity.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      recentActivities = activityDocs.map((item) => ({
        icon: item.icon || 'AC',
        text: item.text || 'Activity performed',
        time: formatRelativeTime(item.createdAt)
      }));
    }

    // Fallback if Activity model does not exist
    if (recentActivities.length === 0) {
      const recentUsers = await User.find()
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(10)
        .lean();

      const recentContents = await Content.find()
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(10)
        .lean();

      const userActivities = recentUsers.map((user) => {
        const created =
          user.createdAt ? new Date(user.createdAt).getTime() : 0;
        const updated =
          user.updatedAt ? new Date(user.updatedAt).getTime() : 0;

        const isNew = created && updated && created === updated;

        return {
          icon: getInitials(user.name || 'User'),
          text: isNew
            ? `${user.name || 'User'} was created`
            : `${user.name || 'User'} was updated`,
          timestamp: user.updatedAt || user.createdAt
        };
      });

      const contentActivities = recentContents.map((content) => {
        const created =
          content.createdAt ? new Date(content.createdAt).getTime() : 0;
        const updated =
          content.updatedAt ? new Date(content.updatedAt).getTime() : 0;

        const isNew = created && updated && created === updated;

        return {
          icon: 'CT',
          text: isNew
            ? `Content "${content.title || 'Untitled'}" was created`
            : `Content "${content.title || 'Untitled'}" was updated`,
          timestamp: content.updatedAt || content.createdAt
        };
      });

      recentActivities = [...userActivities, ...contentActivities]
        .sort(
          (a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        )
        .slice(0, 10)
        .map((item) => ({
          icon: item.icon,
          text: item.text,
          time: formatRelativeTime(item.timestamp)
        }));
    }

    // =========================
    // RESPONSE
    // =========================
    res.json({
      totalUsers,
      activeUsers,
      newSignups,
      revenue,
      totalContent,
      publishedContent,
      revenueTrend,
      signupTrend,
      roleDistribution,
      recentActivities
    });
  } catch (error) {
    console.error('Dashboard Error:', error);

    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// GET /api/dashboard/analytics
exports.getAnalytics = async (req, res) => {
  return exports.getDashboardStats(req, res);
};

// =========================
// Helper: Initials
// =========================
function getInitials(name) {
  return String(name)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

// =========================
// Helper: Relative Time
// =========================
function formatRelativeTime(date) {
  if (!date) return 'Today';

  const now = new Date();
  const diffMs = now - new Date(date);

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    const value = minutes || 1;
    return `${value} minute${value === 1 ? '' : 's'} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';

  return `${days} days ago`;
}