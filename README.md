# Glyph有效性验证实验

## 配置项目
```
npm install
```

### 开发环境下运行项目
```
npm run serve
```

### 编译项目
```
npm run build
```

## 实验组成

### 实验数据来源
`/public/data`或[阿里云存储]([阿里云存储]:https://leisir-note-image.oss-cn-hangzhou.aliyuncs.com/glyph_experiment_new/)

### 实验一：数据分布实验

#### 数据筛选思路

一条原数据生成两个数据，两个数据作为一组

以小球/条纹段数量作为标准，在一定的数量的小球/条纹段范围内对原数据进行扰动，并保证其最少和最多有多少个小球/条纹段

保证两组数据的方差差距在$[1.5,2.5]$之间

#### 实验任务
从两个Glyph中选择数据分布比较均匀（方差最小）的一个

#### 实验结果字段说明
```json
{
  "userInfo": {
    "sId": "自动生成的用户id",
    "gender": "男/女",
    "name": "可为空",
    "age": 23
  },
  "Distribution": {
    "startTime": "整个大实验开始的时间，时间记录示例：2023-03-10 16:53:00.606",
    "endTime": "整个大实验的结束时间",
    "childExperiment": [
      {
        "glyphType": "glyph类型，1:PeaGlyph, 2:StripeGlyph",
        "stripeNum": "条纹段/小球数量 10 / 20 / 40",
        "stripeValue": "每个条纹段或小球编码值的大小",
        "startTime": "每个小实验开始的时间",
        "submitTime": "保存结果时间",
        "endTime": "小实验结束时间（点击下一步的时间）",
        "chooseIndex": "选择的glyph的索引",
        "chooseData": {
          "index": "选择的数据的id",
          "originIndex": "生成该数据的原数据的id",
          "city": "城市名称",
          "average": "平均值",
          "var": "方差",
          "std": "标准差",
          "data": [
            {
              "name": "属性名",
              "value": "属性值"
            },
            ...
          ]
        },
        "allData": "数组，长度为2，glyph编码的数据",
        "findAttr": "任务指定的属性",
        "isRight": "结果是否正确true or false"
      }
    ]
  }
}
```

### 实验二：微小差值实验

#### 数据筛选思路

对一个原数据的每个属性值扰动一定的范围，并且保证该属性保持在最大和最小值的中间部分

同样以小球/条纹段作为标准，指定每种数据之间的差距，并且保证差距在很小的范围内

第二个数据在第一个数据基础上进行扰动

#### 实验任务
根据任务指定的属性从两个glyph中选择该属性值较大的一个

#### 任务属性选择策略

从九种属性中随机选择一种

#### 实验结果字段说明
字段与第一个实验一致

### 实验三：差值实验

#### 数据筛选思路

直接选择原数据，但是保证两个数据的均值至少相差$3.5$ ，以此保证存在差距比较大的属性值

#### 实验任务
根据任务指定的属性估算两个glyph中该属性值的差值

#### 任务属性选择策略
选择两个glyph属性值差异$0.5$ 以上的 

#### 实验结果字段说明
```json
{
  "userInfo": {
    "sId": "自动生成的用户id",
    "gender": "男/女",
    "name": "可为空",
    "age": 23
  },
  "Distribution": {
    "startTime": "整个大实验开始的时间，时间记录示例：2023-03-10 16:53:00.606",
    "endTime": "整个大实验的结束时间",
    "childExperiment": [
      {
        "glyphType": "glyph类型，1:PeaGlyph, 2:StripeGlyph",
        "stripeNum": "条纹段/小球数量 10 / 20 / 40",
        "stripeValue": "每个条纹段或小球编码值的大小",
        "startTime": "每个小实验开始的时间",
        "submitTime": "保存结果时间",
        "endTime": "小实验结束时间（点击下一步的时间）",
        "chooseIndex": "用户估算的差值",
        "chooseData": "用户估算的差值与正确的值之间的偏差（有正负）",
        "allData": "数组，长度为2，glyph编码的数据",
        "findAttr": "任务指定的属性",
        "isRight": "正确的偏差"
      }
    ]
  }
}
```



