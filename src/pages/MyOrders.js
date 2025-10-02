import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'

function MyOrders() {
    const token = JSON.parse(localStorage.getItem("userInfo"));
    const navigate = useNavigate()
    const [data, setData] = useState([])

    const getOrders = async () => {
        try {
            const dataaa = await axios.get(SummaryApi.orderGetAll.url, {
                headers:
                {
                    "Authorization": `Bearer ${token?.token}`

                }
            })
            console.log(dataaa.data.body, "dataaa.data.body")
            setData(dataaa.data.body)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getOrders()
    }, [])


    return (
        <>
            <div
                className="container-fluid page-header py-6 wow fadeIn"
                data-wow-delay="0.1s"
            >
                <div className="container text-center pt-5 pb-3">
                    <h1 className="display-4 text-white animated slideInDown mb-3">
                        Products
                    </h1>
                    <nav aria-label="breadcrumb animated slideInDown">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <Link className="text-white" to="/">
                                    Home
                                </Link>
                            </li>
                            <li
                                className="breadcrumb-item text-primary active"
                                aria-current="page"
                            >
                                My Orders
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container mt-5">
                <div className="invoice">
                    <button className="btn btn-primary mb-3" onClick={() => navigate(-1)}>Back</button>

                    <div className="text-center mb-4">
                        <h2>Invoice</h2>
                    </div>

                    {data.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">S.no</th>
                                        <th scope="col">Order ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Mobile</th>
                                        <th scope="col">Address</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Brand Name</th>
                                        <th scope="col">Items Name</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Sub Total</th>
                                        <th scope="col">Shipping Price</th>
                                        <th scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((e, index) => (
                                        <tr key={e._id}>
                                            <td>{index + 1}</td>
                                            <td>{e.orderId}</td>
                                            <td>{e.name}</td>
                                            <td>{e.email}</td>
                                            <td>{e.phone}</td>
                                            <td>{e.address}</td>
                                            <td>{new Date(e.createdAt).toLocaleDateString('en-GB', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}</td>
                                            <td>{new Date(e.createdAt).toLocaleTimeString('en-GB', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })}</td>
                                            {/* <td>
                                                {e.products?.map((product) => {
                                                    const categoryName = product?.productId?.categoryId?.name;
                                                    return categoryName || "Unknown";
                                                }).join(", ")}
                                            </td> */}
                                            <td>
                                                {[...new Set(e.products?.map(product => product?.productId?.categoryId?.name || "Unknown"))]
                                                    .join(", ")}
                                            </td>


                                            <td>
                                                {e.products?.map((product) => {
                                                    const productName = product?.productId?.name;
                                                    return Array.isArray(productName)
                                                        ? productName.join(", ")
                                                        : productName || "Unknown";
                                                }).join(", ")}
                                            </td>
                                            <td>{e?.quantity}</td>
                                            <td>
                                                {e.products?.map((product) => {
                                                    const priceDetail = product?.productId?.sellingPrice;
                                                    return Array.isArray(priceDetail)
                                                        ? priceDetail.map((price) => `₹ ${price}`).join(", ")
                                                        : `₹ ${priceDetail || "Unknown"}`;
                                                }).join(", ")}
                                            </td>
                                            <td>₹ {e.totalAmount}</td>
                                            <td>₹ 20</td>
                                            <td>₹ {e.totalAmount + 20}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-center">There are no orders yet</p>}
                </div>
            </div>
        </>

    )
}

export default MyOrders