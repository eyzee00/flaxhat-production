import { useContext, useState } from "react";
import { Table } from "react-bootstrap";
import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/chatContext";

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
    const [showTable, setShowTable] = useState(false);

    const toggleTable = () => {
        setShowTable(!showTable);
    };

    return (
        <div className="table-wrapper">
            <button className="potential-users-button" onClick={toggleTable}>Start Chat</button>
            {showTable && (
                <Table className="potential-users-table" hover bordered style={{ "--bs-table-bg": "none", "--bs-table-color": "none" }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {potentialChats && potentialChats?.map((u, index) => (
                            <tr
                                key={index}
                                onClick={() => {
                                    createChat(u._id, user._id);
                                }}
                            >
                                <td>{u?.name}</td>
                                <td>
                                    <span className={
                                        onlineUsers.some((user) => user.userId === u._id)
                                            ? "user-online1"
                                            :
                                            "user-offline1"
                                        }></span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default PotentialChats;