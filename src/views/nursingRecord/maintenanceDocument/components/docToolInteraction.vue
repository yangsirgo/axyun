<template>
  <div class="docToolInteraction">
    <el-button @click="addNewInteraction" class="width100">新增交互</el-button>
    <div class="eve-list">
      <el-collapse
        v-if="nursingTreeDataSave && nursingTreeDataSave.length"
        v-model="activeNames"
      >
        <el-collapse-item
          v-for="(value, key) in collapseList"
          :key="key"
          :title="value.title"
          :name="value.EveCode"
        >
          <template
            v-if="
              nursingTreeDataSave[0].eleEventList &&
              nursingTreeDataSave[0].eleEventList.length
            "
          >
            <div
              class="col-item"
              v-for="(item, index) in nursingTreeDataSave[0].eleEventList"
              :key="index"
            >
              <div class="clearfix" v-if="value.EveCode == item.EveCode">
                <div v-if="value.EveCode == 'CDEE_QUOTE'">
                  <div v-for="(v, k) in item.QuoteList" :key="k">
                    <div v-for="(vv, kk) in v" :key="kk">
                      <span class="col-item-name float-left"
                        >{{ quoteMatch[k] }}{{ vv.elementName }}</span
                      >
                      <span
                        class="col-item-icon2 float-right iconfont iconshanchu"
                        @click="deleteEvents1(index, k, kk)"
                      ></span>
                      <span
                        class="col-item-icon1 float-right iconfont iconbianji"
                        @click="editEvents1(index, k, kk)"
                      ></span>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <span class="col-item-name float-left">{{
                    item.EveValShow
                  }}</span>
                  <span
                    class="col-item-icon2 float-right iconfont iconshanchu"
                    @click="deleteEvents(index)"
                  ></span>
                  <span
                    class="col-item-icon1 float-right iconfont iconbianji"
                    @click="editEvents(item.EveCode, index)"
                  ></span>
                </div>
              </div>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog
      title="交互设置"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogVisible"
      :width="currentIndex == 7 ? '1250px' : '1000px'"
      append-to-body
    >
      <div id="diagele" class="dialog-cont clearfix">
        <div class="left-list float-left">
          <div
            :class="{
              item: true,
              strip: !(index % 2),
              isClick: index === currentIndex,
            }"
            v-for="(item, index) in interactionList"
            :key="index"
            @click="itemClick(item, index)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="center float-left">
          <!--计算BMI-->
          <div class="BMI" v-if="currentIndex == 0">
            <div class="gongshi">体质指数(BMI) = 体重÷身高^2</div>
            <div class="content">
              <!--<div class="text">体质指数BMI(kg/m2)</div>-->
              <div class="input clearfix">
                <div
                  class="left-conts float-left"
                  :class="{ 'activity-focus': currentInput === 'BMI' }"
                >
                  <div class="height100 clearfix">
                    <div
                      class="left-conts-cont float-left height100"
                      @click="buttonFocus('BMI')"
                      :title="interactionData.BMIData.BMI.elementName"
                    >
                      {{ interactionData.BMIData.BMI.elementName }}
                    </div>
                    <div
                      class="left-conts-icon float-right height100 iconfont iconshanchu2"
                      @click="buttonRemove('BMI')"
                    ></div>
                  </div>
                </div>
                <div class="right-conts float-left">(kg/m2)</div>
              </div>
              <div class="text">=</div>
              <div class="input clearfix">
                <div
                  class="left-conts float-left"
                  :class="{ 'activity-focus': currentInput === 'weight' }"
                >
                  <div class="height100 clearfix">
                    <div
                      class="left-conts-cont float-left height100"
                      @click="buttonFocus('weight')"
                      :title="interactionData.BMIData.weight.elementName"
                    >
                      {{ interactionData.BMIData.weight.elementName }}
                    </div>
                    <div
                      class="left-conts-icon float-right height100 iconfont iconshanchu2"
                      @click="buttonRemove('weight')"
                    ></div>
                  </div>
                </div>
                <div class="right-conts float-left">
                  <el-select
                    v-model="interactionData.BMIData.weight.unit"
                    placeholder="单位"
                    style="width: 100px"
                  >
                    <el-option label="千克(kg)" value="kg"> </el-option>
                    <el-option label="克(g)" value="g"> </el-option>
                  </el-select>
                </div>
              </div>
              <div class="text">÷</div>
              <div class="input clearfix">
                <div
                  class="left-conts float-left"
                  :class="{ 'activity-focus': currentInput === 'height' }"
                >
                  <div class="height100 clearfix">
                    <div
                      class="left-conts-cont float-left height100"
                      @click="buttonFocus('height')"
                      :title="interactionData.BMIData.height.elementName"
                    >
                      {{ interactionData.BMIData.height.elementName }}
                    </div>
                    <div
                      class="left-conts-icon float-right height100 iconfont iconshanchu2"
                      @click="buttonRemove('height')"
                    ></div>
                  </div>
                </div>
                <div class="right-conts float-left" style="margin-left: 25px">
                  <el-select
                    v-model="interactionData.BMIData.height.unit"
                    placeholder="单位"
                    style="width: 100px"
                  >
                    <el-option label="米(m)" value="m"> </el-option>
                    <el-option label="厘米(cm)" value="cm"> </el-option>
                  </el-select>
                </div>
                <div class="circle">^2</div>
              </div>
            </div>
          </div>
          <!--计算分值-->
          <div class="grades height100" v-if="currentIndex == 1">
            <div class="grades-content">
              <div
                class="text"
                :class="{ 'activity-focus': currentInput === 'totalScore' }"
              >
                <el-button type="text" @click="buttonFocus('totalScore')">{{
                  interactionData.grades.totalScore.elementName
                }}</el-button>
              </div>
              <div class="text">=</div>
              <div
                class="texts clearfix"
                v-for="(item, index) in interactionData.grades.gradesList"
                :key="index"
                :class="{
                  'activity-focus':
                    currentInput.name === 'gradesList' &&
                    currentInput.index === index,
                }"
              >
                <div class="lefts float-left" v-show="index != 0">+</div>
                <div
                  class="centers float-left"
                  @click="buttonFocus('gradesList', index)"
                >
                  <div v-if="interactionData.grades.multiGrades">
                    <span v-for="(v, k) in item" :key="k">
                      <span v-if="k == item.length - 1">{{
                        v.elementName
                      }}</span>
                      <span v-else>{{ v.elementName }}\</span>
                    </span>
                  </div>
                  <div v-else>{{ item.elementName }}</div>
                </div>
                <div
                  class="rights float-left iconfont iconfont iconshanchu2"
                  :style="{ 'margin-left': index === 0 ? '26px' : '10px' }"
                  @click="deleteGradesList(index)"
                ></div>
              </div>
            </div>
            <div class="button-content clearfix">
              <el-button
                type="primary"
                plain
                class="float-left"
                @click="addGradesList"
                >添加计分元素</el-button
              >
              <!-- <el-checkbox
                class="float-left"
                style="margin-top: 7px"
                v-model="interactionData.grades.multiGrades"
                @change="multiGradesChange"
              >多选单项计分</el-checkbox>-->
              <el-checkbox
                class="float-left"
                style="margin-top: 7px"
                v-model="interactionData.grades.isZero"
                >总分为0显示</el-checkbox
              >
            </div>
          </div>
          <!--统计出入量-->
          <div class="quantity height100" v-if="currentIndex == 2">
            <!-- <div class="in-quantity">
              <div class="title">总入量</div>
              <div class="equal">=</div>
              <div class="content" @click="buttonFocus('inQuantity')">
                <span v-for="(item, index) in interactionData.quantity.inQuantity" :key="index">
                  <span
                    v-if="
                      index == interactionData.quantity.inQuantity.length - 1
                    "
                  >{{ item.elementName }}</span>
                  <span v-else>{{ item.elementName }}\</span>
                </span>
              </div>
            </div>
            <div class="out-quantity">
              <div class="title">总出量</div>
              <div class="equal">=</div>
              <div class="content" @click="buttonFocus('outQuantity')">
                <span v-for="(item, index) in interactionData.quantity.outQuantity" :key="index">
                  <span
                    v-if="
                      index == interactionData.quantity.outQuantity.length - 1
                    "
                  >{{ item.elementName }}</span>
                  <span v-else>{{ item.elementName }}\</span>
                </span>
              </div>
            </div>
            <div class="all-quantity">
              <div class="title">统计元素</div>
              <div class="equal">=</div>
              <div class="content" @click="buttonFocus('AllQuantity')">
                <span v-for="(item, index) in interactionData.quantity.AllQuantity" :key="index">
                  <span
                    v-if="index == interactionData.quantity.AllQuantity.length - 1"
                  >{{ item.elementName }}</span>
                  <span v-else>{{ item.elementName }}\</span>
                </span>
              </div>
            </div>-->
            <el-tabs>
              <el-tab-pane label="出入量元素设置">
                <div class="styles">
                  <el-radio-group
                    v-model="interactionData.quantity.quantity.editStyle"
                  >
                    <el-radio :label="1">弹框编辑</el-radio>
                    <el-radio :label="2">行内编辑</el-radio>
                  </el-radio-group>
                  <el-radio-group
                    v-model="interactionData.quantity.quantity.showStyle"
                  >
                    <el-radio :label="1">换行显示</el-radio>
                    <el-radio :label="2">拼接显示</el-radio>
                  </el-radio-group>
                </div>
                <div class="parentEle">
                  <div
                    class="parentEle-item overEll clearfix"
                    :title="
                      interactionData.quantity.quantity.inQuantity.parent
                        .elementName
                    "
                    :class="{
                      'activity-focus': currentInput.name === 'inParent',
                    }"
                  >
                    <div
                      class="left-conts-cont float-left height100"
                      @click="buttonFocus('inParent')"
                    >
                      {{
                        interactionData.quantity.quantity.inQuantity.parent
                          .elementName
                      }}
                    </div>
                    <div
                      class="left-conts-icon float-right height100 iconfont iconshanchu2"
                      @click="buttonRemove('inParent')"
                    ></div>
                  </div>
                  <div
                    class="parentEle-item overEll clearfix"
                    :title="
                      interactionData.quantity.quantity.outQuantity.parent
                        .elementName
                    "
                    :class="{
                      'activity-focus': currentInput.name === 'outParent',
                    }"
                  >
                    <div
                      class="left-conts-cont float-left height100"
                      @click="buttonFocus('outParent')"
                    >
                      {{
                        interactionData.quantity.quantity.outQuantity.parent
                          .elementName
                      }}
                    </div>
                    <div
                      class="left-conts-icon float-right height100 iconfont iconshanchu2"
                      @click="buttonRemove('outParent')"
                    ></div>
                  </div>
                  <div class="parentEle-item" style="width: 100%; border: none">
                    <el-checkbox
                      v-model="interactionData.quantity.quantity.isStatistics"
                      >统计出入量</el-checkbox
                    >
                  </div>
                  <div
                    class="parentEle-item overEll clearfix"
                    :title="
                      interactionData.quantity.quantity.inQuantity.allEle
                        .elementName
                    "
                    :class="{
                      'activity-focus': currentInput.name === 'inAllEle',
                    }"
                  >
                    <div
                      class="left-conts-cont float-left height100"
                      @click="buttonFocus('inAllEle')"
                    >
                      {{
                        interactionData.quantity.quantity.inQuantity.allEle
                          .elementName
                      }}
                    </div>
                    <div
                      class="left-conts-icon float-right height100 iconfont iconshanchu2"
                      @click="buttonRemove('inAllEle')"
                    ></div>
                  </div>
                  <div
                    class="parentEle-item overEll clearfix"
                    :title="
                      interactionData.quantity.quantity.outQuantity.allEle
                        .elementName
                    "
                    :class="{
                      'activity-focus': currentInput.name === 'outAllEle',
                    }"
                  >
                    <div
                      class="left-conts-cont float-left height100"
                      @click="buttonFocus('outAllEle')"
                    >
                      {{
                        interactionData.quantity.quantity.outQuantity.allEle
                          .elementName
                      }}
                    </div>
                    <div
                      class="left-conts-icon float-right height100 iconfont iconshanchu2"
                      @click="buttonRemove('outAllEle')"
                    ></div>
                  </div>
                </div>
                <div class="allEle">
                  <div
                    class="allEle-item"
                    v-for="(item, index) in interactionData.quantity.quantity
                      .inQuantity.eleList"
                    :key="index"
                  >
                    <div
                      class="name-cont overEll"
                      :title="item.nameList.elementName"
                      @click="buttonFocus('inQuantity', index, 'nameList')"
                      :class="{
                        'activity-focus':
                          currentInput.name === 'inQuantity' &&
                          currentInput.index === index &&
                          currentInput.k === 'nameList',
                      }"
                    >
                      {{ item.nameList.elementName }}
                    </div>
                    <div
                      class="value-cont overEll"
                      :title="item.valueList.elementName"
                      @click="buttonFocus('inQuantity', index, 'valueList')"
                      :class="{
                        'activity-focus':
                          currentInput.name === 'inQuantity' &&
                          currentInput.index === index &&
                          currentInput.k === 'valueList',
                      }"
                    >
                      {{ item.valueList.elementName }}
                    </div>
                    <div class="type-radio">
                      <el-radio-group
                        v-model="item.quantityRadio"
                        @change="quantityChange('inQuantity', item, index)"
                      >
                        <el-radio :label="1">入量</el-radio>
                        <el-radio :label="2">出量</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="operate-cont clearfix">
                      <div
                        class="float-left"
                        style="'margin-left':'5px'"
                        @click="addQuantityList('inQuantity', index)"
                      >
                        <svg
                          t="1597201127194"
                          class="icon"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="31588"
                          width="14"
                          height="15"
                        >
                          <path
                            d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 56.888889a455.111111 455.111111 0 1 0 0 910.222222A455.111111 455.111111 0 0 0 512 56.888889z"
                            fill="#8a8a8a"
                            p-id="31589"
                          />
                          <path
                            d="M227.555556 455.111111h568.888888v113.777778H227.555556z"
                            fill="#8a8a8a"
                            p-id="31590"
                          />
                          <path
                            d="M455.111111 227.555556h113.777778v568.888888H455.111111z"
                            fill="#8a8a8a"
                            p-id="31591"
                          />
                        </svg>
                      </div>
                      <div
                        class="float-right iconfont iconshanchu"
                        style="'margin-left':'5px'"
                        @click="deleteQuantityList('inQuantity', index)"
                      ></div>
                    </div>
                  </div>
                  <div
                    class="allEle-item"
                    v-for="(item, index) in interactionData.quantity.quantity
                      .outQuantity.eleList"
                    :key="'info-' + index"
                  >
                    <div
                      class="name-cont overEll"
                      :title="item.nameList.elementName"
                      @click="buttonFocus('outQuantity', index, 'nameList')"
                      :class="{
                        'activity-focus':
                          currentInput.name === 'outQuantity' &&
                          currentInput.index === index &&
                          currentInput.k === 'nameList',
                      }"
                    >
                      {{ item.nameList.elementName }}
                    </div>
                    <div
                      class="value-cont overEll"
                      :title="item.valueList.elementName"
                      @click="buttonFocus('outQuantity', index, 'valueList')"
                      :class="{
                        'activity-focus':
                          currentInput.name === 'outQuantity' &&
                          currentInput.index === index &&
                          currentInput.k === 'valueList',
                      }"
                    >
                      {{ item.valueList.elementName }}
                    </div>
                    <div class="type-radio">
                      <el-radio-group
                        v-model="item.quantityRadio"
                        @change="quantityChange('outQuantity', item, index)"
                      >
                        <el-radio :label="1">入量</el-radio>
                        <el-radio :label="2">出量</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="operate-cont clearfix">
                      <div
                        class="float-left"
                        style="'margin-left':'5px'"
                        @click="addQuantityList('outQuantity', index)"
                      >
                        <svg
                          t="1597201127194"
                          class="icon"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          p-id="31588"
                          width="14"
                          height="15"
                        >
                          <path
                            d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 56.888889a455.111111 455.111111 0 1 0 0 910.222222A455.111111 455.111111 0 0 0 512 56.888889z"
                            fill="#8a8a8a"
                            p-id="31589"
                          />
                          <path
                            d="M227.555556 455.111111h568.888888v113.777778H227.555556z"
                            fill="#8a8a8a"
                            p-id="31590"
                          />
                          <path
                            d="M455.111111 227.555556h113.777778v568.888888H455.111111z"
                            fill="#8a8a8a"
                            p-id="31591"
                          />
                        </svg>
                      </div>
                      <div
                        class="float-right iconfont iconshanchu"
                        style="'margin-left':'5px'"
                        @click="deleteQuantityList('outQuantity', index)"
                      ></div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="小结/总结元素设置">
                <div class="summarys">
                  <div class="summarys-top">
                    <div class="summarys-top-left">
                      <div
                        class="summary-ele overEll clearfix"
                        :title="
                          interactionData.quantity.summary.summaryEle
                            .elementName
                        "
                        :class="{
                          'activity-focus': currentInput.name === 'summaryEle',
                        }"
                      >
                        <div
                          class="left-conts-cont float-left height100"
                          @click="buttonFocus('summaryEle')"
                        >
                          {{
                            interactionData.quantity.summary.summaryEle
                              .elementName
                          }}
                        </div>
                        <div
                          class="left-conts-icon float-right height100 iconfont iconshanchu2"
                          @click="buttonRemove('summaryEle')"
                        ></div>
                      </div>
                      <el-radio-group
                        v-model="interactionData.quantity.summary.showRadio"
                      >
                        <el-radio :label="1">合并行单元格显示</el-radio>
                        <el-radio :label="2">单元格内换行显示</el-radio>
                        <el-radio :label="3">单元格列换行显示</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="summarys-top-right">
                      <el-radio-group
                        v-model="interactionData.quantity.summary.timeRadio"
                      >
                        <el-radio :label="1">按班次添加</el-radio>
                        <el-radio :label="2">按时间添加</el-radio>
                      </el-radio-group>
                      <LFormtTitle
                        label="小结常规时间"
                        style="margin-top: 8px; width: 100%"
                      >
                        <el-time-picker
                          v-model="interactionData.quantity.summary.dateMin"
                          value-format="hh:mm"
                          format="hh:mm"
                        ></el-time-picker>
                      </LFormtTitle>
                      <LFormtTitle
                        label="总结常规时间"
                        style="margin: 8px 0 0 0; width: 100%"
                      >
                        <el-time-picker
                          v-model="interactionData.quantity.summary.dateMax"
                          value-format="hh:mm"
                          format="hh:mm"
                        ></el-time-picker>
                      </LFormtTitle>
                    </div>
                  </div>
                  <div class="summarys-center">
                    <el-checkbox-group
                      v-model="interactionData.quantity.summary.titleAttr"
                    >
                      <el-checkbox label="显示标题"></el-checkbox>
                      <el-checkbox label="独占一行"></el-checkbox>
                      <el-checkbox label="居中显示"></el-checkbox>
                    </el-checkbox-group>
                    <el-select
                      v-model="interactionData.quantity.summary.summaryTitle"
                      style="margin: 8px 0; width: 100%"
                      multiple
                      filterable
                      allow-create
                      placeholder="请选择标题内容"
                    >
                      <el-option
                        v-for="summaryTitleItem in []"
                        :key="summaryTitleItem"
                        :label="summaryTitleItem"
                        :value="summaryTitleItem"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="summarys-center">
                    <el-checkbox-group
                      v-model="interactionData.quantity.summary.dateAttr"
                    >
                      <el-checkbox label="分类统计"></el-checkbox>
                      <el-checkbox label="开始时间"></el-checkbox>
                      <el-checkbox label="结束时间"></el-checkbox>
                    </el-checkbox-group>
                    <el-select
                      v-model="interactionData.quantity.summary.dateFormat"
                      placeholder="请选择时间样式"
                      style="margin: 8px 0; width: 100%"
                    >
                      <el-option
                        v-for="dateFormItem in dateFormatOptions"
                        :key="dateFormItem.value"
                        :label="dateFormItem.label"
                        :value="dateFormItem.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="summarys-center">
                    <el-checkbox-group
                      v-model="interactionData.quantity.summary.asyncAttr"
                      @click="asyncTemp"
                    >
                      <el-checkbox label="同步到体温单"></el-checkbox>
                      <el-checkbox label="同步到前一天"></el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="quantitys">
                    <div
                      class="quantity-item overEll clearfix"
                      :title="
                        interactionData.quantity.summary.inQuantityEle.itemName
                      "
                      :class="{
                        'activity-focus': currentInput.name === 'inQuantityEle',
                      }"
                    >
                      <div
                        class="left-conts-cont float-left height100"
                        @click="buttonFocus('inQuantityEle')"
                      >
                        {{
                          interactionData.quantity.summary.inQuantityEle
                            .itemName
                        }}
                      </div>
                      <div
                        class="left-conts-icon float-right height100 iconfont iconshanchu2"
                        @click="buttonRemove('inQuantityEle')"
                      ></div>
                    </div>
                    <div
                      class="quantity-item overEll clearfix"
                      :title="
                        interactionData.quantity.summary.outQuantityEle.itemName
                      "
                      :class="{
                        'activity-focus':
                          currentInput.name === 'outQuantityEle',
                      }"
                    >
                      <div
                        class="left-conts-cont float-left height100"
                        @click="buttonFocus('outQuantityEle')"
                      >
                        {{
                          interactionData.quantity.summary.outQuantityEle
                            .itemName
                        }}
                      </div>
                      <div
                        class="left-conts-icon float-right height100 iconfont iconshanchu2"
                        @click="buttonRemove('outQuantityEle')"
                      ></div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <!--联动元素-->
          <div class="links height100" v-if="currentIndex == 4">
            <div class="link-content">
              <div
                class="link"
                v-for="(item, index) in interactionData.linkData.linkList"
                :key="index"
              >
                <div class="link-top clearfix">
                  <div
                    class="float-left link-top-left"
                    @click="buttonFocus('judgeEle')"
                    :title="interactionData.linkData.judgeEle.elementName"
                    :class="{
                      'activity-focus':
                        currentInput.name === 'judgeEle' &&
                        currentInput.define === 'links',
                    }"
                  >
                    {{ interactionData.linkData.judgeEle.elementName }}
                  </div>
                  <div class="float-left link-top-center1">
                    <LFormtTitle label="判断符">
                      <el-select
                        v-model="item.judgeCondition"
                        class="width100"
                        placeholder="请选择"
                        @change="
                          judgeConditionChange(
                            item.judgeCondition,
                            'linkData',
                            index
                          )
                        "
                      >
                        <el-option
                          v-for="(val, key) in item.judgeConditions"
                          :key="key"
                          :label="val"
                          :value="val"
                        ></el-option>
                      </el-select>
                    </LFormtTitle>
                  </div>
                  <div class="float-left link-top-center2">
                    <LFormtTitle label="判断值">
                      <el-input
                        v-model="item.judgeValue"
                        class="width100"
                        placeholder="请输入"
                      ></el-input>
                    </LFormtTitle>
                  </div>
                  <div
                    class="float-right link-top-right iconfont iconfucetengtongtubiao-"
                    @click="deleteLink(index)"
                  ></div>
                </div>
                <div
                  class="link-eleList clearfix"
                  v-for="(v, k) in item.EveTarget"
                  :key="k"
                  @click="buttonFocus('EveTarget', index, k)"
                  :class="{
                    'activity-focus':
                      currentInput.name === 'EveTarget' &&
                      currentInput.defines === 'links' &&
                      currentInput.index === index &&
                      currentInput.k === k,
                  }"
                >
                  <div class="link-eleList-item float-left">
                    <div
                      v-if="v.elementBaseName == '标签元素'"
                      class="width100"
                    >
                      {{ v.elementName }}
                    </div>
                    <div v-else-if="v.elementBaseName == '数字元素'">
                      <LFormtTitle
                        :label="
                          v.elementName + (v.unit ? '(' + v.unit + ')' : '')
                        "
                        :displayMode="v.commonAttributeDto.nameStyle"
                      >
                        <el-input-number
                          v-model="v.eleValue"
                          class="width100"
                          controls-position="right"
                          :placeholder="v.commonAttributeDto.placeholderText"
                          :max="v.maxLengthText"
                          :min="v.minLengthText"
                          :precision="v.precision || 0"
                        ></el-input-number>
                      </LFormtTitle>
                    </div>
                    <div
                      v-else-if="
                        v.elementBaseName == '文本元素' ||
                        v.elementBaseName == '基本元素'
                      "
                    >
                      <LFormtTitle
                        :label="v.elementName"
                        :displayMode="
                          v.elementBaseName == '基本元素'
                            ? 'left'
                            : v.commonAttributeDto.nameStyle
                        "
                      >
                        <el-input
                          v-model="v.eleValue"
                          class="width100"
                          type="text"
                          :placeholder="v.commonAttributeDto.placeholderText"
                          :maxlength="v.maxLengthText"
                          :minlength="v.minLengthText"
                          :show-password="
                            v.elementCode &&
                            v.commonAttributeDto.checkSecret == '1'
                          "
                        ></el-input>
                      </LFormtTitle>
                    </div>
                    <div v-else-if="v.elementBaseName == '有无元素'">
                      <LChooseComp
                        :label="v.elementName"
                        :displayMode="v.commonAttributeDto.nameStyle"
                      >
                        <el-radio-group v-model="v.eleValue">
                          <el-radio
                            v-for="(value, key) in v.proprietaryAttributeVoLst"
                            :key="key"
                            :label="value.proprietaryContent"
                            v-if="
                              value.proprietaryCode == '0800' ||
                              value.proprietaryCode == '0801'
                            "
                            >{{ value.proprietaryContent }}</el-radio
                          >
                        </el-radio-group>
                      </LChooseComp>
                    </div>
                    <div v-else-if="v.elementBaseName == '单选元素'">
                      <div v-if="!v.valueLst.length">
                        <el-radio v-model="v.eleValue" :label="index">{{
                          v.elementName
                        }}</el-radio>
                      </div>
                      <div v-else>
                        <LChooseComp
                          :label="v.elementName"
                          :displayMode="v.commonAttributeDto.nameStyle"
                        >
                          <el-radio-group v-model="v.eleValue">
                            <el-radio
                              :label="value.vMean"
                              v-for="(value, key) in v.valueLst"
                              :key="key"
                              >{{ value.vMean }}</el-radio
                            >
                          </el-radio-group>
                        </LChooseComp>
                      </div>
                    </div>
                    <div v-else-if="v.elementBaseName == '多选元素'">
                      <div v-if="!v.valueLst.length">
                        <el-checkbox v-model="v.eleValue">{{
                          v.elementName
                        }}</el-checkbox>
                      </div>
                      <div v-else class="clearfix">
                        <div
                          class
                          v-if="v.commonAttributeDto.checkHidden === '0'"
                        >
                          <LChooseComp
                            :label="v.elementName"
                            :displayMode="v.commonAttributeDto.nameStyle"
                          >
                            <el-checkbox-group v-model="v.eleValue">
                              <el-checkbox
                                :label="value.vMean"
                                v-for="(value, key) in v.valueLst"
                                :key="key"
                                >{{ value.vMean }}</el-checkbox
                              >
                            </el-checkbox-group>
                          </LChooseComp>
                        </div>
                      </div>
                    </div>
                    <div
                      v-else-if="v.elementBaseName == '单选下拉元素'"
                      class="width100"
                    >
                      <LFormtTitle
                        :label="v.elementName"
                        :displayMode="v.commonAttributeDto.nameStyle"
                      >
                        <el-select
                          v-model="v.eleValue"
                          class="width100"
                          :placeholder="v.commonAttributeDto.placeholderText"
                          filterable
                          clearable
                          :allow-create="v.commonAttributeDto.checkEdit === '1'"
                        >
                          <el-option
                            v-for="(val, key) in v.valueLst"
                            :key="key"
                            :label="val.vMean"
                            :value="val.vMean"
                          ></el-option>
                        </el-select>
                      </LFormtTitle>
                    </div>
                    <div
                      v-else-if="v.elementBaseName == '多选下拉元素'"
                      class="width100"
                    >
                      <LFormtTitle
                        :label="v.elementName"
                        :displayMode="v.commonAttributeDto.nameStyle"
                      >
                        <el-select
                          v-model="v.eleValue"
                          class="width100"
                          :placeholder="v.commonAttributeDto.placeholderText"
                          multiple
                          filterable
                          clearable
                          :allow-create="v.commonAttributeDto.checkEdit === '1'"
                        >
                          <el-option
                            v-for="(val, key) in v.valueLst"
                            :key="key"
                            :label="val.vMean"
                            :value="val.vMean"
                          ></el-option>
                        </el-select>
                      </LFormtTitle>
                    </div>
                    <div
                      v-else-if="v.elementBaseName == '日期元素'"
                      class="width100"
                    >
                      <LFormtTitle
                        :label="v.elementName"
                        :displayMode="v.commonAttributeDto.nameStyle"
                      >
                        <template v-if="v.dateFormatType === '3'">
                          <el-time-picker
                            v-model="v.eleValue"
                            :placeholder="v.commonAttributeDto.placeholderText"
                            class="width100"
                            :format="v.dateFormat"
                            :value-format="v.dateFormat"
                            clearable
                          ></el-time-picker>
                        </template>
                        <template v-else>
                          <el-date-picker
                            v-model="v.eleValue"
                            :placeholder="v.commonAttributeDto.placeholderText"
                            :type="
                              v.dateFormatType === '2' ? 'date' : 'datetime'
                            "
                            class="width100"
                            :format="v.dateFormat"
                            :value-format="v.dateFormat"
                            clearable
                          ></el-date-picker>
                        </template>
                      </LFormtTitle>
                    </div>
                    <div
                      v-else-if="v.elementBaseName == '签名元素'"
                      class="width100"
                    >
                      <LFormtTitle
                        :label="v.elementName"
                        :displayMode="v.commonAttributeDto.nameStyle"
                      >
                        <retrieve-select
                          :eleValue.sync="v.eleValue"
                          :placeholder="v.commonAttributeDto.placeholderText"
                          :options="v.nursingList"
                        ></retrieve-select>
                      </LFormtTitle>
                    </div>
                    <div
                      :title="v.elementName"
                      v-else
                      class="link-eleList-item-text width100"
                    >
                      {{ v.elementName }}
                    </div>
                  </div>
                  <div
                    class="float-right delete-button iconfont iconfucetengtongtubiao-"
                    @click="deleteLinkEle(index, k)"
                  ></div>
                </div>
                <div class="add-button">
                  <el-button
                    class="width100"
                    type="text"
                    @click="addLinkEle(index)"
                    >添加联动元素</el-button
                  >
                </div>
              </div>
            </div>
            <div class="button-cont">
              <el-button class="width100" type="primary" plain @click="addLink"
                >添加条件</el-button
              >
            </div>
          </div>
          <!--联动元素可用性-->
          <div class="links height100" v-if="currentIndex == 5">
            <div class="link-content">
              <div
                class="link"
                v-for="(item, index) in interactionData.linkEnaData.linkList"
                :key="index"
              >
                <div class="link-top clearfix">
                  <div
                    class="float-left link-top-left"
                    :title="interactionData.linkEnaData.judgeEle.elementName"
                    @click="buttonFocus('judgeEle')"
                    :class="{
                      'activity-focus':
                        currentInput.name === 'judgeEle' &&
                        currentInput.define === 'linkEnas',
                    }"
                  >
                    {{ interactionData.linkEnaData.judgeEle.elementName }}
                  </div>
                  <div class="float-left link-top-center1">
                    <LFormtTitle label="判断符">
                      <el-select
                        v-model="item.judgeCondition"
                        class="width100"
                        placeholder="请选择"
                        @change="
                          judgeConditionChange(
                            item.judgeCondition,
                            'linkEnaData',
                            index
                          )
                        "
                      >
                        <el-option
                          v-for="(val, key) in item.judgeConditions"
                          :key="key"
                          :label="val"
                          :value="val"
                        ></el-option>
                      </el-select>
                    </LFormtTitle>
                  </div>
                  <div class="float-left link-top-center2">
                    <LFormtTitle label="判断值">
                      <el-input
                        v-model="item.judgeValue"
                        class="width100"
                        placeholder="请输入"
                      ></el-input>
                    </LFormtTitle>
                  </div>
                  <div
                    class="float-right link-top-right iconfont iconfucetengtongtubiao-"
                    @click="deleteLinkEna(index)"
                  ></div>
                </div>
                <div
                  class="link-eleList clearfix"
                  v-for="(v, k) in item.EveTarget"
                  :key="k"
                  @click="buttonFocus('EveTarget', index, k)"
                  :class="{
                    'activity-focus':
                      currentInput.name === 'EveTarget' &&
                      currentInput.defines === 'linkEnas' &&
                      currentInput.index === index &&
                      currentInput.k === k,
                  }"
                >
                  <div class="link-eleList-item float-left">
                    <el-checkbox v-model="v.enable">{{
                      v.elementName
                    }}</el-checkbox>
                  </div>
                  <div
                    class="float-right delete-button iconfont iconfucetengtongtubiao-"
                    @click="deleteLinkEnaEle(index, k)"
                  ></div>
                </div>
                <div class="add-button">
                  <el-button
                    class="width100"
                    type="text"
                    @click="addLinkEnaEle(index)"
                    >添加联动元素</el-button
                  >
                </div>
              </div>
            </div>
            <div class="button-cont">
              <el-button
                class="width100"
                type="primary"
                plain
                @click="addLinkEna"
                >添加条件</el-button
              >
            </div>
          </div>
          <!--联动元素可见性-->
          <div class="links height100" v-if="currentIndex == 6">
            <div class="link-content">
              <div
                class="link"
                v-for="(item, index) in interactionData.linkVisData.linkList"
                :key="index"
              >
                <div class="link-top clearfix">
                  <div
                    class="float-left link-top-left"
                    :title="interactionData.linkVisData.judgeEle.elementName"
                    @click="buttonFocus('judgeEle')"
                    :class="{
                      'activity-focus':
                        currentInput.name === 'judgeEle' &&
                        currentInput.define === 'linkViss',
                    }"
                  >
                    {{ interactionData.linkVisData.judgeEle.elementName }}
                  </div>
                  <div class="float-left link-top-center1">
                    <LFormtTitle label="判断符">
                      <el-select
                        v-model="item.judgeCondition"
                        class="width100"
                        placeholder="请选择"
                        @change="
                          judgeConditionChange(
                            item.judgeCondition,
                            'linkVisData',
                            index
                          )
                        "
                      >
                        <el-option
                          v-for="(val, key) in item.judgeConditions"
                          :key="key"
                          :label="val"
                          :value="val"
                        ></el-option>
                      </el-select>
                    </LFormtTitle>
                  </div>
                  <div class="float-left link-top-center2">
                    <LFormtTitle label="判断值">
                      <el-input
                        v-model="item.judgeValue"
                        class="width100"
                        placeholder="请输入"
                      ></el-input>
                    </LFormtTitle>
                  </div>
                  <div
                    class="float-right link-top-right iconfont iconfucetengtongtubiao-"
                    @click="deleteLinkVis(index)"
                  ></div>
                </div>
                <div
                  class="link-eleList clearfix"
                  v-for="(v, k) in item.EveTarget"
                  :key="k"
                  @click="buttonFocus('EveTarget', index, k)"
                  :class="{
                    'activity-focus':
                      currentInput.name === 'EveTarget' &&
                      currentInput.defines === 'linkViss' &&
                      currentInput.index === index &&
                      currentInput.k === k,
                  }"
                >
                  <div class="link-eleList-item float-left">
                    <el-checkbox v-model="v.visible">{{
                      v.elementName
                    }}</el-checkbox>
                  </div>
                  <div
                    class="float-right delete-button iconfont iconfucetengtongtubiao-"
                    @click="deleteLinkVisEle(index, k)"
                  ></div>
                </div>
                <div class="add-button">
                  <el-button
                    class="width100"
                    type="text"
                    @click="addLinkVisEle(index)"
                    >添加联动元素</el-button
                  >
                </div>
              </div>
            </div>
            <div class="button-cont">
              <el-button
                class="width100"
                type="primary"
                plain
                @click="addLinkVis"
                >添加条件</el-button
              >
            </div>
          </div>
          <!--数据引用-->
          <div class="quote height100" v-if="currentIndex == 7">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item name="baseInfo" title="基础信息引用">
                <div class="quote-cont">
                  <div
                    v-for="(item, index) in interactionData.quoteData.baseInfo"
                    :key="index"
                    class="list-item clearfix"
                    :class="{
                      'activity-focus':
                        currentInput.name === 'baseInfo' &&
                        currentInput.index === index,
                    }"
                  >
                    <div
                      class="ele-name float-left"
                      @click="buttonFocus('baseInfo', index)"
                      :title="item.elementName"
                    >
                      {{ item.elementName }}
                    </div>
                    <div
                      class="info-name float-left"
                      @click="buttonFocus('baseInfo', index)"
                      :title="item.baseInfo"
                    >
                      {{ item.baseInfo }}
                    </div>
                    <div
                      class="float-right delete-button iconfont iconfucetengtongtubiao-"
                      @click="deleteBaseInfo(index)"
                    ></div>
                  </div>
                  <div class="add-button">
                    <el-button class="width100" type="text" @click="addBaseInfo"
                      >添加</el-button
                    >
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item name="docEle" title="文书元素值引用">
                <div class="quote-cont">
                  <div
                    v-for="(item, index) in interactionData.quoteData.docEle"
                    :key="index"
                    class="list-item clearfix"
                    :class="{
                      'activity-focus':
                        currentInput.name === 'docEle' &&
                        currentInput.index === index,
                    }"
                  >
                    <div
                      class="eleDoc-name float-left"
                      @click="buttonFocus('docEle', index)"
                      :title="item.elementName"
                    >
                      {{ item.elementName }}
                    </div>
                    <div
                      class="doc-name float-left"
                      @click="buttonFocus('docEle', index)"
                      :title="item.docName"
                    >
                      {{ item.docName }}
                    </div>
                    <div
                      class="docEle-name float-left"
                      @click="buttonFocus('docEle', index)"
                      :title="item.docEleName"
                    >
                      {{ item.docEleName }}
                    </div>
                    <div
                      class="float-right delete-button iconfont iconfucetengtongtubiao-"
                      @click="deleteDocEle(index)"
                    ></div>
                  </div>
                  <div class="add-button">
                    <el-button class="width100" type="text" @click="addDocEle"
                      >添加</el-button
                    >
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item name="tempPro" title="体温单项目值引用">
                <div class="quote-cont">
                  <div
                    v-for="(item, index) in interactionData.quoteData.tempPro"
                    :key="index"
                    class="list-item clearfix"
                    :class="{
                      'activity-focus':
                        currentInput.name === 'tempPro' &&
                        currentInput.index === index,
                    }"
                  >
                    <div
                      class="ele-name float-left"
                      @click="buttonFocus('tempPro', index)"
                      :title="item.elementName"
                    >
                      {{ item.elementName }}
                    </div>
                    <div class="info-name float-left" :title="item.itemName">
                      {{ item.itemName }}
                    </div>
                    <div
                      class="float-right delete-button iconfont iconfucetengtongtubiao-"
                      @click="deleteTempPro(index)"
                    ></div>
                  </div>
                  <div class="add-button">
                    <el-button class="width100" type="text" @click="addTempPro"
                      >添加</el-button
                    >
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item name="tableData" title="表字段值引用">
                <div class="quote-cont">
                  <div
                    v-for="(item, index) in interactionData.quoteData.tableData"
                    :key="index"
                    class="list-item clearfix"
                    :class="{
                      'activity-focus':
                        currentInput.name === 'tableData' &&
                        currentInput.index === index,
                    }"
                  >
                    <div
                      class="eleDoc-name float-left"
                      @click="buttonFocus('tableData', index)"
                      :title="item.elementName"
                    >
                      {{ item.elementName }}
                    </div>
                    <div
                      class="doc-name float-left"
                      @click="buttonFocus('tableData', index)"
                      :title="item.tableName"
                    >
                      {{ item.tableName }}
                    </div>
                    <div
                      class="docEle-name float-left"
                      @click="buttonFocus('tableData', index)"
                      :title="item.tableColumnName"
                    >
                      {{ item.tableColumnName }}
                    </div>
                    <div
                      class="float-right delete-button iconfont iconfucetengtongtubiao-"
                      @click="deleteTable(index)"
                    ></div>
                  </div>
                  <div class="add-button">
                    <el-button class="width100" type="text" @click="addTable"
                      >添加</el-button
                    >
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div
          class="right-list float-left"
          :style="{ 'margin-right': currentIndex == 7 ? '10px' : '0' }"
          v-if="isTreeList"
        >
          <div class="name">元素列表</div>
          <div class="input-cont">
            <el-input
              v-model="filterText"
              placeholder="输入关键词搜索"
              class="width100"
            >
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div class="tree-cont">
            <el-tree
              ref="tree"
              :data="nursingTreeDatas"
              :props="defaultProps"
              :highlight-current="highlightFlag"
              :show-checkbox="showCheckbox"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              node-key="eleId"
              @node-click="nodeClick"
              @check-change="handleCheckChange"
            ></el-tree>
          </div>
        </div>
        <div
          class="last-list float-left"
          v-if="currentIndex == 7 || (currentIndex == 2 && isAsyncTemp)"
        >
          <div
            v-if="currentIndex == 7 && activeName == 'baseInfo'"
            class="list-item height100"
          >
            <el-table
              ref="baseInfoTable"
              :data="baseInfoTableData"
              width="100%"
              height="100%"
              stripe
              border
              highlight-current-row
              @row-click="baseInfoClick"
            >
              <el-table-column
                v-for="(item, index) in baseInfoTableParams"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :min-width="item.width"
                :header-align="item.headerAlign"
                :align="item.align"
              ></el-table-column>
            </el-table>
          </div>
          <div
            v-else-if="currentIndex == 7 && activeName == 'docEle'"
            class="list-item height100"
          >
            <div class="select-cont">
              <el-select
                v-model="currentDocCode"
                placeholder="请选择文书"
                filterable
                clearable
                @change="currentDocInfoChange"
              >
                <el-option
                  v-for="item in docInfoData"
                  :key="item.docCode"
                  :label="item.docName"
                  :value="item.docCode"
                ></el-option>
              </el-select>
            </div>
            <div class="input-cont">
              <el-input
                v-model="quoteDocTreeFilterText"
                placeholder="输入关键词搜索"
                class="width100"
              >
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <div class="tree-cont">
              <el-tree
                ref="quoteDocTree"
                :data="quoteDocTreeData"
                :props="defaultProps"
                :highlight-current="highlightFlag"
                default-expand-all
                :expand-on-click-node="false"
                :filter-node-method="quoteDocTreeFilterNode"
                node-key="eleId"
                @node-click="quoteDocTreeNodeClick"
              ></el-tree>
            </div>
          </div>
          <div
            v-else-if="activeName == 'tempPro' || isAsyncTemp"
            class="list-item tempProList-item height100"
          >
            <el-collapse v-model="tempProActiveNames">
              <el-collapse-item
                v-for="($item, $index) in collapseTempPro"
                :key="$index"
                :name="$index"
                :title="$item.title"
              >
                <el-table
                  ref="tempProTable"
                  :data="$item.data"
                  border
                  stripe
                  width="100%"
                  height="300px"
                  @row-click="tempProClick"
                >
                  <el-table-column
                    v-for="(item, index) in tempProTableParams"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.width"
                    :align="item.align || 'center'"
                    header-align="center"
                    show-overflow-tooltip
                  ></el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div
            v-else-if="currentIndex == 7 && activeName == 'tableData'"
            class="list-item height100"
          >
            <div class="select-cont">
              <el-select
                v-model="currentTableName"
                filterable
                clearable
                placeholder="请选择表"
                @change="currentTableChange"
              >
                <el-option
                  v-for="(item, index) in dbTableData"
                  :key="index"
                  :label="item.TABLE_NAME"
                  :value="item.TABLE_NAME"
                ></el-option>
              </el-select>
            </div>
            <div class="table-cont">
              <el-table
                ref="tableColumnTable"
                :data="tableColumnData"
                width="100%"
                height="100%"
                stripe
                border
                highlight-current-row
                @row-click="tableColumnClick"
              >
                <el-table-column
                  v-for="(item, index) in tableColumnParams"
                  :key="index"
                  :label="item.label"
                  :prop="item.prop"
                  :min-width="item.width"
                  :header-align="item.headerAlign"
                  :align="item.align"
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import {
  getBaseInfo,
  getDbTables,
  getTableColumn
} from "@/api/emrRecord/nursingRecord/docToolInteraction";
import {
  getDocInfo,
  getDocVersionInfo
} from "@/api/emrRecord/nursingRecord/docInfoMaintain";
import { getItemListData } from "@/api/emrRecord/public/temperature";

