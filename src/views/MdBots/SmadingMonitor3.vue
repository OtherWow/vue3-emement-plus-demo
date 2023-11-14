<template>
    <el-container>
        <el-main>
            <el-row :gutter="20" style="margin-bottom: 20px;">
                <!-- <el-col :span="4">
                    <el-button type="primary" @click="manualReconnect()">重新连接websocket服务器</el-button>

                </el-col> -->
                <el-col :span="2" style="margin-left: 20px;">
                    <el-select v-model="选中的交易所账号" @change="更新监控的交易所账号" clearable placeholder="选择要监控的交易所账号"
                        style="width:100%" multiple filterable collapse-tags collapse-tags-tooltip>
                        <el-option v-for="item in nameFilters" :key="item.value" :label="item.text" :value="item.value" />
                    </el-select>
                </el-col>
                <el-col :span="3" style="margin-left: 20px;">
                    <el-select v-model="突出显示的列" @change="更新突出显示的列" clearable placeholder="选择要突出显示的列" style="width:100%"
                        multiple filterable collapse-tags collapse-tags-tooltip>
                        <el-option v-for="item in 列名列表" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-col>
                <el-col :span="4" style="margin-left: 20px;">
                    <el-checkbox v-model="open_alarm" label="开启告警" @change="checkAudioSelected" />
                    <el-input v-model="alarm_num" placeholder="第几单开启告警" clearable
                        style="width: 120px;margin-bottom: 3px;margin-left: 5px;" />
                    <!-- 播放音频文件按钮 -->
                    <el-button @click="stop_alarm" :disabled="!audioSrc" v-if="show_alarm_stop"
                        style="margin-bottom: 3px;margin-left: 3px;"> <el-icon size="24px">
                            <template v-if="is_playing">
                                <VideoPause />
                            </template>
                            <template v-else>
                                <VideoPlay />
                            </template>
                        </el-icon></el-button>
                    <!-- 选择音频文件按钮 -->
                    <el-button @click="selectAudioFile" style="margin-bottom: 3px;margin-left: 3px;">选择音频文件</el-button>
                    <input type="file" ref="audioInput" @change="handleAudioSelect" style="display: none" accept="audio/*">
                    <!-- 显示所选音频文件的文件名 -->
                    <el-text v-if="audioName" type="success" size="small" truncated>{{ audioName }}</el-text>

                    <!-- 音频播放器 -->
                    <audio ref="audioPlayer" :src="audioSrc"></audio>
                </el-col>
                <el-col :span="6" style="margin-left: 20px;" v-if="can_show">
                    <el-button-group class="ml-4">
                        <el-button type="success" @click="所有市价平仓('LONG')">所有多仓市价平仓</el-button>
                        <el-button type="danger" @click="所有市价平仓('SHORT')">所有空仓市价平仓</el-button>
                        <el-button type="primary" @click="所有暂停">所有暂停</el-button>
                        <el-button type="primary" @click="所有停止">所有停止</el-button>
                    </el-button-group>

                </el-col>

                <el-col :span="4" style="margin-left: 20px;" v-if="can_show">

                    <el-input v-model="编辑框净浮盈" placeholder="" @change="净浮盈改变">
                        <template #prepend>净盈利满</template>
                        <template #append>USDT 自动重开<el-tooltip placement="top" effect="dark" class="box-item">
                                <template #content> 净盈利=总盈利+仓位浮动盈亏<br />
                                    自动重开是指当前运行的策略停止后重新开启,这样被套住的币种就自动解套了
                                </template>
                                <el-icon :span="12" size="20" style="margin-left:2px;margin-top:0px">
                                    <QuestionFilled />
                                </el-icon>
                            </el-tooltip></template>
                    </el-input>


                </el-col>
            </el-row>
            <el-table-v2 :columns="columns" :data="smading_infos_list" :width="2200" :height="1000" fixed
                :footer-height="50" :cache="10" row-key="id">
                <template #footer>
                    <div class="flex items-center"
                        style="justify-content: center;height: 100%;background-color: var(--el-color-primary-light-7);">
                        自定义功能区
                    </div>
                </template></el-table-v2>
            <!-- <el-table id="monitor_table" :data="smading_infos_list" style="width: 100%" :fit="false" border
                highlight-current-row :summary-method="getSummaries" show-summary :height="monitor_table_height"
                :row-class-name="tableRowClassName" :cell-class-name="cellClassName" @filter-change="handleFilterChange"
                scrollbar-always-on show-overflow-tooltip ref="monitorTable" row-key="id">
                <el-table-column :fixed="选择框_账号名 ? 'left' : false" prop="name" label="账号名" width="80" show-overflow-tooltip
                    align="center"></el-table-column>

                <el-table-column :fixed="选择框_交易对 ? 'left' : false" prop="symbol" label="交易对" width="120"
                    show-overflow-tooltip align="center" :filters="symbolFilters" filter-placement="bottom-end"
                    column-key="symbol">
                    <template #default="scope">
                        <el-tag type="info" effect="dark">{{ scope.row.symbol }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="55" label="序号" align="center" />
                <el-table-column prop="交易类型" label="交易类型" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="启动资金" label="启动资金" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="账户余额" label="账户余额" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column :fixed="选择框_运行时间 ? 'left' : false" prop="运行时间" label="运行时间" width="90"
                    show-overflow-tooltip align="center"></el-table-column>
                <el-table-column :fixed="选择框_每小时盈利 ? 'left' : false" prop="每小时盈利" label="每小时盈利" width="100"
                    show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="当前权重" label="当前权重" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="最新价格" label="最新价格" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="止盈次数" label="止盈次数" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="止盈总利润" label="止盈总利润" width="100" show-overflow-tooltip align="center"
                    v-if="show_profit"></el-table-column>
                <el-table-column prop="做空止盈次数" label="做空止盈次数" width="120" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空止盈总利润" label="做空止盈总利润" width="130" show-overflow-tooltip align="center"
                    v-if="show_profit"></el-table-column>
                <el-table-column prop="做多止盈次数" label="做多止盈次数" width="120" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多止盈总利润" label="做多止盈总利润" width="130" show-overflow-tooltip align="center"
                    v-if="show_profit"></el-table-column>
                <el-table-column prop="触发对冲单次数" label="触发对冲单次数" width="130" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="第几次对冲单" label="第几次对冲单" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="第几次补单" label="第几次补单" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空仓位数量" label="做空仓位数量" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空仓位价格" label="做空仓位价格" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空总盈利" label="做空总盈利" width="100" show-overflow-tooltip align="center"
                    v-if="show_profit"></el-table-column>
                <el-table-column prop="做多仓位数量" label="做多仓位数量" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位价格" label="做多仓位价格" width="110" show-overflow-tooltip
                    align="center"></el-table-column>


                <el-table-column prop="做多总盈利" label="做多总盈利" width="100" show-overflow-tooltip align="center"
                    v-if="show_profit"></el-table-column>

                <el-table-column prop="仓位手续费" label="仓位手续费" width="100" show-overflow-tooltip align="center"
                    v-if="show_profit"></el-table-column>

                <el-table-column prop="总浮盈(已扣手续费)" label="总浮盈(已扣手续费)" width="150" show-overflow-tooltip align="center"
                    v-if="show_profit"></el-table-column>

                <el-table-column prop="当前版本" label="当前版本" width="110" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多本轮时间" label="做多本轮时间" width="70" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多第几次补单" label="做多补单次数" width="70" show-overflow-tooltip align="center">
                    <template #header="{ column }">
                        <div class="highlight-title">{{ column.label }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="做多仓位价值" label="做多仓位价值" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做多仓位浮动盈亏" label="做多仓位浮动盈亏" width="100" show-overflow-tooltip
                    align="center"></el-table-column>

                <el-table-column prop="多仓暂停补单" label="多仓暂停补单" width="70" align="center"></el-table-column>
                <el-table-column :fixed="选择框_多仓操作 ? 'right' : false" label="多仓操作" width="330" align="center">
                    <template #default="{ row, $index }">
                        <el-button type="success" size="small" @click="暂停补单(row, 'LONG')"
                            style="margin-left:0;margin-right:3px" v-if="row.多仓暂停补单 === '否'">暂停补单</el-button>
                        <el-input v-model="long_cover_inputValues[$index]" class="w-50 m-2" size="small" placeholder=""
                            style="width:30px;margin-right: 3px;" v-if="row.多仓暂停补单 === '是'" />
                        <el-button type="success" size="small" @click="恢复补单(row, 'LONG', $index)"
                            style="margin-left:0;margin-right:3px" v-if="row.多仓暂停补单 === '是'">恢复补单</el-button>


                        <el-button type="success" size="small" @click="市价平仓(row, 'LONG')"
                            style="margin-left:0;margin-right:3px">市价平仓</el-button>
                        <el-input v-model="long_inputValues[$index]" class="w-50 m-2" size="small" placeholder=""
                            style="width:40px;margin-right: 3px;margin-left:0px" />
                        <el-button type="success" size="small" @click="重挂止盈(row, 'LONG', $index)"
                            style="margin-left:0;margin-right:0px">重挂止盈</el-button>




                    </template>
                </el-table-column>
                <el-table-column prop="做空本轮时间" label="做空本轮时间" width="70" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空第几次补单" label="做空补单次数" width="70" show-overflow-tooltip align="center">
                    <template #header="{ column }">
                        <div class="highlight-title">{{ column.label }}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="做空仓位价值" label="做空仓位价值" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="做空仓位浮动盈亏" label="做空仓位浮动盈亏" width="100" show-overflow-tooltip
                    align="center"></el-table-column>
                <el-table-column prop="空仓暂停补单" label="空仓暂停补单" width="70" align="center"></el-table-column>
                <el-table-column :fixed="选择框_空仓操作 ? 'right' : false" label="空仓操作" width="330" align="center">
                    <template #default="{ row, $index }">
                        <el-button type="danger" size="small" @click="暂停补单(row, 'SHORT')"
                            style="margin-left:0;margin-right:3px" v-if="row.空仓暂停补单 === '否'">暂停补单</el-button>
                        <el-input v-model="short_cover_inputValues[$index]" class="w-50 m-2" size="small" placeholder=""
                            style="width:30px;margin-right: 3px;" v-if="row.空仓暂停补单 === '是'" />
                        <el-button type="danger" size="small" @click="恢复补单(row, 'SHORT', $index)"
                            style="margin-left:0;margin-right:3px" v-if="row.空仓暂停补单 === '是'">恢复补单</el-button>

                        <el-button type="danger" size="small" @click="市价平仓(row, 'SHORT')"
                            style="margin-left:0;margin-right:3px">市价平仓</el-button>
                        <el-input v-model="short_inputValues[$index]" class="w-50 m-2" size="small" placeholder=""
                            style="width:45px;margin-right: 3px;margin-left:0px" />
                        <el-button type="danger" size="small" @click="重挂止盈(row, 'SHORT', $index)"
                            style="margin-left:0;margin-right:0px">重挂止盈</el-button>



                    </template>
                </el-table-column>

                <el-table-column :fixed="选择框_需要确认的操作 ? 'right' : false" label="需要确认的操作" width="550" align="center">
                    <template #default="{ row }">
                        <el-button type="success" size="small" @click="仓位重启(row, 'LONG')">多仓重启</el-button>
                        <el-button type="danger" size="small" @click="仓位重启(row, 'SHORT')">空仓重启</el-button>
                        <el-button type="danger" size="small" @click="暂停(row)" v-if="row.是否暂停 === '否'">暂停</el-button>
                        <el-button type="success" size="small" @click="恢复(row)" v-if="row.是否暂停 === '是'">恢复</el-button>
                        <el-button type="danger" size="small" @click="停止(row)" v-if="row.是否停止 === '否'">停止</el-button>
                        <el-button type="success" size="small" @click="启动(row)" v-if="row.是否停止 === '是'">启动</el-button>
                        <el-button type="danger" size="small" @click="重新启动(row)">重新启动</el-button>
                        <el-button type="danger" size="small" @click="切换成对冲双马丁(row)">切换成对冲双马丁</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="是否暂停" label="是否暂停" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="是否停止" label="是否停止" width="90" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column :fixed="选择框_仓位浮动盈亏 ? 'right' : false" prop="仓位浮动盈亏" label="仓位浮动盈亏" width="110"
                    show-overflow-tooltip align="center"></el-table-column>
                <el-table-column :fixed="选择框_总手续费 ? 'right' : false" prop="总手续费" label="总手续费" width="85"
                    show-overflow-tooltip align="center" v-if="show_profit"></el-table-column>
                <el-table-column :fixed="选择框_总盈利 ? 'right' : false" prop="总盈利" label="总盈利" width="100" show-overflow-tooltip
                    align="center"></el-table-column>


            </el-table> -->
        </el-main>
    </el-container>
</template>
  
<script setup>
import {
    api_仓位重启,
    api_停止,
    api_切换成对冲双马丁,
    api_启动,
    api_市价平仓,
    api_恢复,
    api_暂停,
    api_重挂止盈,
    api_重新启动,
    api_监控墙_暂停补单,
    api_监控墙_恢复补单,
    api_监控墙_所有市价平仓,
    api_监控墙_所有停止,
    api_监控墙_所有暂停,
    api_监控墙_所有重新开始,
} from "@/api/smading_strategy_api";
import dayjs from 'dayjs'
import {
    ElButton,
    ElIcon,
    ElTag,
    ElTooltip,
    TableV2FixedDir,
} from 'element-plus'
import router from '@/router'; // 确保你的路由实例已经导入
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

let 净浮盈 = 0
const 编辑框净浮盈 = ref(0)
const 净浮盈改变 = (value) => {
    if (isNaN(value)) {
        编辑框净浮盈.value = 0
    }
    if (value === null) {
        编辑框净浮盈.value = 0
    }
    if (value < 0) {
        编辑框净浮盈.value = 0
    }
    净浮盈 = 编辑框净浮盈.value
}


// ------------------------------------------------------------------------------------------------------------告警相关功能----------------------------------------------------------------------------------------------------
const audioInput = ref(null);
const audioPlayer = ref(null);
const audioSrc = ref('');
const audioName = ref('');
const alarm_num = ref(null);
const open_alarm = ref(false);
const show_alarm_stop = ref(false);
const is_playing = ref(true);
let timer = null;
const start_alarm = ref(false);
watch(start_alarm, (newValue) => {
    if (newValue) {
        playAudio(); // 直接播放音频
        // 监听音频播放完成事件
        audioPlayer.value.addEventListener('ended', handleAudioEnded);
    } else {
        // 移除监听
        audioPlayer.value.removeEventListener('ended', handleAudioEnded);
    }
});
// 打开文件选择对话框
const selectAudioFile = () => {
    audioInput.value.click();
};

const handleAudioEnded = () => {
    if (is_playing.value) { // 音频播放完成后，如果open_alarm仍为true，则再次播放
        playAudio();
    }
};

// 处理选择的音频文件
const handleAudioSelect = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];

        audioSrc.value = URL.createObjectURL(file);
        audioName.value = file.name; // 更新文件名
    }
};

