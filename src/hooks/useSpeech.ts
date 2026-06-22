"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const lastSpokenRef = useRef<{ text: string; at: number }>({ text: "", at: 0 });

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = useCallback(
    (text: string, opts: SpeakOptions = {}, cooldownMs = 3000) => {
      if (!supported || !text) return;
      const now = Date.now();
      if (lastSpokenRef.current.text === text && now - lastSpokenRef.current.at < cooldownMs) return;
      lastSpokenRef.current = { text, at: now };

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = opts.lang ?? "de-DE";
      utter.rate = opts.rate ?? 1;
      utter.pitch = opts.pitch ?? 1;
      utter.volume = opts.volume ?? 1;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utter);
    },
    [supported]
  );

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { supported, speaking, speak, cancel };
}
