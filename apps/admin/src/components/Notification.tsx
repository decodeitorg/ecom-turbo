import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";
import { getApiUrl } from "@/lib/utils";

const VAPID_PUBLIC_KEY =
    "BND9zrxn5XSECPyO76SKa4Aep5u4plruaxNt67Rq8wIWn0XKiLRw6MDep0cYzTRI44WTp3EA-rs2Y-_jf-xFy9o";

const NotificationToggle = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPermissionDenied, setIsPermissionDenied] = useState(false);

    const checkNotificationStatus = async () => {
        setIsLoading(true);
        try {
            if (!("serviceWorker" in navigator)) {
                throw new Error(
                    "Service workers are not supported in this browser."
                );
            }

            // Check if service workers are supported
            if (!navigator.serviceWorker) {
                throw new Error("Service Worker API not supported");
            }

            // Register the service worker
            const registration = await navigator.serviceWorker.register(
                "/admin/service-worker.js",
                {
                    scope: "/admin/",
                }
            );

            // Wait for the service worker to be ready
            const activeRegistration = await navigator.serviceWorker.ready;

            if (!activeRegistration.active) {
                throw new Error("Service Worker not active");
            }

            const subscription =
                await registration.pushManager.getSubscription();
            setIsEnabled(!!subscription);
        } catch (error) {
            console.error("Error checking notification status:", error);
            toast.error("Failed to check notification status.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkNotificationStatus();
    }, []);

    const requestNotificationPermission = async () => {
        if (Notification.permission === "denied") {
            setIsPermissionDenied(true);
            toast.error("Notifications are blocked by the browser.");
            return false;
        }

        if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                setIsPermissionDenied(true);
                toast.error("Notifications are blocked by the user.");
                return false;
            }
        }
        return true;
    };

    const subscribeToPushNotifications = async () => {
        try {
            if (!("PushManager" in window)) {
                throw new Error(
                    "Push notifications are not supported in this browser"
                );
            }

            const registration = await navigator.serviceWorker.ready;
            console.log("Service Worker ready, attempting to subscribe...");

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: VAPID_PUBLIC_KEY,
            });
            const response = await fetch(`${getApiUrl()}/api/notification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subscription }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(
                    `Server error (${response.status}): ${errorBody}`
                );
            }

            setIsEnabled(true);
            toast.success("Notifications enabled successfully.");
        } catch (error) {
            console.error("Error subscribing to push notifications:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            toast.error(`Failed to enable notifications: ${errorMessage}`);
        }
    };

    const unsubscribeFromPushNotifications = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            console.log("Service Worker ready, attempting to unsubscribe...");

            const subscription =
                await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();

                const response = await fetch(
                    `${getApiUrl()}/api/notification/unsubscribe`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            endpoint: subscription.endpoint,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setIsEnabled(false);
                toast.success("Notifications disabled successfully.");
            }
        } catch (error) {
            console.error(
                "Error unsubscribing from push notifications:",
                error
            );
            toast.error("Failed to disable notifications.");
        }
    };

    const handleToggle = async () => {
        if (isLoading || isPermissionDenied) return;

        setIsLoading(true);
        try {
            if (isEnabled) {
                await unsubscribeFromPushNotifications();
            } else {
                const hasPermission = await requestNotificationPermission();
                if (hasPermission) {
                    await subscribeToPushNotifications();
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Switch
                checked={isEnabled}
                onCheckedChange={handleToggle}
                disabled={isLoading || isPermissionDenied}
            />
            {isLoading ? (
                <LoaderCircle className="animate-spin" />
            ) : isPermissionDenied ? (
                <span className="text-red-500">Notifications blocked</span>
            ) : isEnabled ? (
                <span className="text-green-500">Notifications enabled</span>
            ) : (
                <span>Enable notifications</span>
            )}
        </div>
    );
};

export default NotificationToggle;
