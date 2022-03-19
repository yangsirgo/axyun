let siChargeTpl = `
LODOP.PRINT_INITA(0,0,794,1116,"");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A4");
LODOP.ADD_PRINT_TEXT(14,18,761,24,"广东省社会医疗保险医疗费用结算单");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(48,26,60,20,"机构名称");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_LINE(1048,22,38,23,0,1);
LODOP.ADD_PRINT_LINE(38,22,39,772,0,1);
LODOP.ADD_PRINT_LINE(69,22,68,772,0,1);
LODOP.ADD_PRINT_LINE(99,22,98,772,0,1);
LODOP.ADD_PRINT_LINE(129,22,128,772,0,1);
LODOP.ADD_PRINT_LINE(159,22,158,772,0,1);
LODOP.ADD_PRINT_LINE(189,22,188,772,0,1);
LODOP.ADD_PRINT_LINE(219,22,218,772,0,1);
LODOP.ADD_PRINT_LINE(249,22,248,772,0,1);
LODOP.ADD_PRINT_LINE(188,372,38,373,0,1);
LODOP.ADD_PRINT_LINE(38,88,68,89,0,1);
LODOP.ADD_PRINT_LINE(38,445,68,446,0,1);
LODOP.ADD_PRINT_LINE(38,564,68,565,0,1);
LODOP.ADD_PRINT_LINE(38,644,68,645,0,1);
LODOP.ADD_PRINT_LINE(38,772,1048,773,0,1);
LODOP.ADD_PRINT_LINE(68,88,98,89,0,1);
LODOP.ADD_PRINT_LINE(188,310,68,311,0,1);
LODOP.ADD_PRINT_LINE(248,72,98,73,0,1);
LODOP.ADD_PRINT_LINE(128,169,98,170,0,1);
LODOP.ADD_PRINT_LINE(98,230,128,231,0,1);
LODOP.ADD_PRINT_LINE(158,144,188,145,0,1);
LODOP.ADD_PRINT_LINE(218,172,188,173,0,1);
LODOP.ADD_PRINT_TEXT(78,23,69,20,"就医登记号");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(78,308,62,20,"结算号");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(108,24,46,20,"姓名");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(138,22,58,20,"单位名称");
LODOP.ADD_PRINT_TEXT(168,23,49,20,"住院号");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(198,25,46,20,"险种");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(228,23,58,20,"业务类别");
LODOP.ADD_PRINT_TEXT(108,170,59,20,"性别");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(108,312,57,20,"出生日期");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(138,312,61,20,"联系电话");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_LINE(188,181,158,182,0,1);
LODOP.ADD_PRINT_TEXT(168,144,38,20,"科别");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_LINE(218,275,158,276,0,1);
LODOP.ADD_PRINT_TEXT(168,275,35,20,"床号");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(198,174,100,20,"入院第一诊断");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(48,372,74,20,"机构编码");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(48,563,82,20,"医保结算级别");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_LINE(248,445,98,446,0,1);
LODOP.ADD_PRINT_TEXT(168,373,70,20,"入院日期");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_LINE(247,386,217,387,0,1);
LODOP.ADD_PRINT_TEXT(228,386,58,20,"结算时间");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_LINE(158,509,98,510,0,1);
LODOP.ADD_PRINT_TEXT(198,446,85,20,"出院第一诊断");
LODOP.ADD_PRINT_TEXT(108,446,75,20,"个人电脑号");
LODOP.ADD_PRINT_TEXT(138,447,58,20,"身份证号");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_LINE(98,640,128,641,0,1);
LODOP.ADD_PRINT_LINE(128,691,98,692,0,1);
LODOP.ADD_PRINT_TEXT(108,641,60,20,"人员类别");
LODOP.ADD_PRINT_LINE(188,568,158,569,0,1);
LODOP.ADD_PRINT_TEXT(168,519,58,20,"出院日期");
LODOP.ADD_PRINT_LINE(188,640,158,641,0,1);
LODOP.ADD_PRINT_LINE(188,694,158,695,0,1);
LODOP.ADD_PRINT_TEXT(168,641,59,20,"住院天数");
LODOP.ADD_PRINT_LINE(427,22,426,772,0,1);
LODOP.ADD_PRINT_LINE(457,22,456,772,0,1);
LODOP.ADD_PRINT_LINE(487,22,486,772,0,1);
LODOP.ADD_PRINT_LINE(517,22,516,772,0,1);
LODOP.ADD_PRINT_LINE(547,22,546,772,0,1);
LODOP.ADD_PRINT_LINE(577,22,576,772,0,1);
LODOP.ADD_PRINT_LINE(607,22,606,772,0,1);
LODOP.ADD_PRINT_LINE(637,22,636,772,0,1);
LODOP.ADD_PRINT_LINE(667,22,666,772,0,1);
LODOP.ADD_PRINT_LINE(697,22,696,772,0,1);
LODOP.ADD_PRINT_LINE(907,22,906,772,0,1);
LODOP.ADD_PRINT_LINE(757,22,756,772,0,1);
LODOP.ADD_PRINT_LINE(787,22,786,772,0,1);
LODOP.ADD_PRINT_LINE(817,22,816,772,0,1);
LODOP.ADD_PRINT_LINE(847,22,846,772,0,1);
LODOP.ADD_PRINT_LINE(937,22,936,772,0,1);
LODOP.ADD_PRINT_LINE(967,22,966,772,0,1);
LODOP.ADD_PRINT_LINE(1049,22,1048,772,0,1);
LODOP.ADD_PRINT_LINE(936,386,426,387,0,1);
LODOP.ADD_PRINT_LINE(936,199,426,200,0,1);
LODOP.ADD_PRINT_LINE(936,579,426,580,0,1);
LODOP.ADD_PRINT_LINE(696,87,426,88,0,1);
LODOP.ADD_PRINT_LINE(696,276,426,277,0,1);
LODOP.ADD_PRINT_LINE(696,466,426,467,0,1);
LODOP.ADD_PRINT_LINE(696,659,426,660,0,1);
LODOP.ADD_PRINT_TEXT(436,25,64,20,"费用名称");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(436,92,100,20,"总费用");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(436,205,65,20,"自费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(436,278,100,20,"部分项目自付");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(436,388,80,20,"费用名称");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(436,470,105,20,"总费用");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(436,580,73,20,"自费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(436,660,111,20,"部分项目自付");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(466,26,60,20,"床位费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(466,388,78,20,"西药费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(496,26,60,20,"中草药");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(526,26,60,20,"诊查费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(496,388,78,20,"中成药");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(556,26,60,20,"治疗费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(526,388,78,20,"检查费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(586,26,60,20,"手术费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(616,26,60,20,"材料费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(646,26,60,20,"其他");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(676,26,60,20,"合计");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(556,386,78,20,"护理费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(586,388,78,20,"化验费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(616,388,78,20,"挂号费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(646,388,78,20,"一般诊疗费");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(706,26,160,40,"城镇职工基本医疗保险个人账户基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(766,26,160,20,"大额医疗费用补助基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(856,26,160,40,"一至六级残疾军人医疗补助基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(796,26,160,20,"城乡居民大病医疗保险基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(826,26,160,20,"生育基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(717,388,180,20,"公务员医疗补助基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(864,388,180,20,"城镇职工基本医疗保险统筹基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(766,388,180,20,"企业补充医疗保险基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(796,388,180,20,"城乡居民基本医疗保险基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(826,388,180,20,"离休人员医疗保障基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(916,26,160,20,"医疗救助基金");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(916,388,181,20,"其他");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(946,26,60,20,"收款人：");
LODOP.ADD_PRINT_TEXT(946,200,60,20,"审核人：");
LODOP.ADD_PRINT_TEXT(946,380,60,20,"制单人：");
LODOP.ADD_PRINT_TEXT(946,554,70,20,"打印日期：");
LODOP.ADD_PRINT_TEXT(978,26,738,20,"注：1.部分项目自付金额是指基本医疗保险范围内的项目需参保人先按规定比例自付的金额。");
LODOP.ADD_PRINT_TEXT(999,51,713,20,"2.此表由医院打印。");
LODOP.ADD_PRINT_TEXT(1020,51,713,20,"3.此表一式两份，医院、参保人各一份。");
LODOP.ADD_PRINT_TEXT(1053,21,135,25,"病人家属签字：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.ADD_PRINT_HTM(37,90,283,35,"fixmedins_name");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(48,447,115,20,"fixmedins_code");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(48,648,125,20,"hosp_lv");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(78,90,220,20,"mdtrt_id");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(78,371,402,20,"setl_id");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(108,73,95,20,"psn_name");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(108,230,82,20,"gend");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(108,369,78,20,"brdy");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(108,507,135,20,"psn_no");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_HTM(96,695,80,35,"psn_type");
LODOP.ADD_PRINT_TEXT(138,74,237,20,"emp_name");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(138,371,73,20,"tel");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(138,508,265,20,"certno");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_HTM(158,76,75,35,"ipt_otp_no");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(168,180,95,20,"adm_dept_name");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(168,311,61,20,"adm_bed");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(168,443,75,20,"begntime");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(168,570,70,20,"endtime");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(168,692,80,20,"indays");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_HTM(188,76,100,35,"insutype");
LODOP.ADD_PRINT_TEXT(198,276,167,20,"diag_name_in");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(198,520,252,20,"diag_name_out");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(228,72,312,20,"med_type");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(228,444,325,20,"setl_time");
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.ADD_PRINT_TEXT(273,50,698,121,"note");
LODOP.ADD_PRINT_TEXT(465,88,105,20,"det_item_fee_sumamt01");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(466,200,70,20,"overlmt_amt01");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(496,88,105,20,"det_item_fee_sumamt10");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(497,200,70,20,"overlmt_amt10");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(524,88,105,20,"det_item_fee_sumamt02");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(524,200,70,20,"overlmt_amt02");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(556,88,105,20,"det_item_fee_sumamt05");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(556,200,70,20,"overlmt_amt05");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(583,88,105,20,"det_item_fee_sumamt06");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(614,88,105,20,"det_item_fee_sumamt08");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(584,200,70,20,"overlmt_amt06");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(616,200,70,20,"overlmt_amt08");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(644,88,105,20,"det_item_fee_sumamt14");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(646,200,70,20,"overlmt_amt14");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(674,88,105,20,"det_item_fee_sumamt_all");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(675,200,70,20,"overlmt_amt_all");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(466,277,105,20,"preselfpay_amt01");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(496,277,105,20,"preselfpay_amt10");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(525,277,105,20,"preselfpay_amt02");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(555,277,105,20,"preselfpay_amt05");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(584,277,105,20,"preselfpay_amt06");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(614,277,105,20,"preselfpay_amt08");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(645,277,105,20,"preselfpay_amt14");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(674,277,105,20,"preselfpay_amt_all");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(464,466,110,20,"det_item_fee_sumamt09");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(494,466,110,20,"det_item_fee_sumamt11");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(525,466,110,20,"det_item_fee_sumamt03");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(555,466,110,20,"det_item_fee_sumamt07");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(585,466,110,20,"det_item_fee_sumamt04");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(614,466,110,20,"det_item_fee_sumamt13");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(646,466,110,20,"det_item_fee_sumamt12");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(463,580,74,20,"overlmt_amt09");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(495,580,74,20,"overlmt_amt11");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(524,580,74,20,"overlmt_amt03");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(554,580,74,20,"overlmt_amt07");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(585,580,74,20,"overlmt_amt04");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(614,580,74,20,"overlmt_amt13");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(644,580,74,20,"overlmt_amt12");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(463,660,105,20,"preselfpay_amt09");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(494,660,105,20,"preselfpay_amt11");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(525,660,105,20,"preselfpay_amt03");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(555,660,105,20,"preselfpay_amt07");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(583,660,105,20,"preselfpay_amt04");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(645,660,105,20,"preselfpay_amt13");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(614,660,105,20,"preselfpay_amt12");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(716,200,180,20,"fund_payamt310200");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(763,200,180,20,"fund_payamt330100");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(794,200,180,20,"fund_payamt390200");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(824,200,180,20,"fund_payamt510100");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(864,200,180,20,"fund_payamt350100");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(916,200,180,20,"fund_payamt610100");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(716,580,185,20,"fund_payamt320100");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(765,580,185,20,"fund_payamt370100");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(795,580,185,20,"fund_payamt390100");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(824,580,185,20,"fund_payamt340100");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(863,580,185,20,"fund_payamt310100");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_TEXT(916,580,185,20,"fund_payamt_other");
LODOP.SET_PRINT_STYLEA(0,"Alignment",3);
LODOP.ADD_PRINT_LINE(217,519,157,520,0,1);
`;

