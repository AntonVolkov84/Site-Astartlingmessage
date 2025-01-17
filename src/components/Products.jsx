import React, { useState, useEffect } from "react";
import "./products.css";
import { addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

function Products({ db, auth }) {
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [haveNotProducts, setHaveNotProducts] = useState(true);
  const [productsData, setProductsData] = useState("");
  const currentUserEmail = auth.currentUser.email;

  useEffect(() => {
    onSnapshot(
      query(collection(db, "products", currentUserEmail, "personalProducts"), orderBy("timestamp", "asc")),
      (snapshot) => {
        setProductsData(snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() })));
        setLoadingProducts(false);
      }
    );
    if (productsData.length > 0) {
      setHaveNotProducts(false);
    }
  }, []);

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
      <h4 className="products-title-already">Already added products:</h4>
      {loadingProducts ? (
        <div>Loading...</div>
      ) : (
        <div>
          {haveNotProducts ? (
            <div>There is no products to show! Please add!</div>
          ) : (
            <>
              {productsData.map((e, index) => (
                <div key={index} className="products-block-show">
                  <div className="products-show-name">{e.productName}</div>
                  <div className="products-show-quantity">{e.productQuantity}</div>
                  <div className="products-show-price">{e.productPrice}</div>
                  <button
                    onClick={() => {
                      console.log("del", e.docId);
                    }}
                    className="products-show-btn-delete"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      console.log("edit");
                    }}
                    className="products-show-btn-edit"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Products;
