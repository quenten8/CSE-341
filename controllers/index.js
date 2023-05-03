const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

//Get all contacts (/contacts)
const getContacts = async (req, res, next) => {
    try {
        const contacts = await mongodb.getDb().db().collection('user').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(contacts, null, 2));
    } catch (error) {
        next(error);
    }
};

//Get one contact (/contacts/contact1)
const getContact = async (req, res, next) => {
    try {
        const contactId = new ObjectId(req.params.id);
        const contact = await mongodb.getDb().db().collection('user').findOne({ _id: contactId });
        if (contact) {
            res.status(200).json(contact);
        } else {
            res.status(404).json({ message: 'Contact was not found' });
        }
    } catch (error) {
        next(error);
    }
};

//Add contact
const addContact = async (req, res, next) => {
    try {
        const { firstname, lastname, email, favoriteColor, birthday } = req.body;
        if (!firstname || !lastname || !email || !favoriteColor || !birthday) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const result = await mongodb.getDb().db().collection('user').insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (error) {
        next(error);
    }
};

//Change existing contact
const changeContact = async (req, res, next) => {
    try {
        const ID = new ObjectId(req.params.id);
        let contact = await mongodb.getDb().db().collection('user').findOne({ _id: ID });

        if (!contact) {
            res.status(404).json({ message: 'Contact not found', ID });
            return;
        }

        const result = await mongodb.getDb().db().collection('user').updateOne(
            { _id: ID },
            {
              $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                favoriteColor: req.body.favoriteColor,
                birthday: req.body.birthday
              }
            }
          );
        res.status(204).json({ message: 'Contact has been updated', ID });
    } catch (error) {
        next(error);
    }
};

//Delete contact
const deleteContact = async (req, res, next) => {
    try {
        const ID = new ObjectId(req.params.id);
        let contact = await mongodb.getDb().db().collection('user').findOne({ _id: ID });

        if (!contact) {
            res.status(404).json({ message: 'Contact not found', ID, contact });
            return;
        }

        const result = await mongodb.getDb().db().collection('user').deleteOne({ _id: ID });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Contact deleted', ID });
        } else {
            res.status(404).json({ message: 'Contact not deleted' });
        }

    } catch (error) {
        next(error);
    }
};

module.exports = { getContact, getContacts, addContact, changeContact, deleteContact };