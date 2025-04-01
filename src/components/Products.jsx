import React, { useState, useEffect } from "react";
import "./products.css";
import { addDoc, collection, onSnapshot, doc, query, deleteDoc, orderBy, serverTimestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const currentUserEmail = auth.currentUser.email;

  const handleChange = (event) => {
    setSelectedEmoji(event.target.value);
  };

  const updateProduct = async (event) => {
    event.preventDefault();
    if (!productName || !productQuantity || !productPrice || !selectedEmoji) {
      return alert(`${t("productsApdateProdAlert")}`);
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
      return alert(`${t("productsApdateProdAlert")}`);
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
      <h4 className="products-title">{t("productsAdd")}</h4>
      <form className="products-block-input">
        <div className="products-block-label-name">
          <input
            value={productName}
            autoComplete="off"
            onChange={(e) => setProductName(e.target.value)}
            id="name"
            maxLength="30"
            placeholder={t("productsPlaceholderProductName")}
            className="products-input-name"
          ></input>
          <label className="products-input-name-label">{t("productsPlaceholderProductName")}</label>
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
            placeholder={t("productsPlaceholderproductQuantity")}
            className="products-input-quantity"
          ></input>
          <label className="products-input-quantity-label">{t("productsPlaceholderproductQuantity")}</label>
        </div>
        <div className="products-block-label">
          <input
            type="number"
            step="0.01"
            onChange={handlePriceChange}
            value={productPrice}
            id="price"
            maxLength="10"
            placeholder={t("productsPlaceholderPrice")}
            className="products-input-price"
          ></input>
          <label className="products-input-price-label">{t("productsPlaceholderPrice")}</label>
        </div>
        {updatingProduct ? (
          <button onClick={(event) => updateProduct(event)} className="products-btn-add">
            {t("update")}
          </button>
        ) : (
          <button onClick={(event) => validationForm(event)} className="products-btn-add">
            {t("add")}
          </button>
        )}
      </form>
      <h4 className="products-title-already">{t("productsAddedProducts")}</h4>
      {loadingProducts ? (
        <div>{t("loading")}</div>
      ) : (
        <div>
          {haveNotProducts ? (
            <div>{t("productsNoProduct")}</div>
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
                    {t("delete")}
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
                    {t("update")}
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
