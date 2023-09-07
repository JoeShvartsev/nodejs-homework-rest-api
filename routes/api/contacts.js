const express = require('express');
const contacts = require('../../models/contacts');
const router = express.Router();
const { HttpErr } = require('../../helpers/index');
const Joi = require('joi');

const joiScheme = Joi.object({
	name: Joi.string().alphanum().required(),
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ['com', 'net'] },
		})
		.required(),
	phone: Joi.string().required(),
});

const joiSchemаForUpdate = Joi.object({
  name: Joi.string().alphanum().optional(), 
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .optional(),
  phone: Joi.string(),
});

router.get('/', async (req, res, next) => {
	try {
		const result = await contacts.listContacts();
		if (result.length === 0) {
			throw HttpErr(404, 'Contacts not found');
		}
		res.json({
			status: 200,
			result,
		});
	} catch (error) {
		next(error);
	}
});

router.get('/:contactId', async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const result = await contacts.getContactById(contactId);

		if (!result) {
			throw HttpErr(404, 'Contact not found');
		}

		res.json({
			status: 200,
			result,
		});
	} catch (error) {
		next(error);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { error } = joiScheme.validate(req.body);
		if (error) {
			throw HttpErr(400, error.message);
		}
		const data = req.body;
		const result = await contacts.addContact(data);

		return res.json({
			status: 201,
			message: 'Contact created successfully',
		  result,
		});
	} catch (error) {
		next(error);
	}
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;

    const { error } = joiSchemаForUpdate.validate(req.body);

    if (error) {
      throw HttpErr(400, error.details[0].message);
    }

    const updatedContact = await contacts.updateContact(contactId, {
      name,
      email,
      phone,
    });

    if (!updatedContact) {
      throw HttpErr(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: 'Contact updated successfully',
      data: {
        updatedContact,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);

    if (!result) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    return res.json({
      status: 200,
      message: 'Contact deleted',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
