export const dogovorDictionary_default = [
    { index: "0", value: "", label: "Номер счета", require: true, fieldName: "docNumber" },
    { index: "1", value: "", label: "Дата начала счета", date: true, require: true, fieldName: "check_start_date" },
    { index: "3", value: "", label: "УНП/ИНН контрагента", disabled: false, require: true, fieldName: "organisation_unp" },
    { index: "4", value: "", label: "Фамилия уполномоченного лица", disabled: false, require: true, fieldName: "contragent_owner_last_name", class: "capitalize" },
    { index: "5", value: "", label: "Имя уполномоченного лица", disabled: false, require: true, fieldName: "contragent_owner_name", class: "capitalize" },
    { index: "6", value: "", label: "Отчество уполномоченного лица", disabled: false, require: true, fieldName: "contragent_owner_second_name", class: "capitalize" },
    { index: "7", value: "", label: "Должность уполномоченного лица", disabled: false, require: true, fieldName: "contragent_owner_job" },
];

export const commodityDictionary_default = [
    {
        index: "0",
        value: "",
        autocomplete: true,
        select: true,
        label: "Наименование товара",
        currencies: [],
        controlInput: ["product_price", "measure"],
        controlValue: "",
        fieldName: "product_name",
        require: true,
        invoice_max_qty: "",
    },
    { index: "1", value: "", label: "Единица измерения", fieldName: "measure", require: true },
    { index: "2", value: "", label: "Количество", fieldName: "product_qty", require: true },
    { index: "3", value: "", label: "Цена за ед.,", fieldName: "product_price", require: true },
    { index: "4", value: "", label: "Стоимость по количеству,", fieldName: "product_cost", require: true },
    { index: "5", value: "", label: "Ставка НДС, %", fieldName: "invoice_product_vat", require: true },
    { index: "6", value: "", label: "Сумма НДС,", fieldName: "invoice_product_vat_sum", require: true },
    { index: "7", value: "", label: "Стоимость с НДС,", fieldName: "product_cost_with_vat", require: true },
];

export const steps = [
    { index: "0", value: "1", label: "1" },
    { index: "1", value: "2", label: "2" },
];