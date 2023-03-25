import moment from "moment";

const capitalize = (text) => {
    return text.replace(/\b\w/g , function(m) { return m.toUpperCase() });
}

export const changeDogovorDictionary_result_custom = (element) => {
    switch (element.fieldName) {
        case "doc_number":
            const field_name = element.currencies?.find((el) => el.label === element.value)?.label || "";
            return { fieldName: element.fieldName, value: field_name };
        case "check_start_date":
            const date = moment(element.value, "YYYY-MM-DD").format("DD.MM.YYYY")
            return { fieldName: element.fieldName, value: date };
        case "doc_start_date":
            const date_new = moment(element.value, "YYYY-MM-DD").format("DD.MM.YYYY")
            return { fieldName: element.fieldName, value: date_new };
        case "contragent_owner_last_name":
            return {fieldName: element.fieldName, value: capitalize(element.value)};
        case "contragent_owner_name":
            return {fieldName: element.fieldName, value: capitalize(element.value)};
        case "contragent_owner_second_name":
            return {fieldName: element.fieldName, value: capitalize(element.value)};
        default:
            return {fieldName: element.fieldName, value: element.value};
    }
};

export const changeCommodity = (response, fieldName, parenValue, commodityDictionary, currency) => {
    const obj = Object.values(response?.commodityDictionary);
    const findItem = obj.find((el) => el.product_name === parenValue);
    let item = null;
    if (findItem) {
        item = obj.find((el) => el.product_name === parenValue)[fieldName];
        if (fieldName === "product_price") {
            const price = item ? item[currency] : "";
            return price ? `${price}` : "";
        }
        return item ? `${item}` : "";
    }
    return "";
};