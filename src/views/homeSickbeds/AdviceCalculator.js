funciton calculatQty(advice,adviceItem){
    const { type,} = advice;//长期 = "1"; 临时 = "2"; 出院带药 = "3";
    const { roundingMode } = adviceItem;// 1.总量取整；2.单次取整；3.不取整
    if(roundingMode === 1){
        if(type === 1){
            return round_total_longterm(advice,adviceItem);
        }else if(type === 2){
            return round_total_disposable(advice,adviceItem);
        }else if(type === 3){
            return round_total_takedrug(advice,adviceItem);
        }
    }else if(roundingMode === 2){
        if(type === 1){
            return round_single_longterm(advice,adviceItem);
        }else if(type === 2){
            return round_single_disposable(advice,adviceItem);
        }else if(type === 3){
            return round_single_takedrug(advice,adviceItem);
        }
    }else if(roundingMode === 3){
        if(type === 1){
            return round_never_longterm(advice,adviceItem);
        }else if(type === 2){
            return round_never_longterm(advice,adviceItem);
        }else if(type === 3){
            return round_never_longterm(advice,adviceItem);
        }
    }
}
function round_total_longterm(advice,adviceItem){//总量取整 长期医嘱
    const { onceDosage,unit,useDay,freqTimes} = advice;
    const { pkgMeasure,pkgUnit,limitUnit,dosageMeasure} = adviceItem;
    if( unit === pkgUnit) throw new Error('按总量取整时，长期医嘱只允许选择最小单位'); 
    let onceCount =  Math.ceil(onceDosage/dosageMeasure);
    return useDay * freqTimes * onceCount;
}
    
function round_total_disposable(advice,adviceItem){//总量取整 临时医嘱
    const { onceDosage,unit,useDay,freqTimes} = advice;
    const { pkgMeasure,pkgUnit,limitUnit,dosageMeasure,dismountable} = adviceItem;
    let onceCount =  Math.ceil(onceDosage/dosageMeasure);
    if(dismountable){
        if(unit === limitUnit)return useDay * freqTimes * onceCount; 
        else return Math.ceil(useDay * freqTimes * onceCount/pkgMeasure);
    }else{
        if(unit === limitUnit)throw new Error('药品不可拆零，只能选择包装单位'); 
        else return Math.ceil(useDay * freqTimes * onceCount/pkgMeasure);
    }  
}
function round_total_takedrug(advice,adviceItem){//总量取整 取药医嘱
    const { onceDosage,unit,useDay,freqTimes} = advice;
    const { pkgMeasure,pkgUnit,limitUnit,dosageMeasure} = adviceItem;
    let total = Math.ceil((useDay * freqTimes * onceDosage)/dosageMeasure);
    if(dismountable){//可拆零
        if(unit === limitUnit)return total;
        else return Math.ceil(total/pkgMeasure);
    }else{//不可拆零
        if(unit === limitUnit)throw new Error('药品不可拆零，只能选择包装单位'); 
        else return Math.ceil(total/pkgMeasure);
    }  
}

function round_single_longterm(advice,adviceItem){//单次取整 长期医嘱
    const { onceDosage,unit,useDay,freqTimes} = advice;
    const { pkgMeasure,pkgUnit,limitUnit,dosageMeasure} = adviceItem;
    if( unit === pkgUnit) throw new Error('按单次取整时，长期医嘱只允许选择最小单位'); 
    let onceCount =  Math.ceil(onceDosage/dosageMeasure);
    return useDay * freqTimes * onceCount;
}
function round_single_disposable(advice,adviceItem){//单次取整 临时医嘱
    const { onceDosage,unit,useDay,freqTimes} = advice;
    const { pkgMeasure,pkgUnit,limitUnit,dosageMeasure} = adviceItem;
    let onceCount =  Math.ceil(onceDosage/dosageMeasure);
    if(dismountable){
        if(unit === limitUnit)return useDay * freqTimes * onceCount; 
        else return Math.ceil(useDay * freqTimes * onceCount/pkgMeasure);
    }else{
        if(unit === limitUnit)throw new Error('药品不可拆零，只能选择包装单位'); 
        else return Math.ceil(useDay * freqTimes * onceCount/pkgMeasure);
    }  
}
function round_single_takedrug(advice,adviceItem){//单次取整 取药医嘱
    const { onceDosage,unit,useDay,freqTimes} = advice;
    const { pkgMeasure,pkgUnit,limitUnit,dosageMeasure} = adviceItem;
    let onceCount =  Math.ceil(onceDosage/dosageMeasure);
    if(dismountable){
        if(unit === limitUnit)return useDay * freqTimes * onceCount; 
        else return Math.ceil(useDay * freqTimes * onceCount/pkgMeasure);
    }else{
        if(unit === limitUnit)throw new Error('药品不可拆零，只能选择包装单位'); 
        else return Math.ceil(useDay * freqTimes * onceCount/pkgMeasure);
    }  
}

function round_never_longterm(advice,adviceItem){//不取整 长期医嘱
    const { onceDosage,unit,useDay,freqTimes} = advice;
    const { pkgMeasure,pkgUnit,limitUnit,dosageMeasure} = adviceItem;
    if( unit === pkgUnit) throw new Error('按总量取整时，长期医嘱只允许选择最小单位'); 
    //return Math.ceil((useDay * freqTimes * onceDosage)/(pkgMeasure*dosageMeasure));
    return (useDay * freqTimes * onceDosage)/dosageMeasure;
}
function round_never_disposable(advice,adviceItem){//不取整 临时医嘱
    const { onceDosage,unit,useDay,freqTimes} = advice;
    const { pkgMeasure,pkgUnit,limitUnit,dosageMeasure} = adviceItem;
    if( unit === pkgUnit) throw new Error('按总量取整时，长期医嘱只允许选择最小单位'); 
    else return (useDay * freqTimes * onceDosage)/dosageMeasure;
}
function round_never_takedrug(advice,adviceItem){//不取整 取药医嘱
    const { onceDosage,unit,useDay,freqTimes} = advice;
    const { pkgMeasure,pkgUnit,limitUnit,dosageMeasure} = adviceItem;
    if( unit === pkgUnit) throw new Error('按总量取整时，长期医嘱只允许选择最小单位'); 
    else return (useDay * freqTimes * onceDosage)/dosageMeasure;
}