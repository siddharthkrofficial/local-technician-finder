import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success', duration = 1000) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, duration);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <div className={`notification-container notification-${notification.type}`}>
                    <p>{notification.message}</p>
                    <div className="notification-line"></div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;