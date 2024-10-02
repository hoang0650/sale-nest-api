const {Contact} = require('../models/contact');


// POST: Gửi tin nhắn liên hệ
async function sendContact(req,res) {
    const { name, email, subject, message } = req.body;
    
    try {
        const newContact = new Contact({
            name,
            email,
            subject,
            message
        });
        
        await newContact.save();
        res.status(201).json({ message: 'Contact message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

// GET: Lấy tất cả các tin nhắn liên hệ (chỉ dành cho admin)
async function getContacts(req,res) {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve contact messages' });
    }
}

module.exports = {sendContact,getContacts};
