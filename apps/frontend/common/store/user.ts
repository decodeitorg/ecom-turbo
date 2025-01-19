import { persistentAtom } from '@nanostores/persistent';
import { atom, batched, task } from 'nanostores';
import { fetchData, postData } from '../lib/fetch';
import { TokenType } from '@/common/types';
import { login, logOut } from '@/common/function';
import {
  payloadProfileUpdatePayloadType,
  UserPasswordType,
  UserProfileDataType,
} from '@/pages/api/profile';

type UserState = {
  userData: TokenType | null;
  isAuthenticated: boolean;
  userLoading: boolean;
  userIsError: boolean;
  userErrorMessage: string | null;
};

const $token = persistentAtom('token', '');
const $isAuthenticated = atom<boolean>(false);
const $userLoading = atom<boolean>(true);
const $userIsError = atom<boolean>(false);
const $userErrorMessage = atom<string | null>(null);

const $refetch = atom<number>(0);
const refetchUser = () => $refetch.set($refetch.get() + 1);

const $userData = batched<UserState['userData'], null>(
  [$token, $refetch],
  (token) =>
    task(async () => {
      $userLoading.set(true);
      if (token) {
        try {
          let data = await fetchData('/api/auth/me');

          if ('email' in data) {
            $isAuthenticated.set(true);
            $userLoading.set(false);
            return data;
          } else {
            $isAuthenticated.set(false);
            $userLoading.set(false);
          }
        } catch (error) {
          $userIsError.set(true);
          $userErrorMessage.set(error.message);
        } finally {
          $userLoading.set(false);
        }
      } else {
        $isAuthenticated.set(false);
        $userLoading.set(false);
      }
    }),
);

let logOutTheUserCompletely = async () => {
  //$token is removed in logOut function because it is a persistentAtom
  // persistentAtom use localStorage to store the value
  await logOut();
};

/*
This function updates the user profile.
After updating the profile, it re-login the user and set the token.
*/
async function updateUserProfile(payload: payloadProfileUpdatePayloadType) {
  try {
    await postData('/api/profile', payload);

    if (payload.type === 'profile') {
      refetchUser();
    }
    if (payload.type === 'password') {
      const data = payload.data as UserPasswordType;
      const { token } = await login($userData.get().email, data.newPassword);
      $token.set(token);
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
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
