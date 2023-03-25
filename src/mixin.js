import {nanoid} from "nanoid";
import * as d3 from "d3";
import dayjs from "dayjs";
import {saveAs} from 'file-saver'
import lo from "vue";

export const publicFun = {
    data() {
        return {
            storageName: 'userInfo'
        }
    },
    methods: {
        /**
         * 生成一个唯一的id
         * @return {string} 生成的id
         */
        getId() {
            return nanoid()
        },
        /**
         * 根据给定的数组长度随机选择一个索引
         * @param length    数组的长度
         * @return {number} 随机生成的索引
         */
        randomIndex(length) {
            return Math.floor(Math.random() * length)
        },
        // 获取当前时间
        getCurrentTime() {
            let date = dayjs();
            let format = 'YYYY-MM-DD HH:mm:ss.SSS';
            return date.format(format);
        },
        // 根据type获取实验名称
        curExperiment(type) {
            if (type === 1) {
                return 'Distribution'
            } else if (type === 2) {
                return 'SmallDiffer'
            } else {
                return 'AccuracyDiffer'
            }
        },
        // 数据导出
        saveAsJson(data, experiment, success) {
            // 标明实验
            const e = this.curExperiment(experiment);
            let name = 'noName';
            const userInfo = this.$store.state.userInfo
            if (userInfo) {
                name = userInfo.name;
                const result = {
                    userInfo,
                    [e]: data
                }
                const prefix = userInfo.sId;
                let blob = new Blob([JSON.stringify(result)], {type: "application/json"});
                let fileName = prefix + "_" + e + "_" + name + ".json";
                saveAs(blob, fileName);
                success();
            }
        },
        /**
         * 获取数据中某个属性的值
         * @param data  一条数据
         * @param attr  属性名
         * @return {*}  属性值
         */
        getDataAttrNum(data, attr) {
            const d = data.data
            const a = d.filter(item => {
                return item.name === attr
            })
            return a[0].value
        }
    }
}

export const toolsFun = {
    methods: {
        /**
         * 角度转为弧度
         * @param angle 角度
         * @returns {number}弧度
         */
        angle_radian(angle) {
            return angle * Math.PI / 180;
        },
        /**
         * 基于弧长计算弧度
         * @param arc       弧长
         * @param radius    半径
         * @returns {number}角度
         */
        cal_angle(arc, radius) {
            return (arc / radius);
        },
        /**
         * 计算弧长
         * @param radian        弧度
         * @param radius        半径
         * @param proportion    比例
         * @returns {number}    弧长
         */
        cal_arc(radian, radius, proportion = 1) {
            return (radian * radius * proportion)
        },
        /**
         * 半径比例尺
         * @param radius        半径值0-10
         * @param maxRadius     最大半径
         * @param svgSize       svg尺寸
         * @returns {*}
         */
        radius_scale(radius, maxRadius, svgSize) {
            const r_s = d3.scaleLinear()
                .domain([0, maxRadius])
                .range([0, svgSize / 2]);
            return r_s(radius);
        },
        /**
         * 在某个角度范围随机生成条纹中心角度
         * @param start 开始角度
         * @param end   结束角度
         * @param angle 条纹的角度
         * @return {*}
         */
        randomAngle(start, end, angle) {
            return d3.randomUniform(start + angle / 2, end - angle / 2)()
        },
        /**
         * 获取一个扇形区域所能容纳的所有条纹
         * @param meta_data         扇形区域相关信息
         * @param interval_space    左右间隔比例，0.5表示间隔和条纹大小一致
         * @param former_space      前后间距 0-1 表示占环形区域的比例
         * @param proportion        条纹长度比例，最大弧长的比例
         * @param layer_num         层数
         * @returns {*[]}           所有条纹的数据
         */
        cal_total_strip(meta_data, interval_space, former_space, proportion, layer_num) {
            let strip_info = [];
            const radius_scale = d3.scaleLinear()
                .domain([0, 1])
                .range([0, meta_data.outer - meta_data.inner]);
            // 每一层条纹的宽度
            const strip_thickness = (meta_data.outer - meta_data.inner - radius_scale(former_space) * (layer_num - 1)) / layer_num;
            // 最大弧长
            const max_arc = this.cal_arc(meta_data.end - meta_data.start, meta_data.outer);
            // 最小弧长
            const min_arc = this.cal_arc(meta_data.end - meta_data.start, meta_data.inner);
            // 最大的比例
            const max_proportion = min_arc / max_arc;
            const real_proportion = Math.min(proportion, max_proportion);
            // 指定弧长长度
            const special_arc = real_proportion * max_arc;
            for (let i = 0; i < layer_num; i++) {
                // 条纹中心半径
                let radius = meta_data.inner + strip_thickness / 2 + (strip_thickness + radius_scale(former_space)) * i;
                // 指定弧长和半径下的圆心角弧度
                let radian = this.cal_angle(special_arc, radius);
                // 可容纳数量 一个条纹包括一个显示的条纹和一个不显示的
                let num = Math.floor((meta_data.end - meta_data.start) / (radian * 2))
                let remain = (meta_data.end - meta_data.start) - num * radian * 2;
                // 当interval_space=0.5时显示和不显示条纹的大小一样
                let left_space_radian = radian * 2 * interval_space;
                let real_radian = radian * 2 - left_space_radian;
                let real_start = meta_data.start + remain / 2 + left_space_radian / 2;
                // 判断剩下的区域能否容纳一个条纹
                if (remain >= real_radian) {
                    remain = remain - real_radian;
                    num++;
                    real_start = meta_data.start + remain / 2;
                }
                for (let j = 0; j < num; j++) {
                    let strip = {
                        layer: i,
                        index: j,
                        inner_r: radius - strip_thickness / 2,
                        outer_r: radius + strip_thickness / 2,
                        start: real_start + j * radian * 2,
                        end: real_start + j * radian * 2 + real_radian
                    }
                    strip_info.push(strip);
                }
            }
            return strip_info;
        },
        candidateIsValid(real_thickness, target_space, form_space, candidate, strips) {
            for (let i = 0; i < strips.length; i++) {
                const s = strips[i];
                const is_radius = (Math.abs(s.inner_r - candidate.inner_r) < (real_thickness + form_space));
                const s_center = s.start + s.radian / 2;
                const c_center = candidate.start + candidate.radian / 2;
                const is_radian = Math.abs(s_center - c_center) < (s.radian / 2 + candidate.radian / 2 + target_space);
                if (is_radius && is_radian) {
                    return false;
                }
            }
            return true;
        },
        generatePointsBasedOnPoissonDiskDistributions(meta_data, thickness, interval_space, form_space, proportion, num_samples_before_rejection = 30) {
            const radius_scale = d3.scaleLinear()
                .domain([0, 1])
                .range([0, meta_data.outer - meta_data.inner]);
            const real_thickness = radius_scale(thickness)
            // 前后间隔表示条纹粗细的比例
            const real_form_space = real_thickness * form_space;
            const radius_range = [meta_data.inner + real_thickness / 2, meta_data.outer - real_thickness / 2]
            // 最大弧长
            const max_arc = this.cal_arc(meta_data.end - meta_data.start, radius_range[1]);
            // 最小弧长
            const min_arc = this.cal_arc(meta_data.end - meta_data.start, radius_range[0]);
            // 最大的比例
            const max_proportion = min_arc / max_arc;
            const real_proportion = Math.min(proportion, max_proportion);
            // 指定弧长长度
            const special_arc = real_proportion * max_arc;
            // 随机生成第一个条纹
            const first_radius = d3.randomUniform(radius_range[0], radius_range[1])();
            const first_radian = this.cal_angle(special_arc, first_radius);
            // 对于边界来说不用考虑左右间距
            const first_center = this.randomAngle(meta_data.start, meta_data.end, first_radian);
            const first_strip = {
                index: 0,
                inner_r: first_radius - real_thickness / 2,
                outer_r: first_radius + real_thickness / 2,
                start: first_center - first_radian / 2,
                end: first_center + first_radian / 2,
                radian: first_radian
            }
            const strips = [first_strip];
            const spawn_strips = [first_strip];
            while (spawn_strips.length > 0) {
                const spawn_index = Math.floor(Math.random() * spawn_strips.length);
                const spawn_strip = spawn_strips[spawn_index];
                let candidate_accepted = false;
                for (let i = 0; i < num_samples_before_rejection; i++) {
                    let target_radius = d3.randomUniform(radius_range[0], radius_range[1])();
                    let target_radian = this.cal_angle(special_arc, target_radius);
                    let target_center = this.randomAngle(meta_data.start, meta_data.end, target_radian);
                    // 左右间距表示条纹角度的比例
                    let target_space = target_radian * interval_space;
                    let target_strip = {
                        index: strips.length,
                        inner_r: target_radius - real_thickness / 2,
                        outer_r: target_radius + real_thickness / 2,
                        start: target_center - target_radian / 2,
                        end: target_center + target_radian / 2,
                        radian: target_radian
                    }
                    if (this.candidateIsValid(real_thickness, target_space, real_form_space, target_strip, strips)) {
                        strips.push(target_strip);
                        spawn_strips.push(target_strip);
                        candidate_accepted = true;
                        break;
                    }
                }
                if (candidate_accepted === false) {
                    spawn_strips.splice(spawn_index, 1);
                }
            }
            return strips;
        }
    }
}
/**
 * 绘制glyph的方法
 * @type {{methods: {}}}
 */
