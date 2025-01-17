import React, { useState } from "react";
import "./products.css";
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore";

function Products({ app, db, auth }) {
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsData, setProductsData] = useState("");
  const currentUserEmail = auth.currentUser.email;
  const validationForm = (event) => {
    event.preventDefault();
    if (!productName || !productQuantity || !productPrice) {
      return alert("Some field is empty!");
    } else {
      addToProducts(productName, productQuantity, productPrice);
      clearForm();
    }
  };
  const clearForm = () => {
    setProductName("");
    setProductQuantity("");
    setProductPrice("");
  };
  const addToProducts = async (productName, productQuantity, productPrice) => {
    try {
      const product = {
        timestamp: serverTimestamp(),
        productName,
        productQuantity,
        productPrice,
      };
      await addDoc(collection(db, "products", currentUserEmail, "personalProducts"), product);
    } catch (error) {
      console.log("add to products", error);
    }
  };
  return (
    <div className="products">
      <h4 className="products-title">Add your product</h4>
      <form className="products-block-input">
        <div className="products-block-label-name">
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            id="name"
            maxLength="30"
            placeholder="Type name of product"
            className="products-input-name"
          ></input>
          <label className="products-input-name-label">Type name of product</label>
        </div>
        <div className="products-block-label">
          <input
            onChange={(e) => setProductQuantity(e.target.value)}
            value={productQuantity}
            id="quantity"
            maxLength="15"
            placeholder="Type quantity of product"
            className="products-input-quantity"
          ></input>
          <label className="products-input-quantity-label">Type quantity of product</label>
        </div>
        <div className="products-block-label">
          <input
            onChange={(e) => setProductPrice(e.target.value)}
            value={productPrice}
            id="price"
            maxLength="15"
            placeholder="Type price for product"
            className="products-input-price"
          ></input>
          <label className="products-input-price-label">Type price for product</label>
        </div>
        <button onClick={(event) => validationForm(event)} className="products-btn-add">
          Add
        </button>
      </form>
    </div>
  );
}

export default Products;
