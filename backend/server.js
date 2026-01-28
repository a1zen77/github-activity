const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to format activity
const formatActivity = (events) => {
  return events.map(event => {
    const repo = event.repo.name;
    const type = event.type;
    
    switch(type) {
      case 'PushEvent':
        const commitCount = event.payload.commits?.length || 0;
        return `Pushed ${commitCount} commit${commitCount !== 1 ? 's' : ''} to ${repo}`;
      
      case 'IssuesEvent':
        const action = event.payload.action;
        return `${action.charAt(0).toUpperCase() + action.slice(1)} an issue in ${repo}`;
      
      case 'WatchEvent':
        return `Starred ${repo}`;
      
      case 'ForkEvent':
        return `Forked ${repo}`;
      
      case 'CreateEvent':
        const refType = event.payload.ref_type;
        return `Created ${refType} in ${repo}`;
      
      case 'PullRequestEvent':
        const prAction = event.payload.action;
        return `${prAction.charAt(0).toUpperCase() + prAction.slice(1)} a pull request in ${repo}`;
      
      case 'IssueCommentEvent':
        return `Commented on an issue in ${repo}`;
      
      case 'DeleteEvent':
        const delRefType = event.payload.ref_type;
        return `Deleted ${delRefType} in ${repo}`;
      
      case 'PublicEvent':
        return `Made ${repo} public`;
      
      case 'MemberEvent':
        return `Added a collaborator to ${repo}`;
      
      case 'ReleaseEvent':
        return `Published a release in ${repo}`;
      
      default:
        return `${type.replace('Event', '')} in ${repo}`;
    }
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/user/:username/activity', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ 
        error: 'Username is required',
        message: 'Please provide a valid GitHub username'
      });
    }

    // Fetch user events from GitHub API
    const response = await axios.get(
      `https://api.github.com/users/${username}/events`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Activity-Viewer'
        }
      }
    );

    if (response.data.length === 0) {
      return res.json({
        username,
        activity: [],
        message: 'No recent activity found for this user'
      });
    }

    const formattedActivity = formatActivity(response.data);

    res.json({
      username,
      activity: formattedActivity,
      count: formattedActivity.length
    });

  } catch (error) {
    if (error.response) {
      // GitHub API returned an error
      if (error.response.status === 404) {
        return res.status(404).json({
          error: 'User not found',
          message: `GitHub user '${req.params.username}' does not exist`
        });
      } else if (error.response.status === 403) {
        return res.status(403).json({
          error: 'Rate limit exceeded',
          message: 'GitHub API rate limit exceeded. Please try again later.'
        });
      }
    }
    
    // Generic error
    console.error('Error fetching GitHub activity:', error.message);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch user activity. Please try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});