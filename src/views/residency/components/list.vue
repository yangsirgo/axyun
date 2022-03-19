<template>
  <div class="list">
    <div ref="top" class="list-top">
      <div class="top-item1 clearfix">
        <div style="display: inline-block;float: left;width:90%">
          <span class="hos">
            <l-radio :radio="searchForm.radio" :selectDatas="selectDatas" @radioChange="radioChange"></l-radio>
          </span>
          <el-select v-model="searchForm.value1" :placeholder="$t('residency.pleaseSelect')" style="width:120px">
            <el-option
              label="今日撤床"
              value="1">
            </el-option>
          </el-select>
          <el-select v-model="searchForm.value2" :placeholder="$t('residency.pleaseSelect')" style="width:120px">
            <el-option
              label="我的患者"
              value="1">
            </el-option>
          </el-select>
          <el-select v-model="searchForm.value3" :placeholder="$t('residency.pleaseSelect')" style="width:120px">
            <el-option
              label="全部"
              value="1">
            </el-option>
          </el-select>
          <el-input v-model="searchForm.value4" :placeholder="$t('residency.input')" style="width:180px">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
          <el-button class="button" @click="search">{{$t('residency.search')}}</el-button>
          <el-button class="button button-reset" @click="reset">{{$t('residency.reset')}}</el-button>
        </div>
        <span class="list-style">
          <el-button type="primary" icon="el-icon-menu" class="style-button" @click="isList = true"></el-button>
          <el-button type="primary" icon="el-icon-menu" class="style-button" @click="isList = false"></el-button>
        </span>
      </div>
      <el-card class="top-item2">
        <span class="cont">
          <span>{{$t('residency.illState')}}</span>
          <el-button
            :class="{'button':true,'isactive':overView.illState.normal>0}">{{$t('residency.normal')}} {{overView.illState.normal}}</el-button>
          <el-button
            :class="{'button':true,'isactive':overView.illState.danger>0}">{{$t('residency.danger')}} {{overView.illState.danger}}</el-button>
          <el-button
            :class="{'button':true,'isactive':overView.illState.serious>0}">{{$t('residency.serious')}} {{overView.illState.serious}}</el-button>
        </span>
        <span class="cont">
          <span>{{$t('residency.nursing')}}</span>
          <el-button
            :class="{'button':true,'isactive':overView.nursing.one>0}">{{$t('residency.oneLevel')}} {{overView.nursing.one}}</el-button>
          <el-button
            :class="{'button':true,'isactive':overView.nursing.two>0}">{{$t('residency.twoLevel')}} {{overView.nursing.two}}</el-button>
          <el-button
            :class="{'button':true,'isactive':overView.nursing.three>0}">{{$t('residency.threeLevel')}} {{overView.nursing.three}}</el-button>
          <el-button
            :class="{'button':true,'isactive':overView.nursing.special>0}">{{$t('residency.specialLevel')}} {{overView.nursing.special}}</el-button>
        </span>
        <span class="cont" style="border: none">
          <span>{{$t('residency.nursing')}}</span>
          <el-button
            :class="{'button':true,'isactive':overView.bedState.addBed>0}">{{$t('residency.addBed')}} {{overView.bedState.addBed}}</el-button>
          <el-button
            :class="{'button':true,'isactive':overView.bedState.emptyBed>0}">{{$t('residency.emptyBed')}} {{overView.bedState.emptyBed}}</el-button>
          <el-button
            :class="{'button':true,'isactive':overView.bedState.inBed>0}">{{$t('residency.inBed')}} {{overView.bedState.inBed}}</el-button>
        </span>
      </el-card>
    </div>

    <el-card v-if="isList" class="list-center">
      <div class="head">
        <l-card-title>
          <template slot="left">{{$t('residency.cardInfo')}}</template>
        </l-card-title>
      </div>
      <div class="lists">
        <!--卡片列表-->
        <div class="infinite-list-wrapper">
          <div v-infinite-scroll="load" infinite-scroll-disabled="disabled">
            <div v-for="(item,index) in patientsList"
                 :key="index"
                 :class="{'lists-item':true,'clearfix':true,'active':item.isListClick}"
                 @click="listClick(index)"
            >
              <div class="item item0" v-if="item.CheckinDays<=20">{{$t('residency.newIn')}}</div>
              <div class="item item1">
                <i>{{item.patientBedNo}}</i> {{$t('residency.bed')}}
              </div>
              <div class="item item2">
                <i class="number" style="margin-right:10px">{{item.patientId}}</i><i style="margin-right:20px">{{item.patientName}}</i><i
                style="margin-right:20px">{{item.patientGender}}</i><i>{{item.patientAge}}{{$t('residency.age')}}</i>
              </div>
              <div class="item item3" style="width:33%">
              <span class="item-row">
                <span>{{$t('residency.visitingStaff')}}<i>{{item.visitingStaff}}</i></span>
                <span>{{$t('residency.visitingNurse')}}<i>{{item.visitingNurse}}</i></span>
                <span>{{$t('residency.dutyNurse')}}<i>{{item.dutyNurse}}</i></span>
                <span><i style="margin-left: 0">{{item.illness}}</i></span>
              </span>
              </div>
              <div class="item item4">
                <i class="iconfont iconyinger" v-for="(value,key) in item.newBorn" :key="key"></i>
              </div>
              <div class="item item5">
                <i class="te">特</i>
                <i class="die">跌</i>
                <i class="er">Ⅱ</i>
                <i class="pushi">普食</i>
              </div>
              <div class="item item6" style="border:none">
                <svg v-if="item.attention" t="1566890347229" class="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" p-id="27494" width="22" height="22">
                  <path
                    d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z"
                    fill="#FFD2C2" p-id="27495"></path>
                  <path
                    d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z"
                    fill="#F05A23" p-id="27496"></path>
                </svg>
                <svg v-if="!item.attention" t="1566890367341" class="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" p-id="27606" width="22" height="22">
                  <path
                    d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z"
                    fill="#F5F5F5" p-id="27607"></path>
                  <path
                    d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z"
                    fill="#C5CBCF" p-id="27608"></path>
                </svg>
              </div>
            </div>
            <p v-if="loading" class="bottom-container">{{$t('residency.loadInfo')}}</p>
            <p v-if="noMore" class="bottom-container">{{$t('residency.noMore')}}</p>
          </div>
        </div>
      </div>
    </el-card>
    <div v-if="!isList" class="list-card clearfix">
      <div v-for="(item,index) in patientsList"
           :key="index"
           :class="{'lists-item':true,'clearfix':true,'active':item.isListClick}"
           @click="listClick(index)">
        <el-card class="list-card-item">
          <div class="new-in" v-if="item.CheckinDays<=20">{{$t('residency.newIn')}}</div>
          <div class="attent" style="border:none">
            <svg v-if="item.attention" t="1566890347229" class="icon" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" p-id="27494" width="22" height="22">
              <path
                d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z"
                fill="#FFD2C2" p-id="27495"></path>
              <path
                d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z"
                fill="#F05A23" p-id="27496"></path>
            </svg>
            <svg v-if="!item.attention" t="1566890367341" class="icon" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" p-id="27606" width="22" height="22">
              <path
                d="M509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0z"
                fill="#F5F5F5" p-id="27607"></path>
              <path
                d="M434.189964 48.779636l-104.727273 224.581819c-4.933818 9.867636-12.334545 17.221818-22.155636 17.221818l-237.009455 36.445091A81.687273 81.687273 0 0 0 4.435782 383.208727a92.625455 92.625455 0 0 0 19.642182 90.112l173.614545 175.848728c7.354182 7.400727 9.774545 17.221818 7.354182 29.044363l-41.332364 246.272c-4.887273 33.978182 7.400727 66.001455 36.398546 85.224727 14.754909 9.355636 31.464727 14.289455 48.174545 14.289455 13.312 0 26.530909-2.932364 39.842909-9.867636l212.433455-117.201455a21.085091 21.085091 0 0 1 12.288-3.444364c4.421818 0 8.378182 0.930909 12.288 3.444364l212.386909 117.201455c12.334545 7.447273 27.042909 9.867636 38.865454 9.867636 17.221818 0 34.443636-4.933818 48.686546-14.754909 26.996364-19.735273 41.285818-51.246545 34.443636-85.224727l-41.332363-248.738909c-2.466909-9.867636 2.466909-22.155636 9.821091-29.044364l171.10109-173.381818c22.155636-24.669091 31.976727-58.647273 19.688728-90.158546-9.821091-31.511273-36.398545-53.666909-65.908364-56.133818l-236.962909-36.445091a31.278545 31.278545 0 0 1-22.155636-17.221818l-108.171637-224.116364C571.359418 19.223273 541.8496 0 509.872873 0c-31.930182 0-60.974545 17.221818-75.682909 48.779636zM265.648873 973.405091A37.469091 37.469091 0 0 1 248.240873 977.454545a43.613091 43.613091 0 0 1-23.272728-7.028363c-12.101818-8.052364-17.733818-21.736727-15.220363-39.237818l41.146182-245.294546a75.357091 75.357091 0 0 0-20.340364-69.585454L57.218327 440.645818c-9.588364-10.519273-13.312-27.694545-8.378182-43.566545a34.816 34.816 0 0 1 28.57891-24.017455l234.309818-36.026182c27.508364-1.722182 47.476364-19.083636 59.345454-42.868363l105.285818-225.745455a35.653818 35.653818 0 0 1 33.512728-21.876363c13.777455 0 27.182545 8.657455 33.838545 22.434909l108.171637 224.116363c11.264 22.621091 29.602909 36.352 52.736 42.170182l241.198545 37.282909c13.544727 1.256727 24.296727 10.333091 28.532364 24.017455 6.050909 15.825455 2.327273 31.650909-9.821091 45.149091l-169.658182 171.799272c-18.152727 16.896-28.532364 46.173091-21.876364 73.076364l40.587637 245.061818c3.258182 16.384-2.420364 30.114909-15.918546 39.936a38.958545 38.958545 0 0 1-21.271273 5.864727 31.837091 31.837091 0 0 1-14.894545-3.211636l-213.876364-118.085818a66.001455 66.001455 0 0 0-34.769454-9.216c-12.706909 0-25.227636 3.025455-36.445091 10.146909l-210.757818 116.317091z"
                fill="#C5CBCF" p-id="27608"></path>
            </svg>
          </div>
          <div class="title"><i class="item-color1">{{item.patientBedNo}}</i>{{$t('residency.bed')}}
            <i class="item-color2">{{item.patientId}}</i>
            <i class="item-color3">-49.50</i></div>
          <div class="info">
            <span>
              {{item.patientName}}<i style="font-style: normal;margin-left: 15px">{{item.patientGender}}</i><i
              style="font-style: normal;margin-left: 15px">{{item.patientAge}}{{$t('residency.age')}}</i>
            </span>
            <span><i class="item-color">{{$t('residency.visitingStaff')}}</i> {{item.visitingStaff}}</span>
            <span><i class="item-color">{{$t('residency.dialog')}}</i> {{item.illness}}</span>
          </div>
          <div class="icons">
            <span class="te">特</span>
            <span class="pushi">普食</span>
            <span class="die">跌</span>
            <span class="er">Ⅱ</span>
            <span class="babyicon">
              <i class="iconfont iconyinger"
                 v-for="(value,key) in item.newBorn"
                 :key="key">
              </i>
            </span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  import LRadio from '@/components/LRadioButton.vue';

  export default {
    name: "list",
    components: {
      LRadio
    },
    data() {
      return {
        isList: true,
        selectDatas: ['新入院', '在院', '预撤床', '撤床'],
        loading: false,
        noMore: false,
        patientsList: [
          // {
          //   patientId: '123123',//患者id
          //   patientName: '李小芬',//姓名
          //   patientBedNo: '04',//患者床号
          //   patientGender: '女',//患者性别
          //   patientAge: 20,//患者年龄
          //   visitingStaff: '张扬',//主治医师
          //   visitingNurse: '朱芬',//主管护师
          //   dutyNurse: '刘素芬',//责任护师
          //   CheckinDate: '2019-04-14',//入院日期
          //   CheckinDays: 10,//入院天数
          //   illness: '肾结石',//患病
          //   newBorn: 2,//新生儿个数
          //   attention: 1,//收藏
          //   tag: ['特', '普食'],//标识
          //   isListClick: false//是否被点击
          // }
        ],
        //根据条件渲染列表
        searchForm: {
          radio: '在院',
          value1: '今日撤床',
          value2: '患者',
          value3: '全部',
          value4: '',//搜索框内容
          page: 1,//页数
          limit: 5//每页条数
        },
        total: 0,//总页数
        //总览各种病情人数、各种护理人数、各种床位人数
        overView: {
          illState: {//病情
            normal: 0,
            danger: 2,
            serious: 0
          },
          nursing: {//护理级别
            one: 2,
            two: 1,
            three: 0,
            special: 0
          },
          bedState: {//床位
            addBed: 0,
            emptyBed: 1,
            inBed: 5
          }
        }
      }
    },
    computed: {
      disabled() {
        return this.loading || this.noMore;
      }
    },
    created() {
      // this.geiLists();
    },
    methods: {
      /*点击列表某一项*/
      listClick(index) {
        for (let i in this.patientsList) {
          this.patientsList[i].isListClick = false;
        }
        this.patientsList[index].isListClick = true;
        this.$emit('getPatientId', this.patientsList[index].patientId);
      },
      /*获取列表*/
      geiLists() {
        this.$showLoading();
        /*获取列表接口*/
        // (传参：this.searchForm)
        this.patientsList = [
          {
            patientId: '123123',//患者id
            patientName: '李小芬',//姓名
            patientBedNo: '04',//患者床号
            patientGender: '女',//患者性别
            patientAge: 20,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-04-14',//入院日期
            CheckinDays: 10,//入院天数
            illness: '肾结石',//患病
            newBorn: 2,//新生儿个数
            attention: 1,//收藏
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          },
          {
            patientId: '321321',//患者id
            patientName: '李大芬',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          }
        ];
        this.total = 10;
        /*获取总览接口*/
        try {
          this.$hideLoading();
        } catch (error) {
          this.$hideLoading();
          this.$message.error(error.msg || "标准错误提示");
        }
      },
      /*搜索查询*/
      search() {
        this.geiLists();
      },
      /*重置*/
      reset() {
        this.searchForm = {
          radio: '在院',
          value1: '',
          value2: '',
          value3: '',
          value4: ''
        };
      },
      /*点击入院情况radio*/
      radioChange(data) {
        this.searchForm.radio = data;
        this.search();
      },
      load() {
        this.loading = true;
        setTimeout(() => {
          let patientsList = [...this.patientsList];

          patientsList.push({
            patientId: '321321',//患者id
            patientName: '222222',//姓名
            patientBedNo: '05',//患者床号
            patientGender: '男',//患者性别
            patientAge: 15,//患者年龄
            visitingStaff: '张扬',//主治医师
            visitingNurse: '朱芬',//主管护师
            dutyNurse: '刘素芬',//责任护师
            CheckinDate: '2019-05-25',//入院日期
            CheckinDays: 20,//入院天数
            illness: '产妇',//患病
            newBorn: 1,//新生儿个数
            attention: 0,//关注
            tag: ['特', '普食'],//标识
            isListClick: false//是否被点击
          });
          this.patientsList = [...patientsList];

          // 加载完成后需要将loading置成fale, try catch中错误处理也要考虑
          this.loading = false;
          // 通常异步操作完成后会根据返回值设定noMore
          this.noMore = this.patientsList.length >= this.total;
        }, 2000);
      }
    }
  }
