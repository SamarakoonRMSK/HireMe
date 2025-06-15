import { Spinner } from 'flowbite-react';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
    const { currentUser } = useSelector((state) => state.userSlice);
          const [user, setUser] = useState(null);
          const [loading, setLoading] = useState(true);
    
    
           useEffect(() => {
        const getUser = async () => {
          try {
            const res = await fetch("/api/auth/privateRoute");
            const data = await res.json();
            setUser(data);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        };
        getUser();
      }, []);
    
      if (loading) {
          return (
            <div className="flex justify-center items-center min-h-screen">
              <Spinner size="xl" />
            </div>
          );
        } 

    return currentUser._id === user.id ? <Outlet /> : <Navigate to="/signin" />;

}
