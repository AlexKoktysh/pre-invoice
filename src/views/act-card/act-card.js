import { useState, useEffect } from "react";
import Form from "../../components/FormControl/form-control.js";
import "./act-card.scss";
import TextFieldControl from "../../components/TextfieldControl/text-field-control.js";
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import { TextField } from "@mui/material";

function ActCard(props) {
    const [step, setStep] = useState("1");
    const [delivery, setDelivery] = useState(props.delivery);
    const [localPosition, setLocalPosition] = useState(props.productPosition_active);
    const [labelDeliv, setLabelDeliv] = useState(props.labelDeliv);
    
    const [currencyCode, setCurrencyCode] = useState(props.currencyCode.find((el) => el.checked)?.value || "");
    const [templateView, setTemplateView] = useState(props.templateView.find((el) => el.checked)?.value || "");
    const [organisationTypes_id, setOrganisationTypes_id] = useState(props.organisationTypes_id.find((el) => el.checked)?.value || "");
    
    const changeTemplateView = (val) => {
        setTemplateView(val);
        props.changeCheckbox(val, "template_view")
    };
    const changeOrganisationTypes_id = (val) => {
        setOrganisationTypes_id(val);
        props.changeCheckbox(val, "organisation_types");
    };
    const changeCurrencyCode = (val) => {
        setCurrencyCode(val);
        val !== currencyCode && props.changeCheckbox(val, "currency");
    };
    
    useEffect(() => {
        setCurrencyCode(props.currencyCode.find((el) => el.checked)?.value || "");
    }, [props.currencyCode]);
    useEffect(() => {
        setLocalPosition(props.productPosition_active);
    }, [props.productPosition_active]);
    useEffect(() => {
        setLabelDeliv(props.labelDeliv);
    }, [props.labelDeliv]);

    const changeStep = (value) => {
        setStep(value);
    };
    const changePosition = (value) => {
        props.changeProductPosition_active(Number(value));
    };
    const changeDelivery = (value) => {
        setDelivery(value);
    };
    useEffect(() => {
        delivery && props.changeDelivery(delivery);
    });
    useEffect(() => {
        step && props.changeStep(step);
    });
    const change = (changeItem, value) => {
        props.updatedItems(changeItem, value);
    };
    const addProduct = (item, value) => {
        props.addProduct(item, value);
    };
    const changeDate = (label, value) => {
        props.changeDate(label, value);
    };
    const listItems = props.items?.map((item) =>
        !item.header
            ? <TextFieldControl commodityDictionary={props.commodityDictionary} item={item} key={item.index} change={change} addProduct={addProduct} changeDate={changeDate} getNewCurrencies={props.getNewCurrencies} />
            : <div key={item.index} className="header">{item.header}</div>
    );

    return (
        <div id="card">
            {step === "1" && <Form label="Вид шаблона" value={templateView} items={props.templateView} change={changeTemplateView} />}
            {step === "1" && <Form label="Тип организации" value={organisationTypes_id} items={props.organisationTypes_id} change={changeOrganisationTypes_id} />}
            <div className="form">
                {step === "2" && <Form label="Позиция" value={localPosition} items={props.productPosition} change={changePosition} />}
                {listItems}
                {step === "1" && <Form label="Вид валюты" value={currencyCode} items={props.currencyCode} change={changeCurrencyCode} />}
                {step === "1" && props.typesDelivery && <Box sx={{ mb: 2 }}><Form label="Выберите вид поставки" value={delivery} items={props.typesDelivery} change={changeDelivery} /></Box>}
                {step === "1" && labelDeliv && <Box sx={{ mb: 2 }}><TextField size="small" label={labelDeliv} onChange={props.changeValueDelivery} value={props.valueDelivery} /></Box>}
                {step === "2"
                    &&
                    <Box sx={{ mb: 4, mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <Button onClick={props.addCommodityDictionary} disabled={!props.isShowAddCommodityDictionary} color="secondary" variant="contained">Добавить</Button>
                        <Button onClick={props.deleteCommodityDictionary} color="secondary" variant="contained">Удалить</Button>
                    </Box>
                }
                <Form label="Заполняемая секция" value={step} items={props.resSteps} change={changeStep} />
                <Box sx={{ mb: 4, mt: 4 }}>
                    <Button onClick={props.clickSample} disabled={!props.isShowSample} color="secondary" variant="contained">Заполнить шаблон</Button>
                </Box>
                <Box sx={{ mb: 4 }}>
                    <Button disabled={!props.showAddButton} onClick={props.clickAdd} color="secondary" variant="contained">Создать</Button>
                </Box>
            </div>
        </div>
    );
}

export default ActCard;