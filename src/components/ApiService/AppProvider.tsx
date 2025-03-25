import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { createContext, useContext, useState, ReactNode } from 'react';
// import Alert from './Alert';

interface AppContextType {
  appContextValue: {
    value: boolean;
    updateValue: (newValue: boolean) => void;
  };
  PostApi: (method: string, url: string, data?: any, headers?: any) => Promise<AxiosResponse | undefined>;
  GetApi: (method: string, url: string, params?: any, headers?: any) => Promise<AxiosResponse | undefined>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  
  const [value, setValue] = useState<boolean>(false);


  const updateValue = (newValue: boolean) => {
    setValue(newValue);
  };

  const appContextValue = {
    value,
    updateValue,
  };

  const baseURL = "https://dummyjson.com/"; 

  const PostApi = async (method: string, url: string, data?: any, headers?: any): Promise<AxiosResponse | undefined> => {
    updateValue(true);

    try {
      const response = await axios({
        method: method,
        url: baseURL + url,
        data: data,
        headers: headers
      });

      const authorizationHeader = response.headers['authorization'];

      if (authorizationHeader) {
        const [bearer, token] = authorizationHeader.split(' ');
        if (bearer === 'Bearer') {
          localStorage.setItem("token", token);
        }
      }
      updateValue(false);
      return response;
    } catch (error: any) {
      if (error.response?.data?.status === 401) {
      
        return;
      }
      updateValue(false);
      throw error;
    }
  };

  const GetApi = async (method: string, url: string, params?: any, headers?: any): Promise<AxiosResponse | undefined> => {
    updateValue(true);
    try {
      const response = await axios({
        method: method,
        url: baseURL + url,
        params: params,
        headers: headers,
      });

      const authorizationHeader = response.headers['authorization'];

      if (authorizationHeader) {
        const [bearer, token] = authorizationHeader.split(' ');
        if (bearer === 'Bearer') {
          localStorage.setItem("token", token);
        }
      }

      updateValue(false);
      return response;

    } catch (error: any) {
      if (error.response?.data?.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return;
      }
      updateValue(false);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ appContextValue, PostApi, GetApi }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};