const stop_alarm = () => {
    if (is_playing.value) {
        is_playing.value = false;
        audioPlayer.value.pause(); // 暂停音频
    } else {
        is_playing.value = true;
        show_alarm_stop.value = false;
        start_alarm.value = false;
    }

}
// 播放选中的音频文件
const playAudio = () => {
    audioPlayer.value.currentTime = 0; // 从头开始
    audioPlayer.value.play();
};

const checkAudioSelected = (value) => {
    if (value) {
        if (!audioSrc.value) {
            ElMessage({
                message: "请先选择一个音频文件！",
                type: "error"
            });
            open_alarm.value = false;  // 可选择将复选框取消勾选
        }
        console.log(alarm_num.value, isNaN(alarm_num.value), alarm_num.value < 0)
        if (alarm_num.value === null || isNaN(alarm_num.value) || alarm_num.value <= 0) {
            ElMessage({
                message: "请先输入大于多少单告警！",
                type: "error"
            });
            open_alarm.value = false;  // 可选择将复选框取消勾选
        }
    }
}

// ------------------------------------------------------------------------------------------------------------初始化选择框----------------------------------------------------------------------------------------------------
const show_profit = ref(false)
const 选择框_账号名 = ref(true)
const 选择框_交易对 = ref(true)
const 选择框_运行时间 = ref(true)
const 选择框_仓位浮动盈亏 = ref(true)
const 选择框_总手续费 = ref(true)
const 选择框_总盈利 = ref(true)
const 选择框_多仓操作 = ref(false)
const 选择框_空仓操作 = ref(false)
const 选择框_需要确认的操作 = ref(false)
const 选择框_每小时盈利 = ref(false)
// ------------------------------------------------------------------------------------------------------------筛选相关功能开始----------------------------------------------------------------------------------------------------
const currentNameFilters = ref([]);  // 默认为空数组，表示没有筛选
const currentSymbolFilters = ref([]);  // 默认为空数组，表示没有筛选
const nameFilters = ref([]);
const 列名列表 = ref(['账号名', '交易对', '运行时间', '每小时盈利', '仓位浮动盈亏', '总盈利', '多仓操作', '空仓操作', '需要确认的操作']);
const 突出显示的列 = ref(['账号名', '交易对', '运行时间', '每小时盈利', '仓位浮动盈亏', '总盈利']);
const symbolFilters = ref([]);
const 选中的交易所账号 = ref([]);//选中的交易所账号
const short_inputValues = ref({});//空仓重挂止盈的百分比
const long_inputValues = ref({});//多仓重挂止盈的百分比
const short_cover_inputValues = ref({});//空仓恢复补单
const long_cover_inputValues = ref({});//多仓恢复补单
function handleFilterChange(filters) {
    if (filters.hasOwnProperty('name')) {
        currentNameFilters.value = filters.name || [];
    }
    if (filters.hasOwnProperty('symbol')) {
        currentSymbolFilters.value = filters.symbol || [];
    }
}
const 更新突出显示的列 = () => {
    // 遍历突出显示的列,如果在突出显示的列中，则将其设置为true，否则设置为false
    let highlightedColumns = {
        '账号名': false,
        '交易对': false,
        '运行时间': false,
        '仓位浮动盈亏': false,
        '总手续费': false,
        '总盈利': false,
        '多仓操作': false,
        '空仓操作': false,
        '需要确认的操作': false,
        '每小时盈利': false,
    };

    // 标记需要被突出显示的列
    突出显示的列.value.forEach(item => {
        if (highlightedColumns.hasOwnProperty(item)) {
            highlightedColumns[item] = true;
        }
    });

    // 根据标记来更新选择框的值
    选择框_账号名.value = highlightedColumns['账号名'];
    选择框_交易对.value = highlightedColumns['交易对'];
    选择框_运行时间.value = highlightedColumns['运行时间'];
    选择框_仓位浮动盈亏.value = highlightedColumns['仓位浮动盈亏'];
    选择框_总手续费.value = highlightedColumns['总手续费'];
    选择框_总盈利.value = highlightedColumns['总盈利'];
    选择框_多仓操作.value = highlightedColumns['多仓操作'];
    选择框_空仓操作.value = highlightedColumns['空仓操作'];
    选择框_需要确认的操作.value = highlightedColumns['需要确认的操作'];
    选择框_每小时盈利.value = highlightedColumns['每小时盈利'];

}

