import React, { useState, useEffect } from "react";
import "./products.css";
import { addDoc, collection, onSnapshot, doc, query, deleteDoc, orderBy, serverTimestamp } from "firebase/firestore";

function Products({ db, auth, unsubscribeRef }) {
  const emojiData = [
    "🍇",
    "🍏",
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶",
    "🌽",
    "🥕",
    "🥔",
    "🍠",
    "🥐",
    "🥯",
    "🍞",
    "🥖",
    "🧀",
    "🥚",
    "🍳",
    "🥞",
    "🥓",
    "🥩",
    "🍗",
    "🍖",
    "🌭",
    "🍔",
    "🍟",
    "🍕",
    "🌮",
    "🌯",
    "🥗",
    "🍿",
    "🧂",
    "🥤",
    "🍩",
  ];
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [productId, setProductId] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [haveNotProducts, setHaveNotProducts] = useState(true);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [productsData, setProductsData] = useState("");
  const currentUserEmail = auth.currentUser.email;

  const handleChange = (event) => {
    setSelectedEmoji(event.target.value);
  };

  const updateProduct = async (event) => {
    event.preventDefault();
    if (!productName || !productQuantity || !productPrice || !selectedEmoji) {
      return alert("Some field is empty!");
    } else {
      const updatedProduct = {
        timestamp: serverTimestamp(),
        productName,
        productQuantity,
        productPrice,
        selectedEmoji,
      };
      try {
        await deleteDoc(doc(db, "products", currentUserEmail, "personalProducts", productId));
        await addDoc(collection(db, "products", currentUserEmail, "personalProducts"), updatedProduct);
        clearForm();
        setProductId("");
        setUpdatingProduct(false);
      } catch (error) {
        console.log("updateProduct", error.message);
      }
    }
  };
  const deleteProduct = async (product) => {
    const id = product.docId;
    try {
      await deleteDoc(doc(db, "products", currentUserEmail, "personalProducts", id));
    } catch (error) {
      console.log("deleteProduct", error.message);
    }
  };
  useEffect(() => {
    if (productsData.length > 0) {
      setHaveNotProducts(false);
    }
  }, [productsData]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "products", currentUserEmail, "personalProducts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setProductsData(snapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data() })));
        setLoadingProducts(false);
      },
      (error) => {
        console.log(error.message);
      }
    );
    unsubscribeRef.current = unsubscribe;
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [unsubscribeRef]);

  const validationForm = (event) => {
    event.preventDefault();
    if (!productName || !productQuantity || !productPrice || !selectedEmoji) {
      return alert("Some field is empty!");
    } else {
      addToProducts(productName, productQuantity, productPrice, selectedEmoji);
      clearForm();
    }
  };
  const clearForm = () => {
    setProductName("");
    setProductQuantity("");
    setProductPrice("");
    setSelectedEmoji("");
  };
  const addToProducts = async (productName, productQuantity, productPrice, selectedEmoji) => {
    try {
      const product = {
        timestamp: serverTimestamp(),
        productName,
        productQuantity,
        productPrice,
        selectedEmoji,
      };
      await addDoc(collection(db, "products", currentUserEmail, "personalProducts"), product);
    } catch (error) {
      console.log("add to products", error);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setProductPrice(value);
    }
  };

  return (
    <div className="products">
      <h4 className="products-title">Add your product</h4>
      <form className="products-block-input">
        <div className="products-block-label-name">
          <input
            value={productName}
            autoComplete="off"
            onChange={(e) => setProductName(e.target.value)}
            id="name"
            maxLength="30"
            placeholder="Type name of product"
            className="products-input-name"
          ></input>
          <label className="products-input-name-label">Type name of product</label>
        </div>
        <select className="products-input-emoji" onChange={handleChange}>
          {emojiData.map((emoji, index) => (
            <option key={index} value={emoji}>
              {emoji}
            </option>
          ))}
        </select>
        <div className="products-block-label">
          <input
            autoComplete="off"
            onChange={(e) => setProductQuantity(e.target.value)}
            value={productQuantity}
            id="quantity"
            maxLength="11"
            placeholder="Type quantity of product"
            className="products-input-quantity"
          ></input>
          <label className="products-input-quantity-label">Type quantity of product</label>
        </div>
        <div className="products-block-label">
          <input
            type="number"
            step="0.01"
            onChange={handlePriceChange}
            value={productPrice}
            id="price"
            maxLength="10"
            placeholder="Type price (e.g., 100.20)"
            className="products-input-price"
          ></input>
          <label className="products-input-price-label">Type price for product</label>
        </div>
        {updatingProduct ? (
          <button onClick={(event) => updateProduct(event)} className="products-btn-add">
            Update
          </button>
        ) : (
          <button onClick={(event) => validationForm(event)} className="products-btn-add">
            Add
          </button>
        )}
      </form>
      <h4 className="products-title-already">Already added products:</h4>
      {loadingProducts ? (
        <div>Loading...</div>
      ) : (
        <div>
          {haveNotProducts ? (
            <div>You haven't added any products yet</div>
          ) : (
            <>
              {productsData.map((product, index) => (
                <div key={index} className="products-block-show">
                  <div className="products-show-name">{product.productName}</div>
                  <div className="products-show-emoji">{product.selectedEmoji || null}</div>
                  <div className="products-show-quantity">{product.productQuantity}</div>
                  <div className="products-show-price">{product.productPrice}</div>
                  <button
                    onClick={() => {
                      deleteProduct(product);
                    }}
                    className="products-show-btn-delete"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setProductName(product.productName);
                      setProductQuantity(product.productQuantity);
                      setProductPrice(product.productPrice);
                      setUpdatingProduct(true);
                      setProductId(product.docId);
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
