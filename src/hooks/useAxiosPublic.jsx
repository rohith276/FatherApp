import axios from 'axios'
import React from 'react'


const axiosPublic =  axios.create({
    baseURL: 'https://fatherserver.onrender.com',
  })

const useAxiosPublic = () => {
  return axiosPublic
}

export default useAxiosPublic;

  