// ------------------------------------------------------------------------------------------------------------筛选相关功能结束----------------------------------------------------------------------------------------------------



// 储存交易所信息的数组
const smading_infos_list = ref([]);
let ws = null;
const monitor_table_height = ref(0);
// const updateHeight = () => {
//     if (!document.getElementById('monitor_table')) return;
//     monitor_table_height.value = window.innerHeight - 255;
//     // console.log(window.innerHeight)
// };
const monitorTable = ref(null)
onMounted(async () => {
    if (localStorage.getItem('username') === 'syb' || localStorage.getItem('username') === 'yyn') {
        show_profit.value = true
        突出显示的列.value.push('总手续费')
        列名列表.value.push('总手续费')
    } else {
        show_profit.value = false
    }
    更新突出显示的列()
    // updateHeight()
    connectToWebSocket();
    // window.addEventListener('resize', updateHeight);
    // setTimeout(() => {
    //     const scrollArea = monitorTable.value?.$el.querySelector('.el-table__body-wrapper')
    //     monitorTable.value.setScrollLeft(scrollArea.clientWidth + 400);
    // }, 300);
});

onBeforeUnmount(() => {
    if (ws) {
        reconnectScheduled = true;
        ws.close();
    }
    // window.removeEventListener('resize', updateHeight);
    if (timer) {
        clearInterval(timer);
    }
    audioPlayer.value.removeEventListener('ended', handleAudioEnded);
});

