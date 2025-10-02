import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummaryApi from '../common';


function Checkout() {
    const token = JSON.parse(localStorage.getItem("userInfo"));
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [product, setProduct] = useState([]);
    
    const [orderCreate, setOrderCreate] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        products: []
    });
    const navigate = useNavigate();

    // Updated handleChangeOfOrder function
    const handleChangeOfOrder = (e) => {
        setOrderCreate({ ...orderCreate, [e.target.name]: e.target.value });
    };

    // Function to calculate subtotal
    const calculateSubtotal = (cartItems) => {
        return cartItems.reduce((total, item) => total + (item.quantity * item.productId.sellingPrice), 0);
    };

    const handleSubmitOfOrder = async (e) => {
        e.preventDefault();
        try {
            const dataOfProductIds = cart?.map((items) => items?.productId?._id);
            console.log(dataOfProductIds,"dataOfProductIds")
            const dataOfProductIdsFromProduct = product?.map((items) => items?._id);
            console.log(dataOfProductIdsFromProduct,"dataOfProductIdsFromProduct")
            const commonProductIds = dataOfProductIdsFromProduct.filter(productId => dataOfProductIds.includes(productId));
            console.log(commonProductIds,"commonProductIds")
            const totalQuantity = cart?.reduce((acc, item) => acc + item?.quantity, 0);

            const updateProducts = {
                ...orderCreate,
                products: commonProductIds,
                quantity: totalQuantity,
                totalAmount: subTotal // Ensure subTotal is calculated before this point
            };

            const res = await axios.post(SummaryApi.orderCreate.url, updateProducts, {
                headers: {
                    "Authorization": `Bearer ${token?.token}`
                }
            });

            setOrderCreate(res.data.body);
            await axios.delete(SummaryApi.deleteCart.url, {
                headers: {
                    "Authorization": `Bearer ${token?.token}`
                }
            });
            toast.success("Order is placed successfully");
            navigate("/");
            // window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const getCartData = async () => {
        try {
            const data = await axios.get(SummaryApi.getAllCart.url, {
                headers: {
                    "Authorization": `Bearer ${token?.token}`
                }
            });
            setCart(data?.data?.body);
            const subtotal = calculateSubtotal(data?.data?.body);
            if (subtotal > 0) {
                setLoading(false); // Stop loading if subtotal is valid
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getProductData = async () => {
        try {
            const data = await axios.get(SummaryApi.findAllSubCategoryCategory.url, {
                headers: {
                    "Authorization": `Bearer ${token?.token}`
                }
            });
            console.log(data,"datadatadata")
            setProduct(data?.data?.body);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCartData();
        getProductData();
    }, []);

    const subTotal = calculateSubtotal(cart); // Calculate subtotal

    return (
        <div>
            <>
                {/* Breadcrumb Section */}
                <div className="bg-secondary text-white py-5">
                    <div className="container text-center">
                        <p>Fresh and Organic</p>
                        <h1>Check Out Product</h1>
                    </div>
                </div>

                {/* Checkout Section */}
               
                    <div className="checkout-section my-5">
                        <div className="container">
                            <div className="row">
                                {/* Left Section - Billing Address */}
                                <div className="col-lg-8">
                                    <div className="accordion" id="checkoutAccordion">
                                        <form onSubmit={handleSubmitOfOrder}>
                                            <div className="card">
                                                <div className="card-header bg-primary text-white" id="headingOne">
                                                    <h5 className="mb-0">
                                                        <button
                                                            className="btn btn-link text-white"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#collapseOne"
                                                            aria-expanded="true"
                                                            aria-controls="collapseOne"
                                                        >
                                                            Billing Address
                                                        </button>
                                                    </h5>
                                                </div>
                                                <div id="collapseOne" className="collapse show" data-bs-parent="#checkoutAccordion">
                                                    <div className="card-body">
                                                        <div className="mb-3">
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                id="name"
                                                                placeholder="Name"
                                                                onChange={handleChangeOfOrder}
                                                                className="form-control"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                id="email"
                                                                placeholder="Email"
                                                                onChange={handleChangeOfOrder}
                                                                className="form-control"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <input
                                                                type="text"
                                                                name="address"
                                                                id="address"
                                                                placeholder="Address"
                                                                onChange={handleChangeOfOrder}
                                                                className="form-control"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="mb-3">
                                                            <input
                                                                type="number"
                                                                name="phone"
                                                                id="phone"
                                                                placeholder="Phone"
                                                                onChange={handleChangeOfOrder}
                                                                className="form-control"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-warning mt-4">
                                                Place Order
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* Right Section - Order Summary */}
                                <div className="col-lg-4 mt-4 mt-lg-0">
                                    <div className="card">
                                        <div className="card-header bg-primary text-white">
                                            Your Order Details
                                        </div>
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Product</th>
                                                    <th scope="col">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart?.map((e) => (
                                                    <tr key={e.productId._id}>
                                                        <td>{e.productId.name}</td>
                                                        <td>₹ {e.quantity * e.productId.sellingPrice}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td>Subtotal</td>
                                                    <td>₹ {subTotal}</td>
                                                </tr>
                                                <tr>
                                                    <td>Shipping</td>
                                                    <td>₹ 20</td>
                                                </tr>
                                                <tr>
                                                    <th>Total</th>
                                                    <th>₹ {subTotal + 20}</th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
            </>
        </div>
    );
}

export default Checkout;
