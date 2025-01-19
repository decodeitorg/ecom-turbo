import { Outlet, useNavigate } from "react-router-dom";
import {
    $token,
    $userData,
    $isAuthenticated,
    $userLoading,
    $userIsError,
    $userErrorMessage,
} from "@/store/user";
import { useStore } from "@nanostores/react";

const RequireAuth = () => {
    const token = useStore($token);
    const userData = useStore($userData);
    const isAuthenticated = useStore($isAuthenticated);
    const userLoading = useStore($userLoading);
    const userIsError = useStore($userIsError);
    const userErrorMessage = useStore($userErrorMessage);

    const navigate = useNavigate();

    let content = null;

    if (userLoading) {
        content = <div>Loading...</div>;
    } else if (
        !isAuthenticated &&
        userData?.role !== "Admin" &&
        userData?.role !== "SuperAdmin"
    ) {
        // window.location.href = '/admin/login?msg="Un-Previleged Access"';
        navigate("/admin/login?msg=Un-Previleged Access");
    } else {
        content = <Outlet />;
    }

    return <Outlet />;
};

export default RequireAuth;
