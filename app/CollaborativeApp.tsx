"use client";

import { useOthers } from "@liveblocks/react/suspense";

export function CollaborativeApp() {
  const others = useOthers();
  const userCount = others.length;
  return (
    <html>
        <textarea id="notepad" name="notepad"></textarea>
    </html>
  );
}