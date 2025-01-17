<template>
	<el-container>
		<el-main style="padding: 5px">
			<el-card body-style="padding-bottom: 0px;padding-top: 0px;" style="margin-bottom: 10px">
				<el-row :gutter="20" style="margin-top: 20px">
					<!-- <el-col :span="4">
                    <el-button type="primary" @click="manualReconnect()">重新连接websocket服务器</el-button>

                </el-col> -->
					<el-col :xs="24" :sm="12" :md="7" :lg="3" :xl="3" style="margin-bottom: 20px">
						<el-select v-model="选中的交易所账号" @change="更新监控的交易所账号()" clearable placeholder="选择要监控的交易所账号" style="width: 100%" multiple filterable collapse-tags collapse-tags-tooltip>
							<el-option v-for="item in nameFilters" :key="item.value" :label="item.text" :value="item.value" />
						</el-select>
					</el-col>
					<el-col :xs="24" :sm="12" :md="7" :lg="4" :xl="4" style="margin-bottom: 20px">
						<el-select v-model="突出显示的列" @change="更新突出显示的列()" clearable placeholder="选择要突出显示的列" style="width: 100%" multiple filterable collapse-tags collapse-tags-tooltip>
							<el-option v-for="item in 列名列表" :key="item" :label="item" :value="item" />
						</el-select>
					</el-col>

					<el-col :xs="24" :sm="24" :md="10" :lg="6" :xl="6" style="margin-bottom: 20px">
						<el-input v-model="编辑框净浮盈" placeholder="" @change="净浮盈改变()" style="width: 380px">
							<template #prepend>
								净盈利
								<el-text tag="b" :type="显示净盈利 > 0 ? 'success' : 'danger'">
									{{ 显示净盈利 }}
								</el-text>
								满
							</template>
							<template #append>
								USDT 自动重开
								<el-tooltip placement="top" effect="dark" class="box-item">
									<template #content>
										净盈利=总盈利+仓位浮动盈亏 (不包含已被禁止重开的币种)
										<br />
										自动重开是指当前运行的策略停止后重新开启,这样被套住的币种就自动解套了
									</template>
									<el-icon :span="12" size="20" style="margin-left: 2px; margin-top: 0px">
										<QuestionFilled />
									</el-icon>
								</el-tooltip>
							</template>
						</el-input>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="11" :xl="11" style="margin-bottom: 20px">
						<el-button-group>
							<el-button type="primary" @click="展示操作面板 = true">打开操作面板</el-button>
							<el-button type="primary" @click="dialogVisible = true">打开监控墙功能说明</el-button>
						</el-button-group>
					</el-col>

					<!-- <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6"  style="margin-left: 20px">
					<el-checkbox v-model="open_alarm" label="开启告警" @change="checkAudioSelected" />
					<el-input v-model="alarm_num" placeholder="第几单开启告警" clearable style="width: 120px; margin-bottom: 3px; margin-left: 5px" />
					 播放音频文件按钮
					<el-button @click="stop_alarm" :disabled="!audioSrc" v-if="show_alarm_stop" style="margin-bottom: 3px; margin-left: 3px">
						<el-icon size="24px">
							<template v-if="is_playing">
								<VideoPause />
							</template>
							<template v-else>
								<VideoPlay />
							</template>
						</el-icon>
					</el-button>
					 选择音频文件按钮 
					<el-button @click="selectAudioFile" style="margin-bottom: 3px; margin-left: 3px">选择音频文件</el-button>
					<input type="file" ref="audioInput" @change="handleAudioSelect" style="display: none" accept="audio/*" />
					 显示所选音频文件的文件名
					<el-text v-if="audioName" type="success" size="small" truncated>{{ audioName }}</el-text>

					音频播放器 
					<audio ref="audioPlayer" :src="audioSrc"></audio>
				</el-col> -->
				</el-row>
			</el-card>
			<el-card>
				<template #header>
					<div class="card-header">
						<el-text style="font-weight: bold; font-size: 16px" type="danger">使用前请点击右上角【监控墙功能说明】仔细阅读！！！！！</el-text>
					</div>
				</template>
				<el-table id="monitor_table" :data="smading_infos_list" style="width: 100%" :fit="true" border highlight-current-row :summary-method="getSummaries" show-summary :height="monitor_table_height" :row-class-name="tableRowClassName" :cell-class-name="cellClassName" @filter-change="handleFilterChange" scrollbar-always-on show-overflow-tooltip ref="monitorTable" size="small" row-key="id">
					<el-table-column :fixed="选择框_序号 ? 'left' : false" type="index" width="55" label="序号" align="center" />
					<el-table-column :fixed="选择框_账号名 ? 'left' : false" prop="name" label="账号名" width="80" show-overflow-tooltip align="center"></el-table-column>

					<el-table-column :fixed="选择框_交易对 ? 'left' : false" prop="symbol" label="交易对" width="120" show-overflow-tooltip align="center" :filters="symbolFilters" filter-placement="bottom-end" column-key="symbol">
						<template #default="scope">
							<el-tag type="info" effect="dark">{{ scope.row.symbol }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="策略名称" label="策略名称" width="200" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="交易所" label="交易所" width="110" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="交易类型" label="交易类型" width="110" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="当前版本" label="当前版本" width="110" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="启动资金" label="启动资金" width="130" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="账户余额" label="账户余额" width="130" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column :fixed="选择框_运行时间 ? 'left' : false" prop="运行时间" label="运行时间" width="90" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column :fixed="选择框_每小时盈利 ? 'left' : false" prop="每小时盈利" label="每小时盈利" width="100" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="止盈次数" label="止盈次数" width="90" show-overflow-tooltip align="center" v-if="can_show_all"></el-table-column>
					<el-table-column prop="运行状态" label="运行状态" width="100" show-overflow-tooltip align="center" v-if="can_show_all"></el-table-column>
					<el-table-column prop="最新价格" label="最新价格" width="130" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="做多止盈次数" label="做多止盈次数" width="60" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.long_show_button ? row.做多止盈次数 : '' }}</el-text>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="做多手续费" label="做多手续费" width="120" show-overflow-tooltip align="center" v-if="can_show_long"></el-table-column> -->
					<el-table-column prop="做多总盈利" label="做多总盈利" width="90" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.long_show_button ? row.做多总盈利 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做多补单次数" label="做多补单次数" width="60" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #header="{ column }">
							<div class="highlight-title">{{ column.label }}</div>
						</template>
						<template #default="{ row, $index }">
							<el-text size="small" :class="row.做多补单次数 >= 10 ? 'highlight-cell' : 'bold-cell'">{{ row.long_show_button ? row.做多补单次数 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做多挂单数量" label="做多挂单数量" width="60" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.long_show_button ? row.做多挂单数量 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做多止盈单数量" label="做多止盈单数量" width="120" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small" :class="row.做多止盈单数量 != Math.abs(row.做多仓位数量) ? 'highlight-cell' : ''">{{ row.long_show_button ? row.做多止盈单数量 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做多仓位数量" label="做多仓位数量" width="120" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.long_show_button ? row.做多仓位数量 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做多仓位价格" label="做多仓位价格" width="120" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.long_show_button ? row.做多仓位价格 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做多持仓价值" label="做多持仓价值" width="100" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small" :class="row.做多持仓价值 >= 1000 ? 'highlight-cell' : 'bold-cell'">{{ row.long_show_button ? row.做多持仓价值 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做多仓位浮动盈亏" label="做多仓位浮动盈亏" width="90" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.long_show_button ? row.做多仓位浮动盈亏 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做多本轮时间" label="做多本轮时间" width="90" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.long_show_button ? row.做多本轮时间 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做多运行状态" label="做多运行状态" width="60" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.long_show_button ? row.做多运行状态 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做多重挂止盈" label="做多重挂止盈" width="60" show-overflow-tooltip align="center" v-if="can_show_long">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.long_show_button ? row.做多重挂止盈 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column :fixed="选择框_多仓操作 ? 'right' : false" label="多仓操作" width="490" align="center" v-if="can_show_long">
						<template #header="{ column }">
							<div class="success-title">{{ column.label }}</div>
						</template>
						<template #default="{ row, $index }">
							<!-- <el-button type="success" size="small" @click="暂停补单(row, 'LONG')" style="margin-left: 0; margin-right: 3px" v-if="row.多仓暂停补单 === '否'">暂停补单</el-button>
						<el-input v-model="long_cover_inputValues[$index]" class="w-50 m-2" size="small" placeholder="" style="width: 30px; margin-right: 3px" v-if="row.多仓暂停补单 === '是'" />
						<el-button type="success" size="small" @click="恢复补单(row, 'LONG', $index)" style="margin-left: 0; margin-right: 3px" v-if="row.多仓暂停补单 === '是'">恢复补单</el-button> -->

							<el-input v-model="long_inputValues[$index]" class="w-50 m-2" size="small" placeholder="" style="width: 40px; margin-right: 3px; margin-left: 0px" v-if="row.做多运行状态 != '已停止' && row.long_show_button" />
							<el-button type="primary" size="small" @click="重挂止盈(row, 'LONG', $index)" style="margin-left: 0; margin-right: 3px" v-if="row.做多运行状态 != '已停止' && row.long_show_button">重挂止盈</el-button>
							<el-button type="primary" size="small" @click="撤单平仓(row, 'LONG')" style="margin-left: 0; margin-right: 3px" v-if="row.做多运行状态 != '已停止' && row.long_show_button">撤单平仓</el-button>
							<el-button type="primary" size="small" @click="一键清仓(row, 'LONG')" style="margin-left: 0; margin-right: 3px" v-if="row.做多运行状态 != '已停止' && row.long_show_button">一键清仓</el-button>
							<el-button type="primary" size="small" @click="仓位重启(row, 'LONG')" style="margin-left: 0; margin-right: 3px" v-if="row.做多运行状态 != '已停止' && row.long_show_button">多仓重启</el-button>
							<el-button type="danger" size="small" @click="单个暂停(row, 'LONG')" v-if="row.做多运行状态 === '运行中' && row.long_show_button" style="margin-left: 0; margin-right: 3px">暂停</el-button>
							<el-button type="success" size="small" @click="单个恢复(row, 'LONG')" v-if="row.做多运行状态 === '暂停中' && row.long_show_button" style="margin-left: 0; margin-right: 3px">恢复</el-button>
							<el-button type="danger" size="small" @click="单个停止(row, 'LONG')" v-if="row.做多运行状态 != '已停止' && row.long_show_button" style="margin-left: 0; margin-right: 3px">停止</el-button>
						</template>
					</el-table-column>

					<el-table-column prop="做空止盈次数" label="做空止盈次数" width="60" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.short_show_button ? row.做空止盈次数 : '' }}</el-text>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="做空手续费" label="做空手续费" width="120" show-overflow-tooltip align="center" v-if="can_show_short"></el-table-column> -->
					<el-table-column prop="做空总盈利" label="做空总盈利" width="90" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.short_show_button ? row.做空总盈利 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做空补单次数" label="做空补单次数" width="60" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #header="{ column }">
							<div class="highlight-title">{{ column.label }}</div>
						</template>
						<template #default="{ row, $index }">
							<el-text size="small" :class="row.做空补单次数 >= 10 ? 'highlight-cell' : 'bold-cell'">{{ row.short_show_button ? row.做空补单次数 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做空挂单数量" label="做空挂单数量" width="60" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.short_show_button ? row.做空挂单数量 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做空止盈单数量" label="做空止盈单数量" width="120" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small" :class="row.做空止盈单数量 != Math.abs(row.做空仓位数量) ? 'highlight-cell' : ''">{{ row.short_show_button ? row.做空止盈单数量 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做空仓位数量" label="做空仓位数量" width="120" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.short_show_button ? row.做空仓位数量 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做空仓位价格" label="做空仓位价格" width="120" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.short_show_button ? row.做空仓位价格 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做空持仓价值" label="做空持仓价值" width="100" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small" :class="row.做空持仓价值 <= -1000 ? 'highlight-cell' : 'bold-cell'">{{ row.short_show_button ? row.做空持仓价值 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做空仓位浮动盈亏" label="做空仓位浮动盈亏" width="90" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.short_show_button ? row.做空仓位浮动盈亏 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做空本轮时间" label="做空本轮时间" width="90" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.short_show_button ? row.做空本轮时间 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做空运行状态" label="做空运行状态" width="60" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.short_show_button ? row.做空运行状态 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="做空重挂止盈" label="做空重挂止盈" width="60" show-overflow-tooltip align="center" v-if="can_show_short">
						<template #default="{ row, $index }">
							<el-text size="small">{{ row.short_show_button ? row.做空重挂止盈 : '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column :fixed="选择框_空仓操作 ? 'right' : false" label="空仓操作" width="490" align="center" v-if="can_show_short">
						<template #header="{ column }">
							<div class="danger-title">{{ column.label }}</div>
						</template>
						<template #default="{ row, $index }">
							<el-input v-model="short_inputValues[$index]" class="w-50 m-2" size="small" placeholder="" style="width: 40px; margin-right: 3px; margin-left: 0px" v-if="row.做空运行状态 != '已停止' && row.short_show_button" />
							<el-button type="primary" size="small" @click="重挂止盈(row, 'SHORT', $index)" style="margin-left: 0; margin-right: 3px" v-if="row.做空运行状态 != '已停止' && row.short_show_button">重挂止盈</el-button>
							<el-button type="primary" size="small" @click="撤单平仓(row, 'SHORT')" style="margin-left: 0; margin-right: 3px" v-if="row.做空运行状态 != '已停止' && row.short_show_button">撤单平仓</el-button>
							<el-button type="primary" size="small" @click="一键清仓(row, 'SHORT')" style="margin-left: 0; margin-right: 3px" v-if="row.做空运行状态 != '已停止' && row.short_show_button">一键清仓</el-button>
							<el-button type="primary" size="small" @click="仓位重启(row, 'SHORT')" style="margin-left: 0; margin-right: 3px" v-if="row.做空运行状态 != '已停止' && row.short_show_button">空仓重启</el-button>
							<el-button type="danger" size="small" @click="单个暂停(row, 'SHORT')" v-if="row.做空运行状态 === '运行中' && row.short_show_button" style="margin-left: 0; margin-right: 3px">暂停</el-button>
							<el-button type="success" size="small" @click="单个恢复(row, 'SHORT')" v-if="row.做空运行状态 === '暂停中' && row.short_show_button" style="margin-left: 0; margin-right: 3px">恢复</el-button>
							<el-button type="danger" size="small" @click="单个停止(row, 'SHORT')" v-if="row.做空运行状态 != '已停止' && row.short_show_button" style="margin-left: 0; margin-right: 3px">停止</el-button>
						</template>
					</el-table-column>

					<!-- <el-table-column prop="禁止重开" label="禁止重开" width="130" show-overflow-tooltip align="center">
					<template #default="{ row, $index }">
						<el-text :tag="row.禁止重开 === '是' ? 'b' : undefined" :type="row.禁止重开 === '是' ? 'danger' : undefined">
							{{ row.禁止重开 }}
							<el-button type="primary" style="margin-left: 10px; margin-bottom: 1px; margin-top: 0px" size="small" @click="禁止重开(row)">{{ row.禁止重开 === '是' ? '恢复重开' : '禁止重开' }}</el-button>
						</el-text>
					</template>
				</el-table-column> -->
					<!-- <el-table-column prop="止损阈值" label="止损阈值" width="60" show-overflow-tooltip align="center"></el-table-column> -->

					<el-table-column :fixed="选择框_总仓位浮动盈亏 ? 'right' : false" prop="总仓位浮动盈亏" label="总仓位浮动盈亏" width="110" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column :fixed="选择框_总手续费 ? 'right' : false" prop="总手续费" label="总手续费" width="85" show-overflow-tooltip align="center" v-if="false"></el-table-column>
					<el-table-column :fixed="选择框_总盈利 ? 'right' : false" prop="总盈利" label="总盈利" width="100" show-overflow-tooltip align="center"></el-table-column>
				</el-table>
			</el-card>
		</el-main>
	</el-container>

	<el-dialog v-model="展示操作面板" width="80%" top="15vh" title="操作面板">
		<el-card style="margin-left: 10px; margin-right: 10px">
			<template #header>
				<div class="card-header">
					<span style="font-weight: bold; font-size: 16px">操作分区</span>
				</div>
			</template>
			<el-row style="margin-left: 10px; margin-bottom: 10px">
				<el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
					<el-button-group>
						<el-button type="success" @click="全部撤单平仓('LONG')">全部做多仓位 撤单平仓</el-button>
						<el-button type="success" @click="全部一键清仓('LONG')">全部做多仓位 一键清仓</el-button>
					</el-button-group>
				</el-col>
				<el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8">
					<el-button-group>
						<el-button type="danger" @click="全部撤单平仓('SHORT')">全部做空仓位 撤单平仓</el-button>
						<el-button type="danger" @click="全部一键清仓('SHORT')">全部做空仓位 一键清仓</el-button>
					</el-button-group>
				</el-col>
				<el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
					<el-button-group>
						<el-button type="danger" @click="全部暂停()">全部暂停</el-button>
						<el-button type="success" @click="全部恢复()">全部恢复</el-button>
						<el-button type="danger" @click="全部停止()">全部停止</el-button>
					</el-button-group>
				</el-col>
			</el-row>
		</el-card>

		<el-card style="margin-left: 10px; margin-right: 10px; margin-top: 20px">
			<template #header>
				<div class="card-header">
					<span style="font-weight: bold; font-size: 16px">快速启动</span>
				</div>
			</template>
			<el-row>
				<el-col :span="24">
					<el-form :model="form_data" label-width="auto">
						<el-row :gutter="20" style="margin-top: 15px">
							<el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="8">
								<el-form-item label="策略">
									<el-select v-model="form_data.strategy_id" filterable clearable placeholder="请选择">
										<template #header>
											<el-text type="primary" style="margin-left: 10px">持仓方向 | 策略名称 | 总盈利 | 运行中数量 | 运行中盈利</el-text>
										</template>
										<el-option v-for="item in strategy_options" :key="item.value" :label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="5">
								<el-form-item label="账号">
									<el-select v-model="form_data.exchange_id_list" multiple filterable clearable placeholder="支持多选">
										<template #header>
											<el-text type="primary" style="margin-left: 10px">交易所 | 交易所账号</el-text>
										</template>
										<el-option v-for="item in exchange_options" :key="item.value" :label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-col>

							<el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="3">
								<el-form-item label="交易类型">
									<el-select v-model="form_data.trade_type" placeholder="请选择">
										<el-option v-for="item in trade_type_options" :key="item.value" :label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-col>

							<el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="5">
								<el-form-item label="交易对">
									<el-select v-model="form_data.symbol_list" clearable multiple filterable allow-create placeholder="支持多选 现货交易对" v-if="form_data.trade_type === 'spot'">
										<template #header>
											<el-text type="primary" style="margin-left: 10px">交易对 | 最新价格</el-text>
										</template>
										<el-option v-for="item in binance_spot_usdt_symbols" :key="item.value" :label="item.label" :value="item.value" />
									</el-select>
									<el-select v-model="form_data.symbol_list" clearable multiple filterable allow-create placeholder="支持多选 合约交易对" v-if="form_data.trade_type === 'features'">
										<template #header>
											<el-text type="primary" style="margin-left: 10px">交易对 | 最新价格</el-text>
										</template>
										<el-option v-for="item in binance_features_usdt_symbols" :key="item.value" :label="item.label" :value="item.value" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="8" :md="8" :lg="6" :xl="3">
								<el-button type="primary" @click="确认启动马丁()" style="margin-left: 20px">启动马丁</el-button>
							</el-col>
						</el-row>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
		<template #footer>
			<div class="dialog-footer" style="margin-right: 10px">
				<el-button type="primary" @click="展示操作面板 = false">确认</el-button>
			</div>
		</template>
	</el-dialog>

	<el-dialog v-model="dialogVisible" width="60%" top="15vh">
		<el-card style="margin-left: 10px; margin-right: 10px">
			<template #header>
				<div class="card-header">
					<span style="font-weight: bold; font-size: 16px">监控墙功能说明</span>
				</div>
			</template>
			<el-row style="margin-left: 10px; margin-bottom: 10px">
				<el-text style="font-weight: bold" type="danger">重挂止盈:</el-text>
				<el-text style="margin-left: 20px; margin-top: 5px">重挂止盈左边有一个编辑框，在框内输入数字后点击重挂止盈，即可把当前行币种的止盈改成编辑框中的数字，直到本轮结束。</el-text>
				<el-text style="margin-left: 20px">例如: 设置-2，然后点击重挂止盈后，这轮的止盈就是亏2u，后续吃进补单挂的止盈也是亏2u。当仓位比较重时亏点跑了，或者看行情比较好希望多赚点都可以使用此功能。当本轮结束后会自动恢复策略预设的止盈。</el-text>
			</el-row>
			<el-row style="margin-left: 10px; margin-bottom: 10px">
				<el-text style="font-weight: bold" type="danger">撤单平仓:</el-text>
				<el-text style="margin-left: 20px; margin-top: 5px">撤销本轮挂的补单，止盈单。并以市价平掉本轮创建的仓位。注意这里的仓位不是该币种的全部仓位！！</el-text>
			</el-row>
			<el-row style="margin-left: 10px; margin-bottom: 10px">
				<el-text style="font-weight: bold" type="danger">一键清仓:</el-text>
				<el-text style="margin-left: 20px; margin-top: 5px">撤销该币种当前持仓方向(做多或者做空)的全部挂单，并以市价平掉该币种当前持仓方向上的全部仓位。</el-text>
				<el-text style="margin-left: 20px">例如: 点击的是做多的一键清仓。那么该币种的做多方向上的仓位会被清仓，且做多方向上的所有挂单会被撤销。</el-text>
			</el-row>
			<el-row style="margin-left: 10px; margin-bottom: 10px">
				<el-text style="font-weight: bold" type="danger">多仓重启:</el-text>
				<el-text style="margin-left: 20px; margin-top: 5px">多仓重启=撤销平仓+重新启动 当通过撤销平仓、一键清仓、停止或者手动在交易所平仓了之后，希望重新开启策略就可以点击此按钮。</el-text>
			</el-row>
			<el-row style="margin-left: 10px; margin-bottom: 10px">
				<el-text style="font-weight: bold" type="danger">暂停:</el-text>
				<el-text style="margin-left: 20px; margin-top: 5px">暂停的意思是暂停开启新的马丁，不是暂停挂单！！！！点击暂停后，运行状态变更为【已暂停】。此时还会继续补单，挂止盈单，直到本轮解套止盈后，不会开启新的马丁。</el-text>
				<el-text style="margin-left: 20px">适用场景: 这个币不想挂了，但是又不想割肉，就可以点暂停，等马丁解套后再关闭该币种。</el-text>
			</el-row>
			<el-row style="margin-left: 10px; margin-bottom: 10px">
				<el-text style="font-weight: bold" type="danger">停止:</el-text>
				<el-text style="margin-left: 20px; margin-top: 5px">点击停止后，运行状态变更为【已停止】。后台程序会立刻停止对该币种的控制。不再监控补单、止盈单。注意：停止后再点启动，是开启一个新的马丁，无法继续之前停止的马丁！！！！</el-text>
			</el-row>
			<el-row style="margin-left: 10px; margin-bottom: 10px">
				<el-text style="font-weight: bold" type="danger">净盈利xx满xx USDT自动重开:</el-text>
				<el-text style="margin-left: 20px; margin-top: 5px">默认9999,在编辑框设置了之后，当净盈利大于编辑框中的内容时，会把监控墙上的所有币种，撤销平仓，然后开启新的马丁。</el-text>
				<el-text style="margin-left: 20px">功能说明: 马丁的好处就在于解套之后抗打击能力可以完全恢复，所以适时重开，可以把一些被套住的马丁重新释放，使得策略更加抗打击。</el-text>
			</el-row>
		</el-card>
		<template #footer>
			<div class="dialog-footer" style="margin-right: 10px">
				<el-button type="primary" @click="dialogVisible = false">确认</el-button>
			</div>
		</template>
	</el-dialog>

	<el-dialog v-model="dialogVisiblemd" title="重要提示" width="500" :before-close="handleClose" top="15vh">
		<span>确认参数无误后，点击确认按钮即可开启马丁。</span>
		<br />
		<el-text class="mx-1" type="danger" style="font-weight: bolder">请勿多次点击确认按钮，多次点击会开启多个马丁！！</el-text>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogVisiblemd = false">取消</el-button>
				<el-button type="primary" @click="启动马丁()" :loading="start_md_loading">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { api_get_binance_api_usdt_symbols } from '@/api/binance_api'
import { api_get_binance_fapi_usdt_symbols } from '@/api/binance_fapi'
import { api_get_exchanges_all_simple } from '@/api/exchange_infos_api'
import { api_batch_一键清仓, api_batch_撤单平仓, api_get_strategy_page, api_run_info_pause, api_run_info_run, api_run_info_start, api_run_info_stop, api_一键清仓, api_仓位重启, api_撤单平仓, api_重挂止盈 } from '@/api/smading_strategy_api'
import router from '@/router' // 确保你的路由实例已经导入
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const form_data = ref({
	trade_type: 'spot',
})
const trade_type_options = ref([
	{ value: 'spot', label: '现货' },
	{ value: 'features', label: '合约' },
])
const binance_spot_usdt_symbols = ref([])
const binance_features_usdt_symbols = ref([])
const start_md_loading = ref(false)
const exchange_options = ref([]) // 交易所下拉框
const strategy_options = ref([]) // 策略下拉框
let strategy_dict = {} // 策略列表
const dialogVisiblemd = ref(false)
const dialogVisible = ref(false)
const 展示操作面板 = ref(false)
const can_show_long = ref(false)
const can_show_short = ref(false)
const can_show_all = ref(false)
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
const audioInput = ref(null)
const audioPlayer = ref(null)
const audioSrc = ref('')
const audioName = ref('')
const alarm_num = ref(null)
const open_alarm = ref(false)
const show_alarm_stop = ref(false)
const is_playing = ref(true)
let timer = null
const start_alarm = ref(false)
// watch(start_alarm, (newValue) => {
// 	if (newValue) {
// 		playAudio() // 直接播放音频
// 		// 监听音频播放完成事件
// 		audioPlayer.value.addEventListener('ended', handleAudioEnded)
// 	} else {
// 		// 移除监听
// 		audioPlayer.value.removeEventListener('ended', handleAudioEnded)
// 	}
// })
// 打开文件选择对话框
const selectAudioFile = () => {
	audioInput.value.click()
}

const handleAudioEnded = () => {
	if (is_playing.value) {
		// 音频播放完成后，如果open_alarm仍为true，则再次播放
		playAudio()
	}
}

// 处理选择的音频文件
const handleAudioSelect = (event) => {
	const files = event.target.files
	if (files.length > 0) {
		const file = files[0]

		audioSrc.value = URL.createObjectURL(file)
		audioName.value = file.name // 更新文件名
	}
}

const stop_alarm = () => {
	if (is_playing.value) {
		is_playing.value = false
		audioPlayer.value.pause() // 暂停音频
	} else {
		is_playing.value = true
		show_alarm_stop.value = false
		start_alarm.value = false
	}
}
// 播放选中的音频文件
const playAudio = () => {
	audioPlayer.value.currentTime = 0 // 从头开始
	audioPlayer.value.play()
}

const checkAudioSelected = (value) => {
	if (value) {
		if (!audioSrc.value) {
			ElMessage({
				message: '请先选择一个音频文件！',
				type: 'error',
			})
			open_alarm.value = false // 可选择将复选框取消勾选
		}
		console.log(alarm_num.value, isNaN(alarm_num.value), alarm_num.value < 0)
		if (alarm_num.value === null || isNaN(alarm_num.value) || alarm_num.value <= 0) {
			ElMessage({
				message: '请先输入大于多少单告警！',
				type: 'error',
			})
			open_alarm.value = false // 可选择将复选框取消勾选
		}
	}
}

// ------------------------------------------------------------------------------------------------------------初始化选择框----------------------------------------------------------------------------------------------------
const show_profit = ref(false)
const 选择框_序号 = ref(true)
const 选择框_账号名 = ref(true)
const 选择框_交易对 = ref(true)
const 选择框_运行时间 = ref(false)
const 选择框_总仓位浮动盈亏 = ref(true)
const 选择框_总手续费 = ref(false)
const 选择框_总盈利 = ref(true)
const 选择框_多仓操作 = ref(false)
const 选择框_空仓操作 = ref(false)
const 选择框_需要确认的操作 = ref(false)
const 选择框_每小时盈利 = ref(false)
// ------------------------------------------------------------------------------------------------------------筛选相关功能开始----------------------------------------------------------------------------------------------------

const currentSymbolFilters = ref([]) // 默认为空数组，表示没有筛选
const nameFilters = ref([])
const 列名列表 = ref(['序号', '账号名', '交易对', '运行时间', '每小时盈利', '总仓位浮动盈亏', '总盈利', '多仓操作', '空仓操作', '需要确认的操作'])
const 突出显示的列 = ref(['序号', '账号名', '交易对', '总仓位浮动盈亏', '总盈利'])
const symbolFilters = ref([])
const 选中的交易所账号 = ref([]) //选中的交易所账号
const short_inputValues = ref({}) //空仓重挂止盈的百分比
const long_inputValues = ref({}) //多仓重挂止盈的百分比
const short_cover_inputValues = ref({}) //空仓恢复补单
const long_cover_inputValues = ref({}) //多仓恢复补单
const stop_loss_inputValues = ref({}) //设置止损的值
let 止损记录map = {}
function handleFilterChange(filters) {
	if (filters.hasOwnProperty('symbol')) {
		currentSymbolFilters.value = filters.symbol || []
	}
}
const 更新突出显示的列 = () => {
	// 遍历突出显示的列,如果在突出显示的列中，则将其设置为true，否则设置为false
	let highlightedColumns = {
		序号: false,
		账号名: false,
		交易对: false,
		运行时间: false,
		总仓位浮动盈亏: false,
		总手续费: false,
		总盈利: false,
		多仓操作: false,
		空仓操作: false,
		需要确认的操作: false,
		每小时盈利: false,
	}

	// 标记需要被突出显示的列
	突出显示的列.value.forEach((item) => {
		if (highlightedColumns.hasOwnProperty(item)) {
			highlightedColumns[item] = true
		}
	})

	// 根据标记来更新选择框的值
	选择框_序号.value = highlightedColumns['序号']
	选择框_账号名.value = highlightedColumns['账号名']
	选择框_交易对.value = highlightedColumns['交易对']
	选择框_运行时间.value = highlightedColumns['运行时间']
	选择框_总仓位浮动盈亏.value = highlightedColumns['总仓位浮动盈亏']
	选择框_总手续费.value = highlightedColumns['总手续费']
	选择框_总盈利.value = highlightedColumns['总盈利']
	选择框_多仓操作.value = highlightedColumns['多仓操作']
	选择框_空仓操作.value = highlightedColumns['空仓操作']
	选择框_需要确认的操作.value = highlightedColumns['需要确认的操作']
	选择框_每小时盈利.value = highlightedColumns['每小时盈利']
}

// ------------------------------------------------------------------------------------------------------------筛选相关功能结束----------------------------------------------------------------------------------------------------

// 储存交易所信息的数组
const smading_infos_list = ref([])
let ws = null
const monitor_table_height = ref(0)
const updateHeight = () => {
	if (!document.getElementById('monitor_table')) return
	monitor_table_height.value = window.innerHeight - 355
	// console.log(window.innerHeight)
}
const monitorTable = ref(null)
const 黑名单 = ref(false)
onMounted(async () => {
	// await 获取多少usdt自动重开()

	// if (localStorage.getItem('username') === '徐建煜' || localStorage.getItem('username') === '刘倩' || localStorage.getItem('username') === '徐馥蓉') {
	// 	黑名单.value = true
	// }

	// if (localStorage.getItem('username') === 'syb' || localStorage.getItem('username') === 'yyn' || localStorage.getItem('username') === 'yyn2') {
	// 	show_profit.value = true
	// 	突出显示的列.value.push('总手续费')
	// 	列名列表.value.push('总手续费')
	// } else {
	// 	show_profit.value = false
	// }

	更新突出显示的列()
	updateHeight()
	console.log('监控墙页面加载完成,开始连接websocket')
	connectToWebSocket()
	window.addEventListener('resize', updateHeight)
	// 快速启动需要的数据
	get_strategy_page()
	get_exchanges_all_simple()
	获取币安usdt交易对()
	// 设置表格的滚动条位置
	// setTimeout(() => {
	// 	const scrollArea = monitorTable.value?.$el.querySelector('.el-table__body-wrapper')
	// 	monitorTable.value.setScrollLeft(scrollArea.clientWidth + 400)
	// }, 300)
})

onBeforeUnmount(() => {
	if (ws) {
		reconnectScheduled = true
		ws.close()
	}
	window.removeEventListener('resize', updateHeight)

	if (timer) {
		clearInterval(timer)
	}
	// audioPlayer.value.removeEventListener('ended', handleAudioEnded)
})

// ------------------------------------------------------------------------------------------------------------websocket相关功能开始----------------------------------------------------------------------------------------------------
let 计算总盈利 = 0
let 计算仓位浮动盈亏 = 0
const can_show = ref(true)
const keys = ['run_id', 'strategy_id', '策略名称', 'exchange_id', '交易所', 'name', 'symbol', '交易类型', '持仓方向', '当前版本', '启动资金', '账户余额', '最新价格', '运行时间', '每小时盈利', '止盈次数', '总手续费', '总盈利', '总仓位浮动盈亏', '运行状态', '做多止盈次数', '做多手续费', '做多总盈利', '做多补单次数', '做多挂单数量', '做多止盈单数量', '做多仓位数量', '做多仓位价格', '做多持仓价值', '做多仓位浮动盈亏', '做多本轮时间', '做多运行状态', '做多重挂止盈', '做空止盈次数', '做空手续费', '做空总盈利', '做空补单次数', '做空挂单数量', '做空止盈单数量', '做空仓位数量', '做空仓位价格', '做空持仓价值', '做空仓位浮动盈亏', '做空本轮时间', '做空运行状态', '做空重挂止盈']

// 定义函数，将二维数组转换为对象数组
const websocket_数组转对象 = (array2d) => {
	// 如果是对象类型则直接返回
	if (typeof array2d === 'object' && !Array.isArray(array2d)) return array2d
	if (!array2d.length) return []
	return array2d.map((array) => {
		// 判断类型如果是对象则直接返回，如果是数组就进行下面的处理
		if (typeof array === 'object' && !Array.isArray(array)) {
			//添加id属性，id为strategy_id+symbol
			array.id = array.strategy_id + array.symbol
			return array
		}
		const obj = {}
		for (let i = 0; i < keys.length; i++) {
			obj[keys[i]] = array[i]
		}
		obj.id = obj.strategy_id + obj.symbol
		return obj
	})
}

const INITIAL_RECONNECT_DELAY = 300 // 初始重连延迟：1秒
const MAX_RECONNECT_DELAY = 60000 // 最大重连延迟：1分钟
let currentReconnectDelay = INITIAL_RECONNECT_DELAY // 当前的重连延迟
let reconnectScheduled = false // 用于跟踪是否已经安排了重连
let name_color_map = {}
const color_list = ['color-yyn1', 'color-yyn2', 'color-yyn3', 'color-yyn5']

function scheduleReconnect() {
	if (reconnectScheduled) return // 如果已经安排了重连，则直接返回
	console.log(`计划在 ${currentReconnectDelay}ms 后重连`)
	setTimeout(() => {
		currentReconnectDelay = Math.min(currentReconnectDelay * 2, MAX_RECONNECT_DELAY)
		reconnectScheduled = false // 重置重连标志
		connectToWebSocket()
	}, currentReconnectDelay)
	reconnectScheduled = true // 设置重连标志
}

let 自动重开中 = false
function connectToWebSocket() {
	if (ws) {
		console.log('已存在ws,关闭WebSocket连接')
		ws.close()
		ws = null
	}
	const token = localStorage.getItem('token')
	// console.log('开始连接WebSocket:', token)
	ws = new WebSocket(`ws://54.238.137.72:7878/ws/smading/${token}`)

	ws.onopen = (event) => {
		// console.log('WebSocket 已连接:', event)
		currentReconnectDelay = INITIAL_RECONNECT_DELAY // 重置当前的重连延迟
	}

	ws.onmessage = async (event) => {
		// console.log('WebSocket  收到消息 event:', event)
		const array2d = JSON.parse(event.data)
		// 调用函数，将二维数组转换为对象数组
		const rawData = websocket_数组转对象(array2d)
		// console.log('WebSocket 收到消息:', rawData, rawData.error, rawData.error == true)
		// 检查消息中是否有'error'字段
		if (rawData.error) {
			// console.error('WebSocket error received:', rawData.error)
			// 根据错误处理，例如：如果token无效或过期，可能需要重新登录
			if (rawData.code === 401) {
				reconnectScheduled = true
				localStorage.removeItem('token')
				router.replace({
					path: '/login',
					query: { redirect: router.currentRoute.fullPath },
				})
			}
			// 关闭WebSocket连接
			ws.close()
		} else {
			let 计算总盈利 = 0
			let 计算仓位浮动盈亏 = 0
			let position_side_set = new Set()
			let names = new Set()
			let nameAndTypes = new Set()
			let symbols = new Set()
			// 用于存储符合条件的项目,用于表格展示
			let tempSmadingInfos = []
			// 取出最大补单次数
			let max_long_add_times = 0
			let max_short_add_times = 0
			rawData.forEach((item) => {
				const { 总盈利, 总仓位浮动盈亏, name, symbol, 交易类型, 做多补单次数, 做空补单次数, 做多止盈次数, 做空止盈次数, 策略名称, strategy_id } = item

				// // 数据过滤
				if ((!currentSymbolFilters.value.length || currentSymbolFilters.value.includes(symbol)) && 选中的交易所账号.value.includes(name)) {
					// 计算总盈利
					if (总盈利 !== undefined) {
						计算总盈利 += parseFloat(总盈利)
					}

					if (总仓位浮动盈亏 !== undefined) {
						计算仓位浮动盈亏 += parseFloat(总仓位浮动盈亏)
					}
					// 	//下面这2个是用于告警的
					// 	if (做多第几次补单 !== undefined) {
					// 		max_long_add_times = Math.max(max_long_add_times, 做多第几次补单)
					// 	}
					// 	if (做空第几次补单 !== undefined) {
					// 		max_short_add_times = Math.max(max_short_add_times, 做空第几次补单)
					// 	}
				}
				// 构建用于过滤和排序的集合
				names.add(name)
				symbols.add(symbol)
				if (做多补单次数 > 0 || 做多止盈次数 > 0) {
					position_side_set.add('LONG')
				}
				if (做空补单次数 > 0 || 做空止盈次数 > 0) {
					position_side_set.add('SHORT')
				}
				item.long_show_button = true
				item.short_show_button = true
				if (做多补单次数 === 0 && 做多止盈次数 === 0) {
					item.long_show_button = false
				}
				if (做空补单次数 === 0 && 做空止盈次数 === 0) {
					item.short_show_button = false
				}

				nameAndTypes.add(`${name}|${strategy_id}`)

				tempSmadingInfos.push(item)
			})
			//表格数据赋值
			smading_infos_list.value = tempSmadingInfos

			//自动重开的逻辑
			显示净盈利.value = (计算总盈利 + 计算仓位浮动盈亏).toFixed(2)
			// if (!黑名单.value && !自动重开中 && can_show.value && 编辑框净浮盈.value > 0 && 显示净盈利.value > 编辑框净浮盈.value) {
			// 	自动重开中 = true
			// 	console.log('计算总盈利 + 计算仓位浮动盈亏', 显示净盈利.value, '编辑框净浮盈.value', 编辑框净浮盈.value)
			// 	await 所有重新开始()
			// 	await 根据止损记录map重设止损()
			// 	// 等待2分钟 防止重复提交
			// 	setTimeout(() => {
			// 		自动重开中 = false
			// 	}, 20000)
			// }
			// 根据持仓情况 如果只持有做多仓位就不展示做空相关字段了
			for (let position_side of position_side_set) {
				if (position_side === 'LONG') {
					can_show_long.value = true
				}
				if (position_side === 'SHORT') {
					can_show_short.value = true
				}
			}
			if (position_side_set.size > 1) {
				can_show_all.value = true
			} else {
				can_show_all.value = false
				if (can_show_long.value) {
					can_show_short.value = false
				} else {
					can_show_short.value = true
				}
			}

			// 将Set转换为排序后的数组
			const sortedNames = [...names].sort()
			if (选中的交易所账号.value.length == 0) {
				选中的交易所账号.value = [...sortedNames]
			}
			// 根据交易所的名字跟交易类型分配表格颜色
			const sortedNameAndTypes = [...nameAndTypes].sort()
			assignColorToName(sortedNameAndTypes)

			// 设置过滤器值
			nameFilters.value = sortedNames.map((name) => ({ text: name, value: name }))
			symbolFilters.value = [...symbols].map((symbol) => ({ text: symbol, value: symbol }))

			// //告警的逻辑
			// const max_add_times = Math.max(max_long_add_times, max_short_add_times)
			// if (is_playing.value) {
			// 	if (open_alarm.value && max_add_times >= alarm_num.value) {
			// 		start_alarm.value = true
			// 		show_alarm_stop.value = true
			// 	} else {
			// 		audioPlayer.value.pause() // 暂停音频
			// 		start_alarm.value = false
			// 		show_alarm_stop.value = false
			// 	}
			// }
		}
	}

	ws.onclose = (event) => {
		console.log('WebSocket 已关闭:', event)
		scheduleReconnect() // 调度一个重连
	}

	ws.onerror = (error) => {
		console.log('WebSocket 出错:', error)
	}
}

function assignColorToName(names) {
	let color_list_copy = [...color_list]
	for (let name of names) {
		// 确保color_list_copy不是空的
		if (!color_list_copy.length) {
			color_list_copy = [...color_list]
		}
		let color = color_list_copy.shift()

		// 如果name_color_map中没有这个name，则添加
		if (!name_color_map[name]) {
			name_color_map[name] = color
		}

		color_list_copy.push(color)
	}
	// console.log('name_color_map', name_color_map)
}

// ------------------------------------------------------------------------------------------------------------websocket相关功能结束----------------------------------------------------------------------------------------------------

const 更新监控的交易所账号 = () => {
	console.log(选中的交易所账号.value)
}

const 设置止损 = async (row, index) => {
	const res = await ElMessageBox.confirm(`确定要设置止损吗？如确定，则会覆盖原来的止损规则！设置后如需取消。可以填-9999后再次点次按钮。`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	let inputvalues = 0
	try {
		inputvalues = stop_loss_inputValues.value[index]
		inputvalues = parseFloat(inputvalues)
		if (inputvalues >= 0) {
			ElMessage({
				message: '设置止损失败：请输入 小于0 的数字',
				type: 'error',
			})
			return
		}
	} catch (error) {
		// 如果inputvalues不能转化为小数，则提示错误
		ElMessage({
			message: '设置止损失败：请输入正确的数字',
			type: 'error',
		})
		return
	}
	try {
		const _data = {
			stop_loss_value: inputvalues,
			symbol: row.symbol,
			strategy_id: row.strategy_id,
			exchange_id: row.exchange_id,
		}
		const res = await api_监控墙_设置止损(_data)
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '设置止损成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '设置止损失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '设置止损失败：' + error,
			type: 'error',
		})
	}
}

const 重挂止盈 = async (row, position_side, index) => {
	let inputvalues = 0
	try {
		if (position_side == 'LONG') {
			inputvalues = long_inputValues.value[index]
		} else {
			inputvalues = short_inputValues.value[index]
		}
		inputvalues = parseFloat(inputvalues)
	} catch (error) {
		// 如果inputvalues不能转化为小数，则提示错误
		ElMessage({
			message: '重挂止盈失败：请输入正确的数字',
			type: 'error',
		})
		return
	}

	// console.log(long_inputValues, short_inputValues, index, inputvalues, row.exchange_id, row)
	try {
		const data = {
			run_id: row.run_id,
			position_side: position_side,
			exchange_id: row.exchange_id,
			reset_value: inputvalues,
		}
		const res = await api_重挂止盈(data)
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '重挂止盈成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '重挂止盈失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '重挂止盈失败：' + error,
			type: 'error',
		})
	}
}

const 全部撤单平仓 = async (position_side) => {
	// console.log(row, position_side);
	const 持仓方向 = position_side == 'LONG' ? '做多' : '做空'
	const res = await ElMessageBox.confirm(`确定要对监控墙上所有马丁的 ${持仓方向} 仓位执行撤单平仓吗？如确定，则会把监控墙上所有马丁的 ${持仓方向} 的马丁的仓位平仓并撤销此马丁的挂单！`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	try {
		let data_list = []
		smading_infos_list.value.forEach((item) => {
			const data = {
				run_id: item.run_id,
				position_side: position_side,
				exchange_id: item.exchange_id,
			}
			data_list.push(data)
		})

		const res = await api_batch_撤单平仓(data_list)
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: 持仓方向 + res.data.msg,
				type: 'success',
			})
		} else {
			ElMessage({
				message: '全部' + 持仓方向 + '仓位 撤单平仓失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '全部' + 持仓方向 + '仓位 撤单平仓失败：' + error,
			type: 'error',
		})
	}
}

