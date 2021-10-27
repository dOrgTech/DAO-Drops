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

export const truncate = (string) => {
    if (string.length > 11) string = string.substr(0, 6) + "..." + string.substr(string.length - 4, string.length)
    return string
}