// ------------------------------------------------------------------------------------------------------------websocket相关功能开始----------------------------------------------------------------------------------------------------
let 计算总盈利 = 0
let 计算仓位浮动盈亏 = 0
const can_show = ref(true)
const keys = [
    "name",
    "symbol",
    "strategy_id",
    "exchange_id",
    "交易类型",
    "当前版本",
    "是否暂停",
    "是否停止",
    "多仓暂停补单",
    "空仓暂停补单",
    "当前权重",
    "启动资金",
    "账户余额",
    "每小时盈利",
    "运行时间",
    "最新价格",
    "止盈次数",
    "止盈总利润",
    "做空止盈次数",
    "做空止盈总利润",
    "做多止盈次数",
    "做多止盈总利润",
    "触发对冲单次数",
    "第几次补单",
    "做空第几次补单",
    "做多第几次补单",
    "第几次对冲单",
    "做空仓位数量",
    "做空仓位价格",
    "做空仓位价值",
    "做空仓位浮动盈亏",
    "做空总盈利",
    "做空本轮时间",
    "做多仓位数量",
    "做多仓位价格",
    "做多仓位价值",
    "做多仓位浮动盈亏",
    "做多总盈利",
    "做多本轮时间",
    "仓位手续费",
    "仓位浮动盈亏",
    "总浮盈(已扣手续费)",
    "总盈利",
    "总手续费"
];

// 定义函数，将二维数组转换为对象数组
const websocket_数组转对象 = (array2d) => {
    return array2d.map((array) => {
        // 判断类型如果是对象则直接返回，如果是数组就进行下面的处理
        if (typeof array === 'object' && !Array.isArray(array)) {
            //添加id属性，id为strategy_id+symbol
            array.id = array.strategy_id + array.symbol
            return array;
        }
        const obj = {};
        for (let i = 0; i < keys.length; i++) {
            obj[keys[i]] = array[i];
        }
        obj.id = obj.strategy_id + obj.symbol
        return obj;
    });
}


const INITIAL_RECONNECT_DELAY = 300; // 初始重连延迟：1秒
const MAX_RECONNECT_DELAY = 60000;    // 最大重连延迟：1分钟
let currentReconnectDelay = INITIAL_RECONNECT_DELAY; // 当前的重连延迟
let reconnectScheduled = false;       // 用于跟踪是否已经安排了重连
let name_color_map = {}
const color_list = ['color-yyn1', 'color-yyn2', 'color-yyn3', 'color-yyn5']

function scheduleReconnect() {
    if (reconnectScheduled) return;    // 如果已经安排了重连，则直接返回
    console.log(`计划在 ${currentReconnectDelay}ms 后重连`);
    setTimeout(() => {
        currentReconnectDelay = Math.min(currentReconnectDelay * 2, MAX_RECONNECT_DELAY);
        reconnectScheduled = false;  // 重置重连标志
        connectToWebSocket();
    }, currentReconnectDelay);
    reconnectScheduled = true;       // 设置重连标志
}


function connectToWebSocket() {
    if (ws) {
        ws.close();
        ws = null;
    }
    const token = localStorage.getItem('token');
    ws = new WebSocket(`ws://54.238.137.72:7878/ws/smading/${token}`);

    ws.onopen = (event) => {
        console.log("WebSocket 已连接:", event);
        currentReconnectDelay = INITIAL_RECONNECT_DELAY; // 重置当前的重连延迟
    };

    ws.onmessage = async (event) => {
        const array2d = JSON.parse(event.data);
        // 调用函数，将二维数组转换为对象数组
        const rawData = websocket_数组转对象(array2d);
        // console.log("WebSocket 收到消息:", rawData, rawData.error, rawData.error == true);
        // 检查消息中是否有'error'字段
        if (rawData.error) {
            console.error('WebSocket error received:', rawData.error);
            // 根据错误处理，例如：如果token无效或过期，可能需要重新登录
            if (rawData.code === 401) {
                reconnectScheduled = true;
                localStorage.removeItem('token');
                router.replace({
                    path: '/login',
                    query: { redirect: router.currentRoute.fullPath }
                });
            }
            // 关闭WebSocket连接
            ws.close();
        } else {
            rawData.forEach(item => {
                if (can_show.value && !item['当前版本'].includes('v1.0.16')) {
                    can_show.value = false
                }
                if (item.hasOwnProperty('总盈利') && item.hasOwnProperty('总手续费')) {
                    item['总盈利'] = (item['总盈利'] - item['总手续费']).toFixed(4);
                }
            });
            if (can_show.value && 净浮盈 > 0 && (计算总盈利 + 计算仓位浮动盈亏) > 净浮盈) {
                console.log('计算总盈利 + 计算仓位浮动盈亏', 计算总盈利 + 计算仓位浮动盈亏, '净浮盈', 净浮盈)
                // await 所有重新开始()
            }
            // 直接创建一个排序后的名称数组
            const sortedNames = [...new Set(rawData.map(item => item.name))].sort();
            const sorted = [...new Set(rawData.map(item => item.name + '|' + item.交易类型))].sort();
            // 分配颜色到名字
            assignColorToName(sorted);

            const symbols = new Set(rawData.map(item => item.symbol));
            nameFilters.value = sortedNames.map(name => ({ text: name, value: name }));
            if (选中的交易所账号.value.length == 0) {
                选中的交易所账号.value = [...sortedNames];
            }
            symbolFilters.value = [...symbols].map(symbol => ({ text: symbol, value: symbol }));

            smading_infos_list.value = rawData.filter(item =>
                (!currentNameFilters.value.length || currentNameFilters.value.includes(item.name)) &&
                (!currentSymbolFilters.value.length || currentSymbolFilters.value.includes(item.symbol)) &&
                选中的交易所账号.value.includes(item.name)
            );
            // 取出最大补单次数
            let max_long_add_times = 0;
            let max_short_add_times = 0;
            smading_infos_list.value.forEach(item => {
                if (item.hasOwnProperty('做多第几次补单')) {
                    max_long_add_times = Math.max(max_long_add_times, item['做多第几次补单']);
                }
                if (item.hasOwnProperty('做空第几次补单')) {
                    max_short_add_times = Math.max(max_short_add_times, item['做空第几次补单']);
                }
            });
            const max_add_times = Math.max(max_long_add_times, max_short_add_times);
            if (is_playing.value) {
                if (open_alarm.value && max_add_times >= alarm_num.value) {
                    start_alarm.value = true;
                    show_alarm_stop.value = true;
                } else {
                    audioPlayer.value.pause(); // 暂停音频
                    start_alarm.value = false;
                    show_alarm_stop.value = false;
                }
            }

            generateColumns();
        }
    }



    ws.onclose = (event) => {
        console.log("WebSocket 已关闭:", event);
        scheduleReconnect();  // 调度一个重连
    };

    ws.onerror = (error) => {
        console.log("WebSocket 出错:", error);
    };
}


