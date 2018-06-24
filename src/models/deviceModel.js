import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';


export const DeviceSchema = new Schema({
  name: { type: String, trim: true, required: true },
  serial_number: { type: String, trim: true, unique: true, required: true },
  device_qr_code: { type: String, trim: true },
  manufacturer: { type: String, required: true, trim: true},
  user_id: { type: Schema.Types.ObjectId, required: true },
  active: { type: Boolean, default: true }
}, { collection: 'devices' });

DeviceSchema.plugin(timestamps);
DeviceSchema.plugin(mongooseStringQuery);

module.exports = exports = mongoose.model('Device', DeviceSchema);
