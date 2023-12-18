import { SseDemo } from "../islands/sse-demo.tsx";

export function Repeat({ times }) {
  return (
    <div>
      {Array(times).fill().map((_, index) => (
        <SseDemo />
      ))}
    </div>
  );
}
