import axios from 'axios'
import React from 'react'


const axiosPublic =  axios.create({
    baseURL: 'http://fatherserver.onrender.com',
  })

const useAxiosPublic = () => {
  return axiosPublic
}

export default useAxiosPublic;

  