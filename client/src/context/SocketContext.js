import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const { user, token } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user || !token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io('http://localhost:8080', {
            auth: { token }
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        newSocket.on('data:stale', (data) => {
            // Invalidate relevant queries based on type
            if (data.type === 'reviews' || data.type === 'proposals') {
                queryClient.invalidateQueries({ queryKey: ['proposals', 'list'] });
                queryClient.invalidateQueries({ queryKey: ['proposals', 'detail'] });
            }
        });

        // Lisen for proposal events & invalidate queries
        newSocket.on('proposal:created', (data) => {
            console.log('New proposal:', data);

            // Invalidate relevant queries
            if (user.role === 'REVIEWER' || user.role === 'ADMIN') {
                queryClient.invalidateQueries({ queryKey: ['proposals', 'list'] });
            }

            addNotification({
                type: 'proposal:created',
                ...data,
                timestamp: new Date().toISOString()
            });
        });

        newSocket.on('proposal:reviewed', (data) => {
            console.log('Proposal reviewed:', data);

            //  Invalidate speakers proposals
            if (user.role === 'SPEAKER') {
                queryClient.invalidateQueries({ queryKey: ['proposals', 'my'] });
            }
            // also invalidate the specific proposal if needed
            queryClient.invalidateQueries({ queryKey: ['proposals', 'detail', data.proposalId] });

            addNotification({
                type: 'proposal:reviewed',
                ...data,
                timestamp: new Date().toISOString()
            });
        });

        newSocket.on('proposal:statusChanged', (data) => {
            console.log('Status changed:', data);

            // Invalidate speakers proposals
            if (user.role === 'SPEAKER') {
                queryClient.invalidateQueries({ queryKey: ['proposals', 'my'] });
            }
            //  reviewers/admins
            if (user.role === 'REVIEWER' || user.role === 'ADMIN') {
                queryClient.invalidateQueries({ queryKey: ['proposals', 'list'] });
            }
            // specific proposal
            queryClient.invalidateQueries({ queryKey: ['proposals', 'detail', data.proposalId] });

            addNotification({
                type: 'proposal:statusChanged',
                ...data,
                timestamp: new Date().toISOString()
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user, token, queryClient]);

    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev].slice(0, 20));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const removeNotification = (index) => {
        setNotifications(prev => prev.filter((_, i) => i !== index));
    };

    const value = {
        socket,
        notifications,
        clearNotifications,
        removeNotification
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};