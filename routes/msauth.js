// routes/msauth.js
const express = require('express');
const router = express.Router();
const graphService = require('../services/microsoftGraphService');

/**
 * Middleware to check if user is authenticated in your system
 */
const requireAuth = (req, res, next) => {
  console.log('🔍 Session check:', {
    hasSession: !!req.session,
    sessionID: req.sessionID,
    adminEmail: req.session?.adminEmail,
    sessionData: req.session
  });
  
  if (!req.session || !req.session.adminEmail) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

/**
 * Helper function to get valid access token
 * Automatically refreshes if expired
 */
async function getValidAccessToken(pool, adminEmail) {
  const result = await pool.query(
    'SELECT microsoft_tokens FROM users WHERE email = $1',
    [adminEmail]
  );

  if (result.rows.length === 0 || !result.rows[0].microsoft_tokens) {
    throw new Error('MICROSOFT_NOT_CONNECTED');
  }

  const tokens = result.rows[0].microsoft_tokens;
  
  // Check if token is expired (refresh if within 5 minutes of expiry)
  const expiresAt = new Date(tokens.expiresOn);
  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;

  if (expiresAt.getTime() - now.getTime() < fiveMinutes) {
    console.log('🔄 Access token expired, refreshing...');
    
    try {
      const newTokens = await graphService.refreshToken(tokens);
      
      // Update database with new tokens
      const updatedTokens = {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken || tokens.refreshToken, // Use NEW refresh token if provided
        account: newTokens.account,
        expiresOn: newTokens.expiresOn
      };

      await pool.query(
        'UPDATE users SET microsoft_tokens = $1, updated_at = NOW() WHERE email = $2',
        [JSON.stringify(updatedTokens), adminEmail]
      );

      console.log('✅ Token refreshed successfully');
      return newTokens.accessToken;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      
      // Clear invalid tokens
      await pool.query(
        'UPDATE users SET microsoft_tokens = NULL WHERE email = $1',
        [adminEmail]
      );
      
      throw new Error('MICROSOFT_TOKEN_REFRESH_FAILED');
    }
  }

  return tokens.accessToken;
}

/**
 * GET /api/msauth/login
 * Initiate OAuth flow - returns auth URL
 */
router.get('/login', requireAuth, async (req, res) => {
  try {
    const adminEmail = req.session.adminEmail;
    const authUrl = await graphService.getAuthUrl(adminEmail);
    
    console.log('🔐 Generating Microsoft OAuth URL for:', adminEmail);
    
    res.json({ 
      success: true,
      authUrl 
    });
  } catch (error) {
    console.error('❌ Error generating auth URL:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate authentication URL' 
    });
  }
});

/**
 * GET /api/msauth/callback
 * OAuth callback endpoint - Microsoft redirects here after user login
 */
router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).send('❌ No authorization code received from Microsoft');
    }

    const adminEmail = state; // We passed this as state parameter
    console.log('📥 OAuth callback received for:', adminEmail);

    // Exchange code for tokens
    const tokenResponse = await graphService.acquireTokenByCode(code);
    
    console.log('✅ Tokens acquired from Microsoft');

    // Get user profile to verify
    const profile = await graphService.getUserProfile(tokenResponse.accessToken);
    
    console.log('✅ User profile retrieved:', profile.email);

    // Store tokens in database
    const pool = req.app.locals.pool;
    
    const tokenData = {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      account: tokenResponse.account,
      expiresOn: tokenResponse.expiresOn,
      userProfile: profile
    };

    // Ensure users table has the column
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        microsoft_tokens JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert or update user
    await pool.query(`
      INSERT INTO users (email, microsoft_tokens, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT (email) 
      DO UPDATE SET 
        microsoft_tokens = $2,
        updated_at = NOW()
    `, [adminEmail, JSON.stringify(tokenData)]);

    console.log('✅ Tokens stored in database for:', adminEmail);

    // Success page with auto-close
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Microsoft Account Connected</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
            color: white;
          }
          .container {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
          }
          h1 { margin-bottom: 20px; }
          .check { font-size: 60px; margin-bottom: 20px; }
          p { font-size: 18px; opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="check">✅</div>
          <h1>Microsoft Account Connected!</h1>
          <p><strong>${profile.email}</strong></p>
          <p>You can close this window now.</p>
        </div>
        <script>
          // Notify parent window
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'microsoft-auth-success',
              email: '${profile.email}'
            }, '*');
          }
          
          // Auto-close after 2 seconds
          setTimeout(() => {
            window.close();
          }, 2000);
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('❌ Error in OAuth callback:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Failed</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: #f5f5f5;
          }
          .container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 500px;
          }
          h1 { color: #dc3545; }
          .error { color: #666; margin: 20px 0; }
          button {
            padding: 10px 20px;
            background: #0078d4;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>❌ Authentication Failed</h1>
          <p class="error">${error.message}</p>
          <button onclick="window.close()">Close Window</button>
        </div>
      </body>
      </html>
    `);
  }
});

/**
 * GET /api/msauth/status
 * Check if user has Microsoft account connected
 */
router.get('/status', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const adminEmail = req.session.adminEmail;

    const result = await pool.query(
      'SELECT microsoft_tokens FROM users WHERE email = $1',
      [adminEmail]
    );

    if (result.rows.length === 0 || !result.rows[0].microsoft_tokens) {
      return res.json({
        connected: false
      });
    }

    const tokens = result.rows[0].microsoft_tokens;
    
    res.json({
      connected: true,
      email: tokens.userProfile?.email || tokens.account?.username || 'Unknown',
      displayName: tokens.userProfile?.displayName || null
    });
  } catch (error) {
    console.error('❌ Error checking Microsoft status:', error);
    res.status(500).json({ 
      connected: false,
      error: 'Failed to check connection status' 
    });
  }
});

/**
 * POST /api/msauth/disconnect
 * Remove Microsoft account connection
 */
router.post('/disconnect', requireAuth, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const adminEmail = req.session.adminEmail;

    await pool.query(
      'UPDATE users SET microsoft_tokens = NULL, updated_at = NOW() WHERE email = $1',
      [adminEmail]
    );

    console.log('🔓 Microsoft account disconnected for:', adminEmail);

    res.json({ 
      success: true,
      message: 'Microsoft account disconnected successfully' 
    });
  } catch (error) {
    console.error('❌ Error disconnecting Microsoft account:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to disconnect account' 
    });
  }
});

module.exports = router;
// Export helper function for use in other routes
module.exports.getValidAccessToken = getValidAccessToken;