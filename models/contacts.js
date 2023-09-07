const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const contactsPath = path.join(__dirname, 'contacts.json');
let cachedContacts = null;

const readContactsFromFile = async () => {
	const data = await fs.readFile(contactsPath, 'utf-8');
	return JSON.parse(data);
};

const listContacts = async () => {
	if (cachedContacts === null) {
		cachedContacts = await readContactsFromFile();
	}
	return cachedContacts;
};

const getContactById = async (contactId) => {
	const contacts = await listContacts();
	const contact = contacts.find((c) => c.id === contactId);
	return contact;
};

const removeContact = async (contactId) => {
	const contacts = await listContacts();
	const indexToRemove = contacts.findIndex(
		(contact) => contact.id === contactId
	);
	if (indexToRemove === -1) {
		return null;
	}
	contacts.splice(indexToRemove, 1);
	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	return contacts[indexToRemove];
};

const addContact = async ({ name, email, phone }) => {
	const contacts = await listContacts();
	const newContact = {
		id: uuidv4(),
		name,
		email,
		phone,
	};
	contacts.push(newContact);
	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	cachedContacts = contacts;
	return newContact;
};

const updateContact = async (id, data) => {
	const contacts = await listContacts();
	const index = contacts.findIndex((contact) => contact.id === id);
	if (index === -1) {
		return null;
	}
	contacts[index].name = data.name || contacts[index].name;
	contacts[index].email = data.email || contacts[index].email;
	contacts[index].phone = data.phone || contacts[index].phone;
	
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	cachedContacts = contacts;
	return contacts[index];
};

module.exports = {
	updateContact,
	listContacts,
	getContactById,
	removeContact,
	addContact,
};
