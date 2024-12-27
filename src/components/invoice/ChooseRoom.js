import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useGetDataByUrl } from "../../fetchData/DataFetch";

const ChooseRoom = ({hostelId, selectedRoom, setSelectedRoom}) => {
  const { data: room, isLoading: loadRoom } = useGetDataByUrl(
    `http://localhost:9999/room/?hostelId=${hostelId}`,
    `roomsh_${hostelId}_s1`
  );

  const fiterRoom = room?.data?.filter(r => r.status === 1);

  useEffect(() => {
    if (fiterRoom && fiterRoom?.length > 0) {
        setSelectedRoom(fiterRoom[0]);
    }
  },[fiterRoom]);

  return (
    <div className="d-flex flex-column gap-2">
      {fiterRoom?.map((r) => (
        <Button
          key={r.id}
          variant={selectedRoom?.id === r.id ? "secondary" : "outline-secondary"}
          className="text-truncate"
          style={{ maxWidth: "100%" }}
          onClick={() => setSelectedRoom(r)} 
        >
          {r.name}
        </Button>
      ))}
      {loadRoom && <p>Đang tải...</p>}
    </div>
  );
};

export default ChooseRoom;
