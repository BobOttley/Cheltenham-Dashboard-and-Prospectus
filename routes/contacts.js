const express = require('express');
const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.adminEmail) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

router.get('/', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // CHANGE 'contacts' to your collection name
    const contacts = await db.collection('contacts')
      .find(
        {}, 
        { 
          projection: { 
            name: 1, 
            email: 1, 
            organization: 1,
            // Add your other fields here
          } 
        }
      )
      .sort({ name: 1 })
      .toArray();

    const formattedContacts = contacts.map(contact => ({
      _id: contact._id,
      name: contact.name,
      email: contact.email,
      organization: contact.organization || ''
    })).filter(contact => contact.email);

    res.json({
      success: true,
      contacts: formattedContacts,
      count: formattedContacts.length
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch contacts' 
    });
  }
});

module.exports = router;