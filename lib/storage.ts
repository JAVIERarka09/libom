import { INITIAL_CARS, INITIAL_TRANSACTIONS, INITIAL_USERS } from './initialData';
import { Car, Transaction, User } from './types';

const STORAGE_KEYS = {
  CARS: 'autoluxe_cars_v1',
  USERS: 'autoluxe_users_v1',
  TRANSACTIONS: 'autoluxe_transactions_v1',
  CURRENT_USER: 'autoluxe_current_user_v1',
};

const isBrowser = typeof window !== 'undefined';

export const getCars = (): Car[] => {
  if (!isBrowser) return INITIAL_CARS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CARS);
    if (!data) {
      saveCars(INITIAL_CARS);
      return INITIAL_CARS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CARS;
  }
};

export const saveCars = (cars: Car[]): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
  } catch (err) {
    console.error('Failed to save cars', err);
  }
};

export const getUsers = (): User[] => {
  if (!isBrowser) return INITIAL_USERS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      saveUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }
    const parsed: Array<User & { password?: string }> = JSON.parse(data);
    return parsed.map((u) => {
      if (!u.password) {
        if (u.role === 'admin') u.password = 'admin';
        else if (u.role === 'petugas') u.password = 'petugas';
        else u.password = '123';
      }
      return u;
    });
  } catch {
    return INITIAL_USERS;
  }
};

export const saveUsers = (users: User[]): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
};

export const getTransactions = (): Transaction[] => {
  if (!isBrowser) return INITIAL_TRANSACTIONS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!data) {
      saveTransactions(INITIAL_TRANSACTIONS);
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions', err);
  }
};

export const getCurrentUser = (): User | null => {
  if (!isBrowser) return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const saveCurrentUser = (user: User | null): void => {
  if (!isBrowser) return;
  try {
    if (user === null) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to save current user', err);
  }
};

export const resetAllDataToDefault = (): void => {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(INITIAL_CARS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};
