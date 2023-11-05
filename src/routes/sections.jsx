import PropTypes from 'prop-types';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

// Lazy-loaded page components
const LazyIndexPage = lazy(() => import('src/pages/app'));
const LazyUserPage = lazy(() => import('src/pages/user'));
const LazyLoginPage = lazy(() => import('src/pages/login'));
const LazyProductsPage = lazy(() => import('src/pages/products'));
const LazyBlogPage = lazy(() => import('src/pages/blog'));
const LazyPage404 = lazy(() => import('src/pages/page-not-found'));
const LazyAccProvider = lazy(() => import('src/pages/provider/accprovider/acc-provider'))
const LazyListProvider = lazy(() => import('src/pages/provider/listprovider/list-provider'))
const LazyReportProvider = lazy(() => import('src/pages/provider/reportprovider/report-provider'))
const LazyListReview = lazy(() => import('src/pages/review/list-review/ListReview'))

const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token; // Return true if a token exists, false otherwise
};

const ProtectedRoute = ({ element }) => {
  if (isAuthenticated()) {
    return element;
  }

  return <Navigate to="/login" replace />;
};
ProtectedRoute.propTypes = {
  element: PropTypes.node.isRequired,
};

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <ProtectedRoute element={<LazyIndexPage />} />, index: true },
        { path: 'user', element: <ProtectedRoute element={<LazyUserPage />} /> },
        { path: 'products', element: <LazyProductsPage /> },
        { path: 'blog', element: <LazyBlogPage /> },
        { path: 'acc-provider', element: <ProtectedRoute element={<LazyAccProvider />} /> },
        { path: 'list-provider', element: <ProtectedRoute element={<LazyListProvider />} /> },
        { path: 'report-provider', element: <ProtectedRoute element={<LazyReportProvider />} /> },
        { path: 'list-review', element: <ProtectedRoute element={<LazyListReview />} /> },

        {
          // Handle empty path or unknown paths
          element: <ProtectedRoute element={<div>Page not found</div>} />,
        },
      ],
    },
    {
      path: 'login',
      element: <LazyLoginPage />,
    },
    {
      path: '404',
      element: <LazyPage404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