function assignColorToName(names) {
    let color_list_copy = [...color_list];
    for (let name of names) {
        // 确保color_list_copy不是空的
        if (!color_list_copy.length) {
            color_list_copy = [...color_list];
        }
        let color = color_list_copy.shift();

        // 如果name_color_map中没有这个name，则添加
        if (!name_color_map[name]) {
            name_color_map[name] = color;
        }

        color_list_copy.push(color);
    }
}
function manualReconnect() {
    const scrollArea = monitorTable.value?.$el.querySelector('.el-table__body-wrapper')
    console.log(scrollArea.clientWidth);
    monitorTable.value.setScrollLeft(scrollArea.clientWidth + 1000)
    ws.close();
}
// ------------------------------------------------------------------------------------------------------------websocket相关功能结束----------------------------------------------------------------------------------------------------

const 更新监控的交易所账号 = () => {
    console.log(选中的交易所账号.value)
}

const 重挂止盈 = async (row, position_side, index) => {
    let inputvalues = 0
    try {

        if (position_side == 'LONG') {
            inputvalues = long_inputValues.value[index]
        } else {
            inputvalues = short_inputValues.value[index]
        }
        inputvalues = parseFloat(inputvalues);
    } catch (error) {
        // 如果inputvalues不能转化为小数，则提示错误
        ElMessage({
            message: "重挂止盈失败：请输入正确的数字",
            type: "error"
        });
        return;
    }

    // console.log(long_inputValues, short_inputValues, index, inputvalues, row.exchange_id, row)
    try {
        const res = await api_重挂止盈(row.symbol, row.strategy_id, position_side, inputvalues, row.exchange_id);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "重挂止盈成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "重挂止盈失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "重挂止盈失败：" + error,
            type: "error"
        });
    }
};

const 市价平仓 = async (row, position_side) => {
    // console.log(row, position_side);
    try {
        const res = await api_市价平仓(row.symbol, row.strategy_id, position_side, row.exchange_id);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "市价平仓成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "市价平仓失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "市价平仓失败：" + error,
            type: "error"
        });
    }
};


const 仓位重启 = async (row, position_side) => {
    let 仓位名称 = ''
    if (position_side == 'LONG') {
        仓位名称 = '做多'
    } else {
        仓位名称 = '做空'
    }
    // 先弹一个提示框确定是否暂停
    const res = await ElMessageBox.confirm(`确定要重启 ${仓位名称} 仓位吗？如确定，则会平掉 ${仓位名称} 仓位重新开始！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    console.log(row, position_side);
    try {
        const res = await api_仓位重启(row.symbol, row.strategy_id, position_side, row.exchange_id);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "仓位重启成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "仓位重启失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "仓位重启失败：" + error,
            type: "error"
        });
    }
};


const 暂停补单 = async (row, position_side) => {
    // 先弹一个提示框确定是否暂停
    const res = await ElMessageBox.confirm('确定要暂停补单吗？如暂停补单，则下一次补单会暂停直到恢复补单！止盈单不受影响', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_监控墙_暂停补单(row.symbol, row.strategy_id, position_side, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "暂停补单成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "暂停补单失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "暂停补单失败：" + error,
            type: "error"
        });
    }
}


const 恢复补单 = async (row, position_side, index) => {
    let inputvalues = 0
    try {

        if (position_side == 'LONG') {
            inputvalues = long_cover_inputValues.value[index]
        } else {
            inputvalues = short_cover_inputValues.value[index]
        }
        inputvalues = parseInt(inputvalues);
    } catch (error) {
        // 如果inputvalues不能转化为小数，则提示错误
        ElMessage({
            message: "重挂止盈失败：请输入正确的数字",
            type: "error"
        });
        return;
    }
    try {
        const res = await api_监控墙_恢复补单(row.symbol, row.strategy_id, position_side, inputvalues, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "恢复补单成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "恢复补单失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "恢复补单失败：" + error,
            type: "error"
        });
    }
};



const 暂停 = async (row) => {
    // 先弹一个提示框确定是否暂停
    const res = await ElMessageBox.confirm('确定要暂停吗？如暂停，等解套后则不继续开单！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_暂停(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "暂停成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "暂停失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "暂停失败：" + error,
            type: "error"
        });
    }
};


const 恢复 = async (row) => {
    // console.log(row, position_side);
    try {
        const res = await api_恢复(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "恢复成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "恢复失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "恢复失败：" + error,
            type: "error"
        });
    }
};

const 所有市价平仓 = async (position_side) => {
    let 仓位名称 = ''
    if (position_side == 'LONG') {
        仓位名称 = '做多'
    } else {
        仓位名称 = '做空'
    }
    // 先弹一个提示框确定是否暂停
    const res = await ElMessageBox.confirm(`确定要平掉所有币种的 ${仓位名称} 仓位吗？如确定，则会已市价平掉所有 ${仓位名称} 仓位！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }

    let obj_list = []
    smading_infos_list.value.forEach(item => {
        if (item.hasOwnProperty('做多仓位数量') && item.hasOwnProperty('做空仓位数量')) {
            if (position_side == 'LONG') {
                if (item['做多仓位数量'] > 0) {
                    let obj = {
                        symbol: item.symbol,
                        strategy_id: item.strategy_id,
                        position_side: position_side,
                        exchange_id: item.exchange_id
                    }
                    obj_list.push(obj)
                }
            } else {
                if (item['做空仓位数量'] > 0) {
                    let obj = {
                        symbol: item.symbol,
                        strategy_id: item.strategy_id,
                        position_side: position_side,
                        exchange_id: item.exchange_id
                    }
                    obj_list.push(obj)
                }
            }
        }
    });
    try {
        const res = await api_监控墙_所有市价平仓(obj_list);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: `${仓位名称} 所有市价平仓成功`,
                type: "success"
            });
        } else {
            ElMessage({
                message: `${仓位名称} 所有市价平仓失败：` + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: `${仓位名称} 所有市价平仓失败：` + error,
            type: "error"
        });
    }
};


const 所有暂停 = async () => {
    // 先弹一个提示框确定是否暂停
    const res = await ElMessageBox.confirm('确定要暂停所有币种么吗？如暂停，等解套后则不继续开单！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    let obj_list = []
    smading_infos_list.value.forEach(item => {
        let obj = {
            symbol: item.symbol,
            strategy_id: item.strategy_id,
            exchange_id: item.exchange_id
        }
        obj_list.push(obj)
    });
    try {
        const res = await api_监控墙_所有暂停(obj_list);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "暂停成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "暂停失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "暂停失败：" + error,
            type: "error"
        });
    }
};

