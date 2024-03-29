import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import reducer from '../reducers/productsReducer'
import { productsUrl as url } from '../utils/constants'

import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_PRODUCTS_BEGIN,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_ERROR,
  GET_SINGLE_PRODUCT_BEGIN,
  GET_SINGLE_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_ERROR
} from '../actions'

const initialState = {
  isSidebarOpen: false,

  productsLoading: false,
  productsError: false,
  products: [],
  featuredProducts: [],

  singleProductsLoading: false,
  singleProductsError: false,
  singleProduct: {}
}

const ProductsContext = React.createContext()

export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const openSidebar = () => {
    dispatch({ type: SIDEBAR_OPEN })
  }

  const closeSidebar = () => {
    dispatch({ type: SIDEBAR_CLOSE })
  }

  const fetchProducts = async (url) => {
    dispatch({ type: GET_PRODUCTS_BEGIN })

    try {
      const response = await axios.get(url)
      const products = response.data
      const featuredProducts = products.filter(product => product.featured === true)
      dispatch({ type: GET_PRODUCTS_SUCCESS, payload: { products, featuredProducts } })
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR })
    }
  }

  const setSingleProductLoading = () => {
    dispatch({ type: GET_SINGLE_PRODUCT_BEGIN })
  }

  const fetchSingleProduct = async (url) => {
    dispatch({ type: GET_SINGLE_PRODUCT_BEGIN })

    try {
      const response = await axios.get(url)
      const singleProduct = response.data
      dispatch({ type: GET_SINGLE_PRODUCT_SUCCESS, payload: { singleProduct } })
    } catch (error) {
      dispatch({ type: GET_SINGLE_PRODUCT_ERROR })
    }
  }

  useEffect(() => {
    fetchProducts(url)
  }, [])

  return <ProductsContext.Provider value={{
    ...state,
    openSidebar,
    closeSidebar,
    setSingleProductLoading,
    fetchSingleProduct
  }}
  >
    {children}
  </ProductsContext.Provider>
}

export const useProductsContext = () => {
  return useContext(ProductsContext)
}
