import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [balance, setBalance] = useState(0);
  const [shopItems, setShopItems] = useState([
    { id: 1, name: "Товар 1", price: 10 },
    { id: 2, name: "Товар 2", price: 20 },
  ]);

  const [modal, setModal] = useState({ open: false, type: "", item: null });
  const [inputValue, setInputValue] = useState("");

  // Подключаем Rich Ads
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://richinfo.co/richpartners/telegram/js/tg-ob.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.TelegramAdsController) {
        window.TelegramAdsController.initialize({
          pubId: "988067",
          appId: "3775",
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Функция просмотра рекламы
  const watchAd = () => {
    if (window.TelegramAdsController) {
      window.TelegramAdsController.showAd();
      setBalance(balance + 1); // +1 монета
    } else {
      alert("Реклама пока не загрузилась, попробуйте позже");
    }
  };

  // Модальные окна
  const openModal = (type, item = null) => {
    setModal({ open: true, type, item });
  };

  const confirmModal = () => {
    if (modal.type === "withdraw") {
      alert(`Вывод: ${inputValue} успешно!`);
      setBalance(balance - modal.item?.price || 0);
    } else if (modal.type === "buy") {
      if (balance >= modal.item.price) {
        alert(`Вы купили ${modal.item.name}!`);
        setBalance(balance - modal.item.price);
      } else {
        alert("Недостаточно монет!");
      }
    }
    setInputValue("");
    setModal({ open: false, type: "", item: null });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
    <h1>Mini App Tg2</h1>
    <p>Баланс: {balance} монет</p>

    <button onClick={watchAd}>Смотреть рекламу (+1 монета)</button>

    <h2>Магазин</h2>
    <ul>
    {shopItems.map((item) => (
      <li key={item.id} style={{ marginBottom: "10px" }}>
      {item.name} — {item.price} монет{" "}
      <button onClick={() => openModal("buy", item)}>Купить</button>
      </li>
    ))}
    </ul>

    <h2>Вывод</h2>
    <button onClick={() => openModal("withdraw", { price: 0 })}>Вывести монеты</button>

    {/* Модальное окно */}
    {modal.open && (
      <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
      }}
      >
      <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", width: "300px" }}>
      <h3>{modal.type === "buy" ? `Покупка: ${modal.item.name}` : "Вывод монет"}</h3>
      <input
      type="text"
      placeholder="Введите данные"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={confirmModal} style={{ marginRight: "10px" }}>
      Подтвердить
      </button>
      <button onClick={() => setModal({ open: false, type: "", item: null })}>Отмена</button>
      </div>
      </div>
    )}
    </div>
  );
}

export default App;

