import { ethers } from "ethers";

export const formatCommifyUnit = (unit) => {
    return ethers.utils.commify(ethers.utils.formatUnits(unit));
}

export const commify = (unit) => {
    return ethers.utils.commify(unit);
}

export const formatUnit = (unit) => {
    return ethers.utils.formatUnits(unit);
}

export const bigNumber = (unit) => {
    return ethers.utils.parseEther(unit.toString());
}

export const rangeValidation = (number, max) => {
    return parseFloat(number) > 0 && parseFloat(number) <= parseFloat(formatUnit(max));
}

export const truncate = (string, number) => {
    if (string.length > number) string = string.substr(0, number) + "..." + string.substr(string.length - number, string.length)
    return string
}

