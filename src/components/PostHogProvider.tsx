"use client"
import { useEffect } from "react"
import posthog from "posthog-js"

const POSTHOG_KEY = "phc_xD3onj3wsKVZ99ndXygozgHP9k6LQux5QfkxnFCwR98g"
const POSTHOG_HOST = "https://us.i.posthog.com"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug()
      },
    })
  }, [])

  return <>{children}</>
}

export { posthog }