const 全部一键清仓 = async (position_side) => {
	// console.log(row, position_side);
	const 持仓方向 = position_side == 'LONG' ? '做多' : '做空'
	const res = await ElMessageBox.confirm(`确定要对监控墙上所有马丁的 ${持仓方向} 仓位执行一键清仓吗？如确定，则会把监控墙上所有马丁的 ${持仓方向} 仓位全部清仓并撤销所有挂单！`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	try {
		let data_list = []
		smading_infos_list.value.forEach((item) => {
			const data = {
				run_id: item.run_id,
				position_side: position_side,
				exchange_id: item.exchange_id,
			}
			data_list.push(data)
		})
		const res = await api_batch_一键清仓(data_list)
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: 持仓方向 + res.data.msg,
				type: 'success',
			})
		} else {
			ElMessage({
				message: '全部' + 持仓方向 + '仓位 一键清仓失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '全部' + 持仓方向 + '仓位 一键清仓失败：' + error,
			type: 'error',
		})
	}
}
const 撤单平仓 = async (row, position_side) => {
	// console.log(row, position_side);
	const 持仓方向 = position_side == 'LONG' ? '做多' : '做空'
	const res = await ElMessageBox.confirm(`确定要对${row.symbol} ${持仓方向} 仓位执行撤单平仓吗？如确定，则会把${row.symbol} ${持仓方向} 当前马丁的仓位平仓并撤销当前马丁的挂单！`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	try {
		const data = {
			run_id: row.run_id,
			position_side: position_side,
			exchange_id: row.exchange_id,
		}
		const res = await api_撤单平仓(data)
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: 持仓方向 + '撤单平仓成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: 持仓方向 + '撤单平仓失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: 持仓方向 + '撤单平仓失败：' + error,
			type: 'error',
		})
	}
}

