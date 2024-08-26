/**
 * Description: Chat context to manage user chats and potential chats
 */

// Import necessary modules
import { createContext, useState, useEffect, useCallback } from 'react';
import { getRequest, baseUrl, postRequest } from '../utils/services';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
import {  } from 'react-bootstrap';

// Create context
export const ChatContext = createContext();

// Create context provider
export const ChatContextProvider = ({ children, user }) => {
    // Add 'children' to props validation
    ChatContextProvider.propTypes = {
        children: PropTypes.node.isRequired,
        user: PropTypes.object,
    // Remove the extra closing brace
};

    // Initialize state variables
    const [ userChats, setUserChats ] = useState(null);
    const [ isUserChatsLoading, setIsUserChatsLoading ] = useState(false);
    const [ userChatsError, setUserChatsError ] = useState(null);

    const [ potentialChats, setPotentialChats ] = useState([]);

    const [ currentChat, setCurrentChat ] = useState(null);

    const [ messages, setMessages ] = useState([]);
    const [ isMessagesLoading, setIsMessagesLoading ] = useState(false);
    const [ messagesError, setMessagesError ] = useState(null);

    const [ sendMessageError, setSendMessageError ] = useState(false);
    const [ newMessage, setNewMessage ] = useState(null);

    const [ socket, setSocket ] = useState(null);
    const [ onlineUsers, setOnlineUsers ] = useState([]);

    const [ notification, setNotification ] = useState([]);

    const [ allUsers, setAllUsers ] = useState([]);


    // Create socket connection
    useEffect(() => {
        const newSocket = io("http://52.91.151.109:6808");
        setSocket(newSocket);
    
        return () => { newSocket.disconnect() };
    }, [user]);

    // Add user to online users
    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (response) => {
                setOnlineUsers(response);
            });
        return () => { socket.off("getOnlineUsers") };
    }, [socket, user]);

    // send message using socket
    useEffect(() => {
        if (socket === null) return;

        const recipientId = currentChat?.members?.find((member) => member !== user?._id);

        if (newMessage) {
            socket.emit("sendMessage", {...newMessage, recipientId});
        }

    }, [newMessage, socket, currentChat, user]);

    // Listen for messages
    useEffect(() => {
        if (socket === null) return;

        socket.on("getMessage", (response) => {
            if (currentChat?._id !== response.chatId) return;
            setMessages((prev) => { return [...prev, response] });
        });

        socket.on("getNotification", (response) => {
            const isChatOpen = currentChat?.members?.includes(response.senderId);

            if (isChatOpen) setNotification(prev => [{...response, isRead: true}, ...prev]);
            else setNotification(prev => [ response, ...prev ]);
        });

        return () => { 
            socket.off("getMessage");
            socket.off("getNotification");
        };
    } , [socket, currentChat]);

    // Fetch potential chats
    useEffect(() => {
        const getPotentialChats = async () => {
            // Fetch all users
            const response = await getRequest(`${baseUrl}/users`);

            // Check if fetching users was successful
            if (response.error) {
                return console.log("Fetching Users Was Unsuccessful");
            }

            // Filter out users that are already in chats
            const filteredUsers = response.filter((usr) => {
                let isPotentialChat = true;

                // Check if user is the same as the current user
                if (usr._id === user?._id) {
                    return false;
                }

                // Check if user is already in a chat
                if (userChats) {
                    isPotentialChat = !userChats?.some((chat) => {
                        return chat.members[0] === usr._id || chat.members[1] === usr._id;
                    });
                }

                return isPotentialChat;
            });


            // Set potential chats to state
            setPotentialChats(filteredUsers);
            setAllUsers(response);
        };
        getPotentialChats();
    }, [userChats, user]);


    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    // Fetch messages
    useEffect(() => {
        const getMessages = async () => {
            // Check if there is a current chat
            if (currentChat) {
                setIsMessagesLoading(true);
                setMessagesError(null);

                // Fetch messages for current chat
                const response = await getRequest(`${baseUrl}/messages/${currentChat._id}`);

                // Check if fetching messages was successful
                if (response.error) {
                    return setMessagesError(response);
                }

                // Set messages to state
                setIsMessagesLoading(false);
                setMessages(response);
            }
        };
        getMessages();
    }, [currentChat]);

    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        // Check if there is a current chat
        if (currentChatId) {
            // Send message
            const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({ 
                chatId: currentChatId,
                senderId: sender._id,
                text: textMessage
            }));

            // Check if sending message was successful
            if (response.error) {
                return setSendMessageError(response);
            }

            setNewMessage(response);
            // Add message to messages
            setMessages((prev) => { return [...prev, response] });

            // Clear text message
            setTextMessage("");
        }
    }, []);

    const createChat = useCallback(async (firstUser, secondUser) => {

        // Check if chat already exists
        if (firstUser === secondUser) {
            return console.log("Cannot Create Chat With Self");
        }

        if (userChats) {
            const chatExists = userChats.some((chat) => {
                return chat?.members[0] === firstUser && chat?.members[1] === secondUser;
            });

            if (chatExists) {
                return console.log("Chat Already Exists");
            }
        }
        // Create chat between two users
        const response = await postRequest(`${baseUrl}/chats/`, JSON.stringify({ firstUser, secondUser }));
        

        // Check if creating chat was successful
        if (response.error) {
            return console.log("Creating Chat Was Unsuccessful");
        }

        // Add chat to user chats
        setUserChats((prev) => { return [...prev, response] });
    }, [userChats]);


    // Fetch user chats
    useEffect(() => {
        const getUserChats = async () => {

            // Check if user is logged in
            if (user?._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);

                // Fetch user chats
                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

                // Check if fetching user chats was successful
                if (response.error) {
                    return setUserChatsError(response);
                };

                // Set user chats to state
                setIsUserChatsLoading(false);
                const processedChats = response.map(chat => {
                    if (chat.members[0] == user._id) {
                        // Reverse members array if current user is not the first member
                        chat.members.reverse();
                    }
                    return chat;
                });
                setUserChats(processedChats);
            };
        };
        getUserChats();
    }, [user, notification]);


    const markAllNotificationAsRead = useCallback((notifications) => {
        const modifiedNotifications = notifications.map((notification) => {
            return { ...notification, isRead: true };
        });

        setNotification(modifiedNotifications);
    }, []);

    const markNotificationAsRead = useCallback((notification, user, userChats, allNotifications) => {
        const desiredChat = userChats.find((chat) => 
            chat.members.includes(user._id) && chat.members.includes(notification.senderId));

        const modifiedNotifications = allNotifications.map((notif) => {

            if (notification.senderId === notif.senderId) return { ...notification, isRead: true };
            else return notif;
        });

        updateCurrentChat(desiredChat);
        setNotification(modifiedNotifications);
    }, [updateCurrentChat]);

    const markThisUserNotificationAsRead = useCallback((thisUserNotification, notifications) => {
        const modifiedNotifications = notifications.map((notif) => {
            let modifiedNotif;

            thisUserNotification.forEach((thisNotif) => {
                if (notif.senderId === thisNotif.senderId) modifiedNotif = { ...notif, isRead: true };
                else modifiedNotif = notif;
            });
            return modifiedNotif;
        });

        setNotification(modifiedNotifications);
    }, []);

    // Return provider with state variables and functions to be used by children
    return (
        <ChatContext.Provider value={{ userChats, isUserChatsLoading, userChatsError,
          potentialChats, createChat, updateCurrentChat, messages, isMessagesLoading,
            messagesError, currentChat, sendTextMessage, newMessage, sendMessageError, onlineUsers, 
            notification, allUsers, markAllNotificationAsRead, markNotificationAsRead, markThisUserNotificationAsRead}}>
            { children }
        </ChatContext.Provider>
    );
};
