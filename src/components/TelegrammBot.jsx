import React, { useState } from "react";
import "./TelegrammBot.css";
import axios from "axios";

function TelegrammBot({ setTelegrammBotGettingChatId, setChatId, userPhone }) {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  const TELEGRAM_API_KEY = process.env.REACT_APP_TELEGRAMM_API_KEY;
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_KEY}`;
  const checkBotChatId = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const offset = 61874406;
      const response = await axios.get(`${TELEGRAM_API_URL}/getUpdates`, {
        params: { offset },
      });
      const updates = response.data.result;
      const filteredByPhoneUpdates = updates.filter((update) => {
        return update.message && update.message.text && update.message.text === userPhone;
      });
      if (filteredByPhoneUpdates.length < 1) {
        alert("Телефоны не совпадают, либо вы не отправили его боту, проверьте пожалуйста!");
        setIsChecking(false);
        return;
      } else {
        let chatId = filteredByPhoneUpdates[0].message.chat.id;
        setChatId(chatId);
        setTelegrammBotGettingChatId(false);
        setIsChecking(false);
        return;
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
      setError("Произошла ошибка при проверке. Проверьте API-ключ и URL.");
      setIsChecking(false);
    }
  };

  return (
    <div className="telegramm">
      <p className="telegramm-info">
        To continue registration for all service sellers, we recommend subscribing to the chat bot in Telegram. In the
        future, it will inform you that there is an order for your products. Also, information about the order will be
        duplicated by e-mail.
      </p>
      <p className="telegramm-info">
        You need to install telegram on the phone number you specified during registration. In the search, write
        <strong>"a_startling_message_bot"</strong>. Then write to bot your telefon number for registration. In the
        format that you entered during registration.
      </p>
      <p className="telegramm-info">
        Для продолжения регистрации для всех продавцов услуг рекомендуем подписаться на чат-бота в Telegram. В
        дальнейшем он будет информировать вас о наличии заказа на вашу продукцию. Также информация о заказе будет
        дублироваться на электронную почту.
      </p>
      <p className="telegramm-info">
        Вам необходимо установить телеграм на номер телефона, который вы указали при регистрации. В поиске напишите
        <strong>"a_startling_message_bot"</strong>. Затем напишите боту свой номер телефона для регистрации. В том
        формате, что вы вводили при регистрации.
      </p>
      <button onClick={checkBotChatId} className="telegramm-btn" disabled={isChecking}>
        {isChecking ? "Checking..." : "Already DONE!"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default TelegrammBot;
