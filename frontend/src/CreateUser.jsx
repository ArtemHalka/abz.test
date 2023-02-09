import React, { useState, useEffect, useCallback } from 'react';
import { useFetch } from './hooks/useFetch';
import Token from './Token';
import { config } from './config';

const CreateUser = () => {
    const [form, setForm] = useState({});
    const [token, setToken] = useState('');
    const [success, setSuccess] = useState('');

    const [positions, setPositions] = useState([]);
    const { loading, request, error } = useFetch();

    const fetchPositions = useCallback(async () => {
        const fetched = await request(config.host + config.positionResource);
        if (fetched?.success) {
            setPositions(fetched.positions);
        }
    }, [request]);

    useEffect(() => {
        fetchPositions();
    }, [fetchPositions]);

    const changeHandler = (event) => {
        setForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const response = await request(
            config.host + config.userResource,
            'POST',
            formData,
            {
                Token: token,
            }
        );
        if (response?.success) {
            setSuccess(response.message);
            setForm({});
        }
    };

    const getTokenHandler = async () => {
        const response = await request(config.host + config.tokenResource);
        if (response?.success) {
            setToken(response.token);
            setSuccess('Token recieved');
        }
    };

    const toErrorStr = (str) => (
        <p className="error" key={str}>
            {str}
        </p>
    );

    return (
        <>
            {error && <p className="error">{error.message}</p>}
            {success && <p className="success">{success}</p>}
            {loading && <p>Loading...</p>}
            <Token getTokenHandler={getTokenHandler} />
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="name">User name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={form.name || ''}
                        onChange={changeHandler}
                    />
                    {error &&
                        error.fails?.name &&
                        error.fails.name.map(toErrorStr)}
                </div>
                <div>
                    <label htmlFor="email">User email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={form.email || ''}
                        onChange={changeHandler}
                    />
                    {error &&
                        error.fails?.email &&
                        error.fails.email.map(toErrorStr)}
                </div>
                <div>
                    <label htmlFor="phone">User phone</label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={form.phone || ''}
                        onChange={changeHandler}
                    />
                    {error &&
                        error.fails?.phone &&
                        error.fails.phone.map(toErrorStr)}
                </div>
                <div>
                    <label htmlFor="positionId">User position</label>
                    <select
                        name="positionId"
                        id="positionId"
                        value={form.positionId || 0}
                        onChange={changeHandler}
                    >
                        <option value="0"></option>
                        {positions.map((position) => (
                            <option key={position.id} value={position.id}>
                                {position.name}
                            </option>
                        ))}
                    </select>
                    {error &&
                        error.fails?.positionId &&
                        error.fails.positionId.map(toErrorStr)}
                </div>
                <div>
                    <label htmlFor="photo">User photo</label>
                    <input
                        value={form.photo || ''}
                        onChange={changeHandler}
                        type="file"
                        name="photo"
                        id="photo"
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </>
    );
};

export default CreateUser;
