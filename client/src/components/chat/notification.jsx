import { useState, useContext} from "react";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/authContext";
import { unreadNotifications } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () => {

    const [ switchNeeded, setSwitchNeeded ] = useState(false);
    const [ isNotificationOpen, setIsNotificationOpen ] = useState(false);
    const { notification, userChats, allUsers, markAllNotificationAsRead, markNotificationAsRead } = useContext(ChatContext);
    const { user } = useContext(AuthContext);

    const unreadNotification = unreadNotifications(notification);

    const allNotifications = notification.map((notification) => {
        const sender = allUsers.find((user) => user._id === notification.senderId);

        return {
            ...notification,
            senderName: sender.name,
        };
    });

    const modifiedNotifications = unreadNotification.map((notification) => {
        const sender = allUsers.find((user) => user._id === notification.senderId);


        return {
            ...notification,
            senderName: sender.name,
        };
    });

    return ( <div className="notification">
        <div className="notification-icon" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-dots-fill" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg>
            {unreadNotification.length === 0 ? null : 
                <span className="notification-count"><span>{unreadNotification?.length}</span></span>
            }
        </div>
        { isNotificationOpen ? (
            <div className="notifications-box">
                <div className="notifications-header">
                    <h3>Notifications</h3>
                <div className="mark-as-read" onClick={() => {
                    markAllNotificationAsRead(notification);
                    setSwitchNeeded(true);
                }}>Mark All As Read</div>
            </div>
            {modifiedNotifications?.length === 0 && switchNeeded ? <span className="notification">
                No new notifications
            </span> : null}
            {modifiedNotifications?.map((notification, index) => (
                <div key={index} className={notification.isRead ? "notification" : "notification not-read"} 
                onClick={() => {
                    setSwitchNeeded(true);
                    markNotificationAsRead(notification, user, userChats, allNotifications);
                    setIsNotificationOpen(false);
                    }}>
                    <span>{`${notification.senderName} sent you a message`}</span>
                    <span className="notification-time">{moment(notification.date).fromNow()}</span>
                </div>
            ))}
            </div>) : null }

    </div> );
}
 
export default Notification;