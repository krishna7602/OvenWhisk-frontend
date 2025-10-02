import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import pro1 from "../img/product-1.jpg"
import pro2 from "../img/product-2.jpg"
import pro3 from "../img/product-3.jpg"
import axios from "axios"
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import { useCart } from './CartProvider'
function Products() {


  const [data, setData] = useState([])
  const [dataCategory, setDataCategory] = useState([])
  const [dataSubCategory, setDataSubCategory] = useState([])
  const [dataAllSubCategory, setDataAllSubCategory] = useState([])
  console.log(dataSubCategory, "dataSubCategory")
  const { setCartCount } = useCart();

  const getToken = localStorage.getItem('userInfo');
  const userInfo = JSON.parse(getToken);
  console.log(userInfo, "userInfo")

  const [filteredProducts, setFilteredProducts] = useState([]);


  const dataGet = async () => {
    try {
      const result = await axios.get(SummaryApi.productGet.url)
      console.log(result, "result")
      setData(result.data.body)
    } catch (error) {
      console.log(error)
    }
  }



  const dataGetCategory = async () => {
    try {
      const result = await axios.get(SummaryApi.findAllCategoryCategory.url)
      console.log(result, "result")
      setDataCategory(result.data.body)
    } catch (error) {
      console.log(error)
    }
  }
  const dataaALlCategoryPro = async () => {
    try {
      const result = await axios.get(SummaryApi.findAllSubCategoryCategory.url)
      console.log(result, "resuldssddst")
      setDataAllSubCategory(result.data.body)
    } catch (error) {
      console.log(error)
    }
  }
  // const dataGetSubCategory = async (iddd) => {
  //   try {
  //     // console.log(iddd,"iddd")
  //     // return
  //     const result = await axios.get(`${SummaryApi.findSubcategoriesByCategory.url}${iddd}`)
  //     console.log(result, "result")
  //     setDataSubCategory(result.data.body)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    dataGet()
    dataGetCategory()
    dataaALlCategoryPro()
    // dataGetSubCategory()
  }, [])


  const handleAddToCart = async (productId) => {
    console.log(productId, "jkjk")
    try {
      if (!userInfo) {
        toast.error('Please login first');
        return;
      }

      const cartResponse = await axios.get(SummaryApi.getAllCart.url, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      console.log(cartResponse, "cartResponse")

      let cartItems = cartResponse.data.body;
      const existingProduct = cartItems.find(
        (item) => item?.productId?._id === productId
      );
      if (existingProduct) {
        const updatedQuantity = existingProduct.quantity + 1;

        await axios.put(
          `${SummaryApi.updateCart.url}${existingProduct._id}`,
          {
            quantity: updatedQuantity,
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );
        toast.success('Quantity updated in your cart');
      } else {
        await axios.post(
          SummaryApi.addToCart.url,
          {
            productId,
            quantity: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );
        toast.success('Successfully added to your cart');
      }

      const updatedCartResponse = await axios.get(SummaryApi.getAllCart.url, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      if (updatedCartResponse.data.status === 200) {
        console.log(updatedCartResponse, "updatedCartResponse")
        setCartCount(updatedCartResponse.data.body.length);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    try {
      const result = await axios.get(`${SummaryApi.findSubcategoriesByCategory.url}${categoryId}`);
      const subCategories = result.data.body;

      setDataSubCategory(subCategories); // still update for use elsewhere
      const filtered = subCategories.filter((product) => product.categoryId._id === categoryId);
      setFilteredProducts(filtered);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };



  // const handleCategoryClick = async (categoryId) => {
  //   console.log(categoryId,"categoryId")
  //   await dataGetSubCategory(categoryId);
  //   const filtered = dataSubCategory.filter((product) => product.categoryId._id === categoryId);
  //   console.log(filtered,"filtered")
  //   setFilteredProducts(filtered);
  // };



  return (
    <div>
      {/* Page Header Start */}
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
              <li className="breadcrumb-item">
                <a className="text-white" href="#">
                  Pages
                </a>
              </li>
              <li
                className="breadcrumb-item text-primary active"
                aria-current="page"
              >
                Products
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}
      {/* Product Start */}
      <div className="container-xxl bg-light my-6 py-6 pt-0">
        <div className="container">
          <div
            className="bg-primary text-light rounded-bottom p-5 my-6 mt-0" data-aos="fade-up" data-aos-delay="100">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <h1 className="display-4 text-light mb-0">
                  The Best Bakery In Your City
                </h1>
              </div>
              <div className="col-lg-6 text-lg-end">
                <div className="d-inline-flex align-items-center text-start">
                  <i className="fa fa-phone-alt fa-4x flex-shrink-0" />
                  <div className="ms-4">
                    <p className="fs-5 fw-bold mb-0">Call Us</p>
                    <p className="fs-1 fw-bold mb-0">+012 345 6789</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="text-center mx-auto mb-5" data-aos="fade-up" data-aos-delay="100"
            style={{ maxWidth: 500 }}
          >
            <p className="text-primary text-uppercase mb-2">Bakery Products</p>
            <h1 className="display-6 mb-4">
              Explore The Categories Of Our Bakery Products
            </h1>
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5" >
            {dataCategory?.map((e, index) => (
              <span
                onClick={(() => handleCategoryClick(e?._id))}
                key={index}
                className="badge rounded-pill bg-primary text-white px-4 py-2 fs-6 shadow-sm"
                style={{ cursor: "pointer", transition: "0.3s" }}
              >
                {e?.name}
              </span>
            ))}
          </div>


          {/* <div className="row g-4">
            {(filteredProducts.length > 0 ? filteredProducts : [])?.map((e) => (
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="product-item d-flex flex-column bg-white rounded overflow-hidden h-100">
                  <div className="text-center p-4">
                    <div className="d-inline-block border border-primary rounded-pill px-4 py-2 mb-3" style={{ backgroundColor: "#f8f9fa", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                      <button className="btn btn-outline-primary me-2" style={{ fontWeight: "bold", padding: "5px 15px", borderRadius: "20px", transition: "all 0.3s" }} onClick={() => handleAddToCart(e?._id)}>
                        Add to cart
                      </button>
                      <button disabled className="btn btn-primary" style={{ fontWeight: "bold", padding: "5px 15px", borderRadius: "20px", color: "white", backgroundColor: "#007bff", transition: "all 0.3s" }}>
                        ₹ {e?.sellingPrice}
                      </button>
                    </div>

                    <h3 className="mb-3">{e?.name}</h3>
                    <span>
                      Elevate your moments with our exquisite cakes, each masterpiece handcrafted to perfection.
                    </span>
                  </div>
                  <div className="position-relative mt-auto">
                    <img className="img-fluid" src={e?.image} alt="" style={{ height: "25rem", width: "44rem" }} />
                    <div className="product-overlay">
                      <a
                        className="btn btn-lg-square btn-outline-light rounded-circle"
                        href=""
                      >
                        <i className="fa fa-eye text-primary" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            ))}
          </div> */}

          <div className="row g-4">
            {(filteredProducts.length > 0 ? filteredProducts : dataAllSubCategory).map((e) => (
              <div key={e._id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="product-item d-flex flex-column bg-white rounded overflow-hidden h-100">
                  <div className="text-center p-4">
                    <div
                      className="d-inline-block border border-primary rounded-pill px-4 py-2 mb-3"
                      style={{ backgroundColor: "#f8f9fa", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                    >
                      <button
                        className="btn btn-outline-primary me-2"
                        style={{ fontWeight: "bold", padding: "5px 15px", borderRadius: "20px", transition: "all 0.3s" }}
                        onClick={() => handleAddToCart(e?._id)}
                      >
                        Add to cart
                      </button>
                      <button
                        disabled
                        className="btn btn-primary"
                        style={{ fontWeight: "bold", padding: "5px 15px", borderRadius: "20px", color: "white", backgroundColor: "#007bff", transition: "all 0.3s" }}
                      >
                        ₹ {e?.sellingPrice}
                      </button>
                    </div>
                    <h3 className="mb-3">{e?.name}</h3>
                    <span>{e?.description || 'Elevate your moments with our exquisite cakes, each masterpiece handcrafted to perfection.'}</span>
                  </div>
                  <div className="position-relative mt-auto">
                    <img className="img-fluid" src={e?.image} alt={e?.name} style={{ height: "25rem", width: "100%", objectFit: "cover" }} />
                    <div className="product-overlay">
                      <Link className="btn btn-lg-square btn-outline-light rounded-circle" to={`/product/${e._id}`}>
                        <i className="fa fa-eye text-primary" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>



        </div>
      </div>
      {/* Product End */}


    </div>
  )
}

export default Products


