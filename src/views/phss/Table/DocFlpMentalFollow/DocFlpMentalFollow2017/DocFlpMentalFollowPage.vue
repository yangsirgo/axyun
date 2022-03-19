
<template>
  <div class="lungTable">
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">严重精神障碍患者随访服务记录表</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" justify="space-between">
          <el-col :span="12">
            <div>姓名:
              {{rsdt_name}}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="fr">编号:
              {{pap_doc_no}}
            </div>
          </el-col>
        </el-row>
      </header>
      <main class="table_main">

        <el-row>
          <el-col class="center" :span="8">随访日期*</el-col>
          <el-col :span="16">
            <el-form-item>
              <el-input @change="DateConversion('follow_up_date',$event)" v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_date"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">本次随访形式*</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.follow_up_type">
                  <el-radio label="1">1-门诊</el-radio>
                  <el-radio label="2">2-家庭访视</el-radio>
                  <el-radio label="3">3-电话</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_type"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">若失访，原因</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.lost_follow_up_reason">
                  <el-radio label="1">1-外出打工</el-radio>
                  <el-radio label="2">2-迁居他处</el-radio>
                  <el-radio label="3">3-走失</el-radio>
                  <el-radio label="4">4-连续3次未到访</el-radio>
                  <el-radio label="5">5-其他</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.lost_follow_up_reason"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>


        <el-row class="el-row-boder">
          <el-col :span="8">
            <el-col :span="8">
              <div class="center lh94-style">如死亡，日期和原因</div>
            </el-col>
            <el-col :span="16">
              <el-row class="el-row-border-2">
                <el-col style="text-align: center;">死亡日期</el-col>
              </el-row>

              <el-row class="borderBottom">
                <el-col style="text-align: center;height: 70px;line-height: 70px;">死亡原因</el-col>
              </el-row>

            </el-col>
          </el-col>
          <el-col :span="16">
            <div class="rowChildren center">
              <el-row class="el-row-border-2">
                <el-input @change="DateConversion('death_date',$event)" v-if="!readonly" :readonly="readonly" v-model="TableForm.death_date"></el-input>
              </el-row>
              <el-row :span="24" class="el-row-border-1">
                <div class="flex_cs">
                  <div>
                    <el-radio-group class="ml-10" v-model="TableForm.death_disease">
                     <el-radio label="1" style="margin-bottom: 8px;">1-躯体疾病 ①传染病和寄生虫病 ②肿瘤 ③心脏病④脑血管病<br />
                        ⑤呼吸系统疾病 ⑥消化系统疾病⑦其他疾病 ⑧不详
                      </el-radio>
                      <el-radio label="2">2-自杀</el-radio>
                      <el-radio label="3">3-他杀</el-radio>
                      <el-radio label="4">4-意外</el-radio>
                      <el-radio label="5">5-精神疾病相关并发症</el-radio>
                      <el-radio label="6">6-其他</el-radio>
                    </el-radio-group>
                  </div>
                  <div>
                    <PFormInput class="mr-10">
                      <el-input v-if="!readonly" :readonly="readonly" @input="inputChange()" v-model="TableForm.death_disease"></el-input>
                    </PFormInput>
                    <PFormInput class="mr-10" :style="{visibility:this.readonlyStyle ? '':'hidden'}">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.death_other"></el-input>
                    </PFormInput>
                  </div>
                </div>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">危险性评估</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.risk_assessment">
                  <el-radio label="0">0-（0级）</el-radio>
                  <el-radio label="1">1-（1级）</el-radio>
                  <el-radio label="2">2-（2级）</el-radio>
                  <el-radio label="3">3-（3级）</el-radio>
                  <el-radio label="4">4-（4级）</el-radio>
                  <el-radio label="5">5-（5级）</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.risk_assessment"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row class="symptomsStyleBox">
          <el-col :span="8" style="border-right:0px ;">
            <div class="center lh142 symptomsStyle">
              目前症状
            </div>
          </el-col>
          <el-col :span="16" style="border-left:1px solid !important;">
            <div class="rowChildren center">
              <el-row :span="24" class="symptomsInput symptom">

                <el-col :span="24" class="text_left">
                  <PCheckbox class="pl-10" @childValInput="childVal" :readonly="readonly" :formKey="'symptom'"
                    :checkboxOptions="symptomOptionsData" :checkboxForm="chObject.symptom" :clearFlag="clearFlag" />
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">自知力</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.insight">
                  <el-radio label="1">1-自知力完全</el-radio>
                  <el-radio label="2">2-自知力不全</el-radio>
                  <el-radio label="3">3-自知力缺失</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.insight"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">睡眠情况</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.sleep_situation">
                  <el-radio label="1">1-良好</el-radio>
                  <el-radio label="2">2-一般</el-radio>
                  <el-radio label="3">3-较差</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.sleep_situation"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">饮食情况</el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.eating_situation">
                  <el-radio label="1">1-良好</el-radio>
                  <el-radio label="2">2-一般</el-radio>
                  <el-radio label="3">3-较差</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.eating_situation"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>


        <el-row class="el-row-boder">
          <el-col :span="8">
            <el-col :span="8">
              <div class="center lh94-style">社会功能情况</div>
            </el-col>
            <el-col :span="16">
              <el-row class="el-row-border-2">
                <el-col style="text-align: center;">个人生活料理</el-col>
              </el-row>
              <el-row>
                <el-col style="text-align: center;">家务劳动</el-col>
              </el-row>
              <el-row>
                <el-col style="text-align: center;">生产劳动及工作</el-col>
              </el-row>
              <el-row>
                <el-col style="text-align: center;">学习能力</el-col>
              </el-row>
              <el-row class="borderBottom">
                <el-col style="text-align: center;">社会人际交往</el-col>
              </el-row>
            </el-col>
          </el-col>
          <el-col :span="16">
            <div class="rowChildren center">
              <el-row class="el-row-border-2">

                <div class="flex_cs">
                  <div>
                    <el-radio-group class="ml-10" v-model="TableForm.cuisine">
                      <el-radio label="1">1-良好</el-radio>
                      <el-radio label="2">2-一般</el-radio>
                      <el-radio label="3">3-较差</el-radio>
                    </el-radio-group>
                  </div>
                  <PFormInput class="mr-10">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.cuisine"></el-input>
                  </PFormInput>
                </div>

              </el-row>
              <el-row :span="24" class="el-row-border-1">
                <div class="flex_cs">
                  <div>
                    <el-radio-group class="ml-10" v-model="TableForm.housework">
                      <el-radio label="1">1-良好</el-radio>
                      <el-radio label="2">2-一般</el-radio>
                      <el-radio label="3">3-较差</el-radio>
                    </el-radio-group>
                  </div>
                  <PFormInput class="mr-10">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.housework"></el-input>
                  </PFormInput>
                </div>
              </el-row>
              <el-row :span="24" class="el-row-border-1">
                <div class="flex_cs">
                  <div>
                    <el-radio-group class="ml-10" v-model="TableForm.work">
                      <el-radio label="1">1-良好</el-radio>
                      <el-radio label="2">2-一般</el-radio>
                      <el-radio label="3">3-较差</el-radio>
                      <el-radio label="9">9-此项不适用</el-radio>
                    </el-radio-group>
                  </div>
                  <PFormInput class="mr-10">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.work"></el-input>
                  </PFormInput>
                </div>
              </el-row>
              <el-row :span="24" class="el-row-border-1">
                <div class="flex_cs">
                  <div>
                    <el-radio-group class="ml-10" v-model="TableForm.learning_ability">
                      <el-radio label="1">1-良好</el-radio>
                      <el-radio label="2">2-一般</el-radio>
                      <el-radio label="3">3-较差</el-radio>
                    </el-radio-group>
                  </div>
                  <PFormInput class="mr-10">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.learning_ability"></el-input>
                  </PFormInput>
                </div>
              </el-row>
              <el-row :span="24" class="el-row-border-1">
                <div class="flex_cs">
                  <div>
                    <el-radio-group class="ml-10" v-model="TableForm.interpersonal">
                      <el-radio label="1">1-良好</el-radio>
                      <el-radio label="2">2-一般</el-radio>
                      <el-radio label="3">3-较差</el-radio>
                    </el-radio-group>
                  </div>
                  <PFormInput class="mr-10">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.interpersonal"></el-input>
                  </PFormInput>
                </div>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row class="symptomsStyleBox">
          <el-col :span="8" style="border-right:0px ;">
            <div class="center symptomsStyle">
              危险行为
            </div>
          </el-col>
          <el-col :span="16" style="border-left:1px solid !important;">
            <div class="rowChildren center">
              <el-row :span="24" class="symptomsInput symptom">

               <div class="flex_cs">
                 <div class="dangerousAct">
                   <el-radio-group class="ml-10 elCol-style-box" v-model="TableForm.risky_behavior">
                     <div class="floatLeft"><div class="elCol-style">
                     <el-radio label="1">1-轻度滋事</el-radio>
                     <el-input v-model="TableForm.mild_nuisance"></el-input><span class="w30" style="width: 30px;">次</span></div></div>
                     <div class="floatLeft"><div class="elCol-style">
                     <el-radio label="2">2-肇事</el-radio>
                     <el-input v-model="TableForm.accident"></el-input><span class="w30" style="width: 30px;">次</span></div></div>
                     <div class="floatLeft"><div class="elCol-style">
                     <el-radio label="3">3-肇祸</el-radio>
                     <el-input v-model="TableForm.cause_disaster"></el-input><span class="w30" style="width: 30px;">次</span></div></div>
                     <div class="floatLeft"><div class="elCol-style">
                     <el-radio label="4">4-其他危害行为</el-radio>
                     <el-input v-model="TableForm.dther_harmful_behaviors"></el-input><span class="w30" style="width: 30px;">次</span></div></div>
                     <div class="floatLeft"><div class="elCol-style">
                     <el-radio label="5">5-自伤</el-radio>
                     <el-input v-model="TableForm.self_injury"></el-input><span class="w30" style="width: 30px;">次</span></div></div>
                     <div class="floatLeft"><div class="elCol-style">
                     <el-radio label="6">6-自杀未遂</el-radio><el-input v-model="TableForm.attempted_suicide"></el-input><span class="w30" style="width: 30px;">次</span></div></div>
                     <div class="floatLeft dangerousActStyle"><div class="elCol-style">
                     <el-radio label="7">7-无</el-radio>
                     </div></div>

                   </el-radio-group>
                 </div>
                 <PFormInput class="mr-10">
                   <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.risky_behavior"></el-input>
                 </PFormInput>
               </div>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">
            <div class="center symptomsStyle">
              两次随访期间
              关锁情况
            </div>
          </el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.lock_situation">
                  <el-radio label="1">1-无关锁</el-radio>
                  <el-radio label="2">2-关锁 </el-radio>
                  <el-radio label="3">3-关锁已解除</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.lock_situation"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

          <el-row>
            <el-col :span="8" class="center">
              <div class="centerHeight">两次随访期间住院情况</div>
            </el-col>
            <el-col :span="16" class="text_left">
              <el-col :span="24" class="elCol-style" >
                <span style="width: 150px;">停止治疗原因：</span>
                <div class="flex_cs">
                  <div>
                    <el-radio-group class="ml-10" v-model="TableForm.in_situation">
                      <el-radio label="0">0-未住院</el-radio>
                      <el-radio label="1">1-目前正在住院</el-radio>
                      <el-radio label="2">2-曾住院，现未住院</el-radio>
                    </el-radio-group>
                  </div>
                  <PFormInput class="mr-10">
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.in_situation"></el-input>
                  </PFormInput>
                </div>
              </el-col>
              <el-col :span="24" class="elCol-style" style="border-left:0px;margin-top: 8px;margin-bottom: 8px;">
                <span style="width: 150px;">末次出院时间：</span>
                <el-form-item>
                  <el-input v-if="!readonly" @change="DateConversion('out_date',$event)" :readonly="readonly"
                    v-model="TableForm.out_date"></el-input>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>

        <el-row>
          <el-col class="center" :span="8">
            <div class="center symptomsStyle">
              实验室检查
            </div>
          </el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.laboratory_test">
                  <el-radio label="1">1-无</el-radio>
                  <el-radio label="2">2-有</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.laboratory_test"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">
            <div class="center symptomsStyle">
              用药依从性
            </div>
          </el-col>
          <el-col :span="16">
            <div class="flex_cs">
              <div>
                <el-radio-group class="ml-10" v-model="TableForm.compliance">
                  <el-radio label="1">1-按医嘱规律用药</el-radio>
                  <el-radio label="2">2-间断用药</el-radio>
                  <el-radio label="3">3-不用药</el-radio>
                  <el-radio label="4">4-医嘱勿需用药</el-radio>
                </el-radio-group>
              </div>
              <PFormInput class="mr-10">
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.compliance"></el-input>
              </PFormInput>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="center" :span="8">
            <div class="center symptomsStyle">
              药物不良反应
            </div>
          </el-col>
         <el-col :span="16" class="flex_cs">
           <div class="ml-10 text_left flex_c">
             <el-radio-group class="flex mt-5" v-model="TableForm.ADR">
               <el-radio label="1">1-无</el-radio>
               <el-radio label="2">2-有：</el-radio>
             </el-radio-group>
             <el-form-item>
               <el-input :readonly="readonly" v-model="TableForm.ADR_description" class="w90"></el-input>
             </el-form-item>
             <el-radio label="9">9-此项不适用</el-radio>
           </div>
           <PFormInput class="mr-10">
             <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.ADR"></el-input>
           </PFormInput>
         </el-col>
        </el-row>

         <el-row>
           <el-col class="center" :span="8">
             <div class="center symptomsStyle">
               治疗效果
             </div>
           </el-col>
           <el-col :span="16">
             <div class="flex_cs">
               <div>
                 <el-radio-group class="ml-10" v-model="TableForm.therapeutic_activity">
                   <el-radio label="1">1-痊愈</el-radio>
                   <el-radio label="2">2-好转</el-radio>
                   <el-radio label="3">3-无变化</el-radio>
                   <el-radio label="4">4-加重</el-radio>
                   <el-radio label="9">9-此项不适用</el-radio>
                 </el-radio-group>
               </div>
               <PFormInput class="mr-10">
                 <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.therapeutic_activity"></el-input>
               </PFormInput>
             </div>
           </el-col>
         </el-row>

        <el-row>
          <el-col :span="8" class="center">
            <div class="centerHeight">是否转诊</div>
          </el-col>
          <el-col :span="16" class="text_left">
            <el-col :span="24" class="elCol-style" >
              <!-- <span style="width: 150px;">停止治疗原因：</span> -->
              <div class="flex_cs">
                <div>
                  <el-radio-group class="ml-10" v-model="TableForm.referral">
                    <el-radio label="1">1-否</el-radio>
                    <el-radio label="2">2-是</el-radio>
                  </el-radio-group>
                </div>
                <PFormInput class="mr-10">
                  <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.referral"></el-input>
                </PFormInput>
              </div>
            </el-col>
            <el-col :span="24" class="elCol-style" style="border-left:0px;margin-top: 8px;margin-bottom: 8px;">
              <span style="width: 130px;">转诊原因：</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.referral_reason"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="elCol-style" style="border-left:0px;margin-top: 8px;margin-bottom: 8px;">
              <span style="width: 130px;">转诊至机构及科室：</span>
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.referral_hospital_name"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" class="center">
            <div class="centerHeight">用药情况</div>
          </el-col>
          <el-col :span="16" class="text_left elColStyleDay">

                    <el-col :span="24" style="border-left: 0px">
                      <el-col :span="10" class="elCol-style elColStyleDay1">
                           <span style="width: 50px;">药物1</span>
                           <el-form-item>
                             <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.order_name_1" class="w100"></el-input>
                           </el-form-item>
                      </el-col>
                      <el-col :span="14">
                        <el-col :span="14" class="elCol-style elColStyleDay2">
                          <span>用法：每日(月)</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_1" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">次;</span>
                        </el-col>
                        <el-col :span="10" class="elCol-style elColStyleDay3">
                          <span>每次剂量</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_1" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">mg</span>
                        </el-col>
                      </el-col>
                    </el-col>
                    <el-col :span="24" style="border-left: 0px">
                      <el-col :span="10" class="elCol-style elColStyleDay1">
                           <span style="width: 50px;">药物2</span>
                           <el-form-item>
                             <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.order_name_2" class="w100"></el-input>
                           </el-form-item>
                      </el-col>
                      <el-col :span="14">
                        <el-col :span="14" class="elCol-style elColStyleDay2">
                          <span>用法：每日(月)</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_2" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">次;</span>
                        </el-col>
                        <el-col :span="10" class="elCol-style elColStyleDay3">
                          <span>每次剂量</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_2" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">mg</span>
                        </el-col>
                      </el-col>
                    </el-col>
                    <el-col :span="24" style="border-left: 0px">
                      <el-col :span="10" class="elCol-style elColStyleDay1">
                           <span style="width: 50px;">药物3</span>
                           <el-form-item>
                             <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.order_name_3" class="w100"></el-input>
                           </el-form-item>
                      </el-col>
                      <el-col :span="14">
                        <el-col :span="14" class="elCol-style elColStyleDay2">
                          <span>用法：每日(月)</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_3" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">次;</span>
                        </el-col>
                        <el-col :span="10" class="elCol-style elColStyleDay3">
                          <span>每次剂量</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_3" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">mg</span>
                        </el-col>
                      </el-col>
                    </el-col>
          </el-col>
        </el-row>

   <el-row>
          <el-col :span="8" class="center">
            <div class="centerHeight">用药指导</div>
          </el-col>
          <el-col :span="16" class="text_left elColStyleDay">

                    <el-col :span="24" style="border-left: 0px">
                      <el-col :span="10" class="elCol-style elColStyleDay1">
                           <span style="width: 50px;">药物1</span>
                           <el-form-item>
                             <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.guidance_order_name_1" class="w100"></el-input>
                           </el-form-item>
                      </el-col>
                      <el-col :span="14">
                        <el-col :span="14" class="elCol-style elColStyleDay2">
                          <span>用法：每日(月)</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.guidance_route_1" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">次;</span>
                        </el-col>
                        <el-col :span="10" class="elCol-style elColStyleDay3">
                          <span>每次剂量</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.guidance_medi_qty_1" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">mg</span>
                        </el-col>
                      </el-col>
                    </el-col>
                    <el-col :span="24" style="border-left: 0px">
                      <el-col :span="10" class="elCol-style elColStyleDay1">
                           <span style="width: 50px;">药物2</span>
                           <el-form-item>
                             <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.guidance_order_name_2" class="w100"></el-input>
                           </el-form-item>
                      </el-col>
                      <el-col :span="14">
                        <el-col :span="14" class="elCol-style elColStyleDay2">
                          <span>用法：每日(月)</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.guidance_route_2" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">次;</span>
                        </el-col>
                        <el-col :span="10" class="elCol-style elColStyleDay3">
                          <span>每次剂量</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.guidance_medi_qty_2" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">mg</span>
                        </el-col>
                      </el-col>
                    </el-col>
                    <el-col :span="24" style="border-left: 0px">
                      <el-col :span="10" class="elCol-style elColStyleDay1">
                           <span style="width: 50px;">药物3</span>
                           <el-form-item>
                             <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.guidance_order_name_3" class="w100"></el-input>
                           </el-form-item>
                      </el-col>
                      <el-col :span="14">
                        <el-col :span="14" class="elCol-style elColStyleDay2">
                          <span>用法：每日(月)</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.guidance_route_3" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">次;</span>
                        </el-col>
                        <el-col :span="10" class="elCol-style elColStyleDay3">
                          <span>每次剂量</span>
                          <el-form-item>
                            <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.guidance_medi_qty_3" class="w30"></el-input>
                          </el-form-item>
                          <span style="width: 30px;">mg</span>
                        </el-col>
                      </el-col>
                    </el-col>
          </el-col>
        </el-row>

        <el-row class="symptomsStyleBox">
          <el-col :span="8" style="border-right:0px ;">
            <div class="center lh105 symptomsStyle">
              康复措施
            </div>
          </el-col>
          <el-col :span="16" style="border-left:1px solid !important;">
            <div class="rowChildren center">
              <el-row :span="24" class="symptomsInput symptom">

                <el-col :span="24" class="text_left">
                  <PCheckbox class="pl-10" @childValInput="childVal" :readonly="readonly" :formKey="'recovery_measures'"
                    :checkboxOptions="symptomOptions" :checkboxForm="chObject.recovery_measures" :clearFlag="clearFlag" />
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>



        <el-row>
          <el-col class="center" :span="8">本次随访分类</el-col>
          <el-col :span="16" class="flex_cs">
            <div class="ml-10 text_left flex_c">
              <el-radio-group class="flex mt-5" v-model="TableForm.follow_up_classify">
                <el-radio label="1">1-不稳定</el-radio>
                <el-radio label="2">2-基本稳定</el-radio>
                <el-radio label="3">3-稳定</el-radio>
              </el-radio-group>
             <!-- <el-form-item>
                <el-input :readonly="readonly" v-model="TableForm.follow_up_classify" class="w90"></el-input>
              </el-form-item> -->
            </div>
            <PFormInput class="mr-10">
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_classify"></el-input>
            </PFormInput>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="center">
              <el-col :span="24">下次随访日期</el-col>

          </el-col>
          <el-col :span="16" class="text_left flex_c">
                <el-col :span="8">
                  <el-form-item class="w100">
                    <el-input @change="DateConversion('next_follow_up_date',$event)" v-if="!readonly" :readonly="readonly"
                      v-model="TableForm.next_follow_up_date"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" class="center">随访医生签名</el-col>
                <el-col :span="8">
                    <el-form-item class="w100">
                      <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.follow_up_doctor"></el-input>
                    </el-form-item>
                </el-col>
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
  import {
    mapGetters,
    mapActions
  } from "vuex";
  export default {
    name: "TuberculosisFirstPage",
    components: {},
    props: {},
    data() {
      return {
        // 是否只读
        readonly: false,
        readonlyStyle: false,
        // input最大个数
        maxLength: 0,
        // 状态 新增 查看 编辑  view edit
        status: this.$store.state.table.tableStatus,
        rsdt_name: "", //姓名
        pap_doc_no: "", //编号
        // 清空
        clearFlag: false,
        // 表单数据
        TableForm: {
            follow_up_date: '',//    随访日期
            follow_up_type: '',//本次随访形式
            lost_follow_up_reason: '',//若失访，原因
            death_date: '',//    死亡日期

            death_disease: '',// 死亡原因躯体疾病
            death_other: '',//死亡原因其他

            risk_assessment: '',//   危险性评估
            // symptom:'',//   目前症状
            insight: '',//   自知力
            sleep_situation: '',//   睡眠情况
            eating_situation: '',//  饮食情况
            cuisine: '',//   社会功能情况个人生活料理
            housework: '',// 社会功能情况家务劳动
            work: '',//  社会功能情况生产劳动及工作
            learning_ability: '',//  社会功能情况学习能力
            interpersonal: '',// 社会功能情况社会人际交往


            mild_nuisance: '',//危险行为轻度滋事
            accident: '',//危险行为肇事
            cause_disaster: '',//危险行为肇祸
            dther_harmful_behaviors: '',//其他危险行为
            self_injury: '',//危险行为自伤
            attempted_suicide: '',//危险行为自杀未遂
            risky_behavior: '',//    危险行为无


            lock_situation: '',//    两次随访期间关锁情况
            in_situation: '',//  两次随访期间住院情况
            out_date: '',//  两次随访期间住院情况末次出院时间
            laboratory_test: '',//   实验室检查
            compliance: '',//    用药依从性
            ADR: '',//   药物不良反应
            ADR_description: '',//  药物不良反应 有
            therapeutic_activity: '',//  治疗效果
            referral: '',//  是否转诊
            referral_reason: '',//   转诊原因
            referral_hospital_name: '',//    转诊至机构及科室
            order_name_1: '',//  用药情况药物1
            route_1: '',//   用药情况用法1
            medi_qty_1: '',//    用药情况每次剂量1
            order_name_2: '',//  用药情况药物2
            route_2: '',//   用药情况用法2
            medi_qty_2: '',//    用药情况每次剂量2
            order_name_3: '',//  用药情况药物3
            route_3: '',//   用药情况用法3
            medi_qty_3: '',//    用药情况每次剂量3
            guidance_order_name_1: '',// 用药指导药物1
            guidance_route_1: '',//  用药指导用法1
            guidance_medi_qty_1: '',//   用药指导每次剂量1
            guidance_order_name_2: '',// 用药指导药物2
            guidance_route_2: '',//  用药指导用法2
            guidance_medi_qty_2: '',//   用药指导每次剂量2
            guidance_order_name_3: '',// 用药指导药物3
            guidance_route_3: '',//  用药指导用法3
            guidance_medi_qty_3: '',//   用药指导每次剂量3
            // recovery_measures:'',// 康复措施
            follow_up_classify: '',//    本次随访分类
            follow_up_doctor: '',//  随访医生签名
            next_follow_up_date: ''//下次随访日期
        },
        symptomOptionsData: [{
            id: "1",
            content: "幻觉"
          },
          {
            id: "2",
            content: "交流困难"
          },
          {
            id: "3",
            content: "猜疑"
          },
          {
            id: "4",
            content: "喜怒无常"
          },
          {
            id: "5",
            content: "行为怪异"
          },
          {
            id: "6",
            content: "兴奋话多"
          },
          {
            id: "7",
            content: "伤人毁物"
          },
          {
            id: "8",
            content: "悲观厌世"
          },
          {
            id: "9",
            content: "无故外走"
          },
          {
            id: "10",
            content: "自语自笑"
          },
          {
            id: "11",
            content: "孤僻懒散"
          },
          {
            id: "12",
            content: "其他"
          }
        ],
        symptomOptions: [{
            id: "1",
            content: "生活劳动能力"
          },
          {
            id: "2",
            content: "职业训练"
          },
          {
            id: "3",
            content: "学习能力"
          },
          {
            id: "4",
            content: "社会交往"
          },
          {
            id: "5",
            content: "其他"
          }

        ],
        dangerousActData: [{
            id: "1",
            content: "轻度滋事次"
          },
          {
            id: "2",
            content: "肇事次"
          },
          {
            id: "3",
            content: "肇祸次"
          },
          {
            id: "4",
            content: "其他危害行为次"
          },
          {
            id: "5",
            content: "自伤次"
          },
          {
            id: "6",
            content: "自杀未遂次"
          },
          {
            id: "7",
            content: "无"
          }
        ],
        // --- checkbox Data ---
        chObject: {
          symptom: [{
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
            },
            {
              value: ""
            }

          ],
          recovery_measures: [{
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
          ]
        }

      };
    },

    computed: {
      ...mapGetters("table", ['BaseMesData'])
    },
    created() {
      if(this.TableForm.death_disease == 1){
        this.readonlyStyle = true;
      }else{
         this.readonlyStyle = false;
      }
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

        setTimeout(() => {
          this.initInput();
          this.addEnterListener();
        }, 10);
      },
      inputChange(){
        if(this.TableForm.death_disease == 1){
          this.readonlyStyle = true;
        }else{
           this.readonlyStyle = false;
        }
      },
      // 清空
      emptyData() {
        for (var obj in this.TableForm) {
          this.TableForm[obj] = ""
        };
        this.chObject = {

          symptom: [{
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
            },
            {
              value: ""
            }

          ],
          dosage_form: [{
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
          ]

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
        let temp = document.getElementById("elinput1");
        temp.focus();

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
        window.removeEventListener("keydown", this.listenEnterEvent);
        window.__completeEnterBind__ = false;
      },
      // dateConversion 日期转换
      DateConversion(val, e) {
        if (this.TableForm[val].length == 8) {
          this.TableForm[val] = dateConversion(this.TableForm[val]);
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
        // console.log("key", key);
        this.TableForm[key] = val;
        // console.log(`this.TableForm.${key}`, this.TableForm[key]);
      },
      inputTest(index, key, val) {
        // console.log("index", index);
        // console.log("key", key);
        // console.log("this.chObject[key]", this.chObject[key]);
        this.TableForm[key] = "";
        let temp = [];
        this.chObject[key].forEach(el => {
          if (el.value != "") {
            temp.push(el.value);
          }
        });
        temp = temp.join(",");
        this.TableForm[key] = temp;
      },
      textareaInput(e, key) {
        e = e.replace(/\n/g, "");
        if (e.trim() == "") {
          this.TableForm[key] = "";
        }
      },
      // 返显方法
      EchoMethod() {
        // console.log(
        //   "tableConfiguration**************",
        //   this.$store.state.table.tableConfiguration
        // );
        // console.log("表格状态99999999", this.$store.state.table.tableStatus);
        // console.log("this.BaseMesData", this.BaseMesData);

        this.pap_doc_no = this.BaseMesData.pap_doc_no; //编码
        this.rsdt_name = this.BaseMesData.rsdt_name; //姓名
        let tableConfiguration = {};
        if (this.status == "add") {
          return;
        }
        if (this.status == "view") {
          tableConfiguration = this.$store.state.table.viewTableConfiguration;
          // console.log("view数据返显", tableConfiguration);
        }
        if (this.status == "edit") {
          tableConfiguration = this.$store.state.table.tableConfiguration;
          // console.log("edit数据返显", tableConfiguration);
        }
        for (let obj in this.TableForm) {
          this.TableForm[obj] = tableConfiguration.editData[obj];
        }
        this.TableForm.table = "doc_flp_tbclss_follow_data";
        if(tableConfiguration.editChObject){
          let editChObject = JSON.parse(tableConfiguration.editChObject);
          // console.log("tableConfiguration.editChObject", editChObject);
          for (let obj in this.chObject) {
            this.chObject[obj] = editChObject[obj];
          }
        }
                // console.log("this.TableForm", this.TableForm);
        // console.log("this.chObject", this.chObject);
      }
    },
    watch: {
      "TableForm.death_disease": {
        handler: function(a,b){
          if(this.TableForm.death_disease == 1){
            this.readonlyStyle = true;
          }else{
             this.readonlyStyle = false;
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .lungTable {
    .symptomsInput {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .lh142 {
      height: 142px;
      line-height: 142px;
    }
    .lh105 {
      height: 105px;
      line-height: 105px;
    }

    .symptomsInput .el-input--medium .el-input__inner {
      width: 20px !important;
      height: 20px !important;
      padding: 0px !important;
      text-align: center;
      border-radius: 3px;

    }

    .symptomsStyle .el-col {
      border-left: 0px;
    }

    .symptomsStyleBox .el-col-16 {
      border-left: 0px;
    }

    .symptomsStyleBox .el-col-8 {
      border-right: 1px solid #000;
    }

    .el-row-boder .lh94-style {
      width: 100%;
      height: 90px;
      line-height: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .el-row-boder .lh64-style {
      width: 100%;
      height: 60px;
      line-height: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .elCol-style {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .elCol-style span {
      width: 100px;
      font-size: 14px;
    }

    .el-row-boder .el-col .el-row {
      border-right: 0px solid #000;
      border-left: 0px solid #000;

    }

    .el-row-boder .el-col .el-row-border-1 {
      border-right: 0px solid #000;
      border-left: 0px solid #000;
    }

    .el-row-boder .el-col .el-row-border-2 {
      border-top: 0px solid #000;
    }

    .centerHeight {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 81px;
    }

    .borderBottom {
      border-bottom: 0px !important;
    }
    .elColStyleDay .elCol-style{
      padding:0px 3px;
    }
    .dangerousAct{

    }
    .dangerousActFlex{
          display: block;
    }
    .elCol-style-box{
      width: 100%;
      float: left;
    }
    .floatLeft{
      float: left;
    }
  }
</style>
sss
