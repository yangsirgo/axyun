

export function handlerName(nameString) {
  if (nameString) {
    if (nameString.length > 8) {
      return nameString.slice(0, 8) + "...";
    } else {
      return nameString;
    }
  }
  return "";
}
