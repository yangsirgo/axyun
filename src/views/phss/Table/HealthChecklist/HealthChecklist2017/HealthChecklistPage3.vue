<template>
  <div>
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <main class="table_main">
        <el-row>
          <el-col :span="2">
            <div class="center">辅助检查</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div>尿微量白蛋白*</div>
                </el-col>
                <el-col :span="21">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.mALB">
                      <template slot="append">mg/dL</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>大便潜血*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <div>
                      <el-radio-group class="ml-10" v-model="TableForm.stool_occult_blood">
                        <el-radio label="1">1-阴性</el-radio>
                        <el-radio label="2">2-阳性</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.stool_occult_blood"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>糖化血红蛋白*</div>
                </el-col>
                <el-col :span="21">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.HbAlc">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>乙型肝炎表面抗原*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex lh60 itemsCenter space_between">
                    <div>
                      <el-radio-group class="ml-10" v-model="TableForm.HBSAG">
                        <el-radio label="1">1-阴性</el-radio>
                        <el-radio label="2">2-阳性</el-radio>
                      </el-radio-group>
                    </div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.HBSAG"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>肝功能*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex flex_wrap itemsCenter">
                    <div>
                      <el-form-item label="血清谷丙转氨酶" label-width="110px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.GPT">
                          <template slot="append">U/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="血清谷草转氨酶" label-width="110px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.GOT">
                          <template slot="append">U/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="白蛋白" label-width="110px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.alb">
                          <template slot="append">g/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="总胆红素" label-width="110px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.TBIL">
                          <template slot="append">μmol/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="结合胆红素" label-width="110px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.DBIL">
                          <template slot="append">μmol/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>肾功能*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex flex_wrap itemsCenter">
                    <div>
                      <el-form-item label="血清肌酐" label-width="80px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.Scr">
                          <template slot="append">μmol/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="血尿素" label-width="80px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.BUN">
                          <template slot="append">mmol/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="血钾浓度" label-width="80px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.blood_kalium_concentration">
                          <template slot="append">mmol/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="血钠浓度" label-width="80px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.blood_natrium_concentration">
                          <template slot="append">mmol/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>血 脂*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex flex_wrap itemsCenter">
                    <div>
                      <el-form-item label="总胆固醇" label-width="80px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.CHOL">
                          <template slot="append">μmol/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="甘油三酯" label-width="80px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.TG">
                          <template slot="append">mmol/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="血清低密度脂蛋白胆固醇" label-width="178px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.LDL_C_low">
                          <template slot="append">mmol/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="血清高密度脂蛋白胆固醇" label-width="178px">
                        <el-input class="w190" v-if="!readonly" :readonly="readonly" v-model="TableForm.LDL_C_high">
                          <template slot="append">mmol/L</template>
                        </el-input>
                      </el-form-item>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>胸部 X 线片*</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <el-radio-group class="flex_cs ml-10" v-model="TableForm.CXR">
                      <el-radio label="1">1-正常</el-radio>
                      <div class="flex_cs w100">
                        <el-radio label="2">2-异常</el-radio>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.CXR_abnormal"></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.CXR"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>B 超*</div>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="3">
                      <div>腹部 B 超</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.abdomen_B_ultra">
                          <el-radio label="1">1-正常</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-异常</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.abdomen_B_ultra_abnormal"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.abdomen_B_ultra"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="3">
                      <div>其他</div>
                    </el-col>
                    <el-col :span="21">
                      <div class="flex_cs">
                        <el-radio-group class="flex_cs ml-10" v-model="TableForm.B_ultra_other">
                          <el-radio label="1">1-正常</el-radio>
                          <div class="flex_cs w100">
                            <el-radio label="2">2-异常</el-radio>
                            <el-form-item>
                              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.B_ultra_other_abnormal"></el-input>
                            </el-form-item>
                          </div>
                        </el-radio-group>
                        <PFormInput class="mr-10">
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.B_ultra_other"></el-input>
                        </PFormInput>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>宫颈涂片</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <el-radio-group class="flex_cs ml-10" v-model="TableForm.PAP">
                      <el-radio label="1">1-正常</el-radio>
                      <div class="flex_cs w100">
                        <el-radio label="2">2-异常</el-radio>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.PAP_abnormal"></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.PAP"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>其他*</div>
                </el-col>
                <el-col :span="21">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.assistant_examination_other"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center">现存主要健康问题</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div>脑血管疾病</div>
                </el-col>
                <el-col class="text_left pl-10" :span="21">
                  <PCheckbox :readonly="readonly" :formKey="'CVD'" :otherKey="'CVD_other'" :otherData="TableForm.CVD_other"
                    :checkboxForm="chObject.CVD" :checkboxOptions="CVDOptions" @childValInput="childVal" @otherValInput="otherVal" :clearFlag="clearFlag"/>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>肾脏疾病</div>
                </el-col>
                <el-col class="text_left pl-10" :span="21">
                  <PCheckbox :readonly="readonly" :formKey="'renal_diseases'" :otherKey="'renal_diseases_other'"
                    :otherData="TableForm.renal_diseases_other" :checkboxForm="chObject.renal_diseases"
                    :checkboxOptions="RenalDiseasesOptions" @childValInput="childVal" @otherValInput="otherVal" :clearFlag="clearFlag"/>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>心脏疾病</div>
                </el-col>
                <el-col class="text_left pl-10" :span="21">
                  <PCheckbox :readonly="readonly" :formKey="'heart_disease'" :otherKey="'heart_disease_other'"
                    :otherData="TableForm.heart_disease_other" :checkboxForm="chObject.heart_disease" :checkboxOptions="HeartDiseasesOptions"
                    @childValInput="childVal" @otherValInput="otherVal" :clearFlag="clearFlag"/>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>血管疾病</div>
                </el-col>
                <el-col class="text_left pl-10" :span="21">
                  <PCheckbox :readonly="readonly" :formKey="'angiosis'" :otherKey="'angiosis_other'" :otherData="TableForm.angiosis_other"
                    :checkboxForm="chObject.angiosis" :checkboxOptions="AngiosisOptions" @childValInput="childVal"
                    @otherValInput="otherVal" :clearFlag="clearFlag"/>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>眼部疾病</div>
                </el-col>
                <el-col class="text_left pl-10" :span="21">
                  <PCheckbox :readonly="readonly" :formKey="'ocular'" :otherKey="'ocular_other'" :otherData="TableForm.ocular_other"
                    :checkboxForm="chObject.ocular" :checkboxOptions="OcularOptions" @childValInput="childVal"
                    @otherValInput="otherVal" :clearFlag="clearFlag"/>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>神经系统疾病</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <el-radio-group class="flex_cs ml-10" v-model="TableForm.neurological_disorders">
                      <el-radio label="1">1 未发现</el-radio>
                      <div class="flex_cs w100">
                        <el-radio label="2">2 有</el-radio>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.neurological_disorders_description"></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.neurological_disorders"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>其他系统疾病</div>
                </el-col>
                <el-col :span="21">
                  <div class="flex_cs">
                    <el-radio-group class="flex_cs ml-10" v-model="TableForm.other_system_diseases">
                      <el-radio label="1">1 未发现</el-radio>
                      <div class="flex_cs w100">
                        <el-radio label="2">2 有</el-radio>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.other_system_diseases_description"></el-input>
                        </el-form-item>
                      </div>
                    </el-radio-group>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.other_system_diseases"></el-input>
                    </PFormInput>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center">住院治疗情况</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="3">
                  <div>住院史</div>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="6">入/出院日期</el-col>
                    <el-col :span="6">原 因</el-col>
                    <el-col :span="6">医疗机构名称</el-col>
                    <el-col :span="6">病案号</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <div class="flex itemsCenter">
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.in_date_1"></el-input>
                        </el-form-item>
                        <span>&nbsp;/&nbsp;</span>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.out_date_1"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.in_reason_1"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.in_hospital_name_1"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.in_mr_no_1"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <div class="flex itemsCenter">
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.in_date_2"></el-input>
                        </el-form-item>
                        <span>&nbsp;/&nbsp;</span>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.out_date_2"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.in_reason_2"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.in_hospital_name_2"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.in_mr_no_2"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <div>家庭病床史</div>
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="6">建/撤床日期</el-col>
                    <el-col :span="6">原 因</el-col>
                    <el-col :span="6">医疗机构名称</el-col>
                    <el-col :span="6">病案号</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <div class="flex itemsCenter">
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.build_date_1"></el-input>
                        </el-form-item>
                        <span>&nbsp;/&nbsp;</span>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.remove_date_1"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.build_reason_1"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.build_hospital_name_1"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.build_mr_no_1"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="6">
                      <div class="flex itemsCenter">
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.build_date_2"></el-input>
                        </el-form-item>
                        <span>&nbsp;/&nbsp;</span>
                        <el-form-item>
                          <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.remove_date_2"></el-input>
                        </el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.build_reason_2"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.build_hospital_name_2"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.build_mr_no_2"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </main>
    </el-form>
  </div>
