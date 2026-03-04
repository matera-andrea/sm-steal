"use client";

import Script from "next/script";

export default function LegalBlinkBanner() {
  return (
    <>
      <Script
        src="https://app.legalblink.it/api/scripts/lb_cs.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error - lb_cs is defined by LegalBlink external script
          if (typeof window.lb_cs === "function") {
            // @ts-expect-error - lb_cs is defined by LegalBlink external script
            window.lb_cs("69a736ff3499c800239e01b6");
          }
        }}
      />
    </>
  );
}
