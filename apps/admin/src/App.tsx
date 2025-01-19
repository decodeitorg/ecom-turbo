import Categories from "@/pages/Category/Categories.tsx";
import Specification from "@/pages/Category/Specificaion.tsx";
import Dashboard from "@/pages/DashBoard.tsx";
import LandingPage from "@/pages/frontend/LandingPage.tsx";
import AddProduct from "@/pages/products/AddProduct.tsx";
import Products from "@/pages/products/Products.tsx";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    BrowserRouter,
    Link,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";

import RequireAuth from "./components/Auth.tsx";
import "@/styles/globals.css";
import Layout from "./layout/LayoutAdmin.tsx";
import Attributes from "./pages/Category/Attributes.tsx";
import Profile from "./pages/Profile.tsx";
import LegalPage from "./pages/frontend/LegalPage.tsx";
import SiteSettings from "./pages/frontend/SiteSettings.tsx";
import Employees from "./pages/superadmin/Employees.tsx";
import Settings from "./pages/superadmin/Settings.tsx";
import Users from "./pages/superadmin/Users.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Order from "./pages/Order.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { LoginForm } from "./pages/Login.tsx";

export default function App() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <ErrorBoundary>
                    <BrowserRouter>
                        <Routes>
                            <Route element={<RequireAuth />}>
                                <Route element={<Layout />}>
                                    <Route
                                        path="/admin"
                                        index
                                        element={<Dashboard />}
                                    />
                                    <Route
                                        path="/admin/products/"
                                        element={<Products />}
                                    />
                                    <Route
                                        path="/admin/products/add-product"
                                        element={<AddProduct />}
                                    />
                                    <Route
                                        path="/admin/products/edit-product/:_id?"
                                        element={<AddProduct />}
                                    />
                                    <Route
                                        path="/admin/products/attributes"
                                        element={<Attributes />}
                                    />
                                    <Route
                                        path="/admin/products/categories/:_id?"
                                        element={<Categories />}
                                    />
                                    <Route
                                        path="/admin/products/categories/specification/:_id"
                                        element={<Specification />}
                                    />

                                    <Route
                                        path="/admin/orders/:orderStatus?"
                                        element={<Order />}
                                    />
                                    <Route
                                        path="/admin/landingpage"
                                        element={<LandingPage />}
                                    />
                                    <Route
                                        path="/admin/landingpage/site-setting"
                                        element={<SiteSettings />}
                                    />
                                    <Route
                                        path="/admin/landingpage/legal-setting"
                                        element={<LegalPage />}
                                    />
                                    <Route
                                        path="/admin/profile"
                                        element={<Profile />}
                                    />
                                    {/* superAdmin  */}
                                    <Route
                                        path="/admin/users"
                                        element={<Users />}
                                    />
                                    <Route
                                        path="/admin/employees"
                                        element={<Employees />}
                                    />
                                    <Route
                                        path="/admin/settings"
                                        element={<Settings />}
                                    />
                                </Route>
                            </Route>
                            <Route
                                path="/admin/login"
                                element={<LoginForm />}
                            />
                            <Route path="*" element={<NoMatch />} />
                        </Routes>
                    </BrowserRouter>
                    <ToastContainer />
                </ErrorBoundary>
            </ThemeProvider>
        </React.Suspense>
    );
}

function NoMatch() {
    return (
        <div>
            <h3>404 - Not Found</h3>
            <Link to="/">Go Home</Link>
        </div>
    );
}
