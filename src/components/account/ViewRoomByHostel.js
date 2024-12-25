import React, { memo, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ViewRoomByHostel = ({
  handleChangeRoom, 
  account,
  accountId,
  hId ,
  rId,
  handleChangeLoadingRoom,
  handleChangeErrorRoom,
}) => {
  const {
    data: room,
    isLoading: isLoadRoom,
    error: errorRoom,
  } = useQuery({
    queryFn: () => axios.get(`http://localhost:9999/room?hostelId=` + hId),
    queryKey: ["roomh", hId],
    staleTime: 10000,
    cacheTime: 1000 * 60,
    retry: 0,
  });
  useEffect(() => {
    if (!isLoadRoom) {
      handleChangeRoom(account, accountId, rId || room?.data[0]?.id);
      handleChangeErrorRoom(errorRoom);
      handleChangeLoadingRoom(isLoadRoom);
    }
  }, [errorRoom, handleChangeErrorRoom, handleChangeLoadingRoom, isLoadRoom]);

  

  return (
    <Form.Select 
        aria-label="Default select example" 
        onChange={(e) => handleChangeRoom(account, accountId, e.target.value)}
    >
      {room?.data?.map((r) => (
        <option selected={r.id === rId} key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
    </Form.Select>
  );
};

export default memo(ViewRoomByHostel);
