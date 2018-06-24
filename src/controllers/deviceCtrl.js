import QRCode from 'qrcode';

import Device from '../models/deviceModel';
import logger from '../utils/logger';

function showErrors(res, err) {
  return res.status(422).send(err.errors);
}

const createQrCode = async device => {
  const { serial_number, manufacturer, user_id } = device;
  const deviceString = `${serial_number}#${manufacturer}#${user_id}`;
  try {
    return await QRCode.toDataURL(deviceString);
  } catch (err) {
    logger.error(err);
  }
}

exports.listUserDevices = (req, res) => {
  const { userId } = req.params;
  Device.find({ 'user_id': userId })
  .select('name serial_number device_qr_code active')
  .then(devices => res.json({ "devices": devices }))
  .catch(err => {
    logger.error(err);
    showErrors(res, err);
  })
};

exports.fetchSingleUserDevice = (req, res)  => {
  const { userId, deviceId } = req.params;
  Device.findOne({ '_id': deviceId })
    .select('name serial_number device_qr_code active')
    .then(device => res.json({ "device": device }))
    .catch(err => {
      logger.error(err);
      showErrors(res, err);
    })    
};

exports.createUserDevice = (req, res) => {
  let userDevice;
  const { userId } = req.params;
  const { name, serial_number, manufacturer }= req.body;
  Device.create({ 
    name, serial_number, manufacturer, "user_id": userId
  })
    .then(device => {
      userDevice = device;
      return createQrCode(device);
    })
    .then(receivedQrString => {
      userDevice.device_qr_code = receivedQrString;
      return userDevice.save();
    })
    .then(updatedDevice => res.json(updatedDevice))
    .catch(err => {
      logger.error(err);
      showErrors(res, err);
    })
};

exports.updateDeviceDetails = (req, res) => {};

exports.deleteUserDevice = (req, res) => {};