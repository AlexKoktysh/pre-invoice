import { useEffect, useState, useMemo } from "react";
import ActCard from "../act-card/act-card.js";
import {
    getDataForCreateTtn,
    sendTemplate,
    sendCommodityDictionary,
    showSection,
    deleteSection,
    getCommodityDictionary,
    updateCommodityDictionary,
} from "../../api/api";
import {
    dogovorDictionary_default,
    commodityDictionary_default,
    templateViewField,
    steps,
} from "../../constants/index.js";
import "./main-screen.scss";
import moment from "moment/moment.js";
import { setResponseMapper, changeLabel } from "../../use/setResponse.js";
import { changeDate_custom } from "../../use/changeDate.js";
import {
    changeCommodity,
    changeDogovorDictionary_result_custom,
} from "../../use/change_result_custom.js";

function MainScreen() {
    const [serverResult, setServerResult] = useState([]);
    const [response, setResponse] = useState([]);
    const [step, setStep] = useState("");
    const [typesDelivery, setTypesDelivery] = useState([]);
    const [typesDelivery_server, setDelivery_server] = useState("");
    const [activeFormItems, setActiveFormItems] = useState([]);
    const [dogovorDictionary, setDogovorDictionary] = useState(dogovorDictionary_default);
    const [commodityDictionary, setCommodityDictionary] = useState(commodityDictionary_default);
    const [templateView, setTemplateView] = useState(templateViewField);
    const [isShowSample, setIsShowSample] = useState(false);
    const [isShowAddCommodityDictionary, setIsShowAddCommodityDictionary] = useState(false);
    const [commodityDictionary_result, setCommodityDictionary_result] = useState([]);
    const [productPosition, setProductPosition] = useState([{ index: 0, value: 1, label: 1 }]);
    const [productPosition_active, setProductPosition_active] = useState(1);
    const [server_commodityDictionary, setServer_commodityDictionary] = useState({});
    const [productPosition_prev, setProductPosition_prev] = useState(1);
    const [labelDeliv, setLabelDeliv] = useState("");
    const [resSteps, setResSteps] = useState(steps);
    const [valueDelivery, setValueDelivery] = useState("");
    const [currency, setCurrency] = useState(null);
    const [invoiceOrientationKinds_id, setInvoiceOrientationKinds_id] = useState();
    useEffect(() => {
        const item = templateView.find((el) => el.checked)?.value;
        const value = Number(item);
        value && setInvoiceOrientationKinds_id(value);
    }, [templateView]);
    useEffect(() => {
        const fetch = async () => {
            const response = await getDataForCreateTtn();
            setResponse(response);
        };
        fetch();
    }, []);
    useEffect(() => {
        switch (typesDelivery_server) {
            case "1":
                return setLabelDeliv("Количество дней");
            case "2":
                return setLabelDeliv("Процентов");
            default:
                return setLabelDeliv("");
        }
    }, [typesDelivery_server]);
    useEffect(() => {
        setValueDelivery("");
    }, [labelDeliv]);
    useEffect(() => {
        const fetchCommodity = async () => {
            const response = await getCommodityDictionary("");
            setServer_commodityDictionary(response);
        }
        const update = () => {
            const isAll_commodityDictionary = commodityDictionary.filter((el) => !el.value && el.require);
            if (!isAll_commodityDictionary?.length) {
                const res = commodityDictionary?.map((element) => {
                    return { fieldName: element.fieldName, value: element.value };
                });
                if (response?.hasVat === 0) {
                    res.push({ fieldName: "invoice_product_vat", value: "" });
                    res.push({ fieldName: "invoice_product_vat_sum", value: "" });
                    res.push({ fieldName: "product_cost_with_vat", value: "" });
                }
                const invoice_max_qty = commodityDictionary[0].invoice_max_qty;
                res.push({fieldName: "invoice_max_qty", value: invoice_max_qty});
                res.push({fieldName: "invoice_commodity_position", value: productPosition_prev});
                res.push({fieldName: "invoice_type", value: "pre_invoice"});
                invoice_max_qty && updateCommodityDictionary(res);
            }
        };
        const fetch = async () => {
            const response = await showSection(productPosition_active);
            const resArray = [...productPosition];
            if (response?.data?.sectionCount >= 1 && response.data.sectionCount + 1 > productPosition.length) {
                for (let i = 1; i < response.data.sectionCount + 1; i++) {
                    resArray.push({ index: i, value: i + 1, label: i + 1 })
                }
                setProductPosition(resArray);
            }
            if (response?.status === 200) {
                const newCommodityDictionary = commodityDictionary?.map((element) => {
                    const value = response.data.columns[element.fieldName];
                    if (element.fieldName === "product_name") {
                        return {...element, value: value ? value : "", invoice_max_qty: response.data.columns.invoice_max_qty || ""};
                    }
                    return {...element, value: value ? value : ""};
                });
                setCommodityDictionary(newCommodityDictionary);
            }
        };
        update();
        fetchCommodity();
        fetch();
    }, [productPosition_active]);
    const fetchCommodity = async (value) => {
        const response = await getCommodityDictionary(value);
        setServer_commodityDictionary(response);
    }
    const checkStep = (changeItem, value) => {
        switch (step) {
            case "1":
                return { setFunction: setDogovorDictionary,
                    items: dogovorDictionary,
                    funcDate: changeItem.controlValue
                                ? moment(changeItem.controlValue[value].doc_start_date, 'DD.MM.YYYY').format('YYYY-MM-DD')
                                : value,
                };
            case "2":
                return { setFunction: setCommodityDictionary, items: commodityDictionary };
            default:
                return {};
        }
    };
    const updatedItems = (changeItem, value) => {
        const field = changeItem?.controlInput ? changeItem.controlInput : changeItem.fieldName;
        const { setFunction, items, funcDate } = checkStep(changeItem, value);
        const val = !Array.isArray(changeItem.controlInput) && changeItem.controlValue ? funcDate : value;
        setFunction(items?.map((item) => {
            if (item.fieldName === field) {
                return { ...item, value: val };
            } else {
                if (item.fieldName === changeItem.fieldName) {
                    return { ...item, value}
                } else {
                    return item;
                }
            }
        }));
    };
    const getNewCurrencies = async (value) => {
        fetchCommodity(value);
    };
    const addProduct = async (item, value) => {
        const server_product = Object.values(item.controlValue);
        const product = server_product?.find((el) => el === value);
        if (product) {
            const res = commodityDictionary?.map((el) => {
                if (el.fieldName === item.fieldName) {
                    return {...el, value: product};
                } else {
                    return el;
                }
            });
            setCommodityDictionary(res);
        }
    };
    const changeCommodityDictionary = (fieldName, parenValue) => {
        if (!Object.values(server_commodityDictionary).length) {
            return;
        }
        return changeCommodity(server_commodityDictionary, fieldName, parenValue, commodityDictionary, currency);
    };
    const expensiveCalculation = (items, changeFunction, setFunction, val) => {
        const controlsInput = items[val].controlInput;
        const parent = items.find((el) => el.select);
        if (parent.value !== "") {
            const controlItems = items.filter((el) => controlsInput.find((element) => el.fieldName === element));
            const changeItems = controlItems?.map((el) => {
                return {
                    ...el,
                    value: changeFunction(el.fieldName, parent.value),
                };
            });
            const resultObj = items?.map((el) => {
                const found = changeItems.find((element) => element.index === el.index);
                if (found) return found;
                return el;
            });
            setFunction(resultObj);
        }
    };
    useMemo(() => expensiveCalculation(commodityDictionary, changeCommodityDictionary, setCommodityDictionary, 0), [commodityDictionary[0].value]);

    useMemo(() => {
        if (commodityDictionary[4].value && commodityDictionary[6]?.value) {
            const sum = Number(commodityDictionary[4].value) + Number(commodityDictionary[6].value);
            const resObj = commodityDictionary?.map((element) => {
                if (element.fieldName === "product_cost_with_vat") {
                    return {
                        ...element,
                        value: sum.toFixed(2),
                    };
                }
                return element;
            });
            setCommodityDictionary(resObj);
        }
    }, [commodityDictionary[4]?.value, commodityDictionary[6]?.value]);
    useMemo(() => {
        if (commodityDictionary[4].value && commodityDictionary[5]?.value) {
            const sum = Number(commodityDictionary[4].value) * (Number(commodityDictionary[5].value) / 100);
            const resObj = commodityDictionary?.map((element) => {
                if (element.fieldName === "invoice_product_vat_sum") {
                    return {
                        ...element,
                        value: sum.toFixed(2),
                    };
                }
                return element;
            });
            setCommodityDictionary(resObj);
        }
    }, [commodityDictionary[4].value, commodityDictionary[5]?.value]);
    useMemo(() => {
        if (commodityDictionary[2].value && commodityDictionary[3].value) {
            const sum = Number(commodityDictionary[2].value) * Number(commodityDictionary[3].value);
            const resObj = commodityDictionary?.map((element) => {
                if (element.fieldName === "product_cost") {
                    return {
                        ...element,
                        value: sum.toFixed(2),
                    };
                }
                return element;
            });
            setCommodityDictionary(resObj);
        }
    }, [commodityDictionary[2].value, commodityDictionary[3].value]);

    useEffect(() => {
        if (!server_commodityDictionary?.commodityDictionary && step !== "3") {
            return;
        }
        const isAll_commodityDictionary = commodityDictionary.filter((el) => !el.value && el.require);
        if (!isAll_commodityDictionary?.length) {
            const item =
                Object.values(server_commodityDictionary?.commodityDictionary)
                    ?.find((el) => el.product_name === commodityDictionary[0].value)?.ttnProductQty || commodityDictionary[0].invoice_max_qty;
            const res = commodityDictionary?.map((element) => {
                return { fieldName: element.fieldName, value: element.value };
            });
            if (response?.hasVat === 0) {
                res.push({ fieldName: "invoice_product_vat", value: "" });
                res.push({ fieldName: "invoice_product_vat_sum", value: "" });
                res.push({ fieldName: "product_cost_with_vat", value: "" });
            }
            res.push({fieldName: "invoice_max_qty", value: item});
            res.push({fieldName: "invoice_commodity_position", value: productPosition_active});
            res.push({fieldName: "invoice_type", value: "pre_invoice"});
            setIsShowAddCommodityDictionary(true);
            setCommodityDictionary_result(res);
            return;
        }
        setIsShowAddCommodityDictionary(false);
    }, [commodityDictionary, step]);
    useMemo(() => {
        const code = response?.defaultCurrencyCode || "";
        setCurrency(code);
    }, [response]);
    useEffect(() => {
        const typesDelivery_server = response.deliveryConditions?.map((el, index) => {
            return { index: index, label: el.label, value: index + 1 };
        });
        const dogovorDictionary_server = setResponseMapper(dogovorDictionary, response);
        setDogovorDictionary(dogovorDictionary_server);
        setTypesDelivery(typesDelivery_server);
    }, [response]);
    useEffect(() => {
        const items = changeLabel(commodityDictionary, currency);
        setCommodityDictionary(items);
    }, [currency]);
    useEffect(() => {
        const commodityDictionary_server = setResponseMapper(commodityDictionary, server_commodityDictionary);
        setCommodityDictionary(commodityDictionary_server);
    }, [server_commodityDictionary]);
    useEffect(() => {
        if (step === "1") {
            setActiveFormItems(dogovorDictionary);
        }
        if (step === "2") {
            setActiveFormItems(commodityDictionary);
        }
    }, [step, dogovorDictionary, commodityDictionary]);
    useEffect(() => {
        if (response?.hasVat === 0) {
            const commodityDictionary_server = commodityDictionary.filter((el) => {
                return el.fieldName !== "invoice_product_vat" &&  el.fieldName !== "invoice_product_vat_sum" && el.fieldName !== "product_cost_with_vat"
            });
            setCommodityDictionary(commodityDictionary_server);
        }
    }, [step]);
    useEffect(() => {
        const isAll_dogovorDictionary = dogovorDictionary.filter((el) => el.value === "" && el.require);
        const isShowDelivery = typesDelivery_server === "1" || typesDelivery_server === "2" ? !!valueDelivery : typesDelivery_server === "3";
        if (
            !isAll_dogovorDictionary.length &&
            isShowDelivery &&
            invoiceOrientationKinds_id
            ) {
                const dogovorDictionary_result = dogovorDictionary
                    .filter((el) => !el.header)
                    ?.map((element) => changeDogovorDictionary_result_custom(element));

                const delivery_conditions_id = {fieldName: "deliv_cond_id", value: typesDelivery_server};

                const delivery_conditions_value = {fieldName: "deliv_cond_value", value: valueDelivery};

                const orientationKinds_id = {fieldName: "invoiceOrientationKinds_id", value: invoiceOrientationKinds_id};
                
                const res = [
                    ...dogovorDictionary_result,
                    orientationKinds_id,
                    delivery_conditions_id,
                    delivery_conditions_value,
                ];
                setServerResult(res);
                setIsShowSample(true);
            } else {
                setIsShowSample(false);
            }
    }, [
        dogovorDictionary,
        commodityDictionary,
        typesDelivery_server,
        valueDelivery,
        invoiceOrientationKinds_id,
    ]);
    const changeTemplateView = (val) => {
        const changeItem = templateView?.map((el) => {
            if (el.value === val) {
                return {...el, checked: true};
            } else {
                return {...el, checked: false};
            }
        });
        setTemplateView(changeItem);
    };
    const clickSample = async () => {
        await sendTemplate(serverResult);
    };
    const changeDate = (label, value) => {
        switch (label) {
            case "Дата начала счета":
                return changeDate_custom(dogovorDictionary, label, value, setDogovorDictionary);
            default:
                return;
        }
    };
    const addCommodityDictionary = async () => {
        const res = await sendCommodityDictionary(commodityDictionary_result);
        if (res) {
            const newProductPosition = [
                ...productPosition,
                { index: productPosition_active, value: productPosition_active + 1, label: productPosition_active + 1 },
            ]
            setProductPosition(newProductPosition);
            setProductPosition_active(productPosition_active + 1);
        }
    };
    const deleteCommodityDictionary = async () => {
        const res = await deleteSection(productPosition_active);
        if (res) {
            setProductPosition_active(productPosition_active);
            const response = await showSection(productPosition_active);
            const resArray = [];
            for (let i = 0; i < response.data.sectionCount + 1; i++) {
                resArray.push({ index: i, value: i + 1, label: i + 1 })
            }
            if (response?.status === 200) {
                const newCommodityDictionary = commodityDictionary?.map((element) => {
                    const value = response.data.columns[element.fieldName];
                    return {...element, value: value ? value : ""};
                });
                setCommodityDictionary(newCommodityDictionary);
            }
            setProductPosition(resArray);
        }
    };
    const changeProductPosition_active = (value) => {
        setProductPosition_prev(productPosition_active);
        setProductPosition_active(value);
    };
    const changeValueDelivery = (event) => {
        setValueDelivery(event.target.value);
    };

    return (
        <div id="main-screen">
            <ActCard
                delivery={typesDelivery_server}
                changeDelivery={(deliv) => setDelivery_server(deliv)}
                changeStep={(step) => setStep(step)}
                items={activeFormItems}
                updatedItems={updatedItems}
                typesDelivery={typesDelivery}
                addProduct={addProduct}
                templateView={templateView}
                changeTemplateView={changeTemplateView}
                isShowSample={isShowSample}
                clickSample={clickSample}
                changeDate={changeDate}
                isShowAddCommodityDictionary={isShowAddCommodityDictionary}
                addCommodityDictionary={addCommodityDictionary}
                productPosition={productPosition}
                productPosition_active={productPosition_active}
                changeProductPosition_active={changeProductPosition_active}
                deleteCommodityDictionary={deleteCommodityDictionary}
                getNewCurrencies={getNewCurrencies}
                commodityDictionary={commodityDictionary}
                labelDeliv={labelDeliv}
                resSteps={resSteps}
                changeValueDelivery={changeValueDelivery}
                valueDelivery={valueDelivery}
            />
        </div>
    );
}

export default MainScreen;