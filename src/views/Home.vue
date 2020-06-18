<template>
    <div class="home" style="height:100%">
        <div ref="container" id="container"></div>
        <div id="address">
            <el-input
                v-model="address"
                clearable
                @keyup.enter.native="search"
            ></el-input>
            <el-button @click="search">搜索</el-button>
        </div>
        <div id="panel" :key="panelKey"></div>
        <div class="info">
            点击地图上的点标记，打开所添加的自定义信息窗体
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import AMap from "AMap"; // 引入高德地图
import { getDriverPosition } from "@/api/ReportLocation";
export default {
    name: "Home",
    data() {
        return {
            panelKey: 0,
            map: undefined,
            clientHeight: "",
            placeSearch: undefined,
            address: "",
            driver: undefined,
            style: [
                {
                    url:
                        "https://a.amap.com/jsapi_demos/static/images/mass0.png",
                    anchor: new AMap.Pixel(12, 12),
                    size: new AMap.Size(22, 22)
                },
                {
                    url:
                        "https://a.amap.com/jsapi_demos/static/images/mass1.png",
                    anchor: new AMap.Pixel(8, 8),
                    size: new AMap.Size(14, 14)
                },
                {
                    url:
                        "https://a.amap.com/jsapi_demos/static/images/mass2.png",
                    anchor: new AMap.Pixel(6, 6),
                    size: new AMap.Size(10, 10)
                }
            ]
        };
    },
    watch: {
        // 如果 `clientHeight` 发生改变，这个函数就会运行
        clientHeight: function() {
            this.changeFixed(this.clientHeight);
        }
    },
    mounted() {
        this.clientHeight = `${document.documentElement.clientHeight}`;
        this.mapInit();
        this.getData();
    },
    methods: {
        mapInit() {
            this.map = new AMap.Map("container", {
                resizeEnable: true,
                zoom: 14
            });
        },
        // 动态修改样式
        changeFixed(clientHeight) {
            console.log(clientHeight);
            this.$refs.container.style.height = clientHeight + "px";
        },
        getData() {
            getDriverPosition().then(res => {
                console.log(res);
                this.driver = res.data;
                this.driver.forEach(element => {
                    element.lnglat = [element.lng, element.lat];
                    element.style = element.is_driving;
                });
                console.log(this.driver);
                var marker = new AMap.Marker({ content: " ", map: this.map });
                var mass = new AMap.MassMarks(this.driver, {
                    opacity: 0.8,
                    zIndex: 111,
                    cursor: "pointer",
                    style: this.style
                });
                mass.on("mouseover", function(e) {
                    console.log(e);
                    marker.setPosition(e.data.lnglat);
                    marker.setLabel({
                        content: `${e.data.real_name}:${e.data.work_phone}`
                    });
                });

                mass.setMap(this.map);
            });
        },
        search() {
            this.getData();
            this.panelKey = new Date();
            AMap.service(["AMap.PlaceSearch"], () => {
                //构造地点查询类
                var placeSearch = new AMap.PlaceSearch({
                    pageSize: 5, // 单页显示结果条数
                    pageIndex: 1, // 页码
                    city: "0311", // 兴趣点城市
                    citylimit: true, //是否强制限制在设置的城市内搜索
                    map: this.map, // 展现结果的地图实例
                    panel: "panel", // 结果列表将在此容器中进行展示。
                    autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                });
                placeSearch.search(this.address);
            });
        }
    }
};
</script>
<style lang="scss" scoped>
#panel {
    position: absolute;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 10px;
    right: 10px;
    width: 280px;
}
#address {
    background: #fff;
    padding: 10px;
    position: absolute;
    display: flex;
    padding: 10px;
    bottom: 100px;
    right: 10px;
}
</style>
