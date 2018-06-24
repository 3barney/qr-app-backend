import jwt from 'jsonwebtoken';

import config from '../config';
import User from '../models/userModel';
import logger from '../utils/logger';

function showErrors(res, err) {
  return res.status(422).send(err.errors);
}

// Get user listing
exports.list = (req, res) => {
  const params = req.params || {};
  const query = req.query || {};

  const page = parseInt(query.page, 10) || 0;
  const perPage = parseInt(query.per_page, 10) || 10;

  User.apiQuery(req.query)
    .select('email first_name last_name username phone active')
    .then(users => {
      res.json({ "users": users });
    })
    .catch(err => {
      logger.error(err);
      showErrors(res, err);
    })
}

// Save a user, REGISTER TO APP
exports.post = (req, res) => {
	const data = Object.assign({}, req.body);
  User.create(data)
    .then(user => {
			const token = jwt.sign({ id: user._id }, config.auth.secret)
			const userDetails = { ...user.toObject(), token }
			res.json(userDetails)
		})
    .catch(err => {
      logger.error(err);
      showErrors(res, err);
    })
}

// LOGIN endpoint
exports.login = (req, res) => {
	let userDetails;
	const { email, password } = req.body;
	User.findOne({ 'email' : email})
		.then(user => {
			if (user) {
				userDetails = user;
				return user.verifyPassword(password);
			} else {
				res.json({ "Failed": "Invalid Login credentials" })
			}
		})
		.then(verified => {
			if (verified) {
				const token = jwt.sign({ id: userDetails._id }, config.auth.secret);
				const response = { ...userDetails.toObject(), token };
				res.json(response);
			} else {
				res.json({ "Failed": "Invalid Login credentials" });
			}
		})
		.catch(err => {
			logger.error(err);
			showErrors(res, err);
		})		
}

// Return single user
exports.get = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      user.password = undefined;
      res.json({ "users": user })
    })
    .catch(err => {
      logger.error(err);
      showErrors(res, err);
    })
}

// Update a user details
exports.put = (req, res) => {
	const data = req.body || {};

	if (data.email && !validator.isEmail(data.email)) {
		return res.status(422).send('Invalid email address.');
	}

	if (data.username && !validator.isAlphanumeric(data.username)) {
		return res.status(422).send('Usernames must be alphanumeric.');
	}

	User.findByIdAndUpdate({ _id: req.params.userId }, data, { new: true })
		.then(user => {
			if (!user) {
				return res.sendStatus(404);
			}

			user.password = undefined;
			user.recoveryCode = undefined;

			res.json(user);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};

// Delete a single user
exports.delete = (req, res) => {
	User.findByIdAndUpdate(
		{ _id: req.params.user },
		{ active: false },
		{
			new: true
		}
	)
		.then(user => {
			if (!user) {
				return res.sendStatus(404);
			}

			res.sendStatus(204);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};