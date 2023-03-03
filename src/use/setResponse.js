export const setResponseMapper = (items, response) => {
    const result = items?.map((element) => setResponse_custom(element, response));
    return result;
};
export const changeLabel = (items, value) => {
    const result = items?.map((element) => {
        const element_name = element.fieldName;
        switch (element_name) {
            case "product_price":
                return {...element, label: `${element.label} ${value}`};
            case "product_cost":
                return {...element, label: `${element.label} ${value}`};
            case "invoice_product_vat_sum":
                return {...element, label: `${element.label} ${value}`};
            case "product_cost_with_vat":
                return {...element, label: `${element.label} ${value}`};
            default:
                return element;
        }
    });
    return result;
};

const setResponse_custom = (element, response) => {
    const element_name = element.fieldName;
    switch (element_name) {
        case "docNumber":
            return getLabel(element, response?.docNumber);
        case "doc_number":
            return getCurrencies(element, response?.dogovorDictionary, true, "doc_number", response?.dogovorDictionary);
        case "product_name":
            return getCurrencies(element, response?.commodityDictionary, true, "product_name", response?.commodityOptions);
        default:
            return element;
    }
};
const getCurrencies = (element, response, isControl, label, control_response) => {
    const isArray = Array.isArray(response);
    const mapEntity = response && !isArray ? Object.values(response) : response || [];
    return {
        ...element,
        currencies: mapEntity?.map((el, index) => {
            return { index: index, label: label ? el[label] : el, invoice_max_qty: el.ttnProductQty || "" };
        }) || [],
        controlValue: isControl ? control_response : "",
    };
};
const getLabel = (element, response) => {
    return {
        ...element,
        value: response || ""
    };
};