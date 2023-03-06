import api from "@/api/api";

/**
 * 判断分布的实验数据
 * @param isPractice    是否是练习数据
 * @return {Promise<axios.AxiosResponse<any>>}
 */
export async function getSSIDistributionDataList(isPractice) {
    let url = 'distrubution.json'
    if (isPractice) {
        url = 'distrubution_practice.json'
    }
    return await api({
        // url: `/glyph_experiment_new/${url}`,
        url: `/${url}`,
        method: 'get'
    })
}

/**
 * 获取微小差异判断数据
 * @param isPractice    是否是练习数据
 * @return {Promise<axios.AxiosResponse<any>>}
 */
export async function getSSISmallDifferDataList(isPractice) {
    let url = 'small_differ.json'
    if (isPractice) {
        url = 'small_differ_practice.json'
    }
    return await api({
        // url: `/glyph_experiment_new/${url}`,
        url: `/${url}`,
        method: 'get'
    })
}