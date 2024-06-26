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
import { Input } from "@/components/ui/input.jsx";

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    const queryMessages = query(messagesRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.email,
    });

    setNewMessage("");
  };

  return (
      <div className="p-4 h-full">
        {user ? (
            <>
              <div className="messages-container flex flex-col gap-2 h-4/5">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message gap-1 flex items-center p-2 rounded-lg border-blue-800/20 border-2 ${
                            message.user === user.email
                                ? "bg-blue-100 justify-end"
                                : "bg-gray-100"
                        }`}
                    >
                      <div className="flex flex-col">
                  <span
                      className={`text-md ${
                          message.user === user.email
                              ? "text-blue-900"
                              : "text-gray-700"
                      }`}
                  >
                    {message.text}
                  </span>
                        <span
                            className={`user text-xs font-medium ${
                                message.user === user.email ? "hidden" : "text-gray-700"
                            }`}
                        >
                    {message.user}:
                  </span>
                      </div>
                    </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="new-message-form flex items-center mt-4">
                <Input
                    type="text"
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    className="new-message-input flex-1 mr-4"
                    placeholder="Type your message here..."
                />
                <button
                    type="submit"
                    className="bg-purple-600 send-button bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded"
                >
                  Send
                </button>
              </form>
            </>
        ) : (
            <p>You don't have permission to see the messages.</p>
        )}
      </div>
  );
};
