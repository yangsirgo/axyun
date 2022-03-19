<template>
  <div class="className">
    <el-form id="printTest" class="table_form" ref="refForm" :model="formData">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">健康体检表</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" justify="space-between">
          <el-col :span="12">
            <div>姓名:谭晓风</div>
          </el-col>
          <el-col :span="12">
            <div class="fr">编号:52010270480100004</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" justify="space-between">
          <el-col :span="6">
            <div>联系电话:13984103975</div>
          </el-col>
          <el-col :span="18">
            <div class="fr">地址:贵州省贵阳市南明区花果园一期四网格11栋2单元3407</div>
          </el-col>
        </el-row>
      </header>
      <main class="table_main">
        <el-row class="lh24">
          <el-col :span="3">
            <div class="center">体检日期*</div>
          </el-col>
          <el-col :span="9">
            <div class>
              <el-form-item>
                <el-input
                  @change="DateConversion"
                  @focus="focus"
                  v-if="!readonly"
                  :readonly="readonly"
                  id="elinput"
                  ref="tabindex1"
                  v-model="temp"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">责任医生</div>
          </el-col>
          <el-col :span="9">
            <div class>
              <el-select
                class="w100"
                @focus="focus"
                v-if="!readonly"
                :readonly="readonly"
                id="elinput"
                ref="tabindex2"
                v-model="select"
                filterable
                :default-first-option="true"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center">内容</div>
          </el-col>
          <el-col :span="22">
            <div class="center">检 查 项 目</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center">症状</div>
          </el-col>
          <el-col :span="22">
            <div class="lh20 padding-10">
              <div>
                <el-checkbox-group :max="10" @change="checkListChange" v-model="checkList">
                  <el-checkbox
                    v-for="v in symptomOptions"
                    :label="v.label"
                    :key="v.value"
                  >{{v.value}}、{{v.label}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="flex fr">
                <PFormInput class="margin-2" v-for="(v,index) in symptomForm" :key="index">
                  <el-input
                    @focus="focus"
                    v-if="!readonly"
                    :readonly="readonly"
                    id="elinput"
                    @input="inputTest"
                    :ref="tabindexRef(index)"
                    v-model="v.value"
                  ></el-input>
                </PFormInput>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="lh339 center">一般状况</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div>体 温</div>
                </el-col>
                <el-col :span="7">
                  <div>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex14"
                        v-model="temp"
                      >
                        <template slot="append">℃</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div>脉 率</div>
                </el-col>
                <el-col :span="11">
                  <div class="flex itemsCenter">
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex15"
                        v-model="temp"
                      >
                        <template slot="append">次/分钟</template>
                      </el-input>
                    </el-form-item>
                    <el-button class="ml-5 mr-5" type="primary">获取历史体征记录</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>呼吸频率</div>
                </el-col>
                <el-col :span="7">
                  <div class="margin-16">
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex16"
                        v-model="temp"
                      >
                        <template slot="append">次/分钟</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="lh62">血 压*</div>
                </el-col>
                <el-col :span="11">
                  <el-row>
                    <el-col :span="4">
                      <div>左侧</div>
                    </el-col>
                    <el-col :span="20">
                      <div class="flex itemsCenter">
                        <el-form-item>
                          <el-input
                            class="w90"
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex17"
                            v-model="temp"
                          ></el-input>
                        </el-form-item>
                        <span>&nbsp;/&nbsp;</span>
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex18"
                            v-model="temp"
                          >
                            <template slot="append">mmHg</template>
                          </el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="4">
                      <div>右侧</div>
                    </el-col>
                    <el-col :span="20">
                      <div class="flex itemsCenter">
                        <el-form-item>
                          <el-input
                            class="w90"
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex19"
                            v-model="temp"
                          ></el-input>
                        </el-form-item>
                        <span>&nbsp;/&nbsp;</span>
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex20"
                            v-model="temp"
                          >
                            <template slot="append">mmHg</template>
                          </el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>身 高*</div>
                </el-col>
                <el-col :span="7">
                  <div>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex21"
                        v-model="temp"
                      >
                        <template slot="append">cm</template>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div>体 重*</div>
                </el-col>
                <el-col :span="11">
                  <el-form-item>
                    <el-input
                      @focus="focus"
                      v-if="!readonly"
                      :readonly="readonly"
                      id="elinput"
                      ref="tabindex22"
                      v-model="temp"
                    >
                      <template slot="append">kg</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh20">老年人健康状态自我评估</div>
                </el-col>
                <el-col :span="21">
                  <div class="lh40 flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="radio">
                        <el-radio :label="1">1-满意</el-radio>
                        <el-radio :label="2">2-基本满意</el-radio>
                        <el-radio :label="3">3-说不清楚</el-radio>
                        <el-radio :label="4">4-不大满意</el-radio>
                        <el-radio :label="5">5-不满意</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex23"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh20">老年人生活自理能力自我评估</div>
                </el-col>
                <el-col class="pt-10" :span="21">
                  <div class="lh50">
                    <el-radio-group class="ml-10 text_left" v-model="radio">
                      <el-radio :label="1">1-可自理（0～3分）</el-radio>
                      <el-radio :label="2">2-轻度依赖（4～8分）</el-radio>
                      <el-radio :label="3">3-中度依赖（9～18分）</el-radio>
                      <el-radio class="mt-10" :label="4">4-不能自理（≥19分）</el-radio>
                      <div class="fr mt-5 mr-5 mb-5">
                        <el-button type="primary">选择评估结果</el-button>
                        <el-button type="primary">添加评估</el-button>
                      </div>
                    </el-radio-group>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh28">老年人认知功能</div>
                </el-col>
                <el-col :span="21">
                  <div class="lh50 text_left ml-10 position_r mt-5">
                    <el-radio-group v-model="radio">
                      <el-radio :label="1">1-粗筛阴性</el-radio>
                      <div class="flex_cs w100">
                        <el-radio :label="2">2-粗筛阳性 ，简易智力状态检查，总分</el-radio>
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex24"
                            v-model="formData.name"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="position_a">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex25"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh28">老年人情感状态</div>
                </el-col>
                <el-col :span="21">
                  <div class="lh50 text_left ml-10 position_r mt-5">
                    <el-radio-group v-model="radio">
                      <el-radio :label="1">1-粗筛阴性</el-radio>
                      <div class="flex_cs w100">
                        <el-radio :label="2">2-粗筛阳性 ，老年人抑郁评分检查，总分</el-radio>
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex26"
                            v-model="formData.name"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="position_a">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex27"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="lh636 center">生活方式</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div class="lh93">体育锻炼</div>
                </el-col>
                <el-col :span="21">
                  <div>
                    <el-row>
                      <el-col :span="4">
                        <div>锻炼频率</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="flex_cs">
                          <div>
                            <el-radio-group class="ml-10" v-model="radio">
                              <el-radio :label="1">1-每天</el-radio>
                              <el-radio :label="2">2-每周一次以上</el-radio>
                              <el-radio :label="3">3-偶尔</el-radio>
                              <el-radio :label="4">4-不锻炼</el-radio>
                            </el-radio-group>
                          </div>
                          <PFormInput class="mr-10">
                            <el-input
                              @focus="focus"
                              v-if="!readonly"
                              :readonly="readonly"
                              id="elinput"
                              ref="tabindex28"
                              v-model="temp"
                            ></el-input>
                          </PFormInput>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>每次锻炼时间</div>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex29"
                            v-model="temp"
                          >
                            <template slot="append">分钟</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <div>坚持锻炼时间</div>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex30"
                            v-model="temp"
                          >
                            <template slot="append">年</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>锻炼方式</div>
                      </el-col>
                      <el-col :span="20">
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex31"
                            v-model="temp"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh60">饮食习惯</div>
                </el-col>
                <el-col :span="21">
                  <div class="text_left">
                    <el-radio-group class="ml-10" v-model="radio">
                      <el-radio :label="1">1-荤素均衡</el-radio>
                      <el-radio :label="2">2-荤食为主</el-radio>
                      <el-radio :label="3">3-素食为主</el-radio>
                      <el-radio :label="4">4-嗜盐</el-radio>
                      <el-radio :label="5">5-嗜油</el-radio>
                      <el-radio :label="6">6-嗜糖</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="flex fr">
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex32"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex33"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex34"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex35"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh93">吸烟情况</div>
                </el-col>
                <el-col :span="21">
                  <div>
                    <el-row>
                      <el-col :span="4">
                        <div>吸烟状况</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="flex_cs">
                          <div>
                            <el-radio-group class="ml-10" v-model="radio">
                              <el-radio :label="1">1-从不吸烟</el-radio>
                              <el-radio :label="2">2-已戒烟</el-radio>
                              <el-radio :label="3">3-吸烟</el-radio>
                            </el-radio-group>
                          </div>
                          <PFormInput class="mr-10">
                            <el-input
                              @focus="focus"
                              v-if="!readonly"
                              :readonly="readonly"
                              id="elinput"
                              ref="tabindex36"
                              v-model="temp"
                            ></el-input>
                          </PFormInput>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>日吸烟量</div>
                      </el-col>
                      <el-col :span="20">
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex37"
                            v-model="temp"
                          >
                            <template slot="append">支</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>开始吸烟年龄</div>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex38"
                            v-model="temp"
                          >
                            <template slot="append">岁</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <div>戒烟年龄</div>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex39"
                            v-model="temp"
                          >
                            <template slot="append">岁</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="lh204">饮酒情况</div>
                </el-col>
                <el-col :span="21">
                  <div>
                    <el-row>
                      <el-col :span="4">
                        <div>饮酒频率</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="flex_cs">
                          <div>
                            <el-radio-group class="ml-10" v-model="radio">
                              <el-radio :label="1">1-从不</el-radio>
                              <el-radio :label="2">2-偶尔</el-radio>
                              <el-radio :label="3">3-经常</el-radio>
                              <el-radio :label="4">4-每天</el-radio>
                            </el-radio-group>
                          </div>
                          <PFormInput class="mr-10">
                            <el-input
                              @focus="focus"
                              v-if="!readonly"
                              :readonly="readonly"
                              id="elinput"
                              ref="tabindex40"
                              v-model="temp"
                            ></el-input>
                          </PFormInput>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>日饮酒量</div>
                      </el-col>
                      <el-col :span="20">
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex41"
                            v-model="temp"
                          >
                            <template slot="append">两</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="4">
                        <div class="lh56">是否戒酒</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="lh50 text_left mt-5 ml-10 position_r">
                          <el-radio-group v-model="radio">
                            <el-radio :label="1">1-未戒酒</el-radio>
                            <div class="flex_cs w100">
                              <el-radio :label="2">2-已戒酒 ，戒酒年龄（岁）：</el-radio>
                              <el-form-item>
                                <el-input
                                  @focus="focus"
                                  v-if="!readonly"
                                  :readonly="readonly"
                                  id="elinput"
                                  ref="tabindex42"
                                  v-model="formData.name"
                                ></el-input>
                              </el-form-item>
                            </div>
                          </el-radio-group>
                          <PFormInput class="position_a">
                            <el-input
                              @focus="focus"
                              v-if="!readonly"
                              :readonly="readonly"
                              id="elinput"
                              ref="tabindex43"
                              v-model="temp"
                            ></el-input>
                          </PFormInput>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div>开始饮酒年龄</div>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex44"
                            v-model="temp"
                          >
                            <template slot="append">岁</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <div>近一年内是否曾醉酒</div>
                      </el-col>
                      <el-col class="text_left flex_cs" :span="8">
                        <el-radio-group class="ml-10" v-model="radio">
                          <el-radio :label="1">1-是</el-radio>
                          <el-radio :label="2">2-否</el-radio>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input
                            @focus="focus"
                            v-if="!readonly"
                            :readonly="readonly"
                            id="elinput"
                            ref="tabindex45"
                            v-model="temp"
                          ></el-input>
                        </PFormInput>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="4">
                        <div class="lh53">饮酒种类</div>
                      </el-col>
                      <el-col :span="20">
                        <div class="lh48 text_left ml-10 position_r mt-5">
                          <el-radio-group v-model="radio">
                            <el-radio :label="1">1-白酒</el-radio>
                            <el-radio :label="2">2-啤酒</el-radio>
                            <el-radio :label="3">3-红酒</el-radio>
                            <el-radio :label="4">4-黄酒</el-radio>
                            <div class="flex itemsCenter w100">
                              <el-radio :label="5">5-其他</el-radio>
                              <el-form-item>
                                <el-input
                                  @focus="focus"
                                  v-if="!readonly"
                                  :readonly="readonly"
                                  id="elinput"
                                  ref="tabindex46"
                                  v-model="formData.name"
                                ></el-input>
                              </el-form-item>
                              <div class="flex position_a mb-5">
                                <PFormInput class="mr-10">
                                  <el-input
                                    @focus="focus"
                                    v-if="!readonly"
                                    :readonly="readonly"
                                    id="elinput"
                                    ref="tabindex47"
                                    v-model="temp"
                                  ></el-input>
                                </PFormInput>
                                <PFormInput class="mr-10">
                                  <el-input
                                    @focus="focus"
                                    v-if="!readonly"
                                    :readonly="readonly"
                                    id="elinput"
                                    ref="tabindex48"
                                    v-model="temp"
                                  ></el-input>
                                </PFormInput>
                                <PFormInput class="mr-10">
                                  <el-input
                                    @focus="focus"
                                    v-if="!readonly"
                                    :readonly="readonly"
                                    id="elinput"
                                    ref="tabindex49"
                                    v-model="temp"
                                  ></el-input>
                                </PFormInput>
                                <PFormInput class="mr-10">
                                  <el-input
                                    @focus="focus"
                                    v-if="!readonly"
                                    :readonly="readonly"
                                    id="elinput"
                                    ref="tabindex50"
                                    v-model="temp"
                                  ></el-input>
                                </PFormInput>
                                <PFormInput>
                                  <el-input
                                    @focus="focus"
                                    v-if="!readonly"
                                    :readonly="readonly"
                                    id="elinput"
                                    ref="tabindex51"
                                    v-model="temp"
                                  ></el-input>
                                </PFormInput>
                              </div>
                            </div>
                          </el-radio-group>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div class="padding-60">职业病危害因素接触史</div>
                </el-col>
                <el-col :span="21">
                  <div class="ml-10 text_left flex_cs">
                    <el-radio-group class="flex mt-5" v-model="radio">
                      <el-radio :label="1">1-无</el-radio>
                      <el-radio :label="2">2-有</el-radio>
                    </el-radio-group>
                    <div class="ml-10">(工种</div>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex52"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>从业时间</div>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex53"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>年)</div>
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex54"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                  </div>
                  <div class="ml-10 text_left flex_cs">
                    <div class="mr-10">毒物种类 粉 尘</div>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex55"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>防护措施</div>
                    <el-radio-group class="flex mt-5" v-model="radio">
                      <el-radio :label="1">1-无</el-radio>
                      <el-radio :label="2">2-有</el-radio>
                    </el-radio-group>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex56"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex57"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                  </div>
                  <div class="ml-10 text_left flex_cs">
                    <div class="mr-10">放射物质</div>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex58"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>防护措施</div>
                    <el-radio-group class="flex mt-5" v-model="radio">
                      <el-radio :label="1">1-无</el-radio>
                      <el-radio :label="2">2-有</el-radio>
                    </el-radio-group>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex59"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex60"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                  </div>
                  <div class="ml-10 text_left flex_cs">
                    <div class="mr-10">物理因素</div>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex61"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>防护措施</div>
                    <el-radio-group class="flex mt-5" v-model="radio">
                      <el-radio :label="1">1-无</el-radio>
                      <el-radio :label="2">2-有</el-radio>
                    </el-radio-group>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex62"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex63"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                  </div>
                  <div class="ml-10 text_left flex_cs">
                    <div class="mr-10">化学因素</div>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex64"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>防护措施</div>
                    <el-radio-group class="flex mt-5" v-model="radio">
                      <el-radio :label="1">1-无</el-radio>
                      <el-radio :label="2">2-有</el-radio>
                    </el-radio-group>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex65"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex66"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                  </div>
                  <div class="ml-10 text_left flex_cs">
                    <div class="mr-10">其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;他</div>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex67"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <div>防护措施</div>
                    <el-radio-group class="flex mt-5" v-model="radio">
                      <el-radio :label="1">1-无</el-radio>
                      <el-radio :label="2">2-有</el-radio>
                    </el-radio-group>
                    <el-form-item>
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex68"
                        v-model="formData.name"
                        class="w90"
                      ></el-input>
                    </el-form-item>
                    <PFormInput class="mr-10">
                      <el-input
                        @focus="focus"
                        v-if="!readonly"
                        :readonly="readonly"
                        id="elinput"
                        ref="tabindex69"
                        v-model="temp"
                      ></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </main>
    </el-form>
    <button v-print="'#printTest'">打印1</button>
  </div>
</template>

<script>
import { dateConversion } from "@/utils/common";
export default {
  name: "className",
  components: {},
  props: {
    status: {
      type: String
    }
  },
  data() {
    return {
      temp: "",
      radio: "",
      // 表单数据
      form: {},
      formData: {
        name: ""
      },
      // 表单规则

      // 是否只读
      readonly: false,
      // 当前聚焦元素的索引
      currentIndex: 1,
      // input最大个数
      maxLength: 0,
      checkList: [],
      symptomOptions: [
        {
          value: "1",
          label: "无症状"
        },
        {
          value: "2",
          label: "头痛"
        },
        {
          value: "3",
          label: "头晕"
        },
        {
          value: "4",
          label: "心悸"
        },
        {
          value: "5",
          label: "胸闷"
        },
        {
          value: "6",
          label: "胸痛"
        },
        {
          value: "7",
          label: "慢性咳嗽"
        },
        {
          value: "8",
          label: "咳痰"
        },
        {
          value: "9",
          label: "呼吸困难"
        },
        {
          value: "10",
          label: "多饮"
        },
        {
          value: "11",
          label: "多尿"
        },
        {
          value: "12",
          label: "体重下降"
        },
        {
          value: "13",
          label: "乏力"
        },
        {
          value: "14",
          label: "关节肿痛"
        },
        {
          value: "15",
          label: "视力模糊"
        },
        {
          value: "16",
          label: "手脚麻木"
        },
        {
          value: "17",
          label: "尿急"
        },
        {
          value: "18",
          label: "尿痛"
        },
        {
          value: "19",
          label: "便秘"
        },
        {
          value: "20",
          label: "腹泻"
        },
        {
          value: "21",
          label: "恶心呕吐"
        },
        {
          value: "22",
          label: "眼花"
        },
        {
          value: "23",
          label: "耳鸣"
        },
        {
          value: "24",
          label: "乳房胀痛"
        },
        {
          value: "25",
          label: "其他"
        }
      ],
      symptomForm: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" }
      ],
      select: "",
      selectOptions: [
        {
          value: "1",
          label: "吴剑锋"
        },
        {
          value: "2",
          label: "吴剑锋"
        },
        {
          value: "3",
          label: "吴剑锋"
        }
      ],
      //
      tempVlaueList: []
    };
  },
  created() {},
  mounted() {
    this.init();
    setTimeout(() => {
      this.initInput();
    }, 10);
    this.addEnterListener();
  },
  destroy() {
    this.removeEnterListener();
  },

  methods: {
    init() {
      // 判断查看、编辑 状态
      console.log("this.status", this.status);
    },
    initInput() {
      // this.$refs.tabindex1.focus();
      var dom = document.getElementsByTagName("input");
      let temp = [];
      for (let i = 0; i < dom.length; i++) {
        const el = dom[i];
        if (el.id == "elinput") {
          temp.push(el);
        }
      }
      for (let i = 0; i < temp.length; i++) {
        const el = temp[i];
        el.intpuIndex = i + 1;
      }
      this.maxLength = temp.length;
      this.$refs.tabindex1.focus();
      console.log("this.maxLength", this.maxLength);
    },
    // 获取焦点触发事件
    focus(e) {
      // console.log("focus获取焦点触发事件", e.target);
      console.log("e.target.intpuIndex", e.target.intpuIndex);
      if (e.target.intpuIndex) {
        this.currentIndex = e.target.intpuIndex;
        console.log("this.currentIndex", this.currentIndex);
      }
    },
    // 监听回车事件具体方法
    listenEnterEvent(e) {
      // console.log("e", e);
      console.log("listenEnterEvent", e);
      if (e.keyCode === 13) {
        if (e.shiftKey && e.keyCode == 13) {
          if (this.currentIndex == 1) {
            return;
          }
          this.currentIndex--;
        } else {
          if (this.maxLength == this.currentIndex) {
            return;
          }
          console.log("this.currentIndex", this.currentIndex);
          this.currentIndex++;
        }
        let temp = "tabindex" + JSON.stringify(this.currentIndex);
        console.log("temp", temp);
        console.log("this.$refs[temp]", this.$refs[temp]);
        setTimeout(() => {
          if (this.$refs[temp][0]) {
            this.$refs[temp][0].focus();
            console.log("this.$refs[temp][0]", this.$refs[temp][0]);
          } else {
            this.$refs[temp].focus();
          }
        }, 10);
      }
    },
    // 开启键盘监听事件
    addEnterListener() {
      console.log('开启键盘监听事件')
      if (window.__completeEnterBind__) {
        return;
      }
      window.addEventListener("keydown", this.listenEnterEvent);
      window.__completeEnterBind__ = true;
    },
    // 移除键盘监听事件
    removeEnterListener() {
      window.removeEventListener("keydown", this.listenEnterEvent);
      window.__completeEnterBind__ = false;
    },
    tabindexRef(i) {
      console.log("aaaa", "tabindex" + (i + 3));
      return "tabindex" + (i + 3);
    },
    // dateConversion 日期转换
    DateConversion() {
      if (this.temp.length == 8) {
        this.temp = dateConversion(this.temp);
      }
    },
    inputTest(e) {
      console.log("inputTest", e);
      console.log("this.symptomForm", this.symptomForm);
      this.symptomOptions.forEach(el => {
        if (el.value == e) {
          this.checkList.push(el.label);
        }
      });
    },
    checkListChange(e) {
      console.log("checkListChange", e);
      console.log("e[e.length]", e[e.length - 1]);
      for (var i = 0; i < this.symptomForm.length; i++) {
        console.log("this.symptomForm[i].value", this.symptomForm[i].value);
        if (this.symptomForm[i].value == "") {
          this.symptomForm[i].value = e[e.length - 1];
          break;
        }
      }
    }
  },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
.className {
  background: #fff;
  margin: 40px 110px 0 110px;
  .table_form {
    font-size: 14px !important;
    border-collapse: collapse;
    table-layout: fixed;
    word-break: break-all;
    word-wrap: break-word;
    padding: 20px 0;
    /deep/.el-input-group__append {
      height: 30px !important;
      background: #fff;
      // padding: 5px;
      padding: 0 5px;
    }
    /deep/.el-form-item--medium .el-form-item__content {
      height: 30px !important;
      line-height: 30px !important;
      font-size: 14px;
    }
    /deep/.el-input--medium {
      font-size: 14px;
      height: 30px !important;
    }
    /deep/.el-input--medium .el-input__inner {
      height: 30px !important;
      font-size: 14px;
      border-radius: 2px;
    }
    /deep/.el-input--medium .el-input__icon {
      line-height: 30px;
    }
  }
  .table_header {
    .table_title {
      font-size: 20px;
      margin-bottom: 20px;
      font-weight: bold;
      text-align: center;
    }
  }
  .table_main {
    width: 100%;
    height: 100%;
    .rowChildren {
      .el-row {
        border: none;
        border-bottom: 1px solid #000;
        &:last-child {
          border: none;
        }
        /deep/.el-button--primary,
        .el-button--default {
          height: 25px;
          font-size: 13px;
          padding: 4px 8px;
        }
      }
      .el-col {
        min-height: 30px;
        line-height: 30px;
        border-left: 1px solid #000;
        &:first-child {
          border-left: none;
        }
      }
    }
    .el-row {
      min-height: 30px;
      line-height: 30px;
      border-top: 1px solid #000;
      border-right: 1px solid #000;
      border-left: 1px solid #000;
      &:last-child {
        border-bottom: 1px solid #000;
      }
    }
    .el-col {
      min-height: 30px;
      line-height: 30px;
      border-left: 1px solid #000;
      &:first-child {
        border-left: none;
      }
    }
  }
}
</style>