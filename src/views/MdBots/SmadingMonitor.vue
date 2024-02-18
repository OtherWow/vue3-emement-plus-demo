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

                <el-col :span="5" style="margin-left: 20px;" v-if="!黑名单 && can_show">

                    <el-input v-model="编辑框净浮盈" placeholder="" @change="净浮盈改变" style="width:380px">
                        <template #prepend>净盈利 <el-text tag="b" :type="显示净盈利 > 0 ? 'success' : 'danger'">
                                {{ 显示净盈利 }}
                            </el-text> 满</template>
                        <template #append>USDT 自动重开<el-tooltip placement="top" effect="dark" class="box-item">
                                <template #content> 净盈利=总盈利+仓位浮动盈亏 (不包含已被禁止重开的币种)<br />
                                    自动重开是指当前运行的策略停止后重新开启,这样被套住的币种就自动解套了
                                </template>
                                <el-icon :span="12" size="20" style="margin-left:2px;margin-top:0px">
                                    <QuestionFilled />
                                </el-icon>
                            </el-tooltip></template>
                    </el-input>


                </el-col>
            </el-row>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1">现货监控墙</el-menu-item>
                <el-menu-item index="2">合约监控墙</el-menu-item>
            </el-menu>
            <el-table id="monitor_table" :data="smading_infos_list" style="width: 100%" :fit="false" border
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

                <el-table-column prop="做多当前挂单数" label="做多当前挂单数" width="90" show-overflow-tooltip
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
                <el-table-column prop="禁止重开" label="禁止重开" width="130" show-overflow-tooltip align="center">
                    <template #default="{ row, $index }">
                        <el-text :tag="row.禁止重开 === '是' ? 'b' : undefined"
                            :type="row.禁止重开 === '是' ? 'danger' : undefined">{{ row.禁止重开 }}<el-button type="primary"
                                style="margin-left: 10px;margin-bottom: 1px;margin-top: 0px;" size="small"
                                @click="禁止重开(row)">{{
                                    row.禁止重开 === '是' ? '恢复重开' : '禁止重开'
                                }}</el-button></el-text>
                    </template>
                </el-table-column>
                <el-table-column prop="止损阈值" label="止损阈值" width="60" show-overflow-tooltip align="center"></el-table-column>

                <el-table-column :fixed="选择框_需要确认的操作 ? 'right' : false" label="需要确认的操作" width="450" align="center">
                    <template #default="{ row, $index }">
                        <el-input v-model="stop_loss_inputValues[$index]" class="w-50 m-2" size="small" placeholder=""
                            style="width:40px;margin-right: 3px;margin-left: 3px;" />
                        <el-button type="danger" size="small" @click="设置止损(row, $index)"
                            style="margin-left:0;margin-right:0px">设置止损</el-button>
                        <el-button type="success" size="small" @click="仓位重启(row, 'LONG')">多仓重启</el-button>
                        <el-button type="danger" size="small" @click="仓位重启(row, 'SHORT')">空仓重启</el-button>
                        <el-button type="danger" size="small" @click="暂停(row)" v-if="row.是否暂停 === '否'">暂停</el-button>
                        <el-button type="success" size="small" @click="恢复(row)" v-if="row.是否暂停 === '是'">恢复</el-button>
                        <el-button type="danger" size="small" @click="停止(row)" v-if="row.是否停止 === '否'">停止</el-button>
                        <el-button type="success" size="small" @click="启动(row)" v-if="row.是否停止 === '是'">启动</el-button>
                        <!-- <el-button type="danger" size="small" @click="重新启动(row)">重新启动</el-button> -->
                        <!-- <el-button type="danger" size="small" @click="切换成对冲双马丁(row)">切换成对冲双马丁</el-button> -->



                    </template>
                </el-table-column>
                <el-table-column prop="是否暂停" label="是否暂停" width="60" show-overflow-tooltip align="center"></el-table-column>

                <el-table-column prop="是否停止" label="是否停止" width="60" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column :fixed="选择框_仓位浮动盈亏 ? 'right' : false" prop="仓位浮动盈亏" label="仓位浮动盈亏" width="110"
                    show-overflow-tooltip align="center"></el-table-column>
                <el-table-column :fixed="选择框_总手续费 ? 'right' : false" prop="总手续费" label="总手续费" width="85"
                    show-overflow-tooltip align="center" v-if="show_profit"></el-table-column>
                <el-table-column :fixed="选择框_总盈利 ? 'right' : false" prop="总盈利" label="总盈利" width="100" show-overflow-tooltip
                    align="center"></el-table-column>


            </el-table>
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
    api_监控墙_禁止重开,
    api_监控墙_设置止损,
    api_监控墙_更新多少usdt自动重开,
    api_监控墙_获取多少usdt自动重开
} from "@/api/smading_strategy_api";
import router from '@/router'; // 确保你的路由实例已经导入
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
// import { useMonitorStore } from '@/store/monitor';
// const monitorStore = useMonitorStore()
let 净浮盈_初始值 = 9999
const 编辑框净浮盈 = ref(净浮盈_初始值)
const 净浮盈改变 = async (value) => {
    if (value === '') {
        编辑框净浮盈.value = 净浮盈_初始值
    }
    if (isNaN(value)) {
        编辑框净浮盈.value = 净浮盈_初始值
    }
    if (value === null) {
        编辑框净浮盈.value = 净浮盈_初始值
    }
    if (value < 0) {
        编辑框净浮盈.value = 净浮盈_初始值
    }
    编辑框净浮盈.value = parseFloat(编辑框净浮盈.value)
    await 更新多少usdt自动重开()
}
const 显示净盈利 = ref(0)
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
const stop_loss_inputValues = ref({});//设置止损的值
let 止损记录map = {}
function handleFilterChange(filters) {
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
const updateHeight = () => {
    if (!document.getElementById('monitor_table')) return;
    monitor_table_height.value = window.innerHeight - 255;
    // console.log(window.innerHeight)
};
const monitorTable = ref(null)
const 黑名单 = ref(false)
onMounted(async () => {
    await 获取多少usdt自动重开()
    window.addEventListener('scroll', function () {
        console.log('滚动事件被触发!')
    })

    if (localStorage.getItem('username') === '徐建煜' || localStorage.getItem('username') === '刘倩' || localStorage.getItem('username') === '徐馥蓉') {
        黑名单.value = true
    }

    if (localStorage.getItem('username') === 'syb' || localStorage.getItem('username') === 'yyn' || localStorage.getItem('username') === 'yyn2') {
        show_profit.value = true
        突出显示的列.value.push('总手续费')
        列名列表.value.push('总手续费')
    } else {
        show_profit.value = false
    }
    更新突出显示的列()
    updateHeight()
    console.log('监控墙页面加载完成,开始连接websocket')
    connectToWebSocket();
    window.addEventListener('resize', updateHeight);
    setTimeout(() => {
        const scrollArea = monitorTable.value?.$el.querySelector('.el-table__body-wrapper')
        monitorTable.value.setScrollLeft(scrollArea.clientWidth + 400);
    }, 300);
});

onBeforeUnmount(() => {
    if (ws) {
        reconnectScheduled = true;
        ws.close();
    }
    window.removeEventListener('resize', updateHeight);

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
    "总手续费",
    "禁止重开",
    "止损阈值",
    "做多当前挂单数",
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

let 自动重开中 = false
function connectToWebSocket() {
    if (ws) {
        console.log('已存在ws,关闭WebSocket连接');
        ws.close();
        ws = null;
    }
    const token = localStorage.getItem('token');
    console.log('开始连接WebSocket:', token);
    ws = new WebSocket(`ws://54.238.137.72:7878/ws/smading/${token}`);

    ws.onopen = (event) => {
        console.log("WebSocket 已连接:", event);
        currentReconnectDelay = INITIAL_RECONNECT_DELAY; // 重置当前的重连延迟
    };

    ws.onmessage = async (event) => {
        const array2d = JSON.parse(event.data);
        // 调用函数，将二维数组转换为对象数组
        const rawData = websocket_数组转对象(array2d);
        console.log("WebSocket 收到消息:", rawData, rawData.error, rawData.error == true);
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
            const versionCheck = (version) => ['v1.0.24', 'v1.0.23', 'v1.0.22', 'v1.0.21', 'v1.0.20', 'v1.0.19', 'v1.0.18', 'v1.0.17'].some(v => version.includes(v));
            let 计算总盈利 = 0;
            let 计算仓位浮动盈亏 = 0;
            let names = new Set();
            let nameAndTypes = new Set();
            let symbols = new Set();
            // 用于存储符合条件的项目,用于表格展示
            let tempSmadingInfos = [];
            // 取出最大补单次数
            let max_long_add_times = 0;
            let max_short_add_times = 0;
            rawData.forEach(item => {
                const { 当前版本, 总盈利, 总手续费, 禁止重开, 仓位浮动盈亏, name, symbol, 交易类型, 做多第几次补单, 做空第几次补单 } = item;
                //版本不符合，新功能不展示
                if (can_show.value && !versionCheck(当前版本)) {
                    can_show.value = false;
                }


                // 数据过滤
                if ((!currentSymbolFilters.value.length || currentSymbolFilters.value.includes(symbol)) &&
                    选中的交易所账号.value.includes(name)) {

                    // 计算总盈利
                    if (总盈利 !== undefined && 总手续费 !== undefined) {
                        item['总盈利'] = (总盈利 - 总手续费).toFixed(4);
                        if (禁止重开 !== '是') {
                            计算总盈利 += parseFloat(item['总盈利']);
                        }
                    }

                    if (仓位浮动盈亏 !== undefined && 禁止重开 !== '是') {
                        计算仓位浮动盈亏 += parseFloat(仓位浮动盈亏);
                    }
                    //下面这2个是用于告警的
                    if (做多第几次补单 !== undefined) {
                        max_long_add_times = Math.max(max_long_add_times, 做多第几次补单);
                    }
                    if (做空第几次补单 !== undefined) {
                        max_short_add_times = Math.max(max_short_add_times, 做空第几次补单);
                    }

                    tempSmadingInfos.push(item);
                }
                // 构建用于过滤和排序的集合
                names.add(name);
                symbols.add(symbol);
                nameAndTypes.add(`${name}|${交易类型}`);
            });
            //表格数据赋值
            smading_infos_list.value = tempSmadingInfos;

            //自动重开的逻辑
            显示净盈利.value = (计算总盈利 + 计算仓位浮动盈亏).toFixed(2);
            if (!黑名单.value && !自动重开中 && can_show.value && 编辑框净浮盈.value > 0 && 显示净盈利.value > 编辑框净浮盈.value) {
                自动重开中 = true
                console.log('计算总盈利 + 计算仓位浮动盈亏', 显示净盈利.value, '编辑框净浮盈.value', 编辑框净浮盈.value)
                await 所有重新开始()
                await 根据止损记录map重设止损()
                // 等待2分钟 防止重复提交
                setTimeout(() => {
                    自动重开中 = false
                }, 20000);
            }

            // 将Set转换为排序后的数组
            const sortedNames = [...names].sort();
            if (选中的交易所账号.value.length == 0) {
                选中的交易所账号.value = [...sortedNames];
            }
            // 根据交易所的名字跟交易类型分配表格颜色
            const sortedNameAndTypes = [...nameAndTypes].sort();
            assignColorToName(sortedNameAndTypes);

            // 设置过滤器值
            nameFilters.value = sortedNames.map(name => ({ text: name, value: name }));
            symbolFilters.value = [...symbols].map(symbol => ({ text: symbol, value: symbol }));

            //告警的逻辑
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

// ------------------------------------------------------------------------------------------------------------websocket相关功能结束----------------------------------------------------------------------------------------------------

const 更新监控的交易所账号 = () => {
    console.log(选中的交易所账号.value)
}

const 设置止损 = async (row, index) => {
    const res = await ElMessageBox.confirm(`确定要设置止损吗？如确定，则会覆盖原来的止损规则！设置后如需取消。可以填-9999后再次点次按钮。`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    });
    let inputvalues = 0
    try {
        inputvalues = stop_loss_inputValues.value[index]
        inputvalues = parseFloat(inputvalues);
        if (inputvalues >= 0) {
            ElMessage({
                message: "设置止损失败：请输入 小于0 的数字",
                type: "error"
            });
            return;
        }

    } catch (error) {
        // 如果inputvalues不能转化为小数，则提示错误
        ElMessage({
            message: "设置止损失败：请输入正确的数字",
            type: "error"
        });
        return;
    }
    try {
        const _data = {
            "stop_loss_value": inputvalues,
            "symbol": row.symbol,
            "strategy_id": row.strategy_id,
            "exchange_id": row.exchange_id
        }
        const res = await api_监控墙_设置止损(_data);
        // console.log("res", res);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "设置止损成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "设置止损失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "设置止损失败：" + error,
            type: "error"
        });
    }
};


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
        const res = await api_市价平仓(row.symbol, row.strategy_id, position_side, row.exchange_id, row.交易类型);
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

const 根据止损记录map重设止损 = async () => {
    //遍历止损记录map
    for (const key in 止损记录map) {
        if (Object.hasOwnProperty.call(止损记录map, key)) {
            const _data = 止损记录map[key];
            console.log(_data)
            await api_监控墙_设置止损(_data);
        }
    }
}
const 所有重新开始 = async () => {
    let obj_list = []
    smading_infos_list.value.forEach(item => {
        let obj = {
            symbol: item.symbol,
            strategy_id: item.strategy_id,
            exchange_id: item.exchange_id,
            net_profit: 显示净盈利.value,
        }
        const key = item.strategy_id + item.symbol + item.exchange_id
        const _data = {
            'symbol': item.symbol,
            'strategy_id': item.strategy_id,
            'exchange_id': item.exchange_id,
            'stop_loss_value': item.止损阈值,
        }
        //判断key是不是在止损记录map，不在则添加，在则覆盖，如果inputvalues为-9999则删除
        if (item.止损阈值 === -9999 || item.止损阈值 === '') {
            delete 止损记录map[key]
        } else {
            止损记录map[key] = _data
        }
        obj_list.push(obj)
    });
    try {
        console.log('止损记录map', 止损记录map)
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


const 更新多少usdt自动重开 = async () => {
    try {
        const _data = {
            'how_much_restart_monitor': 编辑框净浮盈.value
        }
        const res = await api_监控墙_更新多少usdt自动重开(_data);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "失败：" + error,
            type: "error"
        });
    }
};

const 获取多少usdt自动重开 = async () => {
    try {
        const res = await api_监控墙_获取多少usdt自动重开();
        if (res.status === 200 && res.data.code === 200) {
            编辑框净浮盈.value = res.data.data['how_much_restart_monitor']
        } else {
            ElMessage({
                message: "失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "失败：" + error,
            type: "error"
        });
    }
};


const 禁止重开 = async (row) => {
    try {
        const _data = {
            'symbol': row.symbol,
            'strategy_id': row.strategy_id,
            'exchange_id': row.exchange_id
        }
        const res = await api_监控墙_禁止重开(_data);
        if (res.status === 200 && res.data.code === 200) {
            ElMessage({
                message: "成功",
                type: "success"
            });
        } else {
            ElMessage({
                message: "失败：" + res.data.msg,
                type: "error"
            });
        }
    } catch (error) {
        ElMessage({
            message: "失败：" + error,
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
    // console.log("columns", columns, data)
    const sums = [];
    const sums2 = [];
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
        // if 
        const decimalPlaces = columnsToSummarize[column.property];
        if (decimalPlaces !== undefined) {
            const values = data.map((item) => item[column.property]);
            sums[index] = calculateSum(values, decimalPlaces);
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
    if (column.property === '禁止重开' && row['禁止重开'] == '是') {
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


</script>
  
<style >
.el-table .highlight-title {
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
  