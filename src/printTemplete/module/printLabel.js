export const PrintLabel = `
LODOP.PRINT_INIT("药品标签打印");
LODOP.SET_PRINT_PAGESIZE(1,'80mm','50mm',"CreateCustomPage");LODOP.ADD_PRINT_TEXT(6,71,213,20,"hosName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.ADD_PRINT_TEXT(130,191,91,20,"medicationCode");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(34,1,49,20,"姓名:");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(34,114,26,20,"patientGenderName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(34,138,43,20,"patientAge");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(34,181,105,20,"recipeCode");
LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
LODOP.ADD_PRINT_LINE(61,0,62,280,0,1);
LODOP.ADD_PRINT_TEXT(72,55,226,20,"drugName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(101,3,154,20,"spec");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(130,2,103,20,"frequencyName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_LINE(157,0,156,280,0,1);
LODOP.ADD_PRINT_TEXT(130,110,74,20,"oneDosage");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(163,3,85,20,"注意事项:");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(163,89,192,20,"cautions");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(6,8,63,20,"(门诊)");
LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
LODOP.ADD_PRINT_TEXT(34,50,64,20,"patientName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(100,193,86,20,"display");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
LODOP.ADD_PRINT_TEXT(72,2,54,20,"basicTypeName");
LODOP.SET_PRINT_STYLEA(0,"FontSize",11);
`;

// LODOP.PRINT_INITA(0,0,798,1116,"");
// LODOP.SET_PRINT_PAGESIZE(1, 0, 0,"A4");
// LODOP.PRINT_INIT("药品标签打印");
// LODOP.SET_PRINT_PAGESIZE(1,'80mm','50mm',"CreateCustomPage");
