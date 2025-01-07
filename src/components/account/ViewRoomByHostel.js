import React, { memo } from "react";
import { Form } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ViewRoomByHostel = ({
  handleChangeRoom,
  account,
  accountId,
  hId,
  rId,
}) => {
  // Fetch danh sách phòng dựa trên hostelId
  const { data: room } = useQuery({
    queryFn: () => axios.get(`http://localhost:9999/room?hostelId=` + hId),
    queryKey: [`room_h_${hId}`],
    staleTime: 10000,
    cacheTime: 1000 * 60,
    retry: 0,
  });

  // Lọc ra danh sách phòng có trạng thái "active"
  const fiterRoom = room?.data?.filter((r) => r.status === 1);

  return (
    <Form.Select
      aria-label="Default select example"
      onChange={(e) => {
        const selectedRoomId = e.target.value;
        if (selectedRoomId !== rId) {
          // Chỉ gọi handleChangeRoom khi ID phòng mới khác ID phòng hiện tại
          handleChangeRoom(account, accountId, selectedRoomId);
        }
      }}
    >
      {fiterRoom?.map((r) => (
        <option selected={r.id === rId} key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
    </Form.Select>
  );
};

export default memo(ViewRoomByHostel);