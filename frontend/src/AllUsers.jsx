import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useFetch } from './hooks/useFetch';
import { config } from './config';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);

    const { loading, request, error } = useFetch();

    const fetchUsers = useCallback(
        async (page) => {
            const fetched = await request(
                `${config.host}${config.userResource}?page=${page}`
            );
            if (fetched?.success) {
                setUsers((prev) => [...prev, ...fetched.users]);
                setTotalPages(fetched.total_pages);
            }
        },
        [page]
    );

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const changePage = (page) => {
        if (page <= totalPages) {
            setPage(page);
        }
    };

    return (
        <>
            {error && <p className="error">{error.message}</p>}
            {loading && <p>Loading...</p>}
            <ol className="usersList">
                {users.map((user) => (
                    <li key={user.id}>
                        <NavLink to={`/user/${user.id}`}>{user.name}</NavLink>
                    </li>
                ))}
            </ol>
            {page < totalPages && (
                <button onClick={() => changePage(page + 1)}>Show more</button>
            )}
        </>
    );
};

export default AllUsers;
