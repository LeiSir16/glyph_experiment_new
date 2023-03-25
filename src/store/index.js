import Vue from "vue";
import Vuex from 'vuex'
import {getSSIAccuracyDifferDataList, getSSIDistributionDataList, getSSISmallDifferDataList} from "@/api";

Vue.use(Vuex)
const actions = {
    /**
     * 存储用户信息
     * @param context   store上下文
     * @param data  提交的数据
     */
    storeUserInfo(context, data) {
        const userInfo = {
            ...data
        }
        context.commit('StoreUserInfo', userInfo)
    },
    // 发送请求加载ssi数据
    loadSSIData(context) {
        // 分片请求数据
        let requestDataPromise = [
            [getSSIDistributionDataList(true), getSSIDistributionDataList(false)],
            [getSSISmallDifferDataList(true), getSSISmallDifferDataList(false)],
            [getSSIAccuracyDifferDataList(true), getSSIAccuracyDifferDataList(false)]
        ]
        let experimentData = {}
        Promise.all(requestDataPromise[0]).then(res => {
            experimentData['DistributionPractice'] = res[0]
            experimentData['Distribution'] = res[1]
            return Promise.all(requestDataPromise[1])
        }, err => {
            console.log(`分布数据请求失败${err.message}`)
        }).then(res => {
            experimentData['SmallDifferPractice'] = res[0]
            experimentData['SmallDiffer'] = res[1]
            return Promise.all(requestDataPromise[2])
        }, err => {
            console.log(`微小差异数据请求失败${err.message}`)
        }).then(res => {
            experimentData['AccuracyDifferPractice'] = res[0]
            experimentData['AccuracyDiffer'] = res[1]
        }, err => {
            console.log(`差值实验数据请求失败${err.message}`)
        }).finally(() => {
            // 提交给mutations存储数据
            context.commit('LoadSSIData', experimentData)
        })
    }
}
const mutations = {
    StoreUserInfo(state, data) {
        state.userInfo = data
    },
    LoadSSIData(state, data) {
        // 将data中的数据全都拷贝给state（合并操作）
        Object.assign(state, data)
        console.log(state)
    }
}
const state = {
    userInfo: {},
    ssiColorEncoding: [
        {
            id: 0,
            name: 'food',
            color: "#e41a1c",
            // nameCh: '营养不良指数'
            nameCh: 'Sufficient Food'
        },
        {
            id: 1,
            name: 'water',
            color: "#377eb8",
            // nameCh: '基础供水服务指数'
            nameCh: 'Sufficient Drinking Water'
        },
        {
            id: 2,
            name: 'safe',
            color: "#bf66eb",
            // nameCh: '基础卫生服务指数'
            nameCh: 'Safe Sanitation'
        },
        {
            id: 3,
            name: 'education',
            color: "#4daf4a",
            // nameCh: '教育指数'
            nameCh: 'Education'
        },
        {
            id: 4,
            name: 'life',
            color: "#984ea3",
            // nameCh: '健康生活指数'
            nameCh: 'Healthy Life'
        },
        {
            id: 5,
            name: 'gender',
            color: "#ff7f00",
            // nameCh: '性别平等指数'
            nameCh: 'Gender Equality'
        },
        {
            id: 6,
            name: 'income',
            color: "#fdbf6f",
            // nameCh: '收入分配指数'
            nameCh: 'Income Distribution'
        },
        {
            id: 7,
            name: 'population',
            color: "#a65628",
            // nameCh: '人口增长指数'
            nameCh: 'Population Growth'
        },
        {
            id: 8,
            name: 'governance',
            color: "#f781bf",
            // nameCh: '政府治理水平指数'
            nameCh: 'Good Governance'
        }
    ],
    ssiColorEncodingDemo: [
        {
            id: 0,
            name: 'food',
            color: "#e41a1c",
            nameCh: '营养不良指数'
        },
        {
            id: 1,
            name: 'water',
            color: "#377eb8",
            nameCh: '基础供水服务指数'
        },
        {
            id: 2,
            name: 'safe',
            color: "#bf66eb",
            nameCh: '基础卫生服务指数'
        },
        {
            id: 3,
            name: 'education',
            color: "#4daf4a",
            nameCh: '教育指数'
        },
        {
            id: 4,
            name: 'life',
            color: "#984ea3",
            nameCh: '健康生活指数'
        },
        {
            id: 5,
            name: 'gender',
            color: "#ff7f00",
            nameCh: '性别平等指数'
        },
        {
            id: 6,
            name: 'income',
            color: "#fdbf6f",
            nameCh: '收入分配指数'
        },
        {
            id: 7,
            name: 'population',
            color: "#a65628",
            nameCh: '人口增长指数'
        },
        {
            id: 8,
            name: 'governance',
            color: "#f781bf",
            nameCh: '政府治理水平指数'
        },
        {
            id: 9,
            name: 'health',
            color: "#63daac",
            nameCh: '健康'
        },
        {
            id: 10,
            name: 'biodiversity',
            color: "#e9baa5",
            nameCh: '生态'
        },
        {
            id: 11,
            name: 'renewable',
            color: "#a50f15",
            nameCh: '清洁能源'
        },
        {
            id: 12,
            name: 'GDP',
            color: "#a8f9a0",
            nameCh: '生产总值'
        },
        {
            id: 13,
            name: 'savings',
            color: "#a6cee3",
            nameCh: '节约'
        },
        {
            id: 14,
            name: 'greenhouse',
            color: "#8c96c6",
            nameCh: '绿色房屋'
        }
    ],
    // 可视化介绍部分展示的数据
    GlyphDesignData: {
        "index": "39f41a8d-b7e6-11ed-9002-c403a826ff34",
        "originIndex": "39eeeac7-b7e6-11ed-a078-c403a826ff34",
        "city": "Austria",
        "average": 7.233509167974615,
        "var": 0.7078247404108701,
        "std": 0.8413232080543541,
        "data": [
            {
                "name": "food",
                "value": 7.911105549650376
            },
            {
                "name": "water",
                "value": 7.87415577490147
            },
            {
                "name": "safe",
                "value": 7.829557502924567
            },
            {
                "name": "education",
                "value": 7.722513530595052
            },
            {
                "name": "life",
                "value": 7.517247857453378
            },
            {
                "name": "gender",
                "value": 6.129385773669878
            },
            {
                "name": "income",
                "value": 6.843201585267538
            },
            {
                "name": "population",
                "value": 5.466017626675156
            },
            {
                "name": "governance",
                "value": 7.808397310634129
            }
        ]
    }
}
const store = new Vuex.Store({
    actions,
    mutations,
    state
})
export default store