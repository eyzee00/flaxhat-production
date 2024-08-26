import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/chatContext";
import { baseUrl, getRequest } from "../utils/services";


export const useFetchLatestMessage = (chat) => {
    const { newMessage, notification } = useContext(ChatContext);
    const [ latestMessage, setLatestMessage ] = useState(null);

    useEffect(() => {
        const fetchLatestMessage = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat._id}`);

            if (response.error) {
                return console.log("Something went wrong");
            }
            
            const lastMessage = response[ response.length - 1 ];

            setLatestMessage(lastMessage);
        };
        fetchLatestMessage();
    }, [newMessage, notification]);
    return { latestMessage };
};