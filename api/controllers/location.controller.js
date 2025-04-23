import DriverLocation from '../models/location.model.js';

// Track active driver sockets
const activeDrivers = new Map();

// Update or create driver location
const updateLocation = async (io, data) => {
  try {
    const { driverId, name, lat, lng, role } = data;
    
    const location = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)]
    };
    if(role === "driver"){
      const driverLocation = await DriverLocation.findOneAndUpdate(
        { driverId },
        { 
          name,
          role,
          location, 
          online: true, 
          lastUpdated: Date.now() 
        },
        { upsert: true, new: true }
      ).lean();
      io.emit('driver:location-updated', driverLocation);
    return driverLocation;
    }else{
      console.log("you are not driver");
      return;
      
    }

    // Broadcast to all dispatchers
    
  } catch (error) {
    console.error('Location update error:', error);
    throw error;
  }
};

// Set driver offline
const setOffline = async (io, driverId) => {
  try {
    await DriverLocation.findOneAndUpdate(
      { driverId },
      { online: false }
    );
    io.emit('driver:went-offline', driverId);
  } catch (error) {
    console.error('Set offline error:', error);
    throw error;
  }
};

// Get all online drivers
const getOnlineDrivers = async () => {
  try {
    return await DriverLocation.find({ online: true });
  } catch (error) {
    console.error('Get online drivers error:', error);
    throw error;
  }
};

// Register driver socket
const registerDriver = (io, socket, driverId) => {
  activeDrivers.set(driverId, socket.id);
  console.log(`Driver ${driverId} connected with socket ${socket.id}`);
};

// Unregister driver socket
const unregisterDriver = (io, driverId) => {
  if (activeDrivers.has(driverId)) {
    activeDrivers.delete(driverId);
    console.log(`Driver ${driverId} disconnected`);
  }
};

// Get driver socket ID
const getDriverSocketId = (driverId) => {
  return activeDrivers.get(driverId);
};

export const getOnlineDriversLocation = async(req, res) => {
  try {
    const onlineDrivers = await getOnlineDrivers();
    res.status(200).json(onlineDrivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDriverLocation = async (req, res) => {
  try {
    if (!req.io) throw new Error('Socket.io not available');
    const driverLocation = await updateLocation(req.io, req.body);
    res.status(200).json(driverLocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const offlineDriver = async (req, res) => {
  try {
    if (!req.io) throw new Error('Socket.io not available');
    await setOffline(req.io, req.body.driverId);
    res.status(200).json({ message: 'Driver set to offline' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const setupLocationSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    const { driverId } = socket.handshake.query;
    
    if (driverId && driverId !== 'undefined') {
      // Register driver
      registerDriver(io, socket, driverId);

      // Handle location updates from driver app
      socket.on('driver:update-location', async (data) => {
        try {
          await updateLocation(io, {
            driverId,
            ...data
          });
        } catch (error) {
          console.error('Socket location update error:', error);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        unregisterDriver(io, driverId);
        setOffline(io, driverId).catch(console.error);
      });
    }
  });
};

export const getDriverLocation = async(req,res,next)=>{
  const driver = await DriverLocation.find({ driverId: req.params.driverId });
  if(!driver){
    return next('404','driver not found');
  }else{
    res.status(200).json(driver);
  }
}