export const drawGlyph = {
    data() {
        return {
            peaGlyphCondition: {
                glyphSize: 600,
                outlineThickness: 0.7,
                outlineOffset: 1,
                circleNum: 10,
                outlineDis: 0.5,
                centerOffset: 12,
                thickness: 0.5,
                circleValue: 1
            },
            stripeGlyphCondition: {
                glyphSize: 600,
                iRadius: 2.5,
                maxRadius: 10,
                sectorInterval: 3,
                svgEdgeDis: 0.1,
                outlineThickness: 0.7,
                divisionColor: 'black',
                divisionOpacity: 1,
                bgOpacity: 0,
                innerOpacity: 1,
                stripe_L_R: .1,
                stripe_B_A: .02,
                stripeProportion: .072,
                layerNum: 10,
                metaphorColor: '#C0C0C0',
                metaphorOpacity: .3,
                // 这个值现在传递的是编码的条纹的数量
                stripeNum: 40,
                isEncodingInfo: true,
                encodingInfoColor: 'red',
                stripeOpacity: 1,
                stripeValue: 0.25
            }
        }
    },
    mixins: [toolsFun],
    computed: {
        // 编码的颜色
        encodingColor() {
            if (this.experimentInfo.isExperimentB) {
                return this.$store.state.ssiColorEncoding
            }
        }
    },
    methods: {
        /**
         * 为glyph创建一个边框
         * @param glyphSvg  要附加到的svg
         * @param id    边框的id
         * @param size  边框的尺寸
         * @param position  边框的位置
         * @returns {*} 绘制的边框
         */
        createSvgOutline(glyphSvg, id, size, position) {
            let thickness = 1
            let width = size - thickness / 2
            let height = size - thickness / 2
            let rectComponent = glyphSvg.append('g')
                .attr('class', id + "_" + 'svg_outline')
            let rects = rectComponent.append('rect')
                .attr('x', position[0] - width / 2)
                .attr('y', position[1] - height / 2)
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'transparent')
                .attr('stroke', 'black')
                .attr('stroke-width', thickness)
                .attr('stroke-opacity', 0)
            return rectComponent
        },
        /**
         * 创建分界线
         * @param svgs          要附加的svg
         * @param id            该svg的唯一id
         * @param condition     控制条件{metaData,division_color,division_opacity,a_sector,sector_interval}
         * @param position      位置信息
         */
        createDivision(svgs, id, condition, position) {
            const uniformId = id + "_" + "glyph_division";
            const glyphDivision = svgs.append("g")
                .attr("class", uniformId)
                .attr("transform", function () {
                    return "translate(" + position[0] + "," + position[1] + ")";
                });
            const division = glyphDivision.selectAll("line")
                .data(d => {
                    return d.data;
                })
                .join("line")
                .attr("x1", 0)
                .attr("y1", -condition.metaData.inner)
                .attr("x2", 0)
                .attr("y2", -condition.metaData.outer)
                .attr("stroke", condition.division_color)
                .attr("stroke-width", condition.divisionThickness)
                .attr("stroke-opacity", condition.division_opacity)
                .attr("transform", function (d, i) {
                    return "rotate(" + (-(condition.a_sector) / 2 + i * (condition.a_sector + condition.sector_interval)) + ")";
                });
            return glyphDivision;
        },

        /**
         * 创建背景
         * @param svgs          要附加的元素
         * @param id            唯一的id
         * @param condition     控制条件{metaData,encodingColor,bgOpacity,aSector,sectorInterval}
         * @param position      位置
         */
        createBackground(svgs, id, condition, position) {
            const vc = this
            let uniformId = id + "_" + "glyph_bg"
            if (condition.isEvent) {
                uniformId += '_event'
            }
            const glyphBg = svgs.append("g")
                .attr("class", id + "_" + "glyph_bg")
                .attr("transform", function () {
                    return "translate(" + position[0] + "," + position[1] + ")"
                });
            const bg_sector = glyphBg.selectAll("path")
                .data(d => {
                    return d.data;
                })
                .join("path")
                .attr("d", function (d, i) {
                    let addAngle = vc.angle_radian(i * (condition.aSector + condition.sectorInterval));
                    // 创建圆环
                    let arc = d3.arc()
                        .innerRadius(condition.metaData.inner)
                        .outerRadius(condition.metaData.outer)
                        .startAngle(condition.metaData.start + addAngle)
                        .endAngle(condition.metaData.end + addAngle);
                    return arc();
                })
                .attr("fill", function (d) {
                    // 筛选出来指定属性的颜色
                    let c = condition.encodingColor.filter((item, index) => {
                        return item.name === d.name.split(' ').join('_');
                    });
                    return c[0].color;
                })
                .attr("fill-opacity", condition.bgOpacity);
            if (condition.isEvent) {
                return bg_sector;
            } else {
                return glyphBg;
            }
        },
        /**
         * 绘制轮廓线
         * @param svgs          要附加的元素
         * @param id            唯一id
         * @param condition     控制条件{name,radius,color,thickness,opacity}
         * @param position
         * @returns {*}
         */
        drawOutline(svgs, id, condition, position) {
            return svgs.append("g")
                .attr("class", id + "_" + condition.name)
                .append("circle")
                .attr("cx", position[0])
                .attr("cy", position[1])
                .attr("r", condition.radius)
                .attr("fill", "white")
                .attr("fill-opacity", 0)
                .attr("stroke", condition.color)
                .attr("stroke-width", condition.thickness)
                .attr("stroke-opacity", condition.opacity);
        },
        /**
         *
         * @param svgs
         * @param id
         * @param condition     控制条件{aSector,sectorInterval,sectorTotalStripe,metaphorColor,metaphorOpacity}
         * @param position
         */
        createMetaphor(svgs, id, condition, position) {
            const glyphMetaphor = svgs.append("g")
                .attr("class", id + "_" + "glyph_metaphor")
                .attr("transform", function () {
                    return "translate(" + position[0] + "," + position[1] + ")";
                })
                .selectAll("g")
                .data((d) => {
                    return d.data;
                })
                .join("g")
                .attr("class", function (d) {
                    return "metaphor" + "_" + id + "_" + d.name;
                })
                .attr("transform", function (d, i) {
                    return "rotate(" + i * (condition.aSector + condition.sectorInterval) + ")";
                });
            const glyph_metaphor_stripe = glyphMetaphor.selectAll("path")
                .data(condition.sectorTotalStripe)
                .join("path")
                .attr("d", function (d) {
                    let arc = d3.arc()
                        .innerRadius(d.inner_r)
                        .outerRadius(d.outer_r)
                        .startAngle(d.start)
                        .endAngle(d.end);
                    return arc();
                })
                .attr("fill", function () {
                    return condition.metaphorColor;
                })
                .attr("fill-opacity", condition.metaphorOpacity);
            return glyphMetaphor;
        },
        /**
         *
         * @param svgs
         * @param id
         * @param condition     控制条件{aSector, sectorInterval, stripeNum, sectorTotalStripe, color, isEncodingInfo, encodingInfoColor,stripeOpacity,experimentInfo,circleValue}
         * @param position
         */
        createContent(svgs, id, condition, position) {
            const glyphContent = svgs.append("g")
                .attr("class", id + "_" + "glyph_content")
                .attr("transform", function () {
                    return "translate(" + position[0] + "," + position[1] + ")";
                })
                .selectAll("g")
                .data(d => {
                    return d.data;
                })
                .join("g")
                .attr("class", function (d) {
                    return "content" + "_" + id + "_" + d.name;
                })
                .attr("transform", function (d, i) {
                    return "rotate(" + i * (condition.aSector + condition.sectorInterval) + ")";
                });
            const glyph_content_stripe = glyphContent.selectAll("path")
                .data(function (d) {
                    // encodingValue现在编码的是条纹的数量
                    let aValue = 1
                    if (condition.experimentInfo.isExperimentB) {
                        aValue = condition.circleValue
                    } else {
                        aValue = d[this.getValueBaseStripeNum(condition.stripeNum)]
                    }
                    let num = Math.ceil(d.value / aValue);
                    // console.log(d.name, d.value, d[aValue], num);
                    return condition.sectorTotalStripe.slice(0, num);
                })
                .join("path")
                .attr("d", function (d, i) {
                    const ve = d3.select(this.parentNode).data()[0];
                    let aValue = 1
                    if (condition.experimentInfo.isExperimentB) {
                        aValue = condition.circleValue
                    } else {
                        aValue = ve[this.getValueBaseStripeNum(condition.stripeNum)]
                    }
                    const num = Math.floor(ve.value / aValue);
                    const arcs = d3.arc()
                        .innerRadius(d.inner_r)
                        .outerRadius(d.outer_r)
                        .startAngle(d.start);
                    if (i === num) {
                        let remain = ve.value - num * aValue;
                        let radian_scale = d3.scaleLinear()
                            .domain([0, aValue])
                            .range([d.start, d.end]);
                        arcs.endAngle(radian_scale(remain));
                    } else {
                        arcs.endAngle(d.end);
                    }
                    return arcs();
                })
                .attr("fill", function () {
                    let tmp_data = d3.select(this.parentNode).data()[0];
                    // 筛选出来指定属性的颜色
                    let c = condition.color.filter((item, index) => {
                        return item.name === tmp_data.name;
                    });
                    return condition.isEncodingInfo ? c[0].color : condition.encodingInfoColor;
                })
                .attr("fill-opacity", condition.stripeOpacity);
            return glyphContent;
        },
        /**
         * 根据当前条纹数量来判断每个stripe编码值的大小
         * @param stripeNum
         * @returns {string}
         */
        getValueBaseStripeNum(stripeNum) {
            let attr = 'value_';
            switch (stripeNum) {
                case 10:
                    attr += 10;
                    break;
                case 20:
                    attr += 20;
                    break;
                case 30:
                    attr += 30;
                    break;
                case 40:
                    attr += 40;
                    break;
            }
            return attr;
        },
        /**
         * 绘制peaglyph
         * @param svgs  要附加到的svg
         * @param condition 控制glyph的一些条件{
         *     glyphSize:glyphSize的尺寸
         *     outlineOffset:边框的的偏移
         *     outlineDis:轮廓距离svg边缘的距离
         *     centerOffset:glyph中心的偏移量
         * }
         * @param data
         * @param experimentInfo{
         *     isExperimentB:true or false
         * }
         * @param colorEncoding 颜色编码策略
         * @param glyphClickCallback    回调函数
         * @return {*}  创建的glyph
         */
        drawPeaGlyph(svgs, condition, data, experimentInfo, colorEncoding, glyphClickCallback) {
            const vc = this
            // glyph的位置设置
            const position = [condition.glyphSize / 2, condition.glyphSize / 2]
            const uniformId = 'peaGlyph' + '-' + nanoid();
            let peaAngle = []
            if (experimentInfo.isExperimentB) {
                peaAngle = [70, 50]
            } else {
                peaAngle = [60, 30]
            }
            const radius = (condition.glyphSize / 2 - condition.outlineOffset - condition.outlineDis - condition.centerOffset) / ((condition.circleNum + 1) * 2) - condition.thickness / 2;
            // 这就是一整个glyph
            let peaGlyph = svgs.append('g')
                .attr('class', uniformId)
                .datum(data);

            // 创建豌豆荚
            let peasecod = peaGlyph.append('g')
                .attr('class', uniformId + "_" + 'peasecod')
            let allPeasecodRight = peasecod.append('g')
                .attr('class', uniformId + "_" + 'right')
                .datum(d => {
                    return d;
                })
            let allPeasecodLeft = peasecod.append('g')
                .attr('class', uniformId + "_" + 'left')
                .datum(d => {
                    return d;
                })
            let peaArcLeft = allPeasecodLeft.selectAll('path')
                .data((d) => {
                    return d.data;
                })
                .join('path')
                .attr('d', () => {
                    let angle = peaAngle[0];
                    let newPath = d3.path();
                    let startAngle = 180 - angle / 2;
                    let endAngle = startAngle + angle;
                    let arcRadius = condition.glyphSize / 4 / Math.sin(vc.angle_radian(angle / 2));
                    let x = position[0] + Math.cos(vc.angle_radian(angle / 2)) * arcRadius;
                    let y = position[1] - condition.glyphSize / 4;
                    newPath.arc(x, y, arcRadius, vc.angle_radian(startAngle), vc.angle_radian(endAngle), false)
                    return newPath;
                })
                .attr('fill', '#25a924')
                .attr('fill-opacity', .2)
                .attr('transform', function (d, i) {
                    let parent = d3.select(this.parentNode).data()[0]
                    let attr_num = parent.data.length;
                    let singleAngle = (360 / attr_num) * i;
                    return 'rotate(' + singleAngle + "," + position[0] + "," + position[1] + ")";
                });
            let peaArcRight = allPeasecodRight.selectAll('path')
                .data(d => {
                    return d.data;
                })
                .join('path')
                .attr('d', function (d, i) {
                    let angle = peaAngle[1]
                    let newPath = d3.path();
                    let startAngle = 0 - angle / 2;
                    let endAngle = startAngle + angle;
                    let arcRadius = condition.glyphSize / 4 / Math.sin(vc.angle_radian(angle / 2));
                    let x = position[0] - Math.cos(vc.angle_radian(angle / 2)) * arcRadius;
                    let y = position[1] - condition.glyphSize / 4;
                    newPath.arc(x, y, arcRadius, vc.angle_radian(startAngle), vc.angle_radian(endAngle), false)
                    return newPath;
                })
                .attr('fill', '#25a924')
                .attr('fill-opacity', .2)
                .attr('transform', function (d, i) {
                    let parent = d3.select(this.parentNode).data()[0]
                    let attr_num = parent.data.length;
                    let singleAngle = (360 / attr_num) * i;
                    return 'rotate(' + singleAngle + "," + position[0] + "," + position[1] + ")";
                })

            // 创建外轮廓
            let out_line = peaGlyph.append("g")
                .attr("class", uniformId + 'outline')
                .append("circle")
                .attr("cx", position[0])
                .attr("cy", position[1])
                .attr("r", condition.glyphSize / 2 - condition.outlineOffset)
                .attr("fill", "red")
                .attr("fill-opacity", 0)
                .attr("stroke", "black")
                .attr('stroke-opacity', .7)
                .attr("stroke-width", condition.outlineThickness);

            // 只有第二个实验才需要中心点
            // let center = peaGlyph.append("g")
            //     .attr("class", uniformId + 'center')
            //     .append("circle")
            //     .attr("cx", position[0])
            //     .attr("cy", position[1])
            //     .attr("r", 2)
            //     .attr("fill", "black")
            //     .attr("fill-opacity", 1);

            // 绘制glyph的主体内容
            let glyph_content = peaGlyph.append("g")
                .attr("class", uniformId + "_" + "glyph_content");

            // 创建每个属性
            let glyph_attr = glyph_content.selectAll("g")
                .data(function (d) {
                    return d.data;
                })
                .join("g")
                .attr("class", function (d, i) {
                    // 类名为属性名之间的空格换为下划线
                    return uniformId + d.name;
                })
                .attr("transform", function (d, i) {
                    let parent = d3.select(this.parentNode).data()[0]
                    let attr_num = parent.data.length;
                    let angle = 360 / attr_num;
                    return "translate(" + position[0] + "," + position[1] + ") rotate(" + angle * i + ")";
                });

            let glyph_circles = glyph_attr.selectAll("g")
                .data(function (d) {
                    // 获取指定数量小球对应的每个小球应该编码的值的大小
                    let circleValue = 0
                    let values = [];
                    if (experimentInfo.isExperimentB) {
                        circleValue = condition.circleValue
                    } else {
                        let attr = vc.getValueBaseStripeNum(condition.circleNum);
                        circleValue = d[attr]
                    }
                    // 属性值小于0表示没有这个属性
                    if (d.value >= 0) {
                        if (d.value >= circleValue) {
                            let total = Math.floor(d.value / circleValue);
                            let remain = d.value - total * circleValue;
                            for (let i = 0; i < condition.circleNum; i++) {
                                if (i < total) {
                                    values.push(circleValue);
                                } else if (i === total) {
                                    values.push(remain);
                                } else {
                                    values.push(0);
                                }
                            }
                        } else {
                            values.push(d.value);
                            for (let i = 1; i < condition.circleNum; i++) {
                                values.push(0);
                            }
                        }
                    } else {
                        for (let i = 0; i < condition.circleNum; i++) {
                            values.push(-1);
                        }
                    }
                    return values;
                })
                .join("g");

            // 创建真实显现的circle
            let glyph_real_circle = glyph_circles.append("circle")
                .attr("cx", 0)
                .attr("cy", function (d, i) {
                    let dis = (radius + condition.thickness / 2) * 2;
                    return (0 - dis - condition.centerOffset - dis * i);
                })
                .attr("r", radius)
                .attr("fill", function (d) {
                    let attr = d3.select(this.parentNode.parentNode).data()[0].name;
                    let v = colorEncoding.filter((item, index) => {
                        return item.name === attr;
                    });
                    return v[0].color;
                })
                .attr("stroke", "black")
                .attr("stroke-width", condition.thickness)
                .style("display", function (d) {
                    // 如果数据为null则不显示这个属性
                    if (d < 0) {
                        return "none";
                    }
                    return "inline";
                });

            // 创建遮盖矩形
            let glyph_rect = glyph_circles.append("defs")
                .append("clipPath")
                .attr("id", function (d, i) {
                    let country = d3.select(this.parentNode.parentNode.parentNode.parentNode).data()[0].index;
                    let attr = d3.select(this.parentNode.parentNode.parentNode).data()[0].name;
                    // 使用nanoid生成唯一的id来保证数据相同时，id不同从而保证clip_path不会被互相覆盖
                    return attr + "_" + country + "_" + i + '_' + nanoid();
                })
                .append("rect")
                .attr("x", -radius + condition.thickness / 2)
                .attr("y", function (d, i) {
                    let dis = (radius + condition.thickness / 2) * 2;
                    return (0 - dis - condition.centerOffset - dis * i - radius + condition.thickness / 2);
                    // return 0;
                })
                .attr("width", radius * 2 - condition.thickness)
                .attr("height", function (d) {
                    let aCircleValue = 0
                    // console.log(aCircleValue)
                    if (experimentInfo.isExperimentB) {
                        aCircleValue = condition.circleValue
                    } else {
                        let curData = d3.select(this.parentNode.parentNode.parentNode.parentNode).data()[0]
                        aCircleValue = curData[vc.getValueBaseStripeNum(condition.circleNum)]
                    }
                    let height = radius * 2 - condition.thickness;
                    let height_scale = d3.scaleLinear()
                        .domain([0, aCircleValue])
                        .range([height, 0]);
                    if (d < 0) {
                        return 0;
                    } else {
                        return height_scale(d);
                    }
                });
            let mask_circle = glyph_circles.append("circle")
                .attr("cx", 0)
                .attr("cy", function (d, i) {
                    let dis = (radius + condition.thickness / 2) * 2;
                    return (0 - dis - condition.centerOffset - dis * i);
                })
                .attr("r", radius - condition.thickness / 2)
                .attr("fill", "white")
                .attr('fill-opacity', 1)
                .attr("clip-path", function (d, i) {
                    let id_name = d3.select(this.previousSibling).select("clipPath").attr("id");
                    return "url(#" + id_name + ")";
                });
            return peaGlyph;
        },
        drawStripGlyph(svgs, condition, data, experimentInfo, colorEncoding, glyphClickCallback) {
            // console.log(data)
            const vc = this
            // glyph的位置设置
            const position = [condition.glyphSize / 2, condition.glyphSize / 2]
            const uniformId = 'stripeGlyph' + '-' + nanoid();
            // 这就是一整个glyph
            const stripeGlyph = svgs.append('g')
                .attr('class', uniformId)
                .datum(data)
            // 内半径
            const innerRadius = vc.radius_scale(condition.iRadius, condition.maxRadius, condition.glyphSize);
            // 每一块区域所占的角度
            const aSector = 360 / data.data.length - condition.sectorInterval;
            // 外半径
            const outerRadius = vc.radius_scale(condition.maxRadius - condition.svgEdgeDis, condition.maxRadius, condition.glyphSize);
            const metaData = {
                inner: innerRadius + condition.outlineThickness / 2,
                outer: outerRadius - condition.outlineThickness / 2,
                start: vc.angle_radian(condition.sectorInterval / 2 - aSector / 2),
                end: vc.angle_radian(condition.sectorInterval / 2 - aSector / 2 + aSector)
            };

            // 获取所有的隐喻条纹
            const sectorTotalStripe = vc.cal_total_strip(metaData, condition.stripe_L_R, condition.stripe_B_A, condition.stripeProportion, condition.layerNum)

            // 创建每个区域的分界线
            const divisionG = vc.createDivision(stripeGlyph, uniformId, {
                metaData,
                division_color: condition.divisionColor,
                division_opacity: condition.divisionOpacity,
                a_sector: aSector,
                sector_interval: condition.sectorInterval,
                divisionThickness: condition.outlineThickness
            }, position);

            // 创建背景
            const backgroundG = vc.createBackground(stripeGlyph, uniformId, {
                metaData,
                encodingColor: colorEncoding,
                bgOpacity: condition.bgOpacity,
                aSector,
                sectorInterval: condition.sectorInterval,
                isEvent: false
            }, position);

            // 创建内轮廓
            const inline = vc.drawOutline(stripeGlyph, uniformId, {
                name: 'inner',
                radius: innerRadius,
                color: condition.divisionColor,
                thickness: condition.outlineThickness,
                opacity: condition.innerOpacity
            }, position);
            // 创建外轮廓
            const outline = vc.drawOutline(stripeGlyph, uniformId, {
                name: 'outer',
                radius: outerRadius,
                color: condition.divisionColor,
                thickness: condition.outlineThickness,
                opacity: condition.innerOpacity
            }, position);

            // 创建隐喻条纹
            const metaphor = vc.createMetaphor(stripeGlyph, uniformId, {
                aSector,
                sectorInterval: condition.sectorInterval,
                sectorTotalStripe,
                metaphorColor: condition.metaphorColor,
                metaphorOpacity: condition.metaphorOpacity,
            }, position);


            // 创建条纹内容
            const content = vc.createContent(stripeGlyph, uniformId, {
                aSector,
                sectorInterval: condition.sectorInterval,
                stripeNum: condition.stripeNum,
                sectorTotalStripe,
                color: colorEncoding,
                isEncodingInfo: condition.isEncodingInfo,
                encodingInfoColor: condition.encodingInfoColor,
                stripeOpacity: condition.stripeOpacity,
                experimentInfo,
                circleValue: condition.stripeValue
            }, position);
            return stripeGlyph;
        }
    }
}

export const drawStripeGlyphRandom = {
    mixins: [toolsFun],
    data() {
        return {
            // 布局策略：1区域规则布局，2随机分布
            // layoutStrategies: 2,
            // 编码最大值
            maxValue: 10,
            publicGlyphCondition: {
                // svg的大小
                glyphSize: 900,
                // 内半径
                iRadius: 2.5,
                // 默认最大半径
                maxRadius: 10,
                // 扇形区域之间的间隔
                sectorInterval: 1.5,
                // glyph边界离svg的距离
                svgEdgeDis: 0.1,
                // 轮廓粗细
                outlineThickness: 0.7,
                // 区域分割线颜色
                divisionColor: 'black',
                // 区域分割线透明度
                divisionOpacity: 1,
                // 背景透明度
                bgOpacity: 0,
                // 轮廓的透明度
                innerOpacity: 1,
                // 条纹段长度占的比例
                stripeProportion: .083,
                // 条纹左右间距
                stripe_L_R: .15,
                // 条纹前后间距
                stripe_B_A: .07,
                // 隐喻条纹颜色
                metaphorColor: '#C0C0C0',
                // 隐喻条纹透明度
                metaphorOpacity: .3,
                // glyph条纹段是否编码颜色
                isEncodingInfo: true,
                // 编码单一颜色时的颜色
                encodingInfoColor: 'red',
                // 条纹段透明度
                stripeOpacity: 1,
                // 编码属性的数量
                attrNum: 9
            },
            // 区域均匀分布glyph条件
            fixedGlyphCondition: {
                // 分隔的层数
                layerNum: 6,
            },
            randomGlyphCondition: {
                // 条纹段的粗细
                stripeThickness: .07,
                stripeNum: 20
            },
            totalGlyphData: {
                "index": "39f41a8d-b7e6-11ed-9002-c403a826ff34",
                "originIndex": "39eeeac7-b7e6-11ed-a078-c403a826ff34",
                "city": "Austria",
                "average": 7.233509167974615,
                "var": 0.7078247404108701,
                "std": 0.8413232080543541,
                "data": [
                    {
                        "name": "food",
                        "value": 10
                    },
                    {
                        "name": "water",
                        "value": 7.87415577490147
                    },
                    {
                        "name": "safe",
                        "value": 5.829557502924567
                    },
                    {
                        "name": "education",
                        "value": 9.722513530595052
                    },
                    {
                        "name": "life",
                        "value": 3.517247857453378
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
                    },
                    {
                        "name": "health",
                        "value": 6.808397310634129
                    },
                    {
                        "name": 'biodiversity',
                        'value': 5.2037809423789705
                    },
                    {
                        "name": 'renewable',
                        'value': 3.5905700302124055
                    },
                    {
                        "name": 'GDP',
                        'value': 8.618014862326365
                    },
                    {
                        "name": 'savings',
                        'value': 9.147414553503802
                    },
                    {
                        "name": 'greenhouse',
                        'value': 4.618014862326365
                    }
                ]
            },
            // svg组件
            glyphSvg: '',
            allStripes: []
        }
    },
    methods: {
        // 创建svg
        createSvg() {
            const vc = this
            if (this.glyphSvg) {
                this.glyphSvg.remove()
            }
            this.glyphSvg = d3.select(`#${vc.svgId}`)
                .append('svg')
                .attr('width', vc.publicGlyphCondition.glyphSize)
                .attr('height', vc.publicGlyphCondition.glyphSize)
        },
        /**
         * 绘制轮廓线
         * @param svgs          要附加的元素
         * @param id            唯一id
         * @param condition     控制条件{name,radius,color,thickness,opacity}
         * @param position
         * @returns {*}
         */
        drawOutline(svgs, id, condition, position) {
            return svgs.append("g")
                .attr("class", id + "_" + condition.name)
                .append("circle")
                .attr("cx", position[0])
                .attr("cy", position[1])
                .attr("r", condition.radius)
                .attr("fill", "white")
                .attr("fill-opacity", 0)
                .attr("stroke", condition.color)
                .attr("stroke-width", condition.thickness)
                .attr("stroke-opacity", condition.opacity);
        },
        /**
         * 创建分界线
         * @param svgs          要附加的svg
         * @param id            该svg的唯一id
         * @param condition     控制条件{metaData,division_color,division_opacity,a_sector,sector_interval}
         * @param position      位置信息
         */
        createDivision(svgs, id, condition, position) {
            const uniformId = id + "_" + "glyph_division";
            const glyphDivision = svgs.append("g")
                .attr("class", uniformId)
                .attr("transform", function () {
                    return "translate(" + position[0] + "," + position[1] + ")";
                });
            const division = glyphDivision.selectAll("line")
                .data(d => {
                    return d.data;
                })
                .join("line")
                .attr("x1", 0)
                .attr("y1", -condition.metaData.inner)
                .attr("x2", 0)
                .attr("y2", -condition.metaData.outer)
                .attr("stroke", condition.division_color)
                .attr("stroke-width", condition.divisionThickness)
                .attr("stroke-opacity", condition.division_opacity)
                .attr("transform", function (d, i) {
                    return "rotate(" + (-(condition.a_sector) / 2 + i * (condition.a_sector + condition.sector_interval)) + ")";
                });
            return glyphDivision;
        },
        /**
         * 创建背景
         * @param svgs          要附加的元素
         * @param id            唯一的id
         * @param condition     控制条件{metaData,encodingColor,bgOpacity,aSector,sectorInterval}
         * @param position      位置
         */
        createBackground(svgs, id, condition, position) {
            const vc = this
            const uniformId = id + "_" + "glyph_bg"
            const glyphBg = svgs.append("g")
                .attr("class", uniformId)
                .attr("transform", function () {
                    return "translate(" + position[0] + "," + position[1] + ")"
                });

            const bg_sector = glyphBg.selectAll("path")
                .data(d => {
                    // console.log(d)
                    return d.data
                })
                .join("path")
                .attr("d", function (d, i) {
                    const addAngle = vc.angle_radian(i * (condition.aSector + condition.sectorInterval));
                    // 创建圆环
                    const arc = d3.arc()
                        .innerRadius(condition.metaData.inner)
                        .outerRadius(condition.metaData.outer)
                        .startAngle(condition.metaData.start + addAngle)
                        .endAngle(condition.metaData.end + addAngle);
                    return arc();
                })
                .attr("fill", function (d) {
                    // 筛选出来指定属性的颜色
                    const c = condition.encodingColor.filter((item, index) => {
                        return item.name === d.name;
                    })
                    return c[0].color
                })
                .attr("fill-opacity", condition.bgOpacity)
            return glyphBg
        },
        /**
         *  创建隐喻条纹
         * @param svgs
         * @param id
         * @param condition     控制条件{aSector,sectorInterval,sectorTotalStripe,metaphorColor,metaphorOpacity}
         * @param position
         */
        createMetaphor(svgs, id, condition, position) {
            const glyphMetaphor = svgs.append("g")
                .attr("class", id + "_" + "glyph_metaphor")
                .attr("transform", function () {
                    return "translate(" + position[0] + "," + position[1] + ")";
                })
                .selectAll("g")
                .data((d) => {
                    return d.data;
                })
                .join("g")
                .attr("class", function (d) {
                    return "metaphor" + "_" + id + "_" + d.name;
                })
                .attr("transform", function (d, i) {
                    return "rotate(" + i * (condition.aSector + condition.sectorInterval) + ")";
                });
            const glyph_metaphor_stripe = glyphMetaphor.selectAll("path")
                .data(condition.sectorTotalStripe)
                .join("path")
                .attr("d", function (d) {
                    let arc = d3.arc()
                        .innerRadius(d.inner_r)
                        .outerRadius(d.outer_r)
                        .startAngle(d.start)
                        .endAngle(d.end);
                    return arc();
                })
                .attr("fill", function () {
                    return condition.metaphorColor;
                })
                .attr("fill-opacity", condition.metaphorOpacity);
            return glyphMetaphor;
        },
        /**
         *
         * @param svgs
         * @param id
         * @param condition     控制条件{aSector, sectorInterval, stripeNum, sectorTotalStripe, color, isEncodingInfo, encodingInfoColor,stripeOpacity,experimentInfo,circleValue}
         * @param position
         */
        createContent(svgs, id, condition, position) {
            const glyphContent = svgs.append("g")
                .attr("class", id + "_" + "glyph_content")
                .attr("transform", function () {
                    return "translate(" + position[0] + "," + position[1] + ")";
                })
                .selectAll("g")
                .data(d => {
                    return d.data;
                })
                .join("g")
                .attr("class", function (d) {
                    return "content" + "_" + id + "_" + d.name;
                })
                .attr("transform", function (d, i) {
                    return "rotate(" + i * (condition.aSector + condition.sectorInterval) + ")";
                });

            const glyph_content_stripe = glyphContent.selectAll("path")
                .data(function (d) {
                    // 每个条纹编码的大小
                    const aValue = condition.circleValue
                    const num = Math.ceil(d.value / aValue);
                    return condition.sectorTotalStripe.slice(0, num);
                })
                .join("path")
                .attr("d", function (d, i) {
                    const ve = d3.select(this.parentNode).data()[0];
                    const aValue = condition.circleValue
                    const num = Math.floor(ve.value / aValue);
                    const arcs = d3.arc()
                        .innerRadius(d.inner_r)
                        .outerRadius(d.outer_r)
                        .startAngle(d.start);
                    if (i === num) {
                        let remain = ve.value - num * aValue;
                        let radian_scale = d3.scaleLinear()
                            .domain([0, aValue])
                            .range([d.start, d.end]);
                        arcs.endAngle(radian_scale(remain));
                    } else {
                        arcs.endAngle(d.end);
                    }
                    return arcs();
                })
                .attr("fill", function () {
                    let tmp_data = d3.select(this.parentNode).data()[0];
                    // 筛选出来指定属性的颜色
                    let c = condition.color.filter((item, index) => {
                        return item.name === tmp_data.name;
                    });
                    return condition.isEncodingInfo ? c[0].color : condition.encodingInfoColor;
                })
                .attr("fill-opacity", condition.stripeOpacity);
            return glyphContent;
        },
        /**
         *
         * @param drawSvg
         * @param uniformId
         * @param condition {aSector, sectorInterval, circleValue, sectorTotalStripe, color, metaphorColor, isEncodingInfo, encodingInfoColor, metaphorOpacity, stripeOpacity}
         * @param position
         */
        createRandomContent(drawSvg, uniformId, condition, position) {
            const vc = this;
            const glyphRandom = drawSvg.append("g")
                .attr("class", `${uniformId}_glyph_content`)
                .attr("transform", function () {
                    return `translate(${position[0]},${position[1]})`
                })
                .selectAll("g")
                .data(d => {
                    return d.data
                })
                .join("g")
                .attr("class", function (d) {
                    return `content_${uniformId}_${d.name}`
                })
                .attr("transform", function (d, i) {
                    return "rotate(" + i * (condition.aSector + condition.sectorInterval) + ")"
                });

            const glyphRandomStripe = glyphRandom.selectAll("path")
                .data(d => {
                    const aValue = condition.circleValue
                    const num = Math.ceil(d.value / aValue)
                    // 深拷贝
                    let stripes = condition.sectorTotalStripe.slice(0, num)
                    if (d.value !== 0 && d.value % aValue !== 0) {
                        stripes = [stripes[0], ...stripes]
                    }
                    return stripes
                })
                .join("path")
                .attr("d", function (d, i) {
                    const ve = d3.select(this.parentNode).data()[0]
                    const aValue = condition.circleValue
                    const num = Math.floor(ve.value / aValue)
                    const arcs = d3.arc()
                        .innerRadius(d.inner_r)
                        .outerRadius(d.outer_r)
                        .startAngle(d.start)
                    if (i === 1) {
                        // 带有颜色的是不完整的条纹
                        const remain = ve.value - num * aValue;
                        const radian_scale = d3.scaleLinear()
                            .domain([0, aValue])
                            .range([d.start, d.end])
                        arcs.endAngle(radian_scale(remain))
                    } else {
                        arcs.endAngle(d.end)
                    }
                    return arcs()
                })
                .attr("fill", function (d, i) {
                    const tmp_data = d3.select(this.parentNode).data()[0];
                    const ve = tmp_data.value;
                    const num = Math.floor(ve / condition.circleValue);
                    const c = condition.color.filter((item, index) => {
                        return item.name === tmp_data.name;
                    });
                    if (num * condition.circleValue < ve) {
                        if (i === 0) {
                            // 用于隐喻条纹
                            return condition.metaphorColor;
                        }
                        return condition.isEncodingInfo ? c[0].color : condition.encodingInfoColor;
                    }
                    return condition.isEncodingInfo ? c[0].color : condition.encodingInfoColor;
                })
                .attr("fill-opacity", function (d, i) {
                    const tmp_data = d3.select(this.parentNode).data()[0];
                    const ve = tmp_data.value;
                    const num = Math.floor(ve / condition.circleValue);
                    if (num * condition.circleValue < ve) {
                        if (i === 0) {
                            // 用于隐喻条纹
                            return condition.metaphorOpacity;
                        }
                        return condition.stripeOpacity;
                    }
                    return condition.stripeOpacity;
                })
                .attr("class", function (d, i) {
                    const tmp_data = d3.select(this.parentNode).data()[0];
                    const ve = tmp_data.value;
                    const num = Math.floor(ve / condition.circleValue);
                    if (num * condition.circleValue < ve) {
                        if (i === 0) {
                            // 用于隐喻条纹
                            return "path_metaphor";
                        }
                        return "";
                    }
                    return "";
                })
            return glyphRandom
        },
        /**
         * 创建两种glyph的公共组成部分
         * @param appendSvg 要附加的glyph
         * @param uniformId id
         */
        createPublicComponent(appendSvg, uniformId) {
            const vc = this
            // 创建内轮廓
            vc.drawOutline(appendSvg, uniformId, {
                name: 'inner',
                radius: vc.innerRadius,
                color: vc.publicGlyphCondition.divisionColor,
                thickness: vc.publicGlyphCondition.outlineThickness,
                opacity: vc.publicGlyphCondition.innerOpacity
            }, vc.glyphPosition);
            // 创建外轮廓
            vc.drawOutline(appendSvg, uniformId, {
                name: 'outer',
                radius: vc.outerRadius,
                color: vc.publicGlyphCondition.divisionColor,
                thickness: vc.publicGlyphCondition.outlineThickness,
                opacity: vc.publicGlyphCondition.innerOpacity
            }, vc.glyphPosition);
            // 创建每个区域的分界线
            vc.createDivision(appendSvg, uniformId, {
                metaData: vc.metaData,
                division_color: vc.publicGlyphCondition.divisionColor,
                division_opacity: vc.publicGlyphCondition.divisionOpacity,
                a_sector: vc.aSector,
                sector_interval: vc.publicGlyphCondition.sectorInterval,
                divisionThickness: vc.publicGlyphCondition.outlineThickness
            }, vc.glyphPosition);
            // 创建背景
            vc.createBackground(appendSvg, uniformId, {
                metaData: vc.metaData,
                encodingColor: vc.colorEncoding,
                bgOpacity: vc.publicGlyphCondition.bgOpacity,
                aSector: vc.aSector,
                sectorInterval: vc.publicGlyphCondition.sectorInterval
            }, vc.glyphPosition);

        },
        // 创建规则分布的glyph
        createFixedGlyph() {
            const vc = this
            const uniformId = `fixed-${nanoid()}`
            const stripeG = this.glyphSvg.append('g')
                .attr('class', uniformId)
                .datum(vc.glyphData);
            // 创建组成的公共部分
            this.createPublicComponent(stripeG, uniformId)
            // 创建隐喻条纹
            this.createMetaphor(stripeG, uniformId, {
                aSector: vc.aSector,
                sectorInterval: vc.publicGlyphCondition.sectorInterval,
                sectorTotalStripe: vc.fixedSectorTotalStripe,
                metaphorColor: vc.publicGlyphCondition.metaphorColor,
                metaphorOpacity: vc.publicGlyphCondition.metaphorOpacity,
            }, vc.glyphPosition)
            // 创建填充条纹
            this.createContent(stripeG, uniformId, {
                aSector: vc.aSector,
                sectorInterval: vc.publicGlyphCondition.sectorInterval,
                sectorTotalStripe: vc.fixedSectorTotalStripe,
                color: vc.colorEncoding,
                isEncodingInfo: vc.publicGlyphCondition.isEncodingInfo,
                encodingInfoColor: vc.publicGlyphCondition.encodingInfoColor,
                stripeOpacity: vc.publicGlyphCondition.stripeOpacity,
                circleValue: vc.stripeValue
            }, vc.glyphPosition);
        },
        // 创建随机分布的glyph
        createRandomGlyph() {
            const vc = this
            const uniformId = `random-${nanoid()}`
            const stripeG = this.glyphSvg.append('g')
                .attr('class', uniformId)
                .datum(vc.glyphData);
            // 创建组成的公共部分
            this.createPublicComponent(stripeG, uniformId)
            this.createRandomContent(stripeG, uniformId, {
                aSector: vc.aSector,
                sectorInterval: vc.publicGlyphCondition.sectorInterval,
                sectorTotalStripe: vc.randomSectorTotalStripe,
                color: vc.colorEncoding,
                metaphorColor: vc.publicGlyphCondition.metaphorColor,
                metaphorOpacity: vc.publicGlyphCondition.metaphorOpacity,
                isEncodingInfo: vc.publicGlyphCondition.isEncodingInfo,
                encodingInfoColor: vc.publicGlyphCondition.encodingInfoColor,
                stripeOpacity: vc.publicGlyphCondition.stripeOpacity,
                circleValue: vc.stripeValue
            }, vc.glyphPosition)
        }
    },
    computed: {
        // 设置svg的id
        svgId() {
            const pre = this.layoutStrategies === 1 ? "fixed" : "random"
            return `${pre}_${nanoid()}`
        },
        glyphPosition() {
            return [this.publicGlyphCondition.glyphSize / 2, this.publicGlyphCondition.glyphSize / 2]
        },
        // 每一个区域所占的角度
        aSector() {
            return 360 / this.glyphData.data.length - this.publicGlyphCondition.sectorInterval
        },
        // 内轮廓半径
        innerRadius() {
            return this.radius_scale(this.publicGlyphCondition.iRadius, this.publicGlyphCondition.maxRadius, this.publicGlyphCondition.glyphSize)
        },
        // 外轮廓半径
        outerRadius() {
            // 外轮廓半径会距离svg边界有svgEdgeDis距离
            return this.radius_scale(this.publicGlyphCondition.maxRadius - this.publicGlyphCondition.svgEdgeDis, this.publicGlyphCondition.maxRadius, this.publicGlyphCondition.glyphSize)
        },
        // 计算一些元数据
        metaData() {
            return {
                inner: this.innerRadius + this.publicGlyphCondition.outlineThickness / 2,
                outer: this.outerRadius - this.publicGlyphCondition.outlineThickness / 2,
                start: this.angle_radian(this.publicGlyphCondition.sectorInterval / 2 - this.aSector / 2),
                end: this.angle_radian(this.publicGlyphCondition.sectorInterval / 2 - this.aSector / 2 + this.aSector)
            }
        },
        // 条纹段在区域内均匀分布时所有的条纹段
        fixedSectorTotalStripe() {
            return this.cal_total_strip(this.metaData, this.publicGlyphCondition.stripe_L_R, this.publicGlyphCondition.stripe_B_A, this.publicGlyphCondition.stripeProportion, this.fixedGlyphCondition.layerNum)
        },
        // 条纹段在区域内随机分布时所有的条纹段
        randomSectorTotalStripe() {
            this.allStripes = this.generatePointsBasedOnPoissonDiskDistributions(this.metaData, this.randomGlyphCondition.stripeThickness, this.publicGlyphCondition.stripe_L_R, this.publicGlyphCondition.stripe_B_A, this.publicGlyphCondition.stripeProportion)
            const tmp = [...this.allStripes]
            // 根据条件显示指定数量的条纹段
            if (tmp.length >= this.randomGlyphCondition.stripeNum) {
                return tmp.slice(0, this.randomGlyphCondition.stripeNum)
            } else {
                return tmp
            }
        },
        // 每个条纹段编码的值的大小
        stripeValue() {
            if (this.layoutStrategies === 1) {
                return this.maxValue / this.fixedSectorTotalStripe.length
            } else {
                return this.maxValue / this.randomSectorTotalStripe.length
            }
        },
        colorEncoding() {
            const colors = this.$store.state.ssiColorEncodingDemo
            const num = Math.min(this.publicGlyphCondition.attrNum, colors.length)
            return [...colors.slice(0, num)]
        },
        glyphData() {
            const d = this.totalGlyphData.data
            const num = Math.min(this.publicGlyphCondition.attrNum, d.length)
            return {
                ...this.totalGlyphData,
                data: [...d.slice(0, num)]
            }
        }
    },
    watch: {
        allStripes: {
            deep: true,
            handler(newVal, oldVal) {
                this.$bus.$emit('updateStripeNum', newVal)
            }
        }
    }
}