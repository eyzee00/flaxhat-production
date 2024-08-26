import { useEffect, useState } from 'react';
import { getRequest, baseUrl } from '../utils/services';

export const useFetchRecipient = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [recipientError, setRecipientError] = useState(null);

    const recipientId = chat?.members?.find((id) => id !== user?._id);


    useEffect(() => {
        const fetchRecipient = async () => {
            if (!recipientId) 
            {
                return null;
            }
            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
            if (response.error) {
                return setRecipientError(response);
            }
            setRecipientUser(response);
        };
        fetchRecipient();
    }, [recipientId]);
    return { recipientUser, recipientError };
};