const 一键清仓 = async (row, position_side) => {
	// console.log(row, position_side);
	const 持仓方向 = position_side == 'LONG' ? '做多' : '做空'
	const res = await ElMessageBox.confirm(`确定要对${row.symbol} ${持仓方向} 仓位执行一键清仓吗？如确定，则会把${row.symbol} ${持仓方向} 仓位全部清仓并撤销所有挂单！`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	try {
		const data = {
			run_id: row.run_id,
			position_side: position_side,
			exchange_id: row.exchange_id,
		}
		const res = await api_一键清仓(data)
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: 持仓方向 + '一键清仓成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: 持仓方向 + '一键清仓失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: 持仓方向 + '一键清仓失败：' + error,
			type: 'error',
		})
	}
}

const 仓位重启 = async (row, position_side) => {
	let 仓位名称 = ''
	if (position_side == 'LONG') {
		仓位名称 = '做多'
	} else {
		仓位名称 = '做空'
	}
	// 先弹一个提示框确定是否暂停
	const res = await ElMessageBox.confirm(`确定要重启 ${仓位名称} 仓位吗？如确定，则会对 ${仓位名称} 仓位进行撤单平仓 然后重新开始！`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	const data = {
		run_id: row.run_id,
		position_side: position_side,
		exchange_id: row.exchange_id,
	}
	try {
		const res = await api_仓位重启(data)
		// console.log("res", res);
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '仓位重启成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '仓位重启失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '仓位重启失败：' + error,
			type: 'error',
		})
	}
}

