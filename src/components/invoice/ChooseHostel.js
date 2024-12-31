import React, { useEffect } from "react";
import { useGetDataByUrl } from "../../fetchData/DataFetch";
import { Button } from "react-bootstrap";
import Loading from "../../until/Loading";

const ChooseHostel = ({ selectedHostel, setSelectedHostel }) => {
  const { data: hostel, isLoading: loadHostel } = useGetDataByUrl(
    "http://localhost:9999/hostel/?status=1",
    "hostels1"
  );

  useEffect(() => {
    if (hostel?.data && hostel?.data?.length > 0) {
      setSelectedHostel(hostel.data[0]);
    }
  }, [hostel]);
  return (
    <div className="d-flex flex-column gap-2">
      {hostel?.data?.map((h) => (
        <Button
          key={h.id}
          variant={selectedHostel?.id === h.id ? "primary" : "outline-primary"}
          className="text-truncate"
          style={{ maxWidth: "100%" }}
          onClick={() => setSelectedHostel(h)}
        >
          {h.name}
        </Button>
      ))}
      {loadHostel && <Loading />}
    </div>
  );
};

export default ChooseHostel;
