import axios from 'axios'
import React from 'react'


const axiosPublic =  axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://fatherserver.onrender.com',
  })

const useAxiosPublic = () => {
  return axiosPublic
}

export { axiosPublic }
export default useAxiosPublic;

  