const 暂停补单 = async (row, position_side) => {
	// 先弹一个提示框确定是否暂停
	const res = await ElMessageBox.confirm('确定要暂停补单吗？如暂停补单，则下一次补单会暂停直到恢复补单！止盈单不受影响', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	// console.log(row, position_side);
	try {
		const res = await api_监控墙_暂停补单(row.symbol, row.strategy_id, position_side, row.exchange_id)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '暂停补单成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '暂停补单失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '暂停补单失败：' + error,
			type: 'error',
		})
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
		inputvalues = parseInt(inputvalues)
	} catch (error) {
		// 如果inputvalues不能转化为小数，则提示错误
		ElMessage({
			message: '重挂止盈失败：请输入正确的数字',
			type: 'error',
		})
		return
	}
	try {
		const res = await api_监控墙_恢复补单(row.symbol, row.strategy_id, position_side, inputvalues, row.exchange_id)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '恢复补单成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '恢复补单失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '恢复补单失败：' + error,
			type: 'error',
		})
	}
}

const 全部暂停 = async () => {
	const res = await ElMessageBox.confirm('确定要暂停 所有马丁 吗？如暂停，等解套后则不继续开单！', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	// console.log(row, position_side);

	// 使用 Map 对象替代临时对象，减少 hasOwnProperty 的检查开销
	const tempMap = new Map()

	// 根据 exchange_id 分组
	smading_infos_list.value.forEach((item) => {
		if (tempMap.has(item.exchange_id)) {
			tempMap.get(item.exchange_id).run_id_list.push(item.run_id)
		} else {
			tempMap.set(item.exchange_id, {
				exchange_id: item.exchange_id,
				run_id_list: [item.run_id],
				position_side: item.position_side,
			})
		}
	})

	// 将 Map 转换为数组
	const data = Array.from(tempMap.values())
	await 暂停(data)
}

const 单个暂停 = async (row, position_side) => {
	// 先弹一个提示框确定是否暂停
	const res = await ElMessageBox.confirm('确定要暂停吗？如暂停，等解套后则不继续开单！', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	// console.log(row, position_side);
	const data = [
		{
			exchange_id: row.exchange_id,
			run_id_list: [row.run_id],
			position_side: position_side,
		},
	]
	await 暂停(data)
}

const 暂停 = async (data) => {
	try {
		const res = await api_run_info_pause(data)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '暂停成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '暂停失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '暂停失败：' + error,
			type: 'error',
		})
	}
}

