import Device from '../controllers/deviceCtrl';
import verifyToken from '../utils/auth/verifyToken';

module.exports = api => {
  api.route('/users/:userId/device').get(verifyToken, Device.listUserDevices);
  api.route('/users/:userId/device/:deviceId').get(verifyToken, Device.fetchSingleUserDevice);
  api.route('/users/:userId/device').post(verifyToken, Device.createUserDevice);
  api.route('/users/:userId/device/:deviceId').put(verifyToken, Device.updateDeviceDetails);
  api.route('/users/:userId/device/:deviceId').delete(verifyToken, Device.deleteUserDevice);
}