function handleData(data) {
  let obj = {
    fixmedins_name: "",
    fixmedins_code: "",
    hosp_lv: "",
    mdtrt_id: "",
    setl_id: "",
    psn_name: "",
    gend: "",
    brdy: "",
    psn_no: "",
    psn_type: "",
    begntime: "",
    endtime: "",
    insutype: "",
    med_type: "",
    setl_time: "",
    emp_name: "",
    certno: "",
    note: "",
    det_item_fee_sumamt01: "0.00",
    det_item_fee_sumamt02: "0.00",
    det_item_fee_sumamt03: "0.00",
    det_item_fee_sumamt04: "0.00",
    det_item_fee_sumamt05: "0.00",
    det_item_fee_sumamt06: "0.00",
    det_item_fee_sumamt07: "0.00",
    det_item_fee_sumamt08: "0.00",
    det_item_fee_sumamt09: "0.00",
    det_item_fee_sumamt10: "0.00",
    det_item_fee_sumamt11: "0.00",
    det_item_fee_sumamt12: "0.00",
    det_item_fee_sumamt13: "0.00",
    det_item_fee_sumamt14: "0.00",
    det_item_fee_sumamt_all: "0.00",
    overlmt_amt01: "0.00",
    overlmt_amt02: "0.00",
    overlmt_amt03: "0.00",
    overlmt_amt04: "0.00",
    overlmt_amt05: "0.00",
    overlmt_amt06: "0.00",
    overlmt_amt07: "0.00",
    overlmt_amt08: "0.00",
    overlmt_amt09: "0.00",
    overlmt_amt10: "0.00",
    overlmt_amt11: "0.00",
    overlmt_amt12: "0.00",
    overlmt_amt13: "0.00",
    overlmt_amt14: "0.00",
    overlmt_amt_all: "0.00",
    preselfpay_amt01: "0.00",
    preselfpay_amt02: "0.00",
    preselfpay_amt03: "0.00",
    preselfpay_amt04: "0.00",
    preselfpay_amt05: "0.00",
    preselfpay_amt06: "0.00",
    preselfpay_amt07: "0.00",
    preselfpay_amt08: "0.00",
    preselfpay_amt09: "0.00",
    preselfpay_amt10: "0.00",
    preselfpay_amt11: "0.00",
    preselfpay_amt12: "0.00",
    preselfpay_amt13: "0.00",
    preselfpay_amt14: "0.00",
    preselfpay_amt_all: "0.00",
    fund_payamt310200: "0.00",
    fund_payamt330100: "0.00",
    fund_payamt390200: "0.00",
    fund_payamt510100: "0.00",
    fund_payamt350100: "0.00",
    fund_payamt610100: "0.00",
    fund_payamt320100: "0.00",
    fund_payamt370100: "0.00",
    fund_payamt390100: "0.00",
    fund_payamt340100: "0.00",
    fund_payamt310100: "0.00",
    fund_payamt_other: "0.00",
    diag_name_in: "",
    diag_name_out: "",
    adm_bed: "",
    adm_dept_name: "",
    ipt_otp_no: "",
    tel: "",
    indays: ""
  };
  obj = {
    ...obj,
    ...data
  }
  obj.psn_type = `<div style='height:35px;width:80px;font-size:12px;text-align:center;display: flex;align-items: center;'>${obj.psn_type}</div>`
  obj.insutype = `<div style='height:35px;width:100px;font-size:12px;text-align:center;display: flex;align-items: center;'>${obj.insutype}</div>`
  obj.fixmedins_name = `<div style='height:35px;width:283px;font-size:12px;text-align:center;display: flex;align-items: center;'>${obj.fixmedins_name}</div>`
  obj.ipt_otp_no = `<div style='height:35px;width:70px;font-size:12px;text-align:center;display: flex;align-items: center;word-break: break-all;'>${obj.ipt_otp_no}</div>`
  
  let fund_pay_type_list = ["310200", "330100", "390200", "510100", "350100", "610100", "320100", "370100", "390100", "340100", "310100"];
  obj.brdy = obj.brdy.indexOf(" ") > -1 ? obj.brdy.split(" ")[0] : obj.brdy;
  obj.begntime = obj.begntime.indexOf(" ") > -1 ? obj.begntime.split(" ")[0] : obj.begntime;
  obj.endtime = obj.endtime.indexOf(" ") > -1 ? obj.endtime.split(" ")[0] : obj.endtime;
  let note = `本次就医：总费用${Number(obj.medfee_sumamt || 0).toFixed(2)}元，基金支付${Number(obj.fund_pay_sumamt || 0).toFixed(2)}元，个人支付${(Number(obj.medfee_sumamt || 0) - Number(obj.fund_pay_sumamt || 0)).toFixed(2)}元（起付线${Number(obj.act_pay_dedc || 0).toFixed(2)}元，先自付${(Number(obj.fulamt_ownpay_amt || 0) + Number(obj.overlmt_selfpay || 0) + Number(obj.preselfpay_amt || 0)).toFixed(2)}元，段内自付${(Number(obj.medfee_sumamt || 0) - Number(obj.fund_pay_sumamt || 0) - Number(obj.overlmt_selfpay || 0) - Number(obj.preselfpay_amt || 0)).toFixed(2)}）`;
  obj.note = note;

  let det_item_fee_sumamt_all = 0;
  let overlmt_amt_all = 0;
  let preselfpay_amt_all = 0;
  for (let i in data.costDetail) {
    let item = data.costDetail[i];
    det_item_fee_sumamt_all += Number(item.det_item_fee_sumamt);
    overlmt_amt_all += Number(item.overlmt_amt);
    preselfpay_amt_all += Number(item.preselfpay_amt);
    for (let j in item) {
      obj[j + i] = (Number(item[j] || 0)).toFixed(2)
    }
  }
  obj.det_item_fee_sumamt_all = det_item_fee_sumamt_all.toFixed(2);
  obj.overlmt_amt_all = overlmt_amt_all.toFixed(2);
  obj.preselfpay_amt_all = preselfpay_amt_all.toFixed(2);

  let setldetail = data.settle ? data.settle.setldetail : [];
  let otherDetail = 0; //其他
  for (let i in setldetail) {
    let item = setldetail[i];
    if (fund_pay_type_list.indexOf(item.fund_pay_type) > -1) {
      obj["fund_payamt" + item.fund_pay_type] = Number(item.fund_payamt || 0).toFixed(2);
    } else {
      otherDetail += Number(item.fund_payamt);
    }
  }
  obj.fund_payamt_other = otherDetail.toFixed(2);

  console.log(obj)
  return obj;
}
export {
  siChargeTpl,
  handleData
};