import { deepClone } from "@/utils/index";

let interactionData = {
  BMIData: {
    BMI: {
      elementName: "请选择BMI元素"
    },
    weight: {
      elementName: "请选择体重元素"
    },
    height: {
      elementName: "请选择身高元素"
    }
  },
  grades: {
    totalScore: {
      elementName: "显示选中的总分元素"
    },
    multiGrades: true,
    isZero: false,
    gradesList: []
  },
  quantity: {
    /* inQuantity: [
            {
              elementName: "请选择入量元素"
            }
          ],
          outQuantity: [
            {
              elementName: "请选择出量元素"
            }
          ],
          AllQuantity: [
            {
              elementName: "请选择统计元素"
            }
          ] */
    quantity: {
      editStyle: "",
      showStyle: "",
      isStatistics: false,
      inQuantity: {
        parent: { elementName: "请选择入量父元素" },
        allEle: { elementName: "请选择总入量元素" },
        eleList: [
          {
            nameList: { elementName: "名称元素" },
            valueList: { elementName: "值元素" },
            quantityRadio: 1
          }
        ]
      },
      outQuantity: {
        parent: { elementName: "请选择出量父元素" },
        allEle: { elementName: "请选择总出量元素" },
        eleList: [
          {
            nameList: { elementName: "名称元素" },
            valueList: { elementName: "值元素" },
            quantityRadio: 2
          }
        ]
      }
    },
    summary: {
      summaryEle: {
        elementName: "请选择小结/总结元素"
      },
      showRadio: 1,
      timeRadio: 1,
      dateMin: "",
      dateMax: "",
      titleAttr: [],
      summaryTitle: [], //小结标题
      dateAttr: [],
      dateFormat: "",
      asyncAttr: [],
      inQuantityEle: { itemName: "选择入量项目" },
      outQuantityEle: { itemName: "选择出量项目" }
    }
  },
  linkData: {
    judgeEle: {
      elementName: "元素"
    },
    linkList: [
      {
        judgeCondition: "",
        judgeConditions: [
          "==",
          "!=",
          ">",
          ">=",
          "<",
          "<=",
          "()",
          "(]",
          "[)",
          "[]",
          "包含",
          "不包含",
          "包含于"
        ],
        judgeValue: "",
        EveTarget: []
      }
    ]
  },
  linkEnaData: {
    judgeEle: {
      elementName: "元素"
    },
    linkList: [
      {
        judgeCondition: "",
        judgeConditions: [
          "==",
          "!=",
          ">",
          ">=",
          "<",
          "<=",
          "()",
          "(]",
          "[)",
          "[]",
          "包含",
          "不包含",
          "包含于"
        ],
        judgeValue: "",
        EveTarget: []
      }
    ]
  },
  linkVisData: {
    judgeEle: {
      elementName: "元素"
    },
    linkList: [
      {
        judgeCondition: "",
        judgeConditions: [
          "==",
          "!=",
          ">",
          ">=",
          "<",
          "<=",
          "()",
          "(]",
          "[)",
          "[]",
          "包含",
          "不包含",
          "包含于"
        ],
        judgeValue: "",
        EveTarget: []
      }
    ]
  },
  quoteData: {
    baseInfo: [],
    docEle: [],
    tempPro: [],
    tableData: []
  }
};
export default {
  name: "docToolInteraction",
  props: {
    nursingTreeDatas: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      activeNames: [
        "CDEE_BMI",
        "CDEE_SCORE",
        "CDEE_Quantity",
        "CDEE_SetVal",
        "CDEE_SetEna",
        "CDEE_SetVis",
        "CDEE_QUOTE"
      ],
      collapseList: [
        {
          title: "计算BMI",
          EveCode: "CDEE_BMI"
        },
        {
          title: "计算分值",
          EveCode: "CDEE_SCORE"
        },
        {
          title: "出入量/小结/总结",
          EveCode: "CDEE_Quantity"
        },
        {
          title: "设置联动元素值",
          EveCode: "CDEE_SetVal"
        },
        {
          title: "设置联动元素可用性",
          EveCode: "CDEE_SetEna"
        },
        {
          title: "设置联动元素可见性",
          EveCode: "CDEE_SetVis"
        },
        {
          title: "数据引用",
          EveCode: "CDEE_QUOTE"
        }
      ],
      isAdd: "1",
      editIndex: 0,
      dialogVisible: false,
      interactionList: [
        {
          name: "计算BMI",
          isClick: true
        },
        {
          name: "计算分值",
          isClick: false
        },
        {
          name: "统计出入量",
          isClick: false
        },
        {
          name: "检测异常值",
          isClick: false
        },
        {
          name: "设置联动元素值",
          isClick: false
        },
        {
          name: "设置联动元素可用性",
          isClick: false
        },
        {
          name: "设置联动元素可见性",
          isClick: false
        },
        {
          name: "数据引用",
          isClick: false
        }
      ],
      currentIndex: 0,
      //right
      filterText: "",
      highlightFlag: true,
      showCheckbox: false,
      defaultProps: {
        children: "eleList",
        label: "elementName"
      },
      //树数据
      nursingTreeDataSave: [],
      //当前focus
      currentInput: "",
      //center元素数据
      interactionData: deepClone(interactionData),
      //引用元素
      activeName: "baseInfo",
      baseInfoIndex: "",
      baseInfoTableParams: [
        {
          label: "基本信息",
          prop: "baseInfo",
          width: "150",
          align: "center",
          headerAlign: "center"
        }
      ],
      baseInfoTableData: [],
      docInfoData: [],
      currentDocCode: "",
      currentDoc: {},
      quoteDocTreeData: [],
      quoteDocTreeFilterText: "",
      tempProActiveNames: [0, 1, 2],
      tempProTableParams: [
        {
          label: "项目名称",
          prop: "itemName",
          width: "150",
          align: "center",
          headerAlign: "center"
        }
      ],
      collapseTempPro: [
        {
          title: "体征项目",
          data: []
        },
        {
          title: "一般项目",
          data: []
        },
        {
          title: "自定义项目",
          data: []
        }
      ],
      currentTableName: "",
      dbTableData: [],
      tableColumnParams: [
        {
          label: "字段名称",
          prop: "COLUMN_NAME",
          width: "150",
          align: "center",
          headerAlign: "center"
        }
      ],
      tableColumnData: [],
      quoteMatch: {
        baseInfo: "基本信息引用： ",
        docEle: "文书元素值引用： ",
        tempPro: "体温单项目值引用： ",
        tableData: "表字段值引用： "
      },
      dateFormatOptions: [
        {
          value: "yyyy-MM-dd HH:mm:ss",
          label: "yyyy-MM-dd HH:mm:ss"
        },
        {
          value: "yyyy-MM-dd",
          label: "yyyy-MM-dd"
        },
        {
          value: "yyyy年MM月dd日 HH时mm分",
          label: "yyyy年MM月dd日 HH时mm分"
        },
        {
          value: "yyyy年MM月dd日 HH时",
          label: "yyyy年MM月dd日 HH时"
        },
        {
          value: "yyyy年MM月dd日",
          label: "yyyy年MM月dd日"
        },
        {
          value: "yyyy/MM/dd",
          label: "yyyy/MM/dd"
        },
        {
          value: "MM-dd",
          label: "MM-dd"
        },
        {
          value: "MM:dd",
          label: "MM:dd"
        },
        {
          value: "MM月dd日",
          label: "MM月dd日"
        },
        {
          value: "HH时mm分",
          label: "HH时mm分"
        },
        {
          value: "HH:mm",
          label: "HH:mm"
        }
      ],
      //文书树结构是否显示
      isTreeList: true,
      //体温单是否显示条件之一
      isAsyncTemp: false
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    quoteDocTreeFilterText(val) {
      this.$refs.quoteDocTree.filter(val);
    },
    nursingTreeData: {
      handler(val) {
        this.nursingTreeDataSave = [];
        if (val && val.length > 0) {
          this.nursingTreeDataSave = val;
        }
      },
      immediate: true,
      deep: true
    },
    activeName: {
      handler(val) {
        if (val == "baseInfo") {
          this.getPatientInfo();
        } else if (val == "docEle") {
          this.getdocInfoData();
        } else if (val == "tempPro") {
          this.getTempProTableData();
        } else if (val == "tableData") {
          this.getDbTables();
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters("nurseDocument", ["nursingTreeData"])
  },
  methods: {
    async quantityChange(name, item, index) {
      let listIn = this.interactionData.quantity.quantity["inQuantity"].eleList;
      let listOut = this.interactionData.quantity.quantity["outQuantity"]
        .eleList;
      if (name === "inQuantity") {
        if (item.quantityRadio === 2) {
          await this.$set(listOut, listOut.length, deepClone(item));
          await this.$delete(listIn, index);
        }
      } else if (name === "outQuantity") {
        if (item.quantityRadio === 1) {
          await this.$set(listIn, listIn.length, deepClone(item));
          await this.$delete(listOut, index);
        }
      }
    },
    deleteQuantityList(name, index) {
      let list = this.interactionData.quantity.quantity[name].eleList;
      this.$delete(list, index);
    },
    addQuantityList(name, index) {
      let list = this.interactionData.quantity.quantity[name].eleList;
      this.$set(list, list.length, {
        nameList: { elementName: "名称元素" },
        valueList: { elementName: "值元素" },
        quantityRadio: name === "inQuantity" ? 1 : 2
      });
    },
    //点击同步到体温单
    async asyncTemp() {
      if (
        this.interactionData.quantity.summary.asyncAttr.indexOf(
          "同步到体温单"
        ) > -1
      ) {
        this.isAsyncTemp = true;
        this.isTreeList = false;
      } else {
        this.isAsyncTemp = false;
        this.isTreeList = true;
      }
    },
    ...mapActions({
      changeNursingTreeData: "nurseDocument/changeNursingTreeData"
    }),
    //重置
    reset() {
      this.currentIndex = 0;
      this.interactionData = deepClone(interactionData);
      this.showCheckbox = false;
    },
    //编辑交互
    async editEvents(EveCode, index) {
      this.isAdd = "0";
      this.dialogVisible = true;
      this.reset();
      this.editIndex = index;
      let eleEventList = this.nursingTreeDataSave[0].eleEventList
        ? this.nursingTreeDataSave[0].eleEventList
        : [];
      if (EveCode == "CDEE_BMI") {
        this.currentIndex = 0;
        this.interactionData.BMIData.BMI = eleEventList[index].EveTargetObj;
        this.interactionData.BMIData.weight = eleEventList[index].EveListObj[0];
        this.interactionData.BMIData.height = eleEventList[index].EveListObj[1];
      } else if (EveCode == "CDEE_SCORE") {
        this.currentIndex = 1;
        this.interactionData.grades.totalScore =
          eleEventList[index].EveTargetObj;
        this.interactionData.grades.multiGrades = eleEventList[index].EveMulti;
        this.interactionData.grades.isZero = eleEventList[index].EveIsZero;
        // this.showCheckbox = eleEventList[index].EveMulti;
        this.showCheckbox = true;
        this.interactionData.grades.gradesList = eleEventList[index].EveListObj;
      } else if (EveCode == "CDEE_Quantity") {
        this.currentIndex = 2;
        await this.getTempProTableData();
        // this.showCheckbox = true;
        /* this.interactionData.quantity.inQuantity =
          eleEventList[index].EveListObj[0];
        this.interactionData.quantity.outQuantity =
          eleEventList[index].EveListObj[1];
        this.interactionData.quantity.AllQuantity = [
          eleEventList[index].EveTargetObj
        ]; */
        this.interactionData.quantity = eleEventList[index].allObj;
      } else if (EveCode == "CDEE_SetVal") {
        this.currentIndex = 4;
        this.interactionData.linkData.judgeEle =
          eleEventList[index].EveListObj[0];
        this.interactionData.linkData.linkList =
          eleEventList[index].EveContions;
      } else if (EveCode == "CDEE_SetEna") {
        this.currentIndex = 5;
        this.interactionData.linkEnaData.judgeEle =
          eleEventList[index].EveListObj[0];
        this.interactionData.linkEnaData.linkList =
          eleEventList[index].EveContions;
      } else if (EveCode == "CDEE_SetVis") {
        this.currentIndex = 6;
        this.interactionData.linkVisData.judgeEle =
          eleEventList[index].EveListObj[0];
        this.interactionData.linkVisData.linkList =
          eleEventList[index].EveContions;
      }
    },
    async editEvents1(index, k, kk) {
      this.isAdd = "0";
      this.dialogVisible = true;
      this.reset();
      this.editIndex = index;
      let eleEventList = this.nursingTreeDataSave[0].eleEventList
        ? this.nursingTreeDataSave[0].eleEventList
        : [];
      this.currentIndex = 7;
      await this.getPatientInfo();
      this.activeName = k;
      this.interactionData.quoteData = eleEventList[index]["QuoteList"];
    },
    //删除交互
    deleteEvents(index) {
      let eleEventList = this.nursingTreeDataSave[0].eleEventList
        ? this.nursingTreeDataSave[0].eleEventList
        : [];
      this.$delete(eleEventList, index);
      this.nursingTreeDataSave[0].eleEventList = eleEventList;
      this.nursingTreeDataSave[0].isModify = true;
      this.changeNursingTreeData(this.nursingTreeDataSave);
    },
    deleteEvents1(index, k, kk) {
      let eleEventList = this.nursingTreeDataSave[0].eleEventList
        ? this.nursingTreeDataSave[0].eleEventList
        : [];
      this.$delete(eleEventList[index]["QuoteList"][k], kk);
      this.nursingTreeDataSave[0].eleEventList = eleEventList;
      this.nursingTreeDataSave[0].isModify = true;
      this.changeNursingTreeData(this.nursingTreeDataSave);
    },
    //新增交互
    addNewInteraction() {
      this.isAdd = "1";
      this.reset();
      this.dialogVisible = true;
    },
    //点击某一列交互
    async itemClick(item, index) {
      this.currentIndex = index;
      this.showCheckbox = false;
      this.$refs.tree.setCheckedKeys([]);
      if (index === 1) {
        this.showCheckbox = true;
      }
      if (index === 2) {
        await this.getTempProTableData();
      }
      if (index === 7) {
        await this.getPatientInfo();
      }
    },
    //筛选元素
    filterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.elementName.indexOf(value) !== -1;
    },
    async buttonRemove(name) {
      if (this.currentIndex == 0) {
        this.interactionData.BMIData[name] = {
          elementName:
            name === "BMI"
              ? "请选择BMI元素"
              : name === "weight"
              ? "请选择体重元素"
              : name === "height"
              ? "请选择身高元素"
              : ""
        };
      }
      if (this.currentIndex == 2) {
        if (name === "inParent") {
          this.interactionData.quantity.quantity.inQuantity.parent = {
            elementName: "请选择入量父元素"
          };
        }
        if (name === "outParent") {
          this.interactionData.quantity.quantity.outQuantity.parent = {
            elementName: "请选择出量父元素"
          };
        }
        if (name === "inAllEle") {
          this.interactionData.quantity.quantity.inQuantity.allEle = {
            elementName: "请选择总入量元素"
          };
        }
        if (name === "outAllEle") {
          this.interactionData.quantity.quantity.outQuantity.allEle = {
            elementName: "请选择总出量元素"
          };
        }
        if (name === "summaryEle") {
          this.interactionData.quantity.summary.summaryEle = {
            elementName: "请选择小结/总结元素"
          };
        }
        if (name === "inQuantityEle") {
          this.interactionData.quantity.summary.inQuantityEle = {
            itemName: "选择入量项目"
          };
        }
        if (name === "outQuantityEle") {
          this.interactionData.quantity.summary.outQuantityEle = {
            itemName: "选择出量项目"
          };
        }
      }
    },
    async buttonFocus(name, index, k) {
      if (this.currentIndex == 0) {
        this.currentInput = name;
      } else if (this.currentIndex == 1) {
        if (index != undefined) {
          this.currentInput = {
            name: name,
            index: index
          };
        } else {
          this.currentInput = name;
        }
        if (this.interactionData.grades.multiGrades) {
          this.$refs.tree.setCheckedKeys([]);
          //计分元素(多选元素)-点击节点=>右侧节点变化
          let arr = [];
          this.interactionData.grades.gradesList[index].forEach(
            (item, index) => {
              if (item.eleId) {
                arr.push(item.eleId);
              }
            }
          );
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(arr);
          });
        }
      } else if (this.currentIndex == 2) {
        this.showCheckbox = false;
        this.currentInput = {
          name: name,
          index: index === undefined ? "" : index,
          k: k === undefined ? "" : k
        };
        if (name === "inQuantityEle" || name === "outQuantityEle") {
          this.isAsyncTemp = true;
          this.isTreeList = false;
        } else {
          this.isAsyncTemp = false;
          this.isTreeList = true;
        }
        /* this.currentInput = name;
        if (name === "AllQuantity") {
          this.showCheckbox = false;
          return;
        }
        this.showCheckbox = true;
        let arr = [];
        this.$refs.tree.setCheckedKeys([]);
        this.interactionData.quantity[name].forEach((item, index) => {
          if (item.eleId) {
            arr.push(item.eleId);
          }
        });
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(arr);
        }); */
      } else if (this.currentIndex == 4) {
        if (index != undefined) {
          this.currentInput = {
            name: name,
            index: index,
            k: k,
            defines: "links"
          };
        } else {
          this.currentInput = {
            name,
            define: "links"
          };
        }
      } else if (this.currentIndex == 5) {
        if (index != undefined) {
          this.currentInput = {
            name: name,
            index: index,
            k: k,
            defines: "linkEnas"
          };
        } else {
          this.currentInput = {
            name,
            define: "linkEnas"
          };
        }
      } else if (this.currentIndex == 6) {
        if (index != undefined) {
          this.currentInput = {
            name: name,
            index: index,
            k: k,
            defines: "linkViss"
          };
        } else {
          this.currentInput = {
            name,
            define: "linkViss"
          };
        }
      } else if (this.currentIndex == 7) {
        if (name === "baseInfo" || name === "tempPro") {
          this.currentInput = {
            name: name,
            index: index
          };
        } else if (name === "docEle") {
          this.currentInput = {
            name: name,
            index: index
          };
          let list = this.interactionData.quoteData[name];
          if (list[index]["docCode"]) {
            if (this.currentDocCode !== list[index]["docCode"]) {
              this.currentDocCode = list[index]["docCode"];
              this.quoteDocTreeData = [];
              await this.getDocEle();
              //setCurrentNode
            }
          } else {
            this.$set(list, index, {
              ...list[index],
              ...this.currentDoc
            });
          }
        } else if (name === "tableData") {
          this.currentInput = {
            name: name,
            index: index
          };
          let list = this.interactionData.quoteData[name];
          if (
            list[index]["tableName"] &&
            list[index]["tableName"] !== "表名称"
          ) {
            if (this.currentTableName !== list[index]["tableName"]) {
              this.currentTableName = list[index]["tableName"];
              this.tableColumnData = [];
              await this.getTableColumn();
            }
            if (this.tableColumnData.length) {
              for (let i in this.tableColumnData) {
                if (
                  list[index].tableColumnName ===
                  this.tableColumnData[i]["COLUMN_NAME"]
                ) {
                  this.$refs.tableColumnTable.setCurrentRow(
                    this.tableColumnData[i]
                  );
                }
              }
            }
          } else {
            this.$set(list, index, {
              ...list[index],
              tableName: this.currentTableName || "表名称"
            });
          }
        }
      }
    },
    //点击右侧树节点
    // eslint-disable-next-line complexity
    nodeClick(data, node) {
      if (node.level === 1) {
        this.$message.error("不可选择文书名称");
        return;
      }
      if (this.currentIndex == 0) {
        this.interactionData.BMIData[this.currentInput] = { ...data ,unit: ""};
      } else if (this.currentIndex == 1) {
        if (!this.interactionData.grades.multiGrades) {
          if (this.currentInput.name) {
            this.$set(
              this.interactionData.grades[this.currentInput.name],
              this.currentInput.index,
              { ...data }
            );
          } else {
            this.$set(this.interactionData.grades, this.currentInput, {
              ...data
            });
          }
        }
        // console.log(this.interactionData.grades);
      } else if (this.currentIndex == 2) {
        /* if (this.currentInput === "AllQuantity") {
          this.$set(this.interactionData.quantity, this.currentInput, [
            { ...data }
          ]);
        } */
        let quantity = this.interactionData.quantity.quantity;

        if (this.currentInput.name === "inParent") {
          this.$set(quantity.inQuantity, "parent", data);
        } else if (this.currentInput.name === "outParent") {
          this.$set(quantity.outQuantity, "parent", data);
        } else if (this.currentInput.name === "inAllEle") {
          this.$set(quantity.inQuantity, "allEle", data);
        } else if (this.currentInput.name === "outAllEle") {
          this.$set(quantity.outQuantity, "allEle", data);
        } else if (this.currentInput.name === "inQuantity") {
          this.$set(
            quantity.inQuantity.eleList[this.currentInput.index],
            this.currentInput.k,
            data
          );
        } else if (this.currentInput.name === "outQuantity") {
          this.$set(
            quantity.outQuantity.eleList[this.currentInput.index],
            this.currentInput.k,
            data
          );
        } else if (this.currentInput.name === "summaryEle") {
          this.$set(this.interactionData.quantity.summary, "summaryEle", data);
        } else if (this.currentInput.name === "inQuantityEle") {
          this.$set(
            this.interactionData.quantity.summary,
            "inQuantityEle",
            data
          );
        } else if (this.currentInput.name === "outQuantityEle") {
          this.$set(
            this.interactionData.quantity.summary,
            "outQuantityEle",
            data
          );
        }
      } else if (this.currentIndex == 4) {
        if (!this.currentInput.define) {
          this.$set(
            this.interactionData.linkData.linkList[this.currentInput.index][
              this.currentInput.name
            ],
            this.currentInput.k,
            { ...data }
          );
        } else {
          this.$set(this.interactionData.linkData, this.currentInput.name, {
            ...data
          });
        }
      } else if (this.currentIndex == 5) {
        if (!this.currentInput.define) {
          this.$set(
            this.interactionData.linkEnaData.linkList[this.currentInput.index][
              this.currentInput.name
            ],
            this.currentInput.k,
            { ...data }
          );
        } else {
          this.$set(this.interactionData.linkEnaData, this.currentInput.name, {
            ...data
          });
        }
      } else if (this.currentIndex == 6) {
        if (!this.currentInput.define) {
          this.$set(
            this.interactionData.linkVisData.linkList[this.currentInput.index][
              this.currentInput.name
            ],
            this.currentInput.k,
            { ...data }
          );
        } else {
          this.$set(this.interactionData.linkVisData, this.currentInput.name, {
            ...data
          });
        }
      } else if (this.currentIndex == 7) {
        let list = this.interactionData.quoteData[this.currentInput.name];
        this.$set(list, this.currentInput.index, {
          ...list[this.currentInput.index],
          ...data
        });
      }
    },
    //多选右侧树节点
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data);
      let currentInputList = this.$refs.tree.getCheckedNodes(true, false);
      if (currentInputList.length) {
        if (this.currentIndex == 1) {
          if (this.currentInput.name) {
            this.$set(
              this.interactionData.grades[this.currentInput.name],
              this.currentInput.index,
              [...currentInputList]
            );
          } else {
            this.$set(
              this.interactionData.grades,
              this.currentInput,
              currentInputList[0]
            );
          }
        } else if (this.currentIndex == 2) {
          /* if (
            this.currentInput === "AllQuantity" &&
            currentInputList.length > 1
          ) {
            this.$message.error("统计元素只可选择一个元素,请重新选择！");
            let arr = [];
            this.interactionData.quantity[this.currentInput].forEach(
              (item, index) => {
                if (item.eleId) {
                  arr.push(item.eleId);
                }
              }
            );
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys(arr);
            });
            return;
          } */
          this.$set(
            this.interactionData.quantity,
            this.currentInput,
            currentInputList
          );
        }
      }
    },
    //新增计分元素
    addGradesList() {
      let data = this.interactionData.grades.gradesList;
      if (this.interactionData.grades.multiGrades) {
        this.$set(data, data.length, [
          { elementName: "计分元素" + (data.length + 1) }
        ]);
      } else {
        this.$set(data, data.length, {
          elementName: "计分元素" + (data.length + 1)
        });
      }
    },
    //删除计分元素
    deleteGradesList(index) {
      let data = this.interactionData.grades.gradesList;
      this.$delete(data, index);
    },
    //多选计分元素
    multiGradesChange(value) {
      this.interactionData.grades.gradesList = [];
      if (value) {
        this.showCheckbox = true;
      } else {
        this.showCheckbox = false;
      }
    },
    //判断符change事件
    judgeConditionChange(value, name, index) {
      let code = {
        "()": "(,)",
        "(]": "(,]",
        "[)": "[,)",
        "[]": "[,]"
      };
      this.interactionData[name].linkList[index].judgeValue = code[value] || "";
    },
    //新增联动元素条件
    addLink() {
      let data = this.interactionData.linkData.linkList;
      this.$set(data, data.length, {
        judgeEle: "元素",
        judgeCondition: "",
        judgeConditions: [
          "==",
          "!=",
          ">",
          ">=",
          "<",
          "<=",
          "()",
          "(]",
          "[)",
          "[]",
          "包含",
          "不包含",
          "包含于"
        ],
        judgeValue: "",
        EveTarget: []
      });
    },
    //删除联动元素条件
    deleteLink(index) {
      let data = this.interactionData.linkData.linkList;
      this.$delete(data, index);
    },
    addLinkEle(index) {
      let data = this.interactionData.linkData.linkList[index].EveTarget;
      this.$set(data, data.length, {
        elementName: "联动元素" + (data.length + 1),
        elementBaseName: "标签元素"
      });
    },
    deleteLinkEle(index, k) {
      let data = this.interactionData.linkData.linkList[index].EveTarget;
      this.$delete(data, k);
    },
    //新增联动元素可用条件
    addLinkEna() {
      let data = this.interactionData.linkEnaData.linkList;
      this.$set(data, data.length, {
        judgeEle: "元素",
        judgeCondition: "",
        judgeConditions: [
          "==",
          "!=",
          ">",
          ">=",
          "<",
          "<=",
          "()",
          "(]",
          "[)",
          "[]",
          "包含",
          "不包含",
          "包含于"
        ],
        judgeValue: "",
        EveTarget: []
      });
    },
    //删除联动元素可用条件
    deleteLinkEna(index) {
      let data = this.interactionData.linkEnaData.linkList;
      this.$delete(data, index);
    },
    addLinkEnaEle(index) {
      let data = this.interactionData.linkEnaData.linkList[index].EveTarget;
      this.$set(data, data.length, {
        elementName: "联动元素" + (data.length + 1),
        elementBaseName: "标签元素"
      });
    },
    deleteLinkEnaEle(index, k) {
      let data = this.interactionData.linkEnaData.linkList[index].EveTarget;
      this.$delete(data, k);
    },
    //新增联动元素可见条件
    addLinkVis() {
      let data = this.interactionData.linkVisData.linkList;
      this.$set(data, data.length, {
        judgeEle: "元素",
        judgeCondition: "",
        judgeConditions: [
          "==",
          "!=",
          ">",
          ">=",
          "<",
          "<=",
          "()",
          "(]",
          "[)",
          "[]",
          "包含",
          "不包含",
          "包含于"
        ],
        judgeValue: "",
        EveTarget: []
      });
    },
    //删除联动元素可见条件
    deleteLinkVis(index) {
      let data = this.interactionData.linkVisData.linkList;
      this.$delete(data, index);
    },
    addLinkVisEle(index) {
      let data = this.interactionData.linkVisData.linkList[index].EveTarget;
      this.$set(data, data.length, {
        elementName: "联动元素" + (data.length + 1),
        elementBaseName: "标签元素"
      });
    },
    deleteLinkVisEle(index, k) {
      let data = this.interactionData.linkVisData.linkList[index].EveTarget;
      this.$delete(data, k);
    },
    /*数据引用--基本信息*/
    //获取患者基本信息
    async getPatientInfo() {
      this.$showLoading();
      try {
        // let params = {
        //   inpCode: 'INP191113001'
        // };
        let data = await getBaseInfo();
        if (data.code == "1") {
          this.baseInfoTableData = [...JSON.parse(data.data)];
        } else {
          this.$message.error(data.msg || "获取基本信息失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取基本信息失败");
      }
    },
    baseInfoClick(row, column) {
      if (
        this.currentIndex == 7 &&
        this.activeName == "baseInfo" &&
        this.currentInput.name == "baseInfo"
      ) {
        let list = this.interactionData.quoteData.baseInfo;
        this.$set(list, this.currentInput.index, {
          ...list[this.currentInput.index],
          ...row
        });
      }
    },
    //添加基本信息
    addBaseInfo() {
      let list = this.interactionData.quoteData.baseInfo;
      this.$set(list, list.length, {
        eleId: "",
        elementName: "本文元素",
        baseInfo: "基础信息",
        value: ""
      });
    },
    //删除基本信息
    deleteBaseInfo(index) {
      if (this.currentInput.index == index) {
        this.currentInput = {};
      }
      let list = this.interactionData.quoteData.baseInfo;
      this.$delete(list, index);
    },
    //获取文书信息
    async getdocInfoData() {
      this.$showLoading();
      try {
        let params = {
          pageSize: 1000000,
          pageNo: 1
        };
        let data = await getDocInfo(params);
        if (data.code == "1") {
          this.docInfoData = [...data.data];
          this.currentDocCode = this.docInfoData[0].docCode;
          this.currentDoc = this.docInfoData[0];
          await this.getDocEle();
          if (this.currentInput.name == "docEle") {
            let list = this.interactionData.quoteData[this.currentInput.name];
            this.$set(list, this.currentInput.index, {
              ...list[this.currentInput.index],
              ...this.currentDoc
            });
          }
        } else {
          this.$message.error(data.msg || "获取文书信息数据失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取文书信息数据失败");
      }
    },
    // eslint-disable-next-line complexity
    async currentDocInfoChange(value) {
      const _this = this;
      _this.currentDoc = {};
      _this.currentDocCode = value;
      this.quoteDocTreeData = [];
      await this.docInfoData.forEach((item, index) => {
        if (value == item.docCode) {
          _this.currentDoc = item;
        }
      });
      if (this.currentInput.name == "docEle") {
        let list = this.interactionData.quoteData[this.currentInput.name];
        await this.$set(list, this.currentInput.index, {
          ...list[this.currentInput.index],
          ...this.currentDoc,
          docEleName: "引用元素",
          docEleId: "",
          classCode: _this.currentDoc.classCode || "",
          docCode: _this.currentDoc.docCode || "",
          docName: _this.currentDoc.docName || "文书名称",
          docNote: _this.currentDoc.docNote || "",
          docType: _this.currentDoc.docType || "",
          docUser: _this.currentDoc.docUser || "",
          hosId: _this.currentDoc.hosId || "",
          id: _this.currentDoc.id || ""
        });
      }
      if (_this.currentDocCode) {
        await this.getDocEle();
      }
    },
    async getDocEle() {
      this.$showLoading();
      try {
        let params = {
          docCode: this.currentDocCode,
          docState: "1"
        };
        let data = await getDocVersionInfo(params);
        if (data.code == "1") {
          if (data.data.length) {
            this.quoteDocTreeData = JSON.parse(data.data[0].docContent).eleList;
          } else {
            this.$message.info("文书结构为空");
          }
        } else {
          this.$message.error(data.msg || "获取文书结构失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取文书结构失败");
      }
    },
    quoteDocTreeFilterNode(value, data) {
      if (!value) {
        return true;
      }
      return data.elementName.indexOf(value) !== -1;
    },
    quoteDocTreeNodeClick(data, node) {
      // console.log(data);
      if (this.currentInput.name == "docEle") {
        let list = this.interactionData.quoteData[this.currentInput.name];
        this.$set(list, this.currentInput.index, {
          ...list[this.currentInput.index],
          docEleName: data.elementName,
          docEleId: data.eleId
        });
      }
    },
    //添加文书元素值引用
    addDocEle() {
      let list = this.interactionData.quoteData.docEle;
      this.$set(list, list.length, {
        elementName: "本文元素",
        eleId: "",
        docName: "文书名称",
        docCode: "",
        docEleName: "引用元素",
        docEleValue: ""
      });
    },
    //删除文书元素值引用
    deleteDocEle(index) {
      if (this.currentInput.index == index) {
        this.currentInput = {};
      }
      let list = this.interactionData.quoteData.docEle;
      this.$delete(list, index);
    },
    //获取体温单项目
    async getTempProTableData() {
      try {
        this.$showLoading();
        let params = {
          ...this.searchParmas
        };
        let response = await getItemListData(params);
        let tableData = response.data;
        this.handleCollapseData(tableData);
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg);
      }
    },
    handleCollapseData(tableData) {
      let signList = [];
      let otherList = [];
      let customList = [];
      tableData.forEach(item => {
        if (item.itemType == "0") {
          signList.push(item);
        } else if (item.itemType == "1") {
          otherList.push(item);
        } else {
          customList.push(item);
        }
      });
      this.collapseTempPro[0].data = signList;
      this.collapseTempPro[1].data = otherList;
      this.collapseTempPro[2].data = customList;
    },
    tempProClick(row, column) {
      if (
        this.currentIndex == 7 &&
        this.activeName == "tempPro" &&
        this.currentInput.name == "tempPro"
      ) {
        let list = this.interactionData.quoteData.tempPro;
        this.$set(list, this.currentInput.index, {
          ...list[this.currentInput.index],
          itemName: row.itemName,
          itemCode: row.itemCode
        });
      } else if (this.currentIndex == 2) {
        if (
          this.currentInput.name === "inQuantityEle" ||
          this.currentInput.name === "outQuantityEle"
        ) {
          this.$set(
            this.interactionData.quantity.summary,
            this.currentInput.name,
            {
              ...row,
              itemName: row.itemName,
              itemCode: row.itemCode
            }
          );
        }
      }
    },
    //添加体温单项目
    addTempPro() {
      let list = this.interactionData.quoteData.tempPro;
      this.$set(list, list.length, {
        eleId: "",
        elementName: "本文元素",
        itemName: "体温单项目",
        tempProValue: ""
      });
    },
    //删除体温单项目
    deleteTempPro(index) {
      if (this.currentInput.index == index) {
        this.currentInput = {};
      } else {
        let list = this.interactionData.quoteData.tempPro;
        this.$delete(list, index);
      }
    },
    //获取表
    async getDbTables() {
      this.$showLoading();
      try {
        let params = {
          schema: ""
        };
        let data = await getDbTables(params);
        if (data.code == "1") {
          this.dbTableData = [...data.data];
          this.currentTableName = this.dbTableData[0]["TABLE_NAME"];
          await this.getTableColumn();
          if (this.currentInput.name == "tableData") {
            let list = this.interactionData.quoteData[this.currentInput.name];
            this.$set(list, this.currentInput.index, {
              ...list[this.currentInput.index],
              tableName: this.dbTableData[0]["TABLE_NAME"]
            });
          }
        } else {
          this.$message.error(data.msg || "获取表失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取表失败");
      }
    },
    async currentTableChange(value) {
      if (this.currentInput.name == "tableData") {
        this.currentTableName = value;
        this.tableColumnData = [];
        let list = this.interactionData.quoteData[this.currentInput.name];
        await this.$set(list, this.currentInput.index, {
          ...list[this.currentInput.index],
          tableName: this.currentTableName || "表名称",
          tableColumnName: "字段名称"
        });
      }
      if (this.currentTableName) {
        this.getTableColumn();
      }
    },
    //获取表字段
    async getTableColumn() {
      this.$showLoading();
      try {
        let params = {
          schema: "",
          tableName: this.currentTableName
        };
        let data = await getTableColumn(params);
        if (data.code == "1") {
          this.tableColumnData = [...data.data];
        } else {
          this.$message.error(data.msg || "获取表字段失败");
        }
        this.$hideLoading();
      } catch (error) {
        this.$hideLoading();
        this.$message.error(error.msg || "获取表字段失败");
      }
    },
    addTable() {
      let list = this.interactionData.quoteData.tableData;
      this.$set(list, list.length, {
        elementName: "本文元素",
        eleId: "",
        tableName: "表名称",
        tableColumnName: "字段名称"
      });
    },
    deleteTable(index) {
      if (this.currentInput.index == index) {
        this.currentInput = {};
      }
      let list = this.interactionData.quoteData.tableData;
      this.$delete(list, index);
    },
    tableColumnClick(row) {
      if (
        this.currentIndex == 7 &&
        this.activeName == "tableData" &&
        this.currentInput.name == "tableData"
      ) {
        let list = this.interactionData.quoteData.tableData;
        this.$set(list, this.currentInput.index, {
          ...list[this.currentInput.index],
          tableColumnName: row["COLUMN_NAME"]
        });
      }
    },
    cancel() {
      this.dialogVisible = false;
      this.reset();
    },
    //保存交互
    // eslint-disable-next-line complexity
    confirm() {
      let eleEventList = this.nursingTreeDataSave[0].eleEventList
        ? this.nursingTreeDataSave[0].eleEventList
        : [];
      // let eleEventList = [];
      let obj = {};
      if (this.currentIndex == 0) {
        //BMI
        if (!this.interactionData.BMIData.BMI.eleId) {
          this.$message.error("请选择BMI元素");
          return;
        }
        if (!this.interactionData.BMIData.weight.eleId) {
          this.$message.error("请选择体重元素");
          return;
        }
        if (!this.interactionData.BMIData.height.eleId) {
          this.$message.error("请选择身高元素");
          return;
        }
        if (!this.interactionData.BMIData.weight.unit) {
          this.$message.error("请选择体重元素单位");
          return;
        }
        if (!this.interactionData.BMIData.height.unit) {
          this.$message.error("请选择身高元素单位");
          return;
        }
        obj = {
          EveName: "计算BMI",
          EveCode: "CDEE_BMI",
          EveVal:
            this.interactionData.BMIData.BMI.eleId +
            "=" +
            this.interactionData.BMIData.weight.eleId +
            "/(" +
            this.interactionData.BMIData.height.eleId +
            "^2)",
          EveValShow:
            this.interactionData.BMIData.BMI.elementName +
            "=" +
            this.interactionData.BMIData.weight.elementName +
            "/(" +
            this.interactionData.BMIData.height.elementName +
            "^2)",
          EveTarget: this.interactionData.BMIData.BMI.eleId,
          EveTargetObj: this.interactionData.BMIData.BMI,
          EveList: [
            this.interactionData.BMIData.weight.eleId,
            this.interactionData.BMIData.height.eleId
          ],
          EveListObj: [
            this.interactionData.BMIData.weight,
            this.interactionData.BMIData.height
          ],
          EveDescribe: "根据身高体重元素录入值自动计算体质BMI值"
        };
      } else if (this.currentIndex == 1) {
        //计算分值
        if (!this.interactionData.grades.totalScore.eleId) {
          this.$message.error("请选择总分元素");
          return;
        }
        obj = {
          EveName: "计算分值",
          EveCode: "CDEE_SCORE",
          EveTarget: this.interactionData.grades.totalScore.eleId,
          EveTargetObj: this.interactionData.grades.totalScore,
          EveMulti: this.interactionData.grades.multiGrades,
          EveIsZero: this.interactionData.grades.isZero,
          EveDescribe: "计算所选分值元素的总分"
        };
        obj.EveVal = this.interactionData.grades.totalScore.eleId + "=";
        obj.EveValShow =
          this.interactionData.grades.totalScore.elementName + "=";
        obj.EveList = [];
        obj.EveListObj = [];
        let list = this.interactionData.grades.gradesList;
        if (!list.length) {
          this.$message.error("计分元素不能为空");
          return;
        }
        if (!this.interactionData.grades.multiGrades) {
          for (let i in list) {
            if (!list[i].eleId) {
              this.$message.error(
                "请选择计分元素【" + list[i].elementName + "】"
              );
              return;
            }
            obj.EveList.push(list[i].eleId);
            obj.EveListObj.push(list[i]);
            if (i == 0) {
              obj.EveVal += list[i].eleId;
              obj.EveValShow += list[i].elementName;
            } else {
              obj.EveVal += "+" + list[i].eleId;
              obj.EveValShow += "+" + list[i].elementName;
            }
          }
        } else {
          obj.EveListInit = [];
          for (let i in list) {
            let item = list[i];
            let EveListItem = [];
            obj.EveListObj.push(item);
            for (let j in item) {
              if (!item[j].eleId) {
                this.$message.error(
                  "请选择计分元素【" + item[j].elementName + "】"
                );
                return;
              }
              obj.EveList.push(item[j].eleId);
              EveListItem.push(item[j].eleId);
              if (j == item.length - 1) {
                obj.EveValShow += item[j].elementName;
                obj.EveVal += item[j].eleId;
              } else {
                obj.EveValShow += item[j].elementName + "/";
                obj.EveVal += item[j].eleId + "/";
              }
            }
            if (i != list.length - 1) {
              obj.EveValShow += "+";
              obj.EveVal += "+";
            }
            obj.EveListInit.push(EveListItem);
          }
        }
      } else if (this.currentIndex == 2) {
        //统计出入量
        /* if (!this.interactionData.quantity.AllQuantity[0].eleId) {
          this.$message.error("请选择统计元素");
          return;
        }
        obj = {
          EveName: "统计出入量",
          EveCode: "CDEE_Quantity",
          EveTarget: this.interactionData.quantity.AllQuantity[0].eleId,
          EveTargetObj: this.interactionData.quantity.AllQuantity[0],
          EveDescribe: "统计出入量",
          EveValShow: "统计出入量"
        };
        let list = this.interactionData.quantity;
        obj.EveListInit = [[], []];
        obj.EveListObj = [list["inQuantity"], list["outQuantity"]];
        obj.EveList = [];
        let item = list["inQuantity"];
        for (let j in item) {
          if (item[j].eleId) {
            obj.EveListInit[0].push(item[j].eleId);
            obj.EveList.push(item[j].eleId);
          } else {
            this.$message.error("请选择入量元素");
            return;
          }
        }
        let item1 = list["outQuantity"];
        for (let j in item1) {
          if (item1[j].eleId) {
            obj.EveListInit[1].push(item1[j].eleId);
            obj.EveList.push(item1[j].eleId);
          } else {
            this.$message.error("请选择出量元素");
            return;
          }
        } */
        obj = {
          EveName: "统计出入量",
          EveCode: "CDEE_Quantity",
          EveTarget: {
            inQuantity: this.interactionData.quantity.quantity.inQuantity.allEle
              .eleId,
            outQuantity: this.interactionData.quantity.quantity.outQuantity
              .allEle.eleId
          },
          EveTargetObj: {
            inQuantity: this.interactionData.quantity.quantity.inQuantity
              .allEle,
            outQuantity: this.interactionData.quantity.quantity.outQuantity
              .allEle
          },
          EveDescribe: "统计出入量",
          EveValShow: "统计出入量",
          allObj: this.interactionData.quantity
        };
        let EveList = [];
        let EveListObj = [[], []];
        let EveListInit = [[], []];
        let quantity = this.interactionData.quantity.quantity;
        for (let i in quantity.inQuantity.eleList) {
          let item = quantity.inQuantity.eleList[i];
          if (EveListInit[0].indexOf(item.nameList.eleId) < 0) {
            EveList.push(quantity.inQuantity.eleList[i].nameList.eleId);
            EveListObj[0].push(quantity.inQuantity.eleList[i].nameList);
            EveListInit[0].push(quantity.inQuantity.eleList[i].nameList.eleId);
          }
          if (EveListInit[0].indexOf(item.valueList.eleId) < 0) {
            EveList.push(quantity.inQuantity.eleList[i].valueList.eleId);
            EveListObj[0].push(quantity.inQuantity.eleList[i].valueList);
            EveListInit[0].push(quantity.inQuantity.eleList[i].valueList.eleId);
          }
        }
        for (let i in quantity.outQuantity.eleList) {
          let item = quantity.outQuantity.eleList[i];
          if (EveListInit[1].indexOf(item.nameList.eleId) < 0) {
            EveList.push(quantity.outQuantity.eleList[i].nameList.eleId);
            EveListObj[1].push(quantity.outQuantity.eleList[i].nameList);
            EveListInit[1].push(quantity.outQuantity.eleList[i].nameList.eleId);
          }
          if (EveListInit[1].indexOf(item.valueList.eleId) < 0) {
            EveList.push(quantity.outQuantity.eleList[i].valueList.eleId);
            EveListObj[1].push(quantity.outQuantity.eleList[i].valueList);
            EveListInit[1].push(
              quantity.outQuantity.eleList[i].valueList.eleId
            );
          }
        }
        obj.EveList = EveList;
        obj.EveListObj = EveListObj;
        obj.EveListInit = EveListInit;
      } else if (this.currentIndex == 4) {
        //联动元素
        let data = this.interactionData.linkData.linkList;
        if (!data.length) {
          this.$message.error("请添加条件");
          return;
        }
        if (!this.interactionData.linkData.judgeEle.eleId) {
          this.$message.error("请选择判断元素");
          return;
        }
        obj = {
          EveName: "设置元素值",
          EveCode: "CDEE_SetVal",
          EveDescribe: "根据某一元素值设置指定元素值",
          EveValShow: this.interactionData.linkData.judgeEle.elementName,
          EveList: [this.interactionData.linkData.judgeEle.eleId],
          EveListObj: [this.interactionData.linkData.judgeEle],
          EveContions: []
        };
        for (let i in data) {
          if (!data[i].judgeCondition) {
            this.$message.error("请选择判断符");
            return;
          }
          if (data[i].judgeValue === "" || data[i].judgeValue === undefined) {
            this.$message.error("请输入判断条件");
            return;
          }
          let item = data[i]["EveTarget"];
          if (!item.length) {
            this.$message.error("请选择联动元素");
            return;
          }
          for (let j in item) {
            if (!item[j].eleId) {
              this.$message.error("请选择" + item[j].elementName || "联动元素");
              return;
            }
          }
          obj.EveContions.push(data[i]);
        }
      } else if (this.currentIndex == 5) {
        //联动元素
        if (!this.interactionData.linkEnaData.judgeEle.eleId) {
          this.$message.error("请选择判断元素");
          return;
        }
        obj = {
          EveName: "设置元素可用性",
          EveCode: "CDEE_SetEna",
          EveDescribe: "根据某一元素值设置指定元素是否可用",
          EveValShow: this.interactionData.linkEnaData.judgeEle.elementName,
          EveList: [this.interactionData.linkEnaData.judgeEle.eleId],
          EveListObj: [this.interactionData.linkEnaData.judgeEle],
          EveContions: []
        };
        let data = this.interactionData.linkEnaData.linkList;
        for (let i in data) {
          if (!data[i].judgeCondition) {
            this.$message.error("请选择判断符");
            return;
          }
          if (data[i].judgeValue === "" || data[i].judgeValue === undefined) {
            this.$message.error("请输入判断条件");
            return;
          }
          let item = data[i]["EveTarget"];
          if (!item.length) {
            this.$message.error("请选择联动元素");
            return;
          }
          for (let j in item) {
            if (!item[j].eleId) {
              this.$message.error("请选择" + item[j].elementName || "联动元素");
              return;
            }
          }
          obj.EveContions.push(data[i]);
        }
      } else if (this.currentIndex == 6) {
        //联动元素
        if (!this.interactionData.linkVisData.judgeEle.eleId) {
          this.$message.error("请选择判断元素");
          return;
        }
        obj = {
          EveName: "设置元素可见性",
          EveCode: "CDEE_SetVis",
          EveDescribe: "根据某一元素值设置指定元素是否可见",
          EveValShow: this.interactionData.linkVisData.judgeEle.elementName,
          EveList: [this.interactionData.linkVisData.judgeEle.eleId],
          EveListObj: [this.interactionData.linkVisData.judgeEle],
          EveContions: []
        };
        let data = this.interactionData.linkVisData.linkList;
        for (let i in data) {
          if (!data[i].judgeCondition) {
            this.$message.error("请选择判断符");
            return;
          }
          if (data[i].judgeValue === "" || data[i].judgeValue === undefined) {
            this.$message.error("请输入判断条件");
            return;
          }
          let item = data[i]["EveTarget"];
          if (!item.length) {
            this.$message.error("请选择联动元素");
            return;
          }
          for (let j in item) {
            if (!item[j].eleId) {
              this.$message.error("请选择" + item[j].elementName || "联动元素");
              return;
            }
          }
          obj.EveContions.push(data[i]);
        }
      } else if (this.currentIndex == 7) {
        obj = {
          EveName: "数据引用",
          EveCode: "CDEE_QUOTE",
          EveDescribe: "数据引用",
          QuoteList: {}
        };
        let quoteData = this.interactionData.quoteData;
        // 基础信息
        for (let i in quoteData.baseInfo) {
          let item = quoteData.baseInfo[i];
          if (!item["eleId"]) {
            this.$message.error("【基础信息引用】请选择本文元素");
            return;
          }
          if (!item["value"]) {
            this.$message.error("【基础信息引用】请选择基础信息");
            return;
          }
        }
        // 文书元素值引用
        for (let i in quoteData.docEle) {
          let item = quoteData.docEle[i];
          if (!item["eleId"]) {
            this.$message.error("【文书元素值引用】请选择本文元素");
            return;
          }
          if (!item["docCode"]) {
            this.$message.error("【文书元素值引用】请选择文书");
            return;
          }
          if (!item["docEleId"]) {
            this.$message.error("【文书元素值引用】请选择引用元素");
            return;
          }
        }
        // 体温单项目值引用
        for (let i in quoteData.tempPro) {
          let item = quoteData.tempPro[i];
          if (!item["eleId"]) {
            this.$message.error("【体温单项目值引用】请选择本文元素");
            return;
          }
          if (!item["itemCode"]) {
            this.$message.error("【体温单项目值引用】请选择体温单项目");
            return;
          }
        }
        // 表字段值引用
        for (let i in quoteData.tableData) {
          let item = quoteData.tableData[i];
          if (!item["eleId"]) {
            this.$message.error("【表字段值引用】请选择本文元素");
            return;
          }
          if (!item["tableName"] || item["tableName"] === "表名称") {
            this.$message.error("【表字段值引用】请选择表");
            return;
          }
          if (
            !item["tableColumnName"] ||
            item["tableColumnName"] === "字段名称"
          ) {
            this.$message.error("【表字段值引用】请选择表字段名称");
            return;
          }
        }
        for (let i in quoteData) {
          obj.QuoteList[i] = quoteData[i];
        }
        if (this.isAdd == "1") {
          //编辑
          let flag = 0;
          let index = 0;
          for (let ii in eleEventList) {
            if (eleEventList[ii].EveCode == "CDEE_QUOTE") {
              flag++;
              index = ii;
            }
          }
          if (flag <= 0) {
            eleEventList.push(obj);
          } else {
            let quoteList = eleEventList[index]["QuoteList"];
            for (let i in quoteList) {
              for (let j in quoteData) {
                if (i == j) {
                  this.$set(quoteList, i, [...quoteList[i], ...quoteData[j]]);
                }
              }
            }
          }
        } else if (this.isAdd == "0") {
          //新增
          eleEventList[this.editIndex] = obj;
        }
      }
      // console.log(obj);
      if (this.currentIndex !== 7) {
        if (this.isAdd == "1") {
          eleEventList.push(obj);
        } else if (this.isAdd == "0") {
          eleEventList[this.editIndex] = obj;
        }
      }
      // eleEventList = [obj]
      this.nursingTreeDataSave[0].eleEventList = eleEventList;
      this.nursingTreeDataSave[0].isModify = true;
      this.changeNursingTreeData(this.nursingTreeDataSave);
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped lang="scss">
.docToolInteraction {
  .eve-list {
    margin-top: 20px;

    .col-item {
      cursor: pointer;

      .col-item-name {
        width: 110px;
      }

      .col-item-icon1,
      .col-item-icon2 {
        font-size: $l-font-size;
      }

      .col-item-icon2 {
        margin-right: 5px;
      }
    }
  }

  /deep/ .el-dialog__footer {
    padding: 20px;
  }
}

.dialog-cont {
  padding: 20px 30px 20px 30px;
  border-bottom: 1px solid $l-color-bgcolor-11;

  .left-list {
    width: 240px;
    margin-right: 10px;
    border-radius: 2px;
    border: 1px solid $l-color-bgcolor-11;
    border-bottom: none;

    .item {
      padding-left: 10px;
      border-bottom: 1px solid $l-color-bgcolor-11;
      font-size: $l-font-size;
      font-family: $l-font-familySC-regular;
      font-weight: 400;
      color: $l-color-fontcolor-3;
      line-height: 42px;
      cursor: pointer;
    }

    .strip {
      background-color: $l-color-bgcolor-18;
    }

    .isClick {
      background-color: $l-color-bgcolor-12;
    }
  }

  .center {
    width: 439px;
    height: 580px;
    margin-right: 10px;
    border-radius: 2px;
    padding: 20px;
    border: 1px solid $l-color-bgcolor-11;
    overflow-y: auto;

    .activity-focus {
      background-color: $l-color-bgcolor-18;
      color: $l-color-fontcolor-3;
    }

    .left-conts-cont {
      width: calc(100% - 20px);
      line-height: 36px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      cursor: pointer;
    }

    .left-conts-icon {
      width: 15px;
      line-height: 36px;
      cursor: pointer;
    }

    .BMI {
      .gongshi {
        height: 44px;
        margin-bottom: 38px;
        background: $l-color-bgcolor-18;
        border-radius: 2px;
        line-height: 44px;
        text-align: center;
        font-size: $l-font-size;
        font-family: $l-font-familySC-regular;
        font-weight: 400;
        color: $l-color-fontcolor-3;
      }

      .content {
        .text,
        .input {
          margin-bottom: 20px;
          font-size: $l-font-size;
          font-family: $l-font-familySC-regular;
          font-weight: 400;
          color: $l-color-fontcolor-4;
        }

        .input {
          position: relative;

          .left-conts {
            width: 226px;
            height: 36px;
            border: 1px solid $l-color-bgcolor-11;
            padding: 0 10px;
            .left-conts-cont {
              line-height: 36px;
              cursor: pointer;
            }
            .left-conts-icon {
              line-height: 36px;
              cursor: pointer;
            }
          }

          .right-conts {
            height: 36px;
            margin-left: 10px;
            font-size: $l-font-size;
            font-family: $l-font-familySC-regular;
            font-weight: 400;
            color: $l-color-fontcolor-4;
            line-height: 36px;
          }

          .circle {
            font-size: $l-font-size;
            font-family: $l-font-familySC-regular;
            font-weight: 400;
            color: $l-color-fontcolor-4;
            position: absolute;
            left: 228px;
          }
        }
      }
    }

    .grades {
      .grades-content {
        height: calc(100% - 56px);
        overflow-y: auto;
        margin-bottom: 20px;

        .text {
          margin-bottom: 20px;
          font-size: $l-font-size-max;
          font-family: $l-font-familySC-bold;
          font-weight: $l-font-weight;
          color: $l-color-fontcolor-3;
        }

        .texts {
          margin-bottom: 5px;
          font-size: $l-font-size;
          font-family: $l-font-familySC-regular;
          font-weight: 400;
          color: $l-color-fontcolor-3;

          .lefts {
            width: 10px;
            height: 35.4px;
            margin-right: 6px;
            line-height: 35.4px;
            text-align: center;
          }
          .centers {
            width: calc(100% - 46px);
            line-height: 35.4px;
            cursor: pointer;
            font-size: $l-font-size;
            font-family: $l-font-familySC-regular;
            font-weight: 400;
            color: $l-color-fontcolor-4;
            height: auto;
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
          }

          .rights {
            width: 20px;
            height: 35.4px;
            margin-left: 10px;
            color: $l-color-fontcolor-4;
            line-height: 35.4px;
            text-align: center;
            cursor: pointer;

            .rights-detail {
              width: 20px;
              height: 13px;
              margin-top: 11.2px;
              cursor: pointer;
              font-size: $l-font-size-min;
              background: $l-color-bgcolor-18;
            }
          }
        }
      }
    }

    .quantity {
      .title,
      .equal {
        margin-bottom: 20px;
        font-size: $l-font-size-max;
        font-family: $l-font-familySC-bold;
        font-weight: $l-font-weight;
        color: $l-color-fontcolor-3;
      }

      .content {
        margin-bottom: 40px;
        cursor: pointer;
        font-size: $l-font-size;
        font-family: $l-font-familySC-regular;
        font-weight: 400;
        color: $l-color-fontcolor-4;
        height: auto;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
      }
      font-size: $l-font-size;
      font-family: $l-font-familySC-regular;
      font-weight: 400;
      color: $l-color-fontcolor-4;
      .styles {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 10px;
      }
      .parentEle {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .parentEle-item {
          width: 48%;
          height: 40px;
          line-height: 40px;
          border: 1px solid $l-color-bgcolor-11;
          padding: 0 5px;
          margin-top: 10px;
          cursor: pointer;
        }
      }
      .allEle {
        .allEle-item {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-top: 8px;
        }
        .value-cont,
        .name-cont {
          padding: 0 5px;
          width: calc(50% - 58px);
          margin-right: 6px;
          border: 1px solid $l-color-bgcolor-11;
          line-height: 40px;
          cursor: pointer;
        }
        .type-radio {
          width: 60px;
          /deep/.el-radio {
            margin: 5px 16px 5px 5px;
          }
        }
        .operate-cont {
          width: 40px;
          padding-left: 5px;
          line-height: 40px;
        }
      }

      .summarys {
        margin-top: 10px;
        /deep/.el-radio {
          margin-bottom: 8px;
        }
        .summarys-top {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 10px;
          .summarys-top-left {
            width: 38%;
          }
          .summarys-top-right {
            width: 58%;
          }
          .summarys-top-left,
          .summarys-top-right {
            .summary-ele {
              cursor: pointer;
              height: 40px;
              line-height: 40px;
              margin-bottom: 16px;
              padding: 0 8px;
              border: 1px solid $l-color-bgcolor-11;
            }
          }
        }
        .summarys-center {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .quantitys {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-top: 10px;
          .quantity-item {
            width: 48%;
            height: 40px;
            line-height: 40px;
            padding: 0 5px;
            border: 1px solid $l-color-bgcolor-11;
            line-height: 40px;
            cursor: pointer;
          }
        }
      }
    }

    .links {
      .link-content {
        height: calc(100% - 56px);
        margin-bottom: 20px;
        overflow-y: auto;

        .link {
          border: 1px solid $l-color-bgcolor-11;
          border-bottom: none;

          .link-top {
            height: 50px;
            padding: 7px 10px;
            border-bottom: 1px solid $l-color-bgcolor-11;

            .link-top-left {
              width: 45px;
              height: 100%;
              margin-right: 3px;
              padding: 0 3px;
              text-align: center;
              line-height: 36px;
              font-size: $l-font-size;
              font-family: $l-font-familySC-bold;
              font-weight: $l-font-weight;
              color: $l-color-fontcolor-3;
              cursor: pointer;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            .link-top-center1 {
              width: 150px;
              margin-right: 15px;
            }

            .link-top-center2 {
              width: 120px;
            }

            .link-top-right {
              height: 100%;
              line-height: 36px;
              font-size: $l-font-size-min;
            }
          }

          .link-eleList {
            padding: 7px 10px;
            border-bottom: 1px solid $l-color-bgcolor-11;
            cursor: pointer;

            .link-eleList-item {
              width: 300px;
              overflow: hidden;
              .link-eleList-item-text {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
            }
            .delete-button {
              font-size: $l-font-size-min;
            }
          }
        }

        .add-button {
          margin-bottom: 10px;
          border: 1px solid $l-color-bgcolor-11;
          border-top: none;
        }
      }
    }

    .quote {
      overflow: auto;
      .quote-cont {
        margin-top: 10px;
      }

      .list-item {
        padding: 10px;
        border: 1px solid $l-color-bgcolor-11;
        border-bottom: none;

        .ele-name,
        .info-name {
          width: calc(50% - 10px);
          padding: 0 3px 0 3px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
        }

        .eleDoc-name,
        .doc-name,
        .docEle-name {
          width: calc(30% - 6.5px);
          padding: 0 3px 0 3px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
        }

        .delete-button {
          width: 20px;
          font-size: $l-font-size-min;
          cursor: pointer;
        }
      }

      .add-button {
        margin-bottom: 10px;
        border: 1px solid $l-color-bgcolor-11;
        cursor: pointer;
      }
    }
  }

  .right-list {
    width: 240px;
    height: 580px;
    border-radius: 2px;
    border: 1px solid $l-color-bgcolor-11;

    .name {
      height: 30px;
      background: $l-color-bgcolor-18;
      padding-left: 10px;
      border-bottom: 1px solid $l-color-bgcolor-11;
      font-size: $l-font-size;
      font-family: $l-font-familySC-regular;
      font-weight: 400;
      color: $l-color-fontcolor-3;
      line-height: 30px;
      cursor: pointer;
    }

    .input-cont {
      margin: 10px;
    }

    .tree-cont {
      height: 492px;
      overflow: auto;
    }
  }

  .last-list {
    width: 240px;
    height: 580px;
    border-radius: 2px;
    border: 1px solid $l-color-bgcolor-11;

    .list-item {
      padding: 20px;
      overflow: auto;

      .select-cont {
        height: 36px;
      }

      .input-cont {
        margin: 10px 0 10px 0;
      }

      .tree-cont {
        height: 456px;
        overflow: auto;
      }

      .table-cont {
        height: 489px;
        margin-top: 10px;
      }
    }

    .tempProList-item {
      padding: 0;
    }
  }

  .overEll {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
