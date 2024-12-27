import React, { useState, memo, useEffect } from "react";
import { Button, Table, Form, Card } from "react-bootstrap";
import { useGetDataByUrl } from "../../fetchData/DataFetch";
import ChooseRoom from "./ChooseRoom";
import Loading from "../../until/Loading";

const CreateNewInvoice = () => {
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  console.log(selectedHostel);
  console.log(selectedRoom);

  const { data: hostel, isLoading: loadHostel } = useGetDataByUrl(
    "http://localhost:9999/hostel/?status=1",
    "hostels1"
  );

  useEffect(() => {
    if (hostel?.data && hostel?.data?.length > 0) {
      setSelectedHostel(hostel.data[0].id);
    }
  }, [hostel]);
  
  return (
    <div className="container my-5">
      <Card className="shadow-lg p-4">
        <h2 className="text-center mb-4">Tạo Hoá Đơn</h2>
        <Table bordered responsive className="align-middle">
          <thead className="table-primary text-center">
            <tr className="row">
              <th className="col-md-3 ">Nhà trọ</th>
              <th className="col-md-2">Phòng trọ</th>
              <th className="col-md">Tạo hoá đơn</th>
            </tr>
          </thead>
          <tbody>
            <tr className="row text-center">
              <td className="col-md-3 p-3">
                <div className="d-flex flex-column gap-2">
                  {hostel?.data?.map((h) => (
                    <Button
                      key={h.id}
                      variant={
                        selectedHostel === h.id ? "primary" : "outline-primary"
                      }
                      className="text-truncate"
                      style={{ maxWidth: "100%" }}
                      onClick={() => setSelectedHostel(h.id)}
                    >
                      {h.name}
                    </Button>
                  ))}
                  {loadHostel && <Loading/>}
                </div>
              </td>
              <td className="col-md-2 p-3">
                <ChooseRoom hostelId={selectedHostel} selectedRoom = {selectedRoom} setSelectedRoom = {setSelectedRoom} />
              </td>
              <td className="col-md p-3">
                <Card className=" border-0">
                  <Card.Body></Card.Body>
                </Card>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default memo(CreateNewInvoice);
