import React from 'react';
import { useGetDataByUrl } from '../../fetchData/DataFetch';

const NameRoom = (roomId) => {
    const {data: room} = useGetDataByUrl("http://localhost:9999/room?id=" + roomId?.roomId, "hostel" + roomId?.roomId);

    console.log(room?.data[0]);
    return (
        <>
            <td>{room?.data[0]?.name}</td>
        </>
    );
};

export default NameRoom;