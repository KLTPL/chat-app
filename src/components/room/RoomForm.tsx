import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = { onSendMessage: (message: string) => void };

function RoomForm({ onSendMessage }: Props) {
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  function handleSendMessage(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
      if (inputRef?.current) {
        inputRef.current.value = "";
      }
    }
  }
  return (
    <form className="flex mt-4 gap-2" onSubmit={handleSendMessage}>
      <Input
        type="text"
        onChange={ev => setMessage(ev.target.value)}
        placeholder="Message..."
        ref={inputRef}
      />
      <Button type="submit" className="bg-gray-800">
        Send
      </Button>
    </form>
  );
}

export default RoomForm;