const 全部恢复 = async () => {
	// 使用 Map 对象替代临时对象，减少 hasOwnProperty 的检查开销
	const tempMap = new Map()

	// 根据 exchange_id 分组
	smading_infos_list.value.forEach((item) => {
		if (tempMap.has(item.exchange_id)) {
			tempMap.get(item.exchange_id).run_id_list.push(item.run_id)
		} else {
			tempMap.set(item.exchange_id, {
				exchange_id: item.exchange_id,
				run_id_list: [item.run_id],
			})
		}
	})

	// 将 Map 转换为数组
	const data = Array.from(tempMap.values())
	await 恢复(data)
}

const 单个恢复 = async (row, position_side) => {
	const data = [
		{
			exchange_id: row.exchange_id,
			run_id_list: [row.run_id],
			position_side: position_side,
		},
	]
	await 恢复(data)
}

const 恢复 = async (data) => {
	// console.log(row, position_side);
	try {
		const res = await api_run_info_run(data)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '恢复成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '恢复失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '恢复失败：' + error,
			type: 'error',
		})
	}
}

const 根据止损记录map重设止损 = async () => {
	//遍历止损记录map
	for (const key in 止损记录map) {
		if (Object.hasOwnProperty.call(止损记录map, key)) {
			const _data = 止损记录map[key]
			console.log(_data)
			await api_监控墙_设置止损(_data)
		}
	}
}
const 所有重新开始 = async () => {
	let obj_list = []
	smading_infos_list.value.forEach((item) => {
		let obj = {
			symbol: item.symbol,
			strategy_id: item.strategy_id,
			exchange_id: item.exchange_id,
			net_profit: 显示净盈利.value,
		}
		const key = item.strategy_id + item.symbol + item.exchange_id
		const _data = {
			symbol: item.symbol,
			strategy_id: item.strategy_id,
			exchange_id: item.exchange_id,
			stop_loss_value: item.止损阈值,
		}
		//判断key是不是在止损记录map，不在则添加，在则覆盖，如果inputvalues为-9999则删除
		if (item.止损阈值 === -9999 || item.止损阈值 === '') {
			delete 止损记录map[key]
		} else {
			止损记录map[key] = _data
		}
		obj_list.push(obj)
	})
	try {
		console.log('止损记录map', 止损记录map)
		const res = await api_监控墙_所有重新开始(obj_list)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '停止成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '停止失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '停止失败：' + error,
			type: 'error',
		})
	}
}

