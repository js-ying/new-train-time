# 新-台鐵時刻表

查詢台鐵、高鐵、桃園機場捷運時刻表與全台公車動態，簡單又快速。

[網站](https://traintime.jsy.tw/) | [特色介紹](https://traintime.jsy.tw/features) | [更新公告](https://traintime.jsy.tw/updates)

## 功能

- **三鐵時刻查詢**：台鐵、高鐵、桃園機場捷運起訖站時刻，含票價、即時誤點與訂票跳轉
- **台鐵轉乘**：直達之外列出轉乘方案，可依轉乘站篩選
- **單站時刻表**：查詢單一車站的北上 / 南下班次
- **全台公車動態**：市區公車、公路客運、台灣好行的路線與站牌即時到站
- **營運通阻**：三鐵即時營運狀態與公告
- **個人化**：Google 登入後可收藏常用路線、保留歷史查詢
- 支援繁體中文 / 英文、深色模式，可安裝為 PWA

## 技術

Next.js 14（Pages Router）、React 18、TypeScript、Tailwind CSS 3、HeroUI、next-i18next、Firebase Authentication。

本 repo 僅包含前端。

## 資料來源

時刻、票價、即時動態等交通資料取自交通部 TDX（運輸資料流通服務平台）。實際營運資訊以各運輸單位官方公告為準。

## 授權

著作權所有 (c) 2023 年起 JS Ying，保留一切權利。

---

# NEW - Taiwan Railway Timetable

Easily check Taiwan Railway, Taiwan High Speed Rail, and Taoyuan Airport MRT timetables, plus live bus arrivals across Taiwan.

[Website](https://traintime.jsy.tw/en) | [Feature Intro](https://traintime.jsy.tw/en/features) | [Update Announcements](https://traintime.jsy.tw/en/updates)

## Features

- **Rail timetables**: Taiwan Railway, High Speed Rail, and Taoyuan Airport MRT, with fares, live delays, and booking redirection
- **Taiwan Railway transfers**: transfer options beyond direct trains, filterable by transfer station
- **Station timetables**: northbound / southbound departures for a single station
- **Live bus arrivals**: city buses, intercity buses, and Taiwan Tourist Shuttle routes and stops across Taiwan
- **Service status**: live operation status and notices for all three rail systems
- **Personalization**: sign in with Google to save favorite routes and search history
- Traditional Chinese / English, dark mode, installable as a PWA

## Tech stack

Next.js 14 (Pages Router), React 18, TypeScript, Tailwind CSS 3, HeroUI, next-i18next, Firebase Authentication.

This repository contains the frontend only. The backend is not public.

## Data source

Transit data (timetables, fares, live status) is provided by the Transport Data eXchange (TDX), Ministry of Transportation and Communications, Taiwan. Official announcements from each operator take precedence.

## License

Copyright © 2023-present JS Ying. All rights reserved.
