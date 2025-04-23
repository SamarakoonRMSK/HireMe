import React from 'react'
import LocationUpdater from '../components/LocationUpdater'
import { useSelector } from 'react-redux';
import DriverMap from '../components/DriverMap';

export default function GoogleMap() {
    const { currentUser } = useSelector((state) => state.userSlice);
  return (
    <div>
        <div className="h-screen w-full">
            <DriverMap />
        </div>


        <LocationUpdater 
        driverId={currentUser._id} 
        name={currentUser.fullName}
        role={currentUser.role}  
        />
    
    </div>
  )
}