const 所有停止 = async () => {
    // 先弹一个提示框确定是否停止
    const res = await ElMessageBox.confirm('确定要停止所有币种么吗？建议点击顺序 暂停=>多空仓位市价平仓=>停止 ！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    let obj_list = []
    smading_infos_list.value.forEach(item => {
        let obj = {
            symbol: item.symbol,
            strategy_id: item.strategy_id,
            exchange_id: item.exchange_id
        }
        obj_list.push(obj)
    });
    try {
        const res = await api_监控墙_所有停止(obj_list);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "停止成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "停止失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "停止失败：" + error,
            type: "error"
        });
    }
};


const 所有重新开始 = async () => {
    let obj_list = []
    smading_infos_list.value.forEach(item => {
        let obj = {
            symbol: item.symbol,
            strategy_id: item.strategy_id,
            exchange_id: item.exchange_id
        }
        obj_list.push(obj)
    });
    try {
        const res = await api_监控墙_所有重新开始(obj_list);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "停止成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "停止失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "停止失败：" + error,
            type: "error"
        });
    }
};


const 停止 = async (row) => {
    // 先弹一个提示框确定是否停止
    const res = await ElMessageBox.confirm('确定要停止吗？建议点击顺序 暂停=>多空仓位市价平仓=>停止 ！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_停止(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "停止成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "停止失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "停止失败：" + error,
            type: "error"
        });
    }
};


const 启动 = async (row) => {
    // 先弹一个提示框确定是否启动
    const res = await ElMessageBox.confirm('确定要启动吗？启动会对当前币种进行平仓撤单操作 ！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_启动(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "启动成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "启动失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "启动失败：" + error,
            type: "error"
        });
    }
};

const 重新启动 = async (row) => {
    // 先弹一个提示框确定是否重新启动
    const res = await ElMessageBox.confirm('确定要重新启动吗？重新启动会平掉所有仓位！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_重新启动(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "重新启动成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "重新启动失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "重新启动失败：" + error,
            type: "error"
        });
    }
};


const 切换成对冲双马丁 = async (row) => {
    // 先弹一个提示框确定是否重新启动
    const res = await ElMessageBox.confirm('确定要切换成对冲双马丁吗？切换成对冲双马丁会平掉所有仓位！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    if (res !== 'confirm') {
        return;
    }
    // console.log(row, position_side);
    try {
        const res = await api_切换成对冲双马丁(row.symbol, row.strategy_id, row.exchange_id);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "切换成对冲双马丁成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "切换成对冲双马丁失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "切换成对冲双马丁失败：" + error,
            type: "error"
        });
    }
};

// ------------------------------------------------------------------------------------------------------------表格统计相关功能开始----------------------------------------------------------------------------------------------------
const columnsToSummarize = {
    '启动资金': 1,
    '账户余额': 1,
    '止盈次数': 0,
    '每小时盈利': 3,
    '做空止盈次数': 0,
    '做多止盈次数': 0,
    '做多止盈总利润': 2,
    '做空止盈总利润': 2,
    '仓位手续费': 4,
    '仓位浮动盈亏': 4,
    '总浮盈(已扣手续费)': 4,
    '止盈总利润': 4,
    '做多仓位价值': 1,
    '做空仓位价值': 1,
    '做空仓位浮动盈亏': 4,
    '做多仓位浮动盈亏': 4,
    '做空总盈利': 4,
    '做多总盈利': 4,
    '总手续费': 4,
    '总盈利': 3
};
function calculateSum(data, decimalPlaces) {
    const sum = data.reduce((acc, curr) => {
        const value = Number(curr);
        return !Number.isNaN(value) ? acc + value : acc;
    }, 0);

    return sum.toFixed(decimalPlaces);
}

const getSummaries = (param) => {
    const { columns, data } = param;
    const sums = [];
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '总计';
            return;
        }
        if (index === 5) {
            sums[5] = (Number(sums[4]) - Number(sums[3])).toFixed(1);
            // console.log(sums[4], sums[3], sums[2]);
            return;
        }
        if (index === 6) {
            // 取这一列的最大值
            const values = data.map((item) => item[column.property]);
            sums[index] = Math.max(...values);
            return;
        }
        const decimalPlaces = columnsToSummarize[column.property];
        if (decimalPlaces !== undefined) {
            const values = data.map((item) => item[column.property]);
            sums[index] = calculateSum(values, decimalPlaces);
            if (column.property === '总盈利') {
                计算总盈利 = parseFloat(sums[index])
                // console.log('计算总盈利', 计算总盈利)
            }
            if (column.property === '仓位浮动盈亏') {
                // 转成小数
                计算仓位浮动盈亏 = parseFloat(sums[index])
                // console.log('计算仓位浮动盈亏', 计算仓位浮动盈亏)
            }
        } else {
            sums[index] = '';
        }
    });

    return sums;
};


const tableRowClassName = ({ row }) => {
    // console.log(row.name, name_color_map[row.name], name_color_map);
    return name_color_map[row.name + '|' + row.交易类型];
}

const cellClassName = ({ row, rowIndex, column, columnIndex }) => {
    if (column.property === '第几次补单') {
        if (row['第几次补单'] >= 10) {
            return 'highlight-cell';
        }
        return 'bold-cell';
    }
    if (column.property === '做空第几次补单') {
        if (row['做空第几次补单'] >= 10) {
            return 'highlight-cell';
        }
        return 'bold-cell';
    }
    if (column.property === '做多第几次补单') {
        if (row['做多第几次补单'] >= 10) {
            return 'highlight-cell';
        }
        return 'bold-cell';
    }
    if (column.property === '是否暂停' && row['是否暂停'] == '是') {
        return 'highlight-cell';
    }
    if (column.property === '是否暂停' && row['是否暂停'] == '是') {
        return 'highlight-cell';
    }
    if (column.property === '多仓暂停补单' && row['多仓暂停补单'] == '是') {
        return 'highlight-cell';
    }
    if (column.property === '空仓暂停补单' && row['空仓暂停补单'] == '是') {
        return 'highlight-cell';
    }
    if (column.property === '仓位浮动盈亏' && row['仓位浮动盈亏'] <= -10) {
        return 'highlight-cell';
    }
    return '';
};
// ------------------------------------------------------------------------------------------------------------表格统计相关功能结束----------------------------------------------------------------------------------------------------

// 用于存储 columns 的响应式数据
// const columns = ref([]);

