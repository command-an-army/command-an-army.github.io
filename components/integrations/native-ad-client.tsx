"use client";

import { useEffect, useRef } from "react";

const scriptUrl = "https://pl31604671.profitableratecpmnetwork.com/c6894ccebeef34842584c4096ed74f30/invoke.js";
const containerId = "container-c6894ccebeef34842584c4096ed74f30";

export function NativeAdClient() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const container = document.createElement("div");
    container.id = containerId;
    host.appendChild(container);

    const script = document.createElement("script");
    script.setAttribute("async", "async");
    script.setAttribute("data-cfasync", "false");
    script.src = scriptUrl;
    host.insertBefore(script, container);

    return () => {
      host.replaceChildren();
    };
  }, []);

  return <div ref={hostRef} data-native-ad-slot />;
}