const 更新多少usdt自动重开 = async () => {
	try {
		const _data = {
			how_much_restart_monitor: 编辑框净浮盈.value,
		}
		const res = await api_监控墙_更新多少usdt自动重开(_data)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '失败：' + error,
			type: 'error',
		})
	}
}

const 获取多少usdt自动重开 = async () => {
	try {
		const res = await api_监控墙_获取多少usdt自动重开()
		if (res.status === 200 && res.data.code === 200) {
			编辑框净浮盈.value = res.data.data['how_much_restart_monitor']
		} else {
			ElMessage({
				message: '失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '失败：' + error,
			type: 'error',
		})
	}
}

const 禁止重开 = async (row) => {
	try {
		const _data = {
			symbol: row.symbol,
			strategy_id: row.strategy_id,
			exchange_id: row.exchange_id,
		}
		const res = await api_监控墙_禁止重开(_data)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '失败：' + error,
			type: 'error',
		})
	}
}

const 全部停止 = async () => {
	// 先弹一个提示框确定是否停止
	const res = await ElMessageBox.confirm('确定要停止所有马丁吗？建议点击顺序 全部暂停=>多空仓位全部撤单平仓=>全部停止 ！', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}

	// 使用 Map 对象替代临时对象，减少 hasOwnProperty 的检查开销
	const tempMap = new Map()

	// 根据 exchange_id 分组
	smading_infos_list.value.forEach((item) => {
		if (tempMap.has(item.exchange_id)) {
			tempMap.get(item.exchange_id).run_id_list.push(item.run_id)
		} else {
			tempMap.set(item.exchange_id, {
				exchange_id: item.exchange_id,
				run_id_list: [item.run_id],
			})
		}
	})

	// 将 Map 转换为数组
	const data = Array.from(tempMap.values())
	await 停止(data)
}

