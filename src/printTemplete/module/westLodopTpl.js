let westLodopTpl = ` 
LODOP.PRINT_INITA("0mm",0,"147.64mm","210.08mm","");
LODOP.SET_PRINT_PAGESIZE(1,0,0,"A5");
LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
LODOP.ADD_PRINT_BARCODE("6.35mm","11.11mm","31.22mm","13.23mm","128B","recipeNo");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("6.35mm","56.62mm","46.04mm","9.26mm","orgName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("14.55mm","38.89mm","89.69mm","9.26mm","hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Alignment",2);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","54.5mm","28.84mm","5.29mm","医保电脑号：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","107.95mm","17.99mm","5.29mm","门诊号：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","72.5mm","37.84mm","5.29mm","miComputeNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.99mm","121.71mm","26.46mm","5.29mm","visitCode");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("30.98mm","6.61mm","30.98mm","140.71mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","10.05mm","12.96mm","5.29mm","姓名：");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","20.37mm","33.07mm","5.29mm","patientName");
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","54.24mm","12.17mm","5.29mm","性别：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","64.29mm","19.84mm","5.29mm","patientGender");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","83.87mm","11.91mm","5.29mm","年龄：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","94.72mm","21.96mm","5.29mm","age");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","116.15mm","12.7mm","5.29mm","体重：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","10.05mm","17.2mm","5.29mm","开单科室:");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","54.24mm","19.31mm","5.29mm","医嘱时间：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","25.93mm","23.55mm","5.29mm","outpDeptName");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("37.31mm","70.64mm","38.36mm","5.29mm","diagTime");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.33mm","54.24mm","19.31mm","5.29mm","联系方式：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.33mm","69.85mm","23.81mm","5.29mm","relateNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_LINE("cHtmlLineTop",24,"cHtmlLineTop",531,0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);




// LODOP.ADD_PRINT_HTML("51.18mm","9.6mm","123.83mm","116.15mm","RecipeDetails");
LODOP.ADD_PRINT_TABLE("contentHtmlTop","9.6mm","123.83mm","116.15mm","RecipeDetails");

LODOP.ADD_PRINT_HTM("diagHtmlTop",37,483,"diagHtmlHeight","diagnoseHtml");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);

LODOP.ADD_PRINT_TEXT("42.33mm","93.93mm","16.93mm","5.29mm","证件号：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.33mm","106.63mm","37.57mm","5.29mm","identificationNum");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("47.36mm","10.05mm","18.26mm","5.29mm","联系地址：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("47.36mm","25.93mm","111.39mm","5.29mm","relateAddress");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE("171.21mm","6.35mm","170.92mm","140.44mm",0,1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("173.04mm","43.66mm","20.37mm","5.29mm","开单医生：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("173.04mm","60.06mm","31.75mm","5.29mm","doctorName");

LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("180.18mm","43.66mm","18.26mm","5.29mm","审核药师：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("180.18mm","60.06mm","26.46mm","5.29mm","                ");

LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("187.06mm","43.66mm","18.52mm","5.29mm","配药药师：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("187.06mm","60.06mm","26.46mm","5.29mm","                  ");

LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("193.94mm","43.66mm","26.46mm","5.29mm","核对/发药药师：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("193.94mm","67.2mm","26.46mm","5.29mm","               ");

LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("173.3mm","95.78mm","15.61mm","5.29mm","西药费：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("173.3mm","109.01mm","26.46mm","5.29mm","westFee");

LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("180.18mm","95.78mm","18.52mm","5.29mm","中成药费：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("180.18mm","111.92mm","26.46mm","5.29mm","chineseFee");

LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("187.06mm","95.78mm","18.52mm","5.29mm","中草药费：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("187.06mm","111.92mm","26.46mm","5.29mm","herbalFee");

LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("193.68mm","95.78mm","16.67mm","5.29mm","总金额：");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("193.68mm","110.07mm","27.78mm","5.29mm","totalFee");

LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT(25,418,126,30,"recipeCat");
LODOP.SET_PRINT_STYLEA(0,"FontSize",16);
LODOP.SET_PRINT_STYLEA(0,"Bold",1);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.33mm","10.05mm","17.2mm","5.29mm","处方类型:");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("42.33mm","26.72mm","23.55mm","5.29mm","diseaseRecipeType");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("32.01mm","127.26mm","26.46mm","5.29mm","weight");
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.19mm","9.79mm","16.32mm","5.29mm","费别：");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_TEXT("26.19mm","20.11mm","37.04mm","5.29mm","settlemetnType");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
LODOP.ADD_PRINT_LINE(667,222,666,322,0,1);
LODOP.ADD_PRINT_LINE(695,222,694,322,0,1);
LODOP.ADD_PRINT_LINE(724,222,723,322,0,1);
LODOP.ADD_PRINT_LINE(748,249,747,322,0,1);
LODOP.ADD_PRINT_LINE(674,408,673,518,0,1);
LODOP.ADD_PRINT_LINE(699,418,698,518,0,1);
LODOP.ADD_PRINT_LINE(725,418,724,518,0,1);
LODOP.ADD_PRINT_LINE(750,408,749,518,0,1);

`;

export { westLodopTpl };