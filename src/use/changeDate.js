export const changeDate_custom = (itemsMap, label, value, setFunction) => {
    const results = itemsMap?.map((el) => {
        if (el.label === label) {
            return {
                ...el,
                value
            };
        }
        return el;
    });
    setFunction(results);
};