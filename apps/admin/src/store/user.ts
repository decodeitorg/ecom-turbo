import { persistentAtom } from "@nanostores/persistent";
import { atom, batched, task } from "nanostores";
import { fetchData, postData } from "../lib/fetch";
import { TokenType } from "@/lib/types";
import { login, logOut } from "@/lib/function";

type UserState = {
    userData: TokenType | null;
    isAuthenticated: boolean;
    userLoading: boolean;
    userIsError: boolean;
    userErrorMessage: string | null;
};

const $token = persistentAtom<string>("token", "");
const $isAuthenticated = atom<boolean>(false);
const $userLoading = atom<boolean>(true);
const $userIsError = atom<boolean>(false);
const $userErrorMessage = atom<string | null>(null);

const $refetch = atom<number>(0);
const refetchUser = () => $refetch.set($refetch.get() + 1);

const $userData = batched<
    UserState["userData"],
    [typeof $token, typeof $refetch]
>([$token, $refetch], (token) =>
    task(async () => {
        $userLoading.set(true);
        if (token) {
            try {
                const data = await fetchData("/api/auth/me");

                if (data && "email" in data) {
                    $isAuthenticated.set(true);
                    $userLoading.set(false);
                    return data;
                } else {
                    $isAuthenticated.set(false);
                    $userLoading.set(false);
                    return null;
                }
            } catch (error: unknown) {
                $userIsError.set(true);
                if (error instanceof Error) {
                    $userErrorMessage.set(error.message);
                } else {
                    $userErrorMessage.set("An unknown error occurred");
                }
                return null;
            } finally {
                $userLoading.set(false);
            }
        } else {
            $isAuthenticated.set(false);
            $userLoading.set(false);
            return null;
        }
    })
);

const logOutTheUserCompletely = async () => {
    //$token is removed in logOut function because it is a persistentAtom
    // persistentAtom use localStorage to store the value
    await logOut();
};

/*
This function updates the user profile.
After updating the profile, it re-login the user and set the token.
*/
interface PasswordData {
    newPassword: string;
}

interface ProfilePayload {
    type: "profile" | "password";
    data: PasswordData | Record<string, unknown>;
}

async function updateUserProfile(payload: ProfilePayload) {
    try {
        await postData("/api/profile", payload);

        if (payload.type === "profile") {
            refetchUser();
        }
        if (payload.type === "password") {
            const data = payload.data;
            const user = $userData.get();
            if (!user) {
                throw new Error("User not found");
            }
            const { token } = (await login(user.email, data.newPassword)) as {
                token: string;
            };
            $token.set(token);
        }
        return true;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}

export {
    $token,
    $userData,
    $isAuthenticated,
    $userLoading,
    $userIsError,
    $userErrorMessage,
};
export { login, logOutTheUserCompletely, updateUserProfile };
