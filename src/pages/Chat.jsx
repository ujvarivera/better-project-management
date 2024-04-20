import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      // console.log(messages);
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      // user: auth.currentUser.displayName,
      user: auth.currentUser.email,
    });

    setNewMessage("");
  };

  return (
    <div className="chat-app">
      {
        user ?
        <>
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className="message">
                <span className="user">{message.user}:</span> {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="new-message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              className="new-message-input"
              placeholder="Type your message here..."
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </> :
        <p>You don't have permission to see the messages.</p>
      }
    </div>
  );
};