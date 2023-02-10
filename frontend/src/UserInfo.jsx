import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from './hooks/useFetch';
import { config } from './config';

const UserInfo = () => {
    const { id } = useParams();
    const [user, setUser] = useState();

    const { loading, request, error } = useFetch();

    const fetchUser = useCallback(
        async (id) => {
            const fetched = await request(
                `${config.host}${config.userResource}/${id}`
            );
            if (fetched?.success) {
                setUser(fetched.user);
            }
        },
        [id]
    );

    useEffect(() => {
        fetchUser(id);
    }, [id]);

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error.message}</p>}
            {user && (
                <>
                    <img
                        src={
                            isValidUrl(user.photo)
                                ? user.photo
                                : config.host + user.photo
                        }
                        alt="user photo"
                    />
                    <p>User name: {user.name}</p>
                    <p>User email: {user.email}</p>
                    <p>User phone: {user.phone}</p>
                    <p>User position: {user.position?.name}</p>
                </>
            )}
        </>
    );
};

function isValidUrl(str) {
    try {
        return Boolean(new URL(str));
    } catch (e) {
        return false;
    }
}

export default UserInfo;
