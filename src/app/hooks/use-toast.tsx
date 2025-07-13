"use client";

import { useState } from "react";

export function useToast() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  function showToast(message: string) {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000); // Hide toast after 3 seconds
  }
  const ToastElement = () => {
    if (!toastVisible) return null;
    return (
      <p data-testid="toast" className="text-green-600">
        {toastMessage}
      </p>
    );
  };

  return { showToast, ToastElement };
}
