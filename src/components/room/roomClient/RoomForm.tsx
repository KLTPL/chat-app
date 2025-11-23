import React, { useRef, useState } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = { onSendMessage: (message: string) => void };

function RoomForm({ onSendMessage }: Props) {
  const [message, setMessage] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  function handleSendMessage(ev: React.FormEvent) {
    ev.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
      if (textAreaRef?.current) {
        textAreaRef.current.value = "";
      }
    }
  }

  function handleTextAreaKeyDown(ev: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (ev.key === "Enter" && !ev.shiftKey) {
      handleSendMessage(ev);
    }
  }

  return (
    <form
      className="flex mt-4 gap-2 sticky bottom-0 justify-center w-full"
      onSubmit={handleSendMessage}
    >
      <Textarea
        onChange={ev => {
          setMessage(ev.target.value);
        }}
        onKeyDown={handleTextAreaKeyDown}
        placeholder="Message..."
        ref={textAreaRef}
        className="bg-white max-w-[70ch] min-h-[2em] max-h-[10em] resize-none overflow-y-auto"
      />
      <Button type="submit" className="bg-gray-800">
        Send
      </Button>
    </form>
  );
}

export default RoomForm;
