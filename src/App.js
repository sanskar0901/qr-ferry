import './App.css';
import React, { useEffect, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { IconButton } from '@material-ui/core';
import { CameraAlt } from '@material-ui/icons';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import { API_URI } from './constants/apiUrl.constant.js';

function App() {

  const [data, setData] = useState({});
  const [readData, setReadData] = useState(false);
  const [ticketData, setTicketData] = useState({});
  const [booking_id, setBooking_id] = useState("");
  useEffect(() => {
    // console.log("data Qr==", data)
    console.log("booking_id==", booking_id)


    axios.get(`${API_URI}/booking/getbooking/${booking_id}`, {
    })
      .then(res => {
        // console.log(res);
        setTicketData(res.data);
        console.log("ticketData==", ticketData)
      })
      .catch(err => {
        console.log(err);
      })
  }, [booking_id])
  const onSubmit = () => {
    axios.post(`${API_URI}/booking/checkin/${booking_id}`)
      .then(res => {
        console.log(res);
        window.alert("Ticket Checked In Successfully")
      })
      .catch(err => {
        window.alert("Ticket Check In Failed" + err)
      })
  }
  const [chkData, setChkData] = useState("");
  return (
    <div className="container mx-auto text-black">

      {
        readData ?
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={(result, error) => {
              if (!!result) {
                console.log(result)
                setData(result?.text);
                setBooking_id(JSON.parse(result?.text).booking_id);
                console.log("booking_id==", booking_id)
                setReadData(false);
              }

              if (!!error) {
                console.info(error);
              }
            }}
            style={{ width: '100%' }}
          />
          : null

      }
      <h1 className='text-center font-extrabold text-4xl pb-10'>Ticket Check In</h1>

      <div onClick={() => { setData(null); setTicketData(null); setReadData(!readData) }}><CameraAlt /></div>

      <br></br>
      {ticketData?._id ? ticketData.status == 'BOOKED' ?
        <div>
          <p className=' bg-green-200'>Status Code: {ticketData.status}</p>
          <p><b>Name:</b> {ticketData.name}</p>
          <p><b>Transaction Id:</b> {ticketData._id}</p>
          <p><b>Purchased At:</b> {ticketData.date.toLocaleString('en-GB', { timeZone: 'UTC' })}</p>
          <p><b>Seats Booked:</b> {ticketData.seats}</p>
          <br></br>

          <button onClick={onSubmit} className='bg-green-500 text-white p-2'>Issue Ticket</button>
        </div>
        : <div>
          <h2>
            ALREADY CECKED IN
          </h2>
          <p className=' bg-yellow-200'>Status Code: {ticketData.status}</p>
          <p><b>Name:</b> {ticketData.name}</p>
          <p><b>Transaction Id:</b> {ticketData._id}</p>
          <p><b>Purchased At:</b> {ticketData.date.toLocaleString('en-GB', { timeZone: 'UTC' })}</p>
          <p><b>Seats Booked:</b> {ticketData.seats}</p>
        </div> :
        <p>Click on the camera to scan the QR Code</p>
      }
    </div >
  );
}

export default App;
