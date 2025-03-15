import React, { useState } from "react";
import "./TelegrammBot.css";
import axios from "axios";

function TelegrammBot({ setTelegrammBotGettingChatId, setChatId }) {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  const TELEGRAM_API_KEY = process.env.REACT_APP_TELEGRAMM_API_KEY;
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_KEY}`;
  const checkBotChatId = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const response = await axios.get(`${TELEGRAM_API_URL}/getUpdates`);
      const updates = response.data.result;
      for (const update of updates) {
        if (update.message) {
          if (update.message.text) {
            setChatId(update.message.chat.id);
            setTelegrammBotGettingChatId(false);
            setIsChecking(false);
            return;
          }
        }
      }

      setIsChecking(false);
      setError("Пользователь не найден. Пожалуйста, отправьте сообщение боту.");
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
        <strong>"a_startling_message_bot"</strong>. Then write any message to the bot and that's it.
      </p>
      <button onClick={checkBotChatId} className="telegramm-btn" disabled={isChecking}>
        {isChecking ? "Checking..." : "Already DONE!"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default TelegrammBot;