const 单个停止 = async (row, position_side) => {
	// 先弹一个提示框确定是否停止
	const res = await ElMessageBox.confirm('确定要停止吗？建议点击顺序 暂停=>多空仓位撤单平仓=>停止 ！', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	const data = [
		{
			exchange_id: row.exchange_id,
			run_id_list: [row.run_id],
			position_side: position_side,
		},
	]
	await 停止(data)
}

const 停止 = async (data) => {
	try {
		const res = await api_run_info_stop(data)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '停止成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '停止失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '停止失败：' + error,
			type: 'error',
		})
	}
}

const 重新启动 = async (row) => {
	// 先弹一个提示框确定是否重新启动
	const res = await ElMessageBox.confirm('确定要重新启动吗？重新启动会平掉所有仓位！', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
	if (res !== 'confirm') {
		return
	}
	// console.log(row, position_side);
	try {
		const res = await api_重新启动(row.symbol, row.strategy_id, row.exchange_id)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: '重新启动成功',
				type: 'success',
			})
		} else {
			ElMessage({
				message: '重新启动失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '重新启动失败：' + error,
			type: 'error',
		})
	}
}

const 获取币安usdt交易对 = async () => {
	try {
		const res = await api_get_binance_api_usdt_symbols()
		if (res.status === 200 && res.data.code === 200) {
			binance_spot_usdt_symbols.value = Object.entries(res.data.data).map(([symbol, price]) => ({
				label: `${symbol} | ${price}`, // 显示内容
				value: symbol, // 选中值
			}))
		} else {
			ElMessage({
				message: '查询币安现货usdt交易对失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询币安现货usdt交易对失败：' + error,
			type: 'error',
			showClose: true,
		})
	}

	try {
		const res = await api_get_binance_fapi_usdt_symbols()
		if (res.status === 200 && res.data.code === 200) {
			binance_features_usdt_symbols.value = Object.entries(res.data.data).map(([symbol, price]) => ({
				label: `${symbol} | ${price}`, // 显示内容
				value: symbol, // 选中值
			}))
			// console.log(res.data.data, binance_features_usdt_symbols.value)
		} else {
			ElMessage({
				message: '查询币安现货usdt交易对失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询币安现货usdt交易对失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
}
// 监听 form_data.strategy_id 的变化
watch(
	() => form_data.value.strategy_id, // 监听的目标
	(newValue, oldValue) => {
		console.log('newValue', newValue, strategy_dict[newValue])
		const position_side = strategy_dict[newValue].position_side
		const name = strategy_dict[newValue].name
		if (position_side != 'LONG') {
			form_data.value.trade_type = 'features'
			trade_type_options.value = [{ value: 'features', label: '合约' }]
		} else {
			// 如果名字中包含合约，则是合约
			if (name.includes('合约')) {
				form_data.value.trade_type = 'features'
				trade_type_options.value = [
					{ value: 'spot', label: '现货' },
					{ value: 'features', label: '合约' },
				]
			} else {
				form_data.value.trade_type = 'spot'
				trade_type_options.value = [
					{ value: 'spot', label: '现货' },
					{ value: 'features', label: '合约' },
				]
			}
		}
	}
)
const get_strategy_page = async () => {
	// 获取策略信息
	try {
		const data = {
			is_ban: 0,
		}
		const res = await api_get_strategy_page(1, 100, data)
		// console.log('res', res)
		if (res.status === 200 && res.data.code === 200) {
			const items = res.data.data.items
			strategy_options.value = items.map((item) => {
				const 持仓方向 = item.position_side == 'LONG' ? '做多' : '做空'
				return {
					value: item.strategy_id,
					label: `${持仓方向}  \u00A0|\u00A0 ${item.name}  \u00A0|\u00A0  ${item.all_profit}  \u00A0|\u00A0  ${item.running_count} \u00A0|\u00A0  ${item.running_profit}`,
				}
			})

			// console.log('items', items, 'strategy_dict', strategy_dict)
			strategy_dict = items.reduce((acc, curr) => {
				// console.log(acc, 'curr', curr)
				acc[curr.strategy_id] = curr
				return acc
			}, {})
			// console.log('strategy_dict', strategy_dict)
		} else {
			ElMessage({
				message: '查询双马丁策略列表失败：' + res.data.msg,
				type: 'error',
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询双马丁策略列表失败：' + error,
			type: 'error',
		})
	}
}

const get_exchanges_all_simple = async () => {
	try {
		const res = await api_get_exchanges_all_simple()
		if (res.status === 200 && res.data.code === 200) {
			exchange_options.value = res.data.data.map((item) => {
				return {
					value: item.id,
					label: `${item.exchange_type}  \u00A0|\u00A0  ${item.exchange_name}`,
				}
			})
		} else {
			ElMessage({
				message: '查询交易所信息失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '查询交易所信息失败：' + error,
			type: 'error',
			showClose: true,
		})
	}
}

const 确认启动马丁 = async () => {
	if (!form_data.value.strategy_id) {
		ElMessage({
			message: '请选择需要运行的策略',
			type: 'error',
			showClose: true,
		})
		return
	}
	if (form_data.value.exchange_id_list.length === 0) {
		ElMessage({
			message: '请选择需要运行的账号',
			type: 'error',
			showClose: true,
		})
		return
	}
	if (form_data.value.symbol_list.length === 0) {
		ElMessage({
			message: '请选择需要运行的交易对',
			type: 'error',
			showClose: true,
		})
		return
	}
	if (!form_data.value.trade_type) {
		ElMessage({
			message: '请选择交易类型',
			type: 'error',
			showClose: true,
		})
		return
	}
	dialogVisiblemd.value = true
}
const 启动马丁 = async () => {
	start_md_loading.value = true
	try {
		const res = await api_run_info_start(form_data.value)
		if (res.status === 200 && res.data.code === 200) {
			ElMessage({
				message: `${JSON.stringify(res.data.data)}`,
				type: 'success',
				showClose: true,
			})
		} else {
			ElMessage({
				message: '启动马丁失败：' + res.data.msg,
				type: 'error',
				showClose: true,
			})
		}
	} catch (error) {
		ElMessage({
			message: '启动马丁失败：' + error,
			type: 'error',
			showClose: true,
		})
	} finally {
		start_md_loading.value = false
	}
	dialogVisiblemd.value = false
}

// ------------------------------------------------------------------------------------------------------------表格统计相关功能开始----------------------------------------------------------------------------------------------------
const columnsToSummarize = {
	止盈次数: 0,
	每小时盈利: 3,
	做空止盈次数: 0,
	做多止盈次数: 0,
	做多持仓价值: 2,
	做空持仓价值: 2,
	仓位手续费: 4,
	总仓位浮动盈亏: 4,
	止盈总利润: 4,
	做多仓位价值: 1,
	做空仓位价值: 1,
	做空仓位浮动盈亏: 4,
	做多仓位浮动盈亏: 4,
	做空总盈利: 4,
	做多总盈利: 4,
	总手续费: 4,
	总盈利: 3,
}
function calculateSum(data, decimalPlaces) {
	const sum = data.reduce((acc, curr) => {
		const value = Number(curr)
		return !Number.isNaN(value) ? acc + value : acc
	}, 0)

	return sum.toFixed(decimalPlaces)
}

const getSummaries = (param) => {
	const { columns, data } = param
	// console.log("columns", columns, data)
	const sums = []
	const sums2 = []
	columns.forEach((column, index) => {
		if (index === 0) {
			sums[index] = '总计'
			return
		}
		// if (index === 5) {
		// 	sums[5] = (Number(sums[4]) - Number(sums[3])).toFixed(1)
		// 	// console.log(sums[4], sums[3], sums[2]);
		// 	return
		// }
		// if (index === 6) {
		// 	// 取这一列的最大值
		// 	const values = data.map((item) => item[column.property])
		// 	sums[index] = Math.max(...values)
		// 	return
		// }
		// if
		const decimalPlaces = columnsToSummarize[column.property]
		if (decimalPlaces !== undefined) {
			const values = data.map((item) => item[column.property])
			sums[index] = calculateSum(values, decimalPlaces)
		} else {
			sums[index] = ''
		}
	})

	return sums
}

const tableRowClassName = ({ row }) => {
	// console.log(row.name, name_color_map[row.name], name_color_map);
	return name_color_map[row.name + '|' + row.strategy_id]
}

const cellClassName = ({ row, rowIndex, column, columnIndex }) => {
	if (column.property === '做空补单次数') {
		if (row['做空补单次数'] >= 10) {
			return 'highlight-cell'
		}
		return 'bold-cell'
	}
	if (column.property === '做多补单次数') {
		if (row['做多补单次数'] >= 10) {
			return 'highlight-cell'
		}
		return 'bold-cell'
	}
	if (column.property === '总仓位浮动盈亏' && row['总仓位浮动盈亏'] <= -10) {
		return 'highlight-cell'
	}
	return ''
}
// ------------------------------------------------------------------------------------------------------------表格统计相关功能结束----------------------------------------------------------------------------------------------------
</script>

<style>
.el-table .highlight-title {
	background-color: #406be4;
	color: rgb(255, 255, 255);
}

.el-table .success-title {
	background-color: rgb(103, 194, 58);
	color: rgb(255, 255, 255);
}

.el-table .danger-title {
	background-color: #ec2929;
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
	background-color: #ffd700;
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
