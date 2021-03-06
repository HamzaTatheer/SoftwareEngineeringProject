import React from "react";
import Burger from "../../assets/customer/burger.png";
import { useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  selectCartItem,
} from "../../redux/actions/cartAction";

export default function FoodCard({
  id,
  picture,
  name,
  description,
  price,
  category,
}) {
  let dispatch = useDispatch();

  return (
    <div class="card">
      <div className="d-flex justify-content-center">
        <div
          style={{ height: "250px", background: "#FFF9F9", overflow: "hidden" }}
          className="d-flex justify-content-center align-items-center"
        >
          <img src={picture} width="250px" />
        </div>
      </div>

      <div class="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5 class="card-title">{name}</h5>
          </div>
          <div>
            <b>Rs. {price}</b>
          </div>
        </div>
        <p class="card-text">
          <small>{description}</small>
        </p>
        <div className="d-flex justify-content-center">
          <a
            onClick={() => dispatch(selectCartItem(id, name, price))}
            class="btn btn-primary"
          >
            Add To Cart
          </a>
        </div>
      </div>
    </div>
  );
}
