import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useGetDataByUrl } from "../../fetchData/DataFetch";
import getMonth from "../../until/getMonth";

const ChooseRoom = ({ hostelId, selectedRoom, setSelectedRoom }) => {
  const { data: room, isLoading: loadRoom } = useGetDataByUrl(
    `http://localhost:9999/room/?hostelId=${hostelId}`,
    `room_h_${hostelId}`
  );

  const fiterRoom = room?.data?.filter((r) => r.status === 1);

  useEffect(() => {
    if (fiterRoom && fiterRoom?.length > 0) {
      setSelectedRoom(fiterRoom[0]);
    } else {
      setSelectedRoom(null)
    }
  }, [room]);

  const currentMonth = getMonth();

  const { data: dataByMonth } = useGetDataByUrl(
    `http://localhost:9999/invoice?month=${currentMonth}`,
    `month ${currentMonth}`
  );

  const checkDuplicate = (roomId) => {
    const data =
      dataByMonth?.data?.filter(
        (d) => d.roomId === roomId && d.hostelId === hostelId
      ) || [];
    return data.length > 0;
  };

  return (
    <div className="d-flex flex-column gap-2">
      {fiterRoom?.length > 0 ? (
        fiterRoom?.map((r) => (
          <Button
            key={r.id}
            variant={
              checkDuplicate(r.id) ? "warning" :
              selectedRoom?.id === r.id ? "secondary" : "outline-secondary"
            }
            className="text-truncate"
            style={{ maxWidth: "100%" }}
            onClick={() => {
              setSelectedRoom(r);
            }}
          >
            {r.name}
          </Button>
        ))
      ) : (
        <p>Không có phòng trọ.</p>
      )}
      {loadRoom && <p>Đang tải...</p>}
    </div>
  );
};

export default ChooseRoom;
