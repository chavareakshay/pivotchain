import React, { useState, useEffect } from "react";
import { Form, Button, Table, Badge } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Loader from "./CommonComponents/Loader";
import { Api } from "./Utils/Api";
import {
  createNewproductAPI,
  deleteproductByIdAPI,
  getAllproductAPI,
  updateproductAPI,
} from "./Api/Links";

import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import DigitalClock from "./CommonComponents/DigitalClock";
import { FaBoxes } from "react-icons/fa";
import {FiCodesandbox, FiBox} from 'react-icons/fi'
import { BiSolidUserPlus } from "react-icons/bi";
// import './App.css';

const App = () => {
  const [show, setShow] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [modalTitle, setModalTitle] = useState("Create product");
  const [PId, setPId] = useState(null);

  // product Data
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // State to store form field values
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    pdetails: "",
    status: "active",
  });

  // State to store form validation errors
  const [errors, setErrors] = useState({});

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form submission handler
  const handleSubmit = (e) => {
    setLoaderStatus(true);
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Submit the form data to the server or perform other actions
      console.log("Form submitted:", formData);
      Api("post", createNewproductAPI, formData)
        .then((res) => {
          if (res.data === "SAVED") {
            getAllProductData();
            setLoaderStatus(false);
            toast.success("Product Created Sucessfully");
            setShow(false);
            clearForm();
          } else if (res.data === "EXIST") {
            setLoaderStatus(false);
            toast.warn("Product already exist");
          }
        })
        .catch((err) => {
          setLoaderStatus(false);
          toast.error("Product creation failed.");
          console.log("====================================");
          console.log("Error=-=" + err);
          console.log("====================================");
        });
    } else {
      setErrors(validationErrors);
    }
  };

  const handleUpdate = (e) => {
    setLoaderStatus(true);
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Submit the form data to the server or perform other actions
      console.log("Form submitted:", formData);
      Api("put", updateproductAPI + PId, formData)
        .then((res) => {
          if (res.data === "UPDATED") {
            getAllProductData();
            setLoaderStatus(false);
            toast.success("Product Updated Sucessfully");
            setShow(false);
            clearForm();
          } else if (res.data === "EXIST") {
            setLoaderStatus(false);
            toast.warn("Your email id is already exists");
          }
        })
        .catch((err) => {
          setLoaderStatus(false);
          toast.error("Product updation failed.");
          console.log("====================================");
          console.log("Error=-=" + err);
          console.log("====================================");
        });
    } else {
      setErrors(validationErrors);
    }
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Product Name is required";
      setLoaderStatus(false);
    }
    if (!formData.price) {
      errors.price = "Price is required";
      setLoaderStatus(false);
    
    }
    if (!formData.pdetails) {
      errors.pdetails = "Product Details is required";
      setLoaderStatus(false);
    }
    setLoaderStatus(false);
    return errors;
  };

  const clearForm = () => {
    setPId(null);
    setModalTitle("Create Product");
    setFormData({
      name: "",
      contact: "",
      pdetails: "",
      status: "active",
    });
  };

  const getAllProductData = () => {
    setLoaderStatus(true);
    Api("get", getAllproductAPI, null)
      .then((res) => {
        if (res.data !== null) {
          setProductData(res.data);
          setFilteredData(res.data);
          setLoaderStatus(false);
        }
      })
      .catch((err) => {
        setLoaderStatus(false);
        console.log("====================================");
        console.log("Error=-" + err);
        console.log("====================================");
      });
  };

  useEffect(() => {
    getAllProductData();
  }, []);

  // Set values to form fields
  const handleEdit = (data) => {
    setModalTitle("Update Product Details");
    setPId(data._id);
    setFormData({
      name: data.name,
      price: data.price,
      pdetails: data.pdetails,
      status: data.status,
    });
    setShow(true);
  };

  const deleteproduct= () => {
    setLoaderStatus(true);
    Api("delete", deleteproductByIdAPI + PId, null)
      .then((res) => {
        if (res.data === "DELETED") {
          setLoaderStatus(false);
          setDeleteModal(false);
          toast.success("Product deleted sucessfully");
          getAllProductData();
        }
      })
      .catch((err) => {
        setLoaderStatus(false);
        clearForm();
        setDeleteModal(false);
        toast.error("Error occured, Something went wrong.");
        console.log("====================================");
        console.log("Error=-" + err);
        console.log("====================================");
      });
  };

  useEffect(() => {
    setFilteredData(
      productData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.price.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.pdetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <>
      {loaderStatus === true ? <Loader /> : null}
      <ToastContainer />

      <div className="container-fluid">
        <div className="row header-bg">
          <div className="col-6">
            <h2 className="text-light">Product Management</h2>
          </div>
          <div className="col-6" style={{ textAlign: "right", color: "#fff" }}>
            <DigitalClock />
          </div>
        </div>
      </div>

      <div className="container mt-3">
        {/* CARDS */}
        <div className="row">
          <div className="col-sm-12 col-md-4 card-wrapper">
            <div className="card-container card-all">
              <div className="icon-container card-all">
               <FaBoxes /> 
              </div>
              <h2>{productData.length}</h2>
              <strong>ALL Product</strong>
            </div>
          </div>
          <div className="col-sm-12 col-md-4 card-wrapper">
            <div className="card-container card-active">
              <div className="icon-container card-active">
               <FiCodesandbox />
              </div>
              <h2>
                {productData.filter((item) => item.status === "active").length}
              </h2>
              <strong>IN Stock</strong>
            </div>
          </div>
          <div className="col-sm-12 col-md-4 card-wrapper">
            <div className="card-container card-inactive">
              <div className="icon-container card-inactive">
                 <FiBox /> 
              </div>
              <h2>
                {productData.filter((item) => item.status === "inactive").length}
              </h2>
              <strong>Out Of Stock</strong>
            </div>
          </div>
        </div>

        <div className="row mt-3 table-container">
          <h3 className="my-2">Product List</h3>
          <hr style={{ borderColor: "#ABB2B9" }} />
          <div className="col-sm-3 mb-3">
            <button className="btn btn-add" onClick={() => setShow(true)}>
              <BiSolidUserPlus fontSize={26} /> Add Product
            </button>
          </div>
          <div className="col-sm-3 offset-sm-6">
            <input
              className="form-control"
              type="text"
              placeholder="Search Here"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
          <Table bordered hover responsive="md">
            <thead>
              <tr>
                <th className="table-bgdark">Id</th>
                <th className="table-bgdark">Product Id</th>
                <th className="table-bgdark">Product Name</th>
                <th className="table-bgdark">Price</th>
                <th className="table-bgdark">Product Details</th>
                <th className="table-bgdark">Status</th>
                <th className="table-bgdark">Created Date</th>
                <th className="table-bgdark">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                return (
                  <tr key={item._id}>
                    <td>{parseInt(index) + 1}</td>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.pdetails}</td>
                    <td>
                      {item.status === "active" ? (
                        <Badge bg="success">IN Stock</Badge>
                      ) : (
                        <Badge bg="danger">OutOf Stock</Badge>
                      )}
                    </td>
                    <td>{moment(item.createdDate).format("DD-MM-YYYY")}</td>
                    <td>
                      <FaEdit
                        className="text-success mx-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(item)}
                      />
                      <FaTrashCan
                        className="text-danger mx-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setPId(item._id);
                          setDeleteModal(item);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Create product Modal */}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Form onSubmit={PId === null ? handleSubmit : handleUpdate}>
          {/* <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header> */}
          <Modal.Body style={{ padding: 0 }}>
            <h3 className="modal-title">
              {modalTitle}
            </h3>

            <div className="px-3">
              <Form.Group controlId="name" className="mt-2">
                <Form.Label className="fw-bold">Product Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Product name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="price" className="mt-2">
                <Form.Label className="fw-bold">Price:</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  placeholder="Enter Price"
                  value={formData.price}
                  onChange={handleChange}
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="pdetails" className="mt-2">
                <Form.Label className="fw-bold">Product Details:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="pdetails"
                  placeholder="Enter Prodect Details"
                  value={formData.pdetails}
                  onChange={handleChange}
                  isInvalid={!!errors.pdetails}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.pdetails}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="status" className="mb-3 mt-2">
                <Form.Label className="fw-bold">Status:</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">In Stock</option>
                  <option value="inactive">Out OF Stock</option>
                </Form.Control>
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer
            style={{
              alignItems: "flex-start",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Button
              type="submit"
              className={PId === null ? "btn-save" : "btn-update"}
            >
              {PId === null ? "SAVE" : "UPDATE"}
            </Button>
            <Button
              className="btn-cancel"
              onClick={() => {
                clearForm();
                setShow(false);
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={deleteModal}
        onHide={() => setDeleteModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Form>
          <Modal.Body>
            <h3 className="text-center my-3">
              Are you sure you want to delete ?
            </h3>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                margin: "26px 0",
              }}
            >
              <span
                style={{
                  padding: 10,
                  backgroundColor: "#DAFFD9",
                  borderRadius: 20,
                  color: "#0AAE06",
                  border: "1px solid #7DFF7A",
                  cursor: "pointer",
                }}
                onClick={deleteproduct}
              >
                Yes
              </span>
              <span
                style={{
                  padding: 10,
                  backgroundColor: "#FFD2D2",
                  borderRadius: 20,
                  color: "#C90A0A",
                  border: "1px solid #FF7575",
                  cursor: "pointer",
                  marginLeft: 12,
                }}
                onClick={() => {
                  setPId(null);
                  setDeleteModal(false);
                }}
              >
                No
              </span>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </>
  );
};

export default App;
