import { useEffect, useState } from "preact/hooks";

export function SseDemo() {
  const [clientValue, updateClientValue] = useState(0);

  useEffect(() => {
    const sse = new EventSource("/sse/stream");
    sse.onerror = (err) => {
      console.log("Connection Error");
      sse.close();
    };

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateClientValue(data);
    };
  }, []);

  return (
    <>
      <h1>Server Pushed Value = {clientValue}</h1>
    </>
  );
}
