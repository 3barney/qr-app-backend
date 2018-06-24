import User from '../controllers/userCtrl';
import verifyToken from '../utils/auth/verifyToken';

module.exports = api => {
  api.route('/login').post(User.login);
  api.route('/register').post(User.post)

  api.route('/users').get(verifyToken, User.list);
  api.route('/users/:userId').get(verifyToken, User.get);
  api.route('/users/:userId').put(verifyToken, User.put);
  api.route('user/:userId').delete(verifyToken, User.delete);
}