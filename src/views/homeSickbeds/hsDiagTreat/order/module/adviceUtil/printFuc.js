function printLongData(data) {
  let commonStyle =
    "border: 1px solid black;border-style: solid;border-collapse: collapse;";
  let trCommonStyle = "height:30px;text-align:center;";
  let header = [{
      label: "起始时间",
      prop: "startDay",
      style: "width:150px;" + commonStyle + trCommonStyle
    },
    {
      label: "医生签名",
      prop: "startDocSign",
      style: "width:200px;" + commonStyle + trCommonStyle
    },
    {
      label: "医嘱",
      prop: "medicalAdvice",
      style: "width:80px;" + commonStyle + trCommonStyle
    },
    {
      label: "执行护士签名",
      prop: "startNurSign",
      style: "width:80px;" + commonStyle + trCommonStyle
    },
    {
      label: "停止日期",
      prop: "endDay",
      style: "width:100px;" + commonStyle + trCommonStyle
    },
    {
      label: "医师签名",
      prop: "endDocSign",
      style: "width:90px;" + commonStyle + trCommonStyle
    },
    {
      label: "停止执行护士签名",
      prop: "endNurSign",
      style: "width:90px;" + commonStyle + trCommonStyle
    }
  ];
  let str =
    "<table border='1' style='" +
    commonStyle +
    "'><thead><tr style='" +
    commonStyle +
    "'>";
  for (let i = 0; i < header.length; i++) {
    const item = header[i];
    str += "<th style='" + item.style + "'>" + item.label + "</th>";
  }
  str += "</tr></thead>";
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    str += "<tr>";
    for (let j = 0; j < header.length; j++) {
      const h = header[j];
      str += "<td style='" + h.style + "'>" + item[h.prop] + "</td>";
    }
    str += "</tr>";
  }
  return str + "</table>";
}
