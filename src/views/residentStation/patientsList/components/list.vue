<template>
  <div class="list">
    <div class="list-top">
      <!--顶部筛选条件-->
      <div class="top-item1 clearfix">
        <span class="hos">
          <l-radio
            :radio="searchForm.radio"
            :selectDatas="statesList"
            @radioChange="radioChange"
          ></l-radio>
        </span>
        <el-select
          v-model="searchForm.valueJ"
          placeholder="请选择"
          style="width: 120px"
        >
          <el-option label="今日撤床" value="1"> </el-option>
          <el-option label="7天内撤床" value="2"> </el-option>
          <el-option label="撤床" value="3"> </el-option>
        </el-select>
        <el-select
          v-model="searchForm.value2"
          placeholder="请选择"
          style="width: 120px"
        >
          <el-option label="我的患者" value="1"> </el-option>
        </el-select>
        <el-select
          v-model="searchForm.value3"
          placeholder="请选择"
          style="width: 120px"
        >
          <el-option label="全部" value="1"> </el-option>
        </el-select>
        <el-input
          v-model="searchForm.keyWord"
          placeholder="住院号/姓名/床号1"
          style="width: 180px"
        >
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button class="button" @click="search" type="primary"
          >检索</el-button
        >
        <el-button class="button background-white" @click="search"
          >重置</el-button
        >
        <!--<el-button class="button">重置</el-button>-->
        <span class="list-style">
          <span
            :class="isList ? 'style-button' : 'style-button isactive'"
            :style="{
              'border-right': isList ? 'transparent' : '$l-color-border-2',
            }"
            @click="isList = false"
          >
            <i class="el-icon-menu"></i> </span
          ><span
            :class="!isList ? 'style-button' : 'style-button isactive'"
            :style="{
              'border-left': !isList ? 'transparent' : '$l-color-border-2',
            }"
            @click="isList = true"
          >
            <i class="iconfont iconpianyu"></i>
          </span>
        </span>
      </div>
      <!--患者列表筛选标签-->
      <el-card class="top-item2">
        <span class="cont" v-for="(item, i) in labelList" :key="item.id">
          <span>{{ item.type }}</span>
          <el-button
            v-for="(it, index) in item.list"
            :key="index"
            :class="it.isSelect ? 'button isactive' : 'button'"
            @click="handle_selectLabel(it)"
            >{{ it.name }} {{ it.num }}</el-button
          >
        </span>
      </el-card>
    </div>
    <!--患者列表-->
    <el-card v-if="isList" class="list-center">
      <div class="head">
        <div>卡片信息</div>
        <div class="head-before"></div>
      </div>
      <div class="lists">
        <!--患者列表-->
        <div class="infinite-list-wrapper">
          <div
            class="list"
            v-infinite-scroll="load"
            infinite-scroll-disabled="disabled"
          >
            <div
              v-for="(item, index) in patients"
              :key="index"
              @click="handle_selectPatient(index, item)"
              :class="
                index == currentPatient
                  ? 'lists-item clearfix active'
                  : 'lists-item clearfix'
              "
            >
              <el-popover placement="right" width="329" trigger="hover">
                <!--鼠标悬浮弹框-->
                <div class="hover-alert">
                  <el-row>
                    <el-col :span="12">
                      <span class="label">床号</span>
                      <span>{{ item.bedNum }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="label">住院号</span>
                      <span>{{ item.adNum }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <span class="label">姓名</span>
                      <span>{{ item.patientName }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="label">性别</span>
                      <span>{{ item.patientGender == 1 ? "男" : "女" }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <span class="label">年龄</span>
                      <span>{{ item.patientAge }}</span>
                    </el-col>
                    <el-col :span="12">
                      <span class="label">科室</span>
                      <span>泌尿外科</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">身份证号</span>
                      <span>{{ item.identificationNum }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">电话号码</span>
                      <span>{{ item.phoneNum }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">入院日期</span>
                      <span>{{ item.wdeptAdmissionTime }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">入院诊断</span>
                      <span>{{ item.admissionDiag }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">主治医生</span>
                      <span>{{ item.manageDoctorName }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">护理级别</span>
                      <span v-if="item.nursingLevel == '1'">Ⅰ级护理</span>
                      <span v-if="item.nursingLevel == '2'">Ⅱ级护理</span>
                      <span v-if="item.nursingLevel == '3'">Ⅲ级护理</span>
                      <span v-if="item.nursingLevel == '4'">特级护理</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">医保类型</span>
                      <span>本市城镇职工基本医疗保险</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">预交金</span>
                      <span>{{ item.selfPayPrepay }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">费用合计</span>
                      <span class="spec">{{ item.freeSum }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">自费金额</span>
                      <span class="spec">{{ item.selfPayAmount }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">过敏史</span>
                      <span class="spec">{{ item.allergyName }}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <span class="label">其他情况</span>
                      <span>无</span>
                    </el-col>
                  </el-row>
                </div>
                <div slot="reference">
                  <span class="label" v-if="item.isNew"> 新入 </span>
                  <div class="item item1">
                    <i>{{ item.bedNum | repair }} </i>床
                  </div>
                  <div class="item item2">
                    <i class="number" style="margin-right: 10px">{{
                      item.adNum
                    }}</i
                    ><i style="margin-right: 20px">{{ item.patientName }}</i
                    ><i style="margin-right: 20px">{{
                      item.patientGender == 1 ? "男" : "女"
                    }}</i
                    ><i>{{ item.patientAge }}</i>
                  </div>
                  <div class="item item3">
                    <el-row class="item-row">
                      <span
                        >主治医生<i>{{ item.manageDoctorName }}</i></span
                      >
                      <span
                        >主管护师<i>{{ item.executiveNurse }}</i></span
                      >
                      <span
                        >责任护师<i>{{ item.responsibilityNurse }}</i></span
                      >
                      <span
                        >入院时间<i>{{ item.wdeptAdmissionTime }}</i></span
                      >
                    </el-row>
                    <el-row class="item-row"
                      ><span
                        ><i style="margin-left: 0">{{
                          item.admissionDiag
                        }}</i></span
                      ></el-row
                    >
                  </div>
                  <!--    <div class="item item6 cursor-pointer" @click.stop="collection(item)">
                    <svg v-if="item.collection" t="1567059187730" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4150" width="22" height="22"><path d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z" fill="#FFD2C2" p-id="4151"></path><path d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z" fill="#F05A23" p-id="4152"></path></svg>
                    <svg v-else t="1567059500759" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4262" width="22" height="22"><path d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z" fill="#F5F5F5" p-id="4263"></path><path d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z" fill="#C5CBCF" p-id="4264"></path></svg>
                  </div>-->
                  <div class="item item5">
                    <i class="te" v-if="item.nursingLevel == '1'">Ⅰ</i>
                    <i class="te" v-if="item.nursingLevel == '2'">Ⅱ</i>
                    <i class="te" v-if="item.nursingLevel == '3'">Ⅲ</i>
                    <i class="te" v-if="item.nursingLevel == '4'">特</i>

                    <i class="pushi">普食</i>
                    <i class="die">跌</i>
                    <!--
                   <i class="er">II</i>
-->
                  </div>
                  <div class="item item4" v-if="item.childrenNum > 0">
                    <span v-for="it in item.childrenNum">
                      <i
                        class="iconfont iconyinger"
                        style="margin-left: 5px"
                      ></i>
                    </span>
                  </div>
                </div>
              </el-popover>
            </div>
            <p v-if="loading" class="bottom-container">加载中...</p>
            <p v-if="noMore" class="bottom-container">没有更多了</p>
          </div>
        </div>
      </div>
    </el-card>
    <!--患者卡片-->
    <div v-if="!isList" class="list-card clearfix">
      <el-row :gutter="26">
        <el-col :lg="9" :xl="6" v-for="(item, index) in patients" :key="index">
          <el-card
            :class="
              index == currentPatient
                ? 'list-card-item active'
                : 'list-card-item'
            "
            @click.native="handle_selectPatient(index, item)"
          >
            <span class="label" v-if="item.isNew"> 新入 </span>
            <!--  <div class="collection cursor-pointer" @click.stop="collection(item)">
            <svg v-if="item.collection" t="1567059187730" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4150" width="22" height="22"><path d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z" fill="#FFD2C2" p-id="4151"></path><path d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z" fill="#F05A23" p-id="4152"></path></svg>
            <svg v-else t="1567059500759" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4262" width="22" height="22"><path d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z" fill="#F5F5F5" p-id="4263"></path><path d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z" fill="#C5CBCF" p-id="4264"></path></svg>
          </div>-->
            <div class="title">
              <i class="item-color1">{{ item.bedNum | repair }}</i
              >床 <i class="item-color2">{{ item.adNum }}</i
              ><i class="item-color3">-49.50</i>
            </div>
            <div class="info">
              <span>
                {{ item.patientName
                }}<i style="font-style: normal; margin-left: 15px"
                  >{{ item.patientGender == 1 ? "男" : "女" }} </i
                ><i style="font-style: normal; margin-left: 15px">{{
                  item.patientAge
                }}</i>
              </span>
              <span
                ><i class="item-color">主治医生</i>
                {{ item.manageDoctorName }}</span
              >
              <span
                ><i class="item-color">诊断信息</i>
                {{ item.admissionDiag }}</span
              >
            </div>
            <div class="icons">
              <span class="te" v-if="item.nursingLevel == '1'">Ⅰ</span>
              <span class="te" v-if="item.nursingLevel == '2'">Ⅱ</span>
              <span class="te" v-if="item.nursingLevel == '3'">Ⅲ</span>
              <span class="te" v-if="item.nursingLevel == '4'">特</span>
              <span class="pushi">普食</span>
              <span class="babyicon" v-if="item.childrenNum > 0">
                <i
                  class="iconfont iconyinger"
                  style="margin-right: 5px"
                  v-for="i in item.childrenNum"
                ></i>
              </span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!--新生儿床位安排 弹框-->
    <el-dialog
      title="新生儿床位安排"
      class="addChildren"
      width="450px"
      :visible.sync="addChildrenBedVisible"
    >
      <el-form :model="form">
        <el-row>
          <el-col :span="12">
            <LFormtTitle label="临时名" labelWidth="52">
              <el-input v-model="form.name" style="line-height: 34px" />
            </LFormtTitle>
          </el-col>
          <el-col :span="12">
            <l-formt-title label="性别">
              <l-value-domain :code="1" :value="form.gender"></l-value-domain>
            </l-formt-title>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <LFormtTitle label="出生日期" labelWidth="64">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder=""
              >
              </el-date-picker>
            </LFormtTitle>
          </el-col>
          <el-col :span="12">
            <LFormtTitle label="出生时间" labelWidth="64">
              <el-time-picker v-model="form.birthTime" placeholder="">
              </el-time-picker>
            </LFormtTitle>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <LFormtTitle label="破膜日期" labelWidth="64">
              <el-date-picker
                v-model="form.RuptureDate"
                type="date"
                placeholder=""
              >
              </el-date-picker>
            </LFormtTitle>
          </el-col>
          <el-col :span="12">
            <LFormtTitle label="破膜时间" labelWidth="64">
              <el-time-picker v-model="form.RuptureTime" placeholder="">
              </el-time-picker>
            </LFormtTitle>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <LFormtTitle label="出生体重" labelWidth="52">
              <el-input
                v-model="form.weight"
                placeholder="单位/g"
                style="line-height: 36px"
              />
            </LFormtTitle>
          </el-col>
          <el-col :span="12">
            <LFormtTitle label="出生长度" labelWidth="52">
              <el-input
                v-model="form.height"
                placeholder="单位/cm"
                style="line-height: 36px"
              />
            </LFormtTitle>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <LFormtTitle label="妊娠周期" labelWidth="52">
              <el-input
                v-model="form.pregnancyCycle"
                placeholder="单位/周"
                style="line-height: 36px"
              />
            </LFormtTitle>
          </el-col>
          <el-col :span="12">
            <LFormtTitle label="妊娠天数" labelWidth="52">
              <el-input
                v-model="form.pregnancyDay"
                placeholder="单位/天"
                style="line-height: 36px"
              />
            </LFormtTitle>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <LFormtTitle label="分娩方式" labelWidth="52">
              <LValueDomain
                :code="2"
                :value="form.childbirthType"
              ></LValueDomain>
            </LFormtTitle>
          </el-col>
          <el-col :span="12">
            <LFormtTitle label="结果">
              <el-input v-model="form.res" style="line-height: 36px" />
            </LFormtTitle>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')"
          >确认添加</el-button
        >
        <el-button class="cancel" @click="addChildrenBedVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LRadio from "@/components/LRadioButton.vue";
import { getPatients } from "@/api/cis/resident/resident";
export default {
  name: "list",
  components: {
    LRadio
  },
  props: ["patients"],

  data() {
    return {
      loading: false, // 滑动加载状态
      noMore: false, // 滑动无数据时状态
      statesList: ["新入院", "在院", "预撤床", "撤床"], // 患者状态，

      searchForm: {
        radio: "在院",
        value2: "我的患者",
        value3: "全部",
        valueJ: "1",
        keyWord: "" //搜索框内容
      },
      isList: true, // 列表、卡片切换状态
      labelList: [
        // 患者列表 标签筛选
        {
          type: "病情",
          id: "a001",
          list: [
            {
              name: "正常",
              isSelect: false, // 当前属性是否被选中
              num: 2
            },
            {
              name: "重",
              isSelect: false,
              num: 0
            },
            {
              name: "危",
              isSelect: false,
              num: 0
            }
          ]
        },
        {
          type: "床位",
          id: "a002",
          list: [
            {
              name: "加床",
              isSelect: false, // 当前属性是否被选中
              num: 2
            },
            {
              name: "空床",
              isSelect: false,
              num: 0
            },
            {
              name: "占床",
              isSelect: false,
              num: 0
            }
          ]
        }
      ],
      addChildrenBedVisible: false, // 新生儿床位弹框显示
      form: {
        name: "", // 临时名
        gender: "", // 性别
        birthday: "", // 出生日期
        birthTime: "", // 出生时间
        RuptureDate: false, // 破膜日期
        RuptureTime: [], // 破膜时间
        weight: "", // 出生体重
        height: "", // 出生长度
        pregnancyCycle: "", // 妊娠周期
        pregnancyDay: "", // 妊娠天数
        childbirthType: "", // 分娩方式
        res: "" // 结果
      },
      rules: {
        // 添加新生儿床位验证规则
        name: [{ required: true, message: "请输入临时名", trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请选择出生日期",
            trigger: "change"
          }
        ],
        birthTime: [
          {
            type: "date",
            required: true,
            message: "请选择出生时间",
            trigger: "change"
          }
        ],
        RuptureDate: [
          {
            type: "date",
            required: true,
            message: "请选择破膜日期",
            trigger: "change"
          }
        ],
        RuptureTime: [
          {
            type: "date",
            required: true,
            message: "请选择破膜时间",
            trigger: "change"
          }
        ],
        weight: [{ required: true, message: "请填写体重", trigger: "blur" }],
        height: [{ required: true, message: "请填写身长", trigger: "blur" }],
        pregnancyCycle: [
          { required: true, message: "请填写妊娠周期", trigger: "blur" }
        ],
        pregnancyDay: [
          { required: true, message: "请填写妊娠天数", trigger: "blur" }
        ],
        childbirthType: [
          { required: true, message: "请选择分娩方式", trigger: "change" }
        ],
        res: [{ required: true, message: "请填写结果", trigger: "blur" }]
      },
      currentPatient: 0 // 当前选择的患者下标
    };
  },
  computed: {
    disabled() {
      // 滑动加载禁用状态
      return this.loading || this.noMore;
    }
  },
  filters: {
    repair(val) {
      // 床号小于0时，前面补0
      return val <= 9 ? "0" + val : val;
    }
  },
  methods: {
    /*搜索查询*/
    search() {
      this.$refs.applicat.initComponent(tab.name, this.params);
    },
    /*点击入院情况radio*/
    radioChange(data) {
      this.searchForm.radio = data;
      this.search();
    },
    handle_selectLabel(item) {
      item.isSelect = !item.isSelect;
    },
    handle_selectPatient(index, item) {
      // 选择患者
      this.currentPatient = index;
      this.patientInfo = item;
      this.$emit("patientInfo", this.patientInfo);
    },
    load() {
      // 滑动到底部加载
      this.loading = true;
      try {
        this.count += 2;

        // 加载完成后需要将loading置成fale, try catch中错误处理也要考虑
        this.loading = false;
        // 通常异步操作完成后会根据返回值设定noMore
        this.noMore = this.count >= 20;
      } catch (e) {
        this.count -= 2;
        // 加载完成后需要将loading置成fale, try catch中错误处理也要考虑
        this.loading = false;
        // 通常异步操作完成后会根据返回值设定noMore
        this.noMore = this.count >= 20;
      }
    },
    collection(item) {
      // 收藏按钮点击
      item.collection = !item.collection;
    },
    async submitForm(formName) {
      // 添加新生儿床位提交表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          try {
            alert("submit!");
          } catch (e) {}
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>


<style scoped lang="scss">
.el-button--primary,
.el-button--default {
  font-size: 14px;
  padding: 5px 10px;
}

i {
  font-style: normal;
}

.list {
  height: 100%;
  .list-top {
    margin-bottom: 20px;

    .top-item1 {
      padding: 0px 0 20px 15px;

      .hos {
        display: inline-block;

        span {
          width: 58px;
          height: 36px;
          margin-right: 7px;
          font-size: 14px;

          font-weight: 400;
          text-align: center;
          color: rgba(148, 157, 163, 1);
          line-height: 36px;
          display: inline-block;
          cursor: pointer;
        }

        .isactive {
          width: 58px;
          height: 36px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          font-size: 14px;

          font-weight: bold;
          text-align: center;
          color: $l-color-primary;
          line-height: 36px;
        }
      }

      .button {
        width: 80px;
        height: 36px;
        margin-left: 10px;
        background: $l-color-primary;
        border-radius: 2px;
        font-size: 14px;

        font-weight: 500;
        color: $l-color-white;
      }

      .list-style {
        float: right;
        display: inline-block;

        .style-button {
          display: inline-block;
          font-size: 20px;
          line-height: 36px;
          text-align: center;
          width: 36px;
          height: 36px;
          box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          border: 1px solid transparent;
          background-color: $l-color-white;
          cursor: pointer;
          color: $l-color-primary;
        }
        .isactive {
          border: 1px solid $l-color-border-2;
          border-radius: 2px;
          background: transparent;
          cursor: default;
          color: #d4d9dc;
        }
      }
    }

    .top-item2 {
      height: 60px;
      padding: 12px 20px;
      background: $l-color-white;
      border-radius: 2px;

      .cont {
        margin-right: 40px;
        display: inline-block;

        span {
          width: 28px;
          height: 36px;
          font-size: 14px;

          font-weight: bold;
          color: rgba(148, 157, 163, 1);
          line-height: 36px;
          display: inline-block;
        }

        .button {
          width: 54px;
          height: 24px;
          background: $l-color-bgcolor-14;
          border-radius: 18px;
          font-size: 12px;

          font-weight: 400;
          color: $l-color-fontcolor-4;
          border: none;
        }

        .button.isactive {
          background: $l-color-bgcolor-13;
          font-weight: 400;
          color: $l-color-primary;
        }
      }
    }
  }

  .list-center {
    padding-top: 20px;
    height: calc(100% - 138px);
    .head {
      height: 24px;
      margin-bottom: 20px;
      font-size: 16px;

      font-weight: 500;
      color: rgba(46, 50, 58, 1);
      line-height: 24px;
      position: relative;
      left: 35px;

      .head-before {
        width: 4px;
        height: 20px;
        background: $l-color-primary;
        position: absolute;
        left: -10px;
        top: 0;
      }
    }

    .lists {
      height: 100%;
      border-top: 1px solid $l-color-bgcolor-11;

      .lists-item {
        padding: 20px 0;
        border-bottom: 1px solid $l-color-bgcolor-11;
        position: relative;
        .label {
          position: absolute;
          left: 0;
          top: 0;
          width: 44px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background: $l-color-bgcolor-18;
          font-size: 12px;

          font-weight: 500;
          color: $l-color-primary1;
        }
        .item {
          float: left;
          border-right: 1px solid $l-color-text-secondary;
          text-align: left;
        }
        .item1 {
          height: 36px;
          margin-left: 64px;
          padding-right: 10px;
          font-size: 14px;
          font-weight: bold;

          color: $l-color-fontcolor-3;

          i {
            display: inline-block;
            font-size: 36px;

            color: $l-color-fontcolor-3;
            line-height: 36px;
          }
        }

        .item2 {
          height: 36px;
          padding: 0 20px 0 10px;

          i {
            display: inline-block;
            height: 20px;
            font-size: 14px;

            font-weight: 400;
            color: $l-color-fontcolor-3;
            line-height: 36px;
          }

          .number {
            font-size: 16px;

            font-weight: bold;
            color: $l-color-fontcolor-2;
          }
        }

        .item3 {
          padding-left: 20px;
          border: none;

          .item-row {
            height: 18px;
            line-height: 18px;

            span {
              margin-right: 28px;
              display: inline-block;
              font-size: 12px;

              font-weight: 400;
              color: $l-color-fontcolor-4;

              i {
                color: $l-color-fontcolor-3;
                margin-left: 10px;
              }
            }
          }
        }

        .item4 {
          height: 36px;
          padding-right: 20px;
          text-align: center;
          line-height: 36px;
          color: $l-color-border-6;
          float: right;
          i {
            font-size: 18px;
          }
        }

        .item5 {
          height: 36px;
          padding: 8px 15px 0 20px;
          float: right;
          i {
            height: 20px;
            margin-right: 5px;
            font-size: 12px;

            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
            text-align: center;
            display: inline-block;
          }

          .te {
            width: 20px;
            background-color: $l-color-bgcolor-15;
          }

          .pushi {
            width: 32px;
            background-color: $l-color-bgcolor-16;
          }
        }

        .item6 {
          height: 36px;
          float: right;
          padding: 7px 20px 0 20px;
          border: none;
          span {
            display: inline-block;
            width: 22px;
            height: 22px;
            background-color: $l-color-bgcolor-17;
          }
        }
      }

      .lists-item.active {
        background: $l-color-bgcolor-13;

        .item {
          border-right: 1px solid $l-color-bgcolor-17;
        }
        .item6 {
          border: none;
        }
        .item3 {
          border: none;
        }
      }
    }
  }

  .list-card {
    margin-top: 20px;

    .list-card-item {
      border: 2px solid transparent;
      position: relative;
      width: 287px;
      height: 253px;
      border-radius: 4px;
      padding: 47px 0 0 20px;
      font-size: 16px;

      font-weight: bold;
      color: $l-color-fontcolor-3;
      margin-bottom: 20px;
      /*line-height: 24px;*/
      .label {
        position: absolute;
        left: 0;
        top: 0;
        width: 44px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: $l-color-bgcolor-18;
        font-size: 12px;

        font-weight: 500;
        color: $l-color-primary1;
      }
      .collection {
        position: absolute;
        right: 10px;
        top: 10px;
      }
      .title {
        margin-bottom: 20px;

        .item-color1 {
          font-size: 38px;

          font-weight: bold;
        }

        .item-color2 {
          padding-left: 5px;
          margin-right: 25px;
          border-left: 1px solid $l-color-bgcolor-11;
          display: inline-block;
          font-size: 18px;

          font-weight: bold;
          color: $l-color-fontcolor-2;
          /*line-height:23px;*/
        }

        .item-color3 {
          height: 18px;
          font-size: 18px;

          font-weight: bold;
          color: $l-color-primary;
          /*line-height:23px;*/
        }
      }

      .info {
        margin-bottom: 30px;
        font-size: 16px;

        font-weight: 400;
        color: $l-color-fontcolor-3;
        /*line-height:24px;*/
        span {
          display: block;
          margin-top: 10px;

          .item-color {
            color: $l-color-fontcolor-4;
          }
        }
      }

      .icons {
        font-size: 12px;

        font-weight: 400;
        color: $l-color-white;

        .te {
          width: 20px;
          height: 20px;
          display: inline-block;
          background-color: $l-color-bgcolor-15;
          text-align: center;
          line-height: 20px;
        }

        .pushi {
          width: 40px;
          height: 20px;
          margin-right: 10px;
          display: inline-block;
          background-color: $l-color-bgcolor-16;
          text-align: center;
          line-height: 20px;
        }

        .babyicon {
          border-left: 1px solid $l-color-bgcolor-11;
          color: $l-color-border-6;
          padding-left: 10px;
        }
      }
    }
    .active {
      border: 2px solid $l-color-primary;
    }
  }
}
// 悬浮弹框
.hover-alert {
  color: $l-color-fontcolor-3;
  .el-row {
    line-height: 30px;
  }
  .label {
    display: inline-block;
    width: 56px;
    margin-right: 5px;
    color: $l-color-fontcolor-4;
  }
  .spec {
    color: $l-color-primary;
  }
}
.addChildren {
  .el-button--primary,
  .el-button--default {
    font-size: 14px;
    height: 36px;
    width: 80px;
    border-radius: 2px;
  }
  .cancel {
    border: 1px solid $l-color-primary;
    color: $l-color-primary;
  }
  .el-row {
    margin-top: 20px;
    .el-col {
      width: 200px;
    }
    .el-col:last-child {
      margin-left: 10px;
    }
  }
}
.infinite-list-wrapper {
  height: 100%;
  text-align: center;
  overflow: auto;
}
.bottom-container {
  text-align: center;
  padding: 20px 0px;
}

.background-white {
  background-color: #fff !important;
  color: rgba(240, 90, 35, 1) !important;
}

.die {
  width: 20px;
  height: 20px;
  background: rgba(61, 125, 251, 1);
  border-radius: 2px;
}

.er {
  width: 20px;
  height: 20px;
  background: rgba(247, 168, 32, 1);
  border-radius: 2px;
}
</style>

