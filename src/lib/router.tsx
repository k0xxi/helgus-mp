import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProductPage } from '@/components/ProductPage'
import { DataModelPage } from '@/components/DataModelPage'
import { DesignPage } from '@/components/DesignPage'
import { SectionsPage } from '@/components/SectionsPage'
import { SectionPage } from '@/components/SectionPage'
import { ScreenDesignPage, ScreenDesignFullscreen } from '@/components/ScreenDesignPage'
import { ShellDesignPage, ShellDesignFullscreen } from '@/components/ShellDesignPage'
import { ExportPage } from '@/components/ExportPage'
import { RootLayout } from '@/lib/RootLayout'

// Marketplace imports
import { MarketplaceLayout } from '@/marketplace/layout/MarketplaceLayout'
import {
  HomePage as MarketplaceHomePage,
  SearchPage,
  AuthPage,
  AuthCallbackPage,
  AuthConfirmPage,
  PasswordResetPage,
  FavoritesPage,
  MessagesPage,
  ProfilePage,
  ProfileSettingsPage,
  SellerVerificationPage,
  PublicProfilePage,
  ChangePasswordPage,
  SellPage,
  NotificationsPage,
  ProductPage as MarketplaceProductPage,
  SellerDashboard,
  MyListingsPage,
  MyPurchasesPage,
  MySalesPage,
  NotFoundPage,
} from '@/marketplace/pages'

// Marketplace layout wrapper (AuthProvider is now in main.tsx)
function MarketplaceWrapper() {
  return <MarketplaceLayout />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MarketplaceWrapper />,
    children: [
      {
        index: true,
        element: <MarketplaceHomePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: 'auth/callback',
        element: <AuthCallbackPage />,
      },
      {
        path: 'auth/confirm',
        element: <AuthConfirmPage />,
      },
      {
        path: 'auth/reset-password',
        element: <PasswordResetPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: 'messages',
        element: <MessagesPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'seller-dashboard',
        element: <SellerDashboard />,
      },
      {
        path: 'profile/settings',
        element: <ProfileSettingsPage />,
      },
      {
        path: 'profile/verification',
        element: <SellerVerificationPage />,
      },
      {
        path: 'profile/change-password',
        element: <ChangePasswordPage />,
      },
      {
        path: 'user/:userId',
        element: <PublicProfilePage />,
      },
      {
        path: 'sell',
        element: <SellPage />,
      },
      {
        path: 'my-listings',
        element: <MyListingsPage />,
      },
      {
        path: 'my-purchases',
        element: <MyPurchasesPage />,
      },
      {
        path: 'my-sales',
        element: <MySalesPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'product/:productId',
        element: <MarketplaceProductPage />,
      },
    ],
  },
  // Show 404 for old /marketplace/* paths
  {
    path: 'marketplace',
    children: [
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: 'design-os',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ProductPage />,
      },
      {
        path: 'data-model',
        element: <DataModelPage />,
      },
      {
        path: 'design',
        element: <DesignPage />,
      },
      {
        path: 'sections',
        element: <SectionsPage />,
      },
      {
        path: 'sections/:sectionId',
        element: <SectionPage />,
      },
      {
        path: 'sections/:sectionId/screen-designs/:screenDesignName',
        element: <ScreenDesignPage />,
      },
      {
        path: 'sections/:sectionId/screen-designs/:screenDesignName/fullscreen',
        element: <ScreenDesignFullscreen />,
      },
      {
        path: 'shell/design',
        element: <ShellDesignPage />,
      },
      {
        path: 'shell/design/fullscreen',
        element: <ShellDesignFullscreen />,
      },
      {
        path: 'export',
        element: <ExportPage />,
      },
    ],
  },
  // Catch-all for 404 Not Found
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
