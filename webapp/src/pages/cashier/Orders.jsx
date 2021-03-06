import React, { useEffect, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader";
import Button from "../../components/Button";
import "../../index.css";
import io from "socket.io-client";
import calculateQuantity from "../../utilities/calculateQuantity";
import { axios_authenticated as axios } from "../../axios/axios-config";
import socketUrl from "../../utilities/socketUrl";


export default function Orders(props) {
  let [orders, setOrders] = useState([]);

  const socket = io(socketUrl, { reconnectionDelayMax: 10000 });
  useEffect(() => {
    socket.on(
      "status_change",
      () => {
        axios
          .get("/api/cashier/orderHistory")
          .then((res) => {
            console.log(res.data);
            setOrders([]);
            axios
              .get("/api/cashier/orderHistory")
              .then((res) => {
                console.log(res.data);

                setOrders(
                  res.data.map((val, index) => {
                    return {
                      orderNo: val._id,
                      foodItems: calculateQuantity(val.fooditems),
                      total: val.bill,
                      status: val.status,
                    };
                  })
                );
              })
              .catch((err) => {
                alert("There are new updates in order history");
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      },
      []
    );

    return () => {
      socket.off("status_change");
    };
  }, [socket, setOrders]);

  let sendStatusUpdate = (id, status) => {
    axios
      .post("/api/cashier/updateStatus", { orderId: id, status: status })
      .then(() => {
        socket.emit("status_change", { order_id: id, order_status: status });
      })
      .catch(() => {
        alert("Not Possible");
      });
  };

  useEffect(() => {
    axios
      .get("/api/cashier/orderHistory")
      .then((res) => {
        console.log(res.data);
        setOrders(
          res.data.map((val, index) => {
            return {
              orderNo: val._id,
              foodItems: calculateQuantity(val.fooditems),
              total: val.bill,
              status: val.status,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [stylz, setStylz] = useState(null);
  console.log(orders);

  let [category, setCategory] = useState("");
  return (
    <div>
      <ProfileHeader>
        <Button
          label="Chat with Customer Support"
          onClick={() => props.history.push("/cashier/chatsupport")}
        />
      </ProfileHeader>

      <h1 style={{ marginTop: "60px", marginLeft: "60px" }}>Orders</h1>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="Queued">Queued</option>
        <option selected value="Cooking">
          Cooking
        </option>
        <option value="Ready">Ready</option>
      </select>

      {orders
        .filter((val) => (category !== "" ? val.status == category : true)).sort((val)=>val.status === 'Queued' ? 20 : 10)
        .map((item) => (
          <OrderBox
            item={item}
            sendStatusUpdate={(id, status) => sendStatusUpdate(id, status)}
          />
        ))}
    </div>
  );
}
function OrderBox({ sendStatusUpdate, item }) {
  /*  const [click, setClick] = useState(true);
  useEffect(() => {
    console.log("item:", item);
    console.log("click:", click);
  }, [click]); */
  let [myState, setMyState] = useState(item);

  function Clicked(orderNo, status) {
    console.log("Clicked!", myState);
    let newState = { ...myState };
    newState.status = status;
    setMyState(newState);
    sendStatusUpdate(orderNo, status);
  }

  return (
    <>
      <div className="orderbox">
        <div className="orderbox_details">
          <p>Order#{myState.orderNo}</p>
          {myState.foodItems.map((i) => (
            <p>
              {i.name} x {i.quantity} - Rs {i.price}
            </p>
          ))}
          <p>Total - {myState.total}</p>
        </div>
        <div className="orderbox_status">
          <p>Select Status</p>
          <div style={{ marginTop: "10px" }}>
            {" "}
            <Button
              onClick={() => Clicked(myState.orderNo, "Queued")}
              mystyle={{ width: "50%", height: "20%" }}
              redButton={myState.status === "Queued"}
              blackButton={myState.status !== "Queued"}
              label="Pending"
            ></Button>
          </div>
          <div style={{ marginTop: "10px" }}>
            {" "}
            <Button
              onClick={() => Clicked(myState.orderNo, "Cooking")}
              mystyle={{ width: "50%", height: "20%" }}
              redButton={myState.status === "Cooking"}
              blackButton={myState.status !== "Cooking"}
              label="Cooking"
            ></Button>
          </div>
          <div style={{ marginTop: "10px" }}>
            {" "}
            <Button
              onClick={() => Clicked(myState.orderNo, "Ready")}
              mystyle={{ width: "50%", height: "20%" }}
              redButton={myState.status === "Ready"}
              blackButton={myState.status !== "Ready"}
              label="Ready"
            ></Button>
          </div>
        </div>
      </div>
      <hr style={{ borderTop: "1px solid black" }}></hr>
    </>
  );
}
