function isHasNewRow(row) {
  return row.row_id !== "" && row.row_id !== "undefined" && typeof row.id == "undefined";
}
//判断是否有空行
export function isHasEmptyRow(tableData = []) {
  return tableData.some((item) => {
    return isHasNewRow(item);
  });
}

// 空数据的情况
export function isEmptyRow(row) {
  return isHasNewRow(row) && typeof row.orderItemId == "undefined";
}
// 新增数据并且不为空情况
export function isNewNotEmptyRow(row) {
  return isHasNewRow(row) && row.orderItemId;
}
//删除空行
export function deleteEmptyRow(tableData = []) {
  return tableData.filter((item) =>{ return !isEmptyRow(item) });
}