"use client";

import Script from "next/script";

export default function LegalBlinkBanner() {
  return (
    <>
      <Script
        src="https://app.legalblink.it/api/scripts/lb_cs.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          if (typeof window.lb_cs === "function") {
            // @ts-ignore
            window.lb_cs("69a736ff3499c800239e01b6");
          }
        }}
      />
    </>
  );
}
