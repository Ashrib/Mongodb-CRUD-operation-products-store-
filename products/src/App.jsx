import './App.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
  
}


function App() {
  // for modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //------------------------

  const [products, setProducts] = useState([]);
  const [loadProduct, setLoadProduct] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/products`)
      console.log("response: ", response.data);

      setProducts(response.data.data.reverse())

    } catch (error) {
      console.log("error in getting all products", error);
    }
  }

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/product/${id}`)
      console.log("response: ", response.data);

      setLoadProduct(!loadProduct)

    } catch (error) {
      console.log("error in getting all products", error);
    }
  }

  const editMode = (product) => {
    setIsEditMode(!isEditMode)
    setEditingProduct(product)

    editFormik.setFieldValue("productName", product.name)
    editFormik.setFieldValue("productPrice", product.price)
    editFormik.setFieldValue("productDescription", product.description)
  }

  useEffect(() => {

    getAllProducts()

  }, [loadProduct])

  const myFormik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productDescription: '',
    },
    validationSchema:
      yup.object({
        productName: yup
          .string('Enter your product name')
          .required('product name is required')
          .min(3, "please enter more then 3 characters ")
          .max(20, "please enter within 20 characters "),

        productPrice: yup
          .number('Enter your product price')
          .positive("enter positive product price")
          .required('product price is required'),

        productDescription: yup
          .string('Enter your product Description')
          .required('product description is required')
          .min(3, "please enter more then 3 characters ")
          .max(500, "please enter within 20 characters "),
      }),
    onSubmit: (values) => {
      console.log("values: ", values);

      axios.post(`http://localhost:3000/product`, {
        name: values.productName,
        price: values.productPrice,
        description: values.productDescription,
      })
        .then(response => {
          console.log("response: ", response.data);
          setLoadProduct(!loadProduct)

        })
        .catch(err => {
          console.log("error: ", err);
        })
    },
  });
  const editFormik = useFormik({
    initialValues: {
      productName: '',
      productPrice: '',
      productDescription: '',
    },
    validationSchema:
      yup.object({
        productName: yup
          .string('Enter your product name')
          .required('product name is required')
          .min(3, "please enter more then 3 characters ")
          .max(20, "please enter within 20 characters "),

        productPrice: yup
          .number('Enter your product price')
          .positive("enter positive product price")
          .required('product name is required'),

        productDescription: yup
          .string('Enter your product Description')
          .required('product name is required')
          .min(3, "please enter more then 3 characters ")
          .max(500, "please enter within 20 characters "),
      }),
    onSubmit: (values) => {
      console.log("values: ", values);

      axios.put(`http://localhost:3000/product/${editingProduct._id}`, {
        name: values.productName,
        price: values.productPrice,
        description: values.productDescription,
      })
        .then(response => {
          console.log("response: ", response.data);
          setLoadProduct(!loadProduct)

        })
        .catch(err => {
          console.log("error: ", err);
        })
    },
  });

  return (
    <div className='main'>
      <div className="nav">
        Products
      </div>
      <div className="body-div">
      <div className="form-div">
        <div className="theForm">
          <form onSubmit={myFormik.handleSubmit}>
            <div className="form-row">
              <input
                id="productName"
                placeholder="Product Name"
                value={myFormik.values.productName}
                onChange={myFormik.handleChange}
              />
              {
                (myFormik.touched.productName && Boolean(myFormik.errors.productName)) ?
                  <span >{myFormik.errors.productName}</span>
                  :
                  null
              }
            </div>

            <div className="form-row">
              <input
                id="productPrice"
                placeholder="Product Price"
                value={myFormik.values.productPrice}
                onChange={myFormik.handleChange}
              />
              {
                (myFormik.touched.productPrice && Boolean(myFormik.errors.productPrice)) ?
                  <span >{myFormik.errors.productPrice}</span>
                  :
                  null
              }
            </div>

            <div className="form-row">
              <input
                id="productDescription"
                placeholder="Product Description"
                value={myFormik.values.productDescription}
                onChange={myFormik.handleChange}
              />
              {
                (myFormik.touched.productDescription && Boolean(myFormik.errors.productDescription)) ?
                  <span >{myFormik.errors.productDescription}</span>
                  :
                  null
              }
            </div>
            <Button variant="outline-primary" type="submit">Add Product</Button>{' '}
          </form>
        </div>
      </div>


      <div className="products-container">
        <div >
          <div className='table'>     
            <Table responsive="xl"  striped bordered hover variant="dark"  >
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Product Name</th>
                  <th>Product Price</th>
                  <th>Description</th>
                </tr>
              </thead>
            { products.map((eachProduct,i) => (  
              
            <tbody key={i}>
                <tr>
                  <td>{eachProduct?._id}</td>
                  <td>{eachProduct?.name}</td>
                  <td>Rs.{eachProduct?.price}</td>
                  <td>{eachProduct?.description} <br />
                  <Button size='sm' variant="danger" onClick={() => {
                    let toConfrim = confirm(`Are you sure to delete the product '${eachProduct.name}'?`);
                    (toConfrim)?
                    deleteProduct(eachProduct._id)
                    :null;
                  }}>Delete</Button>
                  
                  <Button size='sm' variant="secondary" onClick={() => {
                  editMode(eachProduct);
                  handleShow();
                  }}>Update</Button>
                  </td>
                </tr>

              </tbody>
              ))}

            </Table>
          </div>
          {/* end of table div */}
        </div>
      </div>

      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                id="productName"
                placeholder="Product Name"
                value={editFormik.values.productName}
                onChange={editFormik.handleChange}
              />
            </Form.Group>
            {
              (editFormik.touched.productName && Boolean(editFormik.errors.productName)) ?
                <span className='error-span'>{editFormik.errors.productName}</span>
                :
                null
            }
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                id="productPrice"
                placeholder="Product Price"
                value={editFormik.values.productPrice}
                onChange={editFormik.handleChange}
              />
            </Form.Group>
            {
              (editFormik.touched.productPrice && Boolean(editFormik.errors.productPrice)) ?
                <span className='error-span'>{editFormik.errors.productPrice}</span>
                :
                null
            }
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Product Description</Form.Label>
              <Form.Control as="textarea" rows={3} 
                id="productDescription"
                placeholder="Product Description"
                value={editFormik.values.productDescription}
                onChange={editFormik.handleChange}
              />
            </Form.Group>
            {
              (editFormik.touched.productDescription && Boolean(editFormik.errors.productDescription)) ?
                <span className='error-span'>{editFormik.errors.productDescription}</span>
                :
                null
            }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            handleClose();
            editFormik.handleSubmit();
            }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  );
}

export default App;