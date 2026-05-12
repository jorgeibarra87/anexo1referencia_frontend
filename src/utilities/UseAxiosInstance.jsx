import React from 'react'
import { useSelector } from 'react-redux'
import { RUTA_BACK_PRODUCCION } from '../types';
import axios from 'axios';

const UseAxiosInstance = () => {

    const stateLogin = useSelector(state => state.login);
    const token = stateLogin.token;

    const axiosInstance = axios.create({
        baseURL: `${RUTA_BACK_PRODUCCION}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
  
    return axiosInstance;
};

export default UseAxiosInstance;