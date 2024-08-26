import PropTypes from "prop-types";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import profile_avatar from "../../assets/profile_avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/chatContext";
import { unreadNotifications } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({chat, user}) => {
    const { recipientUser } = useFetchRecipient(chat, user);
    const { onlineUsers, notification, markThisUserNotificationAsRead } = useContext(ChatContext);
    const { latestMessage } = useFetchLatestMessage(chat);

    const unreadNotif = unreadNotifications(notification);
    const thisUserNotifications = unreadNotif?.filter((notif) => notif.senderId === recipientUser?._id);

    const truncateString = (str) => {
        if (str.length > 20) {
            return str.substring(0, 20) + "...";
        }
        return str;
    };
    return (
    <>
        <Stack direction="horizontal" gap={3}
        className="user-card align-items-center p-2 justify-content-between" role="button"
        onClick={() => {
            if (thisUserNotifications?.length !== 0) {
                markThisUserNotificationAsRead(thisUserNotifications, notification);
            }
        }}>
            <div className="d-flex">
                <div className="me-2">
                    <img src={profile_avatar} alt="profile_avatar" height={35}/>
                </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.name}</div>
                    <div className="text">{
                        latestMessage?.text && (
                            <div className="text">{
                            truncateString(latestMessage?.text)
                            }</div>
                        )
                        }</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">{
                latestMessage?.text &&(
                <div className="date">{
                 moment(latestMessage?.createdAt).fromNow()
                }</div>)
            }
                {
                    thisUserNotifications?.length !== 0 ? 
                    <div className="this-user-notifications">
                        {thisUserNotifications?.length}
                    </div> : null
                }
                <span className={
                    onlineUsers.some((user) => user.userId === recipientUser?._id)
                        ? "user-online"
                        : "user-offline"
                    }></span>
            </div>
        </Stack>
    </> );
}

UserChat.propTypes = {
    chat: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
};
 
export default UserChat;