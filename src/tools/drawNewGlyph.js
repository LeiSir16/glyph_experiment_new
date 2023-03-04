import * as d3 from 'd3';
import {nanoid} from "nanoid";
import {angle_radian, cal_total_strip} from "@/assets/js/tool";

let attrChinese = {
    tem: {
        name: '温度',
        units: '°C'
    },
    wns: {
        name: '风速',
        units: 'm/s'
    },
    wns_100m: {
        name: '100m风速',
        units: 'm/s'
    },
    vis: {
        name: '能见度',
        units: 'm'
    },
    gust: {
        name: '10m阵风风速',
        units: 'm/s'
    },
    st_40: {
        name: '40cm土壤温度',
        units: '°C'
    },
    st_200: {
        name: '200cm土壤温度',
        units: '°C'
    },
    sw_40: {
        name: '40cm土壤湿度',
        units: '%'
    },
    sw_200: {
        name: '200cm土壤湿度',
        units: '%'
    }
}

/**
 * 绘制一个peaGlyph
 * @param svgs      被绘制的svg
 * @param condition glyph的控制条件{size，outline_offset, outline_thickness,circle_num,outline_dis,center_offset,thickness}
 * @param data      数据
 * @param position  绘制的位置
 */
export function drawPeaGlyph(svgs, condition, data, position, qinlingcolor, glyphClickCallback) {
    let uniformId = 'peaGlyph' + '-' + data.index + '-' + nanoid();
    let radius = (condition.size / 2 - condition.outline_offset - condition.outline_dis - condition.center_offset) / (condition.circle_num * 2) - condition.thickness / 2;
    // console.log(radius)
    // 这就是一整个glyph
    let peaGlyph = svgs.append('g')
        .attr('class', uniformId)
        .datum(data);

    // 当鼠标点击的时候可以显示一个边框
    let mouseOutline = createSvgOutline(peaGlyph, uniformId, condition.size, position);
    peaGlyph.on('click', () => {
        // mouseOutline.select('rect').attr('stroke-opacity', 1);
        glyphClickCallback(mouseOutline, peaGlyph.data()[0]);
    });

    // 创建豌豆荚
    let wandou = peaGlyph.append('g')
        .attr('class', uniformId + "_" + 'wandoujia');
    let allWandouRight = wandou.append('g')
        .attr('class', uniformId + "_" + 'right')
        .datum((d) => {
            return d;
        });
    let allWandouLeft = wandou.append('g')
        .attr('class', uniformId + "_" + 'left')
        .datum((d) => {
            return d;
        });
    let jiaArcLeft = allWandouLeft.selectAll('path')
        .data((d) => {
            return d.data;
        })
        .join('path')
        .attr('d', () => {
            let angle = 60;
            let newPath = d3.path();
            let startAngle = 180 - angle / 2;
            let endAngle = startAngle + angle;
            let radius = condition.size / 4 / Math.sin(angle_radian(angle / 2));
            let x = position[0] + Math.cos(angle_radian(angle / 2)) * radius;
            let y = position[1] - condition.size / 4;
            newPath.arc(x, y, radius, angle_radian(startAngle), angle_radian(endAngle), false)
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
    let jiaArcRight = allWandouRight.selectAll('path')
        .data((d) => {
            return d.data;
        })
        .join('path')
        .attr('d', function (d, i) {
            let angle = 30;
            let newPath = d3.path();
            let startAngle = 0 - angle / 2;
            let endAngle = startAngle + angle;
            let radius = condition.size / 4 / Math.sin(angle_radian(angle / 2));
            let x = position[0] - Math.cos(angle_radian(angle / 2)) * radius;
            let y = position[1] - condition.size / 4;
            newPath.arc(x, y, radius, angle_radian(startAngle), angle_radian(endAngle), false)
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

    // 创建外轮廓
    let out_line = peaGlyph.append("g")
        .attr("class", uniformId + 'outline')
        .append("circle")
        .attr("cx", position[0])
        .attr("cy", position[1])
        .attr("r", condition.size / 2 - condition.outline_offset)
        .attr("fill", "red")
        .attr("fill-opacity", 0)
        .attr("stroke", "black")
        .attr('stroke-opacity', .7)
        .attr("stroke-width", condition.outline_thickness);

    let center = peaGlyph.append("g")
        .attr("class", uniformId + 'center')
        .append("circle")
        .attr("cx", position[0])
        .attr("cy", position[1])
        .attr("r", 2)
        .attr("fill", "black")
        .attr("fill-opacity", 1);

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
            let attr = getValueBaseStripeNum(condition.circle_num);
            let values = [];
            // 属性值小于0表示没有这个属性
            if (d.value >= 0) {
                if (d.value >= d[attr]) {
                    let total = Math.floor(d.value / d[attr]);
                    let remain = d.value - total * d[attr];
                    for (let i = 0; i < condition.circle_num; i++) {
                        if (i < total) {
                            values.push(d[attr]);
                        } else if (i === total) {
                            values.push(remain);
                        } else {
                            values.push(0);
                        }
                    }
                } else {
                    values.push(d.value);
                    for (let i = 1; i < condition.circle_num; i++) {
                        values.push(0);
                    }
                }
            } else {
                for (let i = 0; i < condition.circle_num; i++) {
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
            return (0 - dis - condition.center_offset - dis * i);
        })
        .attr("r", radius)
        .attr("fill", function (d) {
            let attr = d3.select(this.parentNode.parentNode).data()[0].name;
            let v = qinlingcolor.filter((item, index) => {
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
            return (0 - dis - condition.center_offset - dis * i - radius + condition.thickness / 2);
            // return 0;
        })
        .attr("width", radius * 2 - condition.thickness)
        .attr("height", function (d) {
            let curData = d3.select(this.parentNode.parentNode.parentNode.parentNode).data()[0];
            let aCircleValue = curData[getValueBaseStripeNum(condition.circle_num)];
            // console.log(aCircleValue)
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
            return (0 - dis - condition.center_offset - dis * i);
        })
        .attr("r", radius - condition.thickness / 2)
        .attr("fill", "white")
        .attr('fill-opacity', 1)
        .attr("clip-path", function (d, i) {
            let id_name = d3.select(this.previousSibling).select("clipPath").attr("id");
            return "url(#" + id_name + ")";
        });

    return peaGlyph;
}

/**
 * 创建stripeGlyph
 * @param svgs          要附加的svg
 * @param condition     一些条件限制{ size,iRadius , maxRadius,sectorInterval,svgEdgeDis,outlineThickness,divisionColor,divisionOpacity,
 * bgOpacity,innerOpacity,stripe_L_R,stripe_B_A,stripeProportion,layerNum,metaphorColor,metaphorOpacity,stripeNum, isEncodingInfor,encodingInforColor,stripeOpacity}
 * @param data          数据
 * @param position      位置信息
 * @param qinlingcolor  颜色编码
 */
export function drawStripeGlyph(svgs, condition, data, position, qinlingcolor, glyphClickCallback) {
    let uniformId = 'stripeGlyph' + '-' + data.index + '-' + nanoid();
    // 这就是一整个glyph
    let stripeGlyph = svgs.append('g')
        .attr('class', uniformId)
        .datum(data);
    // 内半径
    let innerRadius = radius_scale(condition.iRadius, condition.maxRadius, condition.size);
    // 每一块区域所占的角度
    let aSector = 360 / data.data.length - condition.sectorInterval;
    // 外半径
    let outerRadius = radius_scale(condition.maxRadius - condition.svgEdgeDis, condition.maxRadius, condition.size);
    let metaData = {
        inner: innerRadius + condition.outlineThickness / 2,
        outer: outerRadius - condition.outlineThickness / 2,
        start: angle_radian(condition.sectorInterval / 2 - aSector / 2),
        end: angle_radian(condition.sectorInterval / 2 - aSector / 2 + aSector)
    };
    // 当鼠标移动上去的时候可以显示一个边框
    let mouseOutline = createSvgOutline(stripeGlyph, uniformId, condition.size, position);
    // 点击回传数据
    stripeGlyph.on('click', () => {
        // mouseOutline.select('rect').attr('stroke-opacity', 1);
        glyphClickCallback(mouseOutline, stripeGlyph.data()[0]);
    });

    // 获取所有的隐喻条纹
    let sectorTotalStripe = cal_total_strip(metaData, condition.stripe_L_R, condition.stripe_B_A, condition.stripeProportion, condition.layerNum)
    // 在中心创建一个圆点
    let center = stripeGlyph.append("g")
        .attr("class", uniformId + 'center')
        .append("circle")
        .attr("cx", position[0])
        .attr("cy", position[1])
        .attr("r", 2)
        .attr("fill", "black")
        .attr("fill-opacity", 1);

    // 创建每个区域的分界线
    let divisionG = createDivision(stripeGlyph, uniformId, {
        metaData,
        division_color: condition.divisionColor,
        division_opacity: condition.divisionOpacity,
        a_sector: aSector,
        sector_interval: condition.sectorInterval,
        divisionThickness: condition.outlineThickness
    }, position);

    // 创建背景
    let backgroundG = createBackground(stripeGlyph, uniformId, {
        metaData,
        encodingColor: qinlingcolor,
        bgOpacity: condition.bgOpacity,
        aSector,
        sectorInterval: condition.sectorInterval,
        isEvent: false
    }, position);

    // 创建内轮廓
    let inline = drawOutline(stripeGlyph, uniformId, {
        name: 'inner',
        radius: innerRadius,
        color: condition.divisionColor,
        thickness: condition.outlineThickness,
        opacity: condition.innerOpacity
    }, position);
    // 创建外轮廓
    let outline = drawOutline(stripeGlyph, uniformId, {
        name: 'outer',
        radius: outerRadius,
        color: condition.divisionColor,
        thickness: condition.outlineThickness,
        opacity: condition.innerOpacity
    }, position);

    // 创建隐喻条纹
    let metaphor = createMetaphor(stripeGlyph, uniformId, {
        aSector,
        sectorInterval: condition.sectorInterval,
        sectorTotalStripe,
        metaphorColor: condition.metaphorColor,
        metaphorOpacity: condition.metaphorOpacity,
    }, position);


    // 创建条纹内容
    let content = createContent(stripeGlyph, uniformId, {
        aSector,
        sectorInterval: condition.sectorInterval,
        stripeNum: condition.stripeNum,
        sectorTotalStripe,
        color: qinlingcolor,
        isEncodingInfor: condition.isEncodingInfor,
        encodingInforColor: condition.encodingInforColor,
        stripeOpacity: condition.stripeOpacity
    }, position);
    return stripeGlyph;
}

/**
 * 半径比例尺
 * @param radius        半径值0-10
 * @param maxRadius     最大半径
 * @param svgSize       svg尺寸
 * @returns {*}
 */
function radius_scale(radius, maxRadius, svgSize) {
    let r_s = d3.scaleLinear()
        .domain([0, maxRadius])
        .range([0, svgSize / 2]);
    return r_s(radius);
}

/**
 * 创建分界线
 * @param svgs          要附加的svg
 * @param id            该svg的唯一id
 * @param condition     控制条件{metaData,division_color,division_opacity,a_sector,sector_interval}
 * @param position      位置信息
 */
function createDivision(svgs, id, condition, position) {
    let uniformId = id + "_" + "glyph_division";
    let glyphDivision = svgs.append("g")
        .attr("class", uniformId)
        .attr("transform", function () {
            return "translate(" + position[0] + "," + position[1] + ")";
        });
    let division = glyphDivision.selectAll("line")
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
}

/**
 * 创建背景
 * @param svgs          要附加的元素
 * @param id            唯一的id
 * @param condition     控制条件{metaData,encodingColor,bgOpacity,aSector,sectorInterval}
 * @param position      位置
 */
function createBackground(svgs, id, condition, position) {
    let uniformId = id + "_" + "glyph_bg";
    if (condition.isEvent) {
        uniformId += '_event';
    }
    let glyphBg = svgs.append("g")
        .attr("class", id + "_" + "glyph_bg")
        .attr("transform", function () {
            return "translate(" + position[0] + "," + position[1] + ")";
        });
    let bg_sector = glyphBg.selectAll("path")
        .data(d => {
            return d.data;
        })
        .join("path")
        .attr("d", function (d, i) {
            let addAngle = angle_radian(i * (condition.aSector + condition.sectorInterval));
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
}

/**
 * 绘制轮廓线
 * @param svgs          要附加的元素
 * @param id            唯一id
 * @param condition     控制条件{name,radius,color,thickness,opacity}
 * @param position
 * @returns {*}
 */
function drawOutline(svgs, id, condition, position) {
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
}

/**
 *
 * @param svgs
 * @param id
 * @param condition     控制条件{aSector,sectorInterval,sectorTotalStripe,metaphorColor,metaphorOpacity}
 * @param position
 */
function createMetaphor(svgs, id, condition, position) {
    let glyphMetaphor = svgs.append("g")
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
    let glyph_metaphor_stripe = glyphMetaphor.selectAll("path")
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
}

/**
 *
 * @param svgs
 * @param id
 * @param condition     控制条件{aSector, sectorInterval, stripeNum, sectorTotalStripe, color, isEncodingInfor, encodingInforColor,stripeOpacity}
 * @param position
 */
function createContent(svgs, id, condition, position) {
    let glyphContent = svgs.append("g")
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
    let glyph_content_stripe = glyphContent.selectAll("path")
        .data(function (d) {
            // encodingValue现在编码的是条纹的数量
            let aValue = getValueBaseStripeNum(condition.stripeNum)
            let num = Math.ceil(d.value / d[aValue]);
            // console.log(d.name, d.value, d[aValue], num);
            return condition.sectorTotalStripe.slice(0, num);
        })
        .join("path")
        .attr("d", function (d, i) {
            let ve = d3.select(this.parentNode).data()[0];
            let aValue = getValueBaseStripeNum(condition.stripeNum)
            let num = Math.floor(ve.value / ve[aValue]);
            let arcs = d3.arc()
                .innerRadius(d.inner_r)
                .outerRadius(d.outer_r)
                .startAngle(d.start);
            if (i === num) {
                let remain = ve.value - num * ve[aValue];
                let radian_scale = d3.scaleLinear()
                    .domain([0, ve[aValue]])
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
                return item.name === tmp_data.name.split(' ').join('_');
            });
            return condition.isEncodingInfor ? c[0].color : condition.encodingInforColor;
        })
        .attr("fill-opacity", condition.stripeOpacity);
    return glyphContent;
}

/**
 * 为glyph创建一个边框
 * @param glyphSvg
 * @param id
 * @param size
 * @param position
 * @returns {*}
 */
function createSvgOutline(glyphSvg, id, size, position) {
    let thickness = 1, width = size - thickness / 2, height = size - thickness / 2;
    let rectComponent = glyphSvg.append('g')
        .attr('class', id + "_" + 'svg_outline');
    let rects = rectComponent.append('rect')
        .attr('x', position[0] - width / 2)
        .attr('y', position[1] - height / 2)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'transparent')
        .attr('stroke', 'black')
        .attr('stroke-width', thickness)
        .attr('stroke-opacity', 0);
    return rectComponent;
}

function createAttrDetail(svgs, id, data) {
    let name = 'attrDetail' + "_" + id;
    let details = svgs.append('g')
        .attr('class', name)
        .style('position', 'static')
        .style('z-index', 999);
    let attrValue = details.append('text')
        .text(data.value)
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', 'white')
        .attr("font-size", 15)
        .attr("font-weight", 'bold')
        .attr("text-anchor", "start")
        .attr('fill-opacity', 0)
    return details;
}

/**
 * 根据当前条纹数量来判断每个stripe编码值的大小
 * @param stripeNum
 * @returns {string}
 */
function getValueBaseStripeNum(stripeNum) {
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
}