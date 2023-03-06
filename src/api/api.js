// axios的二次封装
import axios from "axios";

// 创建一个axios实例
const api = axios.create({
    // 请求地址中公共部分
    // baseURL: 'http://localhost:8080/',
    // baseURL: 'https://leisir-note-image.oss-cn-hangzhou.aliyuncs.com/data',
    // baseURL: process.env.NODE_ENV === "production"
    //     ? "https://leisir16.github.io/"
    //     : "http://localhost:8080/",
    baseURL: process.env.NODE_ENV === "production"
        ? "https://leisir-note-image.oss-cn-hangzhou.aliyuncs.com/"
        : "http://localhost:8080/",
    // 请求超时时间
    timeout: 5000,
    // 是否可以带凭证，比如cookie或session
    withCredentials: true,
    headers: {'Cache-Control': 'no-cache', "Content-type": "application/json", 'Access-Control-Allow-Origin': '*'}
})

/**
 * 设置请求拦截器，在发请求之前可以进行一些处理
 */
api.interceptors.request.use(config => {
    return config
}, err => {
    // 请求失败
    return Promise.reject(err)
})
/**
 * 响应拦截器
 */
api.interceptors.response.use(res => {
        return res.data
    }, err => {
        return Promise.reject(err)
    }
)

export default api
