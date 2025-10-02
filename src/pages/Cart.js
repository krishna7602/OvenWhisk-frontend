import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SummaryApi from '../common';

function Cart() {
  const token = JSON.parse(localStorage.getItem("userInfo"));
  const [loading, setLoading] = useState(true);
  const [usecartdata, setUsecartdata] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    {
      axios.get(SummaryApi.getAllCart.url, {
        headers: {
          'Authorization': `Bearer ${token?.token}`
        }
      }).then((res) => {
        setUsecartdata(res.data.body || []);
        setLoading(false);
      });
    }
  }, [token?.token]);

  const handleIncrement = async (id, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    try {
      const response = await axios.put(`${SummaryApi.updateCart.url}${id}`, {
        quantity: newQuantity,
      }, {
        headers: {
          'Authorization': `Bearer ${token?.token}`
        }
      });

      if (response.status === 200) {
        const updatedCart = usecartdata.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        );
        setUsecartdata(updatedCart);
      }
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  const handleDecrement = async (id, currentQuantity) => {
    if (currentQuantity <= 1) return;
    const newQuantity = currentQuantity - 1;
    try {
      const response = await axios.put(`${SummaryApi.updateCart.url}${id}`, {
        quantity: newQuantity,
      }, {
        headers: {
          'Authorization': `Bearer ${token?.token}`
        }
      });
      if (response.status === 200) {
        const updatedCart = usecartdata.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        );
        setUsecartdata(updatedCart);
      }
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${SummaryApi.deleteSingleCartItem.url}${id}`, {
        headers: {
          'Authorization': `Bearer ${token?.token}`
        }
      });

      if (response.status === 200) {
        const updatedCart = usecartdata.filter((item) => item._id !== id);
        window.location.reload();
        setUsecartdata(updatedCart);
      }
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  const subTotal = usecartdata?.reduce((total, item) => {
    return total + (item?.quantity * item?.productId?.sellingPrice);
  }, 0);

  return (

    <>
      <div
        className="container-fluid page-header py-6 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container text-center pt-5 pb-3">
          <h1 className="display-4 text-white animated slideInDown mb-3">
            Login
          </h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link className="text-white" to="/">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <a className="text-white" href="#">
                  Pages
                </a>
              </li>
              <li
                className="breadcrumb-item text-primary active"
                aria-current="page"
              >
                Login
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="container py-5">
        <div className="row">

          {/* Left Section (Cart Table) */}
          <div className="col-lg-8 mb-4">
            <div className="table-responsive shadow-sm rounded border">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Remove</th>
                    <th className="text-center">Product Image</th>
                    <th className="text-start">Name</th>
                    <th className="text-start">Price</th>
                    <th className="text-start">Quantity</th>
                    <th className="text-start">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {usecartdata.length > 0 ? (
                    usecartdata.map((e) => (
                      <tr key={e._id}>
                        <td className="text-center">
                          <button onClick={() => handleDelete(e._id)} className="btn btn-link text-danger p-0">
                            <i className="far fa-window-close"></i>
                          </button>
                        </td>
                        <td className="text-center">
                          <img
                            src={e?.productId?.image}
                            alt=""
                            className="img-fluid rounded border"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        </td>
                        <td>{e?.productId?.name}</td>
                        <td>₹ {e?.productId?.sellingPrice}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <button
                              onClick={() => handleDecrement(e._id, e.quantity)}
                              className="btn btn-outline-secondary"
                              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={e.quantity}
                              readOnly
                              className="form-control text-center"
                              style={{ width: '65px' }}
                            />
                            <button
                              onClick={() => handleIncrement(e._id, e.quantity)}
                              className="btn btn-outline-secondary"
                              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>₹ {e.productId.sellingPrice * e.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Your cart is empty
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Section (Total and Checkout) */}
          <div className="col-lg-4">
            <div className="bg-white p-4 border rounded shadow-sm">
              <h2 className="h5 mb-4">Order Summary</h2>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td className="text-end">₹ {subTotal}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td className="text-end">₹ 20</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Total</td>
                    <td className="text-end fw-bold">₹ {subTotal + 20}</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4">
                {usecartdata.length > 0 ? (
                  <Link to="/Checkout" className="btn btn-dark w-100">
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button className="btn btn-secondary w-100" disabled>
                    Proceed to Checkout
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>






    </>

  );
}

export default Cart;
