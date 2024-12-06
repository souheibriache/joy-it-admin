export const wordToDots = (content: string, length: number) =>
  content.length < length ? content : content.slice(0, length) + "...";

export const formatTimeStamp = (timeStamp: Date) => {
  const dateTimeStamp = new Date(timeStamp);
  const today = new Date();
  const isToday =
    dateTimeStamp.getDate() === today.getDate() &&
    dateTimeStamp.getMonth() === today.getMonth() &&
    dateTimeStamp.getFullYear() === today.getFullYear();

  return isToday
    ? dateTimeStamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : `${dateTimeStamp.toLocaleDateString()} ${dateTimeStamp.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}`;
};

export const serializeQuery = (obj: any, prefix = ""): string => {
  const str = [];
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const prefixedKey = prefix ? `${prefix}[${key}]` : key;

      if (typeof value === "object" && !Array.isArray(value)) {
        str.push(serializeQuery(value, prefixedKey)); // Recursively serialize objects
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => {
          str.push(
            `${encodeURIComponent(prefixedKey)}[${i}]=${encodeURIComponent(v)}`
          );
        });
      } else {
        str.push(
          `${encodeURIComponent(prefixedKey)}=${encodeURIComponent(value)}`
        );
      }
    }
  }
  return str.join("&");
};
