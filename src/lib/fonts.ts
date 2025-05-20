import {
  Geist,
  Geist_Mono,
  Inter,
  Unbounded,
} from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInter.variable,
  unbounded.variable,
)
