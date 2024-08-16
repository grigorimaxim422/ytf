export const langs = [
  { label: "English", value: "en" },
  { label: "Dutch", value: "nl" },
  { label: "Portuguese", value: "pt" },
  { label:"한국어", value:"kr" }
];

export const clean = (obj: any) => {
  for (let propName in obj) {
    if (
      obj[propName] === "" ||
      obj[propName] === null ||
      obj[propName] === undefined
    ) {
      delete obj[propName];
    }
  }
  return obj;
};