// // 定义更新 columns 的函数
// const generateColumns = () => {
//     columns.value = [
//         {
//             key: 'column-n-1',
//             width: 50,
//             title: '序号',
//             cellRenderer: ({ rowIndex }) => `${rowIndex + 1}`,
//             align: 'center',
//             fixed: TableV2FixedDir.LEFT
//         },
//         {
//             key: 'name',
//             title: '账号名',
//             dataKey: 'name',
//             width: 80,
//             fixed: 选择框_账号名.value ? 'left' : undefined,
//             align: 'center',
//         },
//         {
//             key: 'symbol',
//             title: '交易对',
//             dataKey: 'symbol',
//             cellRenderer: ({ cellData: symbol }) => <ElTag>{symbol}</ElTag>,
//             align: 'center',
//             fixed: 选择框_交易对.value ? 'left' : undefined,
//             width: 120,
//         },
//         {
//             key: '交易类型',
//             title: '交易类型',
//             dataKey: '交易类型',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '启动资金',
//             title: '启动资金',
//             dataKey: '启动资金',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '账户余额',
//             title: '账户余额',
//             dataKey: '账户余额',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '运行时间',
//             title: '运行时间',
//             dataKey: '运行时间',
//             align: 'center',
//             fixed: 选择框_运行时间.value ? 'left' : undefined,
//             width: 110,
//         },
//         {
//             key: '每小时盈利',
//             title: '每小时盈利',
//             dataKey: '每小时盈利',
//             align: 'center',
//             fixed: 选择框_每小时盈利.value ? 'left' : undefined,
//             width: 100,
//         },
//         {
//             key: '当前权重',
//             title: '当前权重',
//             dataKey: '当前权重',
//             align: 'center',
//             width: 90,
//         },
//         {
//             key: '最新价格',
//             title: '最新价格',
//             dataKey: '最新价格',
//             align: 'center',
//             width: 90,
//         },
//         {
//             key: '止盈次数',
//             title: '止盈次数',
//             dataKey: '止盈次数',
//             align: 'center',
//             width: 90,
//         },
//         {
//             key: '止盈总利润',
//             title: '止盈总利润',
//             dataKey: '止盈总利润',
//             align: 'center',
//             width: 100,
//         },
//         {
//             key: '做空止盈次数',
//             title: '做空止盈次数',
//             dataKey: '做空止盈次数',
//             align: 'center',
//             width: 120,
//         },
//         {
//             key: '做空止盈总利润',
//             title: '做空止盈总利润',
//             dataKey: '做空止盈总利润',
//             align: 'center',
//             width: 130,
//         },
//         {
//             key: '做多止盈次数',
//             title: '做多止盈次数',
//             dataKey: '做多止盈次数',
//             align: 'center',
//             width: 120,
//         },
//         {
//             key: '做多止盈总利润',
//             title: '做多止盈总利润',
//             dataKey: '做多止盈总利润',
//             align: 'center',
//             width: 130,
//         },
//         {
//             key: '触发对冲单次数',
//             title: '触发对冲单次数',
//             dataKey: '触发对冲单次数',
//             align: 'center',
//             width: 130,
//         },
//         {
//             key: '第几次对冲单',
//             title: '第几次对冲单',
//             dataKey: '第几次对冲单',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '第几次补单',
//             title: '第几次补单',
//             dataKey: '第几次补单',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '做空仓位数量',
//             title: '做空仓位数量',
//             dataKey: '做空仓位数量',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '做空仓位价格',
//             title: '做空仓位价格',
//             dataKey: '做空仓位价格',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '做空总盈利',
//             title: '做空总盈利',
//             dataKey: '做空总盈利',
//             align: 'center',
//             width: 100,
//         },
//         {
//             key: '做多仓位数量',
//             title: '做多仓位数量',
//             dataKey: '做多仓位数量',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '做多仓位价格',
//             title: '做多仓位价格',
//             dataKey: '做多仓位价格',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '做多总盈利',
//             title: '做多总盈利',
//             dataKey: '做多总盈利',
//             align: 'center',
//             width: 100,
//         },
//         {
//             key: '仓位手续费',
//             title: '仓位手续费',
//             dataKey: '仓位手续费',
//             align: 'center',
//             width: 100,
//         },
//         {
//             key: '总浮盈(已扣手续费)',
//             title: '总浮盈(已扣手续费)',
//             dataKey: '总浮盈(已扣手续费)',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '当前版本',
//             title: '当前版本',
//             dataKey: '当前版本',
//             align: 'center',
//             width: 110,
//         },
//         {
//             key: '做多本轮时间',
//             title: '做多本轮时间',
//             dataKey: '做多本轮时间',
//             align: 'center',
//             width: 70,
//         },
//         {
//             key: '做多第几次补单',
//             title: (
//                 <div class="highlight-title">做多补单次数</div>
//             ),
//             dataKey: '做多第几次补单',
//             align: 'center',
//             width: 70,
//         },
//         {
//             key: '做多仓位价值',
//             title: '做多仓位价值',
//             dataKey: '做多仓位价值',
//             align: 'center',
//             width: 100,
//         },
//         {
//             key: '做多仓位浮动盈亏',
//             title: '做多仓位浮动盈亏',
//             dataKey: '做多仓位浮动盈亏',
//             align: 'center',
//             width: 100,
//         },
//         {
//             key: '多仓暂停补单',
//             title: '多仓暂停补单',
//             dataKey: '多仓暂停补单',
//             align: 'center',
//             width: 70,
//         },
//         {
//             key: '多仓操作',
//             title: '多仓操作',
//             width: 330,
//             align: 'center',
//             fixed: 选择框_多仓操作.value ? 'right' : undefined,
//             cellRenderer: ({ rowData, rowIndex }) => {
//                 return (
//                     <>
//                         {rowData.多仓暂停补单 === '否' && (
//                             <el-button type="success" size="small" onClick={() => 暂停补单(rowData, 'LONG')} style="margin-right: 3px">
//                                 暂停补单
//                             </el-button>
//                         )}
//                         {rowData.多仓暂停补单 === '是' && (
//                             <>
//                                 <el-input model-value={long_cover_inputValues[rowIndex]} class="w-50 m-2" size="small" placeholder=""
//                                     style="width:30px; margin-right: 3px;" onUpdate: modelValue={val => { long_cover_inputValues[rowIndex] = val; }} />
//                                 <el-button type="success" size="small" onClick={() => 恢复补单(rowData, 'LONG', rowIndex)} style="margin-right: 3px">
//                                     恢复补单
//                                 </el-button>
//                             </>
//                         )}
//                         <el-button type="success" size="small" onClick={() => 市价平仓(rowData, 'LONG')} style="margin-right: 3px">
//                             市价平仓
//                         </el-button>
//                         <el-input model-value={long_inputValues[rowIndex]} class="w-50 m-2" size="small" placeholder=""
//                             style="width:40px; margin-right: 3px;" onUpdate: modelValue={val => { long_inputValues[rowIndex] = val; }} />
//                         <el-button type="success" size="small" onClick={() => 重挂止盈(rowData, 'LONG', rowIndex)}>
//                             重挂止盈
//                         </el-button>
//                     </>
//                 );
//             },
//         },
//         {
//             key: '做空本轮时间',
//             title: '做空本轮时间',
//             dataKey: '做空本轮时间',
//             align: 'center',
//             width: 70,
//         },
//         {
//             key: '做空第几次补单',
//             title: (
//                 <div class="highlight-title">做空补单次数</div>
//             ),
//             dataKey: '做空第几次补单',
//             align: 'center',
//             width: 70,
//         },
//         {
//             key: '做空仓位价值',
//             title: '做空仓位价值',
//             dataKey: '做空仓位价值',
//             align: 'center',
//             width: 100,
//         },
//         {
//             key: '做空仓位浮动盈亏',
//             title: '做空仓位浮动盈亏',
//             dataKey: '做空仓位浮动盈亏',
//             align: 'center',
//             width: 100,
//         },
//         {
//             key: '空仓暂停补单',
//             title: '空仓暂停补单',
//             dataKey: '空仓暂停补单',
//             align: 'center',
//             width: 70,
//         },
//         {
//             key: '空仓操作',
//             title: '空仓操作',
//             width: 330,
//             align: 'center',
//             fixed: 选择框_空仓操作.value ? 'right' : undefined,
//             cellRenderer: ({ rowData, rowIndex }) => {
//                 return (
//                     <>
//                         {rowData.空仓暂停补单 === '否' && (
//                             <el-button type="danger" size="small" onClick={() => 暂停补单(rowData, 'SHORT')} style={{ marginLeft: '0', marginRight: '3px' }}>
//                                 暂停补单
//                             </el-button>
//                         )}
//                         {rowData.空仓暂停补单 === '是' && (
//                             <>
//                                 <el-input
//                                     modelValue={short_cover_inputValues[rowIndex]}
//                                     class="w-50 m-2"
//                                     size="small"
//                                     placeholder=""
//                                     style={{ width: '30px', marginRight: '3px' }}
//                                     onUpdate: modelValue={val => short_cover_inputValues[rowIndex] = val}
//                                 />
//                                 <el-button type="danger" size="small" onClick={() => 恢复补单(rowData, 'SHORT', rowIndex)} style={{ marginLeft: '0', marginRight: '3px' }}>
//                                     恢复补单
//                                 </el-button>
//                             </>
//                         )}
//                         <el-button type="danger" size="small" onClick={() => 市价平仓(rowData, 'SHORT')} style={{ marginLeft: '0', marginRight: '3px' }}>
//                             市价平仓
//                         </el-button>
//                         <el-input
//                             modelValue={short_inputValues[rowIndex]}
//                             class="w-50 m-2"
//                             size="small"
//                             placeholder=""
//                             style={{ width: '45px', marginRight: '3px', marginLeft: '0px' }}
//                             onUpdate: modelValue={val => short_inputValues[rowIndex] = val}
//                         />
//                         <el-button type="danger" size="small" onClick={() => 重挂止盈(rowData, 'SHORT', rowIndex)} style={{ marginLeft: '0', marginRight: '0px' }}>
//                             重挂止盈
//                         </el-button>
//                     </>
//                 );
//             },
//         }
//         ,
//         {
//             key: '需要确认的操作',
//             title: '需要确认的操作',
//             width: 550,
//             align: 'center',
//             fixed: 选择框_需要确认的操作.value ? 'right' : false,
//             cellRenderer: ({ rowData }) => {
//                 return (
//                     <>
//                         <el-button type="success" size="small" onClick={() => 仓位重启(rowData, 'LONG')}>多仓重启</el-button>
//                         <el-button type="danger" size="small" onClick={() => 仓位重启(rowData, 'SHORT')}>空仓重启</el-button>
//                         {rowData.是否暂停 === '否' && (
//                             <el-button type="danger" size="small" onClick={() => 暂停(rowData)}>暂停</el-button>
//                         )}
//                         {rowData.是否暂停 === '是' && (
//                             <el-button type="success" size="small" onClick={() => 恢复(rowData)}>恢复</el-button>
//                         )}
//                         {rowData.是否停止 === '否' && (
//                             <el-button type="danger" size="small" onClick={() => 停止(rowData)}>停止</el-button>
//                         )}
//                         {rowData.是否停止 === '是' && (
//                             <el-button type="success" size="small" onClick={() => 启动(rowData)}>启动</el-button>
//                         )}
//                         <el-button type="danger" size="small" onClick={() => 重新启动(rowData)}>重新启动</el-button>
//                         <el-button type="primary" size="small" onClick={() => 禁止重开(rowData)}>{rowData.禁止重开 === '是' ? '恢复重开' : '禁止重开'}</el-button>
//                     </>
//                 );
//             },
//         },
//         {
//             key: '是否暂停',
//             title: '是否暂停',
//             dataKey: '是否暂停',
//             align: 'center',
//             width: 90,
//         },
//         {
//             key: '是否停止',
//             title: '是否停止',
//             dataKey: '是否停止',
//             align: 'center',
//             width: 90,
//         },
//         {
//             key: '仓位浮动盈亏',
//             title: '仓位浮动盈亏',
//             dataKey: '仓位浮动盈亏',
//             fixed: 选择框_仓位浮动盈亏.value ? 'right' : false,
//             align: 'center',
//             width: 90,
//         },
//         {
//             key: '总手续费',
//             title: '总手续费',
//             dataKey: '总手续费',
//             fixed: 选择框_总手续费.value ? 'right' : false,
//             align: 'center',
//             width: 85,
//         },
//         {
//             key: '总盈利',
//             title: '总盈利',
//             dataKey: '总盈利',
//             align: 'center',
//             fixed: 选择框_总盈利.value ? 'right' : false,
//             width: 100,
//         }
//     ];
// };

// watch([选择框_账号名, 选择框_交易对, 选择框_运行时间, 选择框_仓位浮动盈亏, 选择框_总手续费, 选择框_总盈利, 选择框_多仓操作, 选择框_空仓操作, 选择框_需要确认的操作, 选择框_每小时盈利], ([], []) => {
//     // 当值发生变化时重新生成 columns
//     generateColumns();
// });
</script>
  
<style >
.highlight-title {
    background-color: #406be4;
    color: rgb(255, 255, 255);
}

.el-table .highlight-cell {
    color: red;
    font-weight: bold;
}

.el-table .bold-cell {
    font-weight: bold;
}

.el-table .color-yyn1 {
    background-color: #FFD700;
}

.el-table .color-yyn2 {
    background-color: #f8b1a4;
}

.el-table .color-yyn3 {
    background-color: #d0c3ff;
}

.el-table .color-yyn4 {
    background-color: #b1f8b1;
}

.el-table .color-yyn5 {
    background-color: #b3dbee;
}

.flex-container {
    display: flex;
    align-items: center;
}
</style>
  