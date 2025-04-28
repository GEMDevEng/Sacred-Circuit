import React from 'react';

// Mock BrowserRouter
export const BrowserRouter = ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Mock Link
export const Link = ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }) => (
  <a href={to} {...props}>
    {children}
  </a>
);

// Mock useNavigate
export const useNavigate = () => jest.fn();

// Mock useLocation
export const useLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
});

// Mock useParams
export const useParams = () => ({});

// Mock Routes and Route
export const Routes = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const Route = ({ element }: { path: string; element: React.ReactNode }) => <>{element}</>;

// Mock Navigate
export const Navigate = ({ to }: { to: string }) => <div>Navigating to {to}</div>;

// Mock Outlet
export const Outlet = () => <div>Outlet</div>;

// Mock useRoutes
export const useRoutes = () => null;
