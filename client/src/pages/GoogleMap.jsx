import React from 'react'
import LocationUpdater from '../components/LocationUpdater'
import { useSelector } from 'react-redux';
import DriverMap from '../components/DriverMap';

export default function GoogleMap() {
  return (
    <div>
        <div className="h-screen w-full">
            <DriverMap />
        </div>
    </div>
  )
}
