import React from 'react';
import { useGetDataByUrl } from '../../fetchData/DataFetch';
import { Accordion } from 'react-bootstrap';

const NameHostel = (hostelId) => {

    console.log(hostelId?.hostelId);

  const {data: hostel} = useGetDataByUrl("http://localhost:9999/hostel?id=" + hostelId?.hostelId, "hostel" + hostelId?.hostelId);

  console.log ();

    return (
        <div>
            <Accordion.Header>Nhà trọ: {hostel?.data[0]?.name}</Accordion.Header>
        </div>
    );
};

export default NameHostel;