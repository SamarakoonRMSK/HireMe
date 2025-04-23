import mongoose from "mongoose";

const DriverLocationSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true
  },
  role:{
    type:String,
    required:true,
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  online: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

DriverLocationSchema.index({ location: '2dsphere' });

const DriverLocation = mongoose.model('DriverLocation', DriverLocationSchema);

export default DriverLocation;