</script>


<style scoped lang="scss">
  .infinite-list-wrapper {
    height: 100%;
    /*text-align: center;*/
    overflow: auto;
  }

  .list-item {
    width: 100%;
    padding: 20px 0;
    margin-bottom: 5px;
    background: #fff6f6;
    color: #ff8484;
  }

  .bottom-container {
    text-align: center;
    padding: 20px 0px;
  }


  .el-button--primary, .el-button--default {
    font-size: 14px;
    padding: 5px 10px;
  }

  i {
    font-style: normal;
  }

  .list {
    height: 100%;

    .list-top {
      height: 14%;
      margin-right: 20px;

      .top-item1 {
        padding-left: 15px;

        .hos {
          margin-bottom: 10px;
          display: inline-block;

          span {
            width: 42px;
            height: 30px;
            margin-right: 15PX;
            font-size: 14px;

            font-weight: 400;
            text-align: center;
            color: rgba(148, 157, 163, 1);
            line-height: 30px;
            display: inline-block;
          }
        }

        .button {
          width: 80px;
          height: 36px;
          margin-left: 10px;
          margin-bottom: 10px;
          background: $l-color-primary;
          border-radius: 2px;
          font-size: $l-font-size;

          font-weight: 500;
          color: $l-color-white;
        }

        .button-reset {
          background: $l-color-white;
          border: 1px solid $l-color-primary;

          color: $l-color-primary;
        }

        .list-style {
          float: right;
          display: inline-block;

          .style-button {
            width: 36px;
            height: 36px;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
            border-radius: 2px;
            margin: 0;
          }
        }
      }

      .top-item2 {
        margin-bottom: 20px;
        padding: 12px 10px 0 0;
        background: $l-color-white;
        border-radius: 2px;

        .cont {
          margin-bottom: 10px;
          padding-right: 20px;
          padding-left: 20px;
          display: inline-block;
          border-right: 1px solid $l-color-bgcolor-11;

          span {
            width: 28px;
            margin-right: 10px;
            font-size: 14px;

            font-weight: bold;
            color: rgba(148, 157, 163, 1);
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
      height: 86%;
      padding-top: 20px;
      margin-right: 20px;

      .head {
        margin-left: 20px;
      }

      .lists {
        height: calc(100% - 63px);
        border-top: 1px solid $l-color-bgcolor-11;

        .lists-item {
          padding: 20px 0 10px 64px;
          border-bottom: 1px solid $l-color-bgcolor-11;
          position: relative;

          .item {
            margin-bottom: 10px;
            float: left;
            border-right: 1px solid $l-color-text-secondary;
          }

          .item0 {
            width: 44px;
            height: 24px;
            border: none;
            background: $l-color-bgcolor-14;
            font-size: $l-font-size-min;

            font-weight: 500;
            line-height: 24px;
            color: $l-color-primary;
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;
          }

          .item1 {
            height: 36px;
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
            margin-right: 40px;
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
            line-height: 36px;

            i {
              margin-right: 10px;
              display: inline-block;
              color: $l-color-border-6;
            }
          }

          .item5 {
            height: 36px;
            padding: 8px 15px 0 20px;

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

            .die {
              width: 20px;
              background-color: $l-color-fontcolor-2;
            }

            .pushi {
              width: 40px;
              background-color: $l-color-bgcolor-16;
            }

            .er {
              width: 20px;
              background-color: $l-color-border-6;
            }
          }

          .item6 {
            height: 36px;
            padding: 7px 20px 0 20px;

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

          .item0 {
            background: $l-color-white;
            border: none;
          }

          .item3 {
            border: none;
          }
        }
      }
    }

    .list-card {
      height: 86%;
      overflow-y: auto;
      /*margin-top: 20px;*/

      .lists-item {
        float: left;
        margin: 0 18px 18px 0;
        border: 2px solid transparent;

        .list-card-item {
          width: 287px;
          height: 283px;
          border-radius: 4px;
          padding: 47px 0 0 20px;
          font-size: 16px;

          font-weight: bold;
          color: $l-color-fontcolor-3;
          position: relative;
          /*line-height: 24px;*/
          .new-in {
            width: 44px;
            height: 24px;
            border: none;
            background: $l-color-bgcolor-14;
            font-size: $l-font-size-min;

            font-weight: 500;
            line-height: 24px;
            color: $l-color-primary;
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;
          }

          .attent {
            height: 36px;
            position: absolute;
            top: 10px;
            right: 10px;

            span {
              display: inline-block;
              width: 22px;
              height: 22px;
              background-color: $l-color-bgcolor-17;
            }
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
              margin-right: 5px;
              display: inline-block;
              background-color: $l-color-bgcolor-16;
              text-align: center;
              line-height: 20px;
            }

            .die {
              width: 20px;
              height: 20px;
              margin-right: 5px;
              display: inline-block;
              background-color: $l-color-fontcolor-2;
              text-align: center;
              line-height: 20px;
            }

            .er {
              width: 20px;
              height: 20px;
              margin-right: 10px;
              display: inline-block;
              background-color: $l-color-border-6;
              text-align: center;
              line-height: 20px;
            }

            .babyicon {
              padding-left: 10px;
              border-left: 1px solid $l-color-bgcolor-11;
              display: inline-block;
              color: $l-color-primary1;

              i {
                display: inline-block;
                margin-right: 5px;
              }
            }
          }
        }
      }

      .lists-item.active {
        border: 2px solid $l-color-primary1;

        .list-card-item {

        }
      }
    }
  }
</style>
