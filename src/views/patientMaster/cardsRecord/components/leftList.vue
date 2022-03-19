<template>
  <div class="leftList height100">
    <l-table
      :paginationSmall="true"
      :total="pagination.total"
      :pageSize.sync="pagination.pageSize"
      :page.sync="pagination.currentPage"
      :layout="layout"
      :pagerCount="5"
      paginationAlign="center"
      :singlePageShow="true"
      @changeSize="changeSize"
    >
      <el-table
        :data="patientList"
        ref="multipleTable"
        border
        highlight-current-row
        height="100%"
        @row-click="rowClick"
        v-loading="loading"
      >
        <el-table-column
          prop="patientName"
          label="患者姓名"
          min-width="80"
          align="left"
          fixed="left"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="cNum"
          label="卡号"
          min-width="90"
          align="left"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row["cNum"] || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="archCreateState"
          label="档案状态"
          min-width="110"
          align="left"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <span
              :val="scope.row['archCreateState']"
              code="ARCH_STATUS"
              v-codeTransform
            ></span>
          </template>
        </el-table-column>
      </el-table>
    </l-table>
  </div>
</template>

<script>
import { getArchListNew, getArchInfoByCardNum, swipe } from "@/api/arch/arch";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "leftList",
  props: ["param"],
  data() {
    return {
      patientList: [],
      loading: false,
      // 分页数据
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1
      },
      layout: "pager"
    };
  },
  methods: {
    ...mapActions({
      changeRecPatientData: "patientMaster/changeRecPatientData"
    }),
    //获取病人列表
    async getPatientList(param) {
      let startTimeRange = param.timeRange.length ? param.timeRange[0] : "";
      let endTimeRange = param.timeRange.length ? param.timeRange[1] : "";
      let params = {
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        startTimeRange: startTimeRange,
        endTimeRange: endTimeRange,
        ...param
      };
      this.$delete(params, "timeRange");
      this.loading = true;
      getArchListNew(params)
        .then(result => {
          if (result.code == "1") {
            this.patientList = [];
            let patientList = [];
            if (result.data.length > 0) {
              result.data.forEach(function(item) {
                patientList.push({
                  patientId: item.patientId,
                  patientName: item.patientName,
                  patientGender: item.patientGender,
                  patientAge: item.patientAge,
                  mobileNum: item.mobileNum,
                  birthDate: item.birthDate,
                  identificationType: item.identificationType,
                  cardId: item.cardData,
                  createdDate: item.archCreateDate,
                  visitCode: item.visitCode,
                  ouptDeptId: item.ouptDeptId,
                  patientCode: item.patientCode,
                  headImg: require("@/assets/pojehjdz.jpeg"),
                  qrcodeImg:
                    "data:image/png;base64,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",
                  identificationNum: item.identificationNum,
                  insuranceType: item.insuranceType,
                  chronicStatus: item.chronicStatus,
                  archCreateState: item.archCreateState,
                  relationStatus: item.relationStatus,
                  nativePlaceCode: item.nativePlaceCode,
                  cNum: item.cNum, //卡号
                  ssType: item.ssType, //社保
                  addrProvince: item.addrProvince,
                  addrCity: item.addrCity,
                  addrCounty: item.addrCounty,
                  inpCode: item.inpCode || ""
                });
              });
              this.pagination.currentPage = result.pageNo;
              this.pagination.pageSize = result.pageSize;
              this.pagination.total = result.total;
            }
            this.patientList = patientList;
            this.changeRecPatientData(this.patientList[0]);
            this.$refs.multipleTable.setCurrentRow(this.patientList[0]);
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    //读卡
    async readCard(param) {
      if (!param.search) {
        this.$message.error("未获得卡号");
      } else {
        this.patientList = [];
        this.loading = true;
        try {
          //获取数据接口
          let result = await swipe({ cardNum: param.search });
          if (result.code == "1" && result.data) {
            if (
              typeof result.data.patientId != "undefined" &&
              result.data.patientId != ""
            ) {
              this.patientList = [
                {
                  headImg: require("@/assets/pojehjdz.jpeg"),
                  qrcodeImg:
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAWl0lEQVR4Xu2d63rb2A5D0/d/6J7Paed2EnsvyKC27K75TYMESEKUk0l/fHx8/Pzwv28V+PlznzQ/fvyodiXhQnNTTIqXEN6ZO6nz6rG3Kds35RdXhw7ZBI320iRcaG6KSfESHXfmTuq8eqwG8KBDdMgmmtxemoQLzU0xKV6i487cSZ1Xj9UANIAvCtCF3bmEO3NffamT+jQADUADSDbmzWI1AA1AA3izpU7oaAAagAaQbMybxWoAGoAG8GZLndDRADQADSDZmDeL1QA0AA3gzZY6oYMNgP7YJUm+K7b9Y66EB82dYO6Kbc9Eog3NTTEp3i6tk7yU8w1TAzj5AkiakzR9R2x7aRJtaG6KSfF26JzmpJw1gIWyE0ORNCdt/NnxbX0SbWhuiknxztb4SD7KWQPQAI7M19+faS9NMrg0N8WkeE8JdtKHKWcNQAN4aiTbS5MMLs1NMSneU4Kd9GHKWQPQAJ4ayfbSJINLc1NMiveUYCd9mHLWADSAp0ayvTTJ4NLcFJPiPSXYSR+mnDUADeCpkWwvTTK4NDfFpHhPCXbShylnDUADeGok20uTDC7NTTEp3lOCnfRhylkD0ACeGsn20iSDS3NTTIr3lGAnfZhyHjGAJHlbD9pEWiPFa/PYjUf1oXXu1JFyoTVSPKpNEjdRY/03Ad9JICp40sRXiG33cKeOlAutkeJN9HmiRg3gQaeo4BPN3onZHvKdOlIutEaKN9G/iRo1AA3giwLtIaeDO7E0lAutkeJNcJmoUQPQADSA29/Gh/8GhAawsLZ3EogOxYTb78Rs93CnjpQLrZHiTfRvokYvAC8ALwAvgLVfTbjPOmsW0a6R4mVVXj+6/ZTbqSPlQmukeBNdnqjRC8ALwAvAC2DtVxPus86aRbRrpHhZldePbj/ldupIudAaKd5Elydq9AI4+QLYOUB0KNuDRvFofUkc1ZvWSPGSGmnsRI0agAbwRYH2oFE8ughJHF1YWiPFS2qksRM1agAagAbgdwBrD5pwn3XWLKJdI8VLqtz5BKF1Ut6UC8Wj9SVx7RopXlIjjaU6JjV6AXgBeAF4Aaw9aMJ91lmziHaNFC+pMnHnBLcZS3lTLhSvyeEvrHaNFG+CC9UxqdELwAvAC8ALYO1XE+6zzppFtGukeEmViTsnuM1YyptyoXhNDl4ATE0vAC8ALwAvgLVbUBenT4V1xjyiXSPFSyrdqQ+tk/KmXCgerS+Ja9dI8ZIaaSzVManRC+DFL4CJoaADSeNojRQviaPLQGukeEmNNHaiRg1AA6DzdziODu7hBA8+SBeW1kjxJrhM1KgBaAATs/ofTDq4E4XQhaU1UrwJLhM1agAawMSsagADqmoAC1HbAlG8pNftJwitsZ034UxrTDBpLOVNa6R4tL4kbqJGLwAvgGQGD8XSwT0EvvgQXVhaI8Wb4DJRowagAUzMqq8AA6pqAL4CfFFgYijas0trbOe94dEnNq2R4k1wmajRC8ALYGJWvQAGVNUAvAC8AMLFok/sieUKS12GT9ToBeAFsBy8ZwPo4D6b57vPawCPVa0bwEQT25g7h4IuQ7vGtoYTeJTzLbc63u9AoqMGULgAEsEd3M7gqmNHRw1AA5h4mB/C1EgPyfblQ4mOGoAG0Jm6AkoyuF4AXgCHR44OWnvIfHddfCH14/Y8Yv+1e0PxWHV7o+h836r0AvAC2Dut/8qeDC5dWIpJ8S4j1oNCKGcNYNFNOhSJ4G1Mivdug0t5095QvHfT0QvAC+AyM02X1Vep3quUBqABaADB7xVcRixfAY63gj5p6FlI8Xxy9Z5c7d5QvONTd94nk3nEF8B55V8nEx2KRPA2Zhtvp0nt1PE6U3duJRrAH/IKsHO5XsGkzl2762TTADSALwq0F7aNN3GlXGclz61EA9AANIBzd+5S2TQADUADuNRKnluMBqABaADn7tylsmkAGoAGcKmVPLcYDUAD0ADO3blLZdMANAAN4FIreW4xGoAGoAGcu3OXyvbjJ/0h7aXKft1i6C/ktNtC8+5Uts15J5dXya0BnNwpuojtZaB5T5bjP+nanHdyeZXcGsDJnaKL2F4GmvdkOTSAnYLf/iKQrwDndoAuogZwbl/+1GwawMmd1wDuC942vZNb+5LpNICT26YBaAAnj9zDdBrAyd3QADSAk0dOA7iU4PBPX7fPYWo8O7Vqc97J5VVyewGc3Cm6iO1loHlPlsOfAuwU3J8CnK8+XUQN4Pze/IkZ8a8C7xrIJC9dLtpomjvJSzFpjTTu3WqkvKneVB+KR+vbHacBPOgAbTYdnlsqitkejHerkepD9ab6UDxa3+44DUAD+KLAriGnS5gsDeVCc1O8pMadsRqABqAB3L4M2/TTmZ3Lf8utAWgAGoAGsPah9ukz4bgUc832VwTlnOSlmLRGGvduNVLeVG+qD8Wj9e2O8wLwAvAC8AJY+1Db+SYcl2Ku2XoBUI2ace3+TVxx7T1o6ncEywvAC8ALwAtg7R1t56Nun+SlmGu2XgBUo2Zcu39eAOvueAF4AXgBeAGsneIVIpJrgfCZeCKRvBNPLpp3Io725d30bvNu4916jS+AicFoY1KBaN53G0jKux1H+/Juerd5t/E0gMWkv9tAtheb4k0MLs1N4yZqbGO28TQADYDux1NxE4P7VEHffHiixjZmG08D0ADae/Qt3sTgtgufqLGN2cbTADSA9h5pAP9SoL2wbTwNQAPQAH4rMLFcbcw2ngagAWgAGsDHz1Om4IQk1CFpKf4UgCr1OI725d30bvNu43kBeAF0NnyBMjG47cInamxjtvFGDKBdJMVLBoI+aWhuinercQIz4U5iaY0E63PI4F/boXgTcW3OE7xHarzNZFNQWiQdCoqXcGjnpngaQNKlc2N3zhllOlKjBnBffiq4BvB4hBN96DK042ivk7xt3iM1agAawP8r0B609iIkS0hj25x9BSh9wbazMTR3MuATmHTIaRytkeIl+lDMdlybswagAXyrAB20nUtDa6RLuJMLrbHNWQPQADSA3wpoANSGHseNmJTfAfgdgN8B8B/PJqvcNj4NIFH/QSxtDBWc4t1KmsAsyfI3DK2R5k30oZjtuDZnXwF8BfAVwFeAqk+NmNRPiEpdHMLh3w6jeInjUsw254kaqxMWgrX1oXjvdkklvMMWLcN/aAD3NaKNoYaiATyeR6q3BrDcaxygAZz4XYEGoAF8p0BifHizYaAGoAHAUfkaRgeXXkgUzwvgcMu+fFAD0AAOTxNdWA2gd/kcbtadD2oAGsDhmdIAHks3YXyHm6UB/KNAuzEUz+8Aek9Cqjk1qfZivcpriheAF8Dh2afLNbGsE5iHhbjzwVeoUQPQAA7PvQbgK8AXBdquR/Emzuv2gE/UeHh7Cx9s60PxXuW8prOb8C607T8Ql//HQamIyXJREWnupIFtzDbexHLtrJH2mvaQcqF5d8dpAA86QJtNh+fdlovy3qkjXbA2F5p3d5wGoAFc5jWOLmFipHTBaG5qZjTv7jgNQAPQAII/Xa4BnGxZieDUxSkFmjvJ28Zs4yVPV8p7Z420120uNO/uOC8ALwAvAC+A3T50Pz99evhTgMc9pE84L4DHOibzeN2t+qcyLwAvAC8AL4DrelXiuMlTjjCmuZO8bcw2nheAFwDZjdNi6ID7CuArwDNDSU08mcdn6jnrs74C+ArgK8Cf/ApA/ybgWY70/3moMyenK+VCc088FWhuyiWJo3xojW28iV5TfSjnpEaKOaEj/r8BqUDtOCpOIjitkeamjaF5J15nktyUT1sfijfRa6rPRI0Us92XzznzArjf+nZj6JBpAGul6DKskbIIOhOJSVFMypniaQCL3lMhaWOSUaO5E0waS/nQGtt4yXJRzjSOck5qpJgTOnoBPOh8uzF0yLwA1krRZVgjZRF0JjSATNe70ROC09Jo7olhpLkplySO8qE1tvGS5Up4k1jKOamRYk7o6AXgBfBFgfagtfGS5SJLncTQZU1qpJgTOmoAGoAGEDgAXVYNIBD1UeiE4LQ0mps6M83rdwBrpSY0X2f9wP+orQZA1AQxdAkTwUHazxCae2IYaW7KJYmjfGiNbbyJXlN9KOekRoo5oSP+VeCJ5FT0XXGUc1Jfu9k0N81L8SbiEr0pH4pJ8SZ4tzEp58+H3MfHx09SAAX9U4UkGu68Kl6hL3TGJnR8BX3ojEU6agD3ZU2EpM2hg9bOTfNSHhNxCWfKh2JSvAnebUzK2QtgoXwiJG0iHbR2bpqX8piISzhTPhST4k3wbmNSzhqABtCevafwosH9cXt7Xf9HMTWA0jL8qUKuR/FXBNWHDm47L8WbiEs4t3WkeBO825iRjn4H4HcA7QE8ihcNrhfAXZkjHTUADeDowrY/Fw2uBqABtAfw//GSgaS10FOznZvmpTwm4hLOlA/FpHgTvNuYlPPnK6kXgBdAewCP4kWD6wXQuQDoXwSiDpk0kQwKzUuw/opp15jkprGUN+VC8Wh9u+Mob1on1SfJSzFpjTR3khf/34AUlBZJSdO8FO8W164xyU1jKW/KheLR+nbHUd60TqpPkpdi0hpp7iSvBkDVPzmONnFiKE6meigd5U3B23p/vl/D1xRaI+Wc5NUAqPonx9EmTgzFyVQPpaO8KXhbbw2AKr+Io41J0rWHJ8lNYylvyoXi0fp2x1HetE6qT5KXYtIaae4krxcAVf/kONrEiaE4meqhdJQ3BW/r7QVAlfcC+FaB9kBSvFLbxmE0gPsSJ732Ahgf1WMJaBPpIlC8Y9We/ynKm1ZG9UnyUkxaI82d5NUAqPonx9EmTgzFyVQPpaO8KXhbb18BqPK+AvgKcGBWNIDSKwD9VWDaI9oY6rg07y2unbuN9wpcXuXJlWi5K3bX/NC8n73WAO6PBxXyncxMA+jZxa75oXk1gEWvqZAawGMhd+rYW+ccaRdvmlcD0ACe+v6BrgQdyAkjpTVOxO3iTfNqABqABjCx+b8x6SK2jY/m1QA0AA1AA2D/MAjVibpP2/X8KUDnPdwvAemkr+N27QLN6wXgBeAFsN7jwxF0EdsPQ5pXA9AANIDD673+IF1EDWCtJYpoC97GQySGvkCiXHwFSLrUee3SAEqa0yGngrfxEprt3BRPA0i69AYGQP8oaE+W90OihrLzi8oJ1RPe7fyJoTVzJ5xpjRSzjfdp9hrA8+NBG6gBPK/1Xwh0GXoZfyG9Qq+TGjWAwoQkgtPBpZgUr0DzCwStcSL3Lt4JZ1ojxWzjeQGUJpM20AugJHjwf372MnoBtLV8GzwN4PxW0qdhu7JX6HVSo68AhQlJBKeDSzEpXoGmrwB+BzAxRq+PSZfVV4Ber3cZ3yv0OqnRC6Awk4ngdHApJsUr0PQC8AKYGKPXx6TL6gXQ6/Uu43uFXic1egEUZjIRnA4uxaR4BZpeAO94AbT/JuDEoO3CnFguutiU884a27kTbWhuitnGS6492us2l8/fA9AA7stPh4I28FPwTf9i7ESNbX0SbWhuitnG0wCSibtoLB2KpHw6kBRzZ43t3Ik2NDfFbONpAHSCLxxHhyKhQAeSYu6ssZ070YbmpphtPA2ATvCF4+hQJBToQFLMnTW2cyfa0NwUs42nAdAJvnAcHYqEAh1IirmzxnbuRBuam2K28TQAOsEXjqNDkVCgA0kxd9bYzp1oQ3NTzDaeBkAn+MJxdCgSCnQgKebOGtu5E21oborZxtMA6ARfOI4ORUKBDiTF3FljO3eiDc1NMdt4GgCd4AvH0aFIKNCBpJg7a2znTrShuSlmG+/tDIAKRAd3Z5xD8Vj9nfrQudg1j1QbymPCKJLc+DcBdwmekKGxtImUM8WbaDbNTbncamxjUjzavwkdae534vLZa/qrwMkAUTF3xdEmUs4Ub2JwaW7KRQPoXEfJbCe9SXBJrAbwQCXaGLqEGgAZSRZDe8PQeFTSa4q6i4sXwKJDtDHJUFBMOjw0d5K3jUnxKOcJI6W534mLBqABfKsAHXJqKhSPLqEGkCi1eKXxO4D7Ak0MOMWkLabLleRtY1I8ylkDSJTSAL4oQAeSLg3Fmxhcmpty+TwL4d8soJgULxlrmjvBJLHvxMVXAF8BfAUgW/+vGA0gFOyK4bSJ9ClD8bwAetNAe9PL+Asp6TXNvYvLyAUwIVBbSFrjzsZQzpQLxUtMaiJ3UufVY+n8UB3beBpA6RVg5yDS4UlqnBi0JP+7xLZ1bONpABrAtwpMDNq7LHXCo61jG08D0AA0gGSjw9j2wrbxNAANQAMIlzoJby9sG08D0AA0gGSjw9j2wrbxNAANQAMIlzoJby9sG08D0AA0gGSjw9j2wrbxNAANQAMIlzoJby9sG08D0AA0gGSjw9j2wrbxNAANQAMIlzoJby9sG08DKBnAn/rbeBMDmSzYjljK+XO54P9VSXkkuSlm/U+CtUlTIrc4KhCtsY23k0uSm8bu1IfW2I6jnDWAtvIAjzZHAwBigpC23iDl9hDKWQPY0CraHA2g05y23p2qZlEoZw1gtg+nfHlFm00NJZFkZ25a5yvUSLnQOMpZA6CKFuNoc+jCtvESqjtz0zpfoUbKhcZRzhoAVbQYR5ujAXREb+vdqWoWhXLWAGb74CvAbwWomU20gy7DzhrbvClnDaCtPMCjzaED2cYDFP4O2Zmb1vkKNVIuNI5y1gCoosU42hwNoCN6W+9OVbMolLMGMNuHS70CJFRfwXwSPs3YieWimO2+JAZAa6RaUy6fNbb/ZaAkOSVE46iQtEaKR+ubGArKJalxV2yiN+VNMdt4E72mfaFcNICFonR4aGMmhiJpdlLnjthEb8qbYrbxJnpNe0K5aAAaAJ2pU+Losk4sF12anTXSJlAuGoAGQGfqlLidy0WXZmeNtAmUiwagAdCZOiVu53LRpdlZI20C5aIBaAB0pk6J27lcdGl21kibQLloABoAnalT4nYuF12anTXSJlAuGoAGQGfqlLidy0WXZmeNtAmUiwagAdCZOiVu53LRpdlZI20C5TJiALTInXFUoKTZbT60xnbeBI/qM8FlV26aN9GR6jOSu/2bgAnxXbE7BaecaY0UbyKODuQEl125ad5Eb6rPSG4N4H6rJgSng0GHguJNxFF9Jrjsyk3zJnpTfUZyawAaQDKs/46lA0kHPKljV26aN+FC9RnJrQFoAMmwagA/j8p193MaQF3Sx4A7BadUaY0UbyKOPpEmuOzKTfMmelN9RnJ7AXgBJMPqBeAFcHReLvO5nY5LRaA1UryJOPpEmuCyKzfNm+hN9RnJ7QXgBZAMqxeAF8DRebnM53Y6LhWB1kjxJuLoE2mCy67cNG+iN9VnJDe9ABJC7xJLBacNvOlCMamGNHc7760+mptymaiR5m5z2dlryvmzhxrA868AyfC0h5zmbufVANZr1tac9npd2T8RGsADtWgDk8ZQTNpEmrudVwNYd6itOe31ujINAGlEG5g0hmKiAoMzvJ1XA1h3qK15Mmfr6n5FeAF4AdBZ+RLXHsj2wiTE2lz8DiBR/6KxdCCT4aGYVBKau53XC2DdobbmtNfrynwFQBrRBiaNoZioQF8BqEzLuKSHS7DfAbt6TevzFWChFG1gMjwUkzaR5m7n9QJYd6itOe31ujIvAKQRbWDSGIqJCvQCoDIt45IeLsG8AKhE146jy5oMD8WkytDc7bxeAOsOtTWnvV5X5gWANKINTBpDMVGBXgBUpmVc0sMl2AtdAP8DM512+NlSZZIAAAAASUVORK5CYII=",
                  patientId: result.data.patientId,
                  patientName: result.data.patientName,
                  identificationNum: result.data.identificationNum,
                  identificationType: result.data.identificationType,
                  insuranceType: result.data.insuranceType,
                  mobileNum: result.data.mobileNum,
                  chronicStatus: result.data.chronicStatus,
                  cNum: result.data.cardData,
                  createdDate: result.data.archCreateDate,
                  visitCode: result.data.visitCode,
                  patientCode: result.data.patientCode,
                  ouptDeptId: result.data.ouptDeptId,
                  birthDate: result.data.birthDate,
                  archCreateState: result.data.archCreateState || "",
                  nativePlaceCode: result.data.nativePlaceCode || "",
                  ssType: result.data.ssType || "", //社保
                  addrProvince: result.data.addrProvince,
                  addrCity: result.data.addrCity,
                  addrCounty: result.data.addrCounty,
                  inpCode: result.data.inpCode || "",
                  patientAge: result.data.patientAge,
                  patientGender: result.data.patientGender
                }
              ];
              await this.changeRecPatientData({
                ...this.patientList[0],
                cardId: param.search,
                patientId: result.data.patientId,
                cNum: param.search
              });
              this.$refs.multipleTable.setCurrentRow(this.patientList[0]);
            } else {
              if (result.data.cardType == "0") {
                this.$message.error("卡类型错误");
              } else {
                this.changeRecPatientData({
                  cardId: this.param.search,
                  cardType: result.data.cardType
                });
                this.$message("该卡未绑定档案，开始建档");
                // this.$router.push("/patientMaster/recordCreate");
              }
            }
            this.pagination.total = 1;
          } else {
            this.$message.error(result.msg || '"读卡请求失败"');
          }
          this.loading = false;
        } catch (error) {
          this.loading = false;
          this.$message.error(error.msg || "读卡请求失败");
        }
      }
    },
    //点击表格某一列
    rowClick(row) {
      this.changeRecPatientData(row);
      this.$refs.multipleTable.setCurrentRow(row);
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.archCreateState == "0") {
        //未建档
        return "archCreateState0";
      } else if (row.archCreateState == "1") {
        //建档未实名
        return "archCreateState1";
      } else if (row.archCreateState == "2") {
        //建档实名
        return "archCreateState2";
      } else {
        return "";
      }
    },
    changeSize(val) {
      this.pagination.currentPage = val.page;
      this.pagination.pageSize = val.pageSize;
      this.getPatientList(this.param);
    }
  }
};
</script>

<style lang="scss">
.leftList {
  .el-table__body tr.hover-row > td {
    background-color: transparent;
  }

  .el-table__body tr.hover-row.current-row > td {
    background-color: $l-color-bgcolor-12;
  }

  .el-table .archCreateState0 {
    background-color: $l-color-bgcolor-11;
  }

  .el-table .archCreateState1 {
    background-color: $l-color-white;
  }

  .el-table .archCreateState2 {
    background-color: $l-color-bgcolor-1;
  }
}
</style>
