import mongoose from 'mongoose';
import { Buffer } from 'buffer';

const userSchema = new mongoose.Schema({
  type: { type: String, required: true },
  Aadhaar: { type: String, required: true },
  Age: { type: Number, required: true },
  Gender: { type: String, required: true },
  BloodGrp: { type: String, required: true },
  Address: { type: String, required: true },
  EMobno: { type: String, required: true },
  Mobno: { type: String, required: true },
  FullName: { type: String, required: true },
  rollingno: { type: String, required: true },
  disease: { type: String, required: true },
  profileImage: { type: Buffer, required: true }, // Required field
  aadhaarImage: { type: Buffer, required: true }, 
});

const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;
