import React, { useState, useEffect, Fragment } from "react"
import Modal from '../../components/UI/Modal/Modal'
const WithErrorHoc = (WrappedComponent, axiosObj) => {
    const WrappedCom = (props) => {
        const [reqError, setError] = useState(false)
        const reqAxios = axiosObj.interceptors.request.use((config) => {
            setError(false)
            return config
        },
            (error) => {
                setError(error.message)
                return Promise.reject(error)
            })

        const resAxios = axiosObj.interceptors.response.use((res) => res, (error) => {
            setError(error.message)
            return Promise.reject(error)
        })

        useEffect(() => {
            return () => {
                axiosObj.interceptors.request.eject(reqAxios)
                axiosObj.interceptors.response.eject(resAxios)
            }

        }, [reqAxios, resAxios])
        const hideModal = () => {
            setError(false)
        }

        return (
            <Fragment>
                {reqError ? <Modal closePopup={hideModal} >{reqError}</Modal> : null}
                <WrappedComponent {...props} />
            </Fragment>
        )

    }
    return WrappedCom
}

export default WithErrorHoc