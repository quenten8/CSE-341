const mongodb = require('../db/connect');

let contacts = [];

//Get all contacts (/contacts)
const getContacts = async (req, res, next) => {
    try {
      contacts = await mongodb.getDb().db().collection('user').find().toArray();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(contacts, null, 2));
    } catch (error) {
      next(error);
    }
    return contacts;
};

//Get one contact (/contacts/contact1)
const getContact = async (req, res, next) => {
    try {
        contacts = await mongodb.getDb().db().collection('user').find().toArray();
        const contactId = req.params.id;
        const contact = contacts[0][contactId];
        console.log(contact, contactId)
        if (contact) {
            res.status(200).json(contact);
        } else {
            res.status(404).json({ message: 'Contact was not found' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {getContact, getContacts};