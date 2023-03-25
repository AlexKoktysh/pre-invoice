import axios from "axios";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTAyOTIxMjEsIkFwcGxpY2F0aW9uIjoiUnVrb3ZvZGl0ZWwifQ.tdUIEg-hrhP2dRQHL1r6x3raC2GZ8qu0utwrTC8zUBk";

const instance = axios.create({
    baseURL: `https://portal.liloo.by/api/services/invoice/`,
    headers: {
        Authorization : `Bearer ${token}`,
    },
});
const instance_commodity = axios.create({
    baseURL: `https://portal.liloo.by/api/services/ttn/`,
    headers: {
        Authorization : `Bearer ${token}`,
    },
});
const pre_instance = axios.create({
    baseURL: `https://portal.liloo.by/api/services/pre_invoice/`,
    headers: {
        Authorization : `Bearer ${token}`,
    },
});
instance.interceptors.response.use(
    (response) => response,
    (error) => checkError(error)
);
instance_commodity.interceptors.response.use(
    (response) => response,
    (error) => checkError(error)
);
pre_instance.interceptors.response.use(
    (response) => response,
    (error) => checkError(error)
);
const checkError = (error) => {
    if (error.response.data["ajax-errors"] !== "Произошли ошибки при валидации данных формы.") {
        return alert(error.response.data["ajax-errors"]);
    }
    alert(error.response.data["ajax-errors"]);
    return error.response.data["fail_fields"];
};

export const getDataForCreateTtn = async () => {
    const response = await instance.post("get_data_for_create", { "invoice_type": "pre_invoice" });
    return response.data;
};

export const sendTemplate = async (params) => {
    const json = {...params};
    const response = await pre_instance.post("fill_template", json);
    if (response.data) {
        return response.data;
    }
    return {type: "error", field: response};
};

export const sendCommodityDictionary = async (params) => {
    const json = {...params};
    const response = await instance.post("add_position", json);
    return response.status === 200;
};

export const showSection = async (section) => {
    const response = await instance.post("show_section", { "position": section, "invoice_type": "pre_invoice" });
    return response;
};

export const deleteSection = async (section) => {
    const response = await instance.post("remove_position", { "position": section, "invoice_type": "pre_invoice" });
    return { status: response.status === 200, "message": response.data["ajax-response"] };
};

export const updateCommodityDictionary = async (params) => {
    const json = {...params};
    await instance.post("update_section", json);
};

export const getCommodityDictionary = async (searchText) => {
    const response = await instance_commodity.post("get_commodity_dictionary",  { filter: searchText });
    return response.data;
};
export const addSample = async (params) => {
    const json = {...params};
    const response = await pre_instance.post("create", json);
    return response.data;
};