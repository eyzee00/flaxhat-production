import { useContext, useEffect, useRef, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/authContext";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";

const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const { currentChat, messages, isMessagesLoading, sendTextMessage } = useContext(ChatContext);
    const { recipientUser } = useFetchRecipient(currentChat, user);
    const [textMessage, setTextMessage] = useState("");
    const scrollToBottom = useRef();

    useEffect(() => {
        scrollToBottom.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) { // Prevents sending message when Shift+Enter is pressed
            event.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = () => {
        if (textMessage.trim() !== "") {
            sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
        }
    };

    if (!recipientUser || !currentChat) {
        return (
            <Stack gap={4} className="chat-box"></Stack>
        );
    }

    if (isMessagesLoading) {
        return (
            <div>
                <p style={{ textAlign: "center", width: "100%" }}>
                    Chat is loading...
                </p>
            </div>
        );
    }

    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser.name}</strong>
            </div>
            <Stack gap={3} className="messages">
                {messages?.map((message, index) => {
                    return (
                        <Stack
                            key={index}
                            className={`${message?.senderId === user?._id ? 
                                "message self align-self-end flex-grow-0" : 
                                "message align-self-start flex-grow-0"}`}
                            ref={scrollToBottom}>
                            <span>{message.text}</span>
                            <span className="message-footer">{moment(message.createdAt).calendar()}</span>
                        </Stack>
                    );
                })}
            </Stack>
            <Stack direction="horizontal" gap={2} className="chat-input flex-grow-0">
                <InputEmoji 
                    value={textMessage} 
                    onChange={setTextMessage} 
                    fontFamily="nunito" 
                    borderColor="rgba(72, 112, 223, 0.3)"
                    onKeyDown={handleKeyDown} // Add this line
                />
                <Button 
                    className="send-btn" 
                    onClick={sendMessage}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                    </svg>
                </Button>
            </Stack>
        </Stack>
    );
};

export default ChatBox;