</template>

<script>
  import {
    dateConversion
  } from "@/utils/common";
  export default {
    name: "HealthChecklistPage3",
    components: {},
    data() {
      return {
        // 是否只读
        readonly: false,
        // input最大个数
        maxLength: 0,
        // 状态 新增 查看 编辑  view edit
        status: this.$store.state.table.tableStatus,
        //多选框
        clearFlag:false,
        // 表单数据
        TableForm: {
          mALB: "", //尿微量白蛋白
          stool_occult_blood: "", //大便潜血
          HbAlc: "", //糖化血红蛋白
          HBSAG: "", //乙型肝炎表面抗原
          GPT: "", //肝功能血清谷丙转氨酶
          GOT: "", //肝功能血清谷草转氨酶
          alb: "", //肝功能白蛋白
          TBIL: "", //肝功能总胆红素
          DBIL: "", //肝功能结合胆红素
          Scr: "", //肾功能血清肌酐
          BUN: "", //肾功能血尿素
          blood_kalium_concentration: "", //肾功能血钾浓度
          blood_natrium_concentration: "", //肾功能血钠浓度
          CHOL: "", //血脂总胆固醇
          TG: "", //血脂甘油三酯
          LDL_C_low: "", //血脂血清低密度脂蛋白胆固醇
          LDL_C_high: "", //血脂血清高密度脂蛋白胆固醇
          CXR: "", //胸部X线片
          CXR_abnormal: "", //胸部X线片异常
          abdomen_B_ultra: "", //腹部B超
          abdomen_B_ultra_abnormal: "", //腹部B超异常
          B_ultra_other: "", //B超其他
          B_ultra_other_abnormal: "", //B超其他异常
          PAP: "", //宫颈涂片
          PAP_abnormal: "", //宫颈涂片异常
          assistant_examination_other: "", //辅助检查其他
          CVD: "", //脑血管疾病
          CVD_other: "", //脑血管疾病其他
          renal_diseases: "", //肾脏疾病
          renal_diseases_other: "", //肾脏疾病其他
          heart_disease: "", //心脏疾病
          heart_disease_other: "", //心脏疾病其他
          angiosis: "", //血管疾病
          angiosis_other: "", //血管疾病其他
          ocular: "", //眼部疾病
          ocular_other: "", //眼部疾病其他
          neurological_disorders: "", //神经系统疾病
          neurological_disorders_description: "", //神经系统疾病有
          other_system_diseases: "", //其他系统疾病
          other_system_diseases_description: "", //其他系统疾病有
          in_date_1: "", //住院史入院日期1
          in_reason_1: "", //住院史入院原因1
          in_hospital_name_1: "", //住院史入院医疗机构名称1
          in_mr_no_1: "", //住院史入院病案号1
          out_date_1: "", //住院史出院日期1
          in_date_2: "", //住院史入院日期2
          in_reason_2: "", //住院史入院原因2
          in_hospital_name_2: "", //住院史入院医疗机构名称2
          in_mr_no_2: "", //住院史入院病案号2
          out_date_2: "", //住院史出院日期2
          out_reason: "", //住院史出院原因
          out_hospital_name: "", //住院史出院医疗机构名称
          out_mr_no: "", //住院史出院病案号
          build_date_1: "", //家庭病床史建床日期1
          build_reason_1: "", //家庭病床史建床原因1
          build_hospital_name_1: "", //家庭病床史建床医疗机构名称1
          build_mr_no_1: "", //家庭病床史建床病案号1
          remove_date_1: "", //家庭病床史撤床日期1
          build_date_2: "", //家庭病床史建床日期2
          build_reason_2: "", //家庭病床史建床原因2
          build_hospital_name_2: "", //家庭病床史建床医疗机构名称2
          build_mr_no_2: "", //家庭病床史建床病案号2
          remove_date_2: "", //家庭病床史撤床日期2
          remove_reason: "", //家庭病床史撤床原因
          remove_hospital_name: "", //家庭病床史撤床医疗机构名称
          remove_mr_no: "" //家庭病床史撤床病案号
        },
        // --- checkbox Data ---
        CVDOptions: [{
            id: "1",
            content: "未发现"
          },
          {
            id: "2",
            content: "缺血性卒中"
          },
          {
            id: "3",
            content: "脑出血"
          },
          {
            id: "4",
            content: "蛛网膜下腔出血"
          },
          {
            id: "5",
            content: "短暂性脑缺血发作"
          },
          {
            id: "6",
            content: "其他"
          }
        ],
        RenalDiseasesOptions: [{
            id: "1",
            content: "未发现"
          },
          {
            id: "2",
            content: "糖尿病肾病"
          },
          {
            id: "3",
            content: "肾功能衰竭"
          },
          {
            id: "4",
            content: "急性肾炎"
          },
          {
            id: "5",
            content: "慢性肾炎"
          },
          {
            id: "6",
            content: "其他"
          }
        ],
        HeartDiseasesOptions: [{
            id: "1",
            content: "未发现"
          },
          {
            id: "2",
            content: "心肌梗死"
          },
          {
            id: "3",
            content: "心绞痛"
          },
          {
            id: "4",
            content: "冠状动脉血运重建"
          },
          {
            id: "5",
            content: "充血性心力衰竭"
          },
          {
            id: "6",
            content: "心前区疼痛"
          },
          {
            id: "7",
            content: "其他"
          }
        ],
        AngiosisOptions: [{
            id: "1",
            content: "未发现"
          },
          {
            id: "2",
            content: "夹层动脉瘤"
          },
          {
            id: "3",
            content: "动脉闭塞性疾病"
          },
          {
            id: "4",
            content: "其他"
          }
        ],
        OcularOptions: [{
            id: "1",
            content: "未发现"
          },
          {
            id: "2",
            content: "视网膜出血或渗出"
          },
          {
            id: "3",
            content: "视乳头水肿"
          },
          {
            id: "4",
            content: "白内障"
          },
          {
            id: "5",
            content: "其他"
          }
        ],
        DrinkingTypesOptions: [{
            id: "1",
            content: "白酒"
          },
          {
            id: "2",
            content: "啤酒"
          },
          {
            id: "3",
            content: "红酒"
          },
          {
            id: "4",
            content: "黄酒"
          },
          {
            id: "5",
            content: "其他"
          }
        ],
        chObject: {
          CVD: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ],
          renal_diseases: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ],
          heart_disease: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ],
          angiosis: [{
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }],
          ocular: [{
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }]
        }
      };
    },
    created() {
      this.EchoMethod();
    },
    mounted() {
      if (this.status != "view") {
        this.init();
      }
    },
    methods: {
      init() {
        // 判断查看、编辑 状态
        console.log("this.status", this.status);
        setTimeout(() => {
          this.initInput();
          this.addEnterListener();
        }, 10);
      },
      emptyData() {
        for (var obj in this.TableForm) {
          this.TableForm[obj] = ""
        };
        this.chObject = {
          CVD: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ],
          renal_diseases: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ],
          heart_disease: [{
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            },
            {
              value: ""
            }
          ],
          angiosis: [{
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }],
          ocular: [{
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }, {
            value: ""
          }]
        }
        this.clearFlag = true;
      },
      initInput() {
        // let val = document.getElementsByClassName("el-input--medium");
        let val = document
          .querySelector("#tableDialog")
          .getElementsByClassName("el-input--medium");
        for (var i = 0; i < val.length; i++) {
          // 给每个input添加id
          val[i].children[0].setAttribute("id", "elinput" + (i + 1));
          // 添加唯一index
          val[i].children[0].intpuIndex = i + 1;
        }
        // 获取最大input数   设置最大长度保证回车不会溢出
        this.maxLength = val.length;
        console.log("val.length", val.length);
        let temp = document.getElementById("elinput1");
        temp.focus();
        // const obj = {};
        // for (const prop in temp) {
        //   obj[prop] = temp[prop];
        // }
        // console.log(obj);
      },
      // 监听回车事件具体方法
      listenEnterEvent(e) {
        // console.log("listenEnterEvent", e);
        let tempIndex = e.target.intpuIndex;
        if (e.keyCode === 13) {
          // if ((e.ctrlKey && e.keyCode == 13) || (e.shiftKey && e.keyCode == 13)) {
          if (e.shiftKey && e.keyCode == 13) {
            if (tempIndex == 1) {
              return;
            }
            tempIndex--;
          } else {
            if (this.maxLength == tempIndex) {
              return;
            }
            tempIndex++;
          }
          let temp = document.getElementById("elinput" + tempIndex);
          // 设置焦点
          temp.focus();
          // const obj = {};
          // for (const prop in temp) {
          //   obj[prop] = temp[prop];
          // }
          // console.log("huiche", obj);
        }
      },
      // 开启键盘监听事件
      addEnterListener() {
        if (window.__completeEnterBind__) {
          return;
        }
        window.addEventListener("keydown", this.listenEnterEvent);
        window.__completeEnterBind__ = true;
      },
      // 移除键盘监听事件
      removeEnterListener() {
        console.log("移除键盘监听事件");
        window.removeEventListener("keydown", this.listenEnterEvent);
        window.__completeEnterBind__ = false;
      },
      // dateConversion 日期转换
      DateConversion() {
        if (this.temp.length == 8) {
          this.temp = dateConversion(this.temp);
        }
      },
      // 复选框 input 联动
      childVal(val, key) {
        this.TableForm[key] = "";
        let temp = [];
        val.forEach(el => {
          if (el.value != "") {
            temp.push(el.value);
          }
        });
        temp = temp.join(",");
        this.TableForm[key] = temp;
      },
      otherVal(val, key) {
        console.log("key", key);
        this.TableForm[key] = val;
        console.log(`this.TableForm.${key}`, this.TableForm[key]);
      },
      // 返显方法
      EchoMethod() {
        console.log(
          "tableConfiguration**************",
          this.$store.state.table.tableConfiguration
        );
        console.log("表格状态99999999", this.$store.state.table.tableStatus);
        console.log("this.status", this.status);
        let tableConfiguration = {};
        if (this.status == "add") {
          return;
        }
        if (this.status == "view") {
          tableConfiguration = this.$store.state.table.viewTableConfiguration;
          console.log("view数据返显", tableConfiguration);
        }
        if (this.status == "edit") {
          tableConfiguration = this.$store.state.table.tableConfiguration;
          console.log("edit数据返显", tableConfiguration);
        }
        for (let obj in this.TableForm) {
          this.TableForm[obj] = tableConfiguration.editData[obj];
        }
        let editChObject = JSON.parse(tableConfiguration.editChObject);
        // console.log("tableConfiguration.editChObject", editChObject);
        for (let obj in this.chObject) {
          this.chObject[obj] = editChObject[obj];
        }
        console.log("this.TableForm", this.TableForm);
        console.log("this.chObject", this.chObject);
      }
    },
    watch: {},
    computed: {}
  };
</script>
