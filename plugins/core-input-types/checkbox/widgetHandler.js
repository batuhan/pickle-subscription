const handleConfig = {
    priceHandler(data, config){
        return (data && data.value && config.pricing) ? config.pricing.value : 0;
    },
    validator(data, config){
        if(config.value.indexOf(data.value) < 0){
            return `Selected value: ${  data.value  } not a valid choice`
        }
        return true;
    }
};

module.exports = handleConfig;