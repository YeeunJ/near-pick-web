# Changelog

All notable changes to the near-pick-web project will be documented in this file.

## [2026-02-28] - Phase 5 Design System Complete

### Added
- **Next.js 15 App Router** project structure with TypeScript
- **15 routes** across 4 user groups (Auth, Consumer, Merchant, Admin)
- **7 common components**: ConsumerHeader, BottomNav, Sidebars (Merchant/Admin), PageHeader, EmptyState, StatusBadge, ProductCard
- **18 TypeScript types** synced with backend DTOs (17 design + 1 added)
- **4 utility functions**: cn, formatPrice, formatDate, formatDateTime (3 design + 1 added)
- **46 mock data items** across 4 datasets (products, reservations, users, dashboard)
- **Tailwind CSS v4** with oklch color format and @theme inline
- **shadcn/ui v3** (new-york style) with 13 base components installed
- **Clean Architecture** layers: app (routes), components (ui/layout/features), lib (utils/mock), types (api)
- **Dark mode support** CSS variables pre-defined in globals.css
- **Sonner Toast** integration for user feedback
- **Responsive design** for mobile (375px), tablet (768px), desktop (1280px)

### Changed
- **CSS color format**: RGB variables → oklch (Tailwind v4 standard)
- **Font strategy**: Pretendard (design) → Geist Sans (v4 compatibility)
- **Route structure**: merchant/admin routes nested for URL clarity (/merchant/*, /admin/*)
- **Signup/Product form**: shadcn RadioGroup → custom toggle buttons (UX improvement)
- **Reservation tabs**: PENDING/CONFIRMED/CANCELLED → ALL/PENDING/CONFIRMED/CANCELLED (feature enhancement)

### Fixed
- Tailwind v4 CSS variable compatibility
- Route naming for merchant and admin dashboards
- Type safety across all pages and components

### Not Included (Deferred to Phase 6)
- API integration (using mock data only)
- Authentication state management
- Geolocation integration
- Real-time features

## Version Summary

| Phase | Feature | Status | Gap Match | Files | Components | Types |
|-------|---------|--------|-----------|-------|------------|-------|
| Phase 5 | Design System | ✅ Complete | 95% | 40+ | 7 common + 30+ page | 18 |

---

**Project**: near-pick-web
**Date**: 2026-02-28
**Type**: Design System - UI